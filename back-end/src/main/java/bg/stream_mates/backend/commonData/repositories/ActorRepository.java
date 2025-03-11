package bg.stream_mates.backend.commonData.repositories;

import bg.stream_mates.backend.commonData.entities.Actor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActorRepository extends JpaRepository<Actor, UUID> {
    Optional<Actor> findByNameInRealLifeAndImageURL(String nameInRealLife, String imageURL);
}
