package bg.stream_mates.backend.feather.series.models;

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
@Table(name = "series_images")
@Entity
public class SeriesImage {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "image_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ImageType imageType;

    @Column(name = "image_url", nullable = false)
    @Size(min = 5)
    private String imageURL;

    @ManyToOne
    @JoinColumn(name = "series_id", nullable = false)
    @JsonBackReference
    private Series series;  // Или Series, в зависимост от контекста
}
