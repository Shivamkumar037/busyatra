// Payment JavaScript - Razorpay Integration

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

// Payment Page
if (window.location.pathname.includes('payment.html')) {
    loadPaymentPage();
}

let currentBooking = null;

function loadPaymentPage() {
    const booking = JSON.parse(localStorage.getItem('currentBooking'));
    
    if (!booking) {
        showNotification('No booking found', 'error');
        setTimeout(() => window.location.href = 'home.html', 2000);
        return;
    }
    
    currentBooking = booking;
    
    // Display booking details
    document.getElementById('booking-id').textContent = booking.bookingId;
    document.getElementById('bus-number').textContent = booking.busNo;
    document.getElementById('route').textContent = `${booking.source} → ${booking.destination}`;
    document.getElementById('travel-date').textContent = booking.travelDate;
    document.getElementById('seats').textContent = booking.passengers.map(p => p.seatNo).join(', ');
    document.getElementById('amount').textContent = '₹' + booking.totalAmount;
    
    // Pay button
    document.getElementById('pay-btn').addEventListener('click', initiatePayment);
}

async function initiatePayment() {
    try {
        // Create payment order
        const response = await fetch(`${API_URL}/payment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                bookingId: currentBooking.bookingId,
                amount: currentBooking.totalAmount,
                paymentMethod: 'RAZORPAY'
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.data) {
            openRazorpay(result.data);
        } else {
            showNotification('Failed to create payment order', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('An error occurred', 'error');
    }
}

function openRazorpay(orderData) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const options = {
        key: orderData.keyId, // Razorpay key from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Bus Yatra',
        description: 'Bus Ticket Booking',
        order_id: orderData.orderId,
        handler: function (response) {
            verifyPayment(response);
        },
        prefill: {
            name: user.name,
            email: user.email
        },
        theme: {
            color: '#FF6B35'
        },
        modal: {
            ondismiss: function() {
                showNotification('Payment cancelled', 'error');
            }
        }
    };
    
    const razorpay = new Razorpay(options);
    razorpay.open();
}

async function verifyPayment(paymentResponse) {
    try {
        const response = await fetch(`${API_URL}/payment/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                bookingId: currentBooking.bookingId,
                transactionId: paymentResponse.razorpay_payment_id,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpaySignature: paymentResponse.razorpay_signature
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Payment successful! Booking confirmed.', 'success');
            localStorage.removeItem('currentBooking');
            localStorage.removeItem('selectedSeats');
            localStorage.removeItem('selectedScheduleId');
            
            setTimeout(() => {
                window.location.href = 'my-tickets.html';
            }, 2000);
        } else {
            showNotification('Payment verification failed', 'error');
        }
    } catch (error) {
        console.error('Verification error:', error);
        showNotification('An error occurred during verification', 'error');
    }
}