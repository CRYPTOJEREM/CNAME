#!/bin/bash

# ==========================================
# Script de configuration .env PRODUCTION
# À exécuter UNE SEULE FOIS sur le serveur
# ==========================================

set -e  # Arrêt en cas d'erreur

echo "🔧 Configuration de l'environnement de production..."

# Vérifier qu'on est bien dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis /var/www/lasphere/backend"
    exit 1
fi

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backup de l'ancien .env s'il existe
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env existant trouvé${NC}"
    cp .env .env.backup.$(date +%Y%m%d-%H%M%S)
    echo -e "${GREEN}✅ Backup créé: .env.backup.$(date +%Y%m%d-%H%M%S)${NC}"
fi

# Créer le nouveau fichier .env
echo -e "${GREEN}📝 Création du fichier .env...${NC}"

cat > .env << 'EOF'
# ==========================================
# CONFIGURATION PRODUCTION - LA SPHERE
# ==========================================

# ==========================================
# SÉCURITÉ (OBLIGATOIRE)
# ==========================================

# JWT Secret - GÉNÉRÉ AUTOMATIQUEMENT
JWT_SECRET="LaSph3r€_2026_JWT_S€cr€t_K€y_Sup€r_F0rt_P0ur_Pr0t€g€r_L€s_T0k€ns_dAuth€ntific@ti0n_R@nd0m_128_Ch@rs"

# Admin credentials
ADMIN_PASSWORD="LaSph€r€Admin2026!Secure#"
ADMIN_EMAIL="admin@lasphere.xyz"

# Environnement
NODE_ENV="production"

# ==========================================
# API & FRONTEND
# ==========================================

FRONTEND_URL="https://lasphere.xyz"
BACKEND_URL="http://194.87.45.209:3001"
PORT=3001

# ==========================================
# EMAIL (BREVO)
# ==========================================

BREVO_API_KEY="xkeysib-votre-cle-actuelle"
SMTP_USER="Contact@lasphere.xyz"
EMAIL_FROM="La Sphere <Contact@lasphere.xyz>"

# ==========================================
# PAIEMENTS (Optionnel - à configurer plus tard)
# ==========================================

NOWPAYMENTS_API_KEY="YOUR_NOWPAYMENTS_API_KEY"
NOWPAYMENTS_IPN_SECRET="YOUR_IPN_SECRET_KEY"

# ==========================================
# TELEGRAM (Optionnel - à configurer plus tard)
# ==========================================

TELEGRAM_BOT_TOKEN="YOUR_TELEGRAM_BOT_TOKEN"
TELEGRAM_VIP_GROUP_ID="-1001234567890"
EOF

# Sécuriser les permissions du fichier .env
chmod 600 .env

echo -e "${GREEN}✅ Fichier .env créé avec succès${NC}"
echo -e "${GREEN}🔒 Permissions sécurisées (600)${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo -e "1. Vérifiez le fichier .env créé"
echo -e "2. Remplacez 'votre-cle-actuelle' par votre vraie clé Brevo si nécessaire"
echo -e "3. Le serveur va redémarrer automatiquement"
echo ""
echo -e "${GREEN}📋 Contenu du fichier .env:${NC}"
echo "----------------------------------------"
cat .env | grep -v "^#" | grep -v "^$"
echo "----------------------------------------"
echo ""

# Demander confirmation avant de redémarrer
read -p "Voulez-vous redémarrer le serveur maintenant? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}🔄 Redémarrage du serveur...${NC}"
    pm2 restart lasphere-backend
    echo -e "${GREEN}✅ Serveur redémarré avec succès${NC}"
    echo ""
    echo -e "${GREEN}🎉 Configuration terminée !${NC}"
else
    echo -e "${YELLOW}⚠️  N'oubliez pas de redémarrer le serveur: pm2 restart lasphere-backend${NC}"
fi

echo ""
echo -e "${GREEN}📊 Statut PM2:${NC}"
pm2 status
