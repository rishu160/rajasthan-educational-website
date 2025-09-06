const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Auth Routes
app.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, role, college } = req.body;
        
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: name
        });

        await db.collection('users').doc(userRecord.uid).set({
            name,
            email,
            role: role || 'student',
            college: college || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const customToken = await admin.auth().createCustomToken(userRecord.uid);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: customToken,
            user: { id: userRecord.uid, name, email, role }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Colleges Routes
app.get('/colleges', async (req, res) => {
    try {
        const snapshot = await db.collection('colleges').get();
        const colleges = [];
        snapshot.forEach(doc => {
            colleges.push({ id: doc.id, ...doc.data() });
        });
        res.json({ success: true, colleges });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/colleges', async (req, res) => {
    try {
        const collegeData = {
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('colleges').add(collegeData);
        res.status(201).json({ 
            success: true, 
            message: 'College added successfully',
            id: docRef.id 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Payment Routes with Razorpay
app.post('/payments/create-order', async (req, res) => {
    try {
        const { amount, currency, courseId, userId } = req.body;
        
        const paymentData = {
            amount: amount * 100,
            currency: currency || 'INR',
            courseId,
            userId,
            status: 'created',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection('payments').add(paymentData);
        
        res.json({
            success: true,
            orderId: docRef.id,
            amount: paymentData.amount,
            currency: paymentData.currency
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/payments/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
        
        // Update payment status
        await db.collection('payments').doc(orderId).update({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            status: 'completed',
            completedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

exports.api = functions.https.onRequest(app);