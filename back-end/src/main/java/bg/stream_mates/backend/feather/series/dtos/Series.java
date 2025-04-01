package bg.stream_mates.backend.feather.series.dtos;

import bg.stream_mates.backend.commonData.CinemaRecord;
import bg.stream_mates.backend.commonData.dtos.Actor;
import bg.stream_mates.backend.resolver.CustomObjectResolver;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.validation.constraints.NotNull;
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
        resolver = CustomObjectResolver.class  // ✅ Позволява множество инстанции
)
public class Series extends CinemaRecord {

    private UUID id;

    @NotNull
    private List<Actor> castList = new ArrayList<>();

    @NotNull
    private List<Episode> allEpisodes = new ArrayList<>();

    @NotNull
    private List<SeriesImage> imagesList = new ArrayList<>();

    public void addAllEpisodes(List<Episode> allSeasonEpisodes) {
        allSeasonEpisodes.forEach(episode -> episode.setSeries(this));
        this.allEpisodes.addAll(allSeasonEpisodes);
    }

    public void addAllImages(List<SeriesImage> allImages) {
        allImages.forEach(image -> image.setSeries(this));
        this.getImagesList().addAll(allImages);
    }
}
