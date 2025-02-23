package bg.stream_mates.backend.feather.user.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.URL;

import java.util.UUID;

@Entity
@Table(name = "friends")
@Data
@Accessors(chain = true)
public class Friend {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "profile_image_url")
    @URL
    private String profileImageURL;
}
