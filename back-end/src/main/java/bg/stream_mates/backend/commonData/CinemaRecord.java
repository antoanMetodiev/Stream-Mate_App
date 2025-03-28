package bg.stream_mates.backend.commonData;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.Instant;

@Getter
@Setter
@Accessors(chain = true)
@MappedSuperclass
public abstract class CinemaRecord {

    @Column(nullable = false)
    @Size(min = 2)
    private String title;

    @Column(name = "poster_img_URL", nullable = false)
    @Size(min = 8)
    private String posterImgURL;

    @Column(name = "special_text")
    private String specialText;

    @Column(name = "search_tag", nullable = false)
    private String searchTag;

    @Column(nullable = false)
    private String genres;  // може да бъде null

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "release_date")
    private String releaseDate;  // може да бъде null

    @Column(name = "tmdb_rating")
    private String tmdbRating;

    @Column(name = "background_img_URL")
    @Size(min = 10)
    private String backgroundImg_URL;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    // Други общи полета за медийните обекти, като description, year и т.н.
}