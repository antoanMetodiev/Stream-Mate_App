package bg.stream_mates.backend.commonData.dtos;

import bg.stream_mates.backend.resolver.CustomObjectResolver;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.UUID;

@Getter
@Setter
@Accessors(chain = true)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        resolver = CustomObjectResolver.class  // ✅ Позволява множество инстанции
)
public class Actor {


    private UUID id;

    private String imageURL;

    private String biography;

    private String facebookUsername;

    private String instagramUsername;

    private String twitterUsername;

    private String youtubeChannel;

    private String imdbId;

    private String birthday;

    private String knownFor;

    private String placeOfBirth;

    private String gender;

    private String popularity;

    private String nameInRealLife;
}
