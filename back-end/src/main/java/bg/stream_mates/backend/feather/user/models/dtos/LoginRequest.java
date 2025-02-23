package bg.stream_mates.backend.feather.user.models.dtos;

import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class LoginRequest {
    private String username;
    private String password;
}
