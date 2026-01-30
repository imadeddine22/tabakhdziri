# 🍽️ Tabakh Dziri - Food Delivery Platform

<div align="center">

![Tabakh Dziri](https://img.shields.io/badge/Tabakh-Dziri-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-24.x-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)

منصة توصيل طعام جزائرية حديثة مع لوحة إدارة متكاملة

[الموقع الرسمي](https://tabakhdziri.com) • [التوثيق](#-التوثيق) • [الدعم](#-الدعم)

</div>

---

## 📋 المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [البنية](#-البنية)
- [التثبيت المحلي](#-التثبيت-المحلي)
- [النشر على VPS](#-النشر-على-vps)
- [الاستخدام](#-الاستخدام)
- [API Documentation](#-api-documentation)
- [المساهمة](#-المساهمة)
- [الترخيص](#-الترخيص)

---

## 🌟 نظرة عامة

**Tabakh Dziri** هي منصة توصيل طعام حديثة مصممة خصيصاً للسوق الجزائري. توفر المنصة تجربة مستخدم سلسة للعملاء ولوحة إدارة قوية لأصحاب المطاعم.

### لماذا Tabakh Dziri؟

- ✅ **واجهة عصرية**: تصميم جذاب وسهل الاستخدام
- ✅ **متعدد اللغات**: دعم كامل للعربية والإنجليزية
- ✅ **متجاوب**: يعمل بشكل مثالي على جميع الأجهزة
- ✅ **آمن**: نظام مصادقة قوي وحماية البيانات
- ✅ **قابل للتوسع**: بنية معمارية حديثة وقابلة للتطوير

---

## ✨ المميزات

### للعملاء

- 🍕 **تصفح الأطباق**: عرض جميع الأطباق مع الصور والأسعار
- 🔍 **البحث والفلترة**: بحث سريع وفلترة حسب الفئات
- 🛒 **عربة التسوق**: إضافة وإدارة الطلبات بسهولة
- 👤 **حساب شخصي**: تتبع الطلبات وحفظ المعلومات
- 📱 **تصميم متجاوب**: تجربة مثالية على الهاتف والكمبيوتر
- 📧 **نموذج تواصل**: التواصل المباشر مع الإدارة
- 📸 **Instagram Integration**: عرض آخر المنشورات

### للإدارة

- 📊 **لوحة تحكم شاملة**: إحصائيات وتقارير مفصلة
- 🍽️ **إدارة الأطباق**: إضافة، تعديل، وحذف الأطباق
- 📂 **إدارة الفئات**: تنظيم الأطباق في فئات
- 📦 **إدارة الطلبات**: متابعة وتحديث حالة الطلبات
- 👥 **إدارة المستخدمين**: عرض وإدارة حسابات العملاء
- 🔐 **إدارة المشرفين**: إضافة وإدارة حسابات الإدارة
- 💬 **إدارة الرسائل**: الرد على استفسارات العملاء
- 📸 **إدارة Instagram**: إدارة منشورات Instagram

---

## 🛠️ التقنيات المستخدمة

### Frontend

- **Framework**: Next.js 16.1 (React 19)
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: TypeScript

### Backend

- **Runtime**: Node.js 24.x
- **Framework**: Express.js
- **Database**: MongoDB 7.0
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **Validation**: Express Validator
- **Email**: Nodemailer

### DevOps & Deployment

- **Web Server**: Nginx
- **Process Manager**: PM2
- **SSL**: Let's Encrypt (Certbot)
- **Version Control**: Git

---

## 📁 البنية

```
tabakh-dziri/
├── food-delivery-app/          # Frontend (Next.js)
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # لوحة الإدارة
│   │   ├── cart/              # عربة التسوق
│   │   ├── contact/           # صفحة التواصل
│   │   ├── dishes/            # صفحات الأطباق
│   │   ├── login/             # تسجيل الدخول
│   │   ├── profile/           # الملف الشخصي
│   │   └── services/          # صفحة الخدمات
│   ├── components/            # المكونات
│   ├── contexts/              # React Contexts
│   ├── lib/                   # المكتبات والـ API
│   ├── public/                # الملفات العامة
│   └── styles/                # ملفات CSS
│
├── food-delivery-backend/      # Backend (Express.js)
│   ├── config/                # ملفات التكوين
│   ├── controllers/           # Controllers
│   ├── middleware/            # Middleware
│   ├── models/                # MongoDB Models
│   ├── routes/                # API Routes
│   ├── uploads/               # الملفات المرفوعة
│   └── server.js              # نقطة البداية
│
├── .agent/                    # Workflows
│   └── workflows/
│       └── deploy-to-vps.md  # دليل النشر
│
├── backup.sh                  # سكريبت النسخ الاحتياطي
├── health-check.sh            # سكريبت المراقبة
├── update.sh                  # سكريبت التحديث
├── ecosystem.config.js        # تكوين PM2
├── nginx.conf                 # تكوين Nginx
├── DEPLOYMENT.md              # دليل النشر السريع
├── DEPLOYMENT_CHECKLIST.md    # قائمة التحقق
└── README.md                  # هذا الملف
```

---

## 💻 التثبيت المحلي

### المتطلبات

- Node.js 24.x أو أحدث
- MongoDB 7.0 أو أحدث
- npm أو yarn

### الخطوات

#### 1. استنساخ المشروع

```bash
git clone https://github.com/YOUR_USERNAME/tabakhdziri.git
cd tabakhdziri
```

#### 2. إعداد Backend

```bash
cd food-delivery-backend

# تثبيت Dependencies
npm install

# نسخ ملف البيئة
cp .env.example .env

# تعديل ملف .env
nano .env
```

في ملف `.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tabakh-dziri
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

```bash
# تشغيل Backend
npm run dev
```

Backend سيعمل على: `http://localhost:5000`

#### 3. إعداد Frontend

في نافذة terminal جديدة:

```bash
cd food-delivery-app

# تثبيت Dependencies
npm install

# نسخ ملف البيئة
cp .env.local.example .env.local

# تعديل ملف .env.local
nano .env.local
```

في ملف `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
# تشغيل Frontend
npm run dev
```

Frontend سيعمل على: `http://localhost:3000`

#### 4. إنشاء مستخدم Admin

```bash
cd food-delivery-backend
node create-admin.js
```

البيانات الافتراضية:
- Email: `admin@tabakhdziri.com`
- Password: `admin123`

---

## 🚀 النشر على VPS

لنشر المشروع على VPS مع النطاق `tabakhdziri.com`، اتبع الدليل الشامل:

### الدليل الكامل

راجع ملف [`.agent/workflows/deploy-to-vps.md`](.agent/workflows/deploy-to-vps.md) للحصول على دليل مفصل خطوة بخطوة.

### الدليل السريع

راجع ملف [`DEPLOYMENT.md`](DEPLOYMENT.md) للحصول على ملخص سريع.

### قائمة التحقق

استخدم [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) للتأكد من اكتمال جميع الخطوات.

### الملفات المساعدة

- **`ecosystem.config.js`**: تكوين PM2 لإدارة العمليات
- **`nginx.conf`**: تكوين Nginx
- **`backup.sh`**: سكريبت النسخ الاحتياطي التلقائي
- **`health-check.sh`**: سكريبت مراقبة صحة التطبيق
- **`update.sh`**: سكريبت تحديث المشروع بأمان

---

## 📖 الاستخدام

### الوصول إلى التطبيق

- **الموقع الرئيسي**: https://tabakhdziri.com
- **لوحة الإدارة**: https://tabakhdziri.com/admin

### حسابات الاختبار

#### Admin
- Email: `admin@tabakhdziri.com`
- Password: (تم تعيينها عند التثبيت)

### الوظائف الأساسية

#### للعملاء

1. **تصفح الأطباق**: من الصفحة الرئيسية
2. **البحث**: استخدم شريط البحث في الأعلى
3. **الفلترة**: اختر فئة معينة
4. **إضافة إلى السلة**: انقر على "أضف إلى السلة"
5. **إتمام الطلب**: اذهب إلى السلة وأكمل الطلب
6. **تتبع الطلبات**: من صفحة الملف الشخصي

#### للإدارة

1. **تسجيل الدخول**: https://tabakhdziri.com/admin/login
2. **لوحة التحكم**: عرض الإحصائيات
3. **إدارة الأطباق**: إضافة/تعديل/حذف الأطباق
4. **إدارة الطلبات**: تحديث حالة الطلبات
5. **إدارة المستخدمين**: عرض وإدارة العملاء

---

## 📚 API Documentation

### Base URL

```
Production: https://tabakhdziri.com/api
Development: http://localhost:5000/api
```

### Authentication

معظم endpoints تتطلب JWT token في header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Endpoints الرئيسية

#### Authentication

```
POST   /api/auth/register      # تسجيل مستخدم جديد
POST   /api/auth/login         # تسجيل الدخول
GET    /api/auth/profile       # الحصول على بيانات المستخدم
PUT    /api/auth/profile       # تحديث بيانات المستخدم
```

#### Dishes (الأطباق)

```
GET    /api/dishes             # جميع الأطباق
GET    /api/dishes/:id         # طبق محدد
POST   /api/dishes             # إضافة طبق (Admin)
PUT    /api/dishes/:id         # تحديث طبق (Admin)
DELETE /api/dishes/:id         # حذف طبق (Admin)
```

#### Categories (الفئات)

```
GET    /api/categories         # جميع الفئات
GET    /api/categories/:id     # فئة محددة
POST   /api/categories         # إضافة فئة (Admin)
PUT    /api/categories/:id     # تحديث فئة (Admin)
DELETE /api/categories/:id     # حذف فئة (Admin)
```

#### Orders (الطلبات)

```
GET    /api/orders             # طلبات المستخدم
GET    /api/orders/:id         # طلب محدد
POST   /api/orders             # إنشاء طلب
PUT    /api/orders/:id/status  # تحديث حالة الطلب (Admin)
```

#### Contact (التواصل)

```
POST   /api/contact            # إرسال رسالة
GET    /api/contact            # جميع الرسائل (Admin)
PUT    /api/contact/:id/status # تحديث حالة الرسالة (Admin)
```

للمزيد من التفاصيل، راجع ملفات routes في مجلد `food-delivery-backend/routes/`.

---

## 🔧 الصيانة

### النسخ الاحتياطي

#### تلقائي (يومي)

```bash
# تم إعداده في cron
0 2 * * * /usr/local/bin/tabakh-backup.sh
```

#### يدوي

```bash
/usr/local/bin/tabakh-backup.sh
```

### التحديثات

```bash
# تحديث آمن مع نسخ احتياطي
/usr/local/bin/update.sh
```

### المراقبة

```bash
# فحص صحة التطبيق
/usr/local/bin/health-check.sh

# عرض سجلات PM2
pm2 logs

# عرض حالة PM2
pm2 status
```

---

## 🤝 المساهمة

نرحب بالمساهمات! إذا كنت تريد المساهمة:

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

---

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك أسئلة:

- 📧 Email: support@tabakhdziri.com
- 🌐 Website: https://tabakhdziri.com/contact
- 📱 Phone: +213XXXXXXXXX

---

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

---

## 🙏 شكر وتقدير

- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://greensock.com/gsap/)

---

<div align="center">

**صُنع بـ ❤️ في الجزائر**

[⬆ العودة للأعلى](#️-tabakh-dziri---food-delivery-platform)

</div>
