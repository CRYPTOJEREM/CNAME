#!/bin/bash

# ==========================================
# Script de déploiement FRONTEND sur serveur
# ==========================================

set -e  # Arrêt en cas d'erreur

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 DÉPLOIEMENT FRONTEND - LA SPHERE${NC}"
echo "========================================"
echo ""

# Configuration
SERVER_USER="root"
SERVER_HOST="194.87.45.209"
SERVER_PATH="/var/www/lasphere/frontend"
LOCAL_BUILD_DIR="dist"

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté depuis la racine du projet frontend${NC}"
    exit 1
fi

# Étape 1: Build local
echo -e "${YELLOW}📦 Étape 1/4: Build du frontend...${NC}"
npm run build

if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    echo -e "${RED}❌ Erreur: Le dossier dist/ n'a pas été créé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build terminé${NC}"
echo ""

# Étape 2: Créer le dossier sur le serveur
echo -e "${YELLOW}📁 Étape 2/4: Création du dossier sur le serveur...${NC}"
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH"
echo -e "${GREEN}✅ Dossier créé${NC}"
echo ""

# Étape 3: Upload des fichiers
echo -e "${YELLOW}📤 Étape 3/4: Upload des fichiers (rsync)...${NC}"
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env*' \
    $LOCAL_BUILD_DIR/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

echo -e "${GREEN}✅ Fichiers uploadés${NC}"
echo ""

# Étape 4: Définir les permissions
echo -e "${YELLOW}🔒 Étape 4/4: Configuration des permissions...${NC}"
ssh $SERVER_USER@$SERVER_HOST "chown -R www-data:www-data $SERVER_PATH && chmod -R 755 $SERVER_PATH"
echo -e "${GREEN}✅ Permissions configurées${NC}"
echo ""

# Récapitulatif
echo -e "${GREEN}🎉 DÉPLOIEMENT TERMINÉ !${NC}"
echo "========================================"
echo -e "Frontend déployé sur: ${BLUE}$SERVER_HOST${NC}"
echo -e "Chemin serveur: ${BLUE}$SERVER_PATH${NC}"
echo ""
echo -e "${YELLOW}⚠️  PROCHAINES ÉTAPES:${NC}"
echo "1. Configurer Nginx (voir nginx-lasphere.conf)"
echo "2. Installer le certificat SSL (Let's Encrypt)"
echo "3. Redémarrer Nginx: sudo systemctl restart nginx"
echo "4. Tester: https://lasphere.xyz"
echo ""
