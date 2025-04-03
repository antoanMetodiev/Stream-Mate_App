package bg.stream_mates.backend.feather.series.client;

import bg.stream_mates.backend.commonData.dtos.CinemaRecordResponse;
import bg.stream_mates.backend.config.FeignConfig;
import bg.stream_mates.backend.feather.series.models.Series;
import bg.stream_mates.backend.feather.series.models.SeriesComment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

//@FeignClient(name = "stream-mate-series-svc", url = "https://rich-babs-stream-mate-series-9d8a10c3.koyeb.app", configuration = FeignConfig.class)
@FeignClient(name = "stream-mate-series-svc", url = "http://localhost:8082", configuration = FeignConfig.class)
public interface SeriesClient {

    @GetMapping("/get-next-thirty-series")
    List<CinemaRecordResponse> getEveryThirtySeries(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size);

    @GetMapping("/get-series-details")
    Series getConcreteSeriesDetails(@RequestParam("id") String id);

    @GetMapping("/get-all-series-count")
    long getAllSeriesCount();

    @PostMapping("/search-series")
    void searchSeries(@RequestParam String title);

    @GetMapping("/get-series-by-title")
    List<Series> getSeriesByTitle(@RequestParam("title") String title);

    @GetMapping("/get-searched-series-count")
    long getSearchedSeriesCount(@RequestParam String title);

    @GetMapping("/get-series-count-by-genre")
    long findSeriesCountByGenre(@RequestParam String genres);

    @GetMapping("/get-next-twenty-series-by-genre")
    List<CinemaRecordResponse> getNextTwentySeriesByGenre(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "20") int size,
                                                          @RequestParam String receivedGenre);

    @DeleteMapping("/delete-series-comment")
    void deleteSeriesComment(@RequestParam String commentId,
                             @RequestParam String movieId);

    @GetMapping("/get-next-10-series-comments")
    List<SeriesComment> getNext10SeriesComments(@RequestParam int order,
                                                @RequestParam String currentCinemaRecordId);

    @PostMapping("/post-series-comment")
    void postComment(@RequestParam String authorUsername,
                     @RequestParam String authorFullName,
                     @RequestParam String authorImgURL,
                     @RequestParam String commentText,
                     @RequestParam double rating,
                     @RequestParam String createdAt,
                     @RequestParam String authorId,
                     @RequestParam String movieId);
}
