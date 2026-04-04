package com.busyatra.repository;

import com.busyatra.entity.Booking;
import com.busyatra.entity.Cancellation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Cancellation entity
 */
@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Long> {
    
    Optional<Cancellation> findByBooking(Booking booking);
}