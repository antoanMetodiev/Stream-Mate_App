package bg.stream_mates.backend.config;

import bg.stream_mates.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final RedisTemplate<String, String> redisTemplate;

    public SecurityConfig(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(redisTemplate);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS първо!
                .csrf().disable()
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/register", "/actuator/health").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class); // JWT филтър след CORS

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // За тестови цели е само за момента това!
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));

//        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173",
//                "https://stream-mate-org.netlify.app"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);

        configuration.addExposedHeader("Access-Control-Allow-Credentials");
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Custom-Logout", // 👈 Разрешени хедъри
                "X-Requested-With"
        ));
        configuration.setExposedHeaders(Arrays.asList(
                "Set-Cookie",
                "X-Custom-Logout"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
