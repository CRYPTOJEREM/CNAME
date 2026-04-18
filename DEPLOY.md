# 🚀 DÉPLOIEMENT LA SPHERE - SERVEUR COMPLET

## ✅ État actuel

- ✅ **Backend** : Déployé et fonctionnel sur `194.87.45.209:3001`
- ✅ **Database** : `database.production.json` en place
- ✅ **PM2** : Backend tourne avec `pm2 start ecosystem.config.js`
- ⏳ **Frontend** : Encore sur Vercel → À migrer sur le serveur
- ⏳ **Nginx** : À installer et configurer
- ⏳ **SSL** : À obtenir avec Let's Encrypt

## 🎯 PROCHAINES ÉTAPES

### 1️⃣ INSTALLER NGINX SUR LE SERVEUR

**Connexion SSH** :
```bash
ssh root@194.87.45.209
```

**Installation** :
```bash
apt update && apt upgrade -y
apt install nginx certbot python3-certbot-nginx -y
systemctl start nginx
systemctl enable nginx
```

### 2️⃣ DÉPLOYER LE FRONTEND DEPUIS TON PC

**Sur ton PC Windows (Git Bash ou WSL)** :
```bash
cd d:/Github/CNAME

# Rendre le script exécutable
chmod +x scripts/deploy-frontend.sh

# Lancer le déploiement (build + upload automatique)
./scripts/deploy-frontend.sh
```

Le script va :
- ✅ Build le projet React (`npm run build`)
- ✅ Créer `/var/www/lasphere/frontend` sur le serveur
- ✅ Upload les fichiers via rsync
- ✅ Configurer les permissions

### 3️⃣ CONFIGURER NGINX

**Sur le serveur SSH** :

```bash
# Créer le fichier de configuration
nano /etc/nginx/sites-available/lasphere
```

**Copie le contenu de** [`scripts/nginx-lasphere.conf`](scripts/nginx-lasphere.conf) dans ce fichier.

Puis :
```bash
# Créer le lien symbolique
ln -s /etc/nginx/sites-available/lasphere /etc/nginx/sites-enabled/

# Supprimer la config par défaut
rm /etc/nginx/sites-enabled/default

# Tester la configuration
nginx -t
```

### 4️⃣ OBTENIR LE CERTIFICAT SSL

**Sur le serveur SSH** :
```bash
certbot --nginx -d lasphere.xyz -d www.lasphere.xyz
```

Certbot va :
- Vérifier que le DNS pointe vers ton serveur
- Générer les certificats SSL
- Configurer automatiquement HTTPS dans Nginx

### 5️⃣ REDÉMARRER NGINX

```bash
systemctl restart nginx
systemctl status nginx
```

### 6️⃣ TESTER LE SITE

Ouvre dans ton navigateur :
- **https://lasphere.xyz** → Tu devrais voir le site avec SSL ✅
- **https://lasphere.xyz/api/health** → Tu devrais voir `{"status":"ok",...}`

### 7️⃣ DÉSACTIVER VERCEL (optionnel)

Une fois que tout fonctionne sur ton serveur, tu peux :
- Aller sur Vercel
- Supprimer ou mettre en pause le projet `cname`

## 📂 ARCHITECTURE FINALE

```
┌─────────────────────────────────────────────┐
│           SERVEUR 194.87.45.209             │
├─────────────────────────────────────────────┤
│                                             │
│  NGINX (Port 80/443)                        │
│  ├─ lasphere.xyz         → Frontend (/)     │
│  └─ lasphere.xyz/api     → Backend (3001)   │
│                                             │
│  /var/www/lasphere/                         │
│  ├─ frontend/            (React build)      │
│  └─ backend/             (Node.js + PM2)    │
│                                             │
└─────────────────────────────────────────────┘
```

## 📁 FICHIERS CRÉÉS

- ✅ [`scripts/deploy-frontend.sh`](scripts/deploy-frontend.sh) - Script de déploiement automatique
- ✅ [`scripts/nginx-lasphere.conf`](scripts/nginx-lasphere.conf) - Configuration Nginx complète
- ✅ [`scripts/DEPLOY-INSTRUCTIONS.md`](scripts/DEPLOY-INSTRUCTIONS.md) - Guide détaillé avec troubleshooting
- ✅ [`.env.production`](.env.production) - Variables frontend (VITE_API_URL=/api)
- ✅ [`backend/.env.production.example`](backend/.env.production.example) - Template backend mis à jour

## 🔄 MISES À JOUR FUTURES

### Mettre à jour le frontend

```bash
# Sur ton PC
./scripts/deploy-frontend.sh
```

### Mettre à jour le backend

```bash
# Sur le serveur
cd /var/www/lasphere/backend
git pull origin main
npm install
pm2 restart lasphere-backend
```

## 🆘 BESOIN D'AIDE ?

Consulte le guide complet : [`scripts/DEPLOY-INSTRUCTIONS.md`](scripts/DEPLOY-INSTRUCTIONS.md)

Il contient :
- ✅ Instructions pas à pas
- ✅ Commandes de vérification
- ✅ Troubleshooting
- ✅ Monitoring et logs
- ✅ Sécurité (firewall, SSL)

## 📞 SUPPORT

En cas de problème :
1. Vérifie les logs Nginx : `tail -f /var/log/nginx/lasphere-error.log`
2. Vérifie les logs backend : `pm2 logs lasphere-backend`
3. Vérifie les services : `systemctl status nginx` + `pm2 status`

---

**Prêt pour le déploiement complet ! 🚀**
