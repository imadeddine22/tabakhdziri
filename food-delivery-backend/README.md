# 🍽️ Tabakh Dziri - Backend API

Backend API لتطبيق توصيل الطعام "طباخ دزيري" مبني باستخدام Node.js، Express، و MongoDB.

## 🚀 التقنيات المستخدمة

- **Node.js** - بيئة تشغيل JavaScript
- **Express** - إطار عمل خادم الويب
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM للتعامل مع MongoDB
- **JWT** - المصادقة والتوثيق
- **Bcrypt** - تشفير كلمات المرور
- **Multer** - رفع الملفات

## 📋 المتطلبات

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account

## ⚙️ التثبيت المحلي

1. **استنساخ المشروع:**
```bash
git clone <repository-url>
cd food-delivery-backend
```

2. **تثبيت Dependencies:**
```bash
npm install
```

3. **إعداد Environment Variables:**

انسخ `.env.example` إلى `.env`:
```bash
cp .env.example .env
```

قم بتعبئة القيم المطلوبة في `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tabakh-dziri?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
FRONTEND_URL=http://localhost:3000
```

4. **التحقق من Environment Variables:**
```bash
npm run check-env
```

5. **تشغيل السيرفر:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 🌐 نشر على Render

### الخطوة 1: التحضير

تأكد من اكتمال كل هذه النقاط:
- [x] جميع التعديلات مرفوعة على GitHub
- [x] ملف `.env` **غير مرفوع** على GitHub (محمي بـ `.gitignore`)
- [x] المشروع يعمل محلياً بدون مشاكل

### الخطوة 2: إنشاء Web Service على Render

1. اذهب إلى [Render Dashboard](https://dashboard.render.com/)
2. انقر على **"New"** → **"Web Service"**
3. اربط حساب GitHub الخاص بك
4. اختر repository المشروع

### الخطوة 3: إعدادات Render

#### Basic Settings:
- **Name:** `tabakh-dziri-backend`
- **Environment:** `Node`
- **Region:** اختر الأقرب (Frankfurt أو Amsterdam)
- **Branch:** `main`
- **Root Directory:** `food-delivery-backend` ⚠️ **مهم جداً!**

#### Build & Deploy:
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Auto-Deploy:** `Yes` (لإعادة النشر تلقائياً عند push)

#### Environment Variables:

أضف المتغيرات التالية واحدة تلو الأخرى:

| Key | Value | ملاحظات |
|-----|-------|---------|
| `NODE_ENV` | `production` | بيئة الإنتاج |
| `PORT` | `10000` | Render يعين هذا تلقائياً |
| `MONGODB_URI` | `mongodb+srv://...` | من MongoDB Atlas |
| `JWT_SECRET` | `your-secret-32+chars` | يجب أن يكون 32+ حرف |
| `FRONTEND_URL` | `https://your-app.vercel.app` | رابط Frontend |

### الخطوة 4: MongoDB Atlas

1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Network Access** → **Add IP Address**
3. اختر **"Allow Access from Anywhere"** (`0.0.0.0/0`)
4. أو أضف IP الخاص بـ Render (يظهر في الـ logs)

### الخطوة 5: التحقق من النشر

بعد النشر، اختبر الروابط التالية:

#### 1. Root Route:
```
https://your-app-name.onrender.com/
```
✅ يجب أن يعرض:
```json
{
  "success": true,
  "message": "Tabakh Dziri API is running",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

#### 2. Health Check:
```
https://your-app-name.onrender.com/api/health
```
✅ يجب أن يعرض:
```json
{
  "success": true,
  "message": "Tabakh Dziri API is running",
  "timestamp": "2026-01-11T...",
  "database": "connected"
}
```

#### 3. Test Products API:
```
https://your-app-name.onrender.com/api/products
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي

### Products
- `GET /api/products` - الحصول على جميع المنتجات
- `GET /api/products/:id` - الحصول على منتج معين
- `POST /api/products` - إضافة منتج جديد (Admin only)
- `PUT /api/products/:id` - تحديث منتج (Admin only)
- `DELETE /api/products/:id` - حذف منتج (Admin only)

### Categories
- `GET /api/categories` - الحصول على جميع الفئات
- `POST /api/categories` - إضافة فئة جديدة (Admin only)

### Orders
- `GET /api/orders` - الحصول على الطلبات
- `POST /api/orders` - إنشاء طلب جديد
- `PATCH /api/orders/:id/status` - تحديث حالة الطلب (Admin only)

### Admin
- `GET /api/admin/stats` - إحصائيات لوحة التحكم
- `GET /api/admin/users` - الحصول على جميع المستخدمين
- `GET /api/admin/orders` - الحصول على جميع الطلبات

### Contact
- `POST /api/contact` - إرسال رسالة
- `GET /api/contact` - الحصول على الرسائل (Admin only)

### Reviews
- `GET /api/reviews/:productId` - الحصول على تقييمات منتج
- `POST /api/reviews` - إضافة تقييم جديد

## 🐛 استكشاف الأخطاء

### 503 Service Unavailable

**الأسباب المحتملة:**
1. ❌ Root Directory غير صحيح في Render
2. ❌ Start Command غير صحيح
3. ❌ السيرفر لا يستمع على `0.0.0.0`
4. ❌ Environment Variables ناقصة

**الحل:**
- تأكد من Root Directory = `food-delivery-backend`
- تأكد من Start Command = `npm start`
- راجع الـ Logs في Render Dashboard

### Database Connection Error

**الأسباب المحتملة:**
1. ❌ `MONGODB_URI` غير صحيح
2. ❌ MongoDB Atlas لا يسمح بالاتصال من Render
3. ❌ Username/Password خاطئ في Connection String

**الحل:**
- تحقق من `MONGODB_URI` في Render Environment Variables
- أضف `0.0.0.0/0` في Network Access على MongoDB Atlas
- تأكد من صحة البيانات في Connection String

### CORS Errors

**الحل:**
- تأكد من إضافة `FRONTEND_URL` في Environment Variables
- تأكد من أن Frontend URL يبدأ بـ `https://`

## 📝 ملاحظات مهمة

### ⚠️ Cold Start (Free Plan)
- Render يوقف الخدمة بعد 15 دقيقة من عدم النشاط
- أول طلب بعد التوقف قد يستغرق 30-60 ثانية
- هذا أمر طبيعي في Free Plan

### 🔒 الأمان
- ✅ لا تشارك ملف `.env` أبداً
- ✅ استخدم JWT Secrets طويلة (32+ حرف)
- ✅ MongoDB Atlas: أضف IP filtering في Production
- ✅ استخدم HTTPS دائماً في Production

### 📊 Monitoring
- راقب الـ Logs في Render بانتظام
- راقب استهلاك Database في MongoDB Atlas
- تحقق من Health Check بشكل دوري

## 🛠️ Scripts المتاحة

```bash
# تشغيل السيرفر (Production)
npm start

# تشغيل السيرفر (Development with auto-reload)
npm run dev

# التحقق من Environment Variables
npm run check-env
```

## 📚 الملفات المهمة

- `RENDER_DEPLOYMENT.md` - دليل شامل للنشر على Render
- `DEPLOYMENT_CHECKLIST.md` - قائمة تحقق خطوة بخطوة
- `.env.example` - نموذج Environment Variables
- `check-env.js` - سكريبت للتحقق من المتغيرات

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع `RENDER_DEPLOYMENT.md`
2. استخدم `DEPLOYMENT_CHECKLIST.md`
3. شغّل `npm run check-env` للتحقق
4. تحقق من Render Logs
5. تحقق من MongoDB Atlas Logs

## 📄 الترخيص

MIT License - Tabakh Dziri © 2026

---

**آخر تحديث:** 2026-01-11
**النسخة:** 1.0.0
