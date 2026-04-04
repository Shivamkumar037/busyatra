package com.busyatra.controller;

import com.busyatra.dto.*;
import com.busyatra.entity.*;
import com.busyatra.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin Controller
 * Handles admin-specific operations
 */
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private BusService busService;

    @Autowired
    private RouteService routeService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CancellationService cancellationService;

    /**
     * Add new bus
     */
    @PostMapping("/add-bus")
    public ResponseEntity<ApiResponse> addBus(@Valid @RequestBody AddBusRequest request) {
        Bus bus = busService.addBus(request);
        return new ResponseEntity<>(
                new ApiResponse(true, "Bus added successfully", bus),
                HttpStatus.CREATED
        );
    }

    /**
     * Get all buses
     */
    @GetMapping("/buses")
    public ResponseEntity<List<Bus>> getAllBuses() {
        List<Bus> buses = busService.getAllBuses();
        return ResponseEntity.ok(buses);
    }

    /**
     * Add new route
     */
    @PostMapping("/add-route")
    public ResponseEntity<ApiResponse> addRoute(@Valid @RequestBody AddRouteRequest request) {
        Route route = routeService.addRoute(request);
        return new ResponseEntity<>(
                new ApiResponse(true, "Route added successfully", route),
                HttpStatus.CREATED
        );
    }

    /**
     * Add stop to route
     */
    @PostMapping("/add-stop")
    public ResponseEntity<ApiResponse> addStop(@Valid @RequestBody AddStopRequest request) {
        Stop stop = routeService.addStop(request);
        return new ResponseEntity<>(
                new ApiResponse(true, "Stop added successfully", stop),
                HttpStatus.CREATED
        );
    }

    /**
     * Create schedule
     */
    @PostMapping("/create-schedule")
    public ResponseEntity<ApiResponse> createSchedule(@Valid @RequestBody CreateScheduleRequest request) {
        Schedule schedule = scheduleService.createSchedule(request);
        return new ResponseEntity<>(
                new ApiResponse(true, "Schedule created successfully", schedule),
                HttpStatus.CREATED
        );
    }

    /**
     * Get all bookings
     */
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse> getAllBookings() {
        // This would need a method in BookingService to get all bookings
        return ResponseEntity.ok(
                new ApiResponse(true, "Bookings retrieved successfully")
        );
    }

    /**
     * Process refund
     */
    @PostMapping("/process-refund")
    public ResponseEntity<ApiResponse> processRefund(
            @RequestParam Long refundId,
            @RequestParam String transactionId) {
        cancellationService.processRefund(refundId, transactionId);
        return ResponseEntity.ok(
                new ApiResponse(true, "Refund processed successfully")
        );
    }

    /**
     * Update bus status
     */
    @PutMapping("/bus/{busId}/status")
    public ResponseEntity<ApiResponse> updateBusStatus(
            @PathVariable Long busId,
            @RequestParam String status) {
        Bus bus = busService.updateBusStatus(busId, status);
        return ResponseEntity.ok(
                new ApiResponse(true, "Bus status updated successfully", bus)
        );
    }
}