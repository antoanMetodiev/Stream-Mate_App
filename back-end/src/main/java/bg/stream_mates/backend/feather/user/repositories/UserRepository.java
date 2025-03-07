package bg.stream_mates.backend.feather.user.repositories;

import bg.stream_mates.backend.feather.user.models.entities.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsernameAndEmail(String username, String email);
    Optional<User> findByUsername(String username);

    @Query(value =
            "SELECT username, profile_image_url, first_name, last_name " +
                    "FROM users ORDER BY id DESC LIMIT 10",
            nativeQuery = true)
    List<Object[]> findLastTenUsers();


    @Query(value = "SELECT u.username, u.profile_image_url, u.first_name, u.last_name " +
            "FROM users u " +
            "WHERE u.username ILIKE CONCAT('%', :pattern, '%') " +
            "OR u.first_name ILIKE CONCAT('%', :pattern, '%') " +
            "OR u.last_name ILIKE CONCAT('%', :pattern, '%')",
            nativeQuery = true)
    List<Object[]> searchUsersByPattern(@Param("pattern") String pattern);
}
