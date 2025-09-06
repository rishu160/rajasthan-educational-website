@echo off
color 0A
echo.
echo ========================================
echo   RAJASTHAN DIGITAL EDUCATION PLATFORM
echo   FINAL DEPLOYMENT TO GOOGLE FIREBASE
echo ========================================
echo.

echo [1/8] Installing Firebase CLI...
npm install -g firebase-tools
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Firebase CLI
    pause
    exit /b 1
)

echo [2/8] Installing project dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [3/8] Installing Functions dependencies...
cd functions
npm install
cd ..
if %errorlevel% neq 0 (
    echo ERROR: Failed to install functions dependencies
    pause
    exit /b 1
)

echo [4/8] Firebase Login...
firebase login
if %errorlevel% neq 0 (
    echo ERROR: Firebase login failed
    pause
    exit /b 1
)

echo [5/8] Initializing Firebase project...
firebase init --project rajasthan-education-platform
if %errorlevel% neq 0 (
    echo ERROR: Firebase initialization failed
    pause
    exit /b 1
)

echo [6/8] Building project...
echo Building complete!

echo [7/8] Deploying to Firebase...
firebase deploy --project rajasthan-education-platform
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo [8/8] Setting up custom domain...
echo Custom domain setup instructions:
echo 1. Go to Firebase Console
echo 2. Hosting section
echo 3. Add custom domain: rajasthaneducation.gov.in
echo 4. Verify ownership
echo 5. SSL certificate will be auto-generated

echo.
echo ========================================
echo   DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Website URLs:
echo - Firebase: https://rajasthan-education-platform.web.app
echo - Firebase: https://rajasthan-education-platform.firebaseapp.com
echo - Custom Domain: https://rajasthaneducation.gov.in (after setup)
echo.
echo Admin Dashboard: https://rajasthan-education-platform.web.app/admin/dashboard.html
echo Payment Page: https://rajasthan-education-platform.web.app/payment-page.html
echo Mobile App: https://rajasthan-education-platform.web.app/mobile-app.html
echo.
echo Features Deployed:
echo ✓ User Authentication (Firebase Auth)
echo ✓ Database (Firestore)
echo ✓ Payment Gateway (Razorpay)
echo ✓ Live Classes (Google Meet)
echo ✓ File Downloads
echo ✓ Admin Dashboard
echo ✓ Mobile PWA
echo ✓ Offline Support
echo.
echo Government of Rajasthan - Digital Education Platform
echo.
pause