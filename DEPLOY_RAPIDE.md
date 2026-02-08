# 🚀 Déploiement Rapide - 15 Minutes

## Prérequis (5 min)

1. **Créer un compte Render** : https://render.com (gratuit)
2. **Créer un compte Vercel** : https://vercel.com (gratuit)
3. **Créer un repo GitHub** : https://github.com/new (nommez-le "lasphere")

---

## Étape 1 : GitHub (2 min)

```bash
cd d:\Github\CNAME

# Initialiser Git si nécessaire
git init

# Ajouter tous les fichiers
git add .
git commit -m "Premier déploiement"

# Connecter à GitHub (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/lasphere.git
git branch -M main
git push -u origin main
```

---

## Étape 2 : Backend sur Render (5 min)

1. Aller sur https://dashboard.render.com
2. Cliquer **"New +"** → **"Web Service"**
3. Connecter votre repo GitHub `lasphere`
4. Configurer :
   - **Name** : `lasphere-backend`
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
   - **Instance Type** : `Free`

5. **Environment Variables** (cliquer "Add Environment Variable") :

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://lasphere.xyz
JWT_SECRET=<générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_REFRESH_SECRET=<générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<votre-email@gmail.com>
SMTP_PASS=<votre-app-password-gmail>
EMAIL_FROM=La Sphere <noreply@lasphere.com>
NOWPAYMENTS_API_KEY=<votre-clé>
NOWPAYMENTS_IPN_SECRET=<votre-secret>
TELEGRAM_BOT_TOKEN=<votre-token>
TELEGRAM_VIP_GROUP_ID=<votre-id-groupe>
```

6. Cliquer **"Create Web Service"**
7. Attendre 3-5 minutes → Noter l'URL : `https://lasphere-backend.onrender.com`

---

## Étape 3 : Frontend sur Vercel (3 min)

1. Aller sur https://vercel.com
2. Cliquer **"Add New..."** → **"Project"**
3. Importer `VOTRE_USERNAME/lasphere`
4. Configuration :
   - **Framework** : Vite
   - **Root Directory** : `./`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

5. **Environment Variables** :
```
VITE_API_URL=https://lasphere-backend.onrender.com/api
```

6. Cliquer **"Deploy"** → Attendre 2-3 minutes

7. **Ajouter le domaine** :
   - Aller dans **Settings** → **Domains**
   - Ajouter `lasphere.xyz`
   - Vercel vous donnera les DNS à configurer

---

## Étape 4 : DNS (5 min + attente propagation)

Dans votre hébergeur de domaine (OVH, Cloudflare, etc.) :

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Attendre 5-30 minutes pour la propagation DNS.

---

## Étape 5 : Vérifier (2 min)

1. **Backend** : `curl https://lasphere-backend.onrender.com/`
2. **Frontend** : Ouvrir https://lasphere.xyz
3. **Test complet** : Créer un compte, se connecter

---

## 🎉 C'est Fait !

Votre site est en ligne sur **https://lasphere.xyz** !

### Déploiements futurs

Utilisez le script fourni :
```bash
DEPLOY.bat
```

Ou manuellement :
```bash
git add .
git commit -m "Mise à jour"
git push
```

Les déploiements sont **automatiques** sur Render et Vercel après chaque push.

---

## ⚠️ Important

- **Ne jamais committer** les fichiers `.env` avec de vraies clés
- Toujours utiliser `.env.example` pour la documentation
- Les variables sensibles sont dans Render/Vercel uniquement

---

## 🆘 Aide

- **Documentation complète** : `DEPLOIEMENT.md`
- **Logs Backend** : https://dashboard.render.com
- **Logs Frontend** : https://vercel.com/dashboard
