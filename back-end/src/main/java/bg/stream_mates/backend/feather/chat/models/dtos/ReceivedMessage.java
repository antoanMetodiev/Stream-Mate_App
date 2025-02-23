package bg.stream_mates.backend.feather.chat.models.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReceivedMessage {

    @NotBlank(message = "Message is empty!")
    private String messageText;

    @NotBlank(message = "Owner is empty!")
    private String owner;

    @NotBlank(message = "Receiver is empty!")
    private String receiver;
}
