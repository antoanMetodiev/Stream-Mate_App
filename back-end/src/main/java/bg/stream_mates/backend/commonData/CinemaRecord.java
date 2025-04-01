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

    @Size(min = 2)
    private String title;

    @Size(min = 8)
    private String posterImgURL;

    private String specialText;

    private String searchTag;

    private String genres;  // може да бъде null

    private String description;

    private String releaseDate;  // може да бъде null

    private String tmdbRating;

    @Size(min = 10)
    private String backgroundImg_URL;

    private Instant createdAt;
}