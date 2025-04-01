package bg.stream_mates.backend.feather.movies.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
public class MovieComment {

    private UUID id;

    private String commentText;

    private String authorUsername;

    private String authorFullName;

    private String authorId;

    private String authorImgURL;

    private double rating;

    private String createdAt;
}
