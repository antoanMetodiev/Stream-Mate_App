package bg.stream_mates.backend.feather.commonData.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CinemaRecRequestDto {
    @NotBlank(message = "Record Name cannot be empty!")
    private String recordName;
}
