package bg.stream_mates.backend.feather.movies.repositories;

import bg.stream_mates.backend.feather.movies.models.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID> {
    Optional<Movie> findByTitleAndPosterImgURL(String cinemaRecTitle, String cinemaRecPosterImage);

    @Query(value = "SELECT * FROM movies WHERE LOWER(title) LIKE LOWER(CONCAT('%', :movieName, '%'))" +
            " OR LOWER(search_tag) LIKE LOWER(CONCAT('%', :movieName, '%'))", nativeQuery = true)
    List<Movie> findByTitleOrSearchTagContainingIgnoreCase(@Param("movieName") String movieName);
}
