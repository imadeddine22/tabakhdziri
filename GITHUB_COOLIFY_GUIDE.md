# دليل رفع المشروع على GitHub و Coolify

## 🎯 المشكلة التي تم حلها

كان Coolify يعطي خطأ: **"Nixpacks failed to detect the application type"**

السبب: المشروع يحتوي على مجلدين منفصلين (Backend و Frontend) ولم يكن هناك ملفات تكوين.

## ✅ الحل المطبق

تم إنشاء الملفات التالية:

### 1. Backend Configuration
- ✅ `food-delivery-backend/nixpacks.toml`
- ✅ `food-delivery-backend/.dockerignore`

### 2. Frontend Configuration
- ✅ `food-delivery-app/nixpacks.toml`
- ✅ `food-delivery-app/.dockerignore`

---

## 📤 خطوات رفع المشروع على GitHub

### الخطوة 1: التحقق من Git

```bash
cd "c:\Users\DELL\Desktop\tabakh dziri"
git status
```

### الخطوة 2: إضافة الملفات الجديدة

```bash
git add food-delivery-backend/nixpacks.toml
git add food-delivery-backend/.dockerignore
git add food-delivery-app/nixpacks.toml
git add food-delivery-app/.dockerignore
git add food-delivery-app/.env.local
git add food-delivery-backend/.env
git add COOLIFY_SETUP.md
```

### الخطوة 3: عمل Commit

```bash
git commit -m "Add Coolify configuration files (nixpacks.toml) and update domain to tabakhedjazayri.com"
```

### الخطوة 4: رفع على GitHub

```bash
git push origin master
```

---

## 🚀 خطوات النشر على Coolify

### مهم جداً: يجب إنشاء تطبيقين منفصلين!

## التطبيق الأول: Backend

### 1. إنشاء Application جديد في Coolify
- اذهب إلى Dashboard → **New Resource** → **Application**
- اسم التطبيق: `tabakh-backend`

### 2. Git Configuration
- **Repository**: `https://github.com/imadeddine22/tabakhdziri`
- **Branch**: `master`
- **Root Directory**: `/food-delivery-backend` ⚠️ **مهم جداً!**

### 3. Build Pack
- اختر: **Nixpacks**
- سيقرأ تلقائياً ملف `nixpacks.toml` من مجلد Backend

### 4. Port Configuration
- **Port**: `5000`

### 5. Environment Variables
أضف في Coolify:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://tabakh:tabakh0000@cluster0.n42xfsy.mongodb.net/tabakh_dziri?retryWrites=true&w=majority
FRONTEND_URL=https://tabakhedjazayri.com
JWT_SECRET=tabakh_dziri_super_secret_jwt_key_2026
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tabakhdziri@gmail.com
EMAIL_PASS=rdcueeruhhpipzhu
```

### 6. Domain
- **Domain**: `api.tabakhedjazayri.com`
- أو: `tabakhedjazayri.com` (ستستخدم Nginx لاحقاً لتوجيه `/api`)

### 7. Persistent Storage
- أضف Volume:
  - **Source**: `/var/lib/docker/volumes/tabakh-uploads`
  - **Destination**: `/app/uploads`

### 8. Deploy
اضغط **Deploy** وانتظر حتى ينتهي البناء.

---

## التطبيق الثاني: Frontend

### 1. إنشاء Application جديد في Coolify
- اذهب إلى Dashboard → **New Resource** → **Application**
- اسم التطبيق: `tabakh-frontend`

### 2. Git Configuration
- **Repository**: `https://github.com/imadeddine22/tabakhdziri`
- **Branch**: `master`
- **Root Directory**: `/food-delivery-app` ⚠️ **مهم جداً!**

### 3. Build Pack
- اختر: **Nixpacks**
- سيقرأ تلقائياً ملف `nixpacks.toml` من مجلد Frontend

### 4. Port Configuration
- **Port**: `3000`

### 5. Environment Variables
```env
NEXT_PUBLIC_API_URL=https://tabakhedjazayri.com/api
# أو إذا استخدمت subdomain:
# NEXT_PUBLIC_API_URL=https://api.tabakhedjazayri.com
```

### 6. Domain
- **Domain**: `tabakhedjazayri.com` و `www.tabakhedjazayri.com`

### 7. Deploy
اضغط **Deploy** وانتظر حتى ينتهي البناء.

---

## 🌐 تكوين DNS

### في لوحة تحكم الدومين

#### الخيار 1: استخدام Subdomain للـ API (موصى به)

```
Type    Name    Value                           TTL
A       @       [IP من Coolify للـ Frontend]    3600
A       www     [IP من Coolify للـ Frontend]    3600
A       api     [IP من Coolify للـ Backend]     3600
```

#### الخيار 2: كل شيء على نفس الدومين

```
Type    Name    Value               TTL
A       @       [IP من Coolify]     3600
A       www     [IP من Coolify]     3600
```

في هذه الحالة، ستحتاج لتكوين Nginx Proxy في Coolify.

---

## 🔍 التحقق من النشر

### 1. Backend Health Check

```bash
curl https://api.tabakhedjazayri.com/api/health
# أو
curl https://tabakhedjazayri.com/api/health
```

يجب أن يرجع:
```json
{
  "success": true,
  "message": "API is running"
}
```

### 2. Frontend
افتح المتصفح: `https://tabakhedjazayri.com`

---

## 🐛 استكشاف الأخطاء

### المشكلة: "Nixpacks failed to detect the application type"
**الحل**: 
- ✅ تأكد من وجود `nixpacks.toml` في المجلد الصحيح
- ✅ تأكد من تحديد **Root Directory** في Coolify
- ✅ تأكد من رفع الملفات على GitHub

### المشكلة: Build fails
**الحل**:
- تحقق من Logs في Coolify
- تأكد من أن `package.json` موجود
- تأكد من أن Node.js version صحيح (24.x)

### المشكلة: Application crashes
**الحل**:
- تحقق من Environment Variables
- تحقق من اتصال MongoDB
- راجع Application Logs في Coolify

---

## 📋 Checklist

### قبل الرفع على GitHub:
- [x] تم إنشاء `nixpacks.toml` للـ Backend
- [x] تم إنشاء `nixpacks.toml` للـ Frontend
- [x] تم إنشاء `.dockerignore` للـ Backend
- [x] تم إنشاء `.dockerignore` للـ Frontend
- [x] تم تحديث `.env` بالدومين الصحيح
- [x] تم تحديث `.env.local` بالدومين الصحيح

### على Coolify:
- [ ] تم إنشاء Backend Application
- [ ] تم تحديد Root Directory: `/food-delivery-backend`
- [ ] تم إضافة Environment Variables للـ Backend
- [ ] تم تكوين Domain للـ Backend
- [ ] تم إضافة Persistent Storage للصور
- [ ] تم نشر Backend بنجاح
- [ ] تم إنشاء Frontend Application
- [ ] تم تحديد Root Directory: `/food-delivery-app`
- [ ] تم إضافة Environment Variables للـ Frontend
- [ ] تم تكوين Domain للـ Frontend
- [ ] تم نشر Frontend بنجاح
- [ ] تم تكوين DNS
- [ ] تم اختبار Backend API
- [ ] تم اختبار Frontend

---

## 📞 ملاحظات مهمة

1. **Root Directory مهم جداً**: يجب تحديد المجلد الصحيح لكل تطبيق
2. **Environment Variables**: لا ترفع ملفات `.env` على GitHub (موجودة في `.gitignore`)
3. **SSL**: Coolify يفعّل SSL تلقائياً بعد تكوين الدومين
4. **Logs**: راقب Logs في Coolify لمعرفة أي مشاكل

---

**تم التحديث**: 2026-01-22
**الدومين**: tabakhedjazayri.com
