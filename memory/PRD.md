# Bus Yatra - Smart Bus Booking Platform

## Original Problem Statement
Create a full-stack Bus Reservation System with Java Spring Boot backend and HTML/CSS/JavaScript frontend. Features include Admin/Passenger roles, JWT auth, Gmail OTP, Razorpay integration, bus/route/schedule management, seat selection, booking, and cancellations.

## Tech Stack
- **Backend**: Java Spring Boot + MySQL (planned)
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Data Layer**: Currently localStorage (frontend-only), will switch to API when backend ready

## Architecture
```
/app/
├── java-backend/       # Spring Boot backend (not yet compiled/tested)
├── frontend-html/      # Complete frontend
│   ├── index.html      # Splash screen
│   ├── login.html      # Login page
│   ├── signup.html     # Signup with OTP
│   ├── home.html       # Home/Search page
│   ├── tickets.html    # My Tickets
│   ├── cancel.html     # Cancel booking
│   ├── profile.html    # User profile
│   ├── admin/dashboard.html  # Full admin dashboard
│   ├── css/style.css   # Complete styles (Blinkit theme)
│   └── js/             # All JS files
```

## What's Implemented

### Frontend (COMPLETE)
- [x] Splash screen with 3D bus animation
- [x] Login page with JWT auth flow
- [x] Signup page with OTP modal
- [x] Home page with bus search
- [x] Tickets page - view bookings
- [x] Cancel ticket page with refund policy
- [x] Profile page with user info
- [x] **Admin Dashboard - FULLY FUNCTIONAL:**
  - [x] Overview with real stats (buses, routes, bookings, revenue)
  - [x] Add Bus form (bus number, type, seats, driver, status)
  - [x] Manage Buses (table with Edit/Delete)
  - [x] Add Route form (source, destination, distance, price, duration)
  - [x] Manage Routes (table with Edit/Delete)
  - [x] Create Schedule (bus + route selection, date, time, price)
  - [x] View Schedules (table with Delete)
  - [x] All Bookings (table with status filter)
  - [x] Demo data seeding on first visit
  - [x] LocalStorage-based CRUD operations

### Backend (BOILERPLATE ONLY - NOT TESTED)
- [x] Java Spring Boot project structure created
- [ ] Compilation/build verification pending
- [ ] API endpoints not tested

## Backlog (P0/P1/P2)

### P0 - Critical
- [ ] Java backend compilation and testing (`mvn clean install`)
- [ ] End-to-end frontend-backend integration

### P1 - Important  
- [ ] Razorpay payment integration (needs user API key)
- [ ] Gmail SMTP OTP verification (needs user app password)
- [ ] Seat selection UI page (frontend)

### P2 - Nice to Have
- [ ] AI Seat Recommendation backend logic
- [ ] Live Bus Tracking
- [ ] Group Booking Discounts
- [ ] Mobile responsive improvements

## Design Theme
- Blinkit-inspired: Blue (#1E40AF) + Green (#0CAF60) + White
- 3D card effects, glassmorphism
- Font: Inter + Poppins
- Responsive design with sidebar dashboard

## Date: Feb 2026
