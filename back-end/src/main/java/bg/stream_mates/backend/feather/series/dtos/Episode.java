package bg.stream_mates.backend.feather.series.dtos;

import bg.stream_mates.backend.resolver.CustomObjectResolver;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
public class Episode {

    private UUID id;

    private String videoURL;

    private String posterImgURL;

    private String episodeTitle;

    private String airDate;

    private String description;

    private String runtime;

    private String tmdbRating;

    private String season;

    private String episodeNumber;

    private Series series;
}
