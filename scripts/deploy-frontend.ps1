# ==========================================
# Script de déploiement FRONTEND (PowerShell)
# ==========================================

Write-Host "🚀 DÉPLOIEMENT FRONTEND - LA SPHERE" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Configuration
$SERVER_USER = "root"
$SERVER_HOST = "194.87.45.209"
$SERVER_PATH = "/var/www/lasphere/frontend"

# Vérifier qu'on est dans le bon dossier
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis la racine du projet" -ForegroundColor Red
    exit 1
}

# Étape 1: Build
Write-Host "📦 Étape 1/3: Build du frontend..." -ForegroundColor Yellow
npm run build

if (-Not (Test-Path "dist")) {
    Write-Host "❌ Erreur: Le dossier dist/ n'a pas été créé" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build terminé" -ForegroundColor Green
Write-Host ""

# Étape 2: Créer le dossier sur le serveur
Write-Host "📁 Étape 2/3: Création du dossier sur le serveur..." -ForegroundColor Yellow
ssh "$SERVER_USER@$SERVER_HOST" "mkdir -p $SERVER_PATH"
Write-Host "✅ Dossier créé" -ForegroundColor Green
Write-Host ""

# Étape 3: Upload des fichiers
Write-Host "📤 Étape 3/3: Upload des fichiers..." -ForegroundColor Yellow
Write-Host "Utilise SCP pour uploader les fichiers:" -ForegroundColor Cyan
Write-Host "scp -r dist/* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/" -ForegroundColor White
Write-Host ""
Write-Host "OU utilise WinSCP (interface graphique)" -ForegroundColor Cyan
Write-Host "- Host: $SERVER_HOST" -ForegroundColor White
Write-Host "- User: $SERVER_USER" -ForegroundColor White
Write-Host "- Upload dist/* vers $SERVER_PATH/" -ForegroundColor White
Write-Host ""

# Lancer SCP si disponible
try {
    scp -r dist/* "$SERVER_USER@${SERVER_HOST}:$SERVER_PATH/"
    Write-Host "✅ Fichiers uploadés" -ForegroundColor Green

    # Permissions
    Write-Host ""
    Write-Host "🔒 Configuration des permissions..." -ForegroundColor Yellow
    ssh "$SERVER_USER@$SERVER_HOST" "chown -R www-data:www-data $SERVER_PATH && chmod -R 755 $SERVER_PATH"
    Write-Host "✅ Permissions configurées" -ForegroundColor Green
    Write-Host ""

    Write-Host "🎉 DÉPLOIEMENT TERMINÉ !" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Commande SCP non disponible" -ForegroundColor Yellow
    Write-Host "Utilise WinSCP pour uploader manuellement les fichiers du dossier dist/" -ForegroundColor Yellow
}
