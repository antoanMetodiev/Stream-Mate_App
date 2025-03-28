package bg.stream_mates.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.codec.Decoder;
import feign.codec.Encoder;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    private final ObjectMapper objectMapper;

    public FeignConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    public Decoder feignDecoder() {
        // Създава Jackson Decoder, който използва обекта ObjectMapper
        return new JacksonDecoder(objectMapper);  // JacksonDecoder е препоръчителният начин
    }

    @Bean
    public Encoder feignEncoder() {
        // Създава Jackson Encoder, който използва обекта ObjectMapper
        return new JacksonEncoder(objectMapper);  // JacksonEncoder е препоръчителният начин
    }
}
