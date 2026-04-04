package com.busyatra.repository;

import com.busyatra.entity.Cancellation;
import com.busyatra.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Refund entity
 */
@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    
    Optional<Refund> findByCancellation(Cancellation cancellation);
}