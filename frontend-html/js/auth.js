// Auth JavaScript - Login and Signup

const API_URL = 'http://localhost:8080/api';

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Login Form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    userId: data.userId,
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    isVerified: data.isVerified
                }));
                
                showNotification('Login successful!', 'success');
                
                // Redirect based on role
                if (data.role === 'ADMIN') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'home.html';
                }
            } else {
                showNotification(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        }
    });
}

// Signup Form
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            mobileNo: document.getElementById('mobile').value,
            aadhaarNo: document.getElementById('aadhaar').value || null,
            password: document.getElementById('password').value,
            roleName: document.getElementById('role').value
        };
        
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification(data.message, 'success');
                // Store email for OTP verification
                localStorage.setItem('otpEmail', formData.email);
                // Show OTP modal
                document.getElementById('otp-modal').classList.add('show');
            } else {
                showNotification(data.message || 'Signup failed', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        }
    });
}

// OTP Verification Form
const otpForm = document.getElementById('otp-form');
if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = localStorage.getItem('otpEmail');
        const otpCode = document.getElementById('otp').value;
        
        try {
            const response = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otpCode })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification(data.message, 'success');
                localStorage.removeItem('otpEmail');
                document.getElementById('otp-modal').classList.remove('show');
                
                // Redirect to login
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showNotification(data.message || 'OTP verification failed', 'error');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        }
    });
}

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        // User is logged in, redirect to home
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
            window.location.href = 'home.html';
        }
    }
}

checkAuth();