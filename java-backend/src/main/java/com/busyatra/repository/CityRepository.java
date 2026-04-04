package com.busyatra.repository;

import com.busyatra.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for City entity
 */
@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    
    Optional<City> findByNameAndState(String name, String state);
    
    List<City> findByState(String state);
    
    List<City> findByNameContainingIgnoreCase(String name);
}