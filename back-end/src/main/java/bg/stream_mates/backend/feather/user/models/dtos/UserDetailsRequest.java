package bg.stream_mates.backend.feather.user.models.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsRequest {
    @NotBlank(message = "Username cannot be empty!")
    private String username;
}
