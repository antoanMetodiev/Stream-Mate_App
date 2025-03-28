package bg.stream_mates.backend.feather.user.models.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EditProfileRequest {
    @NotNull(message = "ID cannot be empty!")
    private String id;

    private String username;
    private String email;
    private String fullName;
    private String password;
}
