// Main App JavaScript

const API_URL = 'http://localhost:8080/api';

// Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Get user info
function getUserInfo() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check authentication
function requireAuth() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}

// Load profile information
if (window.location.pathname.includes('profile.html')) {
    requireAuth();
    const user = getUserInfo();
    if (user) {
        document.getElementById('user-initial').textContent = user.name.charAt(0).toUpperCase();
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-role').textContent = user.role;
        document.getElementById('user-verified').textContent = user.isVerified ? 'Yes' : 'No';
    }
}

// Home Page - Search Form
const searchForm = document.getElementById('search-form');
if (searchForm) {
    requireAuth();
    
    // Set minimum date to today
    const dateInput = document.getElementById('travel-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const sourceId = document.getElementById('source').value;
        const destinationId = document.getElementById('destination').value;
        const travelDate = document.getElementById('travel-date').value;
        const busNo = document.getElementById('bus-no').value;
        
        // Store search params
        const searchParams = {
            sourceId,
            destinationId,
            travelDate,
            busNo
        };
        localStorage.setItem('searchParams', JSON.stringify(searchParams));
        
        window.location.href = 'search.html';
    });
    
    // Load today's buses
    loadTodaysBuses();
}

async function loadTodaysBuses() {
    const container = document.getElementById('today-buses');
    
    try {
        const response = await fetch(`${API_URL}/bus/today`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        const result = await response.json();
        
        if (response.ok && result.data && result.data.length > 0) {
            container.innerHTML = '';
            result.data.forEach(schedule => {
                const busCard = createBusCard(schedule);
                container.appendChild(busCard);
            });
        } else {
            container.innerHTML = '<p class="loading">No buses available today</p>';
        }
    } catch (error) {
        console.error('Error loading buses:', error);
        container.innerHTML = '<p class="loading">Failed to load buses</p>';
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
        </div>
        <div class="bus-footer">
            <div class="price">₹${schedule.route.basePrice}</div>
            <button class="btn-select" onclick="selectBus(${schedule.id})">Select</button>
        </div>
    `;
    return card;
}

function selectBus(scheduleId) {
    localStorage.setItem('selectedSchedule', scheduleId);
    window.location.href = 'seat-selection.html';
}

// My Tickets Page
if (window.location.pathname.includes('my-tickets.html')) {
    requireAuth();
    loadMyTickets();
}

async function loadMyTickets() {
    const container = document.getElementById('tickets-container');
    
    try {
        const response = await fetch(`${API_URL}/booking/user`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        const result = await response.json();
        
        if (response.ok && result.data && result.data.length > 0) {
            container.innerHTML = '';
            result.data.forEach(booking => {
                const ticketCard = createTicketCard(booking);
                container.appendChild(ticketCard);
            });
        } else {
            container.innerHTML = '<p class="loading">No tickets found</p>';
        }
    } catch (error) {
        console.error('Error loading tickets:', error);
        container.innerHTML = '<p class="loading">Failed to load tickets</p>';
    }
}

function createTicketCard(booking) {
    const card = document.createElement('div');
    card.className = 'ticket-card';
    
    const statusClass = booking.bookingStatus.toLowerCase();
    const seats = booking.passengers.map(p => p.seatNo).join(', ');
    
    card.innerHTML = `
        <div class="ticket-header">
            <div class="ticket-id">${booking.bookingId}</div>
            <div class="status ${statusClass}">${booking.bookingStatus}</div>
        </div>
        <div class="bus-details">
            <div class="detail-row">
                <span>Bus:</span>
                <span>${booking.busNo}</span>
            </div>
            <div class="detail-row">
                <span>Route:</span>
                <span>${booking.source} → ${booking.destination}</span>
            </div>
            <div class="detail-row">
                <span>Travel Date:</span>
                <span>${booking.travelDate}</span>
            </div>
            <div class="detail-row">
                <span>Seats:</span>
                <span>${seats}</span>
            </div>
            <div class="detail-row">
                <span>Amount:</span>
                <span class="amount">₹${booking.totalAmount}</span>
            </div>
        </div>
    `;
    return card;
}

// Cancel Ticket Form
const cancelForm = document.getElementById('cancel-form');
if (cancelForm) {
    requireAuth();
    
    cancelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookingId = document.getElementById('booking-id').value;
        const reason = document.getElementById('reason').value;
        
        if (!confirm('Are you sure you want to cancel this ticket?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/ticket/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ bookingId, reason })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Ticket cancelled successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'my-tickets.html';
                }, 2000);
            } else {
                showNotification(result.message || 'Failed to cancel ticket', 'error');
            }
        } catch (error) {
            console.error('Cancel error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        }
    });
}