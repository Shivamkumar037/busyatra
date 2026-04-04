package com.busyatra.repository;

import com.busyatra.entity.City;
import com.busyatra.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Route entity
 */
@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    
    List<Route> findBySourceCityAndDestinationCityAndStatus(City sourceCity, City destinationCity, String status);
    
    List<Route> findByStatus(String status);
}