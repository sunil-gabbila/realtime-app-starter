package com.kodnest.dto;

import jakarta.validation.constraints.NotBlank;

public record ItemRequest(
        @NotBlank(message = "Name is required") String name,
        String description
) {
}
