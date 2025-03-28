package bg.stream_mates.backend.feather.user.repositories;

import bg.stream_mates.backend.feather.user.models.entities.Friend;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FriendRepository extends JpaRepository<Friend, UUID> {

    @Query(value = """
        SELECT f.* FROM friends f
        JOIN user_friends uf ON uf.friend_id = f.id
        WHERE uf.user_id = :userId
        """, nativeQuery = true)
    List<Friend> findFriendsByUserId(@Param("userId") UUID userId);

    Optional<Friend> findByUsername(String username);

    Optional<Friend> findByRealUserId(UUID myId);
}

