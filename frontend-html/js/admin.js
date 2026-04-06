/* ===== BUS YATRA ADMIN DASHBOARD - Complete ===== */
const API_URL = 'http://localhost:8080/api';

/* --- Helpers --- */
function getToken() { return localStorage.getItem('token'); }
function showToast(m, t = 'success') {
    const e = document.getElementById('toast');
    e.textContent = m;
    e.className = `toast ${t} show`;
    setTimeout(() => e.classList.remove('show'), 3000);
}

/* --- LocalStorage Data Layer --- */
function getData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}
function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
function genId() {
    return 'BY' + Date.now().toString(36).toUpperCase();
}

/* --- Seed Demo Data (first visit only) --- */
function seedDemoData() {
    if (localStorage.getItem('busyatra_seeded')) return;

    const buses = [
        { id: genId(), busNo: 'KA01AB1234', busType: 'AC Sleeper', totalSeats: 40, driverName: 'Rajesh Kumar', status: 'Active', createdAt: new Date().toISOString() },
        { id: genId(), busNo: 'MH02CD5678', busType: 'Non-AC Seater', totalSeats: 50, driverName: 'Amit Singh', status: 'Active', createdAt: new Date().toISOString() },
        { id: genId(), busNo: 'DL03EF9012', busType: 'AC Seater', totalSeats: 36, driverName: 'Vikram Patel', status: 'Active', createdAt: new Date().toISOString() },
    ];

    const routes = [
        { id: genId(), sourceCity: 'Delhi', destinationCity: 'Jaipur', distance: 280, basePrice: 650, duration: '5h 30m', status: 'Active', createdAt: new Date().toISOString() },
        { id: genId(), sourceCity: 'Mumbai', destinationCity: 'Pune', distance: 150, basePrice: 450, duration: '3h 00m', status: 'Active', createdAt: new Date().toISOString() },
        { id: genId(), sourceCity: 'Bangalore', destinationCity: 'Chennai', distance: 350, basePrice: 800, duration: '6h 00m', status: 'Active', createdAt: new Date().toISOString() },
    ];

    const today = new Date().toISOString().split('T')[0];
    const schedules = [
        { id: genId(), busId: buses[0].id, busNo: buses[0].busNo, routeId: routes[0].id, routeName: `${routes[0].sourceCity} → ${routes[0].destinationCity}`, departureTime: '06:00', arrivalTime: '11:30', travelDate: today, price: routes[0].basePrice, availableSeats: 35, status: 'Active', createdAt: new Date().toISOString() },
        { id: genId(), busId: buses[1].id, busNo: buses[1].busNo, routeId: routes[1].id, routeName: `${routes[1].sourceCity} → ${routes[1].destinationCity}`, departureTime: '08:00', arrivalTime: '11:00', travelDate: today, price: routes[1].basePrice, availableSeats: 48, status: 'Active', createdAt: new Date().toISOString() },
        { id: genId(), busId: buses[2].id, busNo: buses[2].busNo, routeId: routes[2].id, routeName: `${routes[2].sourceCity} → ${routes[2].destinationCity}`, departureTime: '22:00', arrivalTime: '04:00', travelDate: today, price: routes[2].basePrice, availableSeats: 30, status: 'Active', createdAt: new Date().toISOString() },
    ];

    const bookings = [
        { id: genId(), bookingId: 'BK' + Date.now().toString(36).toUpperCase(), userName: 'Rahul Sharma', userEmail: 'rahul@test.com', busNo: buses[0].busNo, route: `${routes[0].sourceCity} → ${routes[0].destinationCity}`, travelDate: today, seats: [5, 6], totalAmount: routes[0].basePrice * 2, bookingStatus: 'CONFIRMED', paymentStatus: 'PAID', createdAt: new Date().toISOString() },
        { id: genId(), bookingId: 'BK' + (Date.now() + 1).toString(36).toUpperCase(), userName: 'Priya Verma', userEmail: 'priya@test.com', busNo: buses[1].busNo, route: `${routes[1].sourceCity} → ${routes[1].destinationCity}`, travelDate: today, seats: [12], totalAmount: routes[1].basePrice, bookingStatus: 'CONFIRMED', paymentStatus: 'PAID', createdAt: new Date().toISOString() },
        { id: genId(), bookingId: 'BK' + (Date.now() + 2).toString(36).toUpperCase(), userName: 'Arun Gupta', userEmail: 'arun@test.com', busNo: buses[2].busNo, route: `${routes[2].sourceCity} → ${routes[2].destinationCity}`, travelDate: today, seats: [1, 2, 3], totalAmount: routes[2].basePrice * 3, bookingStatus: 'PENDING', paymentStatus: 'PENDING', createdAt: new Date().toISOString() },
    ];

    setData('busyatra_buses', buses);
    setData('busyatra_routes', routes);
    setData('busyatra_schedules', schedules);
    setData('busyatra_bookings', bookings);
    localStorage.setItem('busyatra_seeded', 'true');
}

seedDemoData();

/* --- Auth Check --- */
const token = getToken();
// Uncomment below line when backend is ready:
// if (!token) window.location.href = '../login.html';
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) document.getElementById('adminName').textContent = user.name;

/* --- Logout --- */
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../login.html';
});

/* --- Sidebar Navigation --- */
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        loadPage(item.dataset.page);
    });
});

/* --- Page Router --- */
function loadPage(page) {
    const title = document.getElementById('pageTitle');
    const content = document.getElementById('content');

    switch (page) {
        case 'overview':
            title.textContent = 'Dashboard Overview';
            loadOverview();
            break;
        case 'add-bus':
            title.textContent = 'Add New Bus';
            loadAddBusForm();
            break;
        case 'buses':
            title.textContent = 'Manage Buses';
            loadBusesList();
            break;
        case 'add-route':
            title.textContent = 'Add New Route';
            loadAddRouteForm();
            break;
        case 'routes':
            title.textContent = 'Manage Routes';
            loadRoutesList();
            break;
        case 'schedules':
            title.textContent = 'Schedules';
            loadSchedules();
            break;
        case 'add-schedule':
            title.textContent = 'Create Schedule';
            loadAddScheduleForm();
            break;
        case 'bookings':
            title.textContent = 'All Bookings';
            loadBookings();
            break;
    }
}

/* ========================================
   1. OVERVIEW / DASHBOARD
   ======================================== */
function loadOverview() {
    const buses = getData('busyatra_buses');
    const routes = getData('busyatra_routes');
    const bookings = getData('busyatra_bookings');
    const schedules = getData('busyatra_schedules');

    const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'PAID')
        .reduce((sum, b) => sum + b.totalAmount, 0);

    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
    const pendingBookings = bookings.filter(b => b.bookingStatus === 'PENDING').length;

    document.getElementById('content').innerHTML = `
        <div class="grid-4" style="margin-bottom:24px;">
            <div class="stat-card card-3d">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                    <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#3B82F6,#1E40AF);display:flex;align-items:center;justify-content:center;">
                        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    </div>
                </div>
                <div class="stat-value" data-testid="total-buses">${buses.length}</div>
                <div class="stat-label">Total Buses</div>
            </div>
            <div class="stat-card card-3d">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                    <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#0CAF60,#059669);display:flex;align-items:center;justify-content:center;">
                        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7m0 0L9 4"/></svg>
                    </div>
                </div>
                <div class="stat-value" data-testid="total-routes">${routes.length}</div>
                <div class="stat-label">Active Routes</div>
            </div>
            <div class="stat-card card-3d">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                    <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#F59E0B,#D97706);display:flex;align-items:center;justify-content:center;">
                        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                    </div>
                </div>
                <div class="stat-value" data-testid="total-bookings">${bookings.length}</div>
                <div class="stat-label">Total Bookings</div>
            </div>
            <div class="stat-card card-3d">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                    <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#8B5CF6,#7C3AED);display:flex;align-items:center;justify-content:center;">
                        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1"/></svg>
                    </div>
                </div>
                <div class="stat-value" data-testid="total-revenue" style="color:var(--primary-green);">₹${totalRevenue.toLocaleString('en-IN')}</div>
                <div class="stat-label">Total Revenue</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="card" style="margin-bottom:24px;">
            <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:20px;">Quick Actions</h3>
            <div class="grid-4">
                <button class="btn btn-primary" data-testid="quick-add-bus" onclick="loadPage('add-bus')" style="background:linear-gradient(135deg,#3B82F6,#1E40AF);">+ Add Bus</button>
                <button class="btn btn-primary" data-testid="quick-add-route" onclick="loadPage('add-route')" style="background:linear-gradient(135deg,#0CAF60,#059669);">+ Add Route</button>
                <button class="btn btn-primary" data-testid="quick-add-schedule" onclick="loadPage('add-schedule')" style="background:linear-gradient(135deg,#F59E0B,#D97706);">+ Create Schedule</button>
                <button class="btn btn-primary" data-testid="quick-view-bookings" onclick="loadPage('bookings')" style="background:linear-gradient(135deg,#8B5CF6,#7C3AED);">View Bookings</button>
            </div>
        </div>

        <!-- Summary Row -->
        <div class="grid-2">
            <div class="card">
                <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">Booking Status</h3>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:rgba(12,175,96,0.05);border-radius:10px;">
                        <span style="font-weight:600;color:var(--primary-green);">Confirmed</span>
                        <span style="font-weight:800;font-size:1.25rem;">${confirmedBookings}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:rgba(245,158,11,0.05);border-radius:10px;">
                        <span style="font-weight:600;color:#F59E0B;">Pending</span>
                        <span style="font-weight:800;font-size:1.25rem;">${pendingBookings}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:rgba(59,130,246,0.05);border-radius:10px;">
                        <span style="font-weight:600;color:var(--secondary-blue);">Active Schedules</span>
                        <span style="font-weight:800;font-size:1.25rem;">${schedules.length}</span>
                    </div>
                </div>
            </div>
            <div class="card">
                <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">Recent Bookings</h3>
                ${bookings.length > 0 ? bookings.slice(-3).reverse().map(b => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
                        <div>
                            <div style="font-weight:600;font-size:0.95rem;">${b.userName}</div>
                            <div style="color:var(--text-gray);font-size:0.85rem;">${b.route}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-weight:700;color:var(--primary-green);">₹${b.totalAmount}</div>
                            <span style="font-size:0.75rem;padding:2px 8px;border-radius:10px;background:${b.bookingStatus === 'CONFIRMED' ? 'rgba(12,175,96,0.1);color:#0CAF60' : 'rgba(245,158,11,0.1);color:#F59E0B'};">${b.bookingStatus}</span>
                        </div>
                    </div>
                `).join('') : '<p style="color:var(--text-gray);text-align:center;padding:20px;">No bookings yet</p>'}
            </div>
        </div>
    `;
}

/* ========================================
   2. ADD BUS FORM
   ======================================== */
function loadAddBusForm() {
    document.getElementById('content').innerHTML = `
        <div class="card" style="max-width:650px;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:24px;">Add New Bus</h3>
            <form id="addBusForm">
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Bus Number</label>
                        <input type="text" id="busNo" class="form-input" data-testid="bus-number-input" required placeholder="KA01AB1234" pattern="[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bus Type</label>
                        <select id="busType" class="form-select" data-testid="bus-type-select" required>
                            <option value="">Select type</option>
                            <option value="AC Sleeper">AC Sleeper</option>
                            <option value="Non-AC Sleeper">Non-AC Sleeper</option>
                            <option value="AC Seater">AC Seater</option>
                            <option value="Non-AC Seater">Non-AC Seater</option>
                            <option value="Volvo Multi-Axle">Volvo Multi-Axle</option>
                        </select>
                    </div>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Total Seats</label>
                        <input type="number" id="totalSeats" class="form-input" data-testid="total-seats-input" required min="10" max="60" placeholder="40">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Driver Name</label>
                        <input type="text" id="driverName" class="form-input" data-testid="driver-name-input" placeholder="Driver's full name">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select id="busStatus" class="form-select" data-testid="bus-status-select">
                        <option value="Active">Active</option>
                        <option value="Maintenance">Under Maintenance</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" data-testid="add-bus-submit" style="margin-top:8px;">
                    <span>Add Bus</span>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </button>
            </form>
        </div>
    `;

    document.getElementById('addBusForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const buses = getData('busyatra_buses');
        const newBus = {
            id: genId(),
            busNo: document.getElementById('busNo').value.toUpperCase(),
            busType: document.getElementById('busType').value,
            totalSeats: parseInt(document.getElementById('totalSeats').value),
            driverName: document.getElementById('driverName').value || 'Not Assigned',
            status: document.getElementById('busStatus').value,
            createdAt: new Date().toISOString()
        };

        // Check duplicate
        if (buses.find(b => b.busNo === newBus.busNo)) {
            showToast('Bus number already exists!', 'error');
            return;
        }

        buses.push(newBus);
        setData('busyatra_buses', buses);
        showToast('Bus added successfully!', 'success');
        e.target.reset();
    });
}

/* ========================================
   3. MANAGE BUSES LIST
   ======================================== */
function loadBusesList() {
    const buses = getData('busyatra_buses');
    const c = document.getElementById('content');

    if (buses.length === 0) {
        c.innerHTML = `
            <div class="card" style="text-align:center;padding:60px 20px;">
                <svg width="64" height="64" fill="none" stroke="var(--text-gray)" viewBox="0 0 24 24" style="margin:0 auto 16px;display:block;opacity:0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:8px;">No Buses Added Yet</h3>
                <p style="color:var(--text-gray);margin-bottom:20px;">Add your first bus to get started</p>
                <button class="btn btn-primary" data-testid="goto-add-bus" onclick="loadPage('add-bus')" style="width:auto;display:inline-flex;">+ Add Bus</button>
            </div>`;
        return;
    }

    c.innerHTML = `
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="font-size:1.25rem;font-weight:700;">All Buses (${buses.length})</h3>
                <button class="btn btn-primary" data-testid="add-bus-top-btn" onclick="loadPage('add-bus')" style="width:auto;padding:10px 20px;font-size:0.9rem;">+ Add New</button>
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;" data-testid="buses-table">
                    <thead>
                        <tr style="background:var(--bg-light);border-radius:8px;">
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Bus No</th>
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Type</th>
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Seats</th>
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Driver</th>
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Status</th>
                            <th style="padding:12px 16px;text-align:center;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${buses.map(bus => `
                            <tr style="border-bottom:1px solid var(--border);" data-testid="bus-row-${bus.id}">
                                <td style="padding:14px 16px;font-weight:700;">${bus.busNo}</td>
                                <td style="padding:14px 16px;">
                                    <span style="padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;background:rgba(59,130,246,0.1);color:#3B82F6;">${bus.busType}</span>
                                </td>
                                <td style="padding:14px 16px;font-weight:600;">${bus.totalSeats}</td>
                                <td style="padding:14px 16px;">${bus.driverName || '-'}</td>
                                <td style="padding:14px 16px;">
                                    <span style="padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;
                                        ${bus.status === 'Active' ? 'background:rgba(12,175,96,0.1);color:#0CAF60;' : bus.status === 'Maintenance' ? 'background:rgba(245,158,11,0.1);color:#F59E0B;' : 'background:rgba(239,68,68,0.1);color:#EF4444;'}">
                                        ${bus.status}
                                    </span>
                                </td>
                                <td style="padding:14px 16px;text-align:center;">
                                    <button onclick="editBus('${bus.id}')" data-testid="edit-bus-${bus.id}" style="padding:6px 14px;border:1px solid var(--border);border-radius:8px;background:white;cursor:pointer;font-size:0.85rem;font-weight:600;color:var(--secondary-blue);margin-right:6px;">Edit</button>
                                    <button onclick="deleteBus('${bus.id}')" data-testid="delete-bus-${bus.id}" style="padding:6px 14px;border:1px solid rgba(239,68,68,0.3);border-radius:8px;background:rgba(239,68,68,0.05);cursor:pointer;font-size:0.85rem;font-weight:600;color:#EF4444;">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function deleteBus(id) {
    if (!confirm('Are you sure you want to delete this bus?')) return;
    let buses = getData('busyatra_buses');
    buses = buses.filter(b => b.id !== id);
    setData('busyatra_buses', buses);
    showToast('Bus deleted!', 'success');
    loadBusesList();
}

function editBus(id) {
    const buses = getData('busyatra_buses');
    const bus = buses.find(b => b.id === id);
    if (!bus) return;

    document.getElementById('content').innerHTML = `
        <div class="card" style="max-width:650px;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:24px;">Edit Bus - ${bus.busNo}</h3>
            <form id="editBusForm">
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Bus Number</label>
                        <input type="text" id="editBusNo" class="form-input" value="${bus.busNo}" data-testid="edit-bus-number" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bus Type</label>
                        <select id="editBusType" class="form-select" data-testid="edit-bus-type">
                            <option value="AC Sleeper" ${bus.busType === 'AC Sleeper' ? 'selected' : ''}>AC Sleeper</option>
                            <option value="Non-AC Sleeper" ${bus.busType === 'Non-AC Sleeper' ? 'selected' : ''}>Non-AC Sleeper</option>
                            <option value="AC Seater" ${bus.busType === 'AC Seater' ? 'selected' : ''}>AC Seater</option>
                            <option value="Non-AC Seater" ${bus.busType === 'Non-AC Seater' ? 'selected' : ''}>Non-AC Seater</option>
                            <option value="Volvo Multi-Axle" ${bus.busType === 'Volvo Multi-Axle' ? 'selected' : ''}>Volvo Multi-Axle</option>
                        </select>
                    </div>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Total Seats</label>
                        <input type="number" id="editTotalSeats" class="form-input" value="${bus.totalSeats}" data-testid="edit-total-seats" min="10" max="60">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Driver Name</label>
                        <input type="text" id="editDriverName" class="form-input" value="${bus.driverName || ''}" data-testid="edit-driver-name">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select id="editBusStatus" class="form-select" data-testid="edit-bus-status">
                        <option value="Active" ${bus.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Maintenance" ${bus.status === 'Maintenance' ? 'selected' : ''}>Under Maintenance</option>
                        <option value="Inactive" ${bus.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
                <div style="display:flex;gap:12px;margin-top:8px;">
                    <button type="submit" class="btn btn-primary" data-testid="save-bus-edit" style="flex:1;">Save Changes</button>
                    <button type="button" class="btn btn-primary" data-testid="cancel-bus-edit" onclick="loadPage('buses')" style="flex:1;background:#64748B;">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('editBusForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const buses = getData('busyatra_buses');
        const idx = buses.findIndex(b => b.id === id);
        if (idx === -1) return;

        buses[idx] = {
            ...buses[idx],
            busNo: document.getElementById('editBusNo').value.toUpperCase(),
            busType: document.getElementById('editBusType').value,
            totalSeats: parseInt(document.getElementById('editTotalSeats').value),
            driverName: document.getElementById('editDriverName').value || 'Not Assigned',
            status: document.getElementById('editBusStatus').value
        };

        setData('busyatra_buses', buses);
        showToast('Bus updated successfully!', 'success');
        loadPage('buses');
    });
}

/* ========================================
   4. ADD ROUTE FORM
   ======================================== */
function loadAddRouteForm() {
    document.getElementById('content').innerHTML = `
        <div class="card" style="max-width:650px;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:24px;">Add New Route</h3>
            <form id="addRouteForm">
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Source City</label>
                        <input type="text" id="sourceCity" class="form-input" data-testid="source-city-input" required placeholder="e.g. Delhi" list="cityList">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Destination City</label>
                        <input type="text" id="destCity" class="form-input" data-testid="dest-city-input" required placeholder="e.g. Jaipur" list="cityList">
                    </div>
                </div>
                <datalist id="cityList">
                    <option value="Delhi"><option value="Mumbai"><option value="Bangalore"><option value="Chennai">
                    <option value="Kolkata"><option value="Jaipur"><option value="Pune"><option value="Hyderabad">
                    <option value="Ahmedabad"><option value="Lucknow"><option value="Bhopal"><option value="Indore">
                    <option value="Chandigarh"><option value="Goa"><option value="Varanasi"><option value="Agra">
                    <option value="Udaipur"><option value="Jodhpur"><option value="Shimla"><option value="Dehradun">
                </datalist>
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Distance (KM)</label>
                        <input type="number" id="distance" class="form-input" data-testid="distance-input" required min="10" placeholder="280">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Base Price (₹)</label>
                        <input type="number" id="basePrice" class="form-input" data-testid="base-price-input" required min="50" placeholder="650">
                    </div>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Estimated Duration</label>
                        <input type="text" id="duration" class="form-input" data-testid="duration-input" required placeholder="5h 30m">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="routeStatus" class="form-select" data-testid="route-status-select">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" data-testid="add-route-submit" style="margin-top:8px;">
                    <span>Add Route</span>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </button>
            </form>
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);text-align:center;">
                <button class="btn btn-primary" data-testid="goto-manage-routes" onclick="loadPage('routes')" style="width:auto;background:var(--secondary-blue);padding:10px 24px;font-size:0.9rem;">View All Routes</button>
            </div>
        </div>
    `;

    document.getElementById('addRouteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const src = document.getElementById('sourceCity').value.trim();
        const dest = document.getElementById('destCity').value.trim();

        if (src.toLowerCase() === dest.toLowerCase()) {
            showToast('Source and destination cannot be same!', 'error');
            return;
        }

        const routes = getData('busyatra_routes');
        const duplicate = routes.find(r =>
            r.sourceCity.toLowerCase() === src.toLowerCase() &&
            r.destinationCity.toLowerCase() === dest.toLowerCase()
        );
        if (duplicate) {
            showToast('This route already exists!', 'error');
            return;
        }

        routes.push({
            id: genId(),
            sourceCity: src,
            destinationCity: dest,
            distance: parseInt(document.getElementById('distance').value),
            basePrice: parseInt(document.getElementById('basePrice').value),
            duration: document.getElementById('duration').value,
            status: document.getElementById('routeStatus').value,
            createdAt: new Date().toISOString()
        });

        setData('busyatra_routes', routes);
        showToast('Route added successfully!', 'success');
        e.target.reset();
    });
}

/* ========================================
   5. MANAGE ROUTES LIST
   ======================================== */
function loadRoutesList() {
    const routes = getData('busyatra_routes');
    const c = document.getElementById('content');

    if (routes.length === 0) {
        c.innerHTML = `
            <div class="card" style="text-align:center;padding:60px 20px;">
                <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:8px;">No Routes Added Yet</h3>
                <p style="color:var(--text-gray);margin-bottom:20px;">Add your first route to get started</p>
                <button class="btn btn-primary" data-testid="goto-add-route" onclick="loadPage('add-route')" style="width:auto;display:inline-flex;">+ Add Route</button>
            </div>`;
        return;
    }

    c.innerHTML = `
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="font-size:1.25rem;font-weight:700;">All Routes (${routes.length})</h3>
                <button class="btn btn-primary" data-testid="add-route-top-btn" onclick="loadPage('add-route')" style="width:auto;padding:10px 20px;font-size:0.9rem;">+ Add New</button>
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;" data-testid="routes-table">
                    <thead>
                        <tr style="background:var(--bg-light);">
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Route</th>
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Distance</th>
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Price</th>
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Duration</th>
                            <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Status</th>
                            <th style="padding:12px 16px;text-align:center;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${routes.map(route => `
                            <tr style="border-bottom:1px solid var(--border);" data-testid="route-row-${route.id}">
                                <td style="padding:14px 16px;">
                                    <div style="font-weight:700;">${route.sourceCity}</div>
                                    <div style="color:var(--text-gray);font-size:0.85rem;">to ${route.destinationCity}</div>
                                </td>
                                <td style="padding:14px 16px;font-weight:600;">${route.distance} km</td>
                                <td style="padding:14px 16px;font-weight:700;color:var(--primary-green);">₹${route.basePrice}</td>
                                <td style="padding:14px 16px;">${route.duration}</td>
                                <td style="padding:14px 16px;">
                                    <span style="padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;
                                        ${route.status === 'Active' ? 'background:rgba(12,175,96,0.1);color:#0CAF60;' : 'background:rgba(239,68,68,0.1);color:#EF4444;'}">
                                        ${route.status}
                                    </span>
                                </td>
                                <td style="padding:14px 16px;text-align:center;">
                                    <button onclick="editRoute('${route.id}')" data-testid="edit-route-${route.id}" style="padding:6px 14px;border:1px solid var(--border);border-radius:8px;background:white;cursor:pointer;font-size:0.85rem;font-weight:600;color:var(--secondary-blue);margin-right:6px;">Edit</button>
                                    <button onclick="deleteRoute('${route.id}')" data-testid="delete-route-${route.id}" style="padding:6px 14px;border:1px solid rgba(239,68,68,0.3);border-radius:8px;background:rgba(239,68,68,0.05);cursor:pointer;font-size:0.85rem;font-weight:600;color:#EF4444;">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function deleteRoute(id) {
    if (!confirm('Are you sure you want to delete this route?')) return;
    let routes = getData('busyatra_routes');
    routes = routes.filter(r => r.id !== id);
    setData('busyatra_routes', routes);
    showToast('Route deleted!', 'success');
    loadRoutesList();
}

function editRoute(id) {
    const routes = getData('busyatra_routes');
    const route = routes.find(r => r.id === id);
    if (!route) return;

    document.getElementById('content').innerHTML = `
        <div class="card" style="max-width:650px;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:24px;">Edit Route</h3>
            <form id="editRouteForm">
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Source City</label>
                        <input type="text" id="editSourceCity" class="form-input" value="${route.sourceCity}" required list="cityList">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Destination City</label>
                        <input type="text" id="editDestCity" class="form-input" value="${route.destinationCity}" required list="cityList">
                    </div>
                </div>
                <datalist id="cityList">
                    <option value="Delhi"><option value="Mumbai"><option value="Bangalore"><option value="Chennai">
                    <option value="Kolkata"><option value="Jaipur"><option value="Pune"><option value="Hyderabad">
                    <option value="Ahmedabad"><option value="Lucknow"><option value="Bhopal"><option value="Indore">
                </datalist>
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Distance (KM)</label>
                        <input type="number" id="editDistance" class="form-input" value="${route.distance}" min="10" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Base Price (₹)</label>
                        <input type="number" id="editBasePrice" class="form-input" value="${route.basePrice}" min="50" required>
                    </div>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Duration</label>
                        <input type="text" id="editDuration" class="form-input" value="${route.duration}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="editRouteStatus" class="form-select">
                            <option value="Active" ${route.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Inactive" ${route.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex;gap:12px;margin-top:8px;">
                    <button type="submit" class="btn btn-primary" style="flex:1;">Save Changes</button>
                    <button type="button" class="btn btn-primary" onclick="loadPage('routes')" style="flex:1;background:#64748B;">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('editRouteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const routes = getData('busyatra_routes');
        const idx = routes.findIndex(r => r.id === id);
        if (idx === -1) return;

        routes[idx] = {
            ...routes[idx],
            sourceCity: document.getElementById('editSourceCity').value.trim(),
            destinationCity: document.getElementById('editDestCity').value.trim(),
            distance: parseInt(document.getElementById('editDistance').value),
            basePrice: parseInt(document.getElementById('editBasePrice').value),
            duration: document.getElementById('editDuration').value,
            status: document.getElementById('editRouteStatus').value
        };

        setData('busyatra_routes', routes);
        showToast('Route updated!', 'success');
        loadPage('routes');
    });
}

/* ========================================
   6. ADD SCHEDULE FORM
   ======================================== */
function loadAddScheduleForm() {
    const buses = getData('busyatra_buses').filter(b => b.status === 'Active');
    const routes = getData('busyatra_routes').filter(r => r.status === 'Active');

    if (buses.length === 0 || routes.length === 0) {
        document.getElementById('content').innerHTML = `
            <div class="card" style="text-align:center;padding:60px 20px;">
                <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:8px;">Cannot Create Schedule</h3>
                <p style="color:var(--text-gray);margin-bottom:20px;">You need at least one active bus and one active route</p>
                <div style="display:flex;gap:12px;justify-content:center;">
                    ${buses.length === 0 ? '<button class="btn btn-primary" onclick="loadPage(\'add-bus\')" style="width:auto;">+ Add Bus</button>' : ''}
                    ${routes.length === 0 ? '<button class="btn btn-primary" onclick="loadPage(\'add-route\')" style="width:auto;background:var(--secondary-blue);">+ Add Route</button>' : ''}
                </div>
            </div>`;
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    document.getElementById('content').innerHTML = `
        <div class="card" style="max-width:650px;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:24px;">Create New Schedule</h3>
            <form id="addScheduleForm">
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Select Bus</label>
                        <select id="scheduleBus" class="form-select" data-testid="schedule-bus-select" required>
                            <option value="">Choose a bus</option>
                            ${buses.map(b => `<option value="${b.id}" data-seats="${b.totalSeats}">${b.busNo} (${b.busType} - ${b.totalSeats} seats)</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Select Route</label>
                        <select id="scheduleRoute" class="form-select" data-testid="schedule-route-select" required>
                            <option value="">Choose a route</option>
                            ${routes.map(r => `<option value="${r.id}" data-price="${r.basePrice}">${r.sourceCity} → ${r.destinationCity} (₹${r.basePrice})</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Travel Date</label>
                        <input type="date" id="scheduleDate" class="form-input" data-testid="schedule-date-input" required min="${today}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ticket Price (₹)</label>
                        <input type="number" id="schedulePrice" class="form-input" data-testid="schedule-price-input" required min="50" placeholder="Auto from route">
                    </div>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Departure Time</label>
                        <input type="time" id="departureTime" class="form-input" data-testid="departure-time-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Arrival Time</label>
                        <input type="time" id="arrivalTime" class="form-input" data-testid="arrival-time-input" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" data-testid="create-schedule-submit" style="margin-top:8px;">
                    <span>Create Schedule</span>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </button>
            </form>
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);text-align:center;">
                <button class="btn btn-primary" data-testid="goto-schedules-list" onclick="loadPage('schedules')" style="width:auto;background:var(--secondary-blue);padding:10px 24px;font-size:0.9rem;">View All Schedules</button>
            </div>
        </div>
    `;

    // Auto-fill price when route is selected
    document.getElementById('scheduleRoute').addEventListener('change', function () {
        const sel = this.options[this.selectedIndex];
        if (sel.dataset.price) {
            document.getElementById('schedulePrice').value = sel.dataset.price;
        }
    });

    document.getElementById('addScheduleForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const busSelect = document.getElementById('scheduleBus');
        const routeSelect = document.getElementById('scheduleRoute');
        const busId = busSelect.value;
        const routeId = routeSelect.value;

        const buses = getData('busyatra_buses');
        const routes = getData('busyatra_routes');
        const bus = buses.find(b => b.id === busId);
        const route = routes.find(r => r.id === routeId);

        if (!bus || !route) {
            showToast('Select valid bus and route!', 'error');
            return;
        }

        const schedules = getData('busyatra_schedules');
        schedules.push({
            id: genId(),
            busId: bus.id,
            busNo: bus.busNo,
            routeId: route.id,
            routeName: `${route.sourceCity} → ${route.destinationCity}`,
            departureTime: document.getElementById('departureTime').value,
            arrivalTime: document.getElementById('arrivalTime').value,
            travelDate: document.getElementById('scheduleDate').value,
            price: parseInt(document.getElementById('schedulePrice').value),
            availableSeats: bus.totalSeats,
            status: 'Active',
            createdAt: new Date().toISOString()
        });

        setData('busyatra_schedules', schedules);
        showToast('Schedule created successfully!', 'success');
        e.target.reset();
    });
}

/* ========================================
   7. SCHEDULES LIST
   ======================================== */
function loadSchedules() {
    const schedules = getData('busyatra_schedules');
    const c = document.getElementById('content');

    c.innerHTML = `
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="font-size:1.25rem;font-weight:700;">All Schedules (${schedules.length})</h3>
                <button class="btn btn-primary" data-testid="add-schedule-top-btn" onclick="loadPage('add-schedule')" style="width:auto;padding:10px 20px;font-size:0.9rem;">+ Create Schedule</button>
            </div>
            ${schedules.length === 0
            ? '<div style="text-align:center;padding:40px 20px;"><p style="color:var(--text-gray);">No schedules created yet</p><button class="btn btn-primary" onclick="loadPage(\'add-schedule\')" style="width:auto;margin-top:16px;">+ Create First Schedule</button></div>'
            : `<div style="overflow-x:auto;">
                    <table style="width:100%;border-collapse:collapse;" data-testid="schedules-table">
                        <thead>
                            <tr style="background:var(--bg-light);">
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Bus</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Route</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Date</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Time</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Price</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Seats</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Status</th>
                                <th style="padding:12px 16px;text-align:center;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${schedules.map(s => `
                                <tr style="border-bottom:1px solid var(--border);" data-testid="schedule-row-${s.id}">
                                    <td style="padding:14px 16px;font-weight:700;">${s.busNo}</td>
                                    <td style="padding:14px 16px;">${s.routeName}</td>
                                    <td style="padding:14px 16px;">${s.travelDate}</td>
                                    <td style="padding:14px 16px;">${s.departureTime} - ${s.arrivalTime}</td>
                                    <td style="padding:14px 16px;font-weight:700;color:var(--primary-green);">₹${s.price}</td>
                                    <td style="padding:14px 16px;font-weight:600;">${s.availableSeats}</td>
                                    <td style="padding:14px 16px;">
                                        <span style="padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;
                                            ${s.status === 'Active' ? 'background:rgba(12,175,96,0.1);color:#0CAF60;' : 'background:rgba(239,68,68,0.1);color:#EF4444;'}">
                                            ${s.status}
                                        </span>
                                    </td>
                                    <td style="padding:14px 16px;text-align:center;">
                                        <button onclick="deleteSchedule('${s.id}')" data-testid="delete-schedule-${s.id}" style="padding:6px 14px;border:1px solid rgba(239,68,68,0.3);border-radius:8px;background:rgba(239,68,68,0.05);cursor:pointer;font-size:0.85rem;font-weight:600;color:#EF4444;">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`
        }
        </div>
    `;
}

function deleteSchedule(id) {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    let schedules = getData('busyatra_schedules');
    schedules = schedules.filter(s => s.id !== id);
    setData('busyatra_schedules', schedules);
    showToast('Schedule deleted!', 'success');
    loadSchedules();
}

/* ========================================
   8. BOOKINGS LIST
   ======================================== */
function loadBookings() {
    const bookings = getData('busyatra_bookings');
    const c = document.getElementById('content');

    c.innerHTML = `
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="font-size:1.25rem;font-weight:700;">All Bookings (${bookings.length})</h3>
                <div style="display:flex;gap:8px;">
                    <select id="bookingFilter" onchange="filterBookings()" data-testid="booking-filter-select" style="padding:8px 16px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;">
                        <option value="ALL">All</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PENDING">Pending</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>
            ${bookings.length === 0
            ? '<div style="text-align:center;padding:60px 20px;"><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:8px;">No Bookings Yet</h3><p style="color:var(--text-gray);">Bookings will appear here when passengers book tickets</p></div>'
            : `<div id="bookingsTableWrap" style="overflow-x:auto;">
                    <table style="width:100%;border-collapse:collapse;" data-testid="bookings-table">
                        <thead>
                            <tr style="background:var(--bg-light);">
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Booking ID</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Passenger</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Bus</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Route</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Date</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Seats</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Amount</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Status</th>
                                <th style="padding:12px 16px;text-align:left;font-size:0.85rem;color:var(--text-gray);font-weight:600;">Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bookings.map(b => `
                                <tr class="booking-row" data-status="${b.bookingStatus}" style="border-bottom:1px solid var(--border);" data-testid="booking-row-${b.id}">
                                    <td style="padding:14px 16px;font-weight:700;font-size:0.9rem;">${b.bookingId}</td>
                                    <td style="padding:14px 16px;">
                                        <div style="font-weight:600;">${b.userName}</div>
                                        <div style="color:var(--text-gray);font-size:0.8rem;">${b.userEmail}</div>
                                    </td>
                                    <td style="padding:14px 16px;font-weight:600;">${b.busNo}</td>
                                    <td style="padding:14px 16px;">${b.route}</td>
                                    <td style="padding:14px 16px;">${b.travelDate}</td>
                                    <td style="padding:14px 16px;font-weight:600;">${b.seats.join(', ')}</td>
                                    <td style="padding:14px 16px;font-weight:700;color:var(--primary-green);">₹${b.totalAmount.toLocaleString('en-IN')}</td>
                                    <td style="padding:14px 16px;">
                                        <span style="padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;
                                            ${b.bookingStatus === 'CONFIRMED' ? 'background:rgba(12,175,96,0.1);color:#0CAF60;' : b.bookingStatus === 'PENDING' ? 'background:rgba(245,158,11,0.1);color:#F59E0B;' : 'background:rgba(239,68,68,0.1);color:#EF4444;'}">
                                            ${b.bookingStatus}
                                        </span>
                                    </td>
                                    <td style="padding:14px 16px;">
                                        <span style="padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600;
                                            ${b.paymentStatus === 'PAID' ? 'background:rgba(12,175,96,0.1);color:#0CAF60;' : 'background:rgba(245,158,11,0.1);color:#F59E0B;'}">
                                            ${b.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`
        }
        </div>
    `;
}

function filterBookings() {
    const filter = document.getElementById('bookingFilter').value;
    document.querySelectorAll('.booking-row').forEach(row => {
        if (filter === 'ALL' || row.dataset.status === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/* --- Load overview on page load --- */
loadOverview();
