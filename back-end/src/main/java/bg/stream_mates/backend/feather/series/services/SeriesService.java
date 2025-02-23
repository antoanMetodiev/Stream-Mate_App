package bg.stream_mates.backend.feather.series.services;

import bg.stream_mates.backend.feather.commonData.entities.Actor;
import bg.stream_mates.backend.feather.commonData.enums.ImageType;
import bg.stream_mates.backend.feather.commonData.repositories.ActorRepository;
import bg.stream_mates.backend.feather.commonData.utils.UtilMethods;
import bg.stream_mates.backend.feather.movies.models.entities.Movie;
import bg.stream_mates.backend.feather.series.models.Episode;
import bg.stream_mates.backend.feather.series.models.Series;
import bg.stream_mates.backend.feather.series.models.SeriesImage;
import bg.stream_mates.backend.feather.series.repositories.SeriesImageRepository;
import bg.stream_mates.backend.feather.series.repositories.SeriesRepository;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class SeriesService {
    private final HttpClient httpClient;
    private final String TMDB_API_KEY = System.getenv("TMDB_API_KEY");
    private final String TMDB_BASE_URL = System.getenv("TMDB_BASE_URL");

    private Series series;
    private final SeriesRepository seriesRepository;
    private final ActorRepository actorRepository;
    private final SeriesImageRepository seriesImageRepository;

    @Autowired
    public SeriesService(SeriesRepository seriesRepository,
                         ActorRepository actorRepository,
                         SeriesImageRepository seriesImageRepository,
                         HttpClient httpClient) {

        this.httpClient = httpClient;
        this.seriesRepository = seriesRepository;
        this.actorRepository = actorRepository;
        this.seriesImageRepository = seriesImageRepository;
        this.series = new Series(); // this will need manage by me!
    }

    public void searchForSeries(String movieName) {
        String searchQuery = TMDB_BASE_URL + "/3/search/tv?api_key=" + TMDB_API_KEY + "&query="
                + movieName.replace(" ", "%20");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(searchQuery))
                .build();

        try {
            HttpResponse<String> response = this.httpClient
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);
                JsonArray resultsArray = jsonObject.getAsJsonArray("results");

                for (JsonElement jsonElement : resultsArray) {
                    JsonObject jsonObj = jsonElement.getAsJsonObject();

                    String seriesID = UtilMethods.getJsonValue(jsonObj, "id");
                    String title = UtilMethods.getJsonValue(jsonObj, "name");
                    String description = UtilMethods.getJsonValue(jsonObj, "overview");
                    String releaseDate = UtilMethods.getJsonValue(jsonObj, "first_air_date");
                    String backgroundIMG = UtilMethods.getJsonValue(jsonObj, "backdrop_path");
                    String posterIMG = UtilMethods.getJsonValue(jsonObj, "poster_path");
                    String seriesRating = UtilMethods.getJsonValue(jsonObj, "vote_average");

                    if (posterIMG.trim().isEmpty()) continue;
                    if (releaseDate.trim().isEmpty()) continue;
                    if (LocalDate.parse(releaseDate).isAfter(LocalDate.now())) continue;

                    this.series.setTitle(title).setDescription(description)
                            .setReleaseDate(releaseDate).setBackgroundImg_URL(backgroundIMG).setPosterImgURL(posterIMG)
                            .setTmdbRating(seriesRating).setSearchTag(movieName);

                    String castURL = TMDB_BASE_URL + "/3/tv/" + seriesID + "/credits" + "?api_key=" + TMDB_API_KEY;
                    extractSeasons(seriesID);

                    // ACTOR:
                    this.addAllCast(UtilMethods.extractActors(castURL, this.httpClient, TMDB_BASE_URL, TMDB_API_KEY));
                    extractImages(seriesID);

                    saveSeries(title, posterIMG);  // Запазвам крайният обект...
                }

            } else {
                System.out.println("Request failed with status code: " + response.statusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void extractImages(String seriesID) {
        // https://api.themoviedb.org/3/tv/{tv_id}/images?api_key=YOUR_API_KEY
        String searchQuery = TMDB_BASE_URL + "/3/tv/" + seriesID + "/images?api_key=" + TMDB_API_KEY;
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(searchQuery))
                .build();

        try {
            HttpResponse<String> response = this.httpClient
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);
                JsonArray backdropsJsonAr = jsonObject.getAsJsonArray("backdrops");
                JsonArray postersJsonAr = jsonObject.getAsJsonArray("posters");

                List<SeriesImage> allImages =  extractDetailsImages(backdropsJsonAr, ImageType.BACKDROP);
                allImages.addAll(extractDetailsImages(postersJsonAr, ImageType.POSTER));
                this.series.addAllImages(allImages);

            } else {
                System.out.println("Something is wrong with extractSeriesImages method, men!");
            }
        } catch (Exception exception) {
            System.out.println(exception);
        }
    }

    private static List<SeriesImage> extractDetailsImages(JsonArray backdropsJsonAr, ImageType imageType) {
        List<SeriesImage> backdropImages = new ArrayList<>();

        int count = 0;
        for (JsonElement jsonElement : backdropsJsonAr) {
            SeriesImage image = new SeriesImage();

            if (imageType.equals(ImageType.BACKDROP)) image.setImageType(ImageType.BACKDROP);
            else image.setImageType(ImageType.POSTER);

            backdropImages.add(image.setImageURL(jsonElement.getAsJsonObject().get("file_path")
                    .getAsString()));

            if (count++ == 30) break;
        }
        return backdropImages;
    }

    private void extractSeasons(String seriesID) {
        String searchQuery = TMDB_BASE_URL + "/3/tv/" + seriesID + "?api_key=" + TMDB_API_KEY;
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(searchQuery)).build();

        try {
            HttpResponse<String> response =
                    this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);
                JsonArray allSeasons = jsonObject.getAsJsonArray("seasons");

                StringBuilder genres = new StringBuilder();
                jsonObject.getAsJsonArray("genres").forEach(genre -> {
                    genres.append(genre.getAsJsonObject().get("name")).append(",");
                });

                if (genres.length() > 1) genres.setCharAt(genres.length() - 1, '.');
                this.series.setGenres(genres.toString());

                for (JsonElement season : allSeasons) {
                    JsonObject jsonObj = season.getAsJsonObject();

                    String airDate = UtilMethods.getJsonValue(jsonObj, "air_date");
                    String seasonNumber = UtilMethods.getJsonValue(jsonObj, "season_number");

                    if (airDate.trim().isEmpty()) continue;
                    if (LocalDate.parse(airDate).isAfter(LocalDate.now())) continue;
                    if (seasonNumber.equals("0")) continue;

                    extractSeasonDetails(seriesID, seasonNumber);
                }

            } else {
                System.out.println("SOMETHING IS WRONG WITH  extractSeriesDetails  REQUEST!");
            }

        } catch (Exception exception) {
            log.error("e: ", exception);
        }
    }

    private void extractSeasonDetails(String seriesID, String seasonNumber) {
        String searchQuery = TMDB_BASE_URL + "/3/tv/" + seriesID + "/season/" + seasonNumber + "?api_key=" + TMDB_API_KEY;
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(searchQuery)).build();

        try {
            HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);
                JsonArray seasonEpisodes = jsonObject.getAsJsonArray("episodes");

                List<Episode> allSeasonEpisodes = new ArrayList<>();
                for (JsonElement el : seasonEpisodes) {
                    JsonObject episode = el.getAsJsonObject();

                    String episodeTitle = UtilMethods.getJsonValue(episode, "name");
                    String airDate = UtilMethods.getJsonValue(episode, "air_date");
                    String runtime = UtilMethods.getJsonValue(episode, "runtime");
                    String thumbnailIMG = UtilMethods.getJsonValue(episode, "still_path");
                    String description = UtilMethods.getJsonValue(episode, "overview");
                    String seasonNum = UtilMethods.getJsonValue(episode, "season_number");
                    String episodeNumber = UtilMethods.getJsonValue(episode, "episode_number");
                    String tmdbRating = UtilMethods.getJsonValue(episode, "vote_average");

                    if (airDate.trim().isEmpty()) continue;
                    if (LocalDate.parse(airDate).isAfter(LocalDate.now())) continue;
                    String VidURL = "https://vidsrc.net/embed/tv/" + seriesID + "/" + seasonNum + "/" + episodeNumber;

                    allSeasonEpisodes.add(new Episode().setPosterImgURL(thumbnailIMG).setEpisodeTitle(episodeTitle)
                            .setSeason(seasonNum).setEpisodeNumber(episodeNumber)
                            .setAirDate(airDate).setDescription(description).setRuntime(runtime)
                            .setTmdbRating(tmdbRating).setVideoURL(VidURL));
                }

                this.series.addAllEpisodes(allSeasonEpisodes);

            } else {
                System.out.println("Request Problem at extractSeasonDetails() !");
            }
        } catch (Exception exception) {
            log.error("e: ", exception);
        }
    }

    private void saveSeries(String cinemaRecTitle, String cinemaRecPosterImage) {
        Optional<Series> cinemaRecResponse = this.seriesRepository
                .findByTitleAndPosterImgURL(cinemaRecTitle, cinemaRecPosterImage);

        if (cinemaRecResponse.isEmpty()) {
            this.seriesRepository.save(this.series);
        }
        this.series = new Series();
    }

    private void addAllCast(List<Actor> allCast) {
        for (Actor actor : allCast) {
            Optional<Actor> existingActor = this.actorRepository
                    .findByNameInRealLifeAndImageURL(actor.getNameInRealLife(), actor.getImageURL());

            if (existingActor.isPresent()) {
                actor = existingActor.get();
            } else {
                this.actorRepository.save(actor);
            }

            // Добавяме връзката между актьора и серията
            actor.getSeriesParticipations().add(this.series);
            this.series.getCastList().add(actor);
        }
    }

    public List<Series> getSeries(String seriesName) {
        return this.seriesRepository.findByTitleOrSearchTagContainingIgnoreCase(seriesName);
    }
}