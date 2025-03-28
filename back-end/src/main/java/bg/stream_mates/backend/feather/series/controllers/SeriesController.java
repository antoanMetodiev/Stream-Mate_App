package bg.stream_mates.backend.feather.series.controllers;

import bg.stream_mates.backend.commonData.dtos.CinemaRecRequestDto;
import bg.stream_mates.backend.commonData.dtos.CinemaRecordResponse;
import bg.stream_mates.backend.feather.movies.models.dtos.PostCommentRequest;
import bg.stream_mates.backend.feather.series.client.SeriesClient;
import bg.stream_mates.backend.feather.series.models.Series;
import bg.stream_mates.backend.feather.series.models.SeriesComment;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
public class SeriesController {

    private final SeriesClient seriesClient;

    @Autowired
    public SeriesController(SeriesClient seriesClient) {
        this.seriesClient = seriesClient;
    }

    @DeleteMapping("/delete-series-comment")
    public void deleteSeriesComment(@RequestParam String commentId,
                                   @RequestParam String movieId) {

        this.seriesClient.deleteSeriesComment(commentId, movieId);
    }

    @GetMapping("/get-next-10-series-comments")
    public List<SeriesComment> getNext10SeriesComments(@RequestParam int order,
                                                       @RequestParam String currentCinemaRecordId) {

        return this.seriesClient.getNext10SeriesComments(order, currentCinemaRecordId);
    }

    @PostMapping("/post-series-comment")
    public void postComment(@RequestBody @Valid PostCommentRequest postCommentRequest) {
        String authorUsername = postCommentRequest.getAuthorUsername();
        String authorFullName = postCommentRequest.getAuthorFullName();
        String authorImgURL = postCommentRequest.getAuthorImgURL();
        String commentText = postCommentRequest.getCommentText();
        double rating = postCommentRequest.getRating();
        String createdAt = postCommentRequest.getCreatedAt();
        String authorId = postCommentRequest.getAuthorId();
        String movieId = postCommentRequest.getCinemaRecordId();

        this.seriesClient.postComment(authorUsername, authorFullName, authorImgURL,
                commentText, rating, createdAt, authorId, movieId);
    }


    @GetMapping("/get-series-count-by-genre")
    public long findMoviesCountByGenre(@RequestParam String receivedGenre) {
        String genres = receivedGenre;
        return this.seriesClient.findSeriesCountByGenre(receivedGenre);
    }

    @GetMapping("/get-next-twenty-series-by-genre")
    public List<CinemaRecordResponse> getNextTwentySeriesByGenre(@RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "20") int size,
                                                                 @RequestParam String receivedGenre) {

        return this.seriesClient.getNextTwentySeriesByGenre(page, size, receivedGenre);
    }

    @GetMapping("/get-searched-series-count")
    public long getSearchedSeriesCount(@RequestParam String title) {
        return this.seriesClient.getSearchedSeriesCount(title);
    }

    @GetMapping("/get-series-by-title")
    public List<Series> getSeriesByTitle(@RequestParam String title) {
        List<Series> seriesByTitle = this.seriesClient.getSeriesByTitle(title);
        return seriesByTitle;
    }

    @GetMapping("/get-next-thirty-series")
    public List<CinemaRecordResponse> getEveryThirtySeries(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) {

        return seriesClient.getEveryThirtySeries(page, size);
    }

    @GetMapping("/get-series-details")
    public Series getConcreteSeriesDetails(@RequestParam String id) {
        return this.seriesClient.getConcreteSeriesDetails(id);
    }

    @GetMapping("/get-all-series-count")
    public long getAllSeriesCount()  {
        return this.seriesClient.getAllSeriesCount();
    }

    @PostMapping("/search-series")
    public void searchSeries(@RequestBody CinemaRecRequestDto cinemaRecRequestDto) throws IOException, InterruptedException {
        this.seriesClient.searchSeries(cinemaRecRequestDto.getRecordName());
    }
}
