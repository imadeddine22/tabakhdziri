# 🚀 Vercel Deployment - Step by Step Guide

## ✅ الخطوات الكاملة لنشر Backend على Vercel

### 📋 **الخطوة 1: تسجيل الدخول إلى Vercel**

1. اذهب إلى: https://vercel.com/login
2. سجل دخول باستخدام GitHub

---

### 📋 **الخطوة 2: إنشاء Project جديد**

1. في Vercel Dashboard، انقر على **"Add New..."** → **"Project"**
2. سيظهر لك قائمة repositories من GitHub
3. ابحث عن repository الخاص بك (على الأرجح `tabakhdziri`)
4. انقر على **"Import"** بجانب ال repository

---

### 📋 **الخطوة 3: إعدادات Project**

في صفحة "Configure Project"، اضبط الإعدادات التالية:

#### **Framework Preset:**
```
Other
```
(اختر "Other" من القائمة المنسدلة)

#### **Root Directory:**
⚠️ **مهم جداً!**
```
food-delivery-backend
```
انقر على **"Edit"** بجانب Root Directory واكتب: `food-delivery-backend`

#### **Build and Output Settings:**
- **Build Command:** اتركه فارغاً أو اكتب: `npm install`
- **Output Directory:** اتركه فارغاً
- **Install Command:** `npm install`

---

### 📋 **الخطوة 4: Environment Variables**

⚠️ **هذه الخطوة مهمة جداً!**

في نفس الصفحة، انزل لأسفل حتى تجد قسم **"Environment Variables"**

أضف المتغيرات التالية **واحدة تلو الأخرى**:

#### 1️⃣ NODE_ENV
```
Key:   NODE_ENV
Value: production
```

#### 2️⃣ MONGODB_URI
⚠️ **انسخه من ملف `.env` المحلي**
```
Key:   MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```
**مثال:**
```
mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/tabakhdziri?retryWrites=true&w=majority
```

#### 3️⃣ JWT_SECRET
⚠️ **انسخه من ملف `.env` المحلي** (يجب أن يكون 32+ حرف)
```
Key:   JWT_SECRET
Value: your-super-secret-jwt-key-minimum-32-characters-long
```
**مثال:**
```
tabakh-dziri-jwt-secret-production-2026-secure
```

#### 4️⃣ FRONTEND_URL
⚠️ **مؤقتاً ضع رابط Frontend الحالي، سنحدثه لاحقاً**
```
Key:   FRONTEND_URL
Value: https://your-frontend.vercel.app
```
إذا لم يكن Frontend منشور بعد، ضع:
```
https://tabakhdziri.vercel.app
```

---

### 📋 **الخطوة 5: Deploy!**

بعد إضافة جميع Environment Variables:

1. انقر على زر **"Deploy"** الأزرق الكبير
2. انتظر 2-3 دقائق حتى يكتمل النشر
3. ستظهر رسالة "Congratulations!" عند النجاح 🎉

---

### 📋 **الخطوة 6: احصل على رابط Backend**

1. بعد اكتمال النشر، انقر على **"Visit"** أو **"Go to Dashboard"**
2. في Dashboard، ستجد رابط المشروع مثل:
   ```
   https://tabakhdziri-backend.vercel.app
   ```
3. **انسخ هذا الرابط!** ستحتاجه للخطوة التالية

---

### 📋 **الخطوة 7: اختبار Backend**

افتح المتصفح واختبر الروابط التالية:

#### ✅ **Root Route:**
```
https://your-backend.vercel.app/
```
**يجب أن يعرض:**
```json
{
  "success": true,
  "message": "Tabakh Dziri API is running",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

#### ✅ **Health Check:**
```
https://your-backend.vercel.app/api/health
```
**يجب أن يعرض:**
```json
{
  "success": true,
  "message": "Tabakh Dziri API is running",
  "timestamp": "2026-01-12T...",
  "database": "connected"
}
```

#### ✅ **Products API:**
```
https://your-backend.vercel.app/api/products
```

---

### 📋 **الخطوة 8: MongoDB Atlas - Network Access**

⚠️ **مهم جداً لنجاح الاتصال بقاعدة البيانات!**

1. اذهب إلى: https://cloud.mongodb.com/
2. سجل دخول إلى حسابك
3. في القائمة الجانبية، انقر على **"Network Access"**
4. انقر على **"Add IP Address"**
5. في النافذة المنبثقة:
   - اختر **"Allow Access from Anywhere"**
   - سيتم إضافة `0.0.0.0/0` تلقائياً
   - في حقل Comment: اكتب `Vercel Deployment`
6. انقر على **"Confirm"**

**ملاحظة:** إذا كان `0.0.0.0/0` موجود بالفعل، فأنت جاهز!

---

### 📋 **الخطوة 9: تحديث Frontend (إذا كان منشور)**

إذا كان Frontend منشور بالفعل على Vercel:

1. اذهب إلى Vercel Dashboard
2. افتح Frontend project
3. انقر على **"Settings"** → **"Environment Variables"**
4. ابحث عن `NEXT_PUBLIC_API_URL`
5. حدّث القيمة إلى رابط Backend الجديد:
   ```
   https://your-backend.vercel.app
   ```
6. احفظ التغييرات
7. في **"Deployments"**، اذهب لآخر deployment
8. انقر على النقاط الثلاث (⋯) → **"Redeploy"**

---

### 📋 **الخطوة 10: تحديث FRONTEND_URL في Backend**

الآن نحتاج تحديث `FRONTEND_URL` في Backend:

1. في Vercel Dashboard، افتح Backend project
2. انقر على **"Settings"** → **"Environment Variables"**
3. ابحث عن `FRONTEND_URL`
4. انقر على النقاط الثلاث (⋯) → **"Edit"**
5. غيّر القيمة إلى رابط Frontend الفعلي:
   ```
   https://your-frontend.vercel.app
   ```
6. احفظ التغييرات
7. **Redeploy** البروجكت

---

## 🎉 **تم! كل شيء جاهز على Vercel**

الآن عندك:
- ✅ Backend على Vercel
- ✅ Frontend على Vercel
- ✅ MongoDB Atlas متصل
- ✅ CORS مضبوط

---

## 🐛 **استكشاف الأخطاء**

### ❌ **500 Internal Server Error**
**الحل:**
1. في Vercel Dashboard → Backend Project → **"Logs"**
2. اقرأ الـ error message
3. تحقق من:
   - ✅ جميع Environment Variables موجودة
   - ✅ `MONGODB_URI` صحيح
   - ✅ MongoDB Network Access يسمح بـ `0.0.0.0/0`

### ❌ **CORS Error من Frontend**
**الحل:**
1. تأكد من `FRONTEND_URL` في Backend Environment Variables
2. Redeploy Backend بعد التحديث

### ❌ **Database Connection Error**
**الحل:**
1. تحقق من `MONGODB_URI` في Vercel
2. تحقق من MongoDB Network Access
3. جرّب نسخ Connection String جديد من MongoDB Atlas

---

## 📊 **روابط مهمة:**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **GitHub Repository:** https://github.com/your-username/your-repo

---

## 💡 **نصائح:**

1. **Auto-Deploy:** Vercel ينشر تلقائياً عند `git push`
2. **Preview Deployments:** كل branch يحصل على رابط خاص
3. **Logs:** راقب الـ Logs بانتظام في Vercel Dashboard
4. **Custom Domain:** يمكنك إضافة domain خاص من Settings → Domains

---

**آخر تحديث:** 2026-01-12
**الحالة:** ✅ جاهز للنشر
