package com.busyatra.service;

import com.busyatra.dto.CreateScheduleRequest;
import com.busyatra.entity.*;
import com.busyatra.exception.BadRequestException;
import com.busyatra.exception.ResourceNotFoundException;
import com.busyatra.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Schedule Service
 * Handles bus schedule management
 */
@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private SeatAvailabilityRepository seatAvailabilityRepository;

    /**
     * Create new schedule
     */
    @Transactional
    public Schedule createSchedule(CreateScheduleRequest request) {
        // Get route
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", request.getRouteId()));

        // Get bus
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus", "id", request.getBusId()));

        // Check if bus is already scheduled for this day
        List<Schedule> existingSchedules = scheduleRepository.findByBusAndTravelDay(bus, request.getTravelDay());
        if (!existingSchedules.isEmpty()) {
            throw new BadRequestException("Bus is already scheduled for this day");
        }

        // Create schedule
        Schedule schedule = new Schedule();
        schedule.setRoute(route);
        schedule.setBus(bus);
        schedule.setTravelDay(request.getTravelDay());
        schedule.setStartTime(LocalTime.parse(request.getStartTime()));
        schedule.setEndTime(LocalTime.parse(request.getEndTime()));
        schedule.setTotalHours(request.getTotalHours());

        // Save schedule
        schedule = scheduleRepository.save(schedule);

        // Create seat availability for this schedule
        createSeatAvailability(schedule, bus);

        return schedule;
    }

    /**
     * Create seat availability for schedule
     */
    private void createSeatAvailability(Schedule schedule, Bus bus) {
        List<Seat> seats = seatRepository.findByBus(bus);
        
        for (Seat seat : seats) {
            SeatAvailability availability = new SeatAvailability();
            availability.setSchedule(schedule);
            availability.setSeat(seat);
            availability.setSeatNo(seat.getSeatNo());
            availability.setIsAvailable(true);
            seatAvailabilityRepository.save(availability);
        }
    }

    /**
     * Search schedules by route and date
     */
    public List<Schedule> searchSchedules(Long routeId, LocalDate travelDate) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", routeId));
        
        return scheduleRepository.findByRouteAndTravelDay(route, travelDate);
    }

    /**
     * Get today's schedules
     */
    public List<Schedule> getTodaysSchedules() {
        return scheduleRepository.findByTravelDay(LocalDate.now());
    }

    /**
     * Get schedule by ID
     */
    public Schedule getScheduleById(Long scheduleId) {
        return scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", scheduleId));
    }

    /**
     * Get available seats for schedule
     */
    public List<SeatAvailability> getAvailableSeats(Long scheduleId) {
        Schedule schedule = getScheduleById(scheduleId);
        return seatAvailabilityRepository.findByScheduleAndIsAvailable(schedule, true);
    }
}