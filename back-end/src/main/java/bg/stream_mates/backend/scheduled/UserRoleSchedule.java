package bg.stream_mates.backend.scheduled;

import bg.stream_mates.backend.feather.user.models.entities.User;
import bg.stream_mates.backend.feather.user.models.enums.UserRole;
import bg.stream_mates.backend.feather.user.repositories.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class UserRoleSchedule {

    private final UserRepository userRepository;

    public UserRoleSchedule(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?") // Всеки ден в 00:00
    @Transactional
    public void updateUserRoles() {
        List<User> recruits = userRepository.findByUserRole(UserRole.RECRUIT);
        if (recruits.isEmpty()) return;

        for (User user : recruits) {
            user.setUserRole(UserRole.NORMAL_USER);
        }

        userRepository.saveAll(recruits);
    }
}