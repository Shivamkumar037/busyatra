package com.busyatra.controller;

import com.busyatra.dto.ApiResponse;
import com.busyatra.dto.CreatePaymentRequest;
import com.busyatra.dto.VerifyPaymentRequest;
import com.busyatra.service.PaymentService;
import jakarta.validation.Valid;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Payment Controller
 * Handles payment operations
 */
@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Create payment order
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createPaymentOrder(@Valid @RequestBody CreatePaymentRequest request) {
        JSONObject order = paymentService.createPaymentOrder(request);
        return ResponseEntity.ok(
                new ApiResponse(true, "Payment order created", order.toMap())
        );
    }

    /**
     * Verify payment
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        paymentService.verifyPayment(request);
        return ResponseEntity.ok(
                new ApiResponse(true, "Payment verified successfully")
        );
    }
}