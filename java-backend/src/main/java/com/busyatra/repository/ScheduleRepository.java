package com.busyatra.repository;

import com.busyatra.entity.Bus;
import com.busyatra.entity.Route;
import com.busyatra.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Schedule entity
 */
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    List<Schedule> findByRouteAndTravelDay(Route route, LocalDate travelDay);
    
    List<Schedule> findByTravelDay(LocalDate travelDay);
    
    List<Schedule> findByBusAndTravelDay(Bus bus, LocalDate travelDay);
}