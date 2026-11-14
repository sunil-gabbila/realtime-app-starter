package com.kodnest.dto;

import jakarta.validation.constraints.Min;

public record QuantityRequest(@Min(value = 0, message = "Quantity cannot be negative") int quantity) {
}
