package com.kodnest.exception;

public class ItemAlreadyExistsException extends RuntimeException {

    public ItemAlreadyExistsException(String message) {
        super(message);
    }
}
