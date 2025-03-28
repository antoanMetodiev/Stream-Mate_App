package bg.stream_mates.backend.feather.user.models.dtos;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.URL;

@Data
@Accessors(chain = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String username;

    @Email
    private String email;

    private String password;

    private String fullName;

    @URL
    private String profileImageURL;
}
