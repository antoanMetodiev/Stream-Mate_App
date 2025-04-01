package bg.stream_mates.backend.feather.series.dtos;

import bg.stream_mates.backend.commonData.enums.ImageType;
import bg.stream_mates.backend.resolver.CustomObjectResolver;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
        property = "id",
        resolver = CustomObjectResolver.class
)
public class SeriesImage {

    private UUID id;

    private ImageType imageType;

    @Size(min = 5)
    private String imageURL;

    private Series series;
}
