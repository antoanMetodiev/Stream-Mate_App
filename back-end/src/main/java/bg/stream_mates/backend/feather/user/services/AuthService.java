package bg.stream_mates.backend.feather.user.services;

import bg.stream_mates.backend.feather.user.models.dtos.LoginRequest;
import bg.stream_mates.backend.feather.user.models.dtos.RegisterRequest;
import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.models.enums.UserRole;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import bg.stream_mates.backend.security.JwtTokenUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class AuthService {

    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(RedisTemplate<String, String> redisTemplate,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {

        this.redisTemplate = redisTemplate;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(RegisterRequest registerRequest,
                         HttpServletResponse response) {

        // 1. Проверявам дали съществува вече такъв потребител с такъв username или email:
        Optional<User> databaseResponse = this.userRepository
                .findByUsernameAndEmail(registerRequest.getUsername(), registerRequest.getEmail());

        if (databaseResponse.isPresent()) {
            throw new RuntimeException("User with this username or email already exists!");
        }

        // 2. Създавам такъв User:
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .userRole(UserRole.RECRUIT)
                .build();

        this.userRepository.save(user);

        // 3. Генерирам JWT токен за новия потребител:
        String token = JwtTokenUtil.generateToken(user.getUsername());

        // 4. Съхранявам токена в Redis
        this.redisTemplate.opsForValue().set(user.getUsername(), token, 47, TimeUnit.HOURS);

        // 5. Създавам сесия:
        Cookie cookie = new Cookie("JWT_TOKEN", token);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) TimeUnit.HOURS.toSeconds(47));
//        cookie.setAttribute("SameSite", "None"); // 👈 ТОВА Е ВАЖНО!

        response.addCookie(cookie);

        return user;
    }

    @Transactional
    public List<Object> login(LoginRequest loginRequest, HttpServletResponse response) {
        Optional<User> databaseResponse = this.userRepository
                .findByUsername(loginRequest.getUsername());

        if (databaseResponse.isEmpty() || !passwordEncoder
                .matches(loginRequest.getPassword(), databaseResponse.get().getPassword())) {
            throw new RuntimeException("User with this username or password does not exist!");
        }

        // Генерираме нов JWT токен
        String token = JwtTokenUtil.generateToken(loginRequest.getUsername());
        System.out.println("Generated JWT Token: " + token);

        // Съхраняваме токена в Redis за 47 часа
        redisTemplate.opsForValue().set(loginRequest.getUsername(), token, 47, TimeUnit.HOURS);

        List<Object> data = new ArrayList<>();
        data.add(token);
        data.add(databaseResponse.get());

        // Създаваме cookie за JWT токен
        Cookie cookie = new Cookie("JWT_TOKEN", token);
        cookie.setHttpOnly(false);  // По-безопасно е да е true
        cookie.setSecure(false); // Ако работиш в HTTPS, сложи true
        cookie.setPath("/");  // Валиден за целия сайт
        cookie.setMaxAge((int) TimeUnit.HOURS.toSeconds(47));  // Време на живот 48 часа
//        cookie.setAttribute("SameSite", "None"); // 👈 ТОВА Е ВАЖНО!

        response.addCookie(cookie);  // Добавя cookie-то в отговора
        return data;
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // 1. Извличане на JWT токена от бисквитките
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return;

        for (Cookie cookie : cookies) {
            if ("JWT_TOKEN".equals(cookie.getName())) {
                String token = cookie.getValue();

                // 2. Извличане на потребителското име от токена
                String username = JwtTokenUtil.extractUsername(token);

                // 3. Изтриване на токена от Redis
                if (username != null) {
                    redisTemplate.delete(username);
                }

                // 4. Инвалидиране на бисквитката в браузъра
                Cookie invalidCookie = new Cookie("JWT_TOKEN", "");
                invalidCookie.setHttpOnly(true);       // Съвпада с настройките при логин
                invalidCookie.setSecure(true);         // Съвпада с настройките при логин
                invalidCookie.setPath("/");
                invalidCookie.setMaxAge(0);             // Бисквитката се изтрива веднага
                response.addCookie(invalidCookie);

                break;
            }
        }
    }

}

