# ⚡ Actions Rapides - Déploiement Production

## ✅ Déjà Fait

1. ✅ Code poussé sur GitHub (commit 1a6cb2c)
2. ✅ Configuration Vercel (vercel.json)
3. ✅ Variables d'environnement frontend (.env.production)
4. ✅ Guide de déploiement complet (DEPLOIEMENT_VERCEL.md)
5. ✅ Panel admin complet avec toutes les fonctionnalités

---

## 🚀 À Faire Maintenant (5 étapes simples)

### Étape 1 : Vérifier le Déploiement Frontend Vercel

1. Allez sur https://vercel.com/dashboard
2. Trouvez votre projet (probablement "CNAME" ou "lasphere")
3. Vérifiez le statut du dernier déploiement :
   - ✅ Si **"Ready"** → Frontend déployé avec succès !
   - 🔄 Si **"Building"** → Attendez 2-3 minutes
   - ❌ Si **"Error"** → Consultez les logs d'erreur

4. **Notez votre URL Vercel** :
   ```
   https://[votre-projet].vercel.app
   ```

---

### Étape 2 : Déployer le Backend sur Railway

#### Option Rapide (Railway - Recommandé)

1. **Créer un compte** : https://railway.app
   - Connectez-vous avec votre compte GitHub

2. **Nouveau Projet** :
   - Cliquez "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repo "CRYPTOJEREM/CNAME"

3. **Configurer le Service** :
   - Root Directory : `backend`
   - Start Command : `npm start`

4. **Ajouter les Variables d'Environnement** (Settings → Variables) :

   ```env
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://[votre-url-vercel].vercel.app

   JWT_SECRET=la-sphere-super-secret-jwt-key-dev-2026-minimum-32-characters
   JWT_REFRESH_SECRET=la-sphere-refresh-token-secret-key-dev-2026-also-32-chars
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   EMAIL_FROM=La Sphere <noreply@lasphere.com>

   NOWPAYMENTS_API_KEY=YOUR_NOWPAYMENTS_API_KEY
   NOWPAYMENTS_IPN_SECRET=YOUR_IPN_SECRET_KEY

   TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
   TELEGRAM_VIP_GROUP_ID=-1001234567890
   ```

5. **Déployer** → Railway déploie automatiquement

6. **Notez votre URL Backend** :
   ```
   https://[votre-backend].railway.app
   ```

---

### Étape 3 : Lier Frontend et Backend

1. **Dans Vercel** (Settings → Environment Variables) :
   - Ajoutez :
     ```
     VITE_API_URL = https://[votre-backend].railway.app/api
     ```

2. **Dans Railway** (Variables d'environnement) :
   - Mettez à jour `FRONTEND_URL` avec votre vraie URL Vercel
   - Exemple : `https://lasphere.vercel.app`

3. **Redéployer Vercel** :
   - Dans le dashboard Vercel, cliquez "Redeploy" sur le dernier déploiement

---

### Étape 4 : Tester la Production

1. **Ouvrez votre site** : https://[votre-url].vercel.app

2. **Testez la connexion** :
   - Email : `admin@lasphere.com`
   - Mot de passe : `Admin2026!`

3. **Vérifiez le panel admin** :
   - Cliquez sur "🛡️ Admin" dans la navigation
   - Vérifiez que toutes les sections s'affichent :
     - Users Management
     - Products Management
     - Content Management
     - Payments Dashboard

4. **Testez l'inscription** :
   - Créez un nouveau compte
   - Vérifiez que l'email de vérification est envoyé (si SMTP configuré)

---

### Étape 5 : Configurer le Webhook NOWPayments

1. **Allez sur** : https://nowpayments.io/dashboard

2. **Settings → IPN/Callbacks**

3. **IPN Callback URL** :
   ```
   https://[votre-backend].railway.app/api/payment/webhook
   ```

4. **Sauvegardez**

---

## 🎯 Checklist Finale

Cochez chaque élément une fois terminé :

- [ ] Frontend déployé sur Vercel (status "Ready")
- [ ] Backend déployé sur Railway (logs affichent "Server running on port 3001")
- [ ] `VITE_API_URL` configurée dans Vercel
- [ ] `FRONTEND_URL` configurée dans Railway
- [ ] Site accessible : https://[votre-url].vercel.app
- [ ] Connexion admin fonctionne (admin@lasphere.com / Admin2026!)
- [ ] Panel admin accessible et fonctionnel
- [ ] CORS configuré (pas d'erreurs dans la console navigateur)
- [ ] Webhook NOWPayments configuré
- [ ] Emails fonctionnent (si SMTP configuré)

---

## 🆘 Problèmes Courants

### ❌ Erreur CORS dans la console

**Cause** : `FRONTEND_URL` mal configurée dans Railway

**Solution** :
1. Allez dans Railway → Variables
2. Vérifiez que `FRONTEND_URL` = votre vraie URL Vercel (sans trailing slash)
3. Redémarrez le service

---

### ❌ "Network Error" lors de la connexion

**Cause** : `VITE_API_URL` mal configurée dans Vercel

**Solution** :
1. Allez dans Vercel → Settings → Environment Variables
2. Vérifiez `VITE_API_URL` = `https://[votre-backend].railway.app/api`
3. Redéployez Vercel

---

### ❌ Backend ne démarre pas sur Railway

**Cause** : Variables d'environnement manquantes ou Root Directory incorrect

**Solution** :
1. Vérifiez Settings → Root Directory = `backend`
2. Vérifiez que toutes les variables d'environnement sont présentes
3. Consultez les logs pour l'erreur exacte

---

## 📞 Support

**Guides complets** :
- DEPLOIEMENT_VERCEL.md (guide détaillé)
- GUIDE_DEMARRAGE.md (guide local)

**Logs en direct** :
- Vercel : Dashboard → Votre projet → Deployment → Logs
- Railway : Dashboard → Votre service → Logs

**Documentations officielles** :
- Vercel : https://vercel.com/docs
- Railway : https://docs.railway.app
- NOWPayments : https://documenter.getpostman.com/view/7907941/S1a32n38

---

## 🎉 Une Fois Tout Opérationnel

Votre site sera accessible 24/7 sur :
```
https://[votre-projet].vercel.app
```

**Panel Admin** :
```
https://[votre-projet].vercel.app (cliquez sur 🛡️ Admin après connexion)
```

**Identifiants Admin** :
```
Email: admin@lasphere.com
Mot de passe: Admin2026!
```

---

**Créé par CRYPTOJEREM - La Sphere © 2026**

*Dernière mise à jour : Commit 1a6cb2c*
