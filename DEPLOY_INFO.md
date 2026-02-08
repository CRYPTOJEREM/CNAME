# 🚀 Informations de Déploiement - La Sphere

## ✅ ÉTAPE 1 : CODE SUR GITHUB - TERMINÉE ✅

Votre code a été poussé avec succès sur :
**https://github.com/CRYPTOJEREM/CNAME**

---

## 📋 ÉTAPE 2 : DÉPLOYER LE BACKEND SUR RENDER

### 2.1 Créer le Service

1. Aller sur : **https://dashboard.render.com**
2. Cliquer sur **"New +"** en haut à droite
3. Sélectionner **"Web Service"**
4. Cliquer sur **"Connect Repository"** si pas encore fait
5. Chercher et sélectionner : **CRYPTOJEREM/CNAME**

### 2.2 Configuration du Service

```
Name                : lasphere-backend
Region              : Frankfurt (EU Central) ou closest
Branch              : main
Root Directory      : backend
Runtime             : Node
Build Command       : npm install
Start Command       : node server.js
Instance Type       : Free
```

### 2.3 Variables d'Environnement (IMPORTANTES !)

Cliquer sur **"Advanced"** puis **"Add Environment Variable"** pour chaque variable :

#### Configuration de Base
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://lasphere.xyz
```

#### JWT Secrets (GÉNÉRER DES NOUVEAUX)
Exécuter dans un terminal Node.js pour générer :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```
JWT_SECRET=<coller-le-secret-généré-1>
JWT_REFRESH_SECRET=<coller-le-secret-généré-2>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

#### Email Configuration (Gmail)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<votre-email@gmail.com>
SMTP_PASS=<votre-app-password-gmail>
EMAIL_FROM=La Sphere <noreply@lasphere.com>
```

**Pour obtenir SMTP_PASS (App Password Gmail) :**
1. Aller sur https://myaccount.google.com/apppasswords
2. Créer un nouveau mot de passe d'application
3. Copier le mot de passe généré (16 caractères)

#### NOWPayments
```
NOWPAYMENTS_API_KEY=<votre-clé-nowpayments>
NOWPAYMENTS_IPN_SECRET=<votre-secret-ipn>
```

#### Telegram
```
TELEGRAM_BOT_TOKEN=<votre-token-bot>
TELEGRAM_VIP_GROUP_ID=<votre-id-groupe>
```

### 2.4 Déployer

1. Vérifier que toutes les variables sont remplies
2. Cliquer sur **"Create Web Service"**
3. Attendre 3-5 minutes que le déploiement se termine
4. Noter l'URL générée : `https://lasphere-backend.onrender.com`

### 2.5 Vérifier le Backend

Dans un navigateur ou terminal :
```bash
curl https://lasphere-backend.onrender.com/
```

Devrait retourner :
```json
{"message":"🌐 La Sphere API","version":"1.0.0"}
```

---

## 📋 ÉTAPE 3 : DÉPLOYER LE FRONTEND SUR VERCEL

### 3.1 Créer le Projet

1. Aller sur : **https://vercel.com**
2. Cliquer sur **"Add New..."** → **"Project"**
3. Importer le repo : **CRYPTOJEREM/CNAME**

### 3.2 Configuration du Projet

```
Framework Preset     : Vite
Root Directory       : ./  (racine)
Build Command        : npm run build
Output Directory     : dist
Install Command      : npm install
```

### 3.3 Variable d'Environnement

Cliquer sur **"Environment Variables"** et ajouter :

```
Name    : VITE_API_URL
Value   : https://lasphere-backend.onrender.com/api
```

**IMPORTANT** : Remplacer par l'URL exacte de votre backend Render !

### 3.4 Déployer

1. Cliquer sur **"Deploy"**
2. Attendre 2-3 minutes
3. Vercel va générer une URL temporaire : `https://cname-xxx.vercel.app`

### 3.5 Vérifier le Frontend

Ouvrir l'URL générée et vérifier que le site fonctionne.

---

## 📋 ÉTAPE 4 : CONFIGURER LE DOMAINE lasphere.xyz

### 4.1 Ajouter le Domaine dans Vercel

1. Dans votre projet Vercel, aller dans **"Settings"**
2. Cliquer sur **"Domains"** dans le menu latéral
3. Ajouter le domaine : **lasphere.xyz**
4. Cliquer sur **"Add"**

Vercel va vous donner des instructions DNS.

### 4.2 Configurer les DNS

Aller dans votre panneau de gestion DNS (Cloudflare, OVH, GoDaddy, etc.)

#### Configuration Recommandée (A Record)
```
Type    : A
Name    : @
Value   : 76.76.21.21
TTL     : Auto ou 3600
```

```
Type    : CNAME
Name    : www
Value   : cname.vercel-dns.com
TTL     : Auto ou 3600
```

#### OU Configuration Alternative (CNAME)
```
Type    : CNAME
Name    : @
Value   : cname.vercel-dns.com
TTL     : Auto ou 3600
```

**Note Cloudflare** : Si vous utilisez Cloudflare, désactivez temporairement le proxy (nuage gris) pour le premier déploiement.

### 4.3 Attendre la Propagation DNS

- Temps d'attente : 5-30 minutes (parfois jusqu'à 2 heures)
- Vérifier sur : https://dnschecker.org

### 4.4 Vérifier le Domaine

Une fois propagé :
```bash
curl https://lasphere.xyz
```

---

## 📋 ÉTAPE 5 : CONFIGURATION POST-DÉPLOIEMENT

### 5.1 Mettre à Jour le Webhook NOWPayments

Dans votre dashboard NOWPayments, mettre à jour l'URL du webhook :
```
https://lasphere-backend.onrender.com/api/payment/webhook
```

### 5.2 Vérifier les CORS

Le backend est déjà configuré pour accepter les requêtes de `lasphere.xyz` via la variable `FRONTEND_URL`.

### 5.3 Test Complet

1. Aller sur **https://lasphere.xyz**
2. Créer un compte
3. Vérifier la réception de l'email
4. Se connecter
5. Accéder à l'espace membre
6. Tester un paiement (mode sandbox si possible)

---

## 🎉 DÉPLOIEMENT TERMINÉ !

Votre application est maintenant en ligne sur :
- **Frontend** : https://lasphere.xyz
- **Backend** : https://lasphere-backend.onrender.com

### Déploiements Futurs

Pour mettre à jour :
```bash
# Windows
DEPLOY.bat

# Ou manuellement
git add .
git commit -m "Votre message"
git push
```

Les déploiements sont **automatiques** sur Vercel et Render après chaque `git push` !

---

## 📊 Surveillance

### Logs Backend (Render)
https://dashboard.render.com → Votre service → **"Logs"**

### Logs Frontend (Vercel)
https://vercel.com/dashboard → Votre projet → **"Deployments"**

### Metrics
- **Render** : Performance, uptime, erreurs
- **Vercel** : Analytics, performances, Core Web Vitals

---

## ⚠️ Important

### Plan Gratuit Render
- Le service se met en veille après 15 minutes d'inactivité
- Première requête après veille : 30-50 secondes de délai
- Solution : passer au plan Standard ($7/mois) pour éviter la veille

### Sécurité
- ✅ Les secrets JWT sont uniques et sécurisés
- ✅ Les fichiers `.env` ne sont PAS commités
- ✅ HTTPS activé automatiquement
- ✅ CORS configuré correctement

---

## 🆘 En Cas de Problème

### Backend ne démarre pas
- Vérifier les logs Render
- Vérifier que toutes les variables d'environnement sont remplies
- Vérifier la syntaxe des variables

### Frontend ne se connecte pas au backend
- Vérifier que `VITE_API_URL` est correct dans Vercel
- Vérifier les CORS dans les logs backend
- Vérifier que le backend répond (curl l'URL)

### Emails non envoyés
- Vérifier `SMTP_USER` et `SMTP_PASS`
- Vérifier que l'App Password Gmail est valide
- Consulter les logs backend

### Domaine ne fonctionne pas
- Vérifier la propagation DNS : https://dnschecker.org
- Vérifier la configuration dans le panneau DNS
- Attendre jusqu'à 24h dans certains cas

---

## 📞 Support

Documentation complète :
- **[DEPLOIEMENT.md](./DEPLOIEMENT.md)** - Guide complet
- **[DEPLOY_RAPIDE.md](./DEPLOY_RAPIDE.md)** - Guide rapide

---

<div align="center">
  <strong>🌐 Bonne chance avec votre déploiement ! 🚀</strong>
</div>
