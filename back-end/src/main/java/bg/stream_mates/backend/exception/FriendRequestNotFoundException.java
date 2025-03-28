package bg.stream_mates.backend.exception;

public class FriendRequestNotFoundException extends RuntimeException {

    public FriendRequestNotFoundException(String message) {
        super(message);
    }

    public FriendRequestNotFoundException() {}
}
