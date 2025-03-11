package bg.stream_mates.backend.feather.series.repositories;

import bg.stream_mates.backend.commonData.dtos.CinemaRecordResponse;
import bg.stream_mates.backend.feather.movies.models.entities.Movie;
import bg.stream_mates.backend.feather.series.models.Series;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SeriesRepository extends JpaRepository<Series, UUID> {
    Optional<Series> findByTitle(String movieName);

    Optional<Series> findByTitleAndPosterImgURL(String cinemaRecTitle, String cinemaRecPosterImage);

    @Query(value = "SELECT * FROM series WHERE LOWER(title) LIKE LOWER(CONCAT('%', :seriesName, '%'))" +
            " OR LOWER(search_tag) LIKE LOWER(CONCAT('%', :seriesName, '%'))", nativeQuery = true)
    List<Series> findByTitleOrSearchTagContainingIgnoreCase(String seriesName);

    @Query(value = "SELECT id, title, poster_img_url, release_date FROM series", nativeQuery = true)
    List<Object[]> getThirthySeriesRawData(Pageable pageable);
}
