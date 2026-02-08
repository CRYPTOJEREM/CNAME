# 🚀 DÉMARRAGE LA SPHERE

## ✅ Démarrage Automatique

**Double-cliquez sur** `DEMARRER.bat`

Cela va :
1. Arrêter tous les processus Node existants
2. Démarrer le backend sur port 3001
3. Démarrer le frontend sur port 5173

Attendez 10 secondes que tout démarre.

## 🔐 Connexion Admin

```
Email     : admin@lasphere.com
Mot de passe : Admin@2026
```

## 📋 Vérification

1. Ouvrez : http://localhost:5173
2. Cliquez sur "Apprentissage"
3. Vous devriez voir 2 modules gratuits :
   - 🎥 Introduction au Trading Crypto
   - 📄 Comprendre la Blockchain

4. Cliquez sur un module → Modal de connexion
5. Connectez-vous avec les identifiants admin

## ❌ Si ça ne fonctionne pas

### Redémarrage Manuel

**Terminal 1 - Backend :**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend :**
```bash
npm run dev
```

### Vérifier que tout fonctionne

1. Backend API : http://localhost:3001
2. Contenu gratuit : http://localhost:3001/api/public/content
3. Frontend : http://localhost:5173

## 📞 Support

Si vous voyez toujours "Network Error", vérifiez :
- Le backend tourne bien (voir Terminal 1)
- Le frontend tourne bien (voir Terminal 2)
- Actualisez la page (F5)
