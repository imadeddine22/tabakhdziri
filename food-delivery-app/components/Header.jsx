'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { getCartCount } = useCart();
    const { language, setLanguage, t } = useLanguage();
    const { user, logout, isAuthenticated } = useAuth();
    const cartCount = getCartCount();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300 border-b border-gray-200">
            <div className="responsive-container">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.png"
                            alt="Tabakh Dziri Logo"
                            className="h-16 w-auto transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="text-lg md:text-2xl font-bold text-gray-900">
                            Tabakh Dziri
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-700 hover:text-[var(--primary-orange)] transition-colors font-medium">
                            {t('common.home')}
                        </Link>
                        <Link href="/about" className="text-gray-700 hover:text-[var(--primary-orange)] transition-colors font-medium">
                            {t('common.about')}
                        </Link>
                        <Link href="/services" className="text-gray-700 hover:text-[var(--primary-orange)] transition-colors font-medium">
                            {t('common.services')}
                        </Link>
                        <Link href="/contact" className="text-gray-700 hover:text-[var(--primary-orange)] transition-colors font-medium">
                            {t('common.contact')}
                        </Link>
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-700 hover:text-[var(--primary-orange)] transition-all duration-300 hover:scale-110"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Language Switcher */}
                        <div className="hidden md:flex items-center gap-2 text-sm">
                            <button
                                onClick={() => setLanguage('fr')}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ${language === 'fr'
                                    ? 'bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white shadow-lg scale-105'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                Fr
                            </button>
                            <span className="text-gray-400">|</span>
                            <button
                                onClick={() => setLanguage('ar')}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ${language === 'ar'
                                    ? 'bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white shadow-lg scale-105'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                Ar
                            </button>
                        </div>

                        {/* User Menu or Login/Sign Up - LAST ITEM */}
                        {isAuthenticated() ? (
                            <div className="hidden md:flex items-center relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 344 384" className="text-[var(--primary-green)]">
                                        <path fill="currentColor" d="M170.5 192q-35.5 0-60.5-25t-25-60.5T110 46t60.5-25T231 46t25 60.5t-25 60.5t-60.5 25zm0 43q31.5 0 69.5 9t69.5 29.5T341 320v43H0v-43q0-26 31.5-46.5T101 244t69.5-9z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{user?.firstName || user?.name || 'Utilisateur'}</span>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* User Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                        <Link
                                            href="/orders"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                        >
                                            📦 Mes Commandes
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="block w-full text-left px-4 py-2 text-sm text-[var(--primary-orange)] font-bold hover:bg-orange-50 transition-colors border-b border-gray-100"
                                            >
                                                ⚙️ Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            {t('common.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-[var(--primary-orange)] transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                                >
                                    {t('common.login')}
                                </Link>
                                <Link
                                    href="/inscription"
                                    className="bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-hover)] text-white px-5 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                                >
                                    {t('common.register')}
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 bg-white">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-[var(--primary-orange)] transition-colors font-medium px-2 py-1 rounded hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('common.home')}
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-[var(--primary-orange)] transition-colors font-medium px-2 py-1 rounded hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('common.about')}
                            </Link>
                            <Link
                                href="/services"
                                className="text-gray-700 hover:text-[var(--primary-orange)] transition-colors font-medium px-2 py-1 rounded hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('common.services')}
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-700 hover:text-[var(--primary-orange)] transition-colors font-medium px-2 py-1 rounded hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('common.contact')}
                            </Link>

                            {/* User Section in Mobile */}
                            {isAuthenticated() ? (
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-3 px-2 py-3 bg-gray-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 344 384" className="text-[var(--primary-green)]">
                                            <path fill="currentColor" d="M170.5 192q-35.5 0-60.5-25t-25-60.5T110 46t60.5-25T231 46t25 60.5t-25 60.5t-60.5 25zm0 43q31.5 0 69.5 9t69.5 29.5T341 320v43H0v-43q0-26 31.5-46.5T101 244t69.5-9z" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold text-gray-800">{user?.firstName || user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full mt-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                                    >
                                        {t('common.logout')}
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
                                    <Link
                                        href="/login"
                                        className="text-center text-gray-700 hover:text-[var(--primary-orange)] transition-colors font-medium px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {t('common.login')}
                                    </Link>
                                    <Link
                                        href="/inscription"
                                        className="text-center bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-hover)] text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {t('common.register')}
                                    </Link>
                                </div>
                            )}

                            {/* Language Switcher in Mobile */}
                            <div className="flex items-center justify-center gap-2 pt-4 pb-2">
                                <button
                                    onClick={() => setLanguage('fr')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${language === 'fr'
                                        ? 'bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    Français
                                </button>
                                <button
                                    onClick={() => setLanguage('ar')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${language === 'ar'
                                        ? 'bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    العربية
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
