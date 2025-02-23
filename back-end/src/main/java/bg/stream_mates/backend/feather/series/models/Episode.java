package bg.stream_mates.backend.feather.series.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.UUID;

@Table(name = "episodes")
@Entity
@Getter
@Setter
@Accessors(chain = true)
public class Episode {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "video_url", unique = true, nullable = false)
    private String videoURL;

    @Column(name = "poster_img_url")
    private String posterImgURL;

    @Column(name = "episode_title")
    private String episodeTitle;

    @Column(name = "air_date")
    private String airDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String runtime;

    @Column(name = "tmdb_rating")
    private String tmdbRating;

    @Column
    private String season;

    @Column(name = "episode_number")
    private String episodeNumber;

    @ManyToOne
    @JoinColumn(name = "series_id", nullable = false)
    @JsonBackReference
    private Series series;
}
