package com.busyatra.service;

import com.busyatra.dto.CreatePaymentRequest;
import com.busyatra.dto.VerifyPaymentRequest;
import com.busyatra.entity.Booking;
import com.busyatra.entity.Payment;
import com.busyatra.exception.BadRequestException;
import com.busyatra.exception.ResourceNotFoundException;
import com.busyatra.repository.BookingRepository;
import com.busyatra.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.Base64;

/**
 * Payment Service
 * Handles Razorpay payment integration
 */
@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private EmailService emailService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    /**
     * Create Razorpay order
     */
    @Transactional
    public JSONObject createPaymentOrder(CreatePaymentRequest request) {
        try {
            // Get booking
            Booking booking = bookingRepository.findByBookingId(request.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking", "bookingId", request.getBookingId()));

            // Create Razorpay client
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Create order request
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount().multiply(BigDecimal.valueOf(100)).intValue()); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", request.getBookingId());

            // Create order
            Order order = razorpay.orders.create(orderRequest);

            // Create payment record
            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setAmount(request.getAmount());
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setPaymentStatus("PENDING");
            payment.setTransactionId(order.get("id"));
            paymentRepository.save(payment);

            // Prepare response
            JSONObject response = new JSONObject();
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("keyId", razorpayKeyId);

            return response;

        } catch (RazorpayException e) {
            throw new BadRequestException("Failed to create payment order: " + e.getMessage());
        }
    }

    /**
     * Verify payment
     */
    @Transactional
    public void verifyPayment(VerifyPaymentRequest request) {
        try {
            // Verify signature
            String generatedSignature = generateSignature(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    razorpayKeySecret
            );

            if (!generatedSignature.equals(request.getRazorpaySignature())) {
                throw new BadRequestException("Invalid payment signature");
            }

            // Get booking
            Booking booking = bookingRepository.findByBookingId(request.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking", "bookingId", request.getBookingId()));

            // Update payment
            Payment payment = paymentRepository.findByBooking(booking)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking"));
            
            payment.setPaymentStatus("SUCCESS");
            payment.setTransactionId(request.getRazorpayPaymentId());
            paymentRepository.save(payment);

            // Update booking status
            bookingService.updateBookingStatus(request.getBookingId(), "CONFIRMED");

            // Send confirmation email
            emailService.sendBookingConfirmationEmail(
                    booking.getUser().getEmail(),
                    booking.getBookingId(),
                    booking.getSchedule().getBus().getBusNo()
            );

        } catch (Exception e) {
            throw new BadRequestException("Payment verification failed: " + e.getMessage());
        }
    }

    /**
     * Generate signature for verification
     */
    private String generateSignature(String orderId, String paymentId, String secret) throws Exception {
        String payload = orderId + "|" + paymentId;
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(payload.getBytes());
        return bytesToHex(hash);
    }

    /**
     * Convert bytes to hex string
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}