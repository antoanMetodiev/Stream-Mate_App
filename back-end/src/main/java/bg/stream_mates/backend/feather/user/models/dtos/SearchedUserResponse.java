package bg.stream_mates.backend.feather.user.models.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Builder
@Data
public class SearchedUserResponse {

    @NotBlank(message = "Username cannot be empty!")
    private String username;

    @NotBlank(message = "Full Name cannot be empty!")
    private String fullName;

    @URL
    private String imgURL;
}
