package bg.stream_mates.backend.exception;


public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException() {}
}
