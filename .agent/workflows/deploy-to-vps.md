---
description: دليل نشر المشروع على VPS مع النطاق tabakhdziri.com
---

# دليل نشر Tabakh Dziri على VPS

هذا الدليل يشرح خطوة بخطوة كيفية نشر مشروع Tabakh Dziri (Backend + Frontend) على VPS مع النطاق `tabakhdziri.com`.

## المتطلبات الأساسية

1. **VPS Server** (Ubuntu 20.04/22.04 موصى به)
   - RAM: 2GB على الأقل
   - Storage: 20GB على الأقل
   - معلومات الدخول: IP address, username, password/SSH key

2. **Domain Name**: `tabakhdziri.com` (مسجل ومجهز)

3. **MongoDB**: إما MongoDB Atlas (سحابي) أو تثبيت محلي على VPS

## الجزء الأول: إعداد VPS

### 1. الاتصال بـ VPS عبر SSH

```bash
ssh root@YOUR_VPS_IP
# أو إذا كان لديك مستخدم آخر
ssh username@YOUR_VPS_IP
```

### 2. تحديث النظام

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. تثبيت Node.js (الإصدار 24.x)

```bash
# تثبيت nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# تفعيل nvm
source ~/.bashrc

# تثبيت Node.js 24
nvm install 24
nvm use 24
nvm alias default 24

# التحقق من الإصدار
node --version
npm --version
```

### 4. تثبيت Nginx (Web Server)

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. تثبيت PM2 (Process Manager)

```bash
npm install -g pm2
```

### 6. تثبيت Git

```bash
sudo apt install git -y
```

### 7. إعداد Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## الجزء الثاني: إعداد MongoDB

### الخيار 1: استخدام MongoDB Atlas (موصى به)

1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ حساب مجاني
3. أنشئ Cluster جديد
4. احصل على Connection String
5. أضف IP الخاص بـ VPS إلى Whitelist

### الخيار 2: تثبيت MongoDB محلياً على VPS

```bash
# استيراد المفتاح العام
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# إضافة مستودع MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# تحديث وتثبيت
sudo apt update
sudo apt install -y mongodb-org

# تشغيل MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# التحقق من الحالة
sudo systemctl status mongod
```

## الجزء الثالث: رفع الكود إلى VPS

### 1. إنشاء مجلد للمشروع

```bash
sudo mkdir -p /var/www/tabakhdziri
sudo chown -R $USER:$USER /var/www/tabakhdziri
cd /var/www/tabakhdziri
```

### 2. رفع الكود (اختر إحدى الطرق)

#### الطريقة 1: استخدام Git (موصى به)

```bash
# إذا كان المشروع على GitHub
git clone https://github.com/YOUR_USERNAME/tabakhdziri.git .

# أو إذا كنت تريد إنشاء repository جديد
# على جهازك المحلي:
# cd "c:\Users\DELL\Desktop\tabakh dziri"
# git remote add production root@YOUR_VPS_IP:/var/www/tabakhdziri
# git push production main
```

#### الطريقة 2: استخدام SCP/SFTP

على جهازك المحلي (Windows PowerShell):
```powershell
# رفع Backend
scp -r "c:\Users\DELL\Desktop\tabakh dziri\food-delivery-backend" root@YOUR_VPS_IP:/var/www/tabakhdziri/

# رفع Frontend
scp -r "c:\Users\DELL\Desktop\tabakh dziri\food-delivery-app" root@YOUR_VPS_IP:/var/www/tabakhdziri/
```

## الجزء الرابع: إعداد Backend

### 1. الانتقال إلى مجلد Backend

```bash
cd /var/www/tabakhdziri/food-delivery-backend
```

### 2. تثبيت Dependencies

```bash
npm install --production
```

### 3. إنشاء ملف .env

```bash
nano .env
```

أضف المتغيرات التالية:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/tabakh-dziri
# أو إذا كنت تستخدم MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tabakh-dziri

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=https://tabakhdziri.com

# Email Configuration (إذا كنت تستخدم إرسال البريد)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Instagram API (إذا كان موجود)
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
```

احفظ الملف: `Ctrl+X` ثم `Y` ثم `Enter`

### 4. إنشاء مجلد للصور

```bash
mkdir -p uploads/dishes uploads/categories uploads/instagram
chmod -R 755 uploads
```

### 5. تشغيل Backend بواسطة PM2

```bash
pm2 start server.js --name tabakh-backend
pm2 save
pm2 startup
```

### 6. التحقق من عمل Backend

```bash
pm2 status
pm2 logs tabakh-backend
curl http://localhost:5000/api/health
```

## الجزء الخامس: إعداد Frontend

### 1. الانتقال إلى مجلد Frontend

```bash
cd /var/www/tabakhdziri/food-delivery-app
```

### 2. تثبيت Dependencies

```bash
npm install
```

### 3. إنشاء ملف .env.local

```bash
nano .env.local
```

أضف:

```env
NEXT_PUBLIC_API_URL=https://api.tabakhdziri.com
# أو إذا كنت تريد استخدام subdomain واحد:
# NEXT_PUBLIC_API_URL=https://tabakhdziri.com/api
```

### 4. بناء المشروع

```bash
npm run build
```

### 5. تشغيل Frontend بواسطة PM2

```bash
pm2 start npm --name tabakh-frontend -- start
pm2 save
```

### 6. التحقق من عمل Frontend

```bash
pm2 status
pm2 logs tabakh-frontend
```

## الجزء السادس: إعداد Nginx

### 1. إنشاء ملف تكوين Nginx

```bash
sudo nano /etc/nginx/sites-available/tabakhdziri.com
```

### الخيار 1: Backend و Frontend على نفس الدومين

```nginx
# Backend API على /api
# Frontend على المسار الرئيسي

server {
    listen 80;
    server_name tabakhdziri.com www.tabakhdziri.com;

    # حد أقصى لحجم الملفات المرفوعة
    client_max_body_size 10M;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
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
        alias /var/www/tabakhdziri/food-delivery-backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
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

### الخيار 2: Backend على subdomain منفصل

```nginx
# ملف 1: Backend على api.tabakhdziri.com
server {
    listen 80;
    server_name api.tabakhdziri.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/tabakhdziri/food-delivery-backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# ملف 2: Frontend على tabakhdziri.com
server {
    listen 80;
    server_name tabakhdziri.com www.tabakhdziri.com;

    location / {
        proxy_pass http://localhost:3000;
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

### 2. تفعيل التكوين

```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/tabakhdziri.com /etc/nginx/sites-enabled/

# حذف التكوين الافتراضي
sudo rm /etc/nginx/sites-enabled/default

# اختبار التكوين
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

## الجزء السابع: إعداد DNS للدومين

### 1. في لوحة تحكم الدومين (Domain Registrar)

أضف السجلات التالية:

#### إذا كنت تستخدم الخيار 1 (كل شيء على نفس الدومين):

```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     3600
A       www     YOUR_VPS_IP     3600
```

#### إذا كنت تستخدم الخيار 2 (subdomain للـ API):

```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     3600
A       www     YOUR_VPS_IP     3600
A       api     YOUR_VPS_IP     3600
```

### 2. انتظر انتشار DNS (5-48 ساعة)

يمكنك التحقق من انتشار DNS على: https://dnschecker.org

## الجزء الثامن: تثبيت SSL Certificate (HTTPS)

### 1. تثبيت Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. الحصول على SSL Certificate

#### للخيار 1:
```bash
sudo certbot --nginx -d tabakhdziri.com -d www.tabakhdziri.com
```

#### للخيار 2:
```bash
sudo certbot --nginx -d tabakhdziri.com -d www.tabakhdziri.com -d api.tabakhdziri.com
```

### 3. تجديد تلقائي للشهادة

```bash
# اختبار التجديد
sudo certbot renew --dry-run

# Certbot يضيف تلقائياً cron job للتجديد
```

### 4. تحديث متغيرات البيئة

بعد تفعيل SSL، حدّث ملف `.env` في Backend:

```bash
cd /var/www/tabakhdziri/food-delivery-backend
nano .env
```

غيّر:
```env
FRONTEND_URL=https://tabakhdziri.com
```

ثم أعد تشغيل Backend:
```bash
pm2 restart tabakh-backend
```

## الجزء التاسع: إنشاء مستخدم Admin أولي

### 1. الاتصال بـ MongoDB

```bash
# إذا كان MongoDB محلي
mongosh

# إذا كان MongoDB Atlas
mongosh "mongodb+srv://cluster.mongodb.net/tabakh-dziri" --username YOUR_USERNAME
```

### 2. إنشاء Admin

```javascript
use tabakh-dziri

// إنشاء admin (كلمة المرور: admin123 - غيّرها بعد أول تسجيل دخول)
db.users.insertOne({
  name: "Admin",
  email: "admin@tabakhdziri.com",
  password: "$2a$10$YourHashedPasswordHere", // استخدم bcrypt لتشفير كلمة المرور
  phone: "+213XXXXXXXXX",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

// للخروج
exit
```

أو استخدم endpoint التسجيل من Frontend ثم حدّث الـ role يدوياً في قاعدة البيانات.

## الجزء العاشر: المراقبة والصيانة

### 1. مراقبة التطبيقات

```bash
# عرض حالة جميع التطبيقات
pm2 status

# عرض logs
pm2 logs

# عرض logs لتطبيق معين
pm2 logs tabakh-backend
pm2 logs tabakh-frontend

# مراقبة الموارد
pm2 monit
```

### 2. إعادة التشغيل

```bash
# إعادة تشغيل Backend
pm2 restart tabakh-backend

# إعادة تشغيل Frontend
pm2 restart tabakh-frontend

# إعادة تشغيل الكل
pm2 restart all
```

### 3. التحديثات

```bash
cd /var/www/tabakhdziri

# سحب آخر التحديثات
git pull

# تحديث Backend
cd food-delivery-backend
npm install
pm2 restart tabakh-backend

# تحديث Frontend
cd ../food-delivery-app
npm install
npm run build
pm2 restart tabakh-frontend
```

### 4. النسخ الاحتياطي

#### نسخ احتياطي لقاعدة البيانات:

```bash
# إنشاء مجلد للنسخ الاحتياطية
mkdir -p /var/backups/mongodb

# نسخ احتياطي
mongodump --out /var/backups/mongodb/backup-$(date +%Y%m%d)

# أو للـ MongoDB Atlas
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/tabakh-dziri" --out /var/backups/mongodb/backup-$(date +%Y%m%d)
```

#### نسخ احتياطي للصور:

```bash
# نسخ احتياطي لمجلد uploads
tar -czf /var/backups/uploads-$(date +%Y%m%d).tar.gz /var/www/tabakhdziri/food-delivery-backend/uploads
```

#### جدولة النسخ الاحتياطي التلقائي:

```bash
# فتح crontab
crontab -e

# إضافة نسخ احتياطي يومي في الساعة 2 صباحاً
0 2 * * * mongodump --out /var/backups/mongodb/backup-$(date +\%Y\%m\%d)
0 3 * * * tar -czf /var/backups/uploads-$(date +\%Y\%m\%d).tar.gz /var/www/tabakhdziri/food-delivery-backend/uploads
```

## الجزء الحادي عشر: الأمان

### 1. تأمين MongoDB

```bash
# إذا كان MongoDB محلي، فعّل المصادقة
sudo nano /etc/mongod.conf
```

أضف:
```yaml
security:
  authorization: enabled
```

ثم أنشئ مستخدم:
```javascript
mongosh
use admin
db.createUser({
  user: "dbadmin",
  pwd: "strong-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})
```

### 2. تأمين SSH

```bash
# تعطيل تسجيل الدخول كـ root
sudo nano /etc/ssh/sshd_config
```

غيّر:
```
PermitRootLogin no
PasswordAuthentication no  # إذا كنت تستخدم SSH keys
```

```bash
sudo systemctl restart sshd
```

### 3. تثبيت Fail2Ban (حماية من هجمات Brute Force)

```bash
sudo apt install fail2ban -y
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

## استكشاف الأخطاء

### المشكلة: Backend لا يعمل

```bash
pm2 logs tabakh-backend
# تحقق من الأخطاء في logs
# تحقق من اتصال MongoDB
# تحقق من ملف .env
```

### المشكلة: Frontend لا يعمل

```bash
pm2 logs tabakh-frontend
# تحقق من NEXT_PUBLIC_API_URL في .env.local
# تحقق من أن البناء تم بنجاح
```

### المشكلة: الصور لا تظهر

```bash
# تحقق من صلاحيات مجلد uploads
ls -la /var/www/tabakhdziri/food-delivery-backend/uploads

# تحقق من تكوين Nginx للـ /uploads location
sudo nginx -t
```

### المشكلة: SSL لا يعمل

```bash
# تحقق من حالة Certbot
sudo certbot certificates

# تحقق من تكوين Nginx
sudo nginx -t

# أعد تشغيل Nginx
sudo systemctl restart nginx
```

## الخلاصة

بعد اتباع هذه الخطوات، سيكون لديك:

✅ Backend يعمل على `https://tabakhdziri.com/api` (أو `https://api.tabakhdziri.com`)
✅ Frontend يعمل على `https://tabakhdziri.com`
✅ SSL Certificate مفعّل
✅ PM2 لإدارة العمليات
✅ Nginx كـ Reverse Proxy
✅ MongoDB للبيانات
✅ نسخ احتياطية تلقائية

## روابط مفيدة

- PM2 Documentation: https://pm2.keymetrics.io/docs/usage/quick-start/
- Nginx Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**ملاحظة مهمة**: تأكد من تغيير جميع كلمات المرور والمفاتيح السرية قبل النشر في الإنتاج!
