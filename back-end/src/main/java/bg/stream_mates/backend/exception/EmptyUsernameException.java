package bg.stream_mates.backend.exception;

public class EmptyUsernameException extends RuntimeException {

    public EmptyUsernameException(String message) {
        super(message);
    }

    public EmptyUsernameException() {}
}
