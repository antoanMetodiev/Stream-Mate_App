package bg.stream_mates.backend.config;

import bg.stream_mates.backend.feather.chat.repositories.ChatRepository;
import bg.stream_mates.backend.feather.chat.services.ChatService;
import bg.stream_mates.backend.feather.user.handlers.FriendRequestNotificationHandler;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ObjectMapper objectMapper;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final FriendRequestNotificationHandler friendRequestNotificationHandler;

    public WebSocketConfig(ObjectMapper objectMapper,
                           ChatRepository chatRepository,
                           UserRepository userRepository, FriendRequestNotificationHandler friendRequestNotificationHandler) {

        this.objectMapper = objectMapper;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.friendRequestNotificationHandler = friendRequestNotificationHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatWebSocketHandler(), "/chat").setAllowedOrigins("*");
        registry.addHandler(friendRequestNotificationHandler, "/frRequest").setAllowedOrigins("*");
    }

    @Bean(name = "customChatWebSocketHandler")
    public ChatService chatWebSocketHandler() {
        return new ChatService(objectMapper, chatRepository, userRepository);
    }

    // !!! ТОВА ОТДОЛУ ГО МАХНАХ, ЗАЩОТО РЕГИСТРИРАХ ТОЗИ БЕАН 2-ПЪТИ - НЕ ЗНАМ ДАЛИ СЪС ChatService СТАВА СЪЩОТО И ДАЛИ НЕ ТРЯБВА ДА ГО МАХНА И НЕГО ТОЗИ ГОРНИЯ МЕТОД

//    @Bean(name = "customFriendRequestNotificationHandler")
//    public FriendRequestNotificationHandler friendRequestNotificationHandler() {
//        return new FriendRequestNotificationHandler(objectMapper);
//    }
}
