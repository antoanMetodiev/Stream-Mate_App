package bg.stream_mates.backend.feather.movies.models.entities;

import bg.stream_mates.backend.commonData.CinemaRecord;
import bg.stream_mates.backend.commonData.entities.Actor;
import bg.stream_mates.backend.resolver.CustomObjectResolver;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "movies")
@Getter
@Setter
@Accessors(chain = true)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        resolver = CustomObjectResolver.class  // ✅ Позволява множество инстанции
)
public class Movie extends CinemaRecord {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "movies_actors",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "actor_id")
    )
    private List<Actor> castList = new ArrayList<>();

    @Column(name = "video_url", nullable = false)
    private String videoURL;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieImage> imagesList = new ArrayList<>();

    public void addAllImages(List<MovieImage> allImages) {
        allImages.forEach(image -> image.setMovie(this));
        this.getImagesList().addAll(allImages);
    }
}