# Bus Yatra - Complete Bus Reservation System

## Project Overview

**Bus Yatra** is a full-stack bus reservation system built with:
- **Backend**: Java Spring Boot 3.2.0
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay Integration
- **Email**: Gmail SMTP for OTP verification

---

## Features

### User Features
- ✅ User Registration with Email OTP Verification
- ✅ Login with JWT Authentication
- ✅ Role-based Access (USER, ADMIN, DRIVER, CONDUCTOR)
- ✅ Search buses by source, destination, and date
- ✅ View today's available buses
- ✅ Real-time seat selection
- ✅ Multiple passenger booking
- ✅ Razorpay payment integration
- ✅ Digital ticket generation
- ✅ View booking history
- ✅ Ticket cancellation with automatic refund calculation
- ✅ User profile management

### Admin Features
- ✅ Add and manage buses
- ✅ Create routes with stops
- ✅ Create bus schedules
- ✅ Assign drivers and conductors
- ✅ View all bookings
- ✅ Manage cancellations and refunds
- ✅ Bus status management

### System Features
- ✅ Automatic seat availability management
- ✅ Dynamic pricing based on route
- ✅ Cancellation policy with refund calculation
- ✅ Email notifications for bookings and cancellations
- ✅ Secure password storage with BCrypt
- ✅ CORS configuration for frontend-backend communication

---

## Tech Stack Details

### Backend (Java Spring Boot)

**Dependencies:**
- Spring Boot Web
- Spring Data JPA
- Spring Security
- Spring Boot Validation
- Spring Boot Mail
- MySQL Driver
- JWT (jjwt 0.12.3)
- Razorpay Java SDK (1.4.3)
- Lombok
- Spring Boot DevTools

**Project Structure:**
```
src/main/java/com/busyatra/
├── BusYatraApplication.java          # Main application class
├── config/
│   └── SecurityConfig.java           # Security & JWT configuration
├── controller/                        # REST API Controllers
│   ├── AuthController.java
│   ├── AdminController.java
│   ├── BusController.java
│   ├── RouteController.java
│   ├── ScheduleController.java
│   ├── BookingController.java
│   ├── PaymentController.java
│   └── CancellationController.java
├── service/                           # Business logic layer
│   ├── AuthService.java
│   ├── EmailService.java
│   ├── OtpService.java
│   ├── BusService.java
│   ├── RouteService.java
│   ├── ScheduleService.java
│   ├── BookingService.java
│   ├── PaymentService.java
│   └── CancellationService.java
├── repository/                        # Data access layer
│   ├── UserRepository.java
│   ├── RoleRepository.java
│   ├── OtpRepository.java
│   ├── BusRepository.java
│   ├── RouteRepository.java
│   ├── ScheduleRepository.java
│   ├── BookingRepository.java
│   ├── PaymentRepository.java
│   └── CancellationRepository.java
├── entity/                            # JPA Entities
│   ├── User.java
│   ├── Role.java
│   ├── Otp.java
│   ├── City.java
│   ├── Route.java
│   ├── Stop.java
│   ├── Bus.java
│   ├── Seat.java
│   ├── Schedule.java
│   ├── SeatAvailability.java
│   ├── Booking.java
│   ├── Passenger.java
│   ├── Payment.java
│   ├── Cancellation.java
│   └── Refund.java
├── dto/                               # Data Transfer Objects
│   ├── SignUpRequest.java
│   ├── LoginRequest.java
│   ├── AuthResponse.java
│   ├── OtpVerificationRequest.java
│   ├── ApiResponse.java
│   ├── AddBusRequest.java
│   ├── AddRouteRequest.java
│   ├── CreateScheduleRequest.java
│   ├── CreateBookingRequest.java
│   ├── CreatePaymentRequest.java
│   └── CancelTicketRequest.java
├── security/                          # Security components
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
└── exception/                         # Exception handling
    ├── GlobalExceptionHandler.java
    ├── ResourceNotFoundException.java
    ├── BadRequestException.java
    └── UnauthorizedException.java
```

### Frontend (HTML/CSS/JavaScript)

**Pages:**
- index.html - Splash screen with logo animation
- login.html - User login page
- signup.html - User registration with OTP modal
- home.html - Dashboard with search and today's buses
- search.html - Bus search results
- seat-selection.html - Interactive seat selection UI
- passenger-form.html - Multi-passenger details form
- payment.html - Razorpay payment integration
- my-tickets.html - Booking history
- cancel-ticket.html - Ticket cancellation
- profile.html - User profile

**CSS Features:**
- Mobile-first responsive design
- Modern gradient backgrounds
- Smooth animations and transitions
- Custom seat selection layout
- Bottom navigation bar
- Modal dialogs
- Toast notifications

**JavaScript Modules:**
- auth.js - Login, Signup, OTP verification
- app.js - Main app logic, profile, tickets
- booking.js - Search, seat selection, booking flow
- payment.js - Razorpay integration

---

## Database Schema

### Tables

1. **role** - User roles (ADMIN, USER, DRIVER, CONDUCTOR)
2. **user** - User information with role reference
3. **otp** - OTP codes for email verification
4. **city** - Cities for routes
5. **route** - Bus routes between cities
6. **stop** - Stops in routes
7. **bus** - Bus information
8. **seat** - Seats in each bus
9. **schedule** - Bus schedules for specific dates
10. **seat_availability** - Real-time seat availability
11. **booking** - Ticket bookings
12. **passenger** - Passenger details in bookings
13. **payment** - Payment transactions
14. **cancellation** - Cancelled bookings
15. **refund** - Refund records

---

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- A web browser

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE bus_yatra;
```

2. Run the schema script:
```bash
mysql -u root -p bus_yatra < src/main/resources/schema.sql
```

### Backend Configuration

1. Update `src/main/resources/application.properties`:
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/bus_yatra
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# Gmail SMTP (for OTP)
spring.mail.username=YOUR_GMAIL_ADDRESS
spring.mail.password=YOUR_APP_PASSWORD

# Razorpay
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET

# JWT Secret (change this!)
jwt.secret=YOUR_JWT_SECRET_KEY_HERE
```

2. Build the project:
```bash
cd java-backend
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

Backend will run on: `http://localhost:8080/api`

### Frontend Setup

1. Open `frontend-html` folder

2. Update API URL in JavaScript files if needed:
   - `js/auth.js`
   - `js/app.js`
   - `js/booking.js`
   - `js/payment.js`

3. Open `index.html` in a web browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000
```

4. Access the application:
```
http://localhost:8000
```

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP

### Admin Operations
- `POST /api/admin/add-bus` - Add new bus
- `POST /api/admin/add-route` - Add new route
- `POST /api/admin/add-stop` - Add stop to route
- `POST /api/admin/create-schedule` - Create schedule
- `GET /api/admin/bookings` - View all bookings
- `POST /api/admin/process-refund` - Process refund

### Bus Operations
- `POST /api/bus/search` - Search buses
- `GET /api/bus/{busNo}` - Get bus by number
- `GET /api/bus/today` - Get today's buses

### Route Operations
- `GET /api/routes` - Get all routes
- `GET /api/routes/search` - Search routes
- `GET /api/routes/{routeId}/stops` - Get stops

### Schedule Operations
- `GET /api/schedule/search` - Search schedules
- `GET /api/schedule/{id}` - Get schedule details
- `GET /api/schedule/{id}/seats` - Get available seats

### Booking Operations
- `POST /api/booking/create` - Create booking
- `GET /api/booking/user` - Get user bookings
- `GET /api/booking/{bookingId}` - Get booking details

### Payment Operations
- `POST /api/payment/create` - Create payment order
- `POST /api/payment/verify` - Verify payment

### Cancellation Operations
- `POST /api/ticket/cancel` - Cancel ticket
- `GET /api/refund/status/{bookingId}` - Check refund status

---

## Default Admin Account

After running the schema, create an admin user:

```sql
INSERT INTO user (name, email, password, mobile_no, role_id, is_active, is_verified) 
VALUES (
    'Admin User', 
    'admin@busyatra.com', 
    '$2a$10$...', -- Use BCrypt encoded password
    '9999999999',
    1, -- ADMIN role_id
    true,
    true
);
```

---

## Cancellation Policy

- **More than 7 days before travel**: 90% refund
- **3-7 days before travel**: 75% refund
- **1-2 days before travel**: 50% refund
- **Same day**: 25% refund
- **After travel date**: No refund

---

## Security Features

- JWT token-based authentication
- BCrypt password encryption
- Role-based access control
- CORS configuration
- Request validation
- Global exception handling

---

## Payment Integration

The system uses Razorpay for payments:

1. **Payment Flow**:
   - User creates booking
   - Payment order is created
   - Razorpay checkout opens
   - Payment is processed
   - Signature is verified
   - Booking is confirmed

2. **Test Credentials**:
   - Use Razorpay test mode keys
   - Test card: 4111 1111 1111 1111
   - Any future CVV and expiry

---

## Email Notifications

System sends emails for:
- OTP verification during signup
- Booking confirmation
- Cancellation confirmation with refund amount

---

## Future Enhancements

- [ ] PDF ticket generation
- [ ] QR code for tickets
- [ ] SMS notifications
- [ ] Admin dashboard with analytics
- [ ] Bus tracking
- [ ] Rating and reviews
- [ ] Offers and coupons
- [ ] Multi-language support

---

## Troubleshooting

### Common Issues

**Issue**: Database connection error
**Solution**: Check MySQL is running and credentials are correct

**Issue**: Email not sending
**Solution**: Enable "Less secure app access" in Gmail or use App Password

**Issue**: CORS errors
**Solution**: Check CORS configuration in SecurityConfig.java

**Issue**: JWT token invalid
**Solution**: Ensure token is being sent in Authorization header

---

## Contributing

This is a complete working project. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This project is provided as-is for educational and commercial use.

---

## Contact & Support

For issues, questions, or support:
- Email: support@busyatra.com
- GitHub: [Your Repository URL]

---

## Acknowledgments

- Spring Boot Team
- Razorpay
- MySQL
- All open-source contributors

---

**Built with ❤️ for seamless bus travel booking**
