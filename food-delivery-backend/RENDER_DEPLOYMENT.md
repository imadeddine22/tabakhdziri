# 🚀 دليل نشر Tabakh Dziri Backend على Render

## ✅ الخطوات المطلوبة لحل 503 Service Unavailable

### 📋 **1. التأكد من التعديلات المحلية**

تم إجراء التعديلات التالية:
- ✅ `server.js`: إضافة route للـ root path (`/`)
- ✅ `server.js`: السيرفر يستمع على `0.0.0.0` بدلاً من localhost
- ✅ `package.json`: إضافة `engines` field
- ✅ `render.yaml`: ملف تكوين Render

### 📤 **2. رفع التعديلات إلى GitHub**

```bash
cd food-delivery-backend
git add .
git commit -m "fix: Render deployment - bind to 0.0.0.0 and add root route"
git push origin main
```

### ⚙️ **3. إعدادات Render Dashboard**

#### 🔹 **Basic Settings:**
- **Name:** `tabakh-dziri-backend`
- **Environment:** `Node`
- **Region:** اختر الأقرب (Frankfurt أو Amsterdam للجزائر)
- **Branch:** `main`
- **Root Directory:** `food-delivery-backend` ⚠️ **مهم جداً!**

#### 🔹 **Build & Deploy:**
- **Build Command:** `npm install`
- **Start Command:** `npm start` ⚠️ **تأكد من هذا!**
- **Auto-Deploy:** `Yes`

#### 🔹 **Environment Variables (أضف في Render Dashboard):**

يجب إضافة المتغيرات التالية في Render:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/tabakh-dziri?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
FRONTEND_URL=https://your-frontend-url.vercel.app
```

⚠️ **ملاحظات مهمة:**
1. استبدل قيم `MONGODB_URI` و `JWT_SECRET` و `FRONTEND_URL` بالقيم الحقيقية من ملف `.env` المحلي
2. لا ترفع ملف `.env` إلى GitHub أبداً
3. أضف كل متغير على حدة في Render Dashboard

### 🔍 **4. التحقق من الصحة**

بعد النشر، افتح الروابط التالية للتأكد:

1. **Root Route:**
   ```
   https://your-app-name.onrender.com/
   ```
   يجب أن يعرض:
   ```json
   {
     "success": true,
     "message": "Tabakh Dziri API is running",
     "version": "1.0.0",
     "endpoints": { ... }
   }
   ```

2. **Health Check:**
   ```
   https://your-app-name.onrender.com/api/health
   ```
   يجب أن يعرض:
   ```json
   {
     "success": true,
     "message": "Tabakh Dziri API is running",
     "timestamp": "2026-01-11T...",
     "database": "connected"
   }
   ```

3. **Test API:**
   ```
   https://your-app-name.onrender.com/api/products
   ```

### 🐛 **5. استكشاف الأخطاء (Troubleshooting)**

#### ❌ **إذا ظهر 503:**
1. تحقق من **Logs** في Render Dashboard
2. تأكد من:
   - ✅ Root Directory = `food-delivery-backend`
   - ✅ Start Command = `npm start`
   - ✅ جميع Environment Variables موجودة
   - ✅ `MONGODB_URI` صحيح ويعمل

#### ❌ **إذا ظهر خطأ MongoDB:**
1. تحقق من IP Whitelist في MongoDB Atlas
2. أضف `0.0.0.0/0` للسماح بجميع الاتصالات
3. أو أضف IP الخاص بـ Render

#### 📊 **فحص الـ Logs:**
في Render Dashboard:
- انقر على "Logs" في القائمة الجانبية
- ابحث عن:
  ```
  🚀 Server running on 0.0.0.0:10000
  ✅ Server is ready to accept connections
  ```

### 🎯 **6. أخطاء شائعة وحلولها**

| الخطأ | السبب | الحل |
|-------|-------|------|
| 503 Service Unavailable | السيرفر لا يستمع على 0.0.0.0 | تم الإصلاح في `server.js` |
| 404 Not Found | لا يوجد route للـ root | تم إضافة `/` route |
| Cannot connect to DB | MONGODB_URI غير صحيح | تحقق من Environment Variables |
| Module not found | Dependencies لم تُثبَّت | Build Command = `npm install` |
| Port already in use | تعارض في البورت | Render يعين PORT تلقائياً |

### 📝 **7. ملاحظات مهمة**

1. **Cold Start:** Render يوقف الخدمة بعد 15 دقيقة من عدم النشاط (في Free Plan)
   - أول طلب بعد الإيقاف قد يستغرق 30-60 ثانية

2. **Database Connection:** تأكد من:
   - MongoDB Atlas يسمح بالاتصالات من جميع IPs
   - Connection string صحيح ويحتوي على username و password

3. **CORS:** تأكد من إضافة رابط Frontend في Environment Variables:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Logs:** راقب الـ logs بانتظام لاكتشاف الأخطاء مبكراً

### ✨ **8. خطوات بعد النشر الناجح**

1. احفظ رابط الـ Backend:
   ```
   https://your-app-name.onrender.com
   ```

2. حدّث `NEXT_PUBLIC_API_URL` في Frontend (Vercel):
   ```
   NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com
   ```

3. أعد نشر Frontend على Vercel

### 📞 **الدعم**
إذا واجهت أي مشاكل، تحقق من:
- Render Logs
- MongoDB Atlas Network Access
- Environment Variables في Render Dashboard

---
**آخر تحديث:** 2026-01-11
