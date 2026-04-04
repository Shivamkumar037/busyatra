package com.busyatra.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Add Bus Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddBusRequest {

    @NotBlank(message = "Bus number is required")
    private String busNo;

    @NotBlank(message = "Bus type is required")
    private String busType;

    @NotNull(message = "Total seats is required")
    @Positive(message = "Total seats must be positive")
    private Integer totalSeats;

    private Long driverId;
    private Long conductorId;
}