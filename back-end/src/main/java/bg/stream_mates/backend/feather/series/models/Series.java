package bg.stream_mates.backend.feather.series.models;

import bg.stream_mates.backend.commonData.entities.Actor;
import bg.stream_mates.backend.commonData.CinemaRecord;
import bg.stream_mates.backend.resolver.CustomObjectResolver;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "series")
@Getter
@Setter
@Accessors(chain = true)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        resolver = CustomObjectResolver.class  // ✅ Позволява множество инстанции
)
public class Series extends CinemaRecord {

    @Id
    @GeneratedValue
    private UUID id;

    @NotNull
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "series_actors",
            joinColumns = @JoinColumn(name = "series_id"),
            inverseJoinColumns = @JoinColumn(name = "actor_id")
    )
    private List<Actor> castList = new ArrayList<>();

    @NotNull
    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Episode> allEpisodes = new ArrayList<>();

    @NotNull
    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, orphanRemoval = true)
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
