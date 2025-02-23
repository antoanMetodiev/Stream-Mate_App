package bg.stream_mates.backend.feather.chat.models.entities;

import bg.stream_mates.backend.feather.user.models.entities.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "message_text", nullable = false)
    @Size(min = 1, max = 254)
    private String messageText;

    @ManyToOne
    private User owner;

    @ManyToOne
    private User receiver;

    @Column(name = "created_on", nullable = false)
    private Instant createdOn;
}
