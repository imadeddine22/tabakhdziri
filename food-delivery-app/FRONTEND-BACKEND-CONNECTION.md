# ✅ تم ربط Frontend بـ Backend بنجاح

## 📋 معلومات الاتصال

### Backend (الخادم)
- **URL**: `http://localhost:5000`
- **API Base URL**: `http://localhost:5000/api`
- **قاعدة البيانات**: MongoDB Atlas
  - **Connection String**: `mongodb+srv://jamal:jamal12345@cluster0.3vbkmym.mongodb.net/tabakh_dziri`
- **الحالة**: ✅ يعمل

### Frontend (الواجهة)
- **URL**: `http://localhost:3000`
- **API URL**: `http://localhost:5000/api` (محفوظ في `.env.local`)
- **الحالة**: ✅ يعمل

## 🔗 نقاط النهاية (API Endpoints)

### المصادقة (Authentication)
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي (يتطلب Token)

### الطلبات (Orders)
- `POST /api/orders` - إنشاء طلب جديد (يتطلب Token)
- `GET /api/orders` - الحصول على طلبات المستخدم (يتطلب Token)
- `GET /api/orders/:id` - الحصول على طلب محدد (يتطلب Token)
- `PUT /api/orders/:id` - تحديث طلب (يتطلب Token)
- `DELETE /api/orders/:id` - حذف طلب (يتطلب Token)

### المستخدمين (Users)
- `GET /api/users/profile` - الحصول على الملف الشخصي (يتطلب Token)
- `PUT /api/users/profile` - تحديث الملف الشخصي (يتطلب Token)

### الاتصال (Contact)
- `POST /api/contact` - إرسال رسالة اتصال

### الصحة (Health Check)
- `GET /api/health` - التحقق من حالة الخادم

## 🚀 كيفية التشغيل

### تشغيل Backend
```bash
cd food-delivery-backend
npm start
```

### تشغيل Frontend
```bash
cd food-delivery-app
npm run dev
```

## 🔐 المصادقة (Authentication)

يستخدم النظام **JWT (JSON Web Tokens)** للمصادقة:

1. عند التسجيل أو تسجيل الدخول، يحصل المستخدم على Token
2. يتم حفظ الـ Token في `localStorage`
3. يتم إرسال الـ Token تلقائياً مع كل طلب في الـ Header:
   ```
   Authorization: Bearer <token>
   ```

## 📝 استخدام API في Frontend

### مثال: تسجيل مستخدم جديد
```javascript
import { authAPI, saveAuthData } from '@/lib/api';

const handleRegister = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    const { user, token } = response;
    
    // حفظ بيانات المستخدم والـ Token
    saveAuthData(token, user);
    
    console.log('تم التسجيل بنجاح:', user);
  } catch (error) {
    console.error('خطأ في التسجيل:', error.message);
  }
};
```

### مثال: تسجيل الدخول
```javascript
import { authAPI, saveAuthData } from '@/lib/api';

const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    const { user, token } = response;
    
    saveAuthData(token, user);
    console.log('تم تسجيل الدخول:', user);
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error.message);
  }
};
```

### مثال: إنشاء طلب
```javascript
import { ordersAPI } from '@/lib/api';

const handleCreateOrder = async (orderData) => {
  try {
    const response = await ordersAPI.create(orderData);
    console.log('تم إنشاء الطلب:', response.data);
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error.message);
  }
};
```

## 🔧 إعدادات CORS

الـ Backend مُعد للسماح بالطلبات من:
- `http://localhost:3000` (Frontend في وضع التطوير)

## 📊 قاعدة البيانات

### Collections (المجموعات)
- **users** - بيانات المستخدمين
- **orders** - الطلبات
- **contacts** - رسائل الاتصال

### Models (النماذج)
تم تعريف النماذج التالية باستخدام Mongoose:
- `User` - نموذج المستخدم
- `Order` - نموذج الطلب
- `Contact` - نموذج رسالة الاتصال

## ⚠️ ملاحظات مهمة

1. **Environment Variables**: تأكد من وجود ملف `.env.local` في Frontend يحتوي على:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

2. **Backend .env**: تأكد من وجود ملف `.env` في Backend يحتوي على:
   ```
   MONGODB_URI=mongodb+srv://jamal:jamal12345@cluster0.3vbkmym.mongodb.net/tabakh_dziri?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=tabakh_dziri_super_secret_jwt_key_2026
   JWT_EXPIRE=30d
   ```

3. **Token Expiration**: الـ Token صالح لمدة 30 يوم

4. **Error Handling**: جميع الأخطاء يتم التعامل معها وإرجاع رسائل واضحة

## 🧪 اختبار الاتصال

لاختبار الاتصال بين Frontend و Backend:
```bash
cd food-delivery-app
node test-backend-connection.js
```

## ✅ الحالة الحالية

- ✅ Backend متصل بـ MongoDB Atlas
- ✅ Frontend مُعد للاتصال بـ Backend
- ✅ CORS مُعد بشكل صحيح
- ✅ المصادقة تعمل بشكل صحيح
- ✅ جميع API endpoints جاهزة

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تأكد من تشغيل Backend على المنفذ 5000
2. تأكد من تشغيل Frontend على المنفذ 3000
3. تحقق من ملفات `.env` و `.env.local`
4. راجع console logs في المتصفح و terminal
