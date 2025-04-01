package bg.stream_mates.backend.feather.movies.dtos;

import bg.stream_mates.backend.commonData.CinemaRecord;
import bg.stream_mates.backend.commonData.dtos.Actor;
import bg.stream_mates.backend.resolver.CustomObjectResolver;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Accessors(chain = true)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        resolver = CustomObjectResolver.class
)
public class Movie extends CinemaRecord {

    private UUID id;

    private List<Actor> castList = new ArrayList<>();

    private String videoURL;

    private List<MovieImage> imagesList = new ArrayList<>();

    public void addAllImages(List<MovieImage> allImages) {
        allImages.forEach(image -> image.setMovie(this));
        this.getImagesList().addAll(allImages);
    }
}