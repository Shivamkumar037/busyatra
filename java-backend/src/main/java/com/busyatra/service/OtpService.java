package com.busyatra.service;

import com.busyatra.entity.Otp;
import com.busyatra.entity.User;
import com.busyatra.exception.BadRequestException;
import com.busyatra.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * OTP Service
 * Handles OTP generation and validation
 */
@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.otp.expiry.minutes}")
    private Integer otpExpiryMinutes;

    /**
     * Generate and send OTP
     */
    @Transactional
    public void generateAndSendOtp(User user) {
        // Generate 6-digit OTP
        String otpCode = generateOtpCode();

        // Create OTP entity
        Otp otp = new Otp();
        otp.setUser(user);
        otp.setOtpCode(otpCode);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(otpExpiryMinutes));

        // Save OTP
        otpRepository.save(otp);

        // Send OTP via email
        emailService.sendOtpEmail(user.getEmail(), otpCode);
    }

    /**
     * Verify OTP
     */
    @Transactional
    public boolean verifyOtp(User user, String otpCode) {
        Otp otp = otpRepository.findByUserAndOtpCodeAndExpiryTimeAfter(
                user, otpCode, LocalDateTime.now()
        ).orElse(null);

        if (otp != null) {
            // OTP is valid, delete it
            otpRepository.delete(otp);
            return true;
        }

        return false;
    }

    /**
     * Generate 6-digit OTP code
     */
    private String generateOtpCode() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Clean expired OTPs
     */
    @Transactional
    public void cleanExpiredOtps() {
        otpRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
    }
}