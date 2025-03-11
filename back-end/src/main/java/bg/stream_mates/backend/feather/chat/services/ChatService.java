package bg.stream_mates.backend.feather.chat.services;

import bg.stream_mates.backend.feather.chat.models.dtos.CallNotification;
import bg.stream_mates.backend.feather.chat.models.dtos.ReceivedMessage;
import bg.stream_mates.backend.feather.chat.models.entities.Message;
import bg.stream_mates.backend.feather.chat.models.enums.CallType;
import bg.stream_mates.backend.feather.chat.models.enums.MessageType;
import bg.stream_mates.backend.feather.chat.repositories.ChatRepository;
import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService extends TextWebSocketHandler {
    // Map за съхранение на активните потребители (userId -> WebSocketSession)
    private static final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Autowired
    public ChatService(ObjectMapper objectMapper,
                       ChatRepository chatRepository,
                       UserRepository userRepository) {

        this.objectMapper = objectMapper;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = session.getUri().getQuery().replace("userId=", "");
        activeSessions.put(userId, session);
        System.out.println("User connected: " + userId + " | Session ID: " + session.getId());
    }

    @Transactional
    public List<Message> getMessagesWithFriend(String myId, String friendId) {
        return this.chatRepository.getMessagesWithFriend(myId, friendId);
    }

    // ПОЛУЧАВА С WebSocket:
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Опитваме се да разпознаем типа на съобщението (текстово или видео обаждане)
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());

        if (jsonNode.has("callId")) {
            // Това е за видео обаждане:
            CallNotification callNotification = objectMapper.treeToValue(jsonNode, CallNotification.class);
            sendCallToUser(callNotification);
            System.out.println("Video/Audio call sent to Kafka: " + callNotification);
        } else {
            // Това е стандартно текстово съобщение
            ReceivedMessage receivedMessage = objectMapper.treeToValue(jsonNode, ReceivedMessage.class);
            sendMessageToUser(receivedMessage);
            this.saveMessageToDB(receivedMessage);
            System.out.println("Message sent to Kafka: " + receivedMessage);
        }
    }

    // ИЗПРАЩА С WebSocket:
    public void sendMessageToUser(ReceivedMessage message) throws Exception {
        WebSocketSession recipientSession = activeSessions.get(message.getReceiver());
        if (recipientSession != null && recipientSession.isOpen()) {
            recipientSession.sendMessage(new TextMessage(this.objectMapper.writeValueAsString(message)));
            System.out.println("Sent message to " + message.getReceiver() + ": " + message.getMessageText());
        } else {
            System.out.println("User " + message.getReceiver() + " not found or not connected.");
        }
    }

    // VIDEO CALLS:
    public void sendCallToUser(CallNotification message) throws Exception {
        String jsonMessage = objectMapper.writeValueAsString(message);
        WebSocketSession recipientSession = activeSessions.get(message.getReceiver());
        if (recipientSession != null && recipientSession.isOpen()) {
            // Изпращаме съобщението като TextMessage:
            recipientSession.sendMessage(new TextMessage(jsonMessage));
            System.out.println("Sent video call notification to " + message.getReceiver());
        } else {
            System.out.println("User " + message.getReceiver() + " not found or not connected.");
        }

        // Винаги съхранваме, това което е искал да изпрати real-time, дори човека отсреща да не е на линия:
        ReceivedMessage receivedMessage = ReceivedMessage.builder()
                .messageType(MessageType.AUDIO_CALL)
                .owner(message.getCaller())
                .receiver(message.getReceiver())
                .ownerNames(message.getCallerNames())
                .ownerImgUrl(message.getCallerImgUrl())
                .messageText(" :} ")
                .build();

        if (message.getCallType() == CallType.VIDEO_CALL) receivedMessage.setMessageType(MessageType.VIDEO_CALL);
        this.saveMessageToDB(receivedMessage);
    }

    @Transactional
    public void saveMessageToDB(ReceivedMessage receivedMessage) {
        UUID ownerUUID = UUID.fromString(receivedMessage.getOwner());
        UUID receiverID = UUID.fromString(receivedMessage.getReceiver());

        Optional<User> owner = this.userRepository.findById(ownerUUID);
        Optional<User> receiver = this.userRepository.findById(receiverID);
        if (owner.isEmpty() || receiver.isEmpty()) return;

        User ownerUser = owner.get();
        User receiverUser = receiver.get();

        Message message = Message.builder()
                .owner(ownerUser)
                .receiver(receiverUser)
                .createdOn(Instant.now())
                .messageText(receivedMessage.getMessageText())
                .messageType(receivedMessage.getMessageType())
                .build();

        if (receivedMessage.getMessageType() == MessageType.IMAGE
                || receivedMessage.getMessageType() == MessageType.TEXT) {
            message.setMessageText(receivedMessage.getMessageText());
        } else {
            message.setMessageText(String.format("%s започна аудио обаждане.", receivedMessage.getOwnerNames()));
            if (message.getMessageType() == MessageType.VIDEO_CALL) {
                message.setMessageText(String.format("%s започна аудио обаждане.", receivedMessage.getOwnerNames()));
            }
        }

        this.chatRepository.save(message);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Премахване на сесията при затваряне
        activeSessions.values().remove(session);
        System.out.println("Chat Session closed: " + session.getId());
    }
}
