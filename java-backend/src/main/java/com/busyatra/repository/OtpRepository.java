package com.busyatra.repository;

import com.busyatra.entity.Otp;
import com.busyatra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for OTP entity
 */
@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    
    Optional<Otp> findByUserAndOtpCodeAndExpiryTimeAfter(User user, String otpCode, LocalDateTime currentTime);
    
    List<Otp> findByUser(User user);
    
    void deleteByExpiryTimeBefore(LocalDateTime currentTime);
}