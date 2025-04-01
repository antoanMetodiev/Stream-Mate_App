package bg.stream_mates.backend.feather.chat.repositories;

import bg.stream_mates.backend.feather.chat.models.entities.Message;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Message, UUID> {

    @Query(value = """
    SELECT * FROM messages 
    WHERE (owner_id = :myId AND receiver_id = :friendId) 
       OR (owner_id = :friendId AND receiver_id = :myId) 
    ORDER BY created_on ASC
    """, nativeQuery = true)
    List<Message> getMessagesWithFriend(@Param("myId") UUID myId, @Param("friendId") UUID friendId);
}
