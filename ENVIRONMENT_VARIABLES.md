# 🔐 دليل متغيرات البيئة - Tabakh Dziri

هذا الملف يوثق جميع متغيرات البيئة المطلوبة للمشروع.

---

## 📦 Backend Environment Variables

### ملف: `food-delivery-backend/.env`

#### متغيرات أساسية (مطلوبة)

```env
# بيئة التشغيل
NODE_ENV=production
# القيم المتاحة: development, production, test

# منفذ الخادم
PORT=5000
# المنفذ الذي سيعمل عليه Backend

# اتصال MongoDB
MONGODB_URI=mongodb://localhost:27017/tabakh-dziri
# أو للـ MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tabakh-dziri?retryWrites=true&w=majority

# مفتاح JWT السري
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# ⚠️ مهم: غيّر هذه القيمة إلى نص عشوائي طويل
# يمكنك توليد واحد من: https://randomkeygen.com/

# رابط Frontend
FRONTEND_URL=https://tabakhdziri.com
# يُستخدم لـ CORS والروابط في الإشعارات
```

#### متغيرات اختيارية

```env
# CORS Origins (مفصولة بفواصل)
CORS_ORIGINS=https://tabakhdziri.com,https://www.tabakhdziri.com
# إذا لم يتم تحديدها، سيتم استخدام FRONTEND_URL

# إعدادات البريد الإلكتروني (لإرسال الإشعارات)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
# للحصول على App Password من Gmail:
# https://myaccount.google.com/apppasswords

# Instagram API (إذا كنت تستخدم Instagram Integration)
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
# للحصول على Access Token:
# https://developers.facebook.com/docs/instagram-basic-display-api/

# رفع الملفات
MAX_FILE_SIZE=10485760
# الحد الأقصى لحجم الملف بالبايت (10MB = 10485760)

UPLOAD_PATH=./uploads
# مسار حفظ الملفات المرفوعة

# Rate Limiting (الحد من الطلبات)
RATE_LIMIT_WINDOW_MS=900000
# نافذة الوقت بالميلي ثانية (15 دقيقة = 900000)

RATE_LIMIT_MAX_REQUESTS=100
# الحد الأقصى للطلبات في النافذة الزمنية

# Session Secret
SESSION_SECRET=your-session-secret-change-this
# ⚠️ مهم: غيّر هذه القيمة

# Admin الافتراضي (للإعداد الأولي فقط)
ADMIN_EMAIL=admin@tabakhdziri.com
ADMIN_PASSWORD=ChangeThisPassword123!
# ⚠️ استخدم فقط عند الإعداد الأولي، ثم احذف هذه الأسطر
```

---

## 🎨 Frontend Environment Variables

### ملف: `food-delivery-app/.env.local`

#### متغيرات أساسية (مطلوبة)

```env
# رابط API
NEXT_PUBLIC_API_URL=https://tabakhdziri.com/api
# أو إذا كنت تستخدم subdomain منفصل:
# NEXT_PUBLIC_API_URL=https://api.tabakhdziri.com

# رابط الموقع
NEXT_PUBLIC_SITE_URL=https://tabakhdziri.com
# يُستخدم في meta tags و SEO

# اسم الموقع
NEXT_PUBLIC_SITE_NAME=Tabakh Dziri
# يُستخدم في العنوان والـ meta tags
```

#### متغيرات اختيارية

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# للحصول على GA ID:
# https://analytics.google.com/

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX
# للحصول على Pixel ID:
# https://business.facebook.com/events_manager

# Google Maps API (إذا كنت تستخدم الخرائط)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
# للحصول على API Key:
# https://console.cloud.google.com/

# Sentry (لتتبع الأخطاء)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
# للحصول على Sentry DSN:
# https://sentry.io/
```

---

## 🔄 البيئات المختلفة

### Development (التطوير المحلي)

#### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tabakh-dziri
JWT_SECRET=dev-secret-key-not-for-production
FRONTEND_URL=http://localhost:3000
```

#### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (الإنتاج)

#### Backend `.env`
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tabakh-dziri
JWT_SECRET=CHANGE_TO_VERY_LONG_RANDOM_STRING
FRONTEND_URL=https://tabakhdziri.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@tabakhdziri.com
EMAIL_PASS=your-app-password
```

#### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=https://tabakhdziri.com/api
NEXT_PUBLIC_SITE_URL=https://tabakhdziri.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🛡️ أمان متغيرات البيئة

### ✅ افعل

1. **غيّر القيم الافتراضية**: خاصة `JWT_SECRET` و `SESSION_SECRET`
2. **استخدم قيم عشوائية طويلة**: للمفاتيح السرية (32 حرف على الأقل)
3. **احفظ نسخة آمنة**: في مكان آمن (password manager)
4. **استخدم HTTPS**: في الإنتاج دائماً
5. **راجع الصلاحيات**: تأكد أن ملفات `.env` غير قابلة للقراءة من الجميع

### ❌ لا تفعل

1. **لا ترفع `.env` إلى Git**: أبداً!
2. **لا تشارك المفاتيح السرية**: في أي مكان عام
3. **لا تستخدم قيم افتراضية**: في الإنتاج
4. **لا تكتب كلمات مرور**: في الكود مباشرة
5. **لا تستخدم HTTP**: في الإنتاج

---

## 🔑 توليد مفاتيح سرية آمنة

### الطريقة 1: Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### الطريقة 2: OpenSSL

```bash
openssl rand -hex 32
```

### الطريقة 3: Online (استخدم بحذر)

- https://randomkeygen.com/
- https://www.random.org/strings/

---

## 📝 قائمة التحقق

قبل النشر، تأكد من:

### Backend

- [ ] `NODE_ENV` مضبوط على `production`
- [ ] `MONGODB_URI` يشير إلى قاعدة البيانات الصحيحة
- [ ] `JWT_SECRET` تم تغييره من القيمة الافتراضية
- [ ] `FRONTEND_URL` يستخدم HTTPS
- [ ] إعدادات البريد الإلكتروني صحيحة (إذا كنت تستخدمها)
- [ ] ملف `.env` غير موجود في Git

### Frontend

- [ ] `NEXT_PUBLIC_API_URL` يشير إلى Backend الصحيح
- [ ] `NEXT_PUBLIC_API_URL` يستخدم HTTPS
- [ ] `NEXT_PUBLIC_SITE_URL` صحيح
- [ ] Google Analytics مضبوط (إذا كنت تستخدمه)
- [ ] ملف `.env.local` غير موجود في Git

---

## 🔍 التحقق من المتغيرات

### Backend

```bash
cd food-delivery-backend
node -e "require('dotenv').config(); console.log(process.env.NODE_ENV)"
```

### Frontend

```bash
cd food-delivery-app
npm run build
# تحقق من عدم وجود تحذيرات حول متغيرات مفقودة
```

---

## 📞 المساعدة

إذا واجهت مشاكل مع متغيرات البيئة:

1. تحقق من الأخطاء الإملائية
2. تأكد من عدم وجود مسافات زائدة
3. تحقق من أن الملف في المكان الصحيح
4. أعد تشغيل التطبيق بعد التغيير
5. راجع السجلات: `pm2 logs`

---

## 📚 مراجع

- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**آخر تحديث**: 2026-01-19

**ملاحظة**: هذا الملف للتوثيق فقط. لا تضع قيم حقيقية هنا!
