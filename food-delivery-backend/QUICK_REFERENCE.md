# ⚡ Quick Reference - Render Settings

## 🎯 إعدادات Render (نسخ ولصق مباشرة)

### Basic Configuration

```
Name: tabakh-dziri-backend
Environment: Node
Region: Frankfurt (أو Amsterdam)
Branch: main
Root Directory: food-delivery-backend
```

### Build & Deploy

```
Build Command: npm install
Start Command: npm start
Auto-Deploy: Yes
```

### Environment Variables (أضف كل واحد على حدة)

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?retryWrites=true&w=majority
JWT_SECRET=[your-32-character-secret-key]
FRONTEND_URL=https://[your-frontend].vercel.app
```

## 📝 استبدل القيم بين الأقواس المربعة `[]`

### مثال MongoDB URI:
```
mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/tabakhdziri?retryWrites=true&w=majority
```

### مثال JWT_SECRET (يجب أن يكون 32+ حرف):
```
tabakh-dziri-super-secret-jwt-key-2026-production
```

### مثال Frontend URL:
```
https://tabakhdziri.vercel.app
```

## ✅ روابط الاختبار (بعد النشر)

استبدل `[your-app-name]` باسم تطبيقك على Render:

### 1. Root Route:
```
https://[your-app-name].onrender.com/
```

### 2. Health Check:
```
https://[your-app-name].onrender.com/api/health
```

### 3. Products API:
```
https://[your-app-name].onrender.com/api/products
```

## 🔧 MongoDB Atlas - Network Access

1. اذهب إلى: https://cloud.mongodb.com/
2. Network Access → Add IP Address
3. أدخل: `0.0.0.0/0`
4. Description: `Allow from Render`
5. احفظ

## ⚠️ الأخطاء الشائعة

| الخطأ | السبب | الحل |
|-------|-------|------|
| 503 | Root Directory خطأ | `food-delivery-backend` |
| 503 | Start command خطأ | `npm start` |
| Database error | IP not allowed | أضف `0.0.0.0/0` في MongoDB |
| CORS error | Frontend URL خطأ | تحقق من `FRONTEND_URL` |

## 📋 Checklist سريع

- [ ] Root Directory = `food-delivery-backend`
- [ ] Start Command = `npm start`
- [ ] جميع Environment Variables موجودة
- [ ] MongoDB Network Access = `0.0.0.0/0`
- [ ] Git push تم بنجاح

---

💡 **نصيحة:** احفظ هذا الملف كمرجع سريع!
