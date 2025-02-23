package bg.stream_mates.backend.feather.user.services;

import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByUsername(String username) {
        // TODO: Оправи го:
        return this.userRepository.findByUsername(username).get();
    }
}
