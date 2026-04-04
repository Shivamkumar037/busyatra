-- Bus Yatra Database Schema

CREATE DATABASE IF NOT EXISTS bus_yatra;
USE bus_yatra;

-- Role Table
CREATE TABLE IF NOT EXISTS role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Table
CREATE TABLE IF NOT EXISTS user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_no VARCHAR(15) NOT NULL,
    aadhaar_no VARCHAR(12),
    role_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- OTP Table
CREATE TABLE IF NOT EXISTS otp (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- City Table
CREATE TABLE IF NOT EXISTS city (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Route Table
CREATE TABLE IF NOT EXISTS route (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    source_city_id BIGINT NOT NULL,
    destination_city_id BIGINT NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_city_id) REFERENCES city(id),
    FOREIGN KEY (destination_city_id) REFERENCES city(id)
);

-- Stop Table
CREATE TABLE IF NOT EXISTS stop (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    route_id BIGINT NOT NULL,
    stop_name VARCHAR(100) NOT NULL,
    stop_order INT NOT NULL,
    distance_from_source DECIMAL(10,2) NOT NULL,
    extra_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES route(id) ON DELETE CASCADE
);

-- Bus Table
CREATE TABLE IF NOT EXISTS bus (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bus_no VARCHAR(50) UNIQUE NOT NULL,
    bus_type VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    driver_id BIGINT,
    conductor_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES user(id),
    FOREIGN KEY (conductor_id) REFERENCES user(id)
);

-- Seat Table
CREATE TABLE IF NOT EXISTS seat (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bus_id BIGINT NOT NULL,
    seat_no VARCHAR(10) NOT NULL,
    seat_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE CASCADE,
    UNIQUE KEY unique_bus_seat (bus_id, seat_no)
);

-- Schedule Table
CREATE TABLE IF NOT EXISTS schedule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    route_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    travel_day DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_hours DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES route(id),
    FOREIGN KEY (bus_id) REFERENCES bus(id)
);

-- Seat Availability Table
CREATE TABLE IF NOT EXISTS seat_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,
    seat_no VARCHAR(10) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seat(id) ON DELETE CASCADE,
    UNIQUE KEY unique_schedule_seat (schedule_id, seat_id)
);

-- Booking Table
CREATE TABLE IF NOT EXISTS booking (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    schedule_id BIGINT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    booking_status VARCHAR(20) DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (schedule_id) REFERENCES schedule(id)
);

-- Passenger Table
CREATE TABLE IF NOT EXISTS passenger (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    aadhaar_no VARCHAR(12) NOT NULL,
    mobile_no VARCHAR(15) NOT NULL,
    seat_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seat(id)
);

-- Payment Table
CREATE TABLE IF NOT EXISTS payment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);

-- Cancellation Table
CREATE TABLE IF NOT EXISTS cancellation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    cancel_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refund_amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);

-- Refund Table
CREATE TABLE IF NOT EXISTS refund (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cancellation_id BIGINT NOT NULL,
    refund_status VARCHAR(20) DEFAULT 'PENDING',
    refund_date TIMESTAMP,
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cancellation_id) REFERENCES cancellation(id) ON DELETE CASCADE
);

-- Insert Default Roles
INSERT INTO role (role_name) VALUES ('ADMIN'), ('USER'), ('DRIVER'), ('CONDUCTOR');