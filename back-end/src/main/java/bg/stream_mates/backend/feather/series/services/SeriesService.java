package bg.stream_mates.backend.feather.series.services;

import bg.stream_mates.backend.commonData.dtos.CinemaRecordResponse;
import bg.stream_mates.backend.commonData.entities.Actor;
import bg.stream_mates.backend.commonData.enums.ImageType;
import bg.stream_mates.backend.commonData.repositories.ActorRepository;
import bg.stream_mates.backend.commonData.utils.UtilMethods;
import bg.stream_mates.backend.feather.movies.models.entities.Movie;
import bg.stream_mates.backend.feather.movies.models.entities.MovieImage;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Slf4j
@Service
public class SeriesService {
    private final HttpClient httpClient;
    private final String TMDB_API_KEY = System.getenv("TMDB_API_KEY");
    private final String TMDB_BASE_URL = System.getenv("TMDB_BASE_URL");

    private final SeriesRepository seriesRepository;
    private final ActorRepository actorRepository;
    private final SeriesImageRepository seriesImageRepository;

    private final TransactionTemplate transactionTemplate;
    private final Executor asyncExecutor;

    @Autowired
    public SeriesService(SeriesRepository seriesRepository,
                         ActorRepository actorRepository,
                         SeriesImageRepository seriesImageRepository,
                         HttpClient httpClient,
                         TransactionTemplate transactionTemplate,
                         Executor asyncExecutor) {

        this.httpClient = httpClient;
        this.seriesRepository = seriesRepository;
        this.actorRepository = actorRepository;
        this.seriesImageRepository = seriesImageRepository;
        this.transactionTemplate = transactionTemplate;
        this.asyncExecutor = asyncExecutor;
    }

    @Async
    public CompletableFuture<Void> searchForSeries(String seriesName) {
        if (seriesName.trim().isEmpty()) return new CompletableFuture<Void>();

        return CompletableFuture.supplyAsync(() -> {
            try {
                String searchQuery = TMDB_BASE_URL + "/3/search/tv?api_key=" + TMDB_API_KEY + "&query="
                        + seriesName.replace(" ", "%20");

                HttpRequest request = HttpRequest.newBuilder().uri(URI.create(searchQuery)).build();
                HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);
                    JsonArray resultsArray = jsonObject.getAsJsonArray("results");

                    for (JsonElement jsonElement : resultsArray) {
                        JsonObject jsonObj = jsonElement.getAsJsonObject();

                        Series series = new Series();

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
                        if (LocalDate.parse(releaseDate).getYear() < 2000) continue;
                        if (seriesRating.equals("0.0")) continue;

                        UtilMethods utilMethods = new UtilMethods();
                        String castURL = TMDB_BASE_URL + "/3/tv/" + seriesID + "/credits" + "?api_key=" + TMDB_API_KEY;

                        // Стартираме асинхронни операции:
                        CompletableFuture<List<Actor>> asyncActors = utilMethods.extractActors(
                                castURL, this.httpClient, TMDB_BASE_URL, TMDB_API_KEY, asyncExecutor);
                        CompletableFuture<Boolean> extractImages = extractImagesAsync(seriesID, series);
                        CompletableFuture<Boolean> extractedSeasons = extractSeasonsAsync(seriesID, series);

                        // Изчакваме резултатите
                        List<Actor> actors = asyncActors.get();
                        if (actors.isEmpty()) continue;
                        if (!extractImages.get()) continue;
                        if (!extractedSeasons.get()) continue;
                        addAllCast(actors, series);

                        // Запазвам крайният обект
                        series.setTitle(title).setDescription(description)
                                .setReleaseDate(releaseDate).setBackgroundImg_URL(backgroundIMG).setPosterImgURL(posterIMG)
                                .setTmdbRating(seriesRating).setSearchTag(seriesName);

                        saveSeries(title, posterIMG, series);  // Запазвам крайният обект...
                    }
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }, asyncExecutor);
    }

    @Async
    public CompletableFuture<Boolean> extractImagesAsync(String seriesID, Series series) {
        String searchQuery = TMDB_BASE_URL + "/3/tv/" + seriesID + "/images?api_key=" + TMDB_API_KEY;
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(searchQuery)).build();

        return CompletableFuture.supplyAsync(() -> {
            try {
                HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);
                    JsonArray backdropsJsonAr = jsonObject.getAsJsonArray("backdrops");
                    JsonArray postersJsonAr = jsonObject.getAsJsonArray("posters");

                    CompletableFuture<List<SeriesImage>> allBackdropImgsFuture = extractDetailsImages(backdropsJsonAr, ImageType.BACKDROP, 29);
                    CompletableFuture<List<SeriesImage>> allPosterImages = extractDetailsImages(postersJsonAr, ImageType.POSTER, 8);

                    List<SeriesImage> allImages = new ArrayList<>();
                    allImages.addAll(allBackdropImgsFuture.get());
                    allImages.addAll(allPosterImages.get());

                    if (allImages.size() < 8) return false;
                    series.addAllImages(allImages);
                }

            } catch (Exception exception) {
                exception.printStackTrace();
            }

            return true;
        }, asyncExecutor);
    }

    @Async
    public CompletableFuture<List<SeriesImage>> extractDetailsImages(JsonArray backdropsJsonAr, ImageType imageType, int limit) {
        List<SeriesImage> backdropImages = new ArrayList<>();

        int count = 0;
        for (JsonElement jsonElement : backdropsJsonAr) {
            SeriesImage image = new SeriesImage();

            if (imageType.equals(ImageType.BACKDROP)) image.setImageType(ImageType.BACKDROP);
            else image.setImageType(ImageType.POSTER);

            backdropImages.add(image.setImageURL(jsonElement.getAsJsonObject().get("file_path")
                    .getAsString()));

            if (count++ == limit) break;
        }

        return CompletableFuture.completedFuture(backdropImages);
    }

    @Async
    public CompletableFuture<Boolean> extractSeasonsAsync(String seriesID, Series series) {
        return CompletableFuture.supplyAsync(() -> {
            String searchQuery = TMDB_BASE_URL + "/3/tv/" + seriesID + "?api_key=" + TMDB_API_KEY;
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(searchQuery)).build();

            try {
                HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);
                    JsonArray allSeasons = jsonObject.getAsJsonArray("seasons");

                    StringBuilder genres = new StringBuilder();
                    jsonObject.getAsJsonArray("genres").forEach(genre -> {
                        genres.append(genre.getAsJsonObject().get("name")).append(",");
                    });

                    if (genres.length() > 1) genres.setCharAt(genres.length() - 1, '.');
                    series.setGenres(genres.toString());

                    for (JsonElement season : allSeasons) {
                        JsonObject jsonObj = season.getAsJsonObject();
                        String airDate = UtilMethods.getJsonValue(jsonObj, "air_date");
                        String seasonNumber = UtilMethods.getJsonValue(jsonObj, "season_number");

                        if (airDate.trim().isEmpty()) continue;
                        if (LocalDate.parse(airDate).isAfter(LocalDate.now())) continue;
                        if (seasonNumber.equals("0")) continue;
                        extractSeasonDetails(seriesID, seasonNumber, series).join();
                    }
                }

            } catch (Exception exception) {
                log.error("e: ", exception);
            }

            return true;
        }, asyncExecutor);
    }

    @Async
    public CompletableFuture<Boolean> extractSeasonDetails(String seriesID, String seasonNumber, Series series) {
        return CompletableFuture.supplyAsync(() -> {
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

                    series.addAllEpisodes(allSeasonEpisodes);
                    return true;
                }

            } catch (Exception exception) {
                log.error("e: ", exception);
            }

            return false;
        }, asyncExecutor);
    }

    @Retryable(maxAttempts = 2)
    public void saveSeries(String cinemaRecTitle, String cinemaRecPosterImage, Series series) {
        transactionTemplate.execute(status -> {
            Optional<Series> cinemaRecResponse = this.seriesRepository.findByTitleAndPosterImgURL(cinemaRecTitle, cinemaRecPosterImage);
            if (cinemaRecResponse.isEmpty()) {
                // "Присвояваме" актьорите към текущата сесия
                List<Actor> managedActors = new ArrayList<>();
                for (Actor actor : series.getCastList()) {
                    if (actor.getId() != null) {
                        // Ако актьорът вече е в базата, зареждаме го отново
                        Actor managedActor = this.actorRepository.findById(actor.getId()).orElse(actor);
                        managedActors.add(managedActor);
                    } else {
                        // Ако няма ID, значи е нов – го запазваме, за да получим ID и управляван екземпляр
                        managedActors.add(this.actorRepository.save(actor));
                    }
                }
                series.setCastList(managedActors);
                this.seriesRepository.save(series);
            }
            return null;
        });
    }

    @Retryable(maxAttempts = 2)
    public void addAllCast(List<Actor> allCast, Series series) {
        transactionTemplate.execute(status -> {
            int count = 0;

            for (Actor actor : allCast) {
                Optional<Actor> existingActor = this.actorRepository
                        .findByNameInRealLifeAndImageURL(actor.getNameInRealLife(), actor.getImageURL());

                if (existingActor.isPresent()) {
                    actor = existingActor.get();
                }

                // Добавяме връзката между актьора и филма
                if (!series.getCastList().contains(actor)) {
                    series.getCastList().add(actor);
                }

                // Добавяме филма към списъка на актьора
                if (!actor.getSeriesParticipations().contains(series)) {
                    actor.getSeriesParticipations().add(series);
                }

                if (count++ == 20) return true;
            }

            return true;
        });
    }

    @Retryable(maxAttempts = 2)
    public Page<CinemaRecordResponse> getEveryThirtySeries(Pageable pageable) {
        List<Object[]> rawData = seriesRepository.getThirthySeriesRawData(pageable);
        List<CinemaRecordResponse> dtos = rawData.stream().map(obj ->
                new CinemaRecordResponse(
                        (UUID) obj [0],
                        (String) obj[1],  // title
                        (String) obj[2],  // posterImgURL
                        (String) obj[3]   // releaseDate
                )
        ).toList();

        return new PageImpl<>(dtos, pageable, dtos.size());
    }

    @Retryable(maxAttempts = 2)
    public long getAllSeriesCount() {
        return this.seriesRepository.count();
    }

    @Retryable(maxAttempts = 2)
    public Series getConcreteSeriesDetails(UUID seriesId) {
        return this.seriesRepository.findById(seriesId).orElseThrow();
    }

    public List<Series> getSeriesByTitle(String title) {
        return this.seriesRepository.findByTitleOrSearchTagContainingIgnoreCase(title);
    }
}