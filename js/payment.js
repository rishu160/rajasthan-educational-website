// Payment Gateway Integration (Razorpay)
class PaymentGateway {
    constructor() {
        this.razorpayKeyId = 'rzp_test_1234567890'; // Replace with actual key
        this.apiUrl = window.location.origin + '/api';
    }

    async createOrder(courseData) {
        try {
            const response = await fetch(`${this.apiUrl}/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    amount: courseData.price,
                    currency: 'INR',
                    courseId: courseData.id,
                    userId: JSON.parse(localStorage.getItem('user')).id
                })
            });

            const data = await response.json();
            if (data.success) {
                return this.initiatePayment(data, courseData);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Payment creation failed:', error);
            return { success: false, error: error.message };
        }
    }

    initiatePayment(orderData, courseData) {
        return new Promise((resolve, reject) => {
            const user = JSON.parse(localStorage.getItem('user'));
            
            const options = {
                key: this.razorpayKeyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Rajasthan Digital Education',
                description: `Payment for ${courseData.name}`,
                order_id: orderData.orderId,
                handler: (response) => {
                    this.verifyPayment(response, orderData.orderId)
                        .then(result => resolve(result))
                        .catch(error => reject(error));
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || ''
                },
                theme: {
                    color: '#FF6B35'
                },
                modal: {
                    ondismiss: () => {
                        reject(new Error('Payment cancelled by user'));
                    }
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        });
    }

    async verifyPayment(paymentResponse, orderId) {
        try {
            const response = await fetch(`${this.apiUrl}/payments/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                    orderId: orderId
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Payment verification failed');
        }
    }

    // Course enrollment with payment
    async enrollInCourse(courseId, coursePrice) {
        try {
            const courseData = {
                id: courseId,
                price: coursePrice,
                name: 'Course Enrollment'
            };

            const paymentResult = await this.createOrder(courseData);
            
            if (paymentResult.success) {
                // Enroll user in course after successful payment
                await this.enrollUserInCourse(courseId);
                return { success: true, message: 'Successfully enrolled in course!' };
            } else {
                return { success: false, error: 'Payment failed' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async enrollUserInCourse(courseId) {
        const response = await fetch(`${this.apiUrl}/courses/${courseId}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                userId: JSON.parse(localStorage.getItem('user')).id
            })
        });

        return response.json();
    }
}

// Initialize payment gateway
window.paymentGateway = new PaymentGateway();