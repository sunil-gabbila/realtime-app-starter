package com.kodnest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

public record ItemRequest(
        @NotBlank(message = "Name is required") String name,
        String description,
        @Min(value = 0, message = "Quantity cannot be negative") int quantity
) {
    public ItemRequest(String name, String description) {
        this(name, description, 0);
    }
}
