# ✅ Checklist de Déploiement - La Sphere

## 📍 Progression

```
✅ ÉTAPE 1 : Code sur GitHub          [TERMINÉ]
⬜ ÉTAPE 2 : Backend sur Render        [EN ATTENTE]
⬜ ÉTAPE 3 : Frontend sur Vercel       [EN ATTENTE]
⬜ ÉTAPE 4 : Domaine lasphere.xyz      [EN ATTENTE]
⬜ ÉTAPE 5 : Tests finaux              [EN ATTENTE]
```

---

## ✅ ÉTAPE 1 : GITHUB (TERMINÉ)

- ✅ Code poussé sur : https://github.com/CRYPTOJEREM/CNAME
- ✅ Tous les fichiers de configuration présents
- ✅ `.gitignore` configuré correctement

---

## ⬜ ÉTAPE 2 : BACKEND SUR RENDER

### Configuration Rapide

🌐 **URL** : https://dashboard.render.com

**Création du Service :**
- [ ] New + → Web Service
- [ ] Repository : CRYPTOJEREM/CNAME
- [ ] Root Directory : `backend`
- [ ] Build Command : `npm install`
- [ ] Start Command : `node server.js`
- [ ] Instance Type : Free

**Variables d'Environnement (15 variables) :**

✅ Configuration de Base (3)
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `FRONTEND_URL=https://lasphere.xyz`

✅ JWT Secrets (4) - À GÉNÉRER
```bash
# Exécuter 2 fois pour générer 2 secrets différents :
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- [ ] `JWT_SECRET=<secret-généré-1>`
- [ ] `JWT_REFRESH_SECRET=<secret-généré-2>`
- [ ] `JWT_EXPIRES_IN=15m`
- [ ] `JWT_REFRESH_EXPIRES_IN=7d`

✅ Email Gmail (4)
- [ ] `SMTP_HOST=smtp.gmail.com`
- [ ] `SMTP_PORT=587`
- [ ] `SMTP_USER=<votre-email@gmail.com>`
- [ ] `SMTP_PASS=<app-password-gmail>`

  **Obtenir App Password :** https://myaccount.google.com/apppasswords

- [ ] `EMAIL_FROM=La Sphere <noreply@lasphere.com>`

✅ NOWPayments (2)
- [ ] `NOWPAYMENTS_API_KEY=<votre-clé>`
- [ ] `NOWPAYMENTS_IPN_SECRET=<votre-secret>`

✅ Telegram (2)
- [ ] `TELEGRAM_BOT_TOKEN=<votre-token>`
- [ ] `TELEGRAM_VIP_GROUP_ID=<votre-id-groupe>`

**Déploiement :**
- [ ] Toutes les variables remplies
- [ ] Cliquer "Create Web Service"
- [ ] Attendre 3-5 minutes
- [ ] Noter l'URL : `https://lasphere-backend.onrender.com`
- [ ] Tester : `curl https://lasphere-backend.onrender.com/`

**Résultat attendu :**
```json
{"message":"🌐 La Sphere API","version":"1.0.0"}
```

---

## ⬜ ÉTAPE 3 : FRONTEND SUR VERCEL

### Configuration Rapide

🌐 **URL** : https://vercel.com

**Création du Projet :**
- [ ] Add New → Project
- [ ] Repository : CRYPTOJEREM/CNAME
- [ ] Framework : Vite
- [ ] Root Directory : `./`
- [ ] Build Command : `npm run build`
- [ ] Output Directory : `dist`

**Variable d'Environnement (1) :**
- [ ] `VITE_API_URL=https://lasphere-backend.onrender.com/api`

  ⚠️ **Remplacer par votre vraie URL Render !**

**Déploiement :**
- [ ] Cliquer "Deploy"
- [ ] Attendre 2-3 minutes
- [ ] Noter l'URL temporaire : `https://cname-xxx.vercel.app`
- [ ] Vérifier que le site s'affiche

---

## ⬜ ÉTAPE 4 : DOMAINE LASPHERE.XYZ

### Configuration DNS

**Dans Vercel :**
- [ ] Settings → Domains
- [ ] Ajouter : `lasphere.xyz`
- [ ] Noter les instructions DNS

**Dans votre panneau DNS (Cloudflare/OVH/GoDaddy) :**

Option 1 - A Record (Recommandé)
```
- [ ] Type: A
- [ ] Name: @
- [ ] Value: 76.76.21.21
- [ ] TTL: Auto

- [ ] Type: CNAME
- [ ] Name: www
- [ ] Value: cname.vercel-dns.com
- [ ] TTL: Auto
```

**Propagation :**
- [ ] Attendre 5-30 minutes
- [ ] Vérifier : https://dnschecker.org
- [ ] Tester : `curl https://lasphere.xyz`

---

## ⬜ ÉTAPE 5 : CONFIGURATION POST-DÉPLOIEMENT

### Webhooks et Intégrations

**NOWPayments :**
- [ ] Dashboard NOWPayments
- [ ] Mettre à jour webhook URL :
  ```
  https://lasphere-backend.onrender.com/api/payment/webhook
  ```

### Tests Finaux

**Test Inscription :**
- [ ] Aller sur https://lasphere.xyz
- [ ] Cliquer "Inscription"
- [ ] Créer un compte
- [ ] Vérifier réception email
- [ ] Cliquer lien de vérification

**Test Connexion :**
- [ ] Se connecter avec le compte
- [ ] Vérifier accès espace membre
- [ ] Vérifier affichage du profil

**Test Contenu :**
- [ ] Accéder à "Formation"
- [ ] Vérifier contenu gratuit visible
- [ ] Vérifier contenu premium bloqué

**Test Paiement (Optionnel) :**
- [ ] Aller dans "Abonnements"
- [ ] Sélectionner un plan
- [ ] Tester paiement (sandbox si possible)
- [ ] Vérifier mise à jour abonnement
- [ ] Vérifier déblocage contenu

---

## 🎉 DÉPLOIEMENT COMPLET !

Une fois toutes les cases cochées, votre application est 100% opérationnelle !

### Accès

- 🌐 **Frontend** : https://lasphere.xyz
- ⚙️ **Backend** : https://lasphere-backend.onrender.com
- 📊 **Logs Render** : https://dashboard.render.com
- 📊 **Logs Vercel** : https://vercel.com/dashboard
- 📦 **GitHub** : https://github.com/CRYPTOJEREM/CNAME

### Déploiements Futurs

Pour mettre à jour l'application :

```bash
# Utiliser le script
DEPLOY.bat

# Ou manuellement
git add .
git commit -m "Votre message"
git push
```

**Les déploiements sont automatiques !** 🚀

---

## 📋 Temps Estimés

| Étape | Durée |
|-------|-------|
| ✅ GitHub | **Terminé** |
| Backend Render | 5-7 minutes |
| Frontend Vercel | 3-5 minutes |
| Configuration DNS | 2 min + 5-30 min propagation |
| Tests finaux | 5 minutes |
| **TOTAL** | **15-50 minutes** |

---

## 🆘 Besoin d'Aide ?

Consultez les guides détaillés :

- 📄 **[DEPLOY_INFO.md](./DEPLOY_INFO.md)** - Instructions détaillées
- 📖 **[DEPLOIEMENT.md](./DEPLOIEMENT.md)** - Guide complet
- 🚀 **[DEPLOY_RAPIDE.md](./DEPLOY_RAPIDE.md)** - Guide rapide

---

<div align="center">
  <strong>🚀 Bon déploiement ! 🌐</strong>
</div>
