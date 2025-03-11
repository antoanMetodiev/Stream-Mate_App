package bg.stream_mates.backend.feather.movies.controllers;

import bg.stream_mates.backend.commonData.dtos.CinemaRecRequestDto;
import bg.stream_mates.backend.commonData.dtos.CinemaRecordResponse;
import bg.stream_mates.backend.feather.movies.models.entities.Movie;
import bg.stream_mates.backend.feather.movies.services.MovieService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
public class MovieController {
    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/get-movie-details")
    public Movie getConcreteMovieDetails(@RequestParam String id) {
        Movie movie = this.movieService.getConcreteMovieDetails(UUID.fromString(id));
        System.out.println();
        return movie;
    }

    @GetMapping("/get-movies-by-title")
    public List<Movie> getMoviesByTitle(@RequestParam String title) {
        return this.movieService.getMoviesByTitle(title);
    }

    @GetMapping("/get-next-thirty-movies")
    public Page<CinemaRecordResponse> getEveryThirtyMovies(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) {

        System.out.println("Requested page: " + page + ", size: " + size); // Дебъгване
        Pageable pageable = PageRequest.of(page, size);
        return movieService.getEveryThirtyMovies(pageable);
    }

    @PostMapping("/search-movies")
    public String searchMovies(@RequestBody @Valid CinemaRecRequestDto cinemaRecRequestDto) throws IOException, InterruptedException {
        this.movieService.searchForMovies(cinemaRecRequestDto.getRecordName());
        return "";
    }

    @GetMapping("get-all-movies-count")
    public long getAllMoviesCount()  {
        return this.movieService.getAllMoviesCount();
    }
}
