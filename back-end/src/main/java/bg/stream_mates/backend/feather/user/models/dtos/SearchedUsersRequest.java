package bg.stream_mates.backend.feather.user.models.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchedUsersRequest {
    @NotBlank(message = "Searched User username cannot be empty!")
    private String searchedUser;
}
