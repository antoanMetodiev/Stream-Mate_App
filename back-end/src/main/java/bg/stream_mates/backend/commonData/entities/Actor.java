package bg.stream_mates.backend.commonData.entities;

import bg.stream_mates.backend.feather.movies.models.entities.Movie;
import bg.stream_mates.backend.feather.series.models.Series;
import bg.stream_mates.backend.resolver.CustomObjectResolver;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "actors")
@Getter
@Setter
@Accessors(chain = true)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        resolver = CustomObjectResolver.class  // ✅ Позволява множество инстанции
)
public class Actor {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "image_url")
    private String imageURL;

    @Column(columnDefinition = "TEXT")
    private String biography;

    @Column(name = "facebook_username")
    private String facebookUsername;

    @Column(name = "instagram_username")
    private String instagramUsername;

    @Column(name = "twitter_username")
    private String twitterUsername;

    @Column(name = "youtube_channel")
    private String youtubeChannel;

    @Column(name = "imdb_id")
    private String imdbId;

    @Column
    private String birthday;

    @Column(name = "known_for")
    private String knownFor;

    @Column(name = "place_of_birth")
    private String placeOfBirth;

    @Column
    private String gender;

    @Column
    private String popularity;

    @Column(name = "name_in_real_life", nullable = false)
    private String nameInRealLife;

    @ManyToMany(mappedBy = "castList", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Series> seriesParticipations = new ArrayList<>();

    @ManyToMany(mappedBy = "castList", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Movie> moviesParticipations = new ArrayList<>();
}
