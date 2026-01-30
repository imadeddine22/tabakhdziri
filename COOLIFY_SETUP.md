# دليل تكوين Coolify لـ Tabakh Dziri

## 📌 نظرة عامة

بعد شراء الدومين `tabakhedjazayri.com` وإنشاء admin على Coolify، هذا الدليل يوضح التكوينات المطلوبة.

---

## ✅ التغييرات التي تمت في الكود

### 1. Frontend Environment Variables
**الملف**: `food-delivery-app/.env.local`

```env
NEXT_PUBLIC_API_URL=https://tabakhdziri.com/api
```

### 2. Backend Environment Variables
**الملف**: `food-delivery-backend/.env`

```env
NODE_ENV=production
FRONTEND_URL=https://tabakhdziri.com
MONGODB_URI=mongodb+srv://tabakh:tabakh0000@cluster0.n42xfsy.mongodb.net/tabakh_dziri?retryWrites=true&w=majority
JWT_SECRET=tabakh_dziri_super_secret_jwt_key_2026
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tabakhdziri@gmail.com
EMAIL_PASS=rdcueeruhhpipzhu
```

---

## 🚀 تكوين Coolify

### المشروع 1: Backend (food-delivery-backend)

#### 1. إنشاء Application جديد
- اذهب إلى Dashboard → New Resource → Application
- اختر **Node.js** كنوع التطبيق
- اسم التطبيق: `tabakh-backend`

#### 2. Git Repository
- **Repository URL**: رابط الـ Git repository الخاص بك
- **Branch**: `main` أو `master`
- **Root Directory**: `/food-delivery-backend` (إذا كان المشروع في مجلد فرعي)

#### 3. Build Settings
```bash
# Build Command
npm install --production

# Start Command
node server.js

# Port
5000
```

#### 4. Environment Variables
أضف المتغيرات التالية في Coolify:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://tabakh:tabakh0000@cluster0.n42xfsy.mongodb.net/tabakh_dziri?retryWrites=true&w=majority
FRONTEND_URL=https://tabakhdziri.com
JWT_SECRET=tabakh_dziri_super_secret_jwt_key_2026
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tabakhdziri@gmail.com
EMAIL_PASS=rdcueeruhhpipzhu
```

#### 5. Domain Configuration
- **Domain**: `api.tabakhdziri.com` (أو `tabakhdziri.com/api` حسب تفضيلك)
- تفعيل **SSL/HTTPS** تلقائياً

#### 6. Persistent Storage (للصور)
- أضف **Volume** جديد:
  - **Source**: `/var/lib/docker/volumes/tabakh-uploads`
  - **Destination**: `/app/uploads`
  - **Type**: Persistent

---

### المشروع 2: Frontend (food-delivery-app)

#### 1. إنشاء Application جديد
- اذهب إلى Dashboard → New Resource → Application
- اختر **Next.js** كنوع التطبيق
- اسم التطبيق: `tabakh-frontend`

#### 2. Git Repository
- **Repository URL**: نفس الـ repository
- **Branch**: `main` أو `master`
- **Root Directory**: `/food-delivery-app` (إذا كان المشروع في مجلد فرعي)

#### 3. Build Settings
```bash
# Install Command
npm install

# Build Command
npm run build

# Start Command
npm start

# Port
3000
```

#### 4. Environment Variables
```env
NEXT_PUBLIC_API_URL=https://tabakhdziri.com/api
# أو إذا استخدمت subdomain:
# NEXT_PUBLIC_API_URL=https://api.tabakhdziri.com
```

#### 5. Domain Configuration
- **Domain**: `tabakhdziri.com` و `www.tabakhdziri.com`
- تفعيل **SSL/HTTPS** تلقائياً

---

## 🌐 تكوين DNS

### في لوحة تحكم الدومين (Domain Registrar)

أضف السجلات التالية:

#### الخيار 1: استخدام subdomain للـ API

```
Type    Name    Value                           TTL
A       @       [IP من Coolify للـ Frontend]    3600
A       www     [IP من Coolify للـ Frontend]    3600
A       api     [IP من Coolify للـ Backend]     3600
```

#### الخيار 2: كل شيء على نفس الدومين (موصى به)

```
Type    Name    Value                           TTL
A       @       [IP من Coolify]                 3600
A       www     [IP من Coolify]                 3600
```

في هذه الحالة، استخدم **Nginx Reverse Proxy** في Coolify لتوجيه:
- `/api/*` → Backend (Port 5000)
- `/*` → Frontend (Port 3000)

---

## 🔧 تكوين Nginx في Coolify (إذا لزم الأمر)

إذا كنت تستخدم الخيار 2 (كل شيء على نفس الدومين)، قد تحتاج إلى تكوين Nginx:

```nginx
server {
    listen 80;
    server_name tabakhdziri.com www.tabakhdziri.com;

    # حد أقصى لحجم الملفات المرفوعة
    client_max_body_size 10M;

    # Backend API
    location /api {
        proxy_pass http://tabakh-backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ملفات الصور المرفوعة
    location /uploads {
        proxy_pass http://tabakh-backend:5000/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://tabakh-frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📦 رفع الكود إلى Git

إذا لم يكن المشروع على Git بعد:

```bash
# في مجلد المشروع الرئيسي
cd "c:\Users\DELL\Desktop\tabakh dziri"

# تهيئة Git
git init

# إضافة .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".next/" >> .gitignore
echo "uploads/" >> .gitignore

# إضافة الملفات
git add .

# أول commit
git commit -m "Initial commit - Tabakh Dziri"

# ربط مع GitHub (أنشئ repository أولاً على GitHub)
git remote add origin https://github.com/YOUR_USERNAME/tabakh-dziri.git

# رفع الكود
git branch -M main
git push -u origin main
```

---

## 🔐 الأمان والإعدادات المهمة

### 1. تغيير JWT_SECRET
⚠️ **مهم جداً**: غيّر `JWT_SECRET` إلى قيمة عشوائية قوية:

```bash
# على جهازك المحلي، أنشئ secret جديد
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

ثم ضع القيمة الناتجة في متغيرات البيئة على Coolify.

### 2. تأمين MongoDB
- تأكد من أن MongoDB Atlas يسمح فقط بـ IP الخاص بـ Coolify
- استخدم كلمة مرور قوية

### 3. تفعيل CORS بشكل صحيح
تحقق من أن Backend يسمح فقط بـ FRONTEND_URL:

**في `server.js` أو `app.js`**:
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 🧪 اختبار النشر

بعد النشر، اختبر:

### 1. Backend Health Check
```bash
curl https://tabakhdziri.com/api/health
# أو
curl https://api.tabakhdziri.com/health
```

يجب أن يرجع:
```json
{
  "success": true,
  "message": "API is running"
}
```

### 2. Frontend
افتح المتصفح واذهب إلى:
- `https://tabakhdziri.com`
- تحقق من أن الصفحة تحمل بشكل صحيح
- تحقق من أن الصور تظهر
- جرب تسجيل الدخول

### 3. اختبار API من Frontend
افتح Console في المتصفح وتحقق من عدم وجود أخطاء CORS.

---

## 🐛 استكشاف الأخطاء

### المشكلة: CORS Error
**الحل**: تأكد من أن `FRONTEND_URL` في Backend يطابق الدومين الفعلي.

### المشكلة: الصور لا تظهر
**الحل**: 
1. تحقق من أن مجلد `uploads` موجود في Backend
2. تحقق من Persistent Storage في Coolify
3. تحقق من أن Nginx يوجه `/uploads` بشكل صحيح

### المشكلة: 502 Bad Gateway
**الحل**:
1. تحقق من logs في Coolify
2. تأكد من أن التطبيق يعمل على Port الصحيح
3. تحقق من Environment Variables

### المشكلة: Database Connection Error
**الحل**:
1. تحقق من `MONGODB_URI`
2. تأكد من أن IP الخاص بـ Coolify مسموح في MongoDB Atlas
3. تحقق من اسم المستخدم وكلمة المرور

---

## 📊 المراقبة

### في Coolify Dashboard:
- راقب **Logs** لكل تطبيق
- راقب **Resource Usage** (CPU, Memory)
- فعّل **Auto-deploy** عند push جديد على Git

### إعداد Alerts (اختياري):
- أضف webhook للإشعارات عند فشل النشر
- راقب uptime باستخدام خدمة مثل UptimeRobot

---

## 🔄 التحديثات المستقبلية

عند إجراء تحديثات على الكود:

```bash
# على جهازك المحلي
git add .
git commit -m "وصف التحديث"
git push origin main
```

Coolify سيقوم تلقائياً بـ:
1. سحب آخر التحديثات
2. إعادة البناء
3. إعادة النشر

---

## ✅ Checklist النشر

- [ ] تم تحديث `.env.local` في Frontend
- [ ] تم تحديث `.env` في Backend
- [ ] تم رفع الكود إلى Git
- [ ] تم إنشاء Backend application في Coolify
- [ ] تم إنشاء Frontend application في Coolify
- [ ] تم تكوين Environment Variables في Coolify
- [ ] تم تكوين DNS للدومين
- [ ] تم تفعيل SSL/HTTPS
- [ ] تم اختبار Backend API
- [ ] تم اختبار Frontend
- [ ] تم اختبار رفع الصور
- [ ] تم إنشاء مستخدم Admin أولي
- [ ] تم تغيير JWT_SECRET إلى قيمة قوية
- [ ] تم تأمين MongoDB

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Logs في Coolify
2. راجع هذا الدليل
3. تحقق من [Coolify Documentation](https://coolify.io/docs)

---

**تم التحديث**: 2026-01-22
**الإصدار**: 1.0
