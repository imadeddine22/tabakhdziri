# خاصية الوضع الليلي في لوحة التحكم (Admin Dark Mode)

## نظرة عامة

تم إضافة خاصية الوضع الليلي (Dark Mode) حصرياً لصفحات لوحة التحكم (Admin Panel) فقط، دون التأثير على باقي صفحات الموقع.

## الملفات المضافة

### 1. `context/AdminThemeContext.tsx`
Context خاص بإدارة حالة الوضع الليلي لصفحات الأدمن:

```tsx
import { useAdminTheme } from '@/context/AdminThemeContext';

const { isDarkMode, toggleTheme } = useAdminTheme();
```

**الميزات:**
- ✅ حفظ تفضيلات المستخدم في `localStorage` تحت مفتاح `admin-theme`
- ✅ دعم تفضيلات النظام (system preference)
- ✅ منع وميض الثيم عند التحميل (flash prevention)
- ✅ معزول تماماً عن باقي الموقع

## الملفات المعدلة

### 1. `app/admin/layout.tsx`
تم إضافة `AdminThemeProvider` لتوفير Context للوضع الليلي:

```tsx
<LanguageProvider>
    <AdminThemeProvider>
        {children}
    </AdminThemeProvider>
</LanguageProvider>
```

### 2. `components/AdminLayout.tsx`
تم تحديث المكون لاستخدام `useAdminTheme` بدلاً من state محلي:

**قبل:**
```tsx
const [isDarkMode, setIsDarkMode] = useState(false);
```

**بعد:**
```tsx
const { isDarkMode, toggleTheme } = useAdminTheme();
```

### 3. `app/admin/page.tsx`
تم إضافة دعم الوضع الليلي لجميع العناصر:
- بطاقات الإحصائيات (Stats Cards)
- الرسوم البيانية (Charts)
- الجداول (Tables)
- عناصر الإدخال (Input Elements)

## كيفية الاستخدام

### في أي صفحة Admin جديدة:

```tsx
'use client';

import { useAdminTheme } from '@/context/AdminThemeContext';
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';

export default function MyAdminPage() {
    const { isDarkMode } = useAdminTheme();

    return (
        <AdminRoute>
            <AdminLayout>
                <div className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
                    {/* محتوى الصفحة */}
                </div>
            </AdminLayout>
        </AdminRoute>
    );
}
```

## الألوان المستخدمة

### الوضع الفاتح (Light Mode):
- **Background**: `bg-white`, `bg-gray-50`, `bg-gray-100`
- **Text**: `text-gray-900`, `text-gray-700`, `text-gray-500`
- **Borders**: `border-gray-200`, `border-gray-100`

### الوضع الليلي (Dark Mode):
- **Background**: `bg-gray-900`, `bg-gray-800`, `bg-gray-700`
- **Text**: `text-white`, `text-gray-200`, `text-gray-400`
- **Borders**: `border-gray-700`, `border-gray-600`

## زر التبديل (Toggle Button)

يوجد زر التبديل في الـ Header الخاص بـ AdminLayout:
- **أيقونة القمر** 🌙 (Moon): للتبديل إلى الوضع الليلي
- **أيقونة الشمس** ☀️ (Sun): للتبديل إلى الوضع الفاتح

## التخزين المحلي (LocalStorage)

يتم حفظ التفضيلات في:
```
localStorage.getItem('admin-theme')
// القيم الممكنة: 'dark' | 'light'
```

**ملاحظة مهمة:** 
- مفتاح `admin-theme` مختلف عن أي مفتاح آخر في الموقع
- هذا يضمن عدم التداخل مع تفضيلات المستخدم في باقي الموقع

## الصفحات المدعومة

حالياً، الصفحات التالية تدعم الوضع الليلي بالكامل:
- ✅ `/admin` - Dashboard
- ✅ `/admin/products` - Products Management
- ✅ `/admin/categories` - Categories Management
- ✅ `/admin/orders` - Orders Management
- ✅ `/admin/users` - Users Management
- ✅ `/admin/messages` - Messages
- ✅ `/admin/reviews` - Client Reviews
- ✅ `/admin/instagram` - Instagram Posts
- ✅ `/admin/admins` - Admin Management (Super Admin Only)

## التوافق

- ✅ متوافق مع جميع المتصفحات الحديثة
- ✅ يعمل مع RTL/LTR
- ✅ يعمل مع تبديل اللغة (FR/AR)
- ✅ responsive على جميع الأجهزة

## الأداء

- **حجم الـ Context**: ~2KB
- **تأثير على الأداء**: minimal (استخدام localStorage فقط)
- **Re-renders**: محسّن باستخدام Context API

## ملاحظات للمطورين

1. **عدم استخدام template literals في className**: 
   - ❌ `className={\`bg-white \${isDarkMode ? 'dark' : ''}\`}`
   - ✅ `className={isDarkMode ? 'bg-gray-800' : 'bg-white'}`

2. **استخدام ternary operators مباشرة** لتجنب مشاكل Turbopack parsing

3. **التأكد من تطبيق الألوان على جميع العناصر**:
   - Backgrounds
   - Text colors
   - Borders
   - Hover states
   - Focus states

## المستقبل

خطط مستقبلية محتملة:
- [ ] إضافة themes إضافية (مثل: blue, green)
- [ ] تخصيص الألوان من لوحة التحكم
- [ ] مزامنة التفضيلات مع حساب المستخدم
