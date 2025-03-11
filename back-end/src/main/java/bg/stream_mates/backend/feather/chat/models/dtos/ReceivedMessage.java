package bg.stream_mates.backend.feather.chat.models.dtos;

import bg.stream_mates.backend.feather.chat.models.enums.MessageType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReceivedMessage {

    @NotBlank(message = "Message is empty!")
    private String messageText;

    @NotBlank(message = "Owner is empty!")
    private String owner;

    @NotBlank(message = "Owner names cannot be empty!")
    private String ownerNames;

    private String ownerImgUrl;

    @NotBlank(message = "Receiver is empty!")
    private String receiver;

    @Enumerated(EnumType.STRING)
    @NotNull
    private MessageType messageType;

    private String createdOn;
}
