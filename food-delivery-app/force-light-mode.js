// افتح Console (F12) والصق هذا الكود بالكامل ثم اضغط Enter

// 1. إزالة class dark بالقوة
document.documentElement.classList.remove('dark');
document.documentElement.classList.remove('light');

// 2. إضافة class light (اختياري)
// document.documentElement.classList.add('light');

// 3. تحديث localStorage
localStorage.setItem('theme', 'light');

// 4. تطبيق الخلفية البيضاء مباشرة
document.body.style.backgroundColor = '#ffffff';
document.body.style.color = '#111827';

// 5. طباعة النتيجة
console.log('✅ تم تطبيق الوضع النهاري');
console.log('HTML classes:', document.documentElement.className);
console.log('Theme in localStorage:', localStorage.getItem('theme'));
console.log('Body background:', window.getComputedStyle(document.body).backgroundColor);

// 6. إعادة تحميل الصفحة بعد ثانية
setTimeout(() => {
    console.log('🔄 جاري إعادة تحميل الصفحة...');
    location.reload();
}, 1000);
