package com.busyatra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Booking Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private String bookingId;
    private Long scheduleId;
    private String busNo;
    private String source;
    private String destination;
    private String travelDate;
    private String startTime;
    private String bookingStatus;
    private BigDecimal totalAmount;
    private LocalDateTime bookingDate;
    private List<PassengerDto> passengers;
}