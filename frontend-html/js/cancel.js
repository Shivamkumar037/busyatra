const API_URL = 'http://localhost:8080/api';
function getToken() { return localStorage.getItem('token'); }
function showToast(msg, type='success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
}

if (!getToken()) window.location.href = 'login.html';

document.getElementById('cancelForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to cancel this ticket?')) return;
    
    const btn = e.target.querySelector('button');
    btn.innerHTML = '<span class="loading"></span>';
    
    try {
        const res = await fetch(`${API_URL}/ticket/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                bookingId: document.getElementById('bookingId').value,
                reason: document.getElementById('reason').value
            })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            showToast('Ticket cancelled successfully! Refund will be processed.', 'success');
            setTimeout(() => window.location.href = 'tickets.html', 2000);
        } else {
            showToast(data.message || 'Cancellation failed', 'error');
            btn.innerHTML = '<span>Cancel Ticket</span>';
        }
    } catch (e) {
        showToast('Network error', 'error');
        btn.innerHTML = '<span>Cancel Ticket</span>';
    }
});
