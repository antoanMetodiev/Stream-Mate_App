package bg.stream_mates.backend.exception.handler;

import bg.stream_mates.backend.exception.EmptyUsernameException;
import bg.stream_mates.backend.exception.FriendRequestNotFoundException;
import bg.stream_mates.backend.exception.UserAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

import bg.stream_mates.backend.exception.UserNotFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(EmptyUsernameException.class)
    public ResponseEntity<String> handleEmptyUsernameException(EmptyUsernameException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FriendRequestNotFoundException.class)
    public ResponseEntity<String> handleFriendRequestNotFoundException(FriendRequestNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}
