package com.busyatra.controller;

import com.busyatra.dto.ApiResponse;
import com.busyatra.entity.Schedule;
import com.busyatra.entity.SeatAvailability;
import com.busyatra.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Schedule Controller
 * Handles schedule operations
 */
@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    /**
     * Search schedules
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchSchedules(
            @RequestParam Long routeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate travelDate) {
        List<Schedule> schedules = scheduleService.searchSchedules(routeId, travelDate);
        return ResponseEntity.ok(new ApiResponse(true, "Schedules found", schedules));
    }

    /**
     * Get schedule by ID
     */
    @GetMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse> getScheduleById(@PathVariable Long scheduleId) {
        Schedule schedule = scheduleService.getScheduleById(scheduleId);
        return ResponseEntity.ok(new ApiResponse(true, "Schedule retrieved", schedule));
    }

    /**
     * Get available seats for schedule
     */
    @GetMapping("/{scheduleId}/seats")
    public ResponseEntity<ApiResponse> getAvailableSeats(@PathVariable Long scheduleId) {
        List<SeatAvailability> seats = scheduleService.getAvailableSeats(scheduleId);
        return ResponseEntity.ok(new ApiResponse(true, "Available seats retrieved", seats));
    }

    /**
     * Get today's schedules
     */
    @GetMapping("/today")
    public ResponseEntity<ApiResponse> getTodaysSchedules() {
        List<Schedule> schedules = scheduleService.getTodaysSchedules();
        return ResponseEntity.ok(new ApiResponse(true, "Today's schedules retrieved", schedules));
    }
}