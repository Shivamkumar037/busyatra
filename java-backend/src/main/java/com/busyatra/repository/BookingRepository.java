package com.busyatra.repository;

import com.busyatra.entity.Booking;
import com.busyatra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Booking entity
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingId(String bookingId);
    
    List<Booking> findByUser(User user);
    
    List<Booking> findByUserOrderByBookingDateDesc(User user);
    
    List<Booking> findByBookingStatus(String bookingStatus);
}