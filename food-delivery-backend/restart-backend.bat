@echo off
cls
echo ==========================================
echo   FIX BACKEND - Redemarrage Complet
echo ==========================================
echo.

echo [Etape 1] Arret des processus Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Processus arretes
echo.

echo [Etape 2] Verification MongoDB...
echo Veuillez verifier dans MongoDB Atlas:
echo   1. Network Access ^> 0.0.0.0/0 autorise
echo   2. Database Access ^> Utilisateur existe
echo.
echo Appuyez sur une touche APRES avoir verifie Atlas...
pause >nul
echo.

echo [Etape 3] Test de connexion MongoDB...
node test-mongodb.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERREUR] MongoDB ne se connecte pas!
    echo.
    echo SOLUTION:
    echo   1. Allez sur https://cloud.mongodb.com/
    echo   2. Network Access ^> ADD IP ADDRESS
    echo   3. ALLOW ACCESS FROM ANYWHERE
    echo   4. Attendez 2 minutes
    echo   5. Relancez ce script
    echo.
    pause
    exit /b 1
)
echo [OK] MongoDB connecte!
echo.

echo [Etape 4] Demarrage du backend...
echo Le backend va demarrer dans une nouvelle fenetre...
echo.
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
echo.

echo [Etape 5] Verification du backend...
timeout /t 5 /nobreak >nul
curl -s http://localhost:5000/api/health
if %ERRORLEVEL% EQU 0 (
    echo.
    echo.
    echo ==========================================
    echo   ✓ SUCCES! Backend demarre
    echo ==========================================
    echo.
    echo Backend: http://localhost:5000
    echo Frontend: http://localhost:3000
    echo.
    echo Vous pouvez maintenant tester l'inscription!
) else (
    echo.
    echo [ATTENTION] Le backend prend du temps a demarrer...
    echo Attendez 10 secondes puis testez:
    echo   curl http://localhost:5000/api/health
)
echo.
echo ==========================================
pause
