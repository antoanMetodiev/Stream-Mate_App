package bg.stream_mates.backend.feather.chat.models.dtos;

import bg.stream_mates.backend.feather.chat.models.enums.CallType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CallNotification {

    @NotBlank(message = "Caller cannot be empty!")
    private String caller;

    @NotBlank(message = "Caller Names cannot be empty!")
    private String callerNames;

    private String callerImgUrl;

    @NotBlank(message = "Receiver cannot be empty!")
    private String receiver;

    @NotBlank(message = "Call ID cannot be empty!")
    private String callId; // Уникален идентификатор на обаждането

    @NotBlank(message = "Call Type cannot be empty!")
    @Enumerated(value = EnumType.STRING)
    private CallType callType; // "video" или "audio"

    @NotBlank(message = "Channel Name cannot be empty!")
    private String channelName; // WebRTC / Agora канал

    @NotBlank(message = "Time Stamp also cannot be empty!")
    private String timestamp; // Време на обаждането
}
