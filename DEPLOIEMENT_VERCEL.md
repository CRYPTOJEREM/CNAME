# 🚀 Guide de Déploiement Vercel - La Sphere

## Architecture de Déploiement

Le projet La Sphere nécessite **deux déploiements séparés** :

1. **Frontend (React + Vite)** → Vercel
2. **Backend (Express API)** → Railway / Render / Heroku

⚠️ **Important** : Vercel héberge bien les sites statiques, mais le backend Express avec fichiers JSON doit être déployé sur un service avec stockage persistant.

---

## 📦 Partie 1 : Déploiement Frontend sur Vercel

### Étape 1 : Connexion GitHub ✅ (Déjà fait)

Votre repository GitHub est déjà lié : `https://github.com/CRYPTOJEREM/CNAME`

### Étape 2 : Configuration Vercel

Le fichier `vercel.json` est déjà configuré :
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Étape 3 : Déploiement Automatique

✅ **Vercel détecte automatiquement les pushs sur `main`**

Chaque `git push` vers GitHub déclenche un déploiement automatique.

### Étape 4 : Vérifier le Déploiement

1. Allez sur https://vercel.com/dashboard
2. Trouvez votre projet "CNAME" ou "lasphere"
3. Cliquez sur le dernier déploiement
4. Vérifiez le statut :
   - ✅ **Ready** = Déployé avec succès
   - 🔄 **Building** = En cours de construction
   - ❌ **Error** = Erreur de build

### Étape 5 : Obtenir l'URL de Production

Votre site sera accessible sur :
```
https://votre-projet.vercel.app
```

**Exemple** : `https://lasphere.vercel.app` ou `https://cname-cryptojerem.vercel.app`

---

## 🖥️ Partie 2 : Déploiement Backend (Railway Recommandé)

### Option A : Railway (Gratuit + Simple)

#### 1. Créer un compte Railway
- Allez sur https://railway.app
- Connectez-vous avec GitHub

#### 2. Créer un nouveau projet
```
1. Cliquez "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Choisissez "CRYPTOJEREM/CNAME"
4. Railway détecte automatiquement le backend
```

#### 3. Configuration Railway

**Variables d'Environnement** (Dans Settings → Variables) :

```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://votre-projet.vercel.app

JWT_SECRET=votre-super-secret-jwt-key-min-32-caracteres-aleatoires
JWT_REFRESH_SECRET=votre-refresh-token-secret-min-32-caracteres-aleatoires
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-app-password-gmail-16-caracteres
EMAIL_FROM=La Sphere <noreply@lasphere.com>

NOWPAYMENTS_API_KEY=votre-nowpayments-api-key
NOWPAYMENTS_IPN_SECRET=votre-ipn-secret-nowpayments

TELEGRAM_BOT_TOKEN=votre-telegram-bot-token
TELEGRAM_VIP_GROUP_ID=-1001234567890
```

#### 4. Configuration du Root Directory

Dans **Settings → Service** :
```
Root Directory: backend
Start Command: npm start
```

#### 5. Obtenir l'URL Backend

Railway vous donnera une URL type :
```
https://lasphere-backend-production.up.railway.app
```

---

### Option B : Render (Alternative Gratuite)

#### 1. Créer un compte Render
- Allez sur https://render.com
- Connectez-vous avec GitHub

#### 2. Créer un nouveau Web Service
```
1. Cliquez "New +" → "Web Service"
2. Connectez votre repo GitHub "CNAME"
3. Configurez :
   - Name: lasphere-backend
   - Region: Frankfurt (EU)
   - Root Directory: backend
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
```

#### 3. Ajouter les Variables d'Environnement

Même liste que Railway ci-dessus.

#### 4. Déployer

Render déploie automatiquement. Vous obtiendrez une URL :
```
https://lasphere-backend.onrender.com
```

---

## 🔗 Partie 3 : Lier Frontend et Backend

### Étape 1 : Mettre à jour le Backend

Dans les variables d'environnement de votre service backend (Railway/Render) :

```env
FRONTEND_URL=https://votre-projet-vercel.vercel.app
```

### Étape 2 : Mettre à jour le Frontend

Le frontend doit pointer vers le backend en production.

**Créer un fichier `.env.production` à la racine :**

```env
VITE_API_URL=https://votre-backend.railway.app/api
```

**Modifier `src/services/api.js` :**

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ... reste du code inchangé
```

### Étape 3 : Configurer les Variables dans Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. **Settings** → **Environment Variables**
4. Ajoutez :

```
VITE_API_URL = https://votre-backend.railway.app/api
```

### Étape 4 : Redéployer le Frontend

```bash
git add .
git commit -m "Configure production API URL"
git push
```

Vercel redéploiera automatiquement avec la nouvelle variable.

---

## ✅ Vérification du Déploiement

### Frontend (Vercel)

1. Ouvrez `https://votre-projet.vercel.app`
2. Vérifiez que le site s'affiche correctement
3. Ouvrez la console navigateur (F12)
4. Naviguez sur le site
5. Vérifiez qu'il n'y a pas d'erreurs CORS ou Network

### Backend (Railway/Render)

1. Testez l'endpoint de santé :
```bash
curl https://votre-backend.railway.app/api/auth/me
```

2. Vérifiez les logs :
   - Railway : Onglet "Logs"
   - Render : Onglet "Logs"

### Test Complet

1. **Inscription** :
   - Créez un nouveau compte
   - Vérifiez que l'email est envoyé
   - Cliquez sur le lien de vérification

2. **Connexion** :
   - Connectez-vous avec admin@lasphere.com / Admin2026!
   - Vérifiez que le dashboard s'affiche

3. **Panel Admin** :
   - Cliquez sur "🛡️ Admin"
   - Vérifiez que toutes les sections fonctionnent :
     - Users Management
     - Products Management
     - Content Management
     - Payments Dashboard

4. **Paiement Test** :
   - Testez un paiement crypto
   - Vérifiez que le webhook fonctionne
   - Vérifiez que l'abonnement est mis à jour

---

## 🔧 Configuration Avancée

### CORS (Backend)

Le fichier `backend/server.js` doit déjà avoir :

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Cookies Secure

En production, les cookies doivent être sécurisés. Dans `backend/routes/auth.routes.js` :

```javascript
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
});
```

### Base de Données Persistante

⚠️ **Important** : `database.json` sur Railway/Render sera réinitialisé à chaque redéploiement.

**Solutions** :

1. **Court terme** : Activer le volume persistant
   - Railway : Add Volume Storage
   - Render : Add Persistent Disk

2. **Long terme** : Migrer vers une vraie DB
   - Railway PostgreSQL (gratuit 500 MB)
   - MongoDB Atlas (gratuit 512 MB)
   - Supabase (gratuit 500 MB)

---

## 📊 Monitoring

### Logs en Temps Réel

**Railway** :
```
1. Dashboard → Votre service
2. Onglet "Logs"
3. Filtrer par erreur/warning
```

**Render** :
```
1. Dashboard → Votre service
2. Onglet "Logs"
3. Activer "Live tail"
```

### Alertes

Configurez des alertes email en cas de crash :
- Railway : Settings → Notifications
- Render : Settings → Notifications

---

## 🚨 Dépannage

### Erreur CORS

**Symptôme** : Console navigateur affiche "CORS policy blocked"

**Solution** :
1. Vérifiez `FRONTEND_URL` dans les variables backend
2. Vérifiez `corsOptions` dans `backend/server.js`
3. Redémarrez le service backend

### Erreur 502 Bad Gateway

**Symptôme** : Le frontend ne peut pas joindre le backend

**Solution** :
1. Vérifiez que le backend est démarré (onglet Logs)
2. Vérifiez `VITE_API_URL` dans Vercel
3. Testez l'URL backend directement dans le navigateur

### Base de Données Réinitialisée

**Symptôme** : Les utilisateurs/paiements disparaissent après redéploiement

**Solution** :
1. Ajoutez un volume persistant (Railway/Render)
2. Ou migrez vers PostgreSQL/MongoDB

### Emails Non Envoyés

**Symptôme** : Pas d'email de vérification reçu

**Solution** :
1. Vérifiez `SMTP_USER` et `SMTP_PASS` dans les variables backend
2. Vérifiez que c'est bien un App Password Gmail (16 caractères)
3. Vérifiez les logs backend pour les erreurs SMTP

---

## 📝 Checklist de Déploiement

### Avant de Déployer

- [ ] Tous les fichiers sont committés sur GitHub
- [ ] `.env.production` créé avec `VITE_API_URL`
- [ ] `src/services/api.js` utilise `import.meta.env.VITE_API_URL`
- [ ] Backend testé localement avec `npm start`
- [ ] Frontend testé localement avec `npm run build && npm run preview`

### Déploiement Backend

- [ ] Service Railway/Render créé
- [ ] Root Directory configuré sur `backend`
- [ ] Toutes les variables d'environnement ajoutées
- [ ] `FRONTEND_URL` pointe vers l'URL Vercel
- [ ] Service démarré sans erreurs
- [ ] Logs backend affichent "Server running on port 3001"

### Déploiement Frontend

- [ ] Variables Vercel configurées (`VITE_API_URL`)
- [ ] Code pushé sur GitHub
- [ ] Déploiement Vercel réussi (status "Ready")
- [ ] Site accessible sur l'URL Vercel
- [ ] Console navigateur sans erreurs

### Tests Post-Déploiement

- [ ] Inscription fonctionne
- [ ] Email de vérification reçu
- [ ] Connexion fonctionne
- [ ] Panel admin accessible (admin@lasphere.com)
- [ ] Paiement crypto fonctionne
- [ ] Webhook NOWPayments reçu
- [ ] Abonnement mis à jour correctement
- [ ] Telegram invite fonctionne

---

## 🎯 URLs à Noter

### Local (Développement)
```
Frontend: http://localhost:5174
Backend:  http://localhost:3001
```

### Production
```
Frontend: https://[votre-projet].vercel.app
Backend:  https://[votre-backend].railway.app
```

### Dashboards
```
Vercel:      https://vercel.com/dashboard
Railway:     https://railway.app/dashboard
NOWPayments: https://nowpayments.io/dashboard
Telegram:    https://t.me/BotFather
```

---

## 💡 Prochaines Étapes

1. **Migration Base de Données** : Passer de `database.json` à PostgreSQL
2. **CDN pour Assets** : Optimiser les images et vidéos
3. **Monitoring Avancé** : Intégrer Sentry pour les erreurs
4. **Analytics** : Ajouter Google Analytics ou Plausible
5. **SEO** : Configurer meta tags et sitemap.xml
6. **PWA** : Transformer en Progressive Web App
7. **Rate Limiting** : Protéger l'API contre les abus
8. **Backup Automatisé** : Sauvegardes quotidiennes de la DB

---

**Créé par CRYPTOJEREM - La Sphere © 2026**
