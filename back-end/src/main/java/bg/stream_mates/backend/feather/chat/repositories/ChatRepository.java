package bg.stream_mates.backend.feather.chat.repositories;

import bg.stream_mates.backend.feather.chat.models.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Message, UUID> {
}
