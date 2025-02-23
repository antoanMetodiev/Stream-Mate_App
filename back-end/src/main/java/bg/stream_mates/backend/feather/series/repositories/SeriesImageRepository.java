package bg.stream_mates.backend.feather.series.repositories;

import bg.stream_mates.backend.feather.series.models.SeriesImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SeriesImageRepository extends JpaRepository<SeriesImage, UUID> {
}
