package bg.stream_mates.backend.feather.user.services;

import bg.stream_mates.backend.exception.UserAlreadyExistsException;
import bg.stream_mates.backend.exception.UserNotFoundException;
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
                .findByUsernameOrEmail(registerRequest.getUsername(), registerRequest.getEmail());

        if (databaseResponse.isPresent()) {
            throw new UserAlreadyExistsException("User with this username or email already exists!");
        }

        // 2. Създавам такъв User:
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .fullName(registerRequest.getFullName())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .profileImageURL(registerRequest.getProfileImageURL())
                .userRole(UserRole.RECRUIT)
                .build();

        User savedUser = this.userRepository.save(user);

        // 3. Генерирам JWT токен за новия потребител:
        String token = JwtTokenUtil.generateToken(String.valueOf(savedUser.getId()));

        // 4. Съхранявам токена в Redis
        this.redisTemplate.opsForValue().set(String.valueOf(savedUser.getId()), token, 47, TimeUnit.HOURS);

        // 5. Създавам сесия:
        Cookie cookie = new Cookie("JWT_TOKEN", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) TimeUnit.HOURS.toSeconds(47));

        response.addCookie(cookie);
        return user;
    }

    @Transactional
    public User login(LoginRequest loginRequest, HttpServletResponse response) {
        Optional<User> databaseResponse = this.userRepository
                .findByUsername(loginRequest.getUsername());

        if (databaseResponse.isEmpty() || !passwordEncoder
                .matches(loginRequest.getPassword(), databaseResponse.get().getPassword())) {
            throw new UserNotFoundException("User with this username or password does not exist!");
        }

        User user = databaseResponse.get();

        // Генерирам нов JWT токен!
        String token = JwtTokenUtil.generateToken(String.valueOf(user.getId()));
        System.out.println("Generated JWT Token: " + token);

        // Съхранявам токена!
        redisTemplate.opsForValue().set(String.valueOf(user.getId()), token, 47, TimeUnit.HOURS);

        Cookie cookie = new Cookie("JWT_TOKEN", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) TimeUnit.HOURS.toSeconds(47));

        response.addCookie(cookie);
        return user;
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
                String username = JwtTokenUtil.extractId(token);

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

