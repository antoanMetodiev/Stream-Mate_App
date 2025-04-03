package bg.stream_mates.backend.feather.movies.client;

import bg.stream_mates.backend.commonData.dtos.CinemaRecordResponse;
import bg.stream_mates.backend.config.FeignConfig;
import bg.stream_mates.backend.feather.movies.models.dtos.MovieComment;
import bg.stream_mates.backend.feather.movies.models.entities.Movie;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@FeignClient(name = "stream-mate-movie-svc", url = "thoughtless-nikki-stream-mate-movies-org-d2cf5d62.koyeb.app", configuration = FeignConfig.class)
@FeignClient(name = "stream-mate-movie-svc", url = "http://localhost:8081", configuration = FeignConfig.class)
public interface MovieClient {

    @PostMapping("/post-movie-comment")
    void postComment(
            @RequestParam String authorUsername,
            @RequestParam String authorFullName,
            @RequestParam String authorImgURL,
            @RequestParam String commentText,
            @RequestParam double rating,
            @RequestParam String createdAt,
            @RequestParam String authorId,
            @RequestParam String movieId);


    @GetMapping("/get-next-thirty-movies")
    List<CinemaRecordResponse> getEveryThirtyMovies(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size);

    @GetMapping("/get-movies-by-title")
    List<Movie> getMoviesByTitle(@RequestParam String title);

    @GetMapping("/get-movie-details")
    Movie getConcreteMovieDetails(@RequestParam String id);

    @PostMapping("/search-movies")
    void searchMovies(@RequestBody String title);

    @GetMapping("/get-all-movies-count")
    long getAllMoviesCount();

    @GetMapping("/get-next-twenty-movies-by-genre")
    List<CinemaRecordResponse> getNextTwentyMoviesByGenre(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "20") int size,
                                                          @RequestParam String receivedGenre);

    @GetMapping("/get-movies-count-by-genre")
    long findMoviesCountByGenre(@RequestParam String genres);

    @GetMapping("/get-searched-movies-count")
    long getSearchedMoviesCount(@RequestParam String title);

    @GetMapping("/get-next-10-movie-comments")
    List<MovieComment> getNext10Comments(@RequestParam int order, @RequestParam String currentCinemaRecordId);

    @DeleteMapping("/delete-movie-comment")
    void deleteMovieComment(@RequestParam String commentId,
                            @RequestParam String movieId);
}
