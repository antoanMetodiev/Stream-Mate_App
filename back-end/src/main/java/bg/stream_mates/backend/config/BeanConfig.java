package bg.stream_mates.backend.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.net.http.HttpClient;

@Configuration
public class BeanConfig {

    @Bean
    public HttpClient httpClient() {
        return HttpClient.newHttpClient();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .configure(DeserializationFeature.READ_ENUMS_USING_TO_STRING, true) // Десериализира enum от String
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false) // Игнорира непознати полета
                .configure(SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true); // Сериализира enum като String
    }
}
