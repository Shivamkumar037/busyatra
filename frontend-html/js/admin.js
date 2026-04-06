// Admin Dashboard JavaScript
const API_URL = 'http://localhost:8080/api';

function getToken() {
    return localStorage.getItem('token');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Check auth
const token = getToken();
if (!token) {
    window.location.href = '../login.html';
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../login.html';
});

// Load user info
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('adminName').textContent = user.name;
}

// Page navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const page = item.dataset.page;
        loadPage(page);
    });
});

function loadPage(page) {
    const pageTitle = document.getElementById('pageTitle');
    const content = document.getElementById('content');
    
    switch(page) {
        case 'overview':
            pageTitle.textContent = 'Dashboard Overview';
            loadOverview();
            break;
        case 'add-bus':
            pageTitle.textContent = 'Add New Bus';
            loadAddBusForm();
            break;
        case 'manage-buses':
            pageTitle.textContent = 'Manage Buses';
            loadBusesList();
            break;
        case 'add-route':
            pageTitle.textContent = 'Add Route';
            loadAddRouteForm();
            break;
        case 'schedules':
            pageTitle.textContent = 'Manage Schedules';
            loadSchedules();
            break;
        case 'bookings':
            pageTitle.textContent = 'All Bookings';
            loadBookings();
            break;
    }
}

async function loadOverview() {
    // Load dashboard stats
    showToast('Dashboard loaded successfully');
}

function loadAddBusForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card" style="max-width: 600px;">
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 24px;">Add New Bus</h3>
            <form id="addBusForm">
                <div class="form-group">
                    <label class="form-label">Bus Number</label>
                    <input type="text" id="busNo" class="form-input" required placeholder="e.g., KA01AB1234">
                </div>
                <div class="form-group">
                    <label class="form-label">Bus Type</label>
                    <select id="busType" class="form-select" required>
                        <option value="AC Sleeper">AC Sleeper</option>
                        <option value="Non-AC Sleeper">Non-AC Sleeper</option>
                        <option value="AC Seater">AC Seater</option>
                        <option value="Non-AC Seater">Non-AC Seater</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Total Seats</label>
                    <input type="number" id="totalSeats" class="form-input" required min="10" max="60" placeholder="e.g., 40">
                </div>
                <button type="submit" class="btn btn-primary">Add Bus</button>
            </form>
        </div>
    `;
    
    document.getElementById('addBusForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/admin/add-bus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    busNo: document.getElementById('busNo').value,
                    busType: document.getElementById('busType').value,
                    totalSeats: parseInt(document.getElementById('totalSeats').value)
                })
            });
            
            if (response.ok) {
                showToast('Bus added successfully!', 'success');
                e.target.reset();
            } else {
                showToast('Failed to add bus', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        }
    });
}

function loadBusesList() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 20px;">All Buses</h3>
            <p style="color: var(--text-gray);">Loading buses...</p>
        </div>
    `;
}

function loadAddRouteForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card" style="max-width: 600px;">
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 24px;">Add New Route</h3>
            <p style="color: var(--text-gray);">Route management form will be available soon</p>
        </div>
    `;
}

function loadSchedules() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 20px;">Manage Schedules</h3>
            <p style="color: var(--text-gray);">No schedules available</p>
        </div>
    `;
}

function loadBookings() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 20px;">All Bookings</h3>
            <p style="color: var(--text-gray);">No bookings found</p>
        </div>
    `;
}
