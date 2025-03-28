package bg.stream_mates.backend.feather.user.handlers;

import bg.stream_mates.backend.feather.user.models.entities.FriendRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class FriendRequestNotificationHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public FriendRequestNotificationHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(payload));
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = session.getUri().getQuery().replace("username=", "");
        activeSessions.put(userId, session);
        System.out.println("FriendQuestNotificationHandler CONNECTED: " + userId + " | Session ID: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Премахване на сесията при затваряне
        System.out.println("USER CONNECTION CLOSED! ->>>>>>>><<<<<<<<<<<<<-");
        activeSessions.values().remove(session);
    }

    public void rejectReceivedFriendRequestNotification(String receiverUsername, String senderUsername) throws IOException {
        // 1. Взимам му сесията от Map-a:
        WebSocketSession otherUserSession = this.activeSessions.get(senderUsername);
        if (otherUserSession != null && otherUserSession.isOpen()) {
            // Създаваме JSON обект
            Map<String, String> messageData = new HashMap<>();
            messageData.put("type", "received_friend_request_cancellation");
            messageData.put("message", receiverUsername);

            String jsonMessage = objectMapper.writeValueAsString(messageData);
            otherUserSession.sendMessage(new TextMessage(jsonMessage));

        } else {
            System.out.println("User " + receiverUsername + " not found or not connected.");
        }
    }

    public void rejectSendedFriendRequestNotification(String receiverUsername) throws IOException {
        WebSocketSession otherUserSession = this.activeSessions.get(receiverUsername);

        if (otherUserSession != null && otherUserSession.isOpen()) {
            // Създаваме JSON обект с целия FriendRequest
            Map<String, Object> messageData = new HashMap<>();
            messageData.put("type", "sended_friend_request_cancellation");
            messageData.put("message", receiverUsername); // Изпращаме целия обект

            String jsonMessage = objectMapper.writeValueAsString(messageData);
            otherUserSession.sendMessage(new TextMessage(jsonMessage));
        } else {
            System.out.println("User " + receiverUsername + " not found or not connected.");
        }
    }

    public void sendFriendRequestNotification(FriendRequest friendRequest, String receiverUsername) throws IOException {
        WebSocketSession otherUserSession = this.activeSessions.get(receiverUsername);

        if (otherUserSession != null && otherUserSession.isOpen()) {
            // Създаваме JSON обект с целия FriendRequest
            Map<String, Object> messageData = new HashMap<>();
            messageData.put("type", "friend_request");
            messageData.put("message", friendRequest); // Изпращаме целия обект

            String jsonMessage = objectMapper.writeValueAsString(messageData);
            otherUserSession.sendMessage(new TextMessage(jsonMessage));
        } else {
            System.out.println("User " + receiverUsername + " not found or not connected.");
        }
    }
}
