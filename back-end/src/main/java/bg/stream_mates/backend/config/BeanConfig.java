package bg.stream_mates.backend.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.net.http.HttpClient;
import java.util.concurrent.Executor;

@Configuration
public class BeanConfig {

    @Bean
    public HttpClient httpClient() {
        return HttpClient.newHttpClient();
    }

    @Bean
    public Executor asyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);  // Минимален брой нишки
        executor.setMaxPoolSize(10);  // Максимален брой нишки
        executor.setQueueCapacity(100); // Дължина на опашката
        executor.setThreadNamePrefix("AsyncThread-");
        executor.initialize();
        return executor;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule()) // Поддръжка на Java 8+ Date/Time API
                .configure(DeserializationFeature.READ_ENUMS_USING_TO_STRING, true) // Десериализира enum от String
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false) // Игнорира непознати полета
                .configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true); // Сериализира enum като String
    }
}
