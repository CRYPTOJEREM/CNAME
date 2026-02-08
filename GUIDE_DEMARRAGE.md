# 🚀 Guide de Démarrage - La Sphere

## Démarrage Rapide

### Option 1 : Démarrage Automatique (Recommandé)

Double-cliquez sur le fichier **`START_LASPHERE.bat`** à la racine du projet.

Cela va démarrer automatiquement :
- ✅ Backend (Port 3001)
- ✅ Frontend (Port 5174)

### Option 2 : Démarrage Manuel

#### 1. Démarrer le Backend
```bash
cd backend
npm start
```

#### 2. Démarrer le Frontend
```bash
npm run dev
```

## 🔐 Identifiants Admin

**Email:** `admin@lasphere.com`
**Mot de passe:** `Admin2026!`

## 🌐 URLs d'accès

- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:3001
- **Panel Admin:** http://localhost:5174 (cliquer sur "🛡️ Admin" après connexion)

## 📋 Fonctionnalités disponibles

### Pour les visiteurs (non connectés)
- ✅ Voir le dashboard crypto en temps réel
- ✅ Consulter le calendrier économique
- ✅ Lire les actualités crypto
- ✅ Voir les formations gratuites (floues si non connecté)
- ✅ S'inscrire et créer un compte
- ✅ Se connecter

### Pour les membres (connectés)
- ✅ Accès complet aux formations gratuites
- ✅ Espace membre personnel
- ✅ Voir son profil et abonnement
- ✅ Souscrire à Premium ou VIP
- ✅ Accéder au contenu selon son niveau

### Pour les admins (role: admin)
- ✅ **Panel d'administration complet**
- ✅ Gestion des utilisateurs (CRUD, recherche, filtres)
- ✅ Gestion des produits/abonnements (CRUD)
- ✅ Gestion du contenu (formations, vidéos, articles)
- ✅ Dashboard des paiements et statistiques
- ✅ Vue globale de toutes les données

## 🛑 Arrêter les services

Double-cliquez sur **`STOP_LASPHERE.bat`** pour arrêter proprement tous les services.

## 👤 Inscription de nouveaux utilisateurs

Les utilisateurs peuvent s'inscrire via le bouton **"✨ Inscription"** en haut à droite.

**Note importante :**
- La vérification d'email est optionnelle en développement
- Les utilisateurs peuvent se connecter immédiatement après inscription
- Pour activer les emails en production, configurez les variables SMTP dans `backend/.env`

## ⚙️ Configuration Email (Optionnel)

Pour activer l'envoi d'emails de vérification :

1. Créez un App Password Gmail : https://myaccount.google.com/apppasswords
2. Modifiez `backend/.env` :
```env
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-app-password-16-caracteres
```
3. Redémarrez le backend

## 💳 Configuration Paiements (Optionnel)

Pour activer les paiements crypto via NOWPayments :

1. Créez un compte sur https://nowpayments.io
2. Modifiez `backend/.env` :
```env
NOWPAYMENTS_API_KEY=votre-api-key
NOWPAYMENTS_IPN_SECRET=votre-ipn-secret
```
3. Redémarrez le backend

## 📱 Configuration Telegram (Optionnel)

Pour l'ajout automatique au groupe Telegram VIP :

1. Créez un bot avec @BotFather sur Telegram
2. Ajoutez le bot comme admin dans votre groupe VIP
3. Modifiez `backend/.env` :
```env
TELEGRAM_BOT_TOKEN=votre-bot-token
TELEGRAM_VIP_GROUP_ID=votre-group-id
```
4. Redémarrez le backend

## 🔧 Dépannage

### Le backend ne démarre pas
```bash
cd backend
npm install
npm start
```

### Le frontend ne démarre pas
```bash
npm install
npm run dev
```

### Erreur "Network Error" lors de la connexion
- Vérifiez que le backend tourne sur port 3001
- Vérifiez que `backend/.env` contient `FRONTEND_URL=http://localhost:5174`

### Impossible d'accéder au panel admin
- Vérifiez que vous êtes connecté avec le compte admin
- Vérifiez que l'utilisateur a bien `"role": "admin"` dans `backend/database.json`

## 📂 Structure du Projet

```
CNAME/
├── backend/               # API Express
│   ├── server.js         # Point d'entrée backend
│   ├── database.json     # Base de données (développement)
│   ├── .env              # Variables d'environnement
│   ├── routes/           # Routes API
│   │   ├── auth.routes.js    # Authentification
│   │   ├── member.routes.js  # Espace membre
│   │   └── admin.routes.js   # Panel admin
│   ├── middleware/       # Middlewares
│   └── services/         # Services métier
│
├── src/                  # Frontend React
│   ├── App.jsx           # Point d'entrée frontend
│   ├── components/       # Composants React
│   │   ├── admin/        # Panel admin
│   │   ├── auth/         # Authentification
│   │   ├── member/       # Espace membre
│   │   └── common/       # Composants réutilisables
│   ├── contexts/         # Contexts React
│   ├── services/         # Services API
│   └── index.css         # Styles globaux
│
├── START_LASPHERE.bat    # Démarrage automatique
└── STOP_LASPHERE.bat     # Arrêt propre
```

## 🆘 Support

Pour toute question ou problème :
- Consultez ce guide
- Vérifiez les logs du backend et frontend
- Assurez-vous que tous les services sont démarrés

---

**Créé par CRYPTOJEREM - La Sphere © 2026**
