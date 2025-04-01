package bg.stream_mates.backend.feather.movies.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostCommentRequest {

    @NotNull(message = "Comment text cannot be null!")
    private String commentText;

    @NotNull(message = "Author Username text cannot be null!")
    private String authorUsername;

    @NotNull(message = "Author full name text cannot be null!")
    private String authorFullName;

    @NotNull(message = "Author Id cannot be empty!")
    private String authorId;

    @NotNull(message = "Author img url text cannot be null!")
    private String authorImgURL;

    @NotNull(message = "CreatedAt cannot be null!")
    private String createdAt;

    @NotNull(message = "Rating text cannot be null!")
    @Min(1)
    private double rating;

    @NotNull(message = "Cinema Record id cannot be null!")
    private String cinemaRecordId;
}
