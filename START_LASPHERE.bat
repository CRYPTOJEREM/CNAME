@echo off
echo ========================================
echo   DEMARRAGE DE LA SPHERE
echo ========================================
echo.

echo [1/2] Demarrage du Backend (Port 3001)...
start "La Sphere - Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [2/2] Demarrage du Frontend (Port 5174)...
start "La Sphere - Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   LA SPHERE EST EN COURS DE DEMARRAGE
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5174
echo.
echo Admin:    admin@lasphere.com / Admin2026!
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul
