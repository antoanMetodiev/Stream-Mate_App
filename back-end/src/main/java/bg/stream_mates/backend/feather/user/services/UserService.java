package bg.stream_mates.backend.feather.user.services;

import bg.stream_mates.backend.exception.EmptyUsernameException;
import bg.stream_mates.backend.exception.UserNotFoundException;
import bg.stream_mates.backend.feather.user.handlers.FriendRequestNotificationHandler;
import bg.stream_mates.backend.feather.user.models.dtos.EditProfileRequest;
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
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService extends TextWebSocketHandler {

    private final UserRepository userRepository;
    private final UserImageRepository userImageRepository;
    private final FriendRepository friendRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final FriendRequestNotificationHandler friendRequestNotificationHandler;

    @Autowired
    public UserService(UserRepository userRepository,
                       UserImageRepository userImageRepository,
                       FriendRepository friendRepository,
                       FriendRequestRepository friendRequestRepository,
                       FriendRequestNotificationHandler friendRequestNotificationHandler) {

        this.userRepository = userRepository;
        this.userImageRepository = userImageRepository;
        this.friendRepository = friendRepository;
        this.friendRequestRepository = friendRequestRepository;
        this.friendRequestNotificationHandler = friendRequestNotificationHandler;
    }

    @Transactional
    @Retryable(
            value = {DataIntegrityViolationException.class},
            maxAttempts = 2,
            backoff = @Backoff(delay = 2000)
    )
    public void sendFriendRequest(String senderUsername, String receiverUsername) throws IOException {
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new UserNotFoundException("User Sender not found!"));

        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new UserNotFoundException("User Receiver not found!"));

        // Проверявам си дали вече има заявка, въобще, понеже може да има и да не трябва да се прави нищо!
        boolean exists = friendRequestRepository.existsBySenderAndReceiver(sender, receiver);
        if (exists) return;

        // Ако не съществува такава заявка, значи мога да създавам:
        FriendRequest friendRequest = FriendRequest.builder()
                .sender(sender)
                .senderUsername(sender.getUsername())
                .senderNames(sender.getFullName())
                .senderImgURL(sender.getProfileImageURL())
                .receiver(receiver)
                .receiverUsername(receiver.getUsername())
                .receiverNames(receiver.getFullName())
                .receiverImgURL(receiver.getProfileImageURL())
                .sentAt(Instant.now())
                .build();

        friendRequestRepository.save(friendRequest);
        friendRequestNotificationHandler.sendFriendRequestNotification(friendRequest, receiverUsername);
    }

    @Transactional
    @Retryable(
            value = {DataIntegrityViolationException.class},
            maxAttempts = 2,
            backoff = @Backoff(delay = 2000)
    )
    public void rejectReceivedFriendRequest(String senderUsername, String receiverUsername) throws IOException {
        if (senderUsername.isEmpty() || receiverUsername.isEmpty()) return;
        this.friendRequestRepository.deleteBySenderUsernameAndReceiverUsername(senderUsername, receiverUsername);
        this.friendRequestNotificationHandler.rejectReceivedFriendRequestNotification(receiverUsername, senderUsername);
    }


    @Transactional
    @Retryable(
            value = {DataIntegrityViolationException.class},
            maxAttempts = 2,
            backoff = @Backoff(delay = 2000)
    )
    public void rejectSendedFriendRequest(String senderUsername, String receiverUsername) throws IOException {
        if (senderUsername.isEmpty() || receiverUsername.isEmpty()) return;
        this.friendRequestRepository.deleteBySenderUsernameAndReceiverUsername(senderUsername, receiverUsername);
        this.friendRequestNotificationHandler.rejectSendedFriendRequestNotification(receiverUsername);
    }

    @Transactional
    public User getUserDetails(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new EmptyUsernameException("Username cannot be null or empty!");
        }

        User searchedUser = this.userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));

        // Взимам си допълнително снимките и приятелите!
        searchedUser.getImages().addAll(userImageRepository.findByOwnerId(searchedUser.getId()));
        searchedUser.getFriends().addAll(friendRepository.findFriendsByUserId(searchedUser.getId()));
        return searchedUser;
    }

    public List<SearchedUserResponse> getLastTenUsers() {
        return mapToSearchedUserList(this.userRepository.findLastTenUsers());
    }

    public List<SearchedUserResponse> getUsersByPattern(String pattern) {
        if (pattern == null || pattern.trim().isEmpty()) return new ArrayList<SearchedUserResponse>();
        return mapToSearchedUserList(this.userRepository.searchUsersByPattern(pattern));
    }

    @Transactional
    @Retryable(
            value = {DataIntegrityViolationException.class},
            maxAttempts = 2,
            backoff = @Backoff(delay = 2000)
    )
    public void addUserImage(@Valid UserImageUploadRequest userImage) {
        User user = userRepository.findById(UUID.fromString(userImage.getOwnerId()))
                .orElseThrow(() -> new UserNotFoundException("User is not found!"));

        if (user.getImages() == null) {
            user.setImages(new ArrayList<>());
        }

        UserImageType userImageType = userImage.getUserImageType().equals("WALLPAPER")
                ? UserImageType.WALLPAPER
                : UserImageType.PLAIN;

        UserImage img = UserImage.builder()
                .imageUrl(userImage.getImageUrl())
                .description(userImage.getDescription())
                .userImageType(userImageType)
                .owner(user)
                .build();

        user.getImages().add(img);
        userRepository.save(user);
    }

    @Transactional
    @Retryable(
            value = {DataIntegrityViolationException.class},
            maxAttempts = 2,
            backoff = @Backoff(delay = 2000)
    )
    public Friend acceptFriendRequest(String senderUsername, String receiverUsername) {
        this.friendRequestRepository.deleteBySenderUsernameAndReceiverUsername(receiverUsername, senderUsername);

        User myData = this.userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new UserNotFoundException("Sender user not found"));

        User receiverData = this.userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new UserNotFoundException("Receiver user not found"));

        // Пазеща проверка, ако случайно потребителя вече го имам в приятели:
        if (checkIfIContainFriendAlready(myData, receiverUsername)) return null;

        // Проверка дали приятелят вече съществува в базата
        Friend friendForMyData = this.friendRepository.findByUsername(receiverData.getUsername())
                .orElseGet(() -> Friend.builder()
                        .fullName(receiverData.getFullName())
                        .username(receiverData.getUsername())
                        .profileImageURL(receiverData.getProfileImageURL())
                        .realUserId(receiverData.getId())
                        .build());

        Friend friendForReceiverData = this.friendRepository.findByUsername(myData.getUsername())
                .orElseGet(() -> Friend.builder()
                        .fullName(myData.getFullName())
                        .username(myData.getUsername())
                        .profileImageURL(myData.getProfileImageURL())
                        .realUserId(myData.getId())
                        .build());

        this.friendRepository.saveAll(Arrays.asList(friendForMyData, friendForReceiverData));
        friendForMyData = this.friendRepository.findByUsername(receiverData.getUsername()).orElseThrow(() -> new RuntimeException("Receiver not found"));
        friendForReceiverData = this.friendRepository.findByUsername(myData.getUsername()).orElseThrow(() -> new RuntimeException("Receiver not found"));

        myData.getFriends().add(friendForMyData);
        receiverData.getFriends().add(friendForReceiverData);

        // Hibernate ще управлява записа, така че не е нужно ръчно да съхранявам Friends, ръчно
        this.userRepository.saveAll(Arrays.asList(myData, receiverData));
        return friendForMyData;
    }

    public boolean checkIfIContainFriendAlready(User myData, String receiverUsername) {
        return !myData.getFriends().stream().filter(friend -> friend.getUsername()
                .equals(receiverUsername)).collect(Collectors.toList()).isEmpty();
    }

    @Transactional
    @Retryable(
            value = {DataIntegrityViolationException.class},
            maxAttempts = 2,
            backoff = @Backoff(delay = 2000)
    )
    public void editProfileData(@Valid EditProfileRequest editProfileRequest) {
        User myData = this.userRepository.findById(UUID.fromString(editProfileRequest.getId()))
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Friend myDataInFriendsTable = this.friendRepository.findByRealUserId(UUID.fromString(editProfileRequest.getId()))
                .orElse(null);

        if (myDataInFriendsTable != null && !editProfileRequest.getUsername().trim().isEmpty()) {
            myDataInFriendsTable.setUsername(editProfileRequest.getUsername());
        }
        if (myDataInFriendsTable != null && !editProfileRequest.getFullName().trim().isEmpty()) {
            myDataInFriendsTable.setFullName(editProfileRequest.getFullName());
        }

        if (!editProfileRequest.getUsername().trim().isEmpty()) myData.setUsername(editProfileRequest.getUsername());
        if (!editProfileRequest.getEmail().trim().isEmpty()) myData.setEmail(editProfileRequest.getEmail());
        if (!editProfileRequest.getFullName().trim().isEmpty()) myData.setFullName(editProfileRequest.getFullName());
        if (!editProfileRequest.getPassword().trim().isEmpty()) myData.setPassword(editProfileRequest.getPassword());

        if (myDataInFriendsTable != null) friendRepository.save(myDataInFriendsTable);
        this.userRepository.save(myData);
    }

    public User getUserById(String id) {
        if (id == null || id.trim().isEmpty()) return new User();
        return this.userRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Transactional
    @Retryable(
            value = {DataIntegrityViolationException.class},
            maxAttempts = 2,
            backoff = @Backoff(delay = 2000)
    )
    public void changeUserMainPhotos(EditUserMainPhotos editUserMainPhotos) {
        UUID myId = UUID.fromString(editUserMainPhotos.getUserId());

        User myData = this.userRepository.findById(myId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Friend myDataInFriendsTable = this.friendRepository.findByRealUserId(myId).orElse(null);

        boolean isUpdated = false;
        if (editUserMainPhotos.getUserUrl() != null && !editUserMainPhotos.getUserUrl().trim().isEmpty()) {
            myData.setProfileImageURL(editUserMainPhotos.getUserUrl());
            if (myDataInFriendsTable != null) {
                myDataInFriendsTable.setProfileImageURL(editUserMainPhotos.getUserUrl());
            }

            isUpdated = true;
        }

        if (editUserMainPhotos.getBackgroundUrl() != null && !editUserMainPhotos.getBackgroundUrl().trim().isEmpty()) {
            myData.setBackgroundImageURL(editUserMainPhotos.getBackgroundUrl());
            isUpdated = true;
        }

        if (isUpdated) {
            this.userRepository.save(myData);
            if (myDataInFriendsTable != null) this.friendRepository.save(myDataInFriendsTable);
        }
    }

    private List<SearchedUserResponse> mapToSearchedUserList(List<Object[]> results) {
        List<SearchedUserResponse> searchedUserList = new ArrayList<>();
        results.forEach(result -> {
            String username = (String) result[0];  // първи елемент
            String imgURL = (String) result[1];    // втори елемент
            String fullName = (String) result[2]; // трети елемент

            searchedUserList.add(SearchedUserResponse.builder()
                    .fullName(fullName)
                    .username(username)
                    .imgURL(imgURL)
                    .build());
        });

        return searchedUserList;
    }
}
