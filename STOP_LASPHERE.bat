@echo off
echo ========================================
echo   ARRET DE LA SPHERE
echo ========================================
echo.

echo Arret de tous les processus Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo Arret des processus Vite...
taskkill /F /IM vite.exe >nul 2>&1

echo.
echo ========================================
echo   LA SPHERE EST ARRETEE
echo ========================================
echo.
echo Tous les services ont ete arretes.
echo.
pause
