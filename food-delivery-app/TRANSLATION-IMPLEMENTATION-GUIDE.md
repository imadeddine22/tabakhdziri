# دليل تطبيق الترجمة الكاملة - Tabakh Dziri

## ✅ تم إنجازه

### 1. ملفات الترجمة
- ✅ `locales/fr.json` - تم تحديثه بجميع الترجمات الفرنسية
- ✅ `locales/ar.json` - تم تحديثه بجميع الترجمات العربية

### 2. الصفحات المترجمة جزئياً
- ✅ `app/cart/page.tsx` - تم تطبيق الترجمة جزئياً (العنوان، السلة الفارغة، الملخص)

## 📝 الصفحات التي تحتاج للترجمة

### 1. صفحة السلة (Cart) - إكمال الترجمة

يجب تحديث الحقول التالية في `app/cart/page.tsx`:

```typescript
// استبدل النصوص الثابتة بـ:
{t('cart.customerName')} // بدلاً من "Nom"
{t('cart.customerSurname')} // بدلاً من "Prénom"
{t('cart.customerPhone')} // بدلاً من "Numéro de téléphone"
{t('cart.eventType')} // بدلاً من "Type d'événement"
{t('cart.teamType')} // بدلاً من "Type d'équipe"
{t('cart.men')} // بدلاً من "Hommes"
{t('cart.women')} // بدلاً من "Femmes"
{t('cart.wilaya')} // بدلاً من "Wilaya"
{t('cart.selectWilaya')} // بدلاً من "Sélectionnez une wilaya"
{t('cart.eventLocation')} // بدلاً من "Lieu exact (Salle des fêtes)"
{t('cart.eventDate')} // بدلاً من "Date de l'événement"
{t('cart.eventTime')} // بدلاً من "Heure de l'événement"
{t('cart.selectEventType')} // بدلاً من "Sélectionnez le type"
{t('cart.placeOrder')} // بدلاً من "Passer la commande"
{t('cart.sending')} // بدلاً من "Envoi en cours..."
{t('cart.continueShopping')} // بدلاً من "Continuer mes achats"
{t('cart.deliveryNote')} // بدلاً من "L'équipe se déplace..."
```

أيضاً، استبدل أنواع المناسبات:
```typescript
const eventTypes = [
    t('eventTypes.wedding'),
    t('eventTypes.engagement'),
    t('eventTypes.birthday'),
    t('eventTypes.baptism'),
    t('eventTypes.circumcision'),
    t('eventTypes.religious'),
    t('eventTypes.corporate'),
    t('eventTypes.other')
];
```

### 2. صفحة الطلبات (Orders)

في `app/orders/page.tsx`:

```typescript
// أضف في البداية:
import { useLanguage } from '@/context/LanguageContext';

// في المكون:
const { t, language } = useLanguage();

// استبدل:
"Mes Commandes" → {t('orders.title')}
"Suivez l'état..." → {t('orders.subtitle')}
"Vous n'avez pas encore passé de commande" → {t('orders.noOrders')}
"Découvrez notre menu..." → {t('orders.noOrdersMessage')}
"Voir le menu" → {t('orders.viewMenu')}
"Commande #" → {t('orders.orderNumber')}
"Passée le" → {t('orders.orderedOn')}
"En attente" → {t('orders.status.pending')}
"Confirmée" → {t('orders.status.confirmed')}
"Livrée" → {t('orders.status.delivered')}
"Télécharger facture" → {t('orders.downloadInvoice')}
"Total payé" → {t('orders.totalPaid')}
"Détails de l'événement" → {t('orders.eventDetails')}
"Besoin d'aide ?" → {t('orders.needHelp')}
"Si vous avez des questions..." → {t('orders.needHelpMessage')}
"Contactez le support" → {t('orders.contactSupport')}
```

### 3. صفحة الاتصال (Contact)

في `app/contact/page.tsx`:

```typescript
// أضف:
import { useLanguage } from '@/context/LanguageContext';
const { t, language } = useLanguage();

// استبدل:
"Contactez-Nous" → {t('contact.title')}
"Nous sommes là..." → {t('contact.subtitle')}
"Envoyez-nous un Message" → {t('contact.sendMessage')}
"Nom Complet" → {t('contact.fullName')}
"Email" → {t('contact.email')}
"Téléphone" → {t('contact.phone')}
"Type d'Événement" → {t('contact.eventType')}
"Sélectionnez le type" → {t('contact.selectType')}
"Nombre d'Invités" → {t('contact.guests')}
"Date" → {t('contact.date')}
"Votre Message" → {t('contact.message')}
"Parlez-nous de votre événement..." → {t('contact.messagePlaceholder')}
"Envoyer le Message" → {t('contact.sendButton')}
"Envoi en cours..." → {t('contact.sending')}
"Merci de nous avoir contactés..." → {t('contact.successMessage')}
"Erreur lors de l'envoi..." → {t('contact.errorMessage')}
```

أيضاً في الـ alerts:
```typescript
alert(language === 'ar'
    ? t('contact.successMessage')
    : t('contact.successMessage'));
```

### 4. صفحة الخدمات (Services)

في `app/services/page.tsx`:

```typescript
// أضف:
import { useLanguage } from '@/context/LanguageContext';
const { t, language } = useLanguage();

// استبدل:
"Nos Services" → {t('services.title')}
"Solutions complètes..." → {t('services.subtitle')}
"Suivez-nous sur Instagram" → {t('services.followInstagram')}

// في قائمة الخدمات:
const services = [
    {
        id: 1,
        title: t('services.list.diningGuides.title'),
        description: t('services.list.diningGuides.description'),
        // ...
    },
    {
        id: 2,
        title: t('services.list.freshFood.title'),
        description: t('services.list.freshFood.description'),
        // ...
    },
    // ... باقي الخدمات
];

// في قسم معلومات الاتصال:
{t('services.contactInfo.address')}
{t('services.contactInfo.email')}
{t('services.contactInfo.phone')}
```

### 5. صفحة من نحن (About)

الصفحة مترجمة بالفعل ولكن تستخدم نصوص مباشرة. يمكن تحسينها:

```typescript
// استبدل:
language === 'ar' ? 'من نحن' : 'À propos de nous'
// بـ:
{t('about.title')}

// وهكذا لباقي النصوص
```

### 6. صفحات التسجيل والدخول

في `app/login/page.tsx` و `app/register/page.tsx` و `app/inscription/page.tsx`:

```typescript
import { useLanguage } from '@/context/LanguageContext';
const { t, language } = useLanguage();

// استبدل جميع النصوص بـ:
{t('auth.login')}
{t('auth.register')}
{t('auth.email')}
{t('auth.password')}
{t('auth.confirmPassword')}
{t('auth.name')}
{t('auth.phone')}
{t('auth.address')}
{t('auth.forgotPassword')}
{t('auth.noAccount')}
{t('auth.haveAccount')}
```

## 🎯 خطوات التطبيق السريع

### الطريقة الموصى بها:

1. **افتح كل ملف صفحة**
2. **أضف الاستيراد**:
   ```typescript
   import { useLanguage } from '@/context/LanguageContext';
   ```

3. **أضف في المكون**:
   ```typescript
   const { t, language } = useLanguage();
   ```

4. **استبدل النصوص الثابتة**:
   - ابحث عن جميع النصوص بين علامات الاقتباس
   - استبدلها بـ `{t('key.path')}`

5. **اختبر الصفحة** بالتبديل بين اللغات

## 📋 قائمة التحقق

- [ ] إكمال ترجمة `app/cart/page.tsx`
- [ ] ترجمة `app/orders/page.tsx`
- [ ] ترجمة `app/contact/page.tsx`
- [ ] ترجمة `app/services/page.tsx`
- [ ] تحسين ترجمة `app/about/page.tsx`
- [ ] ترجمة `app/login/page.tsx`
- [ ] ترجمة `app/register/page.tsx`
- [ ] ترجمة `app/inscription/page.tsx`
- [ ] ترجمة `app/product/[id]/page.tsx`
- [ ] ترجمة المكونات في `components/`
- [ ] اختبار جميع الصفحات

## 🔍 نصائح مهمة

1. **استخدم نفس المفاتيح** في كلا ملفي الترجمة (fr.json و ar.json)
2. **اختبر RTL** للتأكد من أن التخطيط يعمل بشكل صحيح في العربية
3. **تحقق من الـ placeholders** في حقول الإدخال
4. **راجع رسائل الخطأ والنجاح** للتأكد من ترجمتها
5. **لا تنسَ الـ alerts والـ confirmations**

## 🚀 الخطوة التالية

ابدأ بإكمال ترجمة صفحة السلة (Cart) لأنها الأكثر أهمية، ثم انتقل إلى صفحة الطلبات (Orders) وصفحة الاتصال (Contact).

## 📝 ملاحظات إضافية

- جميع مفاتيح الترجمة موجودة بالفعل في `locales/fr.json` و `locales/ar.json`
- نظام الترجمة يعمل بشكل صحيح (تم اختباره في صفحة About)
- دعم RTL مفعّل تلقائياً عند اختيار العربية
- الخطوط العربية (Cairo) محملة ومطبقة

---

**تم إنشاء هذا الدليل في:** 2026-01-04
**الحالة:** جاهز للتطبيق ✅
