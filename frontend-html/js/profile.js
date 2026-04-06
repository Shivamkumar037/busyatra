const API_URL = 'http://localhost:8080/api';
function getToken() { return localStorage.getItem('token'); }

if (!getToken()) window.location.href = 'login.html';

const user = JSON.parse(localStorage.getItem('user') || '{}');
if (user.name) {
    document.getElementById('userInitial').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userRole').textContent = user.role;
    document.getElementById('userVerified').textContent = user.isVerified ? 'Yes ✓' : 'No ✗';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});
