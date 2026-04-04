package com.busyatra.service;

import com.busyatra.dto.BookingResponse;
import com.busyatra.dto.CreateBookingRequest;
import com.busyatra.dto.PassengerDto;
import com.busyatra.entity.*;
import com.busyatra.exception.BadRequestException;
import com.busyatra.exception.ResourceNotFoundException;
import com.busyatra.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Booking Service
 * Handles ticket booking operations
 */
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private SeatAvailabilityRepository seatAvailabilityRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create new booking
     */
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, String userEmail) {
        // Get user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        // Get schedule
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", request.getScheduleId()));

        // Validate and reserve seats
        List<Seat> seats = validateAndReserveSeats(schedule, request.getPassengers());

        // Calculate total amount
        BigDecimal totalAmount = schedule.getRoute().getBasePrice()
                .multiply(BigDecimal.valueOf(request.getPassengers().size()));

        // Generate booking ID
        String bookingId = generateBookingId();

        // Create booking
        Booking booking = new Booking();
        booking.setBookingId(bookingId);
        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setBookingStatus("PENDING");
        booking.setTotalAmount(totalAmount);
        
        booking = bookingRepository.save(booking);

        // Create passengers
        List<PassengerDto> passengerDtos = new ArrayList<>();
        for (int i = 0; i < request.getPassengers().size(); i++) {
            PassengerDto passengerDto = request.getPassengers().get(i);
            Seat seat = seats.get(i);

            Passenger passenger = new Passenger();
            passenger.setBooking(booking);
            passenger.setName(passengerDto.getName());
            passenger.setAadhaarNo(passengerDto.getAadhaarNo());
            passenger.setMobileNo(passengerDto.getMobileNo());
            passenger.setSeat(seat);
            
            passengerRepository.save(passenger);

            // Update DTO with seat info
            passengerDto.setSeatId(seat.getId());
            passengerDto.setSeatNo(seat.getSeatNo());
            passengerDtos.add(passengerDto);
        }

        // Prepare response
        return prepareBookingResponse(booking, passengerDtos);
    }

    /**
     * Validate and reserve seats
     */
    private List<Seat> validateAndReserveSeats(Schedule schedule, List<PassengerDto> passengers) {
        List<Seat> seats = new ArrayList<>();

        for (PassengerDto passenger : passengers) {
            // Get seat
            Seat seat = seatRepository.findById(passenger.getSeatId())
                    .orElseThrow(() -> new ResourceNotFoundException("Seat", "id", passenger.getSeatId()));

            // Check seat availability
            List<SeatAvailability> availabilities = seatAvailabilityRepository
                    .findByScheduleAndIsAvailable(schedule, true);

            boolean isSeatAvailable = availabilities.stream()
                    .anyMatch(sa -> sa.getSeat().getId().equals(seat.getId()));

            if (!isSeatAvailable) {
                throw new BadRequestException("Seat " + seat.getSeatNo() + " is not available");
            }

            // Reserve seat (mark as unavailable)
            SeatAvailability availability = availabilities.stream()
                    .filter(sa -> sa.getSeat().getId().equals(seat.getId()))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("Seat availability not found"));

            availability.setIsAvailable(false);
            seatAvailabilityRepository.save(availability);

            seats.add(seat);
        }

        return seats;
    }

    /**
     * Generate unique booking ID
     */
    private String generateBookingId() {
        return "BUS" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    /**
     * Get user bookings
     */
    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        List<Booking> bookings = bookingRepository.findByUserOrderByBookingDateDesc(user);

        return bookings.stream()
                .map(booking -> {
                    List<Passenger> passengers = passengerRepository.findByBooking(booking);
                    List<PassengerDto> passengerDtos = passengers.stream()
                            .map(p -> new PassengerDto(
                                    p.getName(),
                                    p.getAadhaarNo(),
                                    p.getMobileNo(),
                                    p.getSeat().getId(),
                                    p.getSeat().getSeatNo()
                            ))
                            .collect(Collectors.toList());
                    return prepareBookingResponse(booking, passengerDtos);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get booking by ID
     */
    public BookingResponse getBookingById(String bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "bookingId", bookingId));

        List<Passenger> passengers = passengerRepository.findByBooking(booking);
        List<PassengerDto> passengerDtos = passengers.stream()
                .map(p -> new PassengerDto(
                        p.getName(),
                        p.getAadhaarNo(),
                        p.getMobileNo(),
                        p.getSeat().getId(),
                        p.getSeat().getSeatNo()
                ))
                .collect(Collectors.toList());

        return prepareBookingResponse(booking, passengerDtos);
    }

    /**
     * Update booking status
     */
    @Transactional
    public void updateBookingStatus(String bookingId, String status) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "bookingId", bookingId));
        booking.setBookingStatus(status);
        bookingRepository.save(booking);
    }

    /**
     * Prepare booking response
     */
    private BookingResponse prepareBookingResponse(Booking booking, List<PassengerDto> passengers) {
        Schedule schedule = booking.getSchedule();
        
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setBookingId(booking.getBookingId());
        response.setScheduleId(schedule.getId());
        response.setBusNo(schedule.getBus().getBusNo());
        response.setSource(schedule.getRoute().getSourceCity().getName());
        response.setDestination(schedule.getRoute().getDestinationCity().getName());
        response.setTravelDate(schedule.getTravelDay().toString());
        response.setStartTime(schedule.getStartTime().toString());
        response.setBookingStatus(booking.getBookingStatus());
        response.setTotalAmount(booking.getTotalAmount());
        response.setBookingDate(booking.getBookingDate());
        response.setPassengers(passengers);

        return response;
    }
}