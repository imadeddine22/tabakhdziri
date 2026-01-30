# 🚀 دليل البدء السريع - Tabakh Dziri

## خطوات النشر على VPS بالتفصيل

### 📋 ما تحتاجه قبل البدء

1. **VPS Server**
   - نظام التشغيل: Ubuntu 20.04 أو 22.04
   - RAM: 2GB على الأقل
   - Storage: 20GB على الأقل
   - IP Address الخاص بالـ VPS

2. **النطاق (Domain)**
   - النطاق: `tabakhdziri.com`
   - الوصول إلى لوحة تحكم DNS

3. **MongoDB**
   - خيار 1: MongoDB Atlas (مجاني، موصى به)
   - خيار 2: تثبيت MongoDB على VPS

---

## 🎯 الخطوات الأساسية (ملخص)

### 1️⃣ إعداد VPS (10 دقائق)

```bash
# الاتصال بـ VPS
ssh root@YOUR_VPS_IP

# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 24
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 24
nvm use 24

# تثبيت الأدوات
sudo apt install nginx git -y
npm install -g pm2
```

### 2️⃣ رفع الكود (5 دقائق)

```bash
# إنشاء مجلد المشروع
sudo mkdir -p /var/www/tabakhdziri
sudo chown -R $USER:$USER /var/www/tabakhdziri

# رفع الملفات (استخدم إحدى الطرق)
# الطريقة 1: Git
cd /var/www/tabakhdziri
git clone YOUR_REPO_URL .

# الطريقة 2: SCP من جهازك
# على Windows PowerShell:
# scp -r "c:\Users\DELL\Desktop\tabakh dziri\*" root@YOUR_VPS_IP:/var/www/tabakhdziri/
```

### 3️⃣ إعداد Backend (5 دقائق)

```bash
cd /var/www/tabakhdziri/food-delivery-backend
npm install --production

# إنشاء ملف .env
nano .env
```

أضف في `.env`:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING
FRONTEND_URL=https://tabakhdziri.com
```

```bash
# إنشاء مجلدات الصور
mkdir -p uploads/dishes uploads/categories uploads/instagram
chmod -R 755 uploads
```

### 4️⃣ إعداد Frontend (5 دقائق)

```bash
cd /var/www/tabakhdziri/food-delivery-app
npm install

# إنشاء ملف .env.local
nano .env.local
```

أضف في `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://tabakhdziri.com/api
```

```bash
# بناء المشروع
npm run build
```

### 5️⃣ تشغيل التطبيقات (3 دقائق)

```bash
# تشغيل Backend
cd /var/www/tabakhdziri/food-delivery-backend
pm2 start server.js --name tabakh-backend

# تشغيل Frontend
cd /var/www/tabakhdziri/food-delivery-app
pm2 start npm --name tabakh-frontend -- start

# حفظ التكوين
pm2 save
pm2 startup
```

### 6️⃣ إعداد Nginx (5 دقائق)

```bash
sudo nano /etc/nginx/sites-available/tabakhdziri.com
```

انسخ المحتوى من ملف `nginx.conf` في المشروع، ثم:

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/tabakhdziri.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# اختبار وإعادة تشغيل
sudo nginx -t
sudo systemctl restart nginx
```

### 7️⃣ إعداد DNS (5 دقائق + وقت الانتشار)

في لوحة تحكم النطاق، أضف:

```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     3600
A       www     YOUR_VPS_IP     3600
```

انتظر 5-48 ساعة لانتشار DNS.

### 8️⃣ تثبيت SSL (5 دقائق)

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx -y

# الحصول على شهادة
sudo certbot --nginx -d tabakhdziri.com -d www.tabakhdziri.com

# تحديث .env في Backend
cd /var/www/tabakhdziri/food-delivery-backend
nano .env
# غيّر FRONTEND_URL إلى https://tabakhdziri.com

# إعادة تشغيل Backend
pm2 restart tabakh-backend
```

### 9️⃣ إنشاء Admin (2 دقيقة)

```bash
cd /var/www/tabakhdziri/food-delivery-backend
node create-admin.js
```

---

## ✅ التحقق من النجاح

### اختبر هذه الروابط:

1. **الموقع الرئيسي**: https://tabakhdziri.com
2. **API Health**: https://tabakhdziri.com/api/health
3. **لوحة الإدارة**: https://tabakhdziri.com/admin

### تحقق من PM2:

```bash
pm2 status
pm2 logs
```

يجب أن ترى:
- ✅ tabakh-backend: online
- ✅ tabakh-frontend: online

---

## 🔧 الأوامر المفيدة

### عرض السجلات

```bash
# سجلات PM2
pm2 logs

# سجلات Nginx
sudo tail -f /var/log/nginx/error.log
```

### إعادة التشغيل

```bash
# إعادة تشغيل التطبيقات
pm2 restart all

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

### التحديثات

```bash
cd /var/www/tabakhdziri
git pull
./update.sh
```

---

## 🆘 حل المشاكل الشائعة

### المشكلة: Backend لا يعمل

```bash
pm2 logs tabakh-backend
# تحقق من:
# - اتصال MongoDB
# - ملف .env صحيح
# - المنفذ 5000 غير مستخدم
```

### المشكلة: Frontend لا يعمل

```bash
pm2 logs tabakh-frontend
# تحقق من:
# - NEXT_PUBLIC_API_URL صحيح
# - البناء تم بنجاح (npm run build)
```

### المشكلة: الموقع لا يفتح

```bash
# تحقق من Nginx
sudo nginx -t
sudo systemctl status nginx

# تحقق من Firewall
sudo ufw status
sudo ufw allow 'Nginx Full'
```

### المشكلة: الصور لا تظهر

```bash
# تحقق من الصلاحيات
ls -la /var/www/tabakhdziri/food-delivery-backend/uploads

# إصلاح الصلاحيات
chmod -R 755 /var/www/tabakhdziri/food-delivery-backend/uploads
```

---

## 📚 الملفات المرجعية

- **الدليل الكامل**: `.agent/workflows/deploy-to-vps.md`
- **الدليل السريع**: `DEPLOYMENT.md`
- **قائمة التحقق**: `DEPLOYMENT_CHECKLIST.md`
- **README**: `README.md`

---

## 🔐 أمان مهم!

### غيّر هذه القيم فوراً:

1. ✅ كلمة مرور Admin
2. ✅ JWT_SECRET في .env
3. ✅ كلمة مرور MongoDB
4. ✅ كلمة مرور VPS

### لا ترفع هذه الملفات إلى Git:

- ❌ `.env`
- ❌ `.env.local`
- ❌ `uploads/`
- ❌ `node_modules/`

---

## 📞 تحتاج مساعدة؟

راجع الملفات التالية للمزيد من التفاصيل:

1. **للنشر الكامل**: `.agent/workflows/deploy-to-vps.md`
2. **للأوامر السريعة**: `DEPLOYMENT.md`
3. **للتحقق من الخطوات**: `DEPLOYMENT_CHECKLIST.md`

---

**وقت النشر المتوقع**: 45-60 دقيقة (بدون وقت انتشار DNS)

**صعوبة**: متوسطة ⭐⭐⭐

**نصيحة**: اتبع الخطوات بالترتيب ولا تتخطى أي خطوة!

---

✨ **بالتوفيق في نشر مشروعك!** ✨
