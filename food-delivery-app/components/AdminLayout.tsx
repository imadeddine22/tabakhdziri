'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
    LayoutDashboard,
    ShoppingBag,
    Tags,
    ClipboardList,
    Users,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    Moon,
    Sun,
    Settings,
    MessageSquare,
    Globe,
    Instagram
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const { t, language, setLanguage, isRTL } = useLanguage();
    const { isDarkMode, toggleTheme } = useAdminTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const allMenuItems = [
        { name: t('admin.dashboard'), path: '/admin', icon: LayoutDashboard },
        { name: t('admin.products'), path: '/admin/products', icon: ShoppingBag },
        { name: t('admin.categories'), path: '/admin/categories', icon: Tags },
        { name: t('admin.orders'), path: '/admin/orders', icon: ClipboardList },
        { name: t('admin.users'), path: '/admin/users', icon: Users },
        { name: t('admin.admins'), path: '/admin/admins', icon: Settings, superAdminOnly: true },
        { name: t('admin.messages'), path: '/admin/messages', icon: MessageSquare },
        { name: t('admin.clientReviews'), path: '/admin/reviews', icon: MessageSquare },
        { name: t('admin.instagram'), path: '/admin/instagram', icon: Instagram },
    ];

    // Filter menu items based on user role
    const menuItems = allMenuItems.filter(item => {
        if (item.superAdminOnly) {
            return user?.email === 'tabakhdziri@gmail.com';
        }
        return true;
    });

    const toggleLanguage = () => {
        setLanguage(language === 'fr' ? 'ar' : 'fr');
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <style jsx global>{`
                :root {
                    --primary-orange: #FF8C42;
                    --primary-green: #4CAF50;
                }
                .dark {
                    color-scheme: dark;
                }
            `}</style>

            <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transform transition-transform duration-300 ease-in-out
                    lg:relative lg:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
                `}>
                    <div className="h-full flex flex-col">
                        {/* Logo */}
                        <div className={`h-20 flex items-center px-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <Link href="/admin" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[var(--primary-orange)] flex items-center justify-center text-white font-bold text-xl">
                                    T
                                </div>
                                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    TABAKH <span className="text-[var(--primary-orange)]">ADMIN</span>
                                </span>
                            </Link>
                            <button className="lg:hidden ms-auto" onClick={() => setIsSidebarOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path));

                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`
                                            flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                                            ${isRTL ? 'space-x-reverse' : ''}
                                            ${isActive
                                                ? 'bg-[var(--primary-orange)] text-white shadow-lg shadow-orange-500/20'
                                                : isDarkMode
                                                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Profile Footer */}
                        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <button
                                onClick={logout}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors 
                                    ${isRTL ? 'space-x-reverse' : ''}
                                    ${isDarkMode
                                        ? 'text-red-400 hover:bg-red-900/20'
                                        : 'text-red-500 hover:bg-red-50'
                                    }`}
                            >
                                <LogOut size={20} />
                                <span className="font-medium">{t('admin.logout')}</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Header */}
                    <header className={`
                        h-20 flex items-center justify-between px-6 border-b z-40
                        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                    `}>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2">
                                <Menu size={24} />
                            </button>

                            {/* Search Bar */}
                            <div className={`hidden md:flex items-center px-4 py-2 rounded-lg border focus-within:ring-2 ring-[var(--primary-orange)] transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}>
                                <Search size={18} className={`text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                <input
                                    type="text"
                                    placeholder={t('admin.search_placeholder')}
                                    className={`bg-transparent border-none outline-none text-sm w-64 ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Status */}
                            <div className="hidden md:block text-sm">
                                <span className="text-gray-400">{t('admin.date_label')}: </span>
                                <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700 font-medium'}>
                                    {new Date().toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
                                </span>
                            </div>

                            {/* Language Switcher */}
                            <button
                                onClick={toggleLanguage}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700 text-gray-200' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                            >
                                <Globe size={18} />
                                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                    }`}
                                title={isDarkMode ? t('admin.mode_day') : t('admin.mode_night')}
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Settings Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <Settings size={20} />
                                </button>

                                {/* Dropdown Menu */}
                                {isSettingsOpen && (
                                    <>
                                        {/* Overlay to close dropdown */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsSettingsOpen(false)}
                                        />

                                        {/* Dropdown Content */}
                                        <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 rounded-xl shadow-lg z-50 border ${isDarkMode
                                                ? 'bg-gray-800 border-gray-700'
                                                : 'bg-white border-gray-200'
                                            }`}>
                                            <div className="py-2">
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsSettingsOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${isRTL ? 'flex-row-reverse' : ''
                                                        } ${isDarkMode
                                                            ? 'text-red-400 hover:bg-red-900/20'
                                                            : 'text-red-500 hover:bg-red-50'
                                                        }`}
                                                >
                                                    <LogOut size={18} />
                                                    <span className="font-medium">{t('admin.logout')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Profile */}
                            <div className={`flex items-center gap-3 ${isRTL ? 'pr-4 border-r' : 'pl-4 border-l'} border-gray-300/20`}>
                                <div className={`text-right hidden md:block ${isRTL ? 'text-left' : 'text-right'}`}>
                                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {user?.name || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-400">{t('admin.admin_role')}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className={`flex-1 overflow-x-hidden overflow-y-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                        {children}
                    </main>
                </div>

                {/* Overlay Mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
