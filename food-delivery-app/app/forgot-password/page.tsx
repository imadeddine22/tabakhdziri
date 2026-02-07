'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const { language } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset code');
            }

            setSuccess(true);

            // Redirect to reset password page after 2 seconds
            setTimeout(() => {
                window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
            }, 2000);
        } catch (err: any) {
            console.error('Password reset error:', err);
            setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-md mx-auto px-4 py-20">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-[#FF8C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                        {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié?'}
                    </h1>
                    <p className="text-gray-600 mb-8 text-center">
                        {language === 'ar'
                            ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور'
                            : 'Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe'}
                    </p>

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>
                                    {language === 'ar'
                                        ? 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني'
                                        : 'Un lien de réinitialisation a été envoyé à votre email'}
                                </span>
                            </div>
                        </div>
                    )}

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
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                                    placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF8C42] text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? (language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...')
                                : (language === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Envoyer le lien')}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <Link href="/login" className="block text-[#FF8C42] font-medium hover:underline">
                            {language === 'ar' ? '← العودة إلى تسجيل الدخول' : '← Retour à la connexion'}
                        </Link>

                        <p className="text-gray-600 text-sm">
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
