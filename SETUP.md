# Rajasthan Digital Education Platform - Setup Guide

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Visit: `http://localhost:3000`

## 🔥 Firebase Setup (For Google Hosting)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name: "rajasthan-education"
4. Enable Google Analytics (optional)

### 2. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3. Login to Firebase
```bash
firebase login
```

### 4. Initialize Firebase
```bash
firebase init
```
Select:
- ✅ Hosting
- ✅ Functions (optional)
- Choose existing project: "rajasthan-education"

### 5. Deploy to Firebase
```bash
firebase deploy
```

## 🌐 Google Cloud Platform Setup (Alternative)

### 1. Create GCP Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "rajasthan-education"

### 2. Enable App Engine
```bash
gcloud app create --region=asia-south1
```

### 3. Deploy to App Engine
```bash
gcloud app deploy
```

## 📱 Features Available

### ✅ Working Features
- User Registration/Login
- College Listing (API)
- Course Management (API)
- Live Class Creation
- Contact Forms
- Newsletter Subscription

### 🔄 Backend APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/colleges` - Get all colleges
- `GET /api/courses` - Get all courses
- `POST /api/classes/create` - Create live class

### 🎯 Next Steps
1. **Database Integration**: Connect Firebase Firestore
2. **File Upload**: Add video/document upload
3. **Payment Gateway**: For course fees
4. **Mobile App**: React Native version
5. **Admin Panel**: College management

## 🔧 Environment Variables

Create `.env` file:
```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=rajasthan-education.firebaseapp.com
FIREBASE_PROJECT_ID=rajasthan-education
JWT_SECRET=your-secret-key
```

## 📞 Support
- Email: info@rajasthaneducation.gov.in
- Phone: 1800-180-6127

## 🏆 Government of Rajasthan
Digital India Initiative - Rural Education Project