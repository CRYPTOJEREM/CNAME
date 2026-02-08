# 🎯 Guide Complet de Déploiement - Étape par Étape

## 📋 Vue d'Ensemble

Vous allez déployer :
- **Frontend React** → Vercel (gratuit, automatique)
- **Backend Express** → Railway (gratuit, simple)

**Temps total estimé : 15-20 minutes**

---

## 🚀 PARTIE 1 : DÉPLOIEMENT FRONTEND SUR VERCEL

### ÉTAPE 1 : Créer/Se connecter à Vercel

1. **Ouvrez votre navigateur** et allez sur : https://vercel.com

2. **Connectez-vous** :
   - Cliquez sur "**Log In**" (en haut à droite)
   - Sélectionnez "**Continue with GitHub**"
   - Autorisez Vercel à accéder à votre compte GitHub

3. **Vérification** : Vous devriez voir votre dashboard Vercel

---

### ÉTAPE 2 : Importer votre Projet GitHub

1. **Sur le dashboard Vercel**, cliquez sur "**Add New...**" puis "**Project**"

2. **Importez votre repository** :
   - Cherchez "**CNAME**" dans la liste de vos repos
   - Cliquez sur "**Import**" à côté de "CRYPTOJEREM/CNAME"

3. **Si le repo n'apparaît pas** :
   - Cliquez sur "**Adjust GitHub App Permissions**"
   - Donnez accès à votre repository "CNAME"
   - Retournez sur Vercel et rafraîchissez

---

### ÉTAPE 3 : Configurer le Projet Vercel

1. **Configure Project** - Remplissez les champs suivants :

   **Project Name** :
   ```
   lasphere
   ```
   *(ou un nom de votre choix)*

   **Framework Preset** :
   ```
   Vite
   ```
   *(Devrait être détecté automatiquement)*

   **Root Directory** :
   ```
   ./
   ```
   *(Laissez tel quel, PAS "backend")*

   **Build Command** :
   ```
   npm run build
   ```

   **Output Directory** :
   ```
   dist
   ```

   **Install Command** :
   ```
   npm install
   ```

2. **Ne cliquez PAS encore sur Deploy** - On doit d'abord ajouter les variables d'environnement

---

### ÉTAPE 4 : Ajouter les Variables d'Environnement (Frontend)

1. **Dépliez la section "Environment Variables"**

2. **Pour l'instant, laissez vide** - On reviendra après avoir déployé le backend

3. **Maintenant, cliquez sur "Deploy"**

4. **Attendez 2-3 minutes** :
   - Vercel va installer les dépendances
   - Construire votre site
   - Le déployer

5. **Vérification du déploiement** :
   - ✅ Si vous voyez "**Congratulations!**" avec des confettis → Succès !
   - ❌ Si vous voyez "**Failed**" → Consultez les logs d'erreur

6. **Notez votre URL Vercel** :
   - Elle ressemble à : `https://lasphere.vercel.app`
   - Ou : `https://lasphere-cryptojerem.vercel.app`
   - **COPIEZ CETTE URL** - Vous en aurez besoin !

7. **Visitez votre site** :
   - Cliquez sur "**Visit**"
   - Le site devrait s'afficher (mais la connexion ne fonctionnera pas encore car le backend n'est pas déployé)

---

## 🖥️ PARTIE 2 : DÉPLOIEMENT BACKEND SUR RAILWAY

### ÉTAPE 5 : Créer un Compte Railway

1. **Ouvrez un nouvel onglet** et allez sur : https://railway.app

2. **Connectez-vous avec GitHub** :
   - Cliquez sur "**Login**" (en haut à droite)
   - Sélectionnez "**Login with GitHub**"
   - Autorisez Railway

3. **Vérification** : Vous devriez voir le dashboard Railway

---

### ÉTAPE 6 : Créer un Nouveau Projet Railway

1. **Sur le dashboard Railway**, cliquez sur "**New Project**"

2. **Sélectionnez "Deploy from GitHub repo"**

3. **Choisissez votre repository** :
   - Cherchez "**CRYPTOJEREM/CNAME**"
   - Cliquez dessus

4. **Si le repo n'apparaît pas** :
   - Cliquez sur "**Configure GitHub App**"
   - Donnez accès au repository "CNAME"
   - Retournez sur Railway

5. **Railway va détecter le projet** et créer un service

---

### ÉTAPE 7 : Configurer le Service Backend

1. **Cliquez sur le service créé** (devrait s'appeler "CNAME" ou "web")

2. **Allez dans l'onglet "Settings"** (icône engrenage)

3. **Configurez le Root Directory** :
   - Cherchez la section "**Root Directory**"
   - Cliquez sur "**Edit**"
   - Entrez : `backend`
   - Cliquez sur "**Update**"

4. **Configurez la Start Command** :
   - Cherchez "**Custom Start Command**"
   - Cliquez sur "**Edit**"
   - Entrez : `npm start`
   - Cliquez sur "**Update**"

---

### ÉTAPE 8 : Ajouter les Variables d'Environnement (Backend)

1. **Toujours dans Settings**, cherchez "**Variables**"

2. **Cliquez sur "New Variable"** et ajoutez UNE PAR UNE les variables suivantes :

   **Variable 1 :**
   ```
   Name: PORT
   Value: 3001
   ```

   **Variable 2 :**
   ```
   Name: NODE_ENV
   Value: production
   ```

   **Variable 3 (IMPORTANT - Remplacez par votre vraie URL Vercel) :**
   ```
   Name: FRONTEND_URL
   Value: https://lasphere.vercel.app
   ```
   ⚠️ **Remplacez** `lasphere.vercel.app` par VOTRE URL Vercel de l'Étape 4

   **Variable 4 :**
   ```
   Name: JWT_SECRET
   Value: la-sphere-super-secret-jwt-key-dev-2026-minimum-32-characters
   ```

   **Variable 5 :**
   ```
   Name: JWT_REFRESH_SECRET
   Value: la-sphere-refresh-token-secret-key-dev-2026-also-32-chars
   ```

   **Variable 6 :**
   ```
   Name: JWT_EXPIRES_IN
   Value: 15m
   ```

   **Variable 7 :**
   ```
   Name: JWT_REFRESH_EXPIRES_IN
   Value: 7d
   ```

   **Variable 8 :**
   ```
   Name: SMTP_HOST
   Value: smtp.gmail.com
   ```

   **Variable 9 :**
   ```
   Name: SMTP_PORT
   Value: 587
   ```

   **Variable 10 (Votre email Gmail) :**
   ```
   Name: SMTP_USER
   Value: votre-email@gmail.com
   ```

   **Variable 11 (Votre App Password Gmail) :**
   ```
   Name: SMTP_PASS
   Value: votre-app-password-16-caracteres
   ```

   **Variable 12 :**
   ```
   Name: EMAIL_FROM
   Value: La Sphere <noreply@lasphere.com>
   ```

   **Variable 13 :**
   ```
   Name: NOWPAYMENTS_API_KEY
   Value: YOUR_NOWPAYMENTS_API_KEY
   ```

   **Variable 14 :**
   ```
   Name: NOWPAYMENTS_IPN_SECRET
   Value: YOUR_IPN_SECRET_KEY
   ```

   **Variable 15 :**
   ```
   Name: TELEGRAM_BOT_TOKEN
   Value: YOUR_TELEGRAM_BOT_TOKEN
   ```

   **Variable 16 :**
   ```
   Name: TELEGRAM_VIP_GROUP_ID
   Value: -1001234567890
   ```

3. **Sauvegardez** - Railway va automatiquement redéployer le backend

---

### ÉTAPE 9 : Obtenir l'URL du Backend Railway

1. **Allez dans l'onglet "Settings"** de votre service

2. **Cherchez la section "Networking"** ou "Domains"

3. **Cliquez sur "Generate Domain"** si aucun domaine n'est généré

4. **Vous verrez une URL comme** :
   ```
   https://cname-production.up.railway.app
   ```
   Ou
   ```
   https://lasphere-backend-production.up.railway.app
   ```

5. **COPIEZ CETTE URL** - Vous en aurez besoin !

6. **Testez le backend** :
   - Ouvrez un nouvel onglet
   - Allez sur : `https://[votre-url-railway].up.railway.app/api/auth/me`
   - Vous devriez voir une erreur JSON (c'est normal, vous n'êtes pas authentifié)
   - Si vous voyez du JSON, le backend fonctionne ! ✅

---

### ÉTAPE 10 : Vérifier les Logs Backend

1. **Dans Railway**, allez dans l'onglet "**Deployments**"

2. **Cliquez sur le dernier déploiement**

3. **Consultez les logs** :
   - Cherchez : `Server running on port 3001`
   - Cherchez : `Connected to database`
   - ✅ Si vous voyez ces messages → Backend opérationnel !
   - ❌ Si vous voyez des erreurs → Vérifiez les variables d'environnement

---

## 🔗 PARTIE 3 : CONNECTER FRONTEND ET BACKEND

### ÉTAPE 11 : Configurer l'URL Backend dans Vercel

1. **Retournez sur** : https://vercel.com/dashboard

2. **Cliquez sur votre projet "lasphere"**

3. **Allez dans "Settings"** (onglet en haut)

4. **Dans le menu de gauche, cliquez sur "Environment Variables"**

5. **Ajoutez une nouvelle variable** :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://[votre-url-railway].up.railway.app/api`

     Exemple :
     ```
     https://cname-production.up.railway.app/api
     ```

   - **Environment** : Cochez "Production", "Preview", et "Development"
   - **Cliquez sur "Save"**

---

### ÉTAPE 12 : Redéployer le Frontend Vercel

1. **Toujours dans Vercel**, allez dans l'onglet "**Deployments**"

2. **Cliquez sur le dernier déploiement** (le plus récent en haut)

3. **Cliquez sur les 3 points "..."** à droite

4. **Sélectionnez "Redeploy"**

5. **Confirmez en cliquant sur "Redeploy"**

6. **Attendez 2-3 minutes** que le nouveau déploiement se termine

7. **Vérifiez le statut** :
   - ✅ "Ready" → Succès !
   - ❌ "Failed" → Consultez les logs

---

## ✅ PARTIE 4 : TESTER LE SITE EN PRODUCTION

### ÉTAPE 13 : Test de Connexion Admin

1. **Ouvrez votre site Vercel** : `https://lasphere.vercel.app`

2. **Ouvrez la console du navigateur** :
   - Appuyez sur **F12**
   - Allez dans l'onglet "**Console**"
   - Vérifiez qu'il n'y a **pas d'erreurs CORS** (rouge)

3. **Cliquez sur "🔐 Connexion"** dans la navigation

4. **Entrez les identifiants admin** :
   ```
   Email: admin@lasphere.com
   Mot de passe: Admin2026!
   ```

5. **Cliquez sur "Se connecter"**

6. **Vérifications** :
   - ✅ Vous devriez voir "👋 Admin" dans la navigation
   - ✅ Un badge devrait s'afficher (🆓 ou ⭐)
   - ✅ L'onglet "🛡️ Admin" devrait apparaître

7. **Si erreur "Network Error"** :
   - Vérifiez que `VITE_API_URL` est correctement configurée dans Vercel
   - Vérifiez que le backend Railway est en ligne (logs)
   - Vérifiez la console navigateur pour l'erreur exacte

---

### ÉTAPE 14 : Test du Panel Admin

1. **Cliquez sur "🛡️ Admin"** dans la navigation

2. **Vous devriez voir le dashboard admin** avec :
   - Statistiques globales (utilisateurs, paiements, contenu)
   - Navigation : Users | Products | Content | Payments | Stats

3. **Testez chaque section** :

   **Users Management** :
   - Cliquez sur "Users"
   - Vous devriez voir l'utilisateur admin
   - Testez la recherche : tapez "admin"
   - Testez le filtre : sélectionnez "Admin" dans le rôle
   - Cliquez sur "✏️ Edit" sur l'utilisateur admin
   - Modifiez le prénom, puis cliquez "Save"
   - Vérifiez que la modification est sauvegardée

   **Products Management** :
   - Cliquez sur "Products"
   - Vous devriez voir les 2 plans (Premium et VIP)
   - Cliquez sur "➕ New Product"
   - Essayez de créer un nouveau produit de test
   - Cliquez sur "✏️ Edit" sur un produit existant
   - Modifiez le prix, puis sauvegardez

   **Content Management** :
   - Cliquez sur "Content"
   - Testez les filtres (Level, Type, Category)
   - Essayez de créer un nouveau contenu

   **Payments Dashboard** :
   - Cliquez sur "Payments"
   - Vous devriez voir les statistiques de paiements
   - Testez les filtres de date

4. **Si tout fonctionne** : ✅ Panel admin opérationnel !

---

### ÉTAPE 15 : Test d'Inscription Utilisateur

1. **Déconnectez-vous** :
   - Cliquez sur "🚪 Déconnexion"

2. **Cliquez sur "✨ Inscription"**

3. **Remplissez le formulaire** :
   ```
   Email: test@example.com
   Mot de passe: Test123!@#
   Prénom: Test
   Nom: User
   Telegram: @testuser
   ```

4. **Cliquez sur "S'inscrire"**

5. **Vérifications** :
   - ✅ Message de succès : "Compte créé avec succès"
   - ✅ Redirection automatique vers la page de connexion
   - ✅ Email de vérification envoyé (si SMTP configuré)

6. **Connectez-vous avec le nouveau compte** :
   - Email : `test@example.com`
   - Mot de passe : `Test123!@#`

7. **Si la connexion fonctionne** :
   - ✅ Inscription opérationnelle !
   - ✅ Authentification fonctionnelle !

---

### ÉTAPE 16 : Test du Système de Paiement (Optionnel)

1. **Connecté avec un compte utilisateur**, allez sur "📈 Abonnements"

2. **Cliquez sur "Choisir Premium"**

3. **Vérifications** :
   - Le champ Telegram devrait être pré-rempli
   - Le modal de paiement devrait s'afficher

4. **Pour tester un vrai paiement** :
   - Vous aurez besoin d'une vraie API Key NOWPayments
   - Configurez `NOWPAYMENTS_API_KEY` dans Railway
   - Redéployez le backend

---

## 🔧 PARTIE 5 : CONFIGURATION AVANCÉE (OPTIONNEL)

### ÉTAPE 17 : Configurer Gmail App Password (Pour les Emails)

1. **Allez sur** : https://myaccount.google.com/security

2. **Activez la validation en 2 étapes** (si pas déjà fait) :
   - Cherchez "Validation en 2 étapes"
   - Suivez les instructions

3. **Créez un App Password** :
   - Cherchez "Mots de passe des applications"
   - Cliquez sur "Générer"
   - Nom : "La Sphere Backend"
   - Copiez le mot de passe généré (16 caractères)

4. **Mettez à jour Railway** :
   - Retournez sur Railway
   - Variables → SMTP_PASS
   - Collez le mot de passe d'application
   - Railway va redéployer

5. **Testez l'envoi d'emails** :
   - Créez un nouveau compte sur votre site
   - Vérifiez que vous recevez l'email de vérification

---

### ÉTAPE 18 : Configurer le Webhook NOWPayments

1. **Allez sur** : https://nowpayments.io/dashboard

2. **Settings → IPN Settings**

3. **IPN Callback URL** :
   ```
   https://[votre-url-railway].up.railway.app/api/payment/webhook
   ```

4. **Sauvegardez**

5. **Les paiements seront maintenant automatiquement confirmés**

---

### ÉTAPE 19 : Configurer un Domaine Personnalisé (Optionnel)

#### Sur Vercel (Frontend)

1. **Dans Vercel → Settings → Domains**

2. **Cliquez sur "Add"**

3. **Entrez votre domaine** :
   ```
   lasphere.com
   ```
   Ou
   ```
   www.lasphere.com
   ```

4. **Suivez les instructions** pour configurer les DNS

5. **Une fois validé**, votre site sera accessible sur votre domaine !

#### Sur Railway (Backend)

1. **Dans Railway → Settings → Networking**

2. **Custom Domain**

3. **Ajoutez** :
   ```
   api.lasphere.com
   ```

4. **Configurez le CNAME** dans votre registrar de domaine

5. **Mettez à jour les variables** :
   - Vercel → `VITE_API_URL` = `https://api.lasphere.com/api`
   - Railway → `FRONTEND_URL` = `https://lasphere.com`

---

## 📊 PARTIE 6 : MONITORING ET MAINTENANCE

### ÉTAPE 20 : Configurer les Alertes

#### Vercel

1. **Settings → Notifications**

2. **Activez** :
   - Deployment Failed
   - Deployment Ready

3. **Ajoutez votre email**

#### Railway

1. **Project Settings → Notifications**

2. **Activez** :
   - Deployment Failed
   - Service Crashed

---

### ÉTAPE 21 : Vérifier les Logs Régulièrement

**Railway Backend** :
```
Dashboard → Votre service → Deployments → View Logs
```

**Vercel Frontend** :
```
Dashboard → Votre projet → Deployments → Cliquez sur un déploiement → Build Logs
```

---

## ✅ CHECKLIST FINALE

Cochez chaque élément pour confirmer que tout est opérationnel :

### Frontend Vercel
- [ ] Site accessible sur `https://[votre-projet].vercel.app`
- [ ] Page d'accueil s'affiche correctement
- [ ] Navigation fonctionne (tous les onglets)
- [ ] Pas d'erreurs dans la console navigateur (F12)

### Backend Railway
- [ ] Logs affichent "Server running on port 3001"
- [ ] Pas d'erreurs dans les logs
- [ ] Toutes les variables d'environnement configurées (16 variables)
- [ ] Endpoint API accessible : `https://[votre-backend].railway.app/api/auth/me`

### Authentification
- [ ] Connexion admin fonctionne (admin@lasphere.com / Admin2026!)
- [ ] Header affiche "👋 Admin" après connexion
- [ ] Déconnexion fonctionne
- [ ] Inscription fonctionne (nouveau compte créé)
- [ ] Connexion avec nouveau compte fonctionne

### Panel Admin
- [ ] Onglet "🛡️ Admin" visible (après connexion admin)
- [ ] Dashboard admin s'affiche avec statistiques
- [ ] Users Management : Liste, recherche, modification fonctionnent
- [ ] Products Management : Liste, création, modification fonctionnent
- [ ] Content Management : Liste, filtres fonctionnent
- [ ] Payments Dashboard : Statistiques s'affichent

### Configuration Avancée (Optionnel)
- [ ] Emails de vérification envoyés (SMTP configuré)
- [ ] Webhook NOWPayments configuré
- [ ] Domaine personnalisé configuré (si applicable)

### Tests Complets
- [ ] Inscription → Connexion → Espace Membre fonctionne
- [ ] Paiement test réussi (si NOWPayments configuré)
- [ ] Abonnement mis à jour après paiement
- [ ] Contenu Premium/VIP débloqué selon abonnement

---

## 🎉 FÉLICITATIONS !

Si tous les éléments de la checklist sont cochés, **votre site est 100% opérationnel en production !**

### 🌐 Vos URLs de Production

**Site Public** :
```
https://lasphere.vercel.app
```

**Panel Admin** :
```
https://lasphere.vercel.app → Connexion → 🛡️ Admin
```

**API Backend** :
```
https://[votre-backend].railway.app/api
```

---

## 🆘 EN CAS DE PROBLÈME

### Problème 1 : "Network Error" lors de la connexion

**Cause** : Frontend ne peut pas joindre le backend

**Solutions** :
1. Vérifiez que Railway est bien démarré (onglet Logs)
2. Vérifiez `VITE_API_URL` dans Vercel Settings → Environment Variables
3. Testez l'URL backend directement dans le navigateur
4. Vérifiez la console navigateur pour l'erreur exacte

### Problème 2 : Erreur CORS dans la console

**Cause** : `FRONTEND_URL` mal configurée dans Railway

**Solutions** :
1. Railway → Variables → Vérifiez `FRONTEND_URL`
2. Doit être exactement votre URL Vercel (sans trailing slash)
3. Redéployez le backend après modification

### Problème 3 : Backend ne démarre pas

**Cause** : Variables d'environnement manquantes ou Root Directory incorrect

**Solutions** :
1. Vérifiez Settings → Root Directory = `backend`
2. Vérifiez que toutes les 16 variables sont présentes
3. Consultez les logs pour l'erreur exacte
4. Vérifiez Start Command = `npm start`

### Problème 4 : "Cannot find module" dans les logs Railway

**Cause** : Dépendances non installées

**Solutions** :
1. Railway → Settings → Start Command
2. Changez en : `npm install && npm start`
3. Redéployez

### Problème 5 : Panel admin ne s'affiche pas

**Cause** : Utilisateur n'est pas admin

**Solutions** :
1. Connectez-vous avec admin@lasphere.com / Admin2026!
2. Vérifiez dans Railway → database.json que user.role = "admin"

---

## 📞 SUPPORT

**Documentation** :
- DEPLOIEMENT_VERCEL.md (guide détaillé)
- ACTION_RAPIDE_DEPLOIEMENT.md (checklist rapide)
- GUIDE_DEMARRAGE.md (développement local)

**Logs en Direct** :
- Vercel : https://vercel.com/dashboard
- Railway : https://railway.app/dashboard

**Ressources Officielles** :
- Vercel Docs : https://vercel.com/docs
- Railway Docs : https://docs.railway.app

---

## 📝 PROCHAINES ÉTAPES RECOMMANDÉES

1. **Sécurité** :
   - Changer `JWT_SECRET` en production (générer une clé aléatoire)
   - Activer HTTPS strict
   - Configurer rate limiting

2. **Performance** :
   - Activer le cache Vercel
   - Optimiser les images
   - Mettre en place un CDN

3. **Monitoring** :
   - Intégrer Sentry pour le tracking d'erreurs
   - Configurer Google Analytics
   - Mettre en place des alertes email

4. **Base de Données** :
   - Migrer de database.json vers PostgreSQL
   - Configurer des backups automatiques
   - Mettre en place une stratégie de backup

5. **Contenu** :
   - Ajouter des formations via le panel admin
   - Créer du contenu Premium et VIP
   - Configurer les webhooks Telegram

---

**Créé par CRYPTOJEREM - La Sphere © 2026**

*Guide mis à jour : Commit 4d65dbf*
*Support : Consultez DEPLOIEMENT_VERCEL.md pour plus de détails*
