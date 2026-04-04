package com.busyatra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Application Class for Bus Yatra
 * Bus Reservation System
 */
@SpringBootApplication
@EnableJpaAuditing
public class BusYatraApplication {

    public static void main(String[] args) {
        SpringApplication.run(BusYatraApplication.class, args);
        System.out.println("\n================================");
        System.out.println("Bus Yatra Application Started!");
        System.out.println("API Running on: http://localhost:8080/api");
        System.out.println("================================\n");
    }
}