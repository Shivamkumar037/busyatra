package com.busyatra.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Add Stop Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddStopRequest {

    @NotNull(message = "Route ID is required")
    private Long routeId;

    @NotBlank(message = "Stop name is required")
    private String stopName;

    @NotNull(message = "Stop order is required")
    private Integer stopOrder;

    @NotNull(message = "Distance from source is required")
    @PositiveOrZero(message = "Distance must be zero or positive")
    private BigDecimal distanceFromSource;

    @NotNull(message = "Extra price is required")
    @PositiveOrZero(message = "Extra price must be zero or positive")
    private BigDecimal extraPrice;
}