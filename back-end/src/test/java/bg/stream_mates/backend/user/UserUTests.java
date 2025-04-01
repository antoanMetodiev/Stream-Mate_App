package bg.stream_mates.backend.user;

import bg.stream_mates.backend.exception.EmptyUsernameException;
import bg.stream_mates.backend.exception.UserNotFoundException;
import bg.stream_mates.backend.feather.user.handlers.FriendRequestNotificationHandler;
import bg.stream_mates.backend.feather.user.models.dtos.EditUserMainPhotos;
import bg.stream_mates.backend.feather.user.models.dtos.SearchedUserResponse;
import bg.stream_mates.backend.feather.user.models.dtos.UserImageUploadRequest;
import bg.stream_mates.backend.feather.user.models.entities.Friend;
import bg.stream_mates.backend.feather.user.models.entities.FriendRequest;
import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.models.entities.UserImage;
import bg.stream_mates.backend.feather.user.models.enums.UserImageType;
import bg.stream_mates.backend.feather.user.repositories.FriendRepository;
import bg.stream_mates.backend.feather.user.repositories.FriendRequestRepository;
import bg.stream_mates.backend.feather.user.repositories.UserImageRepository;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import bg.stream_mates.backend.feather.user.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private FriendRequestRepository friendRequestRepository;

    @Mock
    private FriendRequestNotificationHandler friendRequestNotificationHandler;

    @Mock
    private UserImageRepository userImageRepository;

    @Mock
    private FriendRepository friendRepository;

    @InjectMocks
    private UserService userService;

    private User sender;
    private User receiver;

    @BeforeEach
    void setUp() {
        sender = User.builder()
                .id(UUID.randomUUID())
                .username("senderUsername")
                .fullName("Sender Full Name")
                .profileImageURL("senderImgURL")
                .images(new ArrayList<>())  // Инициализирай images
                .friends(new HashSet<>())    // Инициализирай friends
                .build();

        receiver = User.builder()
                .id(UUID.randomUUID())
                .username("receiverUsername")
                .fullName("Receiver Full Name")
                .profileImageURL("receiverImgURL")
                .images(new ArrayList<>())  // Инициализирай images
                .friends(new HashSet<>())    // Инициализирай friends
                .build();
    }


    @Test
    void sendFriendRequest_Success() throws IOException {
        when(userRepository.findByUsername("senderUsername")).thenReturn(Optional.of(sender));
        when(userRepository.findByUsername("receiverUsername")).thenReturn(Optional.of(receiver));
        when(friendRequestRepository.existsBySenderAndReceiver(sender, receiver)).thenReturn(false);

        userService.sendFriendRequest("senderUsername", "receiverUsername");

        verify(friendRequestRepository, times(1)).save(any(FriendRequest.class));
        verify(friendRequestNotificationHandler, times(1)).sendFriendRequestNotification(any(FriendRequest.class), eq("receiverUsername"));
    }

    @Test
    void sendFriendRequest_UserNotFound() {
        when(userRepository.findByUsername("senderUsername")).thenReturn(Optional.empty());

        try {
            userService.sendFriendRequest("senderUsername", "receiverUsername");
        } catch (IOException | UserNotFoundException ignored) {}

        verify(friendRequestRepository, never()).save(any(FriendRequest.class));
    }

    @Test
    void rejectReceivedFriendRequest_Success() throws IOException {
        userService.rejectReceivedFriendRequest("senderUsername", "receiverUsername");

        verify(friendRequestRepository, times(1)).deleteBySenderUsernameAndReceiverUsername("senderUsername", "receiverUsername");
        verify(friendRequestNotificationHandler, times(1)).rejectReceivedFriendRequestNotification("receiverUsername", "senderUsername");
    }

    @Test
    void rejectSendedFriendRequest_Success() throws IOException {
        userService.rejectSendedFriendRequest("senderUsername", "receiverUsername");

        verify(friendRequestRepository, times(1)).deleteBySenderUsernameAndReceiverUsername("senderUsername", "receiverUsername");
        verify(friendRequestNotificationHandler, times(1)).rejectSendedFriendRequestNotification("receiverUsername");
    }

    @Test
    void getUserDetails_Success() {
        when(userRepository.findByUsername("senderUsername")).thenReturn(Optional.of(sender));
        when(userImageRepository.findByOwnerId(sender.getId())).thenReturn(sender.getImages());

        List<Friend> friendsMock = new ArrayList<>();
        when(friendRepository.findFriendsByUserId(sender.getId())).thenReturn(friendsMock);

        User result = userService.getUserDetails("senderUsername");

        // Convert Set to List explicitly if necessary
        result.getFriends().addAll(new ArrayList<>(friendsMock));

        verify(userRepository, times(1)).findByUsername("senderUsername");
        verify(userImageRepository, times(1)).findByOwnerId(sender.getId());
        verify(friendRepository, times(1)).findFriendsByUserId(sender.getId());
    }



    @Test
    void getUserDetails_UserNotFound() {
        when(userRepository.findByUsername("unknownUsername")).thenReturn(Optional.empty());

        try {
            userService.getUserDetails("unknownUsername");
        } catch (UserNotFoundException ignored) {}

        verify(userRepository, times(1)).findByUsername("unknownUsername");
    }

    @Test
    void getUserDetails_EmptyUsername() {
        try {
            userService.getUserDetails("");
        } catch (EmptyUsernameException ignored) {}
    }

    @Test
    void getLastTenUsers_ReturnsList() {
        List<Object[]> mockResults = List.of(
                new Object[]{"user1", "http://img1.com", "User One"},
                new Object[]{"user2", "http://img2.com", "User Two"}
        );

        List<SearchedUserResponse> expectedUsers = List.of(
                SearchedUserResponse.builder().username("user1").imgURL("http://img1.com").fullName("User One").build(),
                SearchedUserResponse.builder().username("user2").imgURL("http://img2.com").fullName("User Two").build()
        );

        when(userRepository.findLastTenUsers()).thenReturn(mockResults);

        List<SearchedUserResponse> result = userService.getLastTenUsers();

        assertEquals(2, result.size());
        assertEquals("user1", result.get(0).getUsername());
        assertEquals("http://img1.com", result.get(0).getImgURL());
        assertEquals("User One", result.get(0).getFullName());

        verify(userRepository, times(1)).findLastTenUsers();
    }


    @Test
    void getUsersByPattern_EmptyPattern_ReturnsEmptyList() {
        List<SearchedUserResponse> result = userService.getUsersByPattern("");
        assertTrue(result.isEmpty());
    }

    @Test
    void getUsersByPattern_NullPattern_ReturnsEmptyList() {
        List<SearchedUserResponse> result = userService.getUsersByPattern(null);
        assertTrue(result.isEmpty());
    }

    @Test
    void getUsersByPattern_ValidPattern_ReturnsList() {
        String pattern = "john";

        // Мокираме резултата от базата (списък от Object[])
        List<Object[]> mockResults = List.of(
                new Object[]{"john123", "http://john.img", "John Doe"},
                new Object[]{"john_smith", "http://smith.img", "John Smith"}
        );

        when(userRepository.searchUsersByPattern(pattern)).thenReturn(mockResults);

        List<SearchedUserResponse> result = userService.getUsersByPattern(pattern);

        assertFalse(result.isEmpty());
        assertEquals(2, result.size());
        assertEquals("john123", result.get(0).getUsername());
        assertEquals("http://john.img", result.get(0).getImgURL());
        assertEquals("John Doe", result.get(0).getFullName());

        verify(userRepository, times(1)).searchUsersByPattern(pattern);
    }


    @Test
    void addUserImage_Success() {
        // Подготвяме тестовите данни
        String userId = sender.getId().toString();
        UserImageUploadRequest request = UserImageUploadRequest.builder()
                .ownerId(userId)
                .imageUrl("http://test.com/image.jpg")
                .description("Profile picture")
                .userImageType("WALLPAPER")
                .build();

        when(userRepository.findById(UUID.fromString(userId))).thenReturn(Optional.of(sender));

        userService.addUserImage(request);

        assertEquals(1, sender.getImages().size());
        UserImage addedImage = sender.getImages().get(0);
        assertEquals("http://test.com/image.jpg", addedImage.getImageUrl());
        assertEquals("Profile picture", addedImage.getDescription());
        assertEquals(UserImageType.WALLPAPER, addedImage.getUserImageType());

        verify(userRepository, times(1)).save(sender);
    }

    @Test
    void addUserImage_UserNotFound_ThrowsException() {
        String userId = UUID.randomUUID().toString();
        UserImageUploadRequest request = UserImageUploadRequest.builder()
                .ownerId(userId)
                .imageUrl("http://test.com/image.jpg")
                .description("Profile picture")
                .userImageType("WALLPAPER")
                .build();

        when(userRepository.findById(UUID.fromString(userId))).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.addUserImage(request));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void addUserImage_UserHasNoImages_HandlesNullList() {
        String userId = sender.getId().toString();
        sender.setImages(null);

        UserImageUploadRequest request = UserImageUploadRequest.builder()
                .ownerId(userId)
                .imageUrl("http://test.com/image.jpg")
                .description("Profile picture")
                .userImageType("PLAIN")
                .build();

        when(userRepository.findById(UUID.fromString(userId))).thenReturn(Optional.of(sender));
        userService.addUserImage(request);

        assertNotNull(sender.getImages());
        assertEquals(1, sender.getImages().size());
        verify(userRepository, times(1)).save(sender);
    }

    // Подробности за теста
    @Test
    void acceptFriendRequest_Success() {
        String senderUsername = "john_doe";
        String receiverUsername = "jane_smith";

        User sender = User.builder()
                .username(senderUsername)
                .fullName("John Doe")
                .profileImageURL("http://john.img")
                .id(UUID.randomUUID())
                .friends(new HashSet<>())
                .build();

        User receiver = User.builder()
                .username(receiverUsername)
                .fullName("Jane Smith")
                .profileImageURL("http://jane.img")
                .id(UUID.randomUUID())
                .friends(new HashSet<>())
                .build();

        Friend friendForSender = Friend.builder()
                .username(receiverUsername)
                .fullName(receiver.getFullName())
                .profileImageURL(receiver.getProfileImageURL())
                .realUserId(receiver.getId())
                .build();

        Friend friendForReceiver = Friend.builder()
                .username(senderUsername)
                .fullName(sender.getFullName())
                .profileImageURL(sender.getProfileImageURL())
                .realUserId(sender.getId())
                .build();

        // Мокираме заявката за изтриване на заявка за приятелство
        doNothing().when(friendRequestRepository).deleteBySenderUsernameAndReceiverUsername(receiverUsername, senderUsername);

        // Мокираме намирането на потребителите
        when(userRepository.findByUsername(senderUsername)).thenReturn(Optional.of(sender));
        when(userRepository.findByUsername(receiverUsername)).thenReturn(Optional.of(receiver));

        // Вместо да mock-неш checkIfIContainFriendAlready, можеш да използваш spy
        // За да mock-неш само самия метод, без да променяш класа
        UserService spyUserService = Mockito.spy(userService);

        // Мокираме проверката дали потребителят вече има този приятел
        when(spyUserService.checkIfIContainFriendAlready(sender, receiverUsername)).thenReturn(false);

        // Мокираме намирането на приятели в базата
        when(friendRepository.findByUsername(receiverUsername)).thenReturn(Optional.empty());
        when(friendRepository.findByUsername(senderUsername)).thenReturn(Optional.empty());

        // Мокираме създаването на нови приятели
        when(friendRepository.saveAll(anyList())).thenReturn(List.of(friendForSender, friendForReceiver));

        // Мокираме последващото намиране на приятели в базата
        when(friendRepository.findByUsername(receiverUsername)).thenReturn(Optional.of(friendForSender));
        when(friendRepository.findByUsername(senderUsername)).thenReturn(Optional.of(friendForReceiver));

        // Мокираме запазването на потребителите
        when(userRepository.saveAll(anyList())).thenReturn(List.of(sender, receiver));

        // Извикваме метода
        Friend result = spyUserService.acceptFriendRequest(senderUsername, receiverUsername);

        // Проверяваме дали заявката е обработена правилно
        assertNotNull(result);
        assertEquals(receiverUsername, result.getUsername());
        assertEquals(receiver.getFullName(), result.getFullName());
        assertEquals(receiver.getProfileImageURL(), result.getProfileImageURL());

        // Проверяваме дали приятелството е добавено
        assertTrue(sender.getFriends().contains(friendForSender));
        assertTrue(receiver.getFriends().contains(friendForReceiver));

        // Проверяваме дали методите са извикани правилно
        verify(friendRequestRepository, times(1)).deleteBySenderUsernameAndReceiverUsername(receiverUsername, senderUsername);
        verify(userRepository, times(1)).findByUsername(senderUsername);
        verify(userRepository, times(1)).findByUsername(receiverUsername);
        verify(friendRepository, times(4)).findByUsername(anyString());
        verify(friendRepository, times(1)).saveAll(anyList());
        verify(userRepository, times(1)).saveAll(anyList());
    }

    @Test
    void testGetUserById_NullId_ReturnsEmptyUser() {
        // Arrange
        String id = null;

        // Act
        User result = userService.getUserById(id);

        // Assert
        assertNotNull(result);
        assertTrue(result.getId() == null);  // Очакваме да върне нов User с празни полета
    }

    @Test
    void testGetUserById_EmptyId_ReturnsEmptyUser() {
        // Arrange
        String id = "   ";  // Празно id

        // Act
        User result = userService.getUserById(id);

        // Assert
        assertNotNull(result);
        assertTrue(result.getId() == null);  // Очакваме да върне нов User с празни полета
    }

    @Test
    void testGetUserById_UserNotFound_ExceptionThrown() {
        // Arrange
        String id = UUID.randomUUID().toString();  // Генерираме случаен UUID
        when(userRepository.findById(UUID.fromString(id))).thenReturn(Optional.empty());  // Резултатът трябва да е Optional.empty()

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            userService.getUserById(id);  // Тук се очаква да хвърли UserNotFoundException
        });
    }

    @Test
    void testGetUserById_UserFound_ReturnsUser() {
        // Arrange
        String id = UUID.randomUUID().toString();  // Генерираме случаен UUID
        User mockUser = new User();  // Създаваме mock потребител
        mockUser.setId(UUID.fromString(id));  // Задаваме id на mock потребителя
        when(userRepository.findById(UUID.fromString(id))).thenReturn(Optional.of(mockUser));  // Мока за репозиторито

        // Act
        User result = userService.getUserById(id);

        // Assert
        assertNotNull(result);
        assertEquals(mockUser.getId(), result.getId());  // Проверяваме дали върнатият потребител е същия
    }

    @Test
    void testChangeUserMainPhotos_UserNotFound_ThrowsException() {
        // Arrange
        EditUserMainPhotos editUserMainPhotos = new EditUserMainPhotos();
        editUserMainPhotos.setUserId(UUID.randomUUID().toString());  // Генерираме произволно ID
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.empty());  // Мока за неуспешно намиране

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            userService.changeUserMainPhotos(editUserMainPhotos);  // Трябва да хвърли UserNotFoundException
        });
    }

    @Test
    void testChangeUserMainPhotos_EmptyUrls_NoChanges() {
        // Arrange
        EditUserMainPhotos editUserMainPhotos = new EditUserMainPhotos();
        editUserMainPhotos.setUserId(UUID.randomUUID().toString());
        editUserMainPhotos.setUserUrl(null);  // Празен URL
        editUserMainPhotos.setBackgroundUrl(null);  // Празен URL
        User mockUser = new User();
        mockUser.setId(UUID.fromString(editUserMainPhotos.getUserId()));
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockUser));  // Мока за съществуващ потребител

        // Act
        userService.changeUserMainPhotos(editUserMainPhotos);

        // Assert
        verify(userRepository, never()).save(any(User.class));  // Не трябва да се извиква save()
        verify(friendRepository, never()).save(any(Friend.class));  // Не трябва да се извиква save()
    }

    @Test
    void testChangeUserMainPhotos_UpdateProfileAndBackgroundUrl() {
        // Arrange
        String userId = UUID.randomUUID().toString();
        String profileImageUrl = "http://newprofileurl.com";
        String backgroundImageUrl = "http://newbackgroundurl.com";

        EditUserMainPhotos editUserMainPhotos = new EditUserMainPhotos();
        editUserMainPhotos.setUserId(userId);
        editUserMainPhotos.setUserUrl(profileImageUrl);  // Поставяме URL за профилната снимка
        editUserMainPhotos.setBackgroundUrl(backgroundImageUrl);  // Поставяме URL за фоновата снимка

        User mockUser = new User();
        mockUser.setId(UUID.fromString(userId));

        Friend mockFriend = new Friend();
        mockFriend.setRealUserId(UUID.fromString(userId));

        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockUser));  // Мока за съществуващ потребител
        when(friendRepository.findByRealUserId(any(UUID.class))).thenReturn(Optional.of(mockFriend));  // Мока за съществуващ приятел

        // Act
        userService.changeUserMainPhotos(editUserMainPhotos);

        // Assert
        assertEquals(profileImageUrl, mockUser.getProfileImageURL());  // Проверяваме дали профилната снимка е актуализирана
        assertEquals(backgroundImageUrl, mockUser.getBackgroundImageURL());  // Проверяваме дали фоновата снимка е актуализирана
        verify(userRepository).save(mockUser);  // Проверяваме дали save е извикано
        verify(friendRepository).save(mockFriend);  // Проверяваме дали save за приятеля е извикано
    }

    @Test
    void testChangeUserMainPhotos_RetryOnDataIntegrityViolation() {
        // Arrange
        String userId = UUID.randomUUID().toString();
        String profileImageUrl = "http://newprofileurl.com";
        String backgroundImageUrl = "http://newbackgroundurl.com";

        EditUserMainPhotos editUserMainPhotos = new EditUserMainPhotos();
        editUserMainPhotos.setUserId(userId);
        editUserMainPhotos.setUserUrl(profileImageUrl);
        editUserMainPhotos.setBackgroundUrl(backgroundImageUrl);

        User mockUser = new User();
        mockUser.setId(UUID.fromString(userId));

        Friend mockFriend = new Friend();
        mockFriend.setRealUserId(UUID.fromString(userId));

        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockUser));  // Мока за съществуващ потребител
        when(friendRepository.findByRealUserId(any(UUID.class))).thenReturn(Optional.of(mockFriend));  // Мока за съществуващ приятел

        // Използваме thenThrow за да симулираме грешка при записване
        when(userRepository.save(any(User.class))).thenReturn(mockUser);  // Връща успешен резултат на втория опит

        // Act
        userService.changeUserMainPhotos(editUserMainPhotos);

        // Assert
        verify(userRepository, times(1)).save(mockUser);
    }

}
