package bg.stream_mates.backend.feather.user.services;

import bg.stream_mates.backend.feather.user.handlers.FriendRequestNotificationHandler;
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
import org.springframework.stereotype.Service;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
    public void rejectReceivedFriendRequest(String senderUsername, String receiverUsername) throws IOException {
        this.friendRequestRepository.deleteBySenderUsernameAndReceiverUsername(senderUsername, receiverUsername);
        // TODO: realtime Web Socket уведомяване:

        this.friendRequestNotificationHandler.rejectReceivedFriendRequestNotification(receiverUsername, senderUsername);
    }

    @Transactional
    public void rejectSendedFriendRequest(String senderUsername, String receiverUsername) throws IOException {
        this.friendRequestRepository.deleteBySenderUsernameAndReceiverUsername(senderUsername, receiverUsername);

        this.friendRequestNotificationHandler.rejectSendedFriendRequestNotification(receiverUsername);
    }

    @Transactional
    public User getUserDetails(String username) {
        User searchedUser = this.userRepository.findByUsername(username).orElse(null);

        // Взимам си допълнително снимките и приятелите, понеже само сега ми трябват!
        searchedUser.getImages().addAll(userImageRepository.findByOwnerId(searchedUser.getId()));
        searchedUser.getFriends().addAll(friendRepository.findFriendsByUserId(searchedUser.getId()));
        return searchedUser;
    }

    public User getUserByUsername(String username) {
        return this.userRepository.findByUsername(username).orElse(null); // Always check for Optional presence
    }

    public List<SearchedUserResponse> getLastTenUsers() {
        return mapToSearchedUserList(this.userRepository.findLastTenUsers());
    }

    public List<SearchedUserResponse> getUsersByPattern(String pattern) {
        return mapToSearchedUserList(this.userRepository.searchUsersByPattern(pattern));
    }

    @Transactional
    public void addUserImage(@Valid UserImageUploadRequest userImage) {
        User user = userRepository.findByUsername(userImage.getOwner().getUsername())
                .orElseThrow(() -> new RuntimeException("The user is not found!"));

        UserImageType userImageType = userImage.getUserImageType().equals("WALLPAPER") ? UserImageType.WALLPAPER
                : UserImageType.PLAIN;

        user.getImages()
                .add(UserImage.builder()
                        .image_url(userImage.getImageUrl())
                        .description(userImage.getDescription())
                        .userImageType(userImageType)
                        .owner(user)
                        .build());

        userRepository.save(user);
    }

    private List<SearchedUserResponse> mapToSearchedUserList(List<Object[]> results) {
        List<SearchedUserResponse> searchedUserList = new ArrayList<>();
        results.forEach(result -> {
            String username = (String) result[0];  // първи елемент
            String imgURL = (String) result[1];    // втори елемент
            String firstName = (String) result[2]; // трети елемент
            String lastName = (String) result[3];  // четвърти елемент

            searchedUserList.add(SearchedUserResponse.builder()
                    .firstName(firstName)
                    .lastName(lastName)
                    .username(username)
                    .imgURL(imgURL)
                    .build());
        });

        return searchedUserList;
    }

    @Transactional
    public void sendFriendRequest(String senderUsername, String receiverUsername) throws IOException {
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Проверявам си дали вече има заявка, въобще, понеже може да има.
        boolean exists = friendRequestRepository.existsBySenderAndReceiver(sender, receiver);
        if (exists) {
            throw new RuntimeException("Friend request already sent");
        }

        // Ако не съществува такава заявка, значи мога да създавам:
        FriendRequest friendRequest = FriendRequest.builder()
                .sender(sender)
                .senderUsername(sender.getUsername())
                .senderNames(sender.getFirstName() + " " + sender.getLastName())
                .receiver(receiver)
                .receiverUsername(receiver.getUsername())
                .receiverNames(receiver.getFirstName() + " " + receiver.getLastName())
                .sentAt(Instant.now())
                .build();

        friendRequestRepository.save(friendRequest);
        friendRequestNotificationHandler.sendFriendRequestNotification(friendRequest, receiverUsername);
    }

    @Transactional
    public void acceptFriendRequest(String senderUsername, String receiverUsername) {
        this.friendRequestRepository.deleteBySenderUsernameAndReceiverUsername(receiverUsername, senderUsername);

        // Вземаме потребителите от базата
        User myData = this.userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender user not found"));
        User receiverData = this.userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver user not found"));

        // Пазеща проверка, ако случайно потребителя вече го имам в приятели:
        if (checkIfIContainFriendAlready(myData, receiverUsername)) return;

        // Проверка дали приятелят вече съществува в базата
        Friend friendForMyData = this.friendRepository.findByUsername(receiverData.getUsername())
                .orElseGet(() -> Friend.builder()
                        .firstName(receiverData.getFirstName())
                        .lastName(receiverData.getLastName())
                        .username(receiverData.getUsername())
                        .profileImageURL(receiverData.getProfileImageURL())
                        .realUserId(receiverData.getId())
                        .build());

        Friend friendForReceiverData = this.friendRepository.findByUsername(myData.getUsername())
                .orElseGet(() -> Friend.builder()
                        .firstName(myData.getFirstName())
                        .lastName(myData.getLastName())
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
    }

    private boolean checkIfIContainFriendAlready(User myData, String receiverUsername) {
        return !myData.getFriends().stream().filter(friend -> friend.getUsername()
                .equals(receiverUsername)).collect(Collectors.toList()).isEmpty();
    }


}
