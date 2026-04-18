# 🚀 GUIDE DE DÉPLOIEMENT COMPLET - LA SPHERE

## 📋 Prérequis sur le serveur

Connexion SSH au serveur :
```bash
ssh root@194.87.45.209
```

### 1. Installer Nginx

```bash
# Mettre à jour les paquets
apt update && apt upgrade -y

# Installer Nginx
apt install nginx -y

# Vérifier que Nginx tourne
systemctl status nginx

# Démarrer Nginx si nécessaire
systemctl start nginx
systemctl enable nginx
```

### 2. Installer Certbot (Let's Encrypt)

```bash
# Installer Certbot pour Nginx
apt install certbot python3-certbot-nginx -y
```

## 🔧 DÉPLOIEMENT ÉTAPE PAR ÉTAPE

### ÉTAPE 1 : Déployer le frontend depuis ton PC

Sur **ton PC Windows**, dans le dossier du projet :

```bash
# Rendre le script exécutable (Git Bash ou WSL)
chmod +x scripts/deploy-frontend.sh

# Lancer le déploiement
./scripts/deploy-frontend.sh
```

Le script va :
1. ✅ Build le projet React (`npm run build`)
2. ✅ Créer `/var/www/lasphere/frontend` sur le serveur
3. ✅ Upload les fichiers via rsync
4. ✅ Configurer les permissions

### ÉTAPE 2 : Configurer Nginx sur le serveur

**Sur le serveur SSH** :

```bash
# Copier la configuration Nginx
# (Tu peux copier-coller le contenu de scripts/nginx-lasphere.conf)
nano /etc/nginx/sites-available/lasphere
```

Colle le contenu de `scripts/nginx-lasphere.conf`, puis :

```bash
# Créer le lien symbolique
ln -s /etc/nginx/sites-available/lasphere /etc/nginx/sites-enabled/

# Supprimer la config par défaut
rm /etc/nginx/sites-enabled/default

# Tester la configuration
nginx -t
```

Si tu vois `syntax is ok`, c'est bon ! ✅

### ÉTAPE 3 : Obtenir le certificat SSL

**Sur le serveur SSH** :

```bash
# Obtenir le certificat SSL pour lasphere.xyz
certbot --nginx -d lasphere.xyz -d www.lasphere.xyz
```

Certbot va :
1. Vérifier que le domaine pointe bien vers ton serveur
2. Générer les certificats SSL
3. Configurer automatiquement Nginx pour HTTPS

**IMPORTANT** : Assure-toi que :
- Le DNS `lasphere.xyz` pointe vers `194.87.45.209` (déjà fait ✅)
- Le DNS `www.lasphere.xyz` pointe aussi vers `194.87.45.209`

### ÉTAPE 4 : Redémarrer Nginx

```bash
# Redémarrer Nginx pour appliquer la config
systemctl restart nginx

# Vérifier le statut
systemctl status nginx
```

### ÉTAPE 5 : Mettre à jour le backend (.env)

Le backend doit autoriser le nouveau domaine dans CORS.

Éditer `/var/www/lasphere/backend/.env` :

```bash
nano /var/www/lasphere/backend/.env
```

Vérifier que `FRONTEND_URL` est correct :

```env
FRONTEND_URL="https://lasphere.xyz"
BACKEND_URL="http://194.87.45.209:3001"
```

Redémarrer le backend :

```bash
pm2 restart lasphere-backend
```

## ✅ VÉRIFICATION FINALE

### 1. Tester le frontend

Ouvre dans ton navigateur :
- https://lasphere.xyz

Tu devrais voir le site avec le certificat SSL ✅

### 2. Tester le backend API

```bash
curl https://lasphere.xyz/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2026-04-18T...",
  "environment": "production",
  "database": {
    "users": 2,
    "payments": 0
  }
}
```

### 3. Tester l'authentification

Sur le site, essaye de te connecter en tant qu'admin :
- Email : `admin@lasphere.xyz`
- Password : (celui dans ton `.env`)

Si tout fonctionne → 🎉 **DÉPLOIEMENT RÉUSSI !**

## 🔄 MISES À JOUR FUTURES

### Pour mettre à jour le frontend

Sur ton PC :

```bash
# Build + Deploy automatique
./scripts/deploy-frontend.sh
```

Pas besoin de redémarrer Nginx, les nouveaux fichiers sont servis immédiatement.

### Pour mettre à jour le backend

Sur le serveur :

```bash
cd /var/www/lasphere/backend
git pull origin main
npm install  # Si nouvelles dépendances
pm2 restart lasphere-backend
```

## 🚨 TROUBLESHOOTING

### Le site ne charge pas

Vérifier Nginx :
```bash
systemctl status nginx
tail -f /var/log/nginx/lasphere-error.log
```

### Le certificat SSL ne fonctionne pas

Relancer Certbot :
```bash
certbot --nginx -d lasphere.xyz -d www.lasphere.xyz --force-renewal
```

### L'API ne répond pas

Vérifier le backend :
```bash
pm2 logs lasphere-backend --lines 50
```

Vérifier que le backend écoute bien sur le port 3001 :
```bash
netstat -tulpn | grep 3001
```

### Erreur CORS

Vérifier que `FRONTEND_URL` dans `/var/www/lasphere/backend/.env` est correct :
```bash
cat /var/www/lasphere/backend/.env | grep FRONTEND
```

Redémarrer le backend :
```bash
pm2 restart lasphere-backend
```

## 📊 MONITORING

### Vérifier les logs Nginx

```bash
# Accès
tail -f /var/log/nginx/lasphere-access.log

# Erreurs
tail -f /var/log/nginx/lasphere-error.log
```

### Vérifier les logs backend

```bash
pm2 logs lasphere-backend --lines 100
```

### Vérifier l'espace disque

```bash
df -h
```

### Vérifier l'état du serveur

```bash
# CPU et RAM
htop

# Services
systemctl status nginx
pm2 status
```

## 🔐 SÉCURITÉ

### Renouvellement automatique SSL

Certbot configure automatiquement un cron job pour renouveler les certificats. Vérifier :

```bash
systemctl status certbot.timer
```

### Firewall (optionnel mais recommandé)

```bash
# Installer ufw
apt install ufw -y

# Autoriser SSH
ufw allow 22/tcp

# Autoriser HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Activer le firewall
ufw enable

# Vérifier le statut
ufw status
```

## 📞 SUPPORT

En cas de problème, vérifie dans l'ordre :
1. Logs Nginx : `/var/log/nginx/lasphere-error.log`
2. Logs Backend : `pm2 logs lasphere-backend`
3. Statut des services : `systemctl status nginx` + `pm2 status`
4. Certificat SSL : `certbot certificates`

---

**Bon déploiement ! 🚀**
