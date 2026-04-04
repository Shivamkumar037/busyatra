package com.busyatra.repository;

import com.busyatra.entity.Booking;
import com.busyatra.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Payment entity
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByBooking(Booking booking);
    
    Optional<Payment> findByTransactionId(String transactionId);
}