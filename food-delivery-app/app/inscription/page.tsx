'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { authAPI, saveAuthData } from '@/lib/api';
import Link from 'next/link';

export default function InscriptionPage() {
    const { language } = useLanguage();
    const { login } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError(language === 'ar'
                ? 'كلمات المرور غير متطابقة'
                : 'Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            // Save authentication data
            saveAuthData(response.token, response.user);

            // Update AuthContext with user data
            login(response.user);

            // Show success message
            alert(language === 'ar'
                ? 'تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني.'
                : 'Compte créé avec succès! Vérifiez votre email.');

            // Redirect to home
            router.push('/');
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-md mx-auto px-4 py-20">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                        {language === 'ar' ? 'إنشاء حساب جديد' : 'Inscription'}
                    </h1>
                    <p className="text-gray-600 mb-8 text-center">
                        {language === 'ar'
                            ? 'انضم إلينا وابدأ في طلب الأطباق الشهية'
                            : 'Rejoignez-nous et commencez à commander des plats délicieux'}
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                                placeholder={language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed'}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                {language === 'ar' ? 'البريد الإلكتروني' : 'Adresse email'}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                                placeholder={language === 'ar' ? 'example@email.com' : 'votre@email.com'}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                {language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                                placeholder={language === 'ar' ? '0555123456' : '0555 12 34 56'}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                                placeholder={language === 'ar' ? '••••••' : '••••••'}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {language === 'ar' ? 'على الأقل 6 أحرف' : 'Minimum 6 caractères'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                                placeholder={language === 'ar' ? '••••••' : '••••••'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4CAF50] text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                            {loading
                                ? (language === 'ar' ? 'جاري التسجيل...' : 'Inscription en cours...')
                                : (language === 'ar' ? 'إنشاء حساب' : 'S\'inscrire')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Vous avez déjà un compte?'}{' '}
                            <Link href="/login" className="text-[#FF8C42] font-bold hover:underline">
                                {language === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-500">
                        <p>
                            {language === 'ar'
                                ? 'بالتسجيل، فإنك توافق على شروط الخدمة وسياسة الخصوصية'
                                : 'En vous inscrivant, vous acceptez nos conditions d\'utilisation et notre politique de confidentialité'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
