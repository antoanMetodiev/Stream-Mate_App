package bg.stream_mates.backend.user;

import bg.stream_mates.backend.exception.UserAlreadyExistsException;
import bg.stream_mates.backend.feather.user.models.dtos.LoginRequest;
import bg.stream_mates.backend.feather.user.models.dtos.RegisterRequest;
import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.models.enums.UserRole;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import bg.stream_mates.backend.feather.user.services.AuthService;
import bg.stream_mates.backend.security.JwtTokenUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
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

    @Test
    void givenValidToken_whenLogout_thenShouldInvalidateCookieAndDeleteTokenFromRedis() {
        // Given:
        String token = "generatedJwtToken123";
        String id = "randomId";

        // Мокваме статичния метод на JwtTokenUtil
        try (MockedStatic<JwtTokenUtil> mockedStatic = Mockito.mockStatic(JwtTokenUtil.class)) {
            mockedStatic.when(() -> JwtTokenUtil.extractId(token)).thenReturn(id);

            // Мокваме request и response
            HttpServletRequest request = mock(HttpServletRequest.class);
            HttpServletResponse response = mock(HttpServletResponse.class);

            // Мокваме, че има бисквитка с правилния токен
            Cookie cookie = new Cookie("JWT_TOKEN", token);
            when(request.getCookies()).thenReturn(new Cookie[] { cookie });

            // When: Извикваме logout метода
            authService.logout(request, response);

            // Then: Проверяваме дали токенът е изтрит от Redis
            verify(redisTemplate, times(1)).delete(id);

            // Верифицираме дали бисквитката е инвалидирана
            ArgumentCaptor<Cookie> cookieCaptor = ArgumentCaptor.forClass(Cookie.class);
            verify(response, times(1)).addCookie(cookieCaptor.capture());

            Cookie invalidCookie = cookieCaptor.getValue();
            assertEquals("JWT_TOKEN", invalidCookie.getName());
            assertEquals("", invalidCookie.getValue());  // Токенът трябва да е празен
            assertEquals(0, invalidCookie.getMaxAge());  // Трябва да бъде изтрит веднага
            assertTrue(invalidCookie.isHttpOnly());      // Бисквитката трябва да е HttpOnly
            assertTrue(invalidCookie.getSecure());       // Бисквитката трябва да е Secure
            assertEquals("/", invalidCookie.getPath()); // Пътят трябва да е '/'
        }
    }

    @Test
    void givenExistingUser_whenLogin_thenShouldLoginSuccessfully() {
        // Given:
        LoginRequest loginRequest = LoginRequest.builder()
                .username("random_ivanov")
                .password("securePass123")
                .build();

        String hashedPassword = "hashedPassword123";
        UUID randomUUID = UUID.randomUUID();
        User existingUser = User.builder()
                .id(randomUUID)
                .username("random_ivanov")
                .email("random_ivanov@gmail.com")
                .fullName("Random Ivanov")
                .password(hashedPassword)
                .profileImageURL("http://image.url")
                .userRole(UserRole.RECRUIT)
                .build();

        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), hashedPassword)).thenReturn(true);

        String generatedToken = "generatedJwtToken123";
        try (MockedStatic<JwtTokenUtil> mockedStatic = Mockito.mockStatic(JwtTokenUtil.class)) {
            mockedStatic.when(() -> JwtTokenUtil.generateToken(String.valueOf(existingUser.getId())))
                    .thenReturn(generatedToken);

            // Моквам RedisTemplate и ValueOperations
            ValueOperations<String, String> mockValueOps = mock(ValueOperations.class);
            // Казвам, че при извикване на set() да не се случва нищо!
            doNothing().when(mockValueOps).set(anyString(), anyString(), anyLong(), any());
            when(redisTemplate.opsForValue()).thenReturn(mockValueOps);

            HttpServletResponse response = mock(HttpServletResponse.class);
            User logedUser = authService.login(loginRequest, response);

            assertNotNull(logedUser);
            assertFalse(logedUser.getId().toString().isEmpty());
            assertEquals(existingUser, logedUser);

            verify(response, times(1)).addCookie(any(Cookie.class));
            verify(redisTemplate.opsForValue(), times(1)).set(anyString(), anyString(), anyLong(), any());
            verify(passwordEncoder, times(1)).matches(anyString(), anyString());
        }
    }

    @Test
    void givenNonExistingUser_whenLogin_thenShouldThrowException() {
        // Given:
        LoginRequest loginRequest = LoginRequest.builder()
                .username("non_existing_user")
                .password("randomPassword")
                .build();

        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.empty());
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest, mock(HttpServletResponse.class));
        });

        assertEquals("User with this username or password does not exist!", thrown.getMessage());
    }

    @Test
    void givenIncorrectPassword_whenLogin_thenShouldThrowException() {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("random_ivanov")
                .password("incorrectPassword")
                .build();

        String hashedPassword = "hashedPassword123";
        UUID randomUUID = UUID.randomUUID();
        User existingUser = User.builder()
                .id(randomUUID)
                .username("random_ivanov")
                .email("random_ivanov@gmail.com")
                .fullName("Random Ivanov")
                .password(hashedPassword)
                .profileImageURL("http://image.url")
                .userRole(UserRole.RECRUIT)
                .build();

        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), hashedPassword)).thenReturn(false);
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest, mock(HttpServletResponse.class));
        });

        assertEquals("User with this username or password does not exist!", thrown.getMessage());
    }

    @Test
    void givenUnexistingUser_whenRegister_thenShouldRegister() {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("random_ivanov")
                .email("random_ivanov@gmail.com")
                .fullName("Random Ivanov")
                .password("securePass123")
                .profileImageURL("http://image.url")
                .build();

        String hashedPassword = "hashedPassword123";
        when(userRepository.findByUsernameOrEmail(registerRequest.getUsername(), registerRequest.getEmail()))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn(hashedPassword);

        User savedUser = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .fullName(registerRequest.getFullName())
                .password(hashedPassword)
                .profileImageURL(registerRequest.getProfileImageURL())
                .userRole(UserRole.RECRUIT)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        String generatedToken = "generatedJwtToken123";
        try (MockedStatic<JwtTokenUtil> mockedStatic = Mockito.mockStatic(JwtTokenUtil.class)) {
            mockedStatic.when(() -> JwtTokenUtil.generateToken(String.valueOf(savedUser.getId())))
                    .thenReturn(generatedToken);

            ValueOperations<String, String> mockValueOps = mock(ValueOperations.class);
            doNothing().when(mockValueOps).set(anyString(), anyString(), anyLong(), any());
            when(redisTemplate.opsForValue()).thenReturn(mockValueOps);

            HttpServletResponse response = mock(HttpServletResponse.class);
            User registeredUser = authService.register(registerRequest, response);

            assertNotNull(registeredUser);
            assertEquals(registerRequest.getUsername(), registeredUser.getUsername());
            assertEquals(registerRequest.getEmail(), registeredUser.getEmail());
            assertEquals(registerRequest.getFullName(), registeredUser.getFullName());
            assertNotEquals(registerRequest.getPassword(), registeredUser.getPassword());  // Паролата трябва да е хеширана

            // Верифицираме дали save е извикан веднъж
            verify(userRepository, times(1)).save(any(User.class));

            // Верифицираме дали е добавен cookie в отговора
            verify(response, times(1)).addCookie(any(Cookie.class));
        }
    }

    @Test
    void givenExistingUsername_whenRegisterUser_thenThrowsUserAlreadyExistsException() {
        // Given:
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("random_ivanov")
                .email("random_ivanov@gmail.com")
                .fullName("Random Ivanov")
                .password("securePass123")
                .build();

        User existingUser = User.builder()
                .username("random_ivanov")
                .email("another_email@gmail.com")
                .fullName("Random Ivanov")
                .password("hashedPassword")
                .build();

        when(userRepository.findByUsernameOrEmail("random_ivanov", "random_ivanov@gmail.com"))
                .thenReturn(Optional.of(existingUser));


        // When & Then:
        HttpServletResponse response = mock(HttpServletResponse.class);
        assertThrows(UserAlreadyExistsException.class, () -> authService.register(registerRequest, response));
    }

    @Test
    void givenExistingEmail_whenRegisterUser_thenThrowsUserAlreadyExistsException() {
        // Given:
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("new_user")
                .email("random_ivanov@gmail.com")
                .fullName("Random Ivanov")
                .password("securePass123")
                .build();

        User existingUser = User.builder()
                .username("another_username")
                .email("random_ivanov@gmail.com")
                .fullName("Random Ivanov")
                .password("hashedPassword")
                .build();

        when(userRepository.findByUsernameOrEmail("new_user", "random_ivanov@gmail.com"))
                .thenReturn(Optional.of(existingUser));

        // When & Then:
        HttpServletResponse response = mock(HttpServletResponse.class);
        assertThrows(UserAlreadyExistsException.class, () -> authService.register(registerRequest, response));
    }
}
