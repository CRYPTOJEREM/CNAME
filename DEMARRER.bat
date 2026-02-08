@echo off
echo.
echo ========================================
echo   DEMARRAGE LA SPHERE
echo ========================================
echo.

REM Arreter tous les processus Node existants
echo [1/4] Arret des processus existants...
taskkill /F /IM node.exe >nul 2>&1

REM Attendre 2 secondes
timeout /t 2 /nobreak >nul

REM Demarrer le backend
echo [2/4] Demarrage du backend...
cd backend
start /B node server.js

REM Attendre que le backend demarre
timeout /t 3 /nobreak >nul

REM Demarrer le frontend
echo [3/4] Demarrage du frontend...
cd ..
start cmd /k "npm run dev"

echo [4/4] Tout est pret !
echo.
echo ========================================
echo   SERVEURS DEMARRES
echo ========================================
echo.
echo Backend  : http://localhost:3001
echo Frontend : http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul
