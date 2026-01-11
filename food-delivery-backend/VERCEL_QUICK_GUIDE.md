# ⚡ Quick Guide - Vercel Backend Deployment

## 🎯 الإعدادات (نسخ ولصق مباشرة)

### في Vercel Dashboard

#### 1️⃣ Project Settings:
```
Framework Preset:    Other
Root Directory:      food-delivery-backend
Build Command:       (leave empty)
Output Directory:    (leave empty)
Install Command:     npm install
```

#### 2️⃣ Environment Variables:

أضف واحدة تلو الأخرى:

```
NODE_ENV=production

MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?retryWrites=true&w=majority

JWT_SECRET=[your-32-character-secret]

FRONTEND_URL=https://[your-frontend].vercel.app
```

---

## 📝 مثال كامل:

### MongoDB URI:
```
mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/tabakhdziri?retryWrites=true&w=majority
```

### JWT Secret (32+ characters):
```
tabakh-dziri-jwt-secret-production-2026
```

### Frontend URL:
```
https://tabakhdziri.vercel.app
```

---

## ✅ روابط الاختبار

استبدل `[your-app]` باسم تطبيقك:

```
https://[your-app].vercel.app/
https://[your-app].vercel.app/api/health
https://[your-app].vercel.app/api/products
```

---

## 🚀 خطوات سريعة:

1. ✅ رفع التعديلات إلى GitHub (تم!)
2. ✅ Vercel Dashboard → New Project
3. ✅ Import من GitHub
4. ✅ Root Directory: `food-delivery-backend`
5. ✅ أضف Environment Variables
6. ✅ Deploy!

---

## 🔄 بعد النشر:

1. انسخ URL Backend من Vercel
2. أضفه في Frontend Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   ```
3. Redeploy Frontend

---

## 💡 نصيحة:
الكود الآن يعمل على **Vercel و Render**!
اختر المنصة التي تناسبك.

**توصيتي:** 
- Backend بسيط → Vercel ✅
- Backend مع uploads/WebSocket → Render ✅
