package bg.stream_mates.backend.feather.movies.dtos;

import bg.stream_mates.backend.commonData.enums.ImageType;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.UUID;

@Getter
@Setter
@Accessors(chain = true)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class MovieImage {

    private UUID id;

    @Enumerated(EnumType.STRING)
    private ImageType imageType;

    @Size(min = 5)
    private String imageURL;

    private Movie movie;  // Или Series, в зависимост от контекста
}
