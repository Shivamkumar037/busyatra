package com.busyatra.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Cancel Ticket Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelTicketRequest {

    @NotBlank(message = "Booking ID is required")
    private String bookingId;

    private String reason;
}