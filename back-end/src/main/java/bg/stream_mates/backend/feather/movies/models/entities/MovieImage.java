package bg.stream_mates.backend.feather.movies.models.entities;

import bg.stream_mates.backend.commonData.enums.ImageType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.UUID;

@Getter
@Setter
@Accessors(chain = true)
@Table(name = "movies_images")
@Entity
public class MovieImage {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "image_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ImageType imageType;

    @Column(name = "image_url", nullable = false)
    @Size(min = 5)
    private String imageURL;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;  // Или Series, в зависимост от контекста
}
