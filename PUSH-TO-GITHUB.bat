@echo off
color 0A
echo ==========================================
echo   RAJASTHAN DIGITAL EDUCATION PLATFORM
echo   PUSHING ALL CHANGES TO GITHUB
echo ==========================================
echo.

echo Initializing Git repository...
git init

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Complete Rajasthan Digital Education Platform with AI Chatbot, Payment Gateway, Search Engine, and Admin Dashboard"

echo Adding remote repository...
git remote add origin https://github.com/rishu160/rajasthan-educational-website.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo ==========================================
echo   SUCCESSFULLY PUSHED TO GITHUB!
echo ==========================================
echo.
echo Repository URL: https://github.com/rishu160/rajasthan-educational-website
echo.
echo New Features Added:
echo ✓ AI Chatbot with Hindi/English + Voice Support
echo ✓ Smart Search Engine
echo ✓ Payment Gateway Integration (Razorpay)
echo ✓ Admin Dashboard with Analytics
echo ✓ Firebase Backend Integration
echo ✓ PWA Support with Offline Mode
echo ✓ Voice Assistant
echo ✓ Mobile Responsive Design
echo ✓ SEO Optimization
echo ✓ Security Headers
echo.
pause