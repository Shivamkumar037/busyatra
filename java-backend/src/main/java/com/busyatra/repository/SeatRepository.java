package com.busyatra.repository;

import com.busyatra.entity.Bus;
import com.busyatra.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Seat entity
 */
@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    
    List<Seat> findByBus(Bus bus);
    
    Optional<Seat> findByBusAndSeatNo(Bus bus, String seatNo);
}