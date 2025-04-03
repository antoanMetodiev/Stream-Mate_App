package bg.stream_mates.backend.feather.movies.controllers;

import bg.stream_mates.backend.commonData.dtos.CinemaRecRequestDto;
import bg.stream_mates.backend.commonData.dtos.CinemaRecordResponse;
import bg.stream_mates.backend.feather.movies.client.MovieClient;
import bg.stream_mates.backend.feather.movies.models.dtos.MovieComment;
import bg.stream_mates.backend.feather.movies.models.dtos.PostCommentRequest;
import bg.stream_mates.backend.feather.movies.models.entities.Movie;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class MovieController {

    private final MovieClient movieClient;

    @Autowired
    public MovieController(MovieClient movieClient) {
        this.movieClient = movieClient;
    }

    @DeleteMapping("/delete-movie-comment")
    public void deleteMovieComment(@RequestParam String commentId,
                                   @RequestParam String movieId) {

        this.movieClient.deleteMovieComment(commentId, movieId);
    }

    @GetMapping("/get-next-10-movie-comments")
    public List<MovieComment> getNext10Comments(@RequestParam int order,
                                                @RequestParam String currentCinemaRecordId) {

        List<MovieComment> next10Comments = this.movieClient.getNext10Comments(order, currentCinemaRecordId);
        return next10Comments;
    }

    @PostMapping("/post-movie-comment")
    public void postComment(@RequestBody @Valid PostCommentRequest postCommentRequest) {
        String authorUsername = postCommentRequest.getAuthorUsername();
        String authorFullName = postCommentRequest.getAuthorFullName();
        String authorImgURL = postCommentRequest.getAuthorImgURL();
        String commentText = postCommentRequest.getCommentText();
        String createdAt = postCommentRequest.getCreatedAt();
        String movieId = postCommentRequest.getCinemaRecordId();
        String authorId = postCommentRequest.getAuthorId();
        double rating = postCommentRequest.getRating();

        this.movieClient.postComment(authorUsername, authorFullName,
                authorImgURL, commentText, rating, createdAt, authorId, movieId);
    }

    @GetMapping("/get-searched-movies-count")
    public long getSearchedMoviesCount(@RequestParam String title) {
        return this.movieClient.getSearchedMoviesCount(title);
    }

    @GetMapping("/get-movies-count-by-genre")
    public long findMoviesCountByGenre(@RequestParam String receivedGenre) {
        String genres = receivedGenre;
        return this.movieClient.findMoviesCountByGenre(genres);
    }

    @GetMapping("/get-next-twenty-movies-by-genre")
    public List<CinemaRecordResponse> getNextTwentyMoviesByGenre(@RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "20") int size,
                                                                 @RequestParam String receivedGenre) {

        return this.movieClient.getNextTwentyMoviesByGenre(page, size, receivedGenre);  // Предаваме жанра и Pageable на сървиса
    }

    @GetMapping("/get-next-thirty-movies")
    public List<CinemaRecordResponse> getEveryThirtyMovies(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) {

        List<CinemaRecordResponse> everyThirtyMovies = this.movieClient.getEveryThirtyMovies(page, size);
        return everyThirtyMovies;
    }

    @GetMapping("/get-movies-by-title")
    public List<Movie> getMoviesByTitle(@RequestParam String title) {
        if (title == null || title.trim().isEmpty()) return new ArrayList<Movie>();

        List<Movie> moviesByTitle = this.movieClient.getMoviesByTitle(title);
        return moviesByTitle;
    }

    @GetMapping("/get-movie-details")
    public Movie getConcreteMovieDetails(@RequestParam String id) {
        if (id == null || id.trim().isEmpty()) return new Movie();
        Movie movie = this.movieClient.getConcreteMovieDetails(id);
        return movie;
    }

    @PostMapping("/search-movies")
    public void searchMovies(@RequestBody @Valid CinemaRecRequestDto cinemaRecRequestDto) throws IOException, InterruptedException {
        this.movieClient.searchMovies(cinemaRecRequestDto.getRecordName());
    }

    @GetMapping("/get-all-movies-count")
    public long getAllMoviesCount() {
        return this.movieClient.getAllMoviesCount();
    }
}
