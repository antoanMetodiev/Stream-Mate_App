package bg.stream_mates.backend.feather.user.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.URL;

import java.util.UUID;

@Entity
@Table(name = "friends")
@Data
@Builder
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
public class Friend {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "profile_image_url")
    @URL
    private String profileImageURL;

    @Column(name = "real_user_id", nullable = false, unique = true)
    private UUID realUserId;
}
