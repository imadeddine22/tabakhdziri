'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { authAPI, saveAuthData } from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
    const { language } = useLanguage();
    const { login } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        try {
            const response = await authAPI.login(formData.email, formData.password);

            // Save authentication data
            saveAuthData(response.token, response.user);

            // Update AuthContext with user data
            login(response.user);

            // Redirect to home
            router.push('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-md mx-auto px-4 py-20">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                        {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
                    </h1>
                    <p className="text-gray-600 mb-8 text-center">
                        {language === 'ar'
                            ? 'أدخل بيانات حسابك للمتابعة'
                            : 'Entrez vos identifiants pour continuer'}
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                                placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-gray-700 font-medium">
                                    {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-[#FF8C42] hover:underline font-medium"
                                >
                                    {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié?'}
                                </Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                                placeholder={language === 'ar' ? '••••••' : '••••••'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF8C42] text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? (language === 'ar' ? 'جاري تسجيل الدخول...' : 'Connexion en cours...')
                                : (language === 'ar' ? 'تسجيل الدخول' : 'Se connecter')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {language === 'ar' ? 'ليس لديك حساب؟' : 'Pas de compte?'}{' '}
                            <Link href="/register" className="text-[#FF8C42] font-bold hover:underline">
                                {language === 'ar' ? 'إنشاء حساب جديد' : 'Créer un compte'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
