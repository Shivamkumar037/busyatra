package com.busyatra.repository;

import com.busyatra.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Bus entity
 */
@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    
    Optional<Bus> findByBusNo(String busNo);
    
    List<Bus> findByStatus(String status);
    
    boolean existsByBusNo(String busNo);
}