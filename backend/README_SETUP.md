# 🚀 Configuration Backend La Sphere

Ce guide vous explique comment configurer le système d'automatisation complet pour les paiements crypto et l'ajout automatique au groupe Telegram VIP.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration NOWPayments](#1-configuration-nowpayments)
3. [Configuration Telegram Bot](#2-configuration-telegram-bot)
4. [Installation Backend](#3-installation-backend)
5. [Configuration des variables](#4-configuration-des-variables)
6. [Démarrage](#5-démarrage)
7. [Tests](#6-tests)
8. [Déploiement Production](#7-déploiement-production)

---

## Prérequis

- Node.js v16+ installé
- Un compte NOWPayments (https://nowpayments.io)
- Un groupe Telegram privé
- Accès à Telegram pour créer un bot

---

## 1. Configuration NOWPayments

### Étape 1.1 : Créer un compte NOWPayments

1. Allez sur https://nowpayments.io
2. Créez un compte (Sign Up)
3. Vérifiez votre email

### Étape 1.2 : Obtenir l'API Key

1. Connectez-vous à votre tableau de bord NOWPayments
2. Allez dans **Settings** > **API Keys**
3. Cliquez sur **Generate API Key**
4. Copiez la clé API (format: `M8JY07X-F3K4XRV-HPPH9DT-JWEXJZD`)
5. **Conservez cette clé en sécurité !**

### Étape 1.3 : Créer un IPN Secret

1. Dans le tableau de bord NOWPayments, allez dans **Settings**
2. Section **IPN (Instant Payment Notification)**
3. Cliquez sur **Generate IPN Secret Key**
4. Copiez la clé secrète
5. **Conservez cette clé en sécurité !**

### Étape 1.4 : Configurer l'URL de Callback

1. Dans **Settings** > **IPN Settings**
2. Ajoutez votre URL de callback : `https://nowpayments.io/payment/?iid=6377414178`
3. ⚠️ Pour le développement local, utilisez ngrok (voir section Déploiement)

### Étape 1.5 : Créer un lien de paiement (Invoice)

1. Allez dans **Settings** > **Invoice**
2. Notez votre **Invoice ID** (format: `6377414178`)
3. C'est celui utilisé dans le HTML du bouton NOWPayments

---

## 2. Configuration Telegram Bot

### Étape 2.1 : Créer un Bot Telegram

1. Ouvrez Telegram et cherchez **@BotFather**
2. Envoyez `/newbot`
3. Choisissez un nom (ex: `La Sphere VIP Bot`)
4. Choisissez un username (ex: `lasphere_vip_bot`)
5. **Copiez le Token** fourni (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Étape 2.2 : Créer le groupe Telegram VIP

1. Dans Telegram, créez un nouveau groupe
2. Nommez-le (ex: `La Sphere VIP`)
3. Configurez-le en **Groupe Privé**

### Étape 2.3 : Ajouter le Bot au groupe

1. Dans votre groupe VIP, cliquez sur le nom du groupe
2. Cliquez sur **Add Members**
3. Cherchez votre bot (`@lasphere_vip_bot`)
4. Ajoutez-le au groupe

### Étape 2.4 : Donner les permissions au Bot

1. Dans le groupe, cliquez sur le nom du groupe
2. Cliquez sur **Edit**
3. Allez dans **Administrators**
4. Ajoutez votre bot comme administrateur
5. Activez les permissions suivantes :
   - ✅ **Invite Users via Link**
   - ✅ **Add New Members**
   - Désactivez le reste

### Étape 2.5 : Obtenir l'ID du groupe

**Méthode 1 - Avec @getidsbot :**
1. Ajoutez **@getidsbot** à votre groupe VIP
2. Le bot vous donnera l'ID du groupe (format: `-1001234567890`)
3. Copiez cet ID
4. Retirez @getidsbot du groupe

**Méthode 2 - Via l'API Telegram :**
```bash
curl https://api.telegram.org/bot<VOTRE_BOT_TOKEN>/getUpdates
```

---

## 3. Installation Backend

### Étape 3.1 : Naviguer vers le dossier backend

```bash
cd d:\Github\CNAME\backend
```

### Étape 3.2 : Installer les dépendances

```bash
npm install
```

---

## 4. Configuration des variables

### Étape 4.1 : Ouvrir server.js

Ouvrez le fichier `backend/server.js` dans votre éditeur

### Étape 4.2 : Remplacer les variables CONFIG

Trouvez la section `CONFIG` (lignes 14-25) et remplacez :

```javascript
const CONFIG = {
    // ⬇️ Remplacer par votre API Key NOWPayments
    NOWPAYMENTS_API_KEY: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',

    // ⬇️ Remplacer par votre IPN Secret NOWPayments
    NOWPAYMENTS_IPN_SECRET: 'votre_ipn_secret_key_ici',

    // ⬇️ Remplacer par votre Bot Token Telegram
    TELEGRAM_BOT_TOKEN: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',

    // ⬇️ Remplacer par l'ID de votre groupe Telegram VIP
    TELEGRAM_VIP_GROUP_ID: '-1001234567890',

    // URL de votre site (localhost en dev, votre domaine en prod)
    SITE_URL: 'http://localhost:5175'
};
```

### Exemple de configuration complète :

```javascript
const CONFIG = {
    NOWPAYMENTS_API_KEY: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NOWPAYMENTS_IPN_SECRET: 'secret_abc123xyz789',
    TELEGRAM_BOT_TOKEN: '987654321:AAHBbC1dEfGhIjKlMnOpQrStUvWxYz12345',
    TELEGRAM_VIP_GROUP_ID: '-1001987654321',
    SITE_URL: 'http://localhost:5175'
};
```

---

## 5. Démarrage

### Étape 5.1 : Démarrer le backend

```bash
npm start
```

Vous devriez voir :

```
╔═══════════════════════════════════════════════════╗
║   🚀 Backend La Sphere démarré sur port 3001     ║
╚═══════════════════════════════════════════════════╝

📝 Configuration requise:
   - API Key NOWPayments: ✅ Configurée
   - IPN Secret: ✅ Configuré
   - Bot Telegram Token: ✅ Configuré
   - Groupe VIP ID: ✅ Configuré
```

### Étape 5.2 : Vérifier que tout est configuré

Si vous voyez des ❌, c'est que des variables ne sont pas configurées.

---

## 6. Tests

### Test 1 : Backend accessible

```bash
curl http://localhost:3001/api/payments
```

Devrait retourner : `{"payments":[]}`

### Test 2 : Créer un paiement test

Allez sur votre site : http://localhost:5175
1. Cliquez sur **Abonnements**
2. Choisissez un plan (Premium ou VIP)
3. Entrez votre pseudo Telegram (ex: `@votre_pseudo`)
4. Cliquez sur **Payer avec Crypto**

Une page NOWPayments devrait s'ouvrir !

### Test 3 : Vérifier les logs backend

Dans le terminal du backend, vous devriez voir :
```
✅ Paiement créé: 123456 pour @votre_pseudo
```

### Test 4 : Paiement complet (en sandbox)

1. Configurez NOWPayments en **Sandbox Mode** dans les settings
2. Effectuez un paiement test
3. Le webhook devrait se déclencher
4. Vous devriez recevoir un message du bot Telegram avec le lien d'invitation

---

## 7. Déploiement Production

### Option 1 : Déployer sur Heroku

1. Créez un compte Heroku : https://heroku.com
2. Installez Heroku CLI
3. Déployez :

```bash
cd backend
heroku create lasphere-backend
git init
git add .
git commit -m "Initial backend"
git push heroku master
```

4. Configurez les variables d'environnement :

```bash
heroku config:set NOWPAYMENTS_API_KEY=votre_api_key
heroku config:set NOWPAYMENTS_IPN_SECRET=votre_secret
heroku config:set TELEGRAM_BOT_TOKEN=votre_token
heroku config:set TELEGRAM_VIP_GROUP_ID=votre_group_id
```

5. Mettez à jour `SITE_URL` avec votre domaine Heroku

### Option 2 : Utiliser ngrok (pour tests locaux)

1. Téléchargez ngrok : https://ngrok.com
2. Démarrez ngrok :

```bash
ngrok http 3001
```

3. Copiez l'URL HTTPS fournie (ex: `https://abc123.ngrok.io`)
4. Mettez à jour cette URL dans :
   - `server.js` → `SITE_URL`
   - NOWPayments Settings → IPN Callback URL : `https://abc123.ngrok.io/api/nowpayments-webhook`

### Option 3 : VPS (DigitalOcean, AWS, etc.)

1. Louez un VPS
2. Installez Node.js
3. Clonez votre projet
4. Configurez PM2 pour garder le serveur actif :

```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

---

## 🔐 Sécurité

⚠️ **IMPORTANT** :
- Ne commitez JAMAIS vos clés API dans Git
- Utilisez des variables d'environnement en production
- Gardez votre IPN Secret confidentiel
- Vérifiez toujours la signature des webhooks
- Utilisez HTTPS en production

---

## 📊 Suivi des paiements

### Voir tous les paiements

```bash
curl http://localhost:3001/api/payments
```

### Base de données

Les paiements sont stockés dans `backend/payments.json`

Structure :
```json
{
  "payments": [
    {
      "paymentId": "123456",
      "orderId": "premium-1234567890",
      "planId": "premium",
      "planName": "⭐ PREMIUM",
      "price": 29.99,
      "telegramUsername": "username",
      "invoiceUrl": "https://nowpayments.io/payment/...",
      "status": "completed",
      "telegramAdded": true,
      "createdAt": "2026-02-07T18:30:00.000Z",
      "updatedAt": "2026-02-07T18:35:00.000Z"
    }
  ]
}
```

---

## ❓ Problèmes courants

### Erreur : "Cannot read property..."

✅ Vérifiez que toutes les variables CONFIG sont bien remplies

### Le bot ne répond pas

✅ Vérifiez le token du bot
✅ Assurez-vous que le bot est admin du groupe

### Webhook non reçu

✅ Vérifiez l'URL de callback dans NOWPayments
✅ Utilisez ngrok si vous êtes en local
✅ Vérifiez les logs backend

### Utilisateur non ajouté au groupe

✅ Vérifiez que le pseudo Telegram est correct
✅ Assurez-vous que l'utilisateur a démarré une conversation avec le bot (envoyez-lui `/start`)
✅ Vérifiez les permissions du bot dans le groupe

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du backend
2. Testez chaque étape une par une
3. Vérifiez la console du navigateur pour les erreurs

---

## ✅ Checklist finale

- [ ] API Key NOWPayments configurée
- [ ] IPN Secret configuré
- [ ] Bot Telegram créé
- [ ] Bot ajouté au groupe VIP avec permissions admin
- [ ] ID du groupe récupéré
- [ ] Token bot configuré
- [ ] Variables CONFIG remplies
- [ ] `npm install` exécuté
- [ ] Backend démarré (`npm start`)
- [ ] Test de paiement effectué
- [ ] Webhook fonctionne
- [ ] Ajout automatique Telegram testé

---

🎉 **Félicitations ! Votre système de paiement automatisé est prêt !**
