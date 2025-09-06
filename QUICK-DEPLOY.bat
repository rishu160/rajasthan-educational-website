@echo off
echo ==========================================
echo   RAJASTHAN DIGITAL EDUCATION PLATFORM
echo   QUICK DEPLOYMENT TO GOOGLE
echo ==========================================
echo.

echo Step 1: Installing Firebase CLI...
npm install -g firebase-tools

echo Step 2: Login to Firebase...
firebase login

echo Step 3: Initialize Firebase...
firebase init

echo Step 4: Deploy to Firebase...
firebase deploy

echo.
echo ==========================================
echo   WEBSITE IS NOW LIVE!
echo ==========================================
echo.
echo Your website URL: https://rajasthan-education-platform.web.app
echo.
pause