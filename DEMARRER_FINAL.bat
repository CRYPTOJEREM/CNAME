@echo off
chcp 65001 > nul
echo.
echo ╔════════════════════════════════════════════╗
echo ║     🌐 LA SPHERE - DÉMARRAGE COMPLET     ║
echo ╚════════════════════════════════════════════╝
echo.

REM Arrêter tous les processus Node existants
echo [1/4] 🛑 Arrêt des processus existants...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Démarrer le backend
echo [2/4] 🚀 Démarrage du backend...
cd /d "d:\Github\CNAME\backend"
start /B node server.js > ..\backend.log 2>&1

REM Attendre que le backend démarre
timeout /t 4 /nobreak >nul

REM Vérifier que le backend répond
echo [3/4] 🔍 Vérification du backend...
curl -s http://localhost:3001/ > nul
if errorlevel 1 (
    echo ❌ ERREUR: Le backend ne répond pas !
    echo.
    echo Consultez backend.log pour plus de détails
    pause
    exit /b 1
)
echo ✅ Backend démarré avec succès !

REM Démarrer le frontend
echo [4/4] 🎨 Démarrage du frontend...
cd /d "d:\Github\CNAME"
start cmd /k "npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════╗
echo ║         ✅ TOUT EST DÉMARRÉ !            ║
echo ╚════════════════════════════════════════════╝
echo.
echo 🌐 Frontend : http://localhost:5173
echo 🔌 Backend  : http://localhost:3001
echo.
echo 🔐 COMPTE ADMIN :
echo    Email    : admin@lasphere.com
echo    Password : Admin@2026
echo.
echo 📝 Consultez TESTS.md pour les étapes de vérification
echo.
pause
