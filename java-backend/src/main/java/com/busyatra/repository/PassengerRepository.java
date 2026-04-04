package com.busyatra.repository;

import com.busyatra.entity.Booking;
import com.busyatra.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Passenger entity
 */
@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    
    List<Passenger> findByBooking(Booking booking);
}