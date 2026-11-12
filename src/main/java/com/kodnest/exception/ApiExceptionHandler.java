package com.kodnest.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ItemAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleItemAlreadyExists(ItemAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("ITEM_ALREADY_EXISTS", exception.getMessage()));
    }

    public record ErrorResponse(String code, String message) {
    }
}
