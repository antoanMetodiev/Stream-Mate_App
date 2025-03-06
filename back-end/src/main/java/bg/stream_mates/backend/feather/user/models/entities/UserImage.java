package bg.stream_mates.backend.feather.user.models.entities;

import bg.stream_mates.backend.feather.user.models.enums.UserImageType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.URL;

import java.util.UUID;

@Entity
@Table(name = "user_images")
@Data
@Accessors(chain = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "image_url", nullable = false)
    @URL
    private String image_url;

    @Column
    @Enumerated(EnumType.STRING)
    private UserImageType userImageType;

    @Column
    private String description;

    @ManyToOne
    @JsonBackReference
    private User owner;
}
