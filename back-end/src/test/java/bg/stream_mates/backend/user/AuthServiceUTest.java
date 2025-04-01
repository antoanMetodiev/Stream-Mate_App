package bg.stream_mates.backend.user;

import bg.stream_mates.backend.exception.UserAlreadyExistsException;
import bg.stream_mates.backend.exception.UserNotFoundException;
import bg.stream_mates.backend.feather.user.models.dtos.LoginRequest;
import bg.stream_mates.backend.feather.user.models.dtos.RegisterRequest;
import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.models.enums.UserRole;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import bg.stream_mates.backend.feather.user.services.AuthService;
import bg.stream_mates.backend.security.JwtTokenUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceUTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;

    @BeforeEach
    void setUp() {
        System.setProperty("JWT_MY_SECRET_KEY", "testSecretKey");
        registerRequest = new RegisterRequest("testUser", "test@example.com", "Test User", "password", "profileImageURL");
        loginRequest = new LoginRequest("testUser", "password");
        user = User.builder()
                .id(UUID.randomUUID())
                .username("testUser")
                .email("test@example.com")
                .fullName("Test User")
                .password("encodedPassword")
                .profileImageURL("profileImageURL")
                .userRole(UserRole.RECRUIT)
                .build();
    }

    @Test
    void register_ShouldCreateUser_WhenUserDoesNotExist() {
        HttpServletResponse response = mock(HttpServletResponse.class);

        when(userRepository.findByUsernameOrEmail(registerRequest.getUsername(), registerRequest.getEmail()))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User registeredUser = authService.register(registerRequest, response);

        assertNotNull(registeredUser);
        assertEquals("testUser", registeredUser.getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void login_ShouldReturnUser_WhenCredentialsAreValid() {
        HttpServletResponse response = mock(HttpServletResponse.class);
        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())).thenReturn(true);

        User loggedInUser = authService.login(loginRequest, response);

        assertNotNull(loggedInUser);
        assertEquals("testUser", loggedInUser.getUsername());
    }

    @Test
    void register_ShouldThrowException_WhenUserAlreadyExists() {
        HttpServletResponse response = mock(HttpServletResponse.class);
        when(userRepository.findByUsernameOrEmail(registerRequest.getUsername(), registerRequest.getEmail()))
                .thenReturn(Optional.of(user));

        assertThrows(UserAlreadyExistsException.class, () -> authService.register(registerRequest, response));
    }

    @Test
    void login_ShouldThrowException_WhenUserDoesNotExist() {
        HttpServletResponse response = mock(HttpServletResponse.class);
        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> authService.login(loginRequest, response));
    }

    @Test
    void login_ShouldThrowException_WhenPasswordIsIncorrect() {
        HttpServletResponse response = mock(HttpServletResponse.class);
        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())).thenReturn(false);

        assertThrows(UserNotFoundException.class, () -> authService.login(loginRequest, response));
    }
}
