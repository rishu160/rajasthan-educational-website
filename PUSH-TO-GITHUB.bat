@echo off
echo Pushing updates to GitHub...

cd /d "c:\Users\HP\Desktop\education website\LearnEd_E-learning_Website"

git add .
git commit -m "Fixed navigation layout and restored original sections - App button visibility improved, colleges and courses sections restored"
git push origin main

echo.
echo Push completed successfully!
pause