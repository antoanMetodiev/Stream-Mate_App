package bg.stream_mates.backend.feather.series.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.validation.constraints.Min;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
public class SeriesComment {

    private UUID id;

    private String commentText;

    private String authorUsername;

    private String authorFullName;

    private String authorImgURL;

    private UUID authorId;

    @Min(1)
    private double rating;

    private String createdAt;

    private Series series;
}
