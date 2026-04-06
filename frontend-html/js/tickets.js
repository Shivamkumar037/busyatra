const API_URL = 'http://localhost:8080/api';
function getToken() { return localStorage.getItem('token'); }
function showToast(msg, type='success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
}

if (!getToken()) window.location.href = 'login.html';

async function loadTickets() {
    try {
        const res = await fetch(`${API_URL}/booking/user`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await res.json();
        const container = document.getElementById('ticketsContainer');
        
        if (res.ok && data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(b => `
                <div class="ticket-card">
                    <div class="ticket-header">
                        <div class="ticket-id">${b.bookingId}</div>
                        <div class="status-badge status-${b.bookingStatus.toLowerCase()}">${b.bookingStatus}</div>
                    </div>
                    <div class="ticket-details">
                        <div class="detail-row">
                            <span class="detail-label">Bus:</span>
                            <span class="detail-value">${b.busNo}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Route:</span>
                            <span class="detail-value">${b.source} → ${b.destination}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Date:</span>
                            <span class="detail-value">${b.travelDate}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Amount:</span>
                            <span class="detail-value" style="color:var(--primary-green);">₹${b.totalAmount}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                    </svg>
                    <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:8px;">No Tickets Yet</h3>
                    <p style="color:var(--text-gray);">Start booking your bus tickets</p>
                </div>
            `;
        }
    } catch (e) {
        showToast('Failed to load tickets', 'error');
    }
}

loadTickets();
