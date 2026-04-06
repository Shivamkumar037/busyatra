// Auth JavaScript - Professional Implementation
const API_URL = 'http://localhost:8080/api';

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerHTML = '<span class="loading"></span>';
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                showToast('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = data.role === 'ADMIN' ? 'admin/dashboard.html' : 'home.html';
                }, 1000);
            } else {
                showToast(data.message || 'Login failed', 'error');
                btn.innerHTML = '<span>Sign In</span>';
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
            btn.innerHTML = '<span>Sign In</span>';
        }
    });
}

// Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerHTML = '<span class="loading"></span>';
        
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    mobileNo: document.getElementById('mobile').value,
                    aadhaarNo: document.getElementById('aadhaar').value || null,
                    password: document.getElementById('password').value,
                    roleName: document.getElementById('role').value
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showToast(data.message, 'success');
                localStorage.setItem('otpEmail', document.getElementById('email').value);
                document.getElementById('otpModal').classList.add('show');
                btn.innerHTML = '<span>Create Account</span>';
            } else {
                showToast(data.message || 'Signup failed', 'error');
                btn.innerHTML = '<span>Create Account</span>';
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
            btn.innerHTML = '<span>Create Account</span>';
        }
    });
}

// OTP Form
const otpForm = document.getElementById('otpForm');
if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('otpEmail');
        const otpCode = document.getElementById('otpCode').value;
        
        try {
            const response = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otpCode })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showToast('Email verified! Redirecting to login...', 'success');
                localStorage.removeItem('otpEmail');
                setTimeout(() => window.location.href = 'login.html', 1500);
            } else {
                showToast(data.message || 'Invalid OTP', 'error');
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        }
    });
}
