// Booking JavaScript - Search, Seat Selection, Passenger Form

const API_URL = 'http://localhost:8080/api';

function getAuthToken() {
    return localStorage.getItem('token');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Search Results Page
if (window.location.pathname.includes('search.html')) {
    loadSearchResults();
}

async function loadSearchResults() {
    const container = document.getElementById('search-results');
    const searchParams = JSON.parse(localStorage.getItem('searchParams') || '{}');
    
    try {
        const url = `${API_URL}/schedule/search?routeId=${searchParams.sourceId}&travelDate=${searchParams.travelDate}`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        
        const result = await response.json();
        
        if (response.ok && result.data && result.data.length > 0) {
            container.innerHTML = '';
            result.data.forEach(schedule => {
                container.appendChild(createBusCard(schedule));
            });
        } else {
            container.innerHTML = '<p class="loading">No buses found for your search</p>';
        }
    } catch (error) {
        console.error('Search error:', error);
        container.innerHTML = '<p class="loading">Failed to load results</p>';
    }
}

function createBusCard(schedule) {
    const card = document.createElement('div');
    card.className = 'bus-card';
    card.innerHTML = `
        <div class="bus-header">
            <div class="bus-name">${schedule.bus.busNo}</div>
            <div class="bus-type">${schedule.bus.busType}</div>
        </div>
        <div class="bus-details">
            <div class="detail-row">
                <span>Route:</span>
                <span>${schedule.route.sourceCity.name} → ${schedule.route.destinationCity.name}</span>
            </div>
            <div class="detail-row">
                <span>Departure:</span>
                <span>${schedule.startTime}</span>
            </div>
            <div class="detail-row">
                <span>Duration:</span>
                <span>${schedule.totalHours} hours</span>
            </div>
            <div class="detail-row">
                <span>Available Seats:</span>
                <span>${schedule.bus.totalSeats}</span>
            </div>
        </div>
        <div class="bus-footer">
            <div class="price">₹${schedule.route.basePrice}</div>
            <button class="btn-select" onclick="selectSchedule(${schedule.id}, ${schedule.route.basePrice})">Select Seats</button>
        </div>
    `;
    return card;
}

function selectSchedule(scheduleId, basePrice) {
    localStorage.setItem('selectedScheduleId', scheduleId);
    localStorage.setItem('basePrice', basePrice);
    window.location.href = 'seat-selection.html';
}

// Seat Selection Page
if (window.location.pathname.includes('seat-selection.html')) {
    loadSeatLayout();
}

let selectedSeats = [];
let availableSeats = [];

async function loadSeatLayout() {
    const scheduleId = localStorage.getItem('selectedScheduleId');
    const basePrice = parseFloat(localStorage.getItem('basePrice'));
    
    try {
        // Load schedule details
        const scheduleResponse = await fetch(`${API_URL}/schedule/${scheduleId}`, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        const scheduleResult = await scheduleResponse.json();
        
        if (scheduleResult.data) {
            const schedule = scheduleResult.data;
            document.getElementById('bus-name').textContent = schedule.bus.busNo + ' - ' + schedule.bus.busType;
            document.getElementById('route-info').textContent = 
                `${schedule.route.sourceCity.name} → ${schedule.route.destinationCity.name} | ${schedule.travelDay} | ${schedule.startTime}`;
        }
        
        // Load available seats
        const seatsResponse = await fetch(`${API_URL}/schedule/${scheduleId}/seats`, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        const seatsResult = await seatsResponse.json();
        
        if (seatsResult.data) {
            availableSeats = seatsResult.data;
            renderSeats(availableSeats);
        }
    } catch (error) {
        console.error('Error loading seats:', error);
        showNotification('Failed to load seats', 'error');
    }
    
    // Proceed button
    document.getElementById('proceed-btn').addEventListener('click', () => {
        if (selectedSeats.length > 0) {
            localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
            window.location.href = 'passenger-form.html';
        }
    });
}

function renderSeats(seats) {
    const container = document.getElementById('seats-container');
    container.innerHTML = '';
    
    seats.forEach(seat => {
        const seatBox = document.createElement('div');
        seatBox.className = `seat-box ${seat.isAvailable ? 'available' : 'booked'}`;
        seatBox.textContent = seat.seatNo;
        
        if (seat.isAvailable) {
            seatBox.onclick = () => toggleSeat(seat, seatBox);
        }
        
        container.appendChild(seatBox);
    });
}

function toggleSeat(seat, element) {
    const index = selectedSeats.findIndex(s => s.id === seat.id);
    
    if (index > -1) {
        selectedSeats.splice(index, 1);
        element.classList.remove('selected');
    } else {
        selectedSeats.push(seat);
        element.classList.add('selected');
    }
    
    updateSelectionSummary();
}

function updateSelectionSummary() {
    const basePrice = parseFloat(localStorage.getItem('basePrice'));
    const seatNumbers = selectedSeats.map(s => s.seatNo).join(', ');
    const totalAmount = basePrice * selectedSeats.length;
    
    document.getElementById('selected-seats').textContent = seatNumbers || 'None';
    document.getElementById('total-amount').textContent = totalAmount;
    document.getElementById('proceed-btn').disabled = selectedSeats.length === 0;
}

// Passenger Form Page
if (window.location.pathname.includes('passenger-form.html')) {
    loadPassengerForm();
}

function loadPassengerForm() {
    const seats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
    const basePrice = parseFloat(localStorage.getItem('basePrice'));
    const container = document.getElementById('passengers-container');
    
    container.innerHTML = '';
    
    seats.forEach((seat, index) => {
        const passengerSection = document.createElement('div');
        passengerSection.className = 'passenger-section';
        passengerSection.innerHTML = `
            <h3>Passenger ${index + 1} - Seat ${seat.seatNo}</h3>
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name_${index}" required placeholder="Enter full name">
            </div>
            <div class="form-group">
                <label>Aadhaar Number</label>
                <input type="text" name="aadhaar_${index}" required pattern="[0-9]{12}" placeholder="12-digit aadhaar">
            </div>
            <div class="form-group">
                <label>Mobile Number</label>
                <input type="tel" name="mobile_${index}" required pattern="[0-9]{10}" placeholder="10-digit mobile">
            </div>
        `;
        container.appendChild(passengerSection);
    });
    
    // Update summary
    document.getElementById('summary-seats').textContent = seats.map(s => s.seatNo).join(', ');
    document.getElementById('summary-amount').textContent = '₹' + (basePrice * seats.length);
    
    // Form submission
    document.getElementById('passenger-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createBooking();
    });
}

async function createBooking() {
    const scheduleId = localStorage.getItem('selectedScheduleId');
    const seats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
    
    const passengers = seats.map((seat, index) => ({
        name: document.querySelector(`[name="name_${index}"]`).value,
        aadhaarNo: document.querySelector(`[name="aadhaar_${index}"]`).value,
        mobileNo: document.querySelector(`[name="mobile_${index}"]`).value,
        seatId: seat.seat.id
    }));
    
    const bookingData = {
        scheduleId: parseInt(scheduleId),
        passengers
    };
    
    try {
        const response = await fetch(`${API_URL}/booking/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            localStorage.setItem('currentBooking', JSON.stringify(result.data));
            showNotification('Booking created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'payment.html';
            }, 1500);
        } else {
            showNotification(result.message || 'Booking failed', 'error');
        }
    } catch (error) {
        console.error('Booking error:', error);
        showNotification('An error occurred. Please try again.', 'error');
    }
}