package bg.stream_mates.backend.feather.user.repositories;

import bg.stream_mates.backend.feather.user.models.entities.UserImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserImageRepository extends JpaRepository<UserImage, UUID> {
    List<UserImage> findByOwnerId(UUID id);
}
