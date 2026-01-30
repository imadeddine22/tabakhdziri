# Production Deployment Checklist ✅

## قبل النشر

### Backend Environment Variables
- [ ] `MONGODB_URI` - رابط MongoDB
- [ ] `NODE_ENV=production`
- [ ] `PORT` - سيتم تعيينه تلقائياً من المنصة
- [ ] `FRONTEND_URL=https://tabakhedjazayri.com`
- [ ] `JWT_SECRET` - مفتاح سري قوي
- [ ] `JWT_EXPIRE=30d`
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USER` - البريد الإلكتروني
- [ ] `EMAIL_PASS` - كلمة مرور التطبيق

### Frontend Environment Variables
- [ ] `NEXT_PUBLIC_API_URL=https://api.tabakhedjazayri.com`
- [ ] `NEXT_PUBLIC_BACKEND_URL=https://api.tabakhedjazayri.com`

## الاختبارات

### Backend
- [ ] Health check: `curl https://api.tabakhedjazayri.com/api/health`
- [ ] Root endpoint: `curl https://api.tabakhedjazayri.com/`
- [ ] Products API: `curl https://api.tabakhedjazayri.com/api/products`
- [ ] Categories API: `curl https://api.tabakhedjazayri.com/api/categories`

### Frontend
- [ ] الصفحة الرئيسية تعمل
- [ ] الصور تظهر بشكل صحيح
- [ ] المنتجات تظهر
- [ ] الفئات تعمل
- [ ] Instagram posts تظهر في صفحة الخدمات
- [ ] Admin panel يعمل
- [ ] تسجيل الدخول يعمل

## التحقق من الأمان

- [ ] CORS محدد للـ domains الصحيحة فقط
- [ ] JWT_SECRET قوي وفريد
- [ ] EMAIL_PASS هو App Password وليس كلمة المرور الأصلية
- [ ] HTTPS مفعل على جميع الـ domains
- [ ] Security headers مفعلة في next.config.ts

## بعد النشر

- [ ] تحقق من logs للتأكد من عدم وجود أخطاء
- [ ] اختبر جميع الوظائف الأساسية
- [ ] تحقق من سرعة التحميل
- [ ] اختبر على أجهزة مختلفة (موبايل، تابلت، ديسكتوب)
- [ ] تحقق من SEO (Google Search Console)

## ملاحظات

- ✅ تم إزالة جميع استخدامات localhost
- ✅ تم إزالة جميع الـ ports الثابتة
- ✅ جميع الإعدادات تعتمد على Environment Variables
- ✅ CORS محسّن للـ production
- ✅ Instagram API جاهز للاستخدام
