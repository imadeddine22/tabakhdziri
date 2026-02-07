'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguage();

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [tokenVerified, setTokenVerified] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleVerifyToken = async () => {
        if (!token || token.length !== 6) {
            setError(language === 'ar' ? 'الرجاء إدخال رمز مكون من 6 أرقام' : 'Veuillez entrer un code à 6 chiffres');
            return;
        }

        setVerifying(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, token }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid verification code');
            }

            setTokenVerified(true);
        } catch (err: any) {
            setError(err.message || 'Code de vérification invalide');
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas');
            return;
        }

        if (newPassword.length < 6) {
            setError(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, token, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-green-hover)] rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Réinitialiser le mot de passe'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {!tokenVerified
                            ? (language === 'ar'
                                ? 'أدخل الرمز المرسل إلى بريدك الإلكتروني'
                                : 'Entrez le code envoyé à votre email')
                            : (language === 'ar'
                                ? 'أدخل كلمة المرور الجديدة'
                                : 'Entrez votre nouveau mot de passe')}
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium">
                                {language === 'ar'
                                    ? 'تم تغيير كلمة المرور بنجاح! جاري التوجيه...'
                                    : 'Mot de passe changé avec succès! Redirection...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Verification Form */}
                {!tokenVerified ? (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent transition-all"
                                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Entrez votre email'}
                            />
                        </div>

                        <div>
                            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'رمز التحقق (6 أرقام)' : 'Code de vérification (6 chiffres)'}
                            </label>
                            <input
                                id="token"
                                type="text"
                                maxLength={6}
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent transition-all text-center text-2xl tracking-widest font-bold"
                                placeholder="000000"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleVerifyToken}
                            disabled={verifying || !email || token.length !== 6}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-orange)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {verifying ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {language === 'ar' ? 'جاري التحقق...' : 'Vérification...'}
                                </span>
                            ) : (
                                <span>{language === 'ar' ? 'تحقق من الرمز' : 'Vérifier le code'}</span>
                            )}
                        </button>
                    </div>
                ) : (
                    /* Password Reset Form */
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent transition-all"
                                placeholder={language === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'Entrez le nouveau mot de passe'}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent transition-all"
                                placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Confirmez le mot de passe'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-hover)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-green)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...'}
                                </span>
                            ) : (
                                <span>{language === 'ar' ? 'تغيير كلمة المرور' : 'Changer le mot de passe'}</span>
                            )}
                        </button>
                    </form>
                )}

                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] transition-colors"
                    >
                        {language === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Retour à la connexion'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
