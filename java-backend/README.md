# Bus Yatra - Bus Reservation System

## Tech Stack
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven
- Razorpay Payment Integration
- Gmail SMTP for OTP

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup
```bash
mysql -u root -p
source src/main/resources/schema.sql
```

### 2. Configuration
Update `src/main/resources/application.properties`:
- Database credentials
- Gmail SMTP credentials (for OTP)
- Razorpay API keys
- JWT secret key

### 3. Build Project
```bash
mvn clean install
```

### 4. Run Application
```bash
mvn spring-boot:run
```

Application will run on: `http://localhost:8080/api`

## API Endpoints

### Authentication
- POST `/auth/signup` - User registration
- POST `/auth/login` - User login
- POST `/auth/verify-otp` - Verify OTP

### Admin
- POST `/admin/add-bus` - Add new bus
- POST `/admin/add-route` - Add new route
- POST `/admin/add-stop` - Add stop to route
- POST `/admin/create-schedule` - Create bus schedule
- GET `/admin/bookings` - View all bookings

### Bus Operations
- POST `/bus/search` - Search buses
- GET `/bus/{busNo}` - Get bus by number

### Route Operations
- GET `/routes` - Get all routes
- GET `/routes/search` - Search routes

### Schedule Operations
- POST `/schedule/search` - Search schedules
- GET `/schedule/{id}` - Get schedule details

### Booking Operations
- POST `/booking/create` - Create booking
- GET `/booking/user` - Get user bookings
- GET `/booking/{bookingId}` - Get booking details

### Payment Operations
- POST `/payment/create` - Create payment order
- POST `/payment/verify` - Verify payment

### Cancellation Operations
- POST `/ticket/cancel` - Cancel ticket
- GET `/refund/status/{bookingId}` - Check refund status

## Default Admin Credentials
Email: admin@busyatra.com
Password: admin123

## Project Structure
```
src/main/java/com/busyatra/
├── BusYatraApplication.java
├── config/              # Security & App Configuration
├── controller/          # REST Controllers
├── service/             # Business Logic
├── repository/          # Data Access Layer
├── entity/              # JPA Entities
├── dto/                 # Data Transfer Objects
├── security/            # JWT & Security Components
├── exception/           # Custom Exceptions & Handlers
└── util/                # Utility Classes
```

## Features
- JWT Authentication with Role-based Authorization
- OTP Verification via Email
- Bus Management
- Route & Schedule Management
- Seat Selection & Booking
- Razorpay Payment Integration
- Ticket Generation
- Cancellation & Refund Processing
- Admin Dashboard

## Notes
- Replace XXXXXXXX placeholders in application.properties
- Ensure MySQL is running before starting application
- Frontend files are in separate frontend-html folder