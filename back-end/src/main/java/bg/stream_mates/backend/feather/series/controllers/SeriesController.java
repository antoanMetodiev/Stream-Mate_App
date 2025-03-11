package bg.stream_mates.backend.feather.series.controllers;

import bg.stream_mates.backend.commonData.dtos.CinemaRecRequestDto;
import bg.stream_mates.backend.commonData.dtos.CinemaRecordResponse;
import bg.stream_mates.backend.feather.series.models.Series;
import bg.stream_mates.backend.feather.series.services.SeriesService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
public class SeriesController {
    private final SeriesService seriesService;

    public SeriesController(SeriesService cinemaRecService) {
        this.seriesService = cinemaRecService;
    }

    @GetMapping("/get-next-thirty-series")
    public Page<CinemaRecordResponse> getEveryThirtySeries(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) {

        System.out.println("Requested page: " + page + ", size: " + size); // Дебъгване
        Pageable pageable = PageRequest.of(page, size);
        return seriesService.getEveryThirtySeries(pageable);
    }

    @GetMapping("/get-series-details")
    public Series getConcreteSeriesDetails(@RequestParam String id) {
        Series series = this.seriesService.getConcreteSeriesDetails(UUID.fromString(id));
        System.out.println();
        return series;
    }

    @GetMapping("/get-series-by-title")
    public List<Series> getSeriesByTitle(@RequestParam String title) {
        return this.seriesService.getSeriesByTitle(title);
    }

    @GetMapping("/get-all-series-count")
    public long getAllSeriesCount()  {
        return this.seriesService.getAllSeriesCount();
    }

    @PostMapping("/search-series")
    public void searchSeries(@RequestBody CinemaRecRequestDto cinemaRecRequestDto) throws IOException, InterruptedException {
        this.seriesService.searchForSeries(cinemaRecRequestDto.getRecordName());
    }
}
