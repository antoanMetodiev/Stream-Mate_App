package bg.stream_mates.backend.feather.user.models.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SendFriendRequest {

    @NotNull(message = "MyId cannot be null!")
    @Size(min = 1, message = "MyId have invalid min size!")
    private String myUsername;

    @NotNull(message = "WishedFriendId cannot be null!")
    @Size(min = 1, message = "WishedFriendId have invalid min size!")
    private String wishedFriendUsername;
}
