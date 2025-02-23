package bg.stream_mates.backend.feather.user.controllers;

import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.services.UserService;
import bg.stream_mates.backend.security.JwtTokenUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService, JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
    }

    @GetMapping("/get-user")
    public User getUser(HttpServletRequest httpRequest) {
        Cookie[] cookies = httpRequest.getCookies();

        String username = "";
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    String cookieValue = cookie.getValue();
                    username = JwtTokenUtil.extractUsername(cookieValue);
                    System.out.println("Cookie Value: " + username);
                }
            }
        }

        return this.userService.getUserByUsername(username);
    }


}