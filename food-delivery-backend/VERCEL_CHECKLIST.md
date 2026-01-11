# ✅ Vercel Backend Deployment Checklist

## قبل البدء
- [ ] التأكد من أن الكود يعمل محلياً
- [ ] جميع التعديلات مرفوعة على GitHub ✅ (تم!)
- [ ] ملف `.env` جاهز (للنسخ منه)

---

## نشر Backend على Vercel

### 1️⃣ إنشاء Project
- [ ] تسجيل الدخول: https://vercel.com/
- [ ] New Project → Import from GitHub
- [ ] اختيار repository الصحيح

### 2️⃣ إعدادات Project
- [ ] Framework Preset: `Other`
- [ ] Root Directory: `food-delivery-backend` ⚠️
- [ ] Build Command: (leave empty)
- [ ] Install Command: `npm install`

### 3️⃣ Environment Variables
أضف واحدة تلو الأخرى:
- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = (انسخ من `.env` المحلي)
- [ ] `JWT_SECRET` = (انسخ من `.env` المحلي)
- [ ] `FRONTEND_URL` = `https://your-frontend.vercel.app`

### 4️⃣ Deploy
- [ ] انقر على "Deploy"
- [ ] انتظر اكتمال النشر (2-3 دقائق)
- [ ] نسخ رابط Backend: `https://_____.vercel.app`

---

## MongoDB Atlas Setup

### Network Access
- [ ] تسجيل دخول: https://cloud.mongodb.com/
- [ ] Network Access → Add IP Address
- [ ] Allow Access from Anywhere (`0.0.0.0/0`)
- [ ] Confirm

---

## اختبار Backend

### اختبر الروابط التالية:
- [ ] `https://your-backend.vercel.app/`
  - يجب أن يعرض JSON مع `"success": true`
  
- [ ] `https://your-backend.vercel.app/api/health`
  - يجب أن يعرض `"database": "connected"`
  
- [ ] `https://your-backend.vercel.app/api/products`
  - يجب أن يعرض قائمة المنتجات

---

## تحديث Frontend

### إذا كان Frontend منشور:
- [ ] Vercel Dashboard → Frontend Project
- [ ] Settings → Environment Variables
- [ ] تحديث/إضافة:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
  ```
- [ ] Redeploy Frontend

### تحديث Backend FRONTEND_URL:
- [ ] Vercel Dashboard → Backend Project
- [ ] Settings → Environment Variables
- [ ] تحديث `FRONTEND_URL` برابط Frontend الفعلي
- [ ] Redeploy Backend

---

## ✅ التحقق النهائي

- [ ] Backend يستجيب بشكل صحيح
- [ ] MongoDB متصل (`"database": "connected"`)
- [ ] Frontend يستطيع استدعاء Backend API
- [ ] لا توجد CORS errors
- [ ] جميع APIs تعمل (Products, Orders, Auth...)

---

## 📝 معلومات المشروع

**Backend URL:**
```
https://__________________.vercel.app
```

**Frontend URL:**
```
https://__________________.vercel.app
```

**MongoDB Database:**
```
Connected ✅
```

**التاريخ:**
```
2026-01-12
```

---

## 🔧 في حالة المشاكل

### راجع:
1. [ ] Vercel Logs (Backend Project → Logs)
2. [ ] Environment Variables كاملة
3. [ ] MongoDB Network Access
4. [ ] MONGODB_URI صحيح

### ملفات المساعدة:
- `VERCEL_STEP_BY_STEP.md` - دليل مفصل
- `VERCEL_QUICK_GUIDE.md` - دليل سريع
- `VERCEL_DEPLOYMENT.md` - معلومات شاملة

---

**الحالة:** ⬜ Pending | ✅ Complete
