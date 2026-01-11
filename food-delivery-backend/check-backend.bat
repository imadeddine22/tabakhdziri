@echo off
echo ========================================
echo  Backend Health Check
echo ========================================
echo.

echo [1/4] Checking if port 5000 is in use...
netstat -ano | findstr :5000
if %ERRORLEVEL% EQU 0 (
    echo [OK] Port 5000 is in use
) else (
    echo [ERROR] Port 5000 is NOT in use - Backend is not running!
    echo.
    echo Solution:
    echo   1. Make sure MongoDB IP is whitelisted in Atlas
    echo   2. Run: npm run dev
    goto end
)
echo.

echo [2/4] Testing backend health endpoint...
curl -s http://localhost:5000/api/health
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Backend is responding
) else (
    echo [ERROR] Backend is not responding
)
echo.

echo [3/4] Testing MongoDB connection...
node test-mongodb.js
echo.

echo [4/4] Summary
echo ========================================
echo If all tests passed:
echo   - Your backend is running correctly
echo   - Frontend should be able to connect
echo.
echo If tests failed:
echo   - Read FIX-NETWORK-ERROR.md for solutions
echo   - Most common issue: MongoDB IP not whitelisted
echo ========================================
echo.

:end
pause
