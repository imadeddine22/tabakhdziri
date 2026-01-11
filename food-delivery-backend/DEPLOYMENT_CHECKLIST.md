# ✅ Render Deployment Checklist

## قبل النشر (Before Deployment)

- [ ] تم تعديل `server.js` للاستماع على `0.0.0.0`
- [ ] تمت إضافة root route (`/`) في `server.js`
- [ ] تمت إضافة `engines` في `package.json`
- [ ] ملف `.gitignore` يحتوي على `.env`
- [ ] تم رفع جميع التعديلات إلى GitHub:
  ```bash
  git add .
  git commit -m "fix: Render deployment configuration"
  git push origin main
  ```

## إعدادات Render Dashboard

### Basic Settings
- [ ] Name: `tabakh-dziri-backend`
- [ ] Environment: `Node`
- [ ] Branch: `main`
- [ ] **Root Directory: `food-delivery-backend`** ⚠️ مهم جداً!

### Build & Deploy
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Auto-Deploy: `Yes`

### Environment Variables
أضف المتغيرات التالية واحدة تلو الأخرى:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `MONGODB_URI` = (من ملف .env المحلي)
- [ ] `JWT_SECRET` = (من ملف .env المحلي)
- [ ] `FRONTEND_URL` = `https://your-frontend.vercel.app`

## MongoDB Atlas Configuration

- [ ] تسجيل الدخول إلى MongoDB Atlas
- [ ] Network Access → Add IP Address
- [ ] إضافة `0.0.0.0/0` (Allow access from anywhere)
- [ ] أو إضافة IP الخاص بـ Render (يظهر في الـ logs)

## بعد النشر (After Deployment)

- [ ] فحص Logs في Render:
  - يجب أن تظهر: `🚀 Server running on 0.0.0.0:10000`
  - يجب أن تظهر: `✅ MongoDB Connected`
  - يجب أن تظهر: `✅ Server is ready to accept connections`

- [ ] اختبار الروابط:
  - [ ] `https://your-app.onrender.com/` → يجب أن يعرض JSON
  - [ ] `https://your-app.onrender.com/api/health` → Database: connected
  - [ ] `https://your-app.onrender.com/api/products` → قائمة المنتجات

## تحديث Frontend

- [ ] نسخ رابط الـ Backend من Render: `https://your-app.onrender.com`
- [ ] تسجيل الدخول إلى Vercel
- [ ] إضافة/تحديث Environment Variable:
  - Key: `NEXT_PUBLIC_API_URL`
  - Value: `https://your-app.onrender.com`
- [ ] Redeploy Frontend

## استكشاف الأخطاء (Troubleshooting)

### إذا ظهر 503:
- [ ] تحقق من Render Logs
- [ ] تأكد من Root Directory = `food-delivery-backend`
- [ ] تأكد من Start Command = `npm start`
- [ ] تأكد من وجود جميع Environment Variables

### إذا ظهر خطأ Database:
- [ ] تحقق من `MONGODB_URI` في Render
- [ ] تحقق من Network Access في MongoDB Atlas
- [ ] تأكد من صحة username و password في Connection String

### إذا لم يظهر أي شيء:
- [ ] انتظر 2-3 دقائق (أول deployment قد يستغرق وقتاً)
- [ ] تحقق من Build Logs
- [ ] تأكد من عدم وجود أخطاء في `npm install`

## ملاحظات مهمة

⚠️ **Cold Start:** في Free Plan، Render يوقف الخدمة بعد 15 دقيقة من عدم النشاط.
   - أول طلب قد يستغرق 30-60 ثانية

✅ **SSL/HTTPS:** Render يوفر SSL تلقائياً - استخدم `https://` دائماً

📊 **Monitoring:** راقب الـ logs بانتظام لاكتشاف المشاكل مبكراً

---
**الحالة:** ⬜ غير مكتمل | ✅ مكتمل
