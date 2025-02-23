package bg.stream_mates.backend.feather.series.controllers;

import bg.stream_mates.backend.feather.commonData.dtos.CinemaRecRequestDto;
import bg.stream_mates.backend.feather.series.models.Series;
import bg.stream_mates.backend.feather.series.services.SeriesService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
public class SeriesController {
    private final SeriesService seriesService;

    public SeriesController(SeriesService cinemaRecService) {
        this.seriesService = cinemaRecService;
    }

    @CrossOrigin(origins = "http://localhost:5173") // Позволява заявки от localhost:5173
    @PostMapping("/search-series")
    public void searchSeries(@RequestBody CinemaRecRequestDto cinemaRecRequestDto) throws IOException, InterruptedException {
        this.seriesService.searchForSeries(cinemaRecRequestDto.getRecordName());
    }

    @CrossOrigin(origins = "http://localhost:5173") // Позволява заявки от localhost:5173
    @PostMapping("/get-series")
    public List<Series> getSeries(@RequestBody CinemaRecRequestDto cinemaRecRequestDto) throws IOException, InterruptedException {
        return this.seriesService.getSeries(cinemaRecRequestDto.getRecordName());
    }
}
