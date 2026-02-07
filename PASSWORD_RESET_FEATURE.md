# ميزة إعادة تعيين كلمة المرور - Password Reset Feature

## نظرة عامة | Overview

تم إضافة ميزة كاملة لإعادة تعيين كلمة المرور تسمح للمستخدمين باستعادة حساباتهم عند نسيان كلمة المرور.

A complete password reset feature has been added that allows users to recover their accounts when they forget their password.

## كيفية العمل | How It Works

### 1. طلب إعادة التعيين | Request Reset
- المستخدم يدخل بريده الإلكتروني في صفحة `/forgot-password`
- النظام يرسل رمز مكون من 6 أرقام إلى البريد الإلكتروني
- الرمز صالح لمدة 10 دقائق فقط

### 2. التحقق من الرمز | Verify Code
- المستخدم يدخل الرمز المرسل في صفحة `/reset-password`
- النظام يتحقق من صحة الرمز وأنه لم ينتهي صلاحيته

### 3. تعيين كلمة مرور جديدة | Set New Password
- بعد التحقق الناجح، يمكن للمستخدم إدخال كلمة مرور جديدة
- يتم تحديث كلمة المرور وتسجيل الدخول تلقائياً

## التغييرات التقنية | Technical Changes

### Backend Changes

#### 1. User Model (`models/User.js`)
```javascript
// إضافة حقول جديدة
resetPasswordToken: String      // رمز إعادة التعيين
resetPasswordExpire: Date        // تاريخ انتهاء الصلاحية

// دالة جديدة لتوليد الرمز
generateResetToken()  // توليد رمز عشوائي من 6 أرقام
```

#### 2. Email Service (`utils/emailService.js`)
```javascript
// دالة جديدة لإرسال البريد الإلكتروني
sendPasswordResetEmail(email, name, resetToken)
```

#### 3. Auth Controller (`controllers/authController.js`)
```javascript
// دوال جديدة
forgotPassword()      // طلب إعادة التعيين
verifyResetToken()    // التحقق من الرمز
resetPassword()       // تعيين كلمة مرور جديدة
```

#### 4. Auth Routes (`routes/authRoutes.js`)
```javascript
POST /api/auth/forgot-password       // طلب رمز إعادة التعيين
POST /api/auth/verify-reset-token    // التحقق من الرمز
POST /api/auth/reset-password        // تعيين كلمة مرور جديدة
```

### Frontend Changes

#### 1. Forgot Password Page (`app/forgot-password/page.tsx`)
- صفحة لإدخال البريد الإلكتروني
- إرسال طلب إلى API لإرسال رمز التحقق
- إعادة التوجيه إلى صفحة إعادة التعيين

#### 2. Reset Password Page (`app/reset-password/page.tsx`)
- صفحة لإدخال رمز التحقق
- التحقق من الرمز
- إدخال كلمة المرور الجديدة
- إعادة التوجيه إلى صفحة تسجيل الدخول

#### 3. Login Page (`app/login/page.tsx`)
- يحتوي على رابط "نسيت كلمة المرور؟"

## API Endpoints

### 1. طلب إعادة التعيين | Request Reset
```
POST /api/auth/forgot-password
Body: { email: string }
Response: { success: true, message: "Password reset code sent to your email" }
```

### 2. التحقق من الرمز | Verify Token
```
POST /api/auth/verify-reset-token
Body: { email: string, token: string }
Response: { success: true, message: "Verification code is valid" }
```

### 3. إعادة تعيين كلمة المرور | Reset Password
```
POST /api/auth/reset-password
Body: { email: string, token: string, newPassword: string }
Response: { 
  success: true, 
  message: "Password reset successful",
  data: { user, token }
}
```

## متطلبات البريد الإلكتروني | Email Requirements

تأكد من تكوين متغيرات البيئة التالية في `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Tabakh Dziri <noreply@tabakhdziri.com>"
```

## الأمان | Security

1. **رمز عشوائي**: رمز مكون من 6 أرقام عشوائية
2. **انتهاء الصلاحية**: الرمز صالح لمدة 10 دقائق فقط
3. **تشفير كلمة المرور**: يتم تشفير كلمة المرور الجديدة تلقائياً
4. **استخدام واحد**: الرمز يُحذف بعد الاستخدام

## تحسينات مستقبلية | Future Improvements

- [ ] إضافة حد أقصى لعدد المحاولات
- [ ] إضافة CAPTCHA لمنع الهجمات الآلية
- [ ] إرسال إشعار عند تغيير كلمة المرور
- [ ] دعم إعادة إرسال الرمز
- [ ] سجل لمحاولات إعادة التعيين

## الاختبار | Testing

### اختبار يدوي | Manual Testing

1. انتقل إلى `/login`
2. اضغط على "نسيت كلمة المرور؟"
3. أدخل بريدك الإلكتروني
4. تحقق من بريدك الإلكتروني للحصول على الرمز
5. أدخل الرمز في صفحة إعادة التعيين
6. أدخل كلمة مرور جديدة
7. تأكد من إمكانية تسجيل الدخول بكلمة المرور الجديدة

### حالات الاختبار | Test Cases

- ✅ إرسال رمز لبريد إلكتروني موجود
- ✅ رفض بريد إلكتروني غير موجود
- ✅ التحقق من رمز صحيح
- ✅ رفض رمز خاطئ
- ✅ رفض رمز منتهي الصلاحية
- ✅ تحديث كلمة المرور بنجاح
- ✅ التحقق من تطابق كلمات المرور

## الدعم | Support

للمساعدة أو الإبلاغ عن مشاكل، يرجى التواصل عبر:
- Email: contact@tabakhdziri.com
- GitHub Issues

---

تاريخ الإنشاء: 2026-02-07
الإصدار: 1.0.0
