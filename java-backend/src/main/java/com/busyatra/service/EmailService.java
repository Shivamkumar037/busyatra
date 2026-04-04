package com.busyatra.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Email Service
 * Handles email sending functionality
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name}")
    private String appName;

    /**
     * Send OTP email
     */
    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "OTP Verification - " + appName;
        String body = String.format(
                "Dear User,\n\n" +
                "Your OTP for email verification is: %s\n\n" +
                "This OTP is valid for 5 minutes.\n\n" +
                "Please do not share this OTP with anyone.\n\n" +
                "Regards,\n%s Team",
                otp, appName
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send booking confirmation email
     */
    public void sendBookingConfirmationEmail(String toEmail, String bookingId, String busNo) {
        String subject = "Booking Confirmation - " + appName;
        String body = String.format(
                "Dear Passenger,\n\n" +
                "Your booking has been confirmed!\n\n" +
                "Booking ID: %s\n" +
                "Bus Number: %s\n\n" +
                "Thank you for choosing %s.\n\n" +
                "Regards,\n%s Team",
                bookingId, busNo, appName, appName
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send cancellation email
     */
    public void sendCancellationEmail(String toEmail, String bookingId, String refundAmount) {
        String subject = "Booking Cancellation - " + appName;
        String body = String.format(
                "Dear Passenger,\n\n" +
                "Your booking has been cancelled.\n\n" +
                "Booking ID: %s\n" +
                "Refund Amount: ₹%s\n\n" +
                "The refund will be processed within 5-7 business days.\n\n" +
                "Regards,\n%s Team",
                bookingId, refundAmount, appName
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Generic email sender
     */
    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // In production, log this error properly
        }
    }
}