package com.busyatra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Auth Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private String name;
    private String role;
    private Boolean isVerified;

    public AuthResponse(String token, Long userId, String email, String name, String role, Boolean isVerified) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.role = role;
        this.isVerified = isVerified;
    }
}