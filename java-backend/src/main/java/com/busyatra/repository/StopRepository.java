package com.busyatra.repository;

import com.busyatra.entity.Route;
import com.busyatra.entity.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Stop entity
 */
@Repository
public interface StopRepository extends JpaRepository<Stop, Long> {
    
    List<Stop> findByRouteOrderByStopOrder(Route route);
    
    List<Stop> findByRoute(Route route);
}