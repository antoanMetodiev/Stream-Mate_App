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
                .images(new ArrayList<>())
                .friends(new HashSet<>())
                .build();

        receiver = User.builder()
                .id(UUID.randomUUID())
                .username("receiverUsername")
                .fullName("Receiver Full Name")
                .profileImageURL("receiverImgURL")
                .images(new ArrayList<>())
                .friends(new HashSet<>())
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

        doNothing().when(friendRequestRepository).deleteBySenderUsernameAndReceiverUsername(receiverUsername, senderUsername);
        when(userRepository.findByUsername(senderUsername)).thenReturn(Optional.of(sender));
        when(userRepository.findByUsername(receiverUsername)).thenReturn(Optional.of(receiver));

        UserService spyUserService = Mockito.spy(userService);

        when(spyUserService.checkIfIContainFriendAlready(sender, receiverUsername)).thenReturn(false);
        when(friendRepository.findByUsername(receiverUsername)).thenReturn(Optional.empty());
        when(friendRepository.findByUsername(senderUsername)).thenReturn(Optional.empty());
        when(friendRepository.saveAll(anyList())).thenReturn(List.of(friendForSender, friendForReceiver));
        when(friendRepository.findByUsername(receiverUsername)).thenReturn(Optional.of(friendForSender));
        when(friendRepository.findByUsername(senderUsername)).thenReturn(Optional.of(friendForReceiver));
        when(userRepository.saveAll(anyList())).thenReturn(List.of(sender, receiver));

        Friend result = spyUserService.acceptFriendRequest(senderUsername, receiverUsername);

        assertNotNull(result);
        assertEquals(receiverUsername, result.getUsername());
        assertEquals(receiver.getFullName(), result.getFullName());
        assertEquals(receiver.getProfileImageURL(), result.getProfileImageURL());

        assertTrue(sender.getFriends().contains(friendForSender));
        assertTrue(receiver.getFriends().contains(friendForReceiver));

        verify(friendRequestRepository, times(1)).deleteBySenderUsernameAndReceiverUsername(receiverUsername, senderUsername);
        verify(userRepository, times(1)).findByUsername(senderUsername);
        verify(userRepository, times(1)).findByUsername(receiverUsername);
        verify(friendRepository, times(4)).findByUsername(anyString());
        verify(friendRepository, times(1)).saveAll(anyList());
        verify(userRepository, times(1)).saveAll(anyList());
    }

    @Test
    void testGetUserById_NullId_ReturnsEmptyUser() {
        String id = null;

        User result = userService.getUserById(id);

        assertNotNull(result);
        assertTrue(result.getId() == null);
    }

    @Test
    void testGetUserById_EmptyId_ReturnsEmptyUser() {
        String id = "   ";
        User result = userService.getUserById(id);

        assertNotNull(result);
        assertTrue(result.getId() == null);
    }

    @Test
    void testGetUserById_UserNotFound_ExceptionThrown() {
        String id = UUID.randomUUID().toString();
        when(userRepository.findById(UUID.fromString(id))).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            userService.getUserById(id);
        });
    }

    @Test
    void testGetUserById_UserFound_ReturnsUser() {
        String id = UUID.randomUUID().toString();
        User mockUser = new User();
        mockUser.setId(UUID.fromString(id));
        when(userRepository.findById(UUID.fromString(id))).thenReturn(Optional.of(mockUser));

        User result = userService.getUserById(id);

        assertNotNull(result);
        assertEquals(mockUser.getId(), result.getId());
    }

    @Test
    void testChangeUserMainPhotos_UserNotFound_ThrowsException() {
        EditUserMainPhotos editUserMainPhotos = new EditUserMainPhotos();
        editUserMainPhotos.setUserId(UUID.randomUUID().toString());
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            userService.changeUserMainPhotos(editUserMainPhotos);
        });
    }

    @Test
    void testChangeUserMainPhotos_EmptyUrls_NoChanges() {
        EditUserMainPhotos editUserMainPhotos = new EditUserMainPhotos();
        editUserMainPhotos.setUserId(UUID.randomUUID().toString());
        editUserMainPhotos.setUserUrl(null);
        editUserMainPhotos.setBackgroundUrl(null);
        User mockUser = new User();
        mockUser.setId(UUID.fromString(editUserMainPhotos.getUserId()));
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockUser));

        userService.changeUserMainPhotos(editUserMainPhotos);

        verify(userRepository, never()).save(any(User.class));
        verify(friendRepository, never()).save(any(Friend.class));
    }

    @Test
    void testChangeUserMainPhotos_UpdateProfileAndBackgroundUrl() {
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

        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockUser));
        when(friendRepository.findByRealUserId(any(UUID.class))).thenReturn(Optional.of(mockFriend));

        userService.changeUserMainPhotos(editUserMainPhotos);

        assertEquals(profileImageUrl, mockUser.getProfileImageURL());
        assertEquals(backgroundImageUrl, mockUser.getBackgroundImageURL());
        verify(userRepository).save(mockUser);
        verify(friendRepository).save(mockFriend);
    }

    @Test
    void testChangeUserMainPhotos_RetryOnDataIntegrityViolation() {
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

        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockUser));
        when(friendRepository.findByRealUserId(any(UUID.class))).thenReturn(Optional.of(mockFriend));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        userService.changeUserMainPhotos(editUserMainPhotos);
        verify(userRepository, times(1)).save(mockUser);
    }
}