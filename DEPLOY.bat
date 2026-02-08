@echo off
chcp 65001 >nul
color 0B

echo ╔══════════════════════════════════════════════════════╗
echo ║         🚀 DÉPLOIEMENT LA SPHERE 🌐                 ║
echo ╚══════════════════════════════════════════════════════╝
echo.

REM Vérifier que Git est configuré
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installé ou pas dans le PATH
    echo Installez Git depuis https://git-scm.com/
    pause
    exit /b 1
)

echo [1/4] 📝 Ajout des fichiers au commit...
git add .

echo.
set /p COMMIT_MSG="💬 Message du commit: "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Mise à jour

echo.
echo [2/4] 💾 Création du commit...
git commit -m "%COMMIT_MSG%"

echo.
echo [3/4] 🔗 Vérification du remote...
git remote -v | findstr origin >nul
if errorlevel 1 (
    echo.
    echo ⚠️  Aucun remote configuré. Configurez d'abord GitHub :
    echo.
    echo 1. Créez un repo sur GitHub nommé "lasphere"
    echo 2. Exécutez cette commande :
    echo    git remote add origin https://github.com/VOTRE_USERNAME/lasphere.git
    echo.
    pause
    exit /b 1
)

echo.
echo [4/4] 🚀 Push vers GitHub (déploiement automatique)...
git push origin main

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║              ✅ DÉPLOIEMENT LANCÉ !                 ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo 🔄 Les déploiements sont automatiques :
echo    - Backend  : https://dashboard.render.com
echo    - Frontend : https://vercel.com/dashboard
echo.
echo 🌐 Site en ligne : https://lasphere.xyz
echo.
echo ⏱️  Temps d'attente estimé : 3-5 minutes
echo.
pause
