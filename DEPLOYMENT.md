# دليل النشر السريع - Tabakh Dziri

## نظرة عامة

هذا المشروع يتكون من جزئين:
- **Backend**: Express.js + MongoDB (المنفذ 5000)
- **Frontend**: Next.js (المنفذ 3000)

## الملفات المهمة للنشر

### 1. ملفات التكوين

- `.env.production.example` - مثال لمتغيرات البيئة للـ Backend
- `env.production.example` - مثال لمتغيرات البيئة للـ Frontend
- `ecosystem.config.js` - تكوين PM2 لإدارة العمليات
- `backup.sh` - سكريبت النسخ الاحتياطي التلقائي

### 2. السكريبتات المساعدة

- `create-admin.js` - إنشاء مستخدم Admin في قاعدة البيانات

## خطوات النشر السريعة

### الخطوة 1: إعداد VPS

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 24
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 24
nvm use 24

# تثبيت الأدوات الأساسية
sudo apt install nginx git -y
npm install -g pm2
```

### الخطوة 2: رفع الكود

```bash
# إنشاء مجلد المشروع
sudo mkdir -p /var/www/tabakhdziri
sudo chown -R $USER:$USER /var/www/tabakhdziri
cd /var/www/tabakhdziri

# رفع الملفات (استخدم Git أو SCP)
# مثال باستخدام Git:
git clone YOUR_REPO_URL .
```

### الخطوة 3: إعداد Backend

```bash
cd /var/www/tabakhdziri/food-delivery-backend

# تثبيت Dependencies
npm install --production

# نسخ ملف البيئة
cp .env.production.example .env
nano .env  # عدّل المتغيرات حسب الحاجة

# إنشاء مجلدات الصور
mkdir -p uploads/dishes uploads/categories uploads/instagram
chmod -R 755 uploads
```

### الخطوة 4: إعداد Frontend

```bash
cd /var/www/tabakhdziri/food-delivery-app

# تثبيت Dependencies
npm install

# نسخ ملف البيئة
cp env.production.example .env.local
nano .env.local  # عدّل NEXT_PUBLIC_API_URL

# بناء المشروع
npm run build
```

### الخطوة 5: تشغيل التطبيقات بـ PM2

```bash
cd /var/www/tabakhdziri

# استخدام ملف ecosystem.config.js
pm2 start ecosystem.config.js

# أو تشغيل كل تطبيق على حدة:
# Backend
cd food-delivery-backend
pm2 start server.js --name tabakh-backend

# Frontend
cd ../food-delivery-app
pm2 start npm --name tabakh-frontend -- start

# حفظ التكوين
pm2 save
pm2 startup
```

### الخطوة 6: إعداد Nginx

```bash
# إنشاء ملف التكوين
sudo nano /etc/nginx/sites-available/tabakhdziri.com
```

أضف التكوين التالي:

```nginx
server {
    listen 80;
    server_name tabakhdziri.com www.tabakhdziri.com;
    client_max_body_size 10M;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        alias /var/www/tabakhdziri/food-delivery-backend/uploads;
        expires 30d;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# تفعيل التكوين
sudo ln -s /etc/nginx/sites-available/tabakhdziri.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### الخطوة 7: إعداد DNS

في لوحة تحكم النطاق، أضف:

```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     3600
A       www     YOUR_VPS_IP     3600
```

### الخطوة 8: تثبيت SSL

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx -y

# الحصول على شهادة SSL
sudo certbot --nginx -d tabakhdziri.com -d www.tabakhdziri.com

# اختبار التجديد التلقائي
sudo certbot renew --dry-run
```

### الخطوة 9: إنشاء مستخدم Admin

```bash
cd /var/www/tabakhdziri/food-delivery-backend
node create-admin.js
```

البيانات الافتراضية:
- Email: `admin@tabakhdziri.com`
- Password: `admin123`

⚠️ **مهم**: غيّر كلمة المرور بعد أول تسجيل دخول!

### الخطوة 10: إعداد النسخ الاحتياطي التلقائي

```bash
# نسخ سكريبت النسخ الاحتياطي
cp /var/www/tabakhdziri/backup.sh /usr/local/bin/tabakh-backup.sh
chmod +x /usr/local/bin/tabakh-backup.sh

# إضافة مهمة cron للنسخ الاحتياطي اليومي
crontab -e
```

أضف السطر التالي (نسخ احتياطي يومي في الساعة 2 صباحاً):

```
0 2 * * * /usr/local/bin/tabakh-backup.sh
```

## الأوامر المفيدة

### إدارة PM2

```bash
# عرض الحالة
pm2 status

# عرض السجلات
pm2 logs

# إعادة التشغيل
pm2 restart all

# إيقاف
pm2 stop all

# حذف
pm2 delete all
```

### إدارة Nginx

```bash
# اختبار التكوين
sudo nginx -t

# إعادة التشغيل
sudo systemctl restart nginx

# عرض السجلات
sudo tail -f /var/log/nginx/error.log
```

### التحديثات

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

### النسخ الاحتياطي اليدوي

```bash
# تشغيل النسخ الاحتياطي
/usr/local/bin/tabakh-backup.sh

# عرض النسخ الاحتياطية
ls -lh /var/backups/tabakhdziri/mongodb/
ls -lh /var/backups/tabakhdziri/uploads/
```

### استعادة النسخة الاحتياطية

```bash
# استعادة MongoDB
mongorestore --uri="mongodb://localhost:27017" --drop /var/backups/tabakhdziri/mongodb/backup_YYYYMMDD/

# استعادة الصور
cd /var/www/tabakhdziri/food-delivery-backend
tar -xzf /var/backups/tabakhdziri/uploads/uploads_YYYYMMDD.tar.gz
```

## استكشاف الأخطاء

### Backend لا يعمل

```bash
pm2 logs tabakh-backend
# تحقق من ملف .env
# تحقق من اتصال MongoDB
```

### Frontend لا يعمل

```bash
pm2 logs tabakh-frontend
# تحقق من NEXT_PUBLIC_API_URL
# تحقق من أن البناء تم بنجاح
```

### الصور لا تظهر

```bash
# تحقق من الصلاحيات
ls -la /var/www/tabakhdziri/food-delivery-backend/uploads

# تحقق من تكوين Nginx
sudo nginx -t
```

## الأمان

### قائمة التحقق

- [ ] تغيير جميع كلمات المرور الافتراضية
- [ ] تغيير JWT_SECRET في .env
- [ ] تفعيل SSL (HTTPS)
- [ ] إعداد Firewall
- [ ] تأمين MongoDB
- [ ] تعطيل تسجيل الدخول كـ root عبر SSH
- [ ] تثبيت Fail2Ban
- [ ] إعداد النسخ الاحتياطي التلقائي

## الروابط

بعد النشر، ستكون التطبيقات متاحة على:

- **الموقع الرئيسي**: https://tabakhdziri.com
- **لوحة الإدارة**: https://tabakhdziri.com/admin
- **API**: https://tabakhdziri.com/api

## الدعم

للمزيد من التفاصيل، راجع:
- `.agent/workflows/deploy-to-vps.md` - الدليل الكامل
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**ملاحظة**: تأكد من تغيير جميع كلمات المرور والمفاتيح السرية قبل النشر!
