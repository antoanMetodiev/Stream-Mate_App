package bg.stream_mates.backend.feather.user.models.entities;

import bg.stream_mates.backend.feather.user.models.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.URL;

import java.util.*;

@Entity
@Table(name = "users")
@Data
@Accessors(chain = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "profile_image_url")
    @URL
    private String profileImageURL;

    @Column(name = "background_image_url")
    @URL
    private String backgroundImageURL;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role")
    private UserRole userRole = UserRole.RECRUIT;

    @OneToMany(mappedBy = "owner", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    private List<UserImage> images = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
            name = "user_friends",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    private Set<Friend> friends = new HashSet<>();

    // Покани, които този потребител е изпратил
    @OneToMany(mappedBy = "sender", fetch = FetchType.EAGER, cascade = CascadeType.PERSIST, orphanRemoval = true)
    @JsonManagedReference
    private List<FriendRequest> sentFriendRequests = new ArrayList<>();

    // Покани, които този потребител е получил
    @OneToMany(mappedBy = "receiver", fetch = FetchType.EAGER, cascade = CascadeType.PERSIST, orphanRemoval = true)
    @JsonManagedReference
    private List<FriendRequest> receivedFriendRequests = new ArrayList<>();
}
