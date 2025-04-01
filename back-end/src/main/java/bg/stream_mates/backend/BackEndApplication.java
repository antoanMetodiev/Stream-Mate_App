package bg.stream_mates.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableFeignClients
@EnableTransactionManagement
@EnableRetry
@EnableScheduling
public class BackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackEndApplication.class, args);
    }
}
