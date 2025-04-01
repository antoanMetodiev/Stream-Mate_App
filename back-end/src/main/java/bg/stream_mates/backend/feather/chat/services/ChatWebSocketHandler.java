package bg.stream_mates.backend.feather.chat.services;

import bg.stream_mates.backend.feather.chat.models.dtos.CallNotification;
import bg.stream_mates.backend.feather.chat.models.dtos.ReceivedMessage;
import bg.stream_mates.backend.feather.chat.models.entities.Message;
import bg.stream_mates.backend.feather.chat.repositories.ChatRepository;
import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatWebSocketHandler extends TextWebSocketHandler {
    // Map за съхранение на активните потребители (userId -> WebSocketSession)
    private static final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Autowired
    public ChatWebSocketHandler(ObjectMapper objectMapper,
                       ChatRepository chatRepository,
                       UserRepository userRepository) {

        this.objectMapper = objectMapper;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = session.getUri().getQuery().replace("username=", "");
        activeSessions.put(userId, session);
        System.out.println("User connected: " + userId + " | Session ID: " + session.getId());
    }

    // ПОЛУЧАВА С WebSocket:
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Опитваме се да разпознаем типа на съобщението (текстово или видео обаждане)
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());

        if (jsonNode.has("callId")) {
            // Това е за видео обаждане:
            CallNotification videoCall = objectMapper.treeToValue(jsonNode, CallNotification.class);

            // Изпращаме в Kafka topic за видео обаждания
//            kafkaTemplate.send("call-topic", objectMapper.writeValueAsString(videoCall));
            sendVideoCallToUser(videoCall);
            System.out.println("Video/Audio call sent to Kafka: " + videoCall);
        } else {
            // Това е стандартно текстово съобщение
            ReceivedMessage receivedMessage = objectMapper.treeToValue(jsonNode, ReceivedMessage.class);
//            kafkaTemplate.send("chat-topic", objectMapper.writeValueAsString(receivedMessage));
            sendMessageToUser(receivedMessage);
            this.saveMessageToDB(receivedMessage);
            System.out.println("Message sent to Kafka: " + receivedMessage);
        }
    }

    // ИЗПРАЩА С WebSocket:
    public void sendMessageToUser(ReceivedMessage message) throws Exception {
        WebSocketSession recipientSession = activeSessions.get(message.getReceiver());
        if (recipientSession != null && recipientSession.isOpen()) {
            recipientSession.sendMessage(new TextMessage(message.getMessageText()));
            System.out.println("Sent message to " + message.getReceiver() + ": " + message.getMessageText());
        } else {
            System.out.println("User " + message.getReceiver() + " not found or not connected.");
        }
    }

    // VIDEO CALLS:
    public void sendVideoCallToUser(CallNotification message) throws Exception {
        WebSocketSession recipientSession = activeSessions.get(message.getReceiver());
        if (recipientSession != null && recipientSession.isOpen()) {
            // Сериализиране на CallNotification в JSON низ
            String jsonMessage = objectMapper.writeValueAsString(message);

            // Изпращаме съобщението като TextMessage
            recipientSession.sendMessage(new TextMessage(jsonMessage));
            System.out.println("Sent video call notification to " + message.getReceiver());
        } else {
            System.out.println("User " + message.getReceiver() + " not found or not connected.");
        }
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

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Премахване на сесията при затваряне
        activeSessions.values().remove(session);
        System.out.println("Session closed: " + session.getId());
    }
}
