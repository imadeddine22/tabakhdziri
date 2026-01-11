@echo off
echo Stopping backend server...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm start*" 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend server...
cd /d "c:\Users\DELL\Desktop\food-delivery-backend"
start "Backend Server" cmd /k "npm start"

echo Backend server restarted!
pause
