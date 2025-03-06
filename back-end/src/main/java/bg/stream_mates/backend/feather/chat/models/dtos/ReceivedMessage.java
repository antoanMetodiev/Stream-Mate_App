package bg.stream_mates.backend.feather.chat.models.dtos;

import bg.stream_mates.backend.feather.chat.models.enums.MessageType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReceivedMessage {

    @NotBlank(message = "Message is empty!")
    private String messageText;

    @NotBlank(message = "Owner is empty!")
    private String owner;

    @NotBlank(message = "Receiver is empty!")
    private String receiver;

    @Enumerated(EnumType.STRING)
    @NotNull
    private MessageType messageType;
}
