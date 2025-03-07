package bg.stream_mates.backend.feather.user.repositories;

import bg.stream_mates.backend.feather.user.models.entities.FriendRequest;
import bg.stream_mates.backend.feather.user.models.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, UUID> {
    boolean existsBySenderAndReceiver(User sender, User receiver);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM friend_requests " +
            "WHERE sender_username = :senderUsername " +
            "AND receiver_username = :receiverUsername",
            nativeQuery = true)
    void deleteBySenderUsernameAndReceiverUsername(String senderUsername, String receiverUsername);
}
