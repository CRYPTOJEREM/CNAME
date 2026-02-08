# 🤖 Configuration du Bot Telegram La Sphere

Ce guide vous explique comment créer et configurer votre bot Telegram pour La Sphere.

## 📋 Table des matières

1. [Créer le bot avec BotFather](#1-créer-le-bot-avec-botfather)
2. [Créer le groupe VIP](#2-créer-le-groupe-vip)
3. [Configurer le fichier .env](#3-configurer-le-fichier-env)
4. [Tester le bot](#4-tester-le-bot)
5. [Commandes disponibles](#5-commandes-disponibles)

---

## 1. Créer le bot avec BotFather

### Étape 1.1 : Ouvrir BotFather
1. Ouvrez Telegram
2. Recherchez **@BotFather** (le bot officiel avec une coche bleue)
3. Démarrez une conversation avec `/start`

### Étape 1.2 : Créer le bot
```
Vous: /newbot
BotFather: Alright, a new bot. How are we going to call it? Please choose a name for your bot.

Vous: La Sphere VIP Bot
BotFather: Good. Now let's choose a username for your bot. It must end in `bot`. Like this, for example: TetrisBot or tetris_bot.

Vous: LaSphereVIP_bot
BotFather: Done! Congratulations on your new bot. You will find it at t.me/LaSphereVIP_bot. You can now add a description...

Here is your token: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

⚠️ **IMPORTANT** : Copiez et sauvegardez le token ! Vous en aurez besoin pour la configuration.

### Étape 1.3 : Configurer le bot
```
/setdescription
Sélectionnez votre bot
Entrez: Bot officiel de La Sphere - Accès VIP, formations et signaux de trading crypto

/setabouttext
Sélectionnez votre bot
Entrez: Bienvenue sur le bot La Sphere ! Accédez à votre espace VIP, consultez vos formations et recevez des signaux de trading en temps réel.

/setuserpic
Sélectionnez votre bot
Envoyez une image (logo de La Sphere)
```

### Étape 1.4 : Configurer les commandes du bot
```
/setcommands
Sélectionnez votre bot
Copiez-collez ceci :
```

```
start - 🌐 Message d'accueil
help - 📚 Liste des commandes
status - ✅ Vérifier votre abonnement
abonnements - 💎 Voir les plans disponibles
support - 💬 Contacter le support
moncompte - 👤 Accéder à votre espace membre
formations - 📚 Voir les formations (VIP)
signaux - 📊 Signaux de trading (VIP)
analyse - 📈 Analyse de marché (VIP)
stats - 📊 Statistiques (Admin)
check - 🔍 Vérifier un utilisateur (Admin)
```

---

## 2. Créer le groupe VIP

### Étape 2.1 : Créer un groupe
1. Dans Telegram, appuyez sur ☰ → **Nouveau groupe**
2. Nommez-le : **La Sphere VIP** 🌐💎
3. Ajoutez votre bot au groupe : recherchez `@LaSphereVIP_bot` et ajoutez-le
4. Créez le groupe

### Étape 2.2 : Promouvoir le bot en administrateur
1. Ouvrez le groupe
2. Tapez sur le nom du groupe en haut
3. Allez dans **Administrateurs** → **Ajouter un administrateur**
4. Sélectionnez votre bot
5. Activez ces permissions :
   - ✅ Supprimer les messages
   - ✅ Bannir des utilisateurs
   - ✅ Inviter des utilisateurs via un lien
   - ✅ Épingler des messages
   - ✅ Gérer les appels vocaux
6. Cliquez sur ✅ pour confirmer

### Étape 2.3 : Obtenir l'ID du groupe

**Méthode 1 : Avec un bot**
1. Ajoutez le bot **@GetIDsBot** à votre groupe
2. Le bot vous donnera automatiquement l'ID du groupe
3. Format : `-1001234567890` (commence toujours par `-100`)

**Méthode 2 : Avec le lien d'invitation**
1. Dans le groupe, allez dans **⋯ → Lien d'invitation**
2. Créez un lien public
3. Le lien ressemble à : `https://t.me/joinchat/AbCdEfGhIjKlMnOpQr`
4. Utilisez un bot pour convertir ce lien en ID

### Étape 2.4 : Configurer le groupe (optionnel)
1. **Photo de groupe** : Ajoutez le logo de La Sphere
2. **Description** :
```
💎 Groupe VIP La Sphere

Bienvenue dans notre communauté exclusive !

Ici vous avez accès à :
• 📊 Signaux de trading en temps réel
• 📈 Analyses de marché quotidiennes
• 📚 Formations exclusives
• 💬 Support VIP prioritaire

Commandes utiles :
/help - Voir toutes les commandes
/signaux - Signaux du jour
/analyse - Analyse de marché
/formations - Accéder aux formations

🌐 Site web : votre-site.com
```

---

## 3. Configurer le fichier .env

Ouvrez le fichier `backend/.env` et modifiez ces lignes :

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_VIP_GROUP_ID=-1001234567890
```

Remplacez :
- `TELEGRAM_BOT_TOKEN` : Le token que BotFather vous a donné
- `TELEGRAM_VIP_GROUP_ID` : L'ID de votre groupe VIP (commence par `-100`)

⚠️ **IMPORTANT** : Ne partagez JAMAIS votre token ! C'est comme un mot de passe.

---

## 4. Tester le bot

### Étape 4.1 : Redémarrer le backend

Si le backend tourne déjà, arrêtez-le et redémarrez :

```bash
cd backend
node server.js
```

Vous devriez voir :
```
✅ Bot Telegram démarré avec succès
🚀 Backend La Sphere démarré sur port 3001
```

### Étape 4.2 : Tester en privé

1. Recherchez votre bot sur Telegram : `@LaSphereVIP_bot`
2. Démarrez une conversation : `/start`
3. Le bot devrait répondre avec un message de bienvenue
4. Testez quelques commandes :
   - `/help` - Liste des commandes
   - `/abonnements` - Voir les plans
   - `/status` - Vérifier votre statut

### Étape 4.3 : Tester dans le groupe

1. Allez dans votre groupe VIP
2. Tapez `/help` - Le bot devrait répondre
3. Testez les commandes VIP :
   - `/signaux` - Signaux de trading
   - `/analyse` - Analyse de marché
   - `/formations` - Formations disponibles

### Étape 4.4 : Tester l'ajout automatique

1. Créez un compte sur votre site
2. Effectuez un paiement test (avec NOWPayments en mode sandbox)
3. Une fois le paiement confirmé, le bot devrait :
   - ✅ Envoyer un message privé avec le lien d'invitation
   - ✅ Le lien expire dans 24h
   - ✅ L'utilisateur peut rejoindre le groupe

---

## 5. Commandes disponibles

### 👤 Commandes Utilisateur

| Commande | Description |
|----------|-------------|
| `/start` | Message d'accueil du bot |
| `/help` | Affiche toutes les commandes |
| `/status` | Vérifie le statut de votre abonnement |
| `/abonnements` | Voir les plans Premium et VIP |
| `/support` | Contacter le support |
| `/moncompte` | Lien vers votre espace membre |

### 💎 Commandes VIP (dans le groupe uniquement)

| Commande | Description |
|----------|-------------|
| `/formations` | Accéder aux formations exclusives |
| `/signaux` | Recevoir les signaux de trading du jour |
| `/analyse` | Voir l'analyse de marché quotidienne |

### ⚙️ Commandes Admin

| Commande | Description |
|----------|-------------|
| `/stats` | Statistiques du groupe et des paiements |
| `/check @username` | Vérifier le statut d'un utilisateur |
| `/broadcast` | Envoyer un message à tous (à implémenter) |

---

## 🔧 Dépannage

### Le bot ne répond pas
1. Vérifiez que le backend est démarré
2. Vérifiez le `TELEGRAM_BOT_TOKEN` dans `.env`
3. Regardez les logs du serveur pour voir les erreurs

### Le bot ne peut pas inviter d'utilisateurs
1. Vérifiez que le bot est **administrateur** du groupe
2. Vérifiez qu'il a la permission "Inviter des utilisateurs via un lien"
3. Vérifiez le `TELEGRAM_VIP_GROUP_ID` dans `.env`

### L'utilisateur ne reçoit pas le message
1. L'utilisateur doit avoir démarré une conversation avec le bot (`/start`)
2. Vérifiez que le pseudo Telegram est correct (sans le `@`)
3. L'utilisateur doit avoir activé les messages de bots dans ses paramètres

### Erreur "Chat not found"
- Le `TELEGRAM_VIP_GROUP_ID` est incorrect
- Assurez-vous qu'il commence par `-100`

---

## 🔗 Liens utiles

- **BotFather** : https://t.me/botfather
- **Documentation Telegram Bots** : https://core.telegram.org/bots
- **Documentation Telegraf (bibliothèque Node.js)** : https://telegraf.js.org/
- **Obtenir l'ID d'un groupe** : https://t.me/getidsbot

---

## 🚀 Prochaines étapes

Une fois le bot configuré et testé :

1. **Personnalisez les messages** dans `backend/services/telegramBot.js`
2. **Ajoutez votre logo** comme photo de profil du bot
3. **Configurez des règles** dans le groupe VIP
4. **Créez du contenu** pour les commandes `/signaux` et `/analyse`
5. **Testez le flow complet** : inscription → paiement → ajout au groupe

---

## 📞 Support

Si vous avez des questions ou des problèmes, n'hésitez pas à consulter :
- La documentation Telegram : https://core.telegram.org/bots/faq
- Les logs du serveur : ils contiennent des informations détaillées sur les erreurs

Bon setup ! 🚀
