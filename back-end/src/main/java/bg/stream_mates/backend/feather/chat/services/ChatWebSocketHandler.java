package bg.stream_mates.backend.feather.chat.services;

import bg.stream_mates.backend.feather.chat.models.dtos.CallNotification;
import bg.stream_mates.backend.feather.chat.models.dtos.ReceivedMessage;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ChatWebSocketHandler extends TextWebSocketHandler {
    // Map за съхранение на активните потребители (userId -> WebSocketSession)
    private static final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();

    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final String TOPIC = "chat-topic";

    public ChatWebSocketHandler(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
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
        System.out.println();
        ObjectMapper objectMapper = new ObjectMapper();

        // Опитваме се да разпознаем типа на съобщението (текстово или видео обаждане)
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());

        if (jsonNode.has("callId")) {
            // Това е за видео обаждане:
            CallNotification videoCall = objectMapper.treeToValue(jsonNode, CallNotification.class);

            // Изпращаме в Kafka topic за видео обаждания
            kafkaTemplate.send("call-topic", objectMapper.writeValueAsString(videoCall));
            System.out.println("Video/Audio call sent to Kafka: " + videoCall);
        } else {
            // Това е стандартно текстово съобщение
            ReceivedMessage receivedMessage = objectMapper.treeToValue(jsonNode, ReceivedMessage.class);
            kafkaTemplate.send("chat-topic", objectMapper.writeValueAsString(receivedMessage));
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
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonMessage = objectMapper.writeValueAsString(message);

            // Изпращаме съобщението като TextMessage
            recipientSession.sendMessage(new TextMessage(jsonMessage));
            System.out.println("Sent video call notification to " + message.getReceiver());
        } else {
            System.out.println("User " + message.getReceiver() + " not found or not connected.");
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Премахване на сесията при затваряне
        activeSessions.values().remove(session);
        System.out.println("Session closed: " + session.getId());
    }



//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        System.out.println("Received message: " + message.getPayload());
//
//        // Десериализиране на JSON към DTO
//        ObjectMapper objectMapper = new ObjectMapper();
//        ReceivedMessage receivedMessage = objectMapper.readValue(message.getPayload(), ReceivedMessage.class);
//
//        System.out.println("Parsed Message - From: " + receivedMessage.getOwner() +
//                ", To: " + receivedMessage.getReceiver() +
//                ", Text: " + receivedMessage.getMessageText());
//
//        // Конвертиране на DTO в JSON String
//        String jsonMessage = objectMapper.writeValueAsString(receivedMessage);
//
//        // Изпращаме съобщението в Kafka като String
//        kafkaTemplate.send(TOPIC, jsonMessage);
//        System.out.println("Message sent to Kafka: " + jsonMessage);
//    }




}
