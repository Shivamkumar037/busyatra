package com.busyatra.controller;

import com.busyatra.dto.ApiResponse;
import com.busyatra.dto.SearchBusRequest;
import com.busyatra.entity.Bus;
import com.busyatra.entity.Schedule;
import com.busyatra.service.BusService;
import com.busyatra.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Bus Controller
 * Handles bus search and information
 */
@RestController
@RequestMapping("/bus")
public class BusController {

    @Autowired
    private BusService busService;

    @Autowired
    private ScheduleService scheduleService;

    /**
     * Search buses
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse> searchBuses(@RequestBody SearchBusRequest request) {
        if (request.getBusNo() != null && !request.getBusNo().isEmpty()) {
            // Search by bus number
            Bus bus = busService.getBusByNumber(request.getBusNo());
            return ResponseEntity.ok(new ApiResponse(true, "Bus found", bus));
        } else {
            // Return all active buses for now
            // In production, implement proper search logic
            List<Bus> buses = busService.getAllActiveBuses();
            return ResponseEntity.ok(new ApiResponse(true, "Buses retrieved", buses));
        }
    }

    /**
     * Get bus by number
     */
    @GetMapping("/{busNo}")
    public ResponseEntity<ApiResponse> getBusByNumber(@PathVariable String busNo) {
        Bus bus = busService.getBusByNumber(busNo);
        return ResponseEntity.ok(new ApiResponse(true, "Bus found", bus));
    }

    /**
     * Get today's buses
     */
    @GetMapping("/today")
    public ResponseEntity<ApiResponse> getTodaysBuses() {
        List<Schedule> schedules = scheduleService.getTodaysSchedules();
        return ResponseEntity.ok(new ApiResponse(true, "Today's schedules retrieved", schedules));
    }
}