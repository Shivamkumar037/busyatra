package com.busyatra.repository;

import com.busyatra.entity.Schedule;
import com.busyatra.entity.SeatAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for SeatAvailability entity
 */
@Repository
public interface SeatAvailabilityRepository extends JpaRepository<SeatAvailability, Long> {
    
    List<SeatAvailability> findBySchedule(Schedule schedule);
    
    List<SeatAvailability> findByScheduleAndIsAvailable(Schedule schedule, Boolean isAvailable);
}