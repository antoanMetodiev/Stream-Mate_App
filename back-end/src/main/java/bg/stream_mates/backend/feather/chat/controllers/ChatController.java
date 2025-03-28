package bg.stream_mates.backend.feather.chat.controllers;

import bg.stream_mates.backend.feather.chat.models.dtos.ReceivedMessage;
import bg.stream_mates.backend.feather.chat.models.entities.Message;
import bg.stream_mates.backend.feather.chat.services.ChatService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/get-messages-with-friend")
    public List<ReceivedMessage> getMessagesWithFriend(@RequestParam String myId,
                                                       @RequestParam String friendId) {

        List<ReceivedMessage> messages = new ArrayList<>();
        List<Message> responseMessages = this.chatService.getMessagesWithFriend(myId, friendId);
        responseMessages.forEach(responseMessage -> {
            ReceivedMessage message = ReceivedMessage.builder()
                    .messageText(responseMessage.getMessageText())
                    .messageType(responseMessage.getMessageType())
                    .owner(responseMessage.getOwner().getId().toString())
                    .receiver(responseMessage.getReceiver().getId().toString())
                    .createdOn(responseMessage.getCreatedOn().toString())
                    .build();

            messages.add(message);
        });

        return messages;
    }

}
