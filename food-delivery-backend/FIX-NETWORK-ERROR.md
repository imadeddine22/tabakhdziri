# 🚨 ERREUR RÉSEAU - Frontend ne peut pas se connecter au Backend

## Problème Identifié
❌ **Backend ne fonctionne PAS sur le port 5000**
❌ Frontend essaie de se connecter à `http://localhost:5000/api`
❌ Network Error lors de l'inscription/connexion

## Cause Racine
Le backend ne démarre pas car **MongoDB ne peut pas se connecter** (IP non autorisée).

---

## ✅ SOLUTION COMPLÈTE

### Étape 1: Autoriser Votre IP dans MongoDB Atlas

**C'est LA raison pour laquelle votre backend ne démarre pas !**

1. Allez sur: https://cloud.mongodb.com/
2. Connectez-vous
3. Cliquez **"Network Access"** (menu gauche)
4. Cliquez **"ADD IP ADDRESS"**
5. Choisissez **"ALLOW ACCESS FROM ANYWHERE"**
6. Confirmez et attendez 1-2 minutes

📖 **Guide détaillé**: Lisez `FIX-IP-MONGODB.md`

---

### Étape 2: Vérifier que MongoDB se Connecte

```bash
# Dans le terminal backend
node test-mongodb.js
```

**Résultat attendu:**
```
✅ SUCCESS! MongoDB Connected
📊 Database: food_delivery
```

**Si ça échoue:**
- Relisez `FIX-IP-MONGODB.md`
- Vérifiez que vous avez bien autorisé l'IP
- Attendez 2 minutes complètes

---

### Étape 3: Redémarrer le Backend

#### Option A: Si le terminal backend tourne déjà
1. Appuyez sur `Ctrl+C` pour arrêter
2. Relancez: `npm run dev`

#### Option B: Nouveau terminal
```bash
cd c:\Users\DELL\Desktop\food-delivery-backend
npm run dev
```

**Vous devriez voir:**
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
```

---

### Étape 4: Tester la Connexion Backend

```bash
# Dans un nouveau terminal
curl http://localhost:5000/api/health
```

**Résultat attendu:**
```json
{
  "success": true,
  "message": "Tabakh Dziri API is running"
}
```

---

### Étape 5: Tester l'Inscription Frontend

1. Ouvrez: http://localhost:3000/inscription
2. Remplissez le formulaire
3. Cliquez "S'inscrire"
4. ✅ Ça devrait fonctionner !

---

## 🔍 Diagnostic Rapide

### Backend fonctionne-t-il ?

```bash
# PowerShell
Test-NetConnection -ComputerName localhost -Port 5000
```

**Si "TcpTestSucceeded : True"** ✅ Backend fonctionne
**Si "TcpTestSucceeded : False"** ❌ Backend ne fonctionne pas

---

## 📋 Checklist Complète

- [ ] IP autorisée dans MongoDB Atlas (0.0.0.0/0)
- [ ] Attendu 1-2 minutes après avoir autorisé l'IP
- [ ] `node test-mongodb.js` affiche "SUCCESS"
- [ ] Backend redémarré avec `npm run dev`
- [ ] Backend affiche "MongoDB Connected"
- [ ] Backend affiche "Server running on port 5000"
- [ ] `curl http://localhost:5000/api/health` fonctionne
- [ ] Frontend peut s'inscrire/se connecter

---

## ⚠️ Problèmes Courants

### 1. Backend dit "MongoDB Connection Error"
**Solution:** Autorisez votre IP dans MongoDB Atlas (Étape 1)

### 2. Backend dit "EADDRINUSE" (Port déjà utilisé)
**Solution:**
```bash
# Windows - Tuer le processus sur le port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### 3. Frontend dit toujours "Network Error"
**Vérifiez:**
- Backend fonctionne sur port 5000
- Pas de firewall/antivirus qui bloque
- `.env` du frontend contient: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

---

## 🎯 Résumé des URLs

| Service | URL | Vérification |
|---------|-----|--------------|
| Backend | http://localhost:5000 | `curl http://localhost:5000/api/health` |
| Frontend | http://localhost:3000 | Ouvrir dans navigateur |
| MongoDB | Atlas Cloud | Network Access autorisé |

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

### Logs Backend Détaillés

1. Arrêtez le backend (Ctrl+C)
2. Lancez avec logs complets:
```bash
NODE_ENV=development npm run dev
```

3. Partagez les erreurs que vous voyez

### Variables d'Environnement

Vérifiez votre `.env` du backend:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=votre_secret_jwt
```

---

✅ **Après avoir suivi ces étapes dans l'ordre, tout devrait fonctionner !**

**Commencez par l'Étape 1** (autoriser l'IP) - c'est le problème principal ! 🎯
