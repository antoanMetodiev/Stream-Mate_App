package bg.stream_mates.backend.feather.user.models.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditUserMainPhotos {

    @NotNull
    private String userId;
    
    private String userUrl;
    private String backgroundUrl;
}
