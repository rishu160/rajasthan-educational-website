@echo off
echo 🔥 Deploying Rajasthan Digital Education Platform to Firebase...

echo Step 1: Installing Firebase CLI...
npm install -g firebase-tools

echo Step 2: Login to Firebase...
firebase login

echo Step 3: Initialize Firebase Project...
firebase init

echo Step 4: Installing Functions Dependencies...
cd functions
npm install
cd ..

echo Step 5: Deploying to Firebase...
firebase deploy

echo ✅ Deployment Complete!
echo 🌐 Your website is live at: https://rajasthan-education-platform.web.app

pause