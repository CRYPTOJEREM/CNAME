#!/bin/bash
# ==========================================
# Script de déploiement FRONTEND (à exécuter SUR le serveur)
# Usage: ssh root@194.87.45.209 'bash -s' < scripts/deploy-on-server.sh
# Ou: scp scripts/deploy-on-server.sh root@194.87.45.209:~ && ssh root@194.87.45.209 './deploy-on-server.sh'
# ==========================================

set -e  # Arrêter en cas d'erreur

echo "🚀 DÉPLOIEMENT FRONTEND - LA SPHERE"
echo "========================================"
echo ""

# Configuration
REPO_DIR="/root/lasphere"
FRONTEND_DIR="/var/www/lasphere/frontend"

# Étape 1: Pull depuis GitHub
echo "📥 Étape 1/4: Pull depuis GitHub..."
cd $REPO_DIR
git pull origin main
echo "✅ Code à jour"
echo ""

# Étape 2: Installer les dépendances (si nécessaire)
echo "📦 Étape 2/4: Installation des dépendances..."
npm install
echo "✅ Dépendances installées"
echo ""

# Étape 3: Build du frontend
echo "🔨 Étape 3/4: Build du frontend..."
npm run build
echo "✅ Build terminé"
echo ""

# Étape 4: Déployer vers Nginx
echo "🚀 Étape 4/4: Déploiement vers Nginx..."

# Créer le dossier si nécessaire
mkdir -p $FRONTEND_DIR

# Sauvegarder l'ancien build (au cas où)
if [ -d "$FRONTEND_DIR" ] && [ "$(ls -A $FRONTEND_DIR)" ]; then
    echo "💾 Sauvegarde de l'ancien build..."
    rm -rf ${FRONTEND_DIR}.backup
    cp -r $FRONTEND_DIR ${FRONTEND_DIR}.backup
fi

# Copier les nouveaux fichiers
echo "📤 Copie des fichiers..."
rm -rf ${FRONTEND_DIR}/*
cp -r dist/* $FRONTEND_DIR/

# Configurer les permissions
echo "🔒 Configuration des permissions..."
chown -R www-data:www-data $FRONTEND_DIR
chmod -R 755 $FRONTEND_DIR

echo "✅ Permissions configurées"
echo ""

# Redémarrer Nginx
echo "🔄 Rechargement de Nginx..."
systemctl reload nginx
echo "✅ Nginx rechargé"
echo ""

echo "🎉 DÉPLOIEMENT TERMINÉ !"
echo "========================================"
echo "✅ Frontend disponible sur: https://lasphere.xyz"
echo "📁 Dossier: $FRONTEND_DIR"
echo ""
echo "Pour rollback en cas de problème:"
echo "  cp -r ${FRONTEND_DIR}.backup/* $FRONTEND_DIR/"
echo ""
