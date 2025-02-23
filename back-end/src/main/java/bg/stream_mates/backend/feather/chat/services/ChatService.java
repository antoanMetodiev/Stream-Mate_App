package bg.stream_mates.backend.feather.chat.services;

import bg.stream_mates.backend.feather.chat.models.dtos.CallNotification;
import bg.stream_mates.backend.feather.chat.models.dtos.ReceivedMessage;
import bg.stream_mates.backend.feather.chat.models.entities.Message;
import bg.stream_mates.backend.feather.chat.repositories.ChatRepository;
import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.Instant;
import java.util.Optional;

@Service
public class ChatService extends TextWebSocketHandler {

    private final ChatWebSocketHandler chatWebSocketHandler;
    private final ObjectMapper objectMapper;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Autowired
    public ChatService(ObjectMapper objectMapper,
                       ChatRepository chatRepository,
                       UserRepository userRepository,
                       ChatWebSocketHandler chatWebSocketHandler) {

        this.objectMapper = objectMapper;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    // FOR VIDEO CALLS OR AUDIO;
    @KafkaListener(topics = "call-topic", groupId = "video-call-group")
    public void handleCallFromKafka(String messageJson) throws Exception {
        CallNotification videoCall = objectMapper.readValue(messageJson, CallNotification.class);

        System.out.println("Received video call request from Kafka - From: " + videoCall.getCaller() +
                ", To: " + videoCall.getReceiver());

        // Изпращане на уведомление чрез WebSocket
        chatWebSocketHandler.sendVideoCallToUser(videoCall);
    }

    // Това ми се явява моя Kafka Consumer:
    @KafkaListener(topics = "chat-topic", groupId = "chat-group")
    public void handleMessageFromKafka(String messageJson) throws Exception {
        ReceivedMessage receivedMessage = objectMapper.readValue(messageJson, ReceivedMessage.class);
        System.out.println("Received from Kafka - To: " + receivedMessage.getReceiver() +
                ", Message: " + receivedMessage.getMessageText());

        // Изпращане на съобщението към Back-End WebSocket (съседния клас), за да може той да го изпрати на FE:
        chatWebSocketHandler.sendMessageToUser(receivedMessage);
        this.saveMessageToDB(receivedMessage);
    }

    @Transactional
    public void saveMessageToDB(ReceivedMessage receivedMessage) {
        Optional<User> owner = this.userRepository.findByUsername(receivedMessage.getOwner());
        Optional<User> receiver = this.userRepository.findByUsername(receivedMessage.getReceiver());
        if (owner.isEmpty() || receiver.isEmpty()) return;

        Message message = Message.builder()
                .messageText(receivedMessage.getMessageText())
                .owner(owner.get())
                .receiver(receiver.get())
                .createdOn(Instant.now())
                .build();

        this.chatRepository.save(message);
    }
}
