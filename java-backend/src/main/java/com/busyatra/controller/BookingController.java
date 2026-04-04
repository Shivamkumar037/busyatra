package com.busyatra.controller;

import com.busyatra.dto.ApiResponse;
import com.busyatra.dto.BookingResponse;
import com.busyatra.dto.CreateBookingRequest;
import com.busyatra.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Booking Controller
 * Handles booking operations
 */
@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * Create booking
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        BookingResponse booking = bookingService.createBooking(request, userEmail);
        return new ResponseEntity<>(
                new ApiResponse(true, "Booking created successfully", booking),
                HttpStatus.CREATED
        );
    }

    /**
     * Get user bookings
     */
    @GetMapping("/user")
    public ResponseEntity<ApiResponse> getUserBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        List<BookingResponse> bookings = bookingService.getUserBookings(userEmail);
        return ResponseEntity.ok(
                new ApiResponse(true, "Bookings retrieved successfully", bookings)
        );
    }

    /**
     * Get booking by ID
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse> getBookingById(@PathVariable String bookingId) {
        BookingResponse booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(
                new ApiResponse(true, "Booking retrieved successfully", booking)
        );
    }
}