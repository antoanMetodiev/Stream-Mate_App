package bg.stream_mates.backend.feather.movies.services;

import bg.stream_mates.backend.feather.commonData.entities.Actor;
import bg.stream_mates.backend.feather.commonData.enums.ImageType;
import bg.stream_mates.backend.feather.commonData.repositories.ActorRepository;
import bg.stream_mates.backend.feather.commonData.utils.UtilMethods;
import bg.stream_mates.backend.feather.movies.models.entities.Movie;
import bg.stream_mates.backend.feather.movies.models.entities.MovieImage;
import bg.stream_mates.backend.feather.movies.repositories.MovieRepository;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class MovieService {
    private final String TMDB_API_KEY = System.getenv("TMDB_API_KEY");
    private final String TMDB_BASE_URL = System.getenv("TMDB_BASE_URL");

    private Movie movie;
    private final HttpClient httpClient;
    private final ActorRepository actorRepository;
    private final MovieRepository movieRepository;

    @Autowired
    public MovieService(HttpClient httpClient, ActorRepository actorRepository, MovieRepository movieRepository) {
        this.httpClient = httpClient;
        this.actorRepository = actorRepository;
        this.movieRepository = movieRepository;
        this.movie = new Movie(); // this will manage by me!
    }

    public void searchForMovies(String movieName) {
        if (movieName.trim().isEmpty()) return;  // ако са написали просто празен стринг!

        try {
            String encodedMovieName = URLEncoder.encode(movieName, "UTF-8");
            String searchQuery = TMDB_BASE_URL + "/3/search/movie?api_key=" + TMDB_API_KEY + "&query=" + encodedMovieName;

            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(searchQuery)).build();
            HttpResponse<String> response = this.httpClient
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);
                JsonArray results = jsonObject.get("results").getAsJsonArray();

                for (JsonElement movie : results) {
                    jsonObject = movie.getAsJsonObject();

                    String movieId = UtilMethods.getJsonValue(jsonObject, "id");
                    String title = UtilMethods.getJsonValue(jsonObject, "title");
                    String description = UtilMethods.getJsonValue(jsonObject, "overview");
                    String releaseDate = UtilMethods.getJsonValue(jsonObject, "release_date");
                    String backgroundIMG = UtilMethods.getJsonValue(jsonObject, "backdrop_path");
                    String posterIMG = UtilMethods.getJsonValue(jsonObject, "poster_path");
                    String movieRating = UtilMethods.getJsonValue(jsonObject, "vote_average");

                    // Checks:
                    if (posterIMG.trim().isEmpty()) continue;
                    if (releaseDate.trim().isEmpty()) continue;
                    if (LocalDate.parse(releaseDate).isAfter(LocalDate.now())) continue;
                    if (LocalDate.parse(releaseDate).getYear() < 2000) continue;
                    if (movieRating.equals("0.0")) continue;

                    String VidURL = "https://vidsrc.net/embed/movie/" + movieId;
                    String castURL = TMDB_BASE_URL + "/3/movie/" + movieId + "/credits" + "?api_key=" + TMDB_API_KEY;

                    // ACTOR:
                    List<Actor> actors = UtilMethods.extractActors(castURL, this.httpClient, TMDB_BASE_URL, TMDB_API_KEY);
                    if (actors.isEmpty()) continue;
                    if (!extractImages(movieId)) continue;
                    if (!extractGenresAndTagline(movieId, encodedMovieName)) continue;

                    this.addAllCast(actors);
                    // Запазвам крайният обект:
                    this.movie.setVideoURL(VidURL).setSearchTag(movieName).setTitle(title).setDescription(description)
                            .setReleaseDate(releaseDate).setBackgroundImg_URL(backgroundIMG)
                            .setPosterImgURL(posterIMG).setTmdbRating(movieRating);

                    saveMovie(title, posterIMG);  // save:
                }

            } else {
                System.out.println("Request failed with status code: " + response.statusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean extractGenresAndTagline(String movieId, String encodedMovieName) {
        // https://api.themoviedb.org/3/movie/27205?api_key=259fb543d446e4acac861dad6ab91408
        String searchQuery = TMDB_BASE_URL + "/3/movie/" + movieId + "?api_key=" + TMDB_API_KEY;

        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(searchQuery)).build();

        try {
            HttpResponse<String> response = this.httpClient
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);

                String specialText = UtilMethods.getJsonValue(jsonObject, "tagline");

                JsonElement genres = jsonObject.get("genres");
                StringBuilder genresString = new StringBuilder();

                genres.getAsJsonArray().forEach(genre -> {
                    genresString.append(UtilMethods.getJsonValue(genre.getAsJsonObject(), "name")).append(",");
                });

                if (genresString.isEmpty()) return false;

                this.movie.setSpecialText(specialText).setGenres(genresString.toString());
            }

        } catch (Exception exception) {
            System.out.println(exception.getMessage());
        }

        return true;
    }

    public boolean extractImages(String movieId) {
        // https://api.themoviedb.org/3/tv/{tv_id}/images?api_key=YOUR_API_KEY
        String searchQuery = TMDB_BASE_URL + "/3/movie/" + movieId + "/images?api_key=" + TMDB_API_KEY;
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(searchQuery))
                .build();

        try {
            HttpResponse<String> response = this.httpClient
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonObject jsonObject = new Gson().fromJson(response.body(), JsonObject.class);
                JsonArray backdropsJsonAr = jsonObject.getAsJsonArray("backdrops");
                JsonArray postersJsonAr = jsonObject.getAsJsonArray("posters");

                List<MovieImage> allImages = extractDetailsImages(backdropsJsonAr, ImageType.BACKDROP, 29);
                if (allImages.size() < 8) return false;

                allImages.addAll(extractDetailsImages(postersJsonAr, ImageType.POSTER, 8));

                this.movie.addAllImages(allImages);

            } else {
                System.out.println("Something is wrong with extractSeriesImages method, men!");
            }
        } catch (Exception exception) {
            System.out.println(exception);
        }

        return true;
    }

    private static List<MovieImage> extractDetailsImages(JsonArray backdropsJsonAr, ImageType imageType, int limit) {
        List<MovieImage> backdropImages = new ArrayList<>();

        int count = 0;
        for (JsonElement jsonElement : backdropsJsonAr) {
            MovieImage image = new MovieImage();

            if (imageType.equals(ImageType.BACKDROP)) image.setImageType(ImageType.BACKDROP);
            else image.setImageType(ImageType.POSTER);

            backdropImages.add(image.setImageURL(jsonElement.getAsJsonObject().get("file_path")
                    .getAsString()));

            if (count++ == limit) break;
        }
        return backdropImages;
    }

    private void saveMovie(String cinemaRecTitle, String cinemaRecPosterImage) {
        Optional<Movie> cinemaRecResponse = this.movieRepository
                .findByTitleAndPosterImgURL(cinemaRecTitle, cinemaRecPosterImage);

        if (cinemaRecResponse.isEmpty()) {
            this.movieRepository.save(this.movie);
        }
        this.movie = new Movie();
    }

    private void addAllCast(List<Actor> allCast) {

        System.out.println();
        for (Actor actor : allCast) {
            Optional<Actor> existingActor = this.actorRepository
                    .findByNameInRealLifeAndImageURL(actor.getNameInRealLife(), actor.getImageURL());

            if (existingActor.isPresent()) {
                actor = existingActor.get();
            } else {
                this.actorRepository.save(actor);
            }

            // Добавяме връзката между актьора и филма:
            // Проверяваме дали актьорът вече е добавен в castList, за да не го добавяме повече от веднъж
            if (!this.movie.getCastList().contains(actor)) {
                this.movie.getCastList().add(actor);
            }

            // Добавяме филма към списъка на актьора
            if (!actor.getMoviesParticipations().contains(this.movie)) {
                actor.getMoviesParticipations().add(this.movie);
            }
        }
    }

    public List<Movie> getMovies(String movieName) {
        return this.movieRepository.findByTitleOrSearchTagContainingIgnoreCase(movieName);
    }
}
