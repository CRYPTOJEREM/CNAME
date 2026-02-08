# 🚀 Guide de Déploiement - La Sphere

Ce guide vous explique comment déployer **La Sphere** en ligne sur **lasphere.xyz**.

## Architecture de Déploiement

- **Frontend (React + Vite)** → Vercel → `https://lasphere.xyz`
- **Backend (Node.js + Express)** → Render → `https://lasphere-backend.onrender.com`
- **Domaine** → `lasphere.xyz` (configuré dans Vercel)

---

## 📋 Prérequis

1. Compte GitHub (pour pousser le code)
2. Compte Vercel (gratuit) : https://vercel.com
3. Compte Render (gratuit) : https://render.com
4. Domaine lasphere.xyz avec accès aux DNS

---

## ÉTAPE 1 : Préparer le Code

### 1.1 Commit et Push sur GitHub

```bash
# Si ce n'est pas déjà fait, initialiser Git
cd d:\Github\CNAME
git init
git add .
git commit -m "Prêt pour déploiement production"

# Créer un repo sur GitHub nommé "lasphere"
# Puis :
git remote add origin https://github.com/VOTRE_USERNAME/lasphere.git
git branch -M main
git push -u origin main
```

---

## ÉTAPE 2 : Déployer le Backend sur Render

### 2.1 Créer le Service Web

1. Aller sur https://render.com et se connecter
2. Cliquer sur **"New +"** → **"Web Service"**
3. Connecter votre repo GitHub : `VOTRE_USERNAME/lasphere`
4. Configuration :
   - **Name** : `lasphere-backend`
   - **Root Directory** : `backend`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
   - **Plan** : `Free`

### 2.2 Configurer les Variables d'Environnement

Dans l'onglet **"Environment"**, ajouter ces variables :

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://lasphere.xyz

# JWT (Générer des secrets aléatoires sécurisés)
JWT_SECRET=<générer-un-secret-32-chars>
JWT_REFRESH_SECRET=<générer-un-autre-secret-32-chars>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<votre-email@gmail.com>
SMTP_PASS=<votre-app-password-gmail>
EMAIL_FROM=La Sphere <noreply@lasphere.com>

# NOWPayments (vos clés existantes)
NOWPAYMENTS_API_KEY=<votre-clé-nowpayments>
NOWPAYMENTS_IPN_SECRET=<votre-secret-ipn>

# Telegram (vos clés existantes)
TELEGRAM_BOT_TOKEN=<votre-token-bot>
TELEGRAM_VIP_GROUP_ID=<votre-id-groupe>
```

**Pour générer des secrets JWT sécurisés :**
```bash
# Dans un terminal Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.3 Déployer

1. Cliquer sur **"Create Web Service"**
2. Attendre 2-5 minutes que le déploiement se termine
3. Votre backend sera accessible à : `https://lasphere-backend.onrender.com`

### 2.4 Tester le Backend

```bash
curl https://lasphere-backend.onrender.com/
# Devrait retourner : {"message":"🌐 La Sphere API","version":"1.0.0"}
```

---

## ÉTAPE 3 : Déployer le Frontend sur Vercel

### 3.1 Mettre à Jour l'URL du Backend

Modifier le fichier `.env.production` :

```
VITE_API_URL=https://lasphere-backend.onrender.com/api
```

Commit et push :
```bash
git add .env.production
git commit -m "Configurer URL backend production"
git push
```

### 3.2 Déployer sur Vercel

1. Aller sur https://vercel.com et se connecter
2. Cliquer sur **"Add New..."** → **"Project"**
3. Importer votre repo GitHub : `VOTRE_USERNAME/lasphere`
4. Configuration :
   - **Framework Preset** : Vite
   - **Root Directory** : `./` (racine)
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

5. **Environment Variables** - Ajouter :
   ```
   VITE_API_URL=https://lasphere-backend.onrender.com/api
   ```

6. Cliquer sur **"Deploy"**
7. Attendre 2-3 minutes

### 3.3 Configurer le Domaine Personnalisé

1. Dans votre projet Vercel, aller dans **"Settings"** → **"Domains"**
2. Ajouter le domaine : `lasphere.xyz`
3. Vercel vous donnera des instructions DNS :
   - **Type** : `A` ou `CNAME`
   - **Name** : `@` (pour le domaine racine)
   - **Value** : Adresse IP ou `cname.vercel-dns.com`

### 3.4 Configurer les DNS

Aller dans votre panneau de gestion DNS (ex: Cloudflare, OVH, etc.) et ajouter :

```
Type: A
Name: @
Value: 76.76.21.21 (IP de Vercel)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Note :** Si vous utilisez Cloudflare, désactivez le proxy (nuage gris) pour le premier déploiement.

### 3.5 Vérifier le Domaine

Attendre 5-10 minutes pour la propagation DNS, puis vérifier :
```bash
curl https://lasphere.xyz
```

---

## ÉTAPE 4 : Configuration Post-Déploiement

### 4.1 Mettre à Jour les CORS Backend

Le backend doit autoriser `lasphere.xyz`. Vérifier dans `backend/server.js` :

```javascript
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
};
```

C'est déjà configuré via la variable `FRONTEND_URL=https://lasphere.xyz`.

### 4.2 Webhooks NOWPayments

Mettre à jour l'URL du webhook NOWPayments :
```
https://lasphere-backend.onrender.com/api/payment/webhook
```

### 4.3 Telegram Bot

Mettre à jour les URLs de votre bot Telegram si nécessaire pour pointer vers le backend de production.

---

## ÉTAPE 5 : Tests en Production

### 5.1 Tester l'Inscription
1. Aller sur https://lasphere.xyz
2. Cliquer sur "Inscription"
3. Créer un compte
4. Vérifier la réception de l'email de confirmation

### 5.2 Tester la Connexion
1. Se connecter avec le compte créé
2. Vérifier l'accès à l'espace membre

### 5.3 Tester un Paiement (Mode Sandbox)
1. Aller dans "Abonnements"
2. Sélectionner un plan
3. Effectuer un paiement test
4. Vérifier la mise à jour de l'abonnement

---

## 🔄 Déploiements Futurs

### Frontend (Automatique)
Chaque `git push` sur `main` redéploie automatiquement sur Vercel.

### Backend (Automatique)
Chaque `git push` sur `main` redéploie automatiquement sur Render.

---

## 🐛 Troubleshooting

### Le frontend ne se connecte pas au backend
1. Vérifier que `VITE_API_URL` est bien configuré dans Vercel
2. Vérifier les CORS dans le backend
3. Vérifier les logs du backend sur Render

### Erreur 401 sur les routes protégées
1. Vérifier que `JWT_SECRET` est bien configuré sur Render
2. Vérifier que les cookies sont autorisés (credentials: true)

### Emails non reçus
1. Vérifier `SMTP_USER` et `SMTP_PASS` dans Render
2. Vérifier que l'App Password Gmail est valide
3. Consulter les logs du backend

### Render service en veille (Free plan)
Le plan gratuit de Render met le service en veille après 15 minutes d'inactivité.
- Première requête après veille : 30-50 secondes
- Solution : passer au plan payant ($7/mois) ou utiliser un service de ping

---

## 📊 Monitoring

### Logs Backend (Render)
https://dashboard.render.com/web/VOTRE_SERVICE_ID/logs

### Logs Frontend (Vercel)
https://vercel.com/VOTRE_PROJET/deployments

### Analytics Vercel
https://vercel.com/VOTRE_PROJET/analytics

---

## 🔒 Sécurité

### Variables Sensibles
- **JAMAIS** committer les fichiers `.env` avec de vraies clés
- Toujours utiliser `.env.example` pour la documentation
- Stocker les secrets uniquement dans Render/Vercel

### HTTPS
- Vercel et Render fournissent automatiquement des certificats SSL
- Toujours utiliser `https://` en production

### Secrets JWT
- Utiliser des secrets de 32+ caractères aléatoires
- Différents en dev et production
- Ne jamais réutiliser les mêmes secrets entre projets

---

## 💰 Coûts

| Service | Plan | Prix |
|---------|------|------|
| Vercel | Hobby | **Gratuit** (100GB bandwidth/mois) |
| Render | Free | **Gratuit** (750h/mois, veille après 15min) |
| **TOTAL** | | **0€ / mois** |

### Pour Scaler (Optionnel)
- **Render Standard** : $7/mois (pas de veille, 512MB RAM)
- **Vercel Pro** : $20/mois (analytics avancés, domaines illimités)

---

## ✅ Checklist Finale

- [ ] Code pushé sur GitHub
- [ ] Backend déployé sur Render
- [ ] Variables d'environnement backend configurées
- [ ] Backend accessible et répond aux requêtes
- [ ] Frontend déployé sur Vercel
- [ ] Variable `VITE_API_URL` configurée
- [ ] Domaine lasphere.xyz configuré dans Vercel
- [ ] DNS configurés et propagés
- [ ] Site accessible via https://lasphere.xyz
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Emails reçus
- [ ] Paiement test effectué
- [ ] Webhook NOWPayments mis à jour
- [ ] Bot Telegram fonctionne

---

## 🎉 Félicitations !

Votre application **La Sphere** est maintenant en ligne sur **https://lasphere.xyz** !

Pour toute question ou problème, consultez les logs de Render et Vercel.
