package bg.stream_mates.backend.feather.user.models.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "friend_requests")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonBackReference
    private User sender;

    @Column(name = "sender_username", nullable = false)
    @Size(min = 1, max = 50)
    private String senderUsername;

    @Column(name = "sender_names", nullable = false)
    @Size(min = 1, max = 100)
    private String senderNames;

    @Column(name = "sender_img_url")
    @URL
    private String senderImgURL;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    @JsonBackReference
    private User receiver;

    @Column(name = "receiver_username", nullable = false)
    @Size(min = 1, max = 50)
    private String receiverUsername;

    @Column(name = "receiver_names", nullable = false)
    @Size(min = 1, max = 100)
    private String receiverNames;

    @Column(name = "receiver_img_url")
    @URL
    private String receiverImgURL;

    @Column(name = "sent_at", nullable = false)
    private Instant sentAt;
}
