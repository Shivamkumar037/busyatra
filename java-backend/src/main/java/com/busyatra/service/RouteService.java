package com.busyatra.service;

import com.busyatra.dto.AddRouteRequest;
import com.busyatra.dto.AddStopRequest;
import com.busyatra.entity.City;
import com.busyatra.entity.Route;
import com.busyatra.entity.Stop;
import com.busyatra.exception.BadRequestException;
import com.busyatra.exception.ResourceNotFoundException;
import com.busyatra.repository.CityRepository;
import com.busyatra.repository.RouteRepository;
import com.busyatra.repository.StopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Route Service
 * Handles route and stop management
 */
@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private StopRepository stopRepository;

    /**
     * Add new route
     */
    @Transactional
    public Route addRoute(AddRouteRequest request) {
        // Get cities
        City sourceCity = cityRepository.findById(request.getSourceCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City", "id", request.getSourceCityId()));

        City destinationCity = cityRepository.findById(request.getDestinationCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City", "id", request.getDestinationCityId()));

        // Check if route already exists
        List<Route> existingRoutes = routeRepository.findBySourceCityAndDestinationCityAndStatus(
                sourceCity, destinationCity, "ACTIVE");
        
        if (!existingRoutes.isEmpty()) {
            throw new BadRequestException("Route already exists between these cities");
        }

        // Create route
        Route route = new Route();
        route.setSourceCity(sourceCity);
        route.setDestinationCity(destinationCity);
        route.setDistance(request.getDistance());
        route.setBasePrice(request.getBasePrice());
        route.setStatus("ACTIVE");

        return routeRepository.save(route);
    }

    /**
     * Add stop to route
     */
    @Transactional
    public Stop addStop(AddStopRequest request) {
        // Get route
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", request.getRouteId()));

        // Create stop
        Stop stop = new Stop();
        stop.setRoute(route);
        stop.setStopName(request.getStopName());
        stop.setStopOrder(request.getStopOrder());
        stop.setDistanceFromSource(request.getDistanceFromSource());
        stop.setExtraPrice(request.getExtraPrice());

        return stopRepository.save(stop);
    }

    /**
     * Get all routes
     */
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    /**
     * Get active routes
     */
    public List<Route> getActiveRoutes() {
        return routeRepository.findByStatus("ACTIVE");
    }

    /**
     * Search routes by source and destination
     */
    public List<Route> searchRoutes(Long sourceCityId, Long destinationCityId) {
        City sourceCity = cityRepository.findById(sourceCityId)
                .orElseThrow(() -> new ResourceNotFoundException("City", "id", sourceCityId));

        City destinationCity = cityRepository.findById(destinationCityId)
                .orElseThrow(() -> new ResourceNotFoundException("City", "id", destinationCityId));

        return routeRepository.findBySourceCityAndDestinationCityAndStatus(
                sourceCity, destinationCity, "ACTIVE");
    }

    /**
     * Get stops for a route
     */
    public List<Stop> getStopsForRoute(Long routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", routeId));
        return stopRepository.findByRouteOrderByStopOrder(route);
    }
}