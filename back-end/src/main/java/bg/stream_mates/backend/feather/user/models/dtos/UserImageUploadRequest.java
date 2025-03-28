package bg.stream_mates.backend.feather.user.models.dtos;

import bg.stream_mates.backend.feather.user.models.entities.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserImageUploadRequest {

    @URL
    @NotBlank(message = "Image URL cannot be empty!")
    private String imageUrl;

    @NotBlank(message = "User img type cannot be empty!")
    private String userImageType;

    private String description;

    @NotNull(message = "User Id cannot be empty!")
    private String ownerId;
}
