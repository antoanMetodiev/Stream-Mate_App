package bg.stream_mates.backend.feather.user.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.URL;

import java.util.UUID;

@Entity
@Table(name = "user_images")
@Data
@Accessors(chain = true)
public class UserImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "image_url", nullable = false)
    @URL
    private String image_url;

    @ManyToOne
    private User owner;
}
