package com.busyatra.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Add Route Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddRouteRequest {

    @NotNull(message = "Source city ID is required")
    private Long sourceCityId;

    @NotNull(message = "Destination city ID is required")
    private Long destinationCityId;

    @NotNull(message = "Distance is required")
    @Positive(message = "Distance must be positive")
    private BigDecimal distance;

    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private BigDecimal basePrice;
}