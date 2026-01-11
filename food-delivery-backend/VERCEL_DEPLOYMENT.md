# 🚀 دليل نشر Backend على Vercel

## ✅ الإعدادات المطلوبة

### 📋 **في Vercel Dashboard:**

#### **1. إنشاء Project جديد:**
1. اذهب إلى: https://vercel.com/dashboard
2. انقر على **"Add New"** → **"Project"**
3. استورد repository من GitHub
4. اختر مجلد `food-delivery-backend`

#### **2. Project Settings:**

```
Framework Preset: Other
Root Directory: food-delivery-backend
Build Command: (اتركه فارغاً)
Output Directory: (اتركه فارغاً)
Install Command: npm install
```

#### **3. Environment Variables:**

أضف المتغيرات التالية (واحدة تلو الأخرى):

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
FRONTEND_URL=https://your-frontend-app.vercel.app
```

⚠️ **مهم:** استبدل القيم بالقيم الحقيقية من ملف `.env` المحلي

#### **4. Deploy:**
انقر على **"Deploy"** وانتظر اكتمال النشر

---

## 🔍 **بعد النشر - اختبار:**

### **1. Root Route:**
```
https://your-backend-app.vercel.app/
```

يجب أن يعرض:
```json
{
  "success": true,
  "message": "Tabakh Dziri API is running",
  "version": "1.0.0"
}
```

### **2. Health Check:**
```
https://your-backend-app.vercel.app/api/health
```

### **3. Test Products:**
```
https://your-backend-app.vercel.app/api/products
```

---

## ⚙️ **MongoDB Atlas - Network Access:**

1. اذهب إلى: https://cloud.mongodb.com/
2. **Network Access** → **Add IP Address**
3. اختر **"Allow Access from Anywhere"** (`0.0.0.0/0`)
4. احفظ

---

## 🔄 **تحديث Frontend:**

بعد النشر الناجح للـ Backend:

1. انسخ رابط Backend من Vercel:
   ```
   https://your-backend-app.vercel.app
   ```

2. في Frontend (Vercel Dashboard):
   - Settings → Environment Variables
   - أضف/حدّث:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-app.vercel.app
     ```
   - Redeploy Frontend

---

## 📝 **ملاحظات مهمة:**

### ✅ **المزايا:**
- ✅ نفس المنصة لـ Frontend و Backend
- ✅ سهولة الإدارة
- ✅ Auto-deploy عند Git push
- ✅ Serverless - لا توجد cold starts طويلة

### ⚠️ **الحدود (Free Plan):**
- ⏱️ Serverless Function Timeout: 10 ثواني (Free), 60 ثانية (Pro)
- 📦 حجم الـ Function: 50MB
- 🔢 عدد Invocations: 100GB-hours شهرياً

### 🚨 **تنبيهات:**
1. **Serverless Functions** لها قيود زمنية - العمليات الطويلة قد تفشل
2. **WebSocket** غير مدعوم في Serverless
3. **File Uploads** تحتاج معالجة خاصة (استخدم Cloud Storage)

---

## 🐛 **استكشاف الأخطاء:**

### ❌ **Error: Function Timeout**
- السبب: العملية تستغرق أكثر من 10 ثواني
- الحل: حسّن الكود أو انتقل لـ Render/Railway

### ❌ **Error: Module not found**
- السبب: Dependencies غير مثبتة
- الحل: تأكد من `package.json` يحتوي على جميع dependencies

### ❌ **500 Internal Server Error**
- افحص Logs في Vercel Dashboard
- تحقق من Environment Variables
- تحقق من MongoDB connection

---

## 📊 **المقارنة: Vercel vs Render**

| الميزة | Vercel | Render |
|--------|--------|--------|
| **النوع** | Serverless | Traditional Server |
| **Cold Start** | سريع جداً | 30-60 ثانية (Free) |
| **Timeout** | 10s (Free), 60s (Pro) | لا يوجد |
| **File Uploads** | يحتاج Cloud Storage | مدعوم مباشرة |
| **WebSocket** | ❌ غير مدعوم | ✅ مدعوم |
| **السعر (Free)** | 100GB-hours | 750 ساعة/شهر |
| **Best For** | APIs بسيطة وسريعة | Full-featured backends |

---

## 💡 **التوصية:**

### استخدم **Vercel** إذا:
- ✅ API بسيط بدون عمليات طويلة
- ✅ لا تحتاج file uploads كثيرة
- ✅ لا تحتاج WebSocket
- ✅ كل شيء في نفس المنصة

### استخدم **Render** إذا:
- ✅ تحتاج file uploads
- ✅ عمليات قد تستغرق وقتاً طويلاً
- ✅ تحتاج WebSocket
- ✅ Backend كامل المميزات

---

## 🔄 **للتبديل بين Vercel و Render:**

الكود الآن يدعم **كلاهما**! 

- في **Vercel**: يعمل كـ Serverless Function
- في **Render**: يعمل كـ Traditional Server

لا حاجة لتغيير الكود للتبديل بين المنصتين.

---

**آخر تحديث:** 2026-01-12
