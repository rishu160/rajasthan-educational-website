@echo off
color 0A
title Rajasthan Digital Education - Google Firebase Deployment

echo.
echo ==========================================
echo   RAJASTHAN DIGITAL EDUCATION PLATFORM
echo   GOOGLE FIREBASE HOSTING DEPLOYMENT
echo ==========================================
echo.
echo Features Ready for Deployment:
echo ✓ Complete Website with Backend
echo ✓ AI Chatbot with Voice Support
echo ✓ Payment Gateway Integration
echo ✓ Search Functionality
echo ✓ Admin Dashboard
echo ✓ Mobile PWA Support
echo ✓ Analytics Integration
echo.

echo [1/6] Installing Firebase CLI...
npm install -g firebase-tools
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Firebase CLI
    pause
    exit /b 1
)

echo [2/6] Installing project dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [3/6] Firebase Login...
echo Please login with your Google account
firebase login
if %errorlevel% neq 0 (
    echo ERROR: Firebase login failed
    pause
    exit /b 1
)

echo [4/6] Creating Firebase project...
echo Creating project: rajasthan-education-platform
firebase projects:create rajasthan-education-platform --display-name "Rajasthan Digital Education"

echo [5/6] Initializing Firebase...
firebase init hosting functions firestore --project rajasthan-education-platform
if %errorlevel% neq 0 (
    echo ERROR: Firebase initialization failed
    pause
    exit /b 1
)

echo [6/6] Deploying to Google Firebase...
firebase deploy --project rajasthan-education-platform
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   DEPLOYMENT SUCCESSFUL!
echo ==========================================
echo.
echo 🌐 Your website is now LIVE on Google:
echo.
echo Primary URL: https://rajasthan-education-platform.web.app
echo Backup URL:  https://rajasthan-education-platform.firebaseapp.com
echo.
echo 📊 Admin Dashboard: https://rajasthan-education-platform.web.app/admin/dashboard.html
echo 💳 Payment Portal: https://rajasthan-education-platform.web.app/payment-page.html
echo 📱 Mobile App: https://rajasthan-education-platform.web.app/mobile-app.html
echo 🤖 Chatbot Analytics: https://rajasthan-education-platform.web.app/admin/chatbot-analytics.html
echo.
echo 🎯 Features Deployed:
echo ✓ AI Chatbot (Hindi/English + Voice)
echo ✓ Smart Search Engine
echo ✓ Payment Gateway (Razorpay)
echo ✓ User Authentication
echo ✓ Database (Firestore)
echo ✓ Live Classes (Google Meet)
echo ✓ File Downloads
echo ✓ PWA Support
echo ✓ Analytics Tracking
echo.
echo 🏛️ Government of Rajasthan
echo 📚 Digital Education Platform
echo 🌾 Rural College Initiative
echo.
echo Next Steps:
echo 1. Setup custom domain: rajasthaneducation.gov.in
echo 2. Configure SSL certificate
echo 3. Setup Google Analytics
echo 4. Configure Razorpay payment keys
echo 5. Add OpenAI API key for advanced chatbot
echo.
pause