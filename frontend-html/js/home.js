const API_URL = 'http://localhost:8080/api';
function getToken() { return localStorage.getItem('token'); }
function showToast(msg, type='success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
}

if (!getToken()) window.location.href = 'login.html';

document.getElementById('travelDate').min = new Date().toISOString().split('T')[0];
document.getElementById('travelDate').value = new Date().toISOString().split('T')[0];

document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('searchData', JSON.stringify({
        source: document.getElementById('source').value,
        destination: document.getElementById('destination').value,
        date: document.getElementById('travelDate').value,
        busNo: document.getElementById('busNo').value
    }));
    showToast('Search feature coming soon!', 'success');
});

async function loadTodayBuses() {
    try {
        const res = await fetch(`${API_URL}/bus/today`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await res.json();
        const container = document.getElementById('todayBuses');
        
        if (res.ok && data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(s => `
                <div class="bus-card">
                    <div class="bus-header">
                        <div class="bus-number">${s.bus.busNo}</div>
                        <div class="bus-type">${s.bus.busType}</div>
                    </div>
                    <div class="bus-route">${s.route.sourceCity.name} → ${s.route.destinationCity.name}</div>
                    <div class="bus-time">Departure: ${s.startTime} | ${s.totalHours}hrs</div>
                    <div class="bus-footer">
                        <div class="price">₹${s.route.basePrice}</div>
                        <button class="btn-book" onclick="alert('Booking coming soon!')">Book Now</button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p style="text-align:center;color:var(--text-gray);padding:40px;">No buses available today</p>';
        }
    } catch (e) {
        document.getElementById('todayBuses').innerHTML = '<p style="text-align:center;color:var(--text-gray);">Failed to load buses</p>';
    }
}

loadTodayBuses();
