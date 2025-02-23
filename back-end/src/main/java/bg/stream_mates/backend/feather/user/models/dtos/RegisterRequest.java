package bg.stream_mates.backend.feather.user.models.dtos;

import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class RegisterRequest {

    private String username;

    @Email
    private String email;

    private String password;

    private String firstName;

    private String lastName;
}
