package bg.stream_mates.backend.feather.user.controllers;

import bg.stream_mates.backend.feather.user.models.dtos.*;
import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.services.UserService;
import bg.stream_mates.backend.security.JwtTokenUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService, JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
    }

    @DeleteMapping("/reject-received-friend-request/{myUsername}/{wishedFriendUsername}")
    public boolean rejectFriendRequest(@PathVariable String myUsername,
                                       @PathVariable String wishedFriendUsername) {

        try {
            this.userService.rejectReceivedFriendRequest(myUsername, wishedFriendUsername);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    @DeleteMapping("/reject-sended-friend-request/{myUsername}/{wishedFriendUsername}")
    public boolean rejectSendedFriendRequest(@PathVariable String myUsername,
                                             @PathVariable String wishedFriendUsername) {

        try {
            this.userService.rejectSendedFriendRequest(myUsername, wishedFriendUsername);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    @PostMapping("/accept-friend-request")
    public boolean acceptFriendRequest(@RequestBody @Valid SendFriendRequest sendFriendRequest) {
        try {
            this.userService.acceptFriendRequest(sendFriendRequest.getMyUsername(),
                    sendFriendRequest.getWishedFriendUsername());

            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    @PostMapping("/send-friend-request")
    public boolean sendFriendRequest(@RequestBody @Valid SendFriendRequest sendFriendRequest) {
        try {
            this.userService.sendFriendRequest(sendFriendRequest.getMyUsername(),
                    sendFriendRequest.getWishedFriendUsername());

            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    @PostMapping("/save-user-picture")
    public void saveUserPicture(@RequestBody @Valid UserImageUploadRequest userImage) {
        this.userService.addUserImage(userImage);
    }

    @PostMapping("/get-user-details")
    public User getUserDetails(@RequestBody @Valid UserDetailsRequest userDetailsRequest) {
        return userService.getUserDetails(userDetailsRequest.getUsername());
    }

    @PostMapping("/getUsersByPattern")
    public List<SearchedUserResponse> getUsersByPattern(@RequestBody @Valid
                                                        SearchedUsersRequest searchedUsersRequest) {
        return userService.getUsersByPattern(searchedUsersRequest.getSearchedUser());
    }

    @GetMapping("/getLastTenUsers")
    public List<SearchedUserResponse> getLastTwentyUsers() {
        return userService.getLastTenUsers();
    }

    @GetMapping("/get-user")
    public User getUser(HttpServletRequest httpRequest) {
        Cookie[] cookies = httpRequest.getCookies();
        if (cookies == null) throw new RuntimeException("Invalid Cookie!");

        String username = "";
        for (Cookie cookie : cookies) {
            if ("JWT_TOKEN".equals(cookie.getName())) {
                username = JwtTokenUtil.extractUsername(cookie.getValue());
            }
        }

        return this.userService.getUserByUsername(username);
    }
}