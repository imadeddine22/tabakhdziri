'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';
import { adminAPI } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
    ShoppingBag,
    Users,
    DollarSign,
    ClipboardList,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Filter
} from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const { isDarkMode } = useAdminTheme();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminAPI.getDashboardStats();
                setStats(response.stats);
                setRecentOrders(response.recentOrders);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: t('admin.total_revenue'),
            value: `${(stats?.totalRevenue || 0).toLocaleString()} DA`,
            trend: '+12.5%',
            trendUp: true,
            icon: DollarSign,
            color: 'bg-purple-500'
        },
        {
            title: t('admin.total_orders'),
            value: stats?.totalOrders || 0,
            trend: '+5.2%',
            trendUp: true,
            icon: ClipboardList,
            color: 'bg-orange-500'
        },
        {
            title: t('admin.total_users'),
            value: stats?.totalUsers || 0,
            trend: '-2.4%',
            trendUp: false,
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: t('admin.total_products'),
            value: stats?.totalProducts || 0,
            trend: '+8.1%',
            trendUp: true,
            icon: ShoppingBag,
            color: 'bg-green-500'
        },
    ];

    return (
        <AdminRoute>
            <AdminLayout>
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--primary-orange)] flex items-center gap-2">
                                {t('admin.welcome')}, Admin! 👋
                            </h1>
                            <p className={isDarkMode ? 'text-gray-400 mt-1' : 'text-gray-500 mt-1'}>
                                {t('admin.welcome_subtitle')}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select className={isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--primary-orange)]' : 'bg-white border text-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--primary-orange)]'}>
                                <option>{t('admin.this_month')}</option>
                                <option>{t('admin.this_week')}</option>
                                <option>{t('admin.today')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className={isDarkMode ? 'bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-700' : 'bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow'}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={isDarkMode ? 'text-gray-400 text-sm font-medium mb-1' : 'text-gray-500 text-sm font-medium mb-1'}>{stat.title}</p>
                                            <h3 className={isDarkMode ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-gray-900'}>{loading ? '...' : stat.value}</h3>
                                        </div>
                                        <div className={`${stat.color} p-3 rounded-xl shadow-lg shadow-gray-200/50 text-white`}>
                                            <Icon size={20} />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp
                                            ? 'text-green-600 bg-green-100'
                                            : 'text-red-600 bg-red-100'
                                            }`}>
                                            {stat.trendUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                            {stat.trend}
                                        </span>
                                        <span className="text-xs text-gray-400">{t('admin.since_last_month')}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Charts Section (Mockup) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue Chart */}
                        <div className={isDarkMode ? 'lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700' : 'lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm'}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={isDarkMode ? 'font-bold text-white text-lg' : 'font-bold text-gray-900 text-lg'}>{t('admin.revenue_analytics')}</h3>
                                <button className={isDarkMode ? 'p-2 hover:bg-gray-700 rounded-lg text-gray-400' : 'p-2 hover:bg-gray-100 rounded-lg text-gray-400'}>
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-2 px-2">
                                {/* Fake Bars */}
                                {[40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 65, 85].map((h, i) => (
                                    <div key={i} className="w-full bg-orange-100 rounded-t-lg relative group overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-[var(--primary-orange)] rounded-t-lg transition-all duration-500 hover:opacity-80"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-xs text-gray-400">
                                <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span>
                                <span>Juil</span><span>Août</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
                            </div>
                        </div>

                        {/* Sales by Category (Donut Mockup) */}
                        <div className={isDarkMode ? 'bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700' : 'bg-white p-6 rounded-2xl shadow-sm'}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={isDarkMode ? 'font-bold text-white text-lg' : 'font-bold text-gray-900 text-lg'}>{t('admin.sales_by_category')}</h3>
                                <button className={isDarkMode ? 'p-2 hover:bg-gray-700 rounded-lg text-gray-400' : 'p-2 hover:bg-gray-100 rounded-lg text-gray-400'}>
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            <div className="h-64 flex items-center justify-center relative">
                                <div className="w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-full border-8 border-[var(--primary-orange)] border-t-transparent border-l-transparent rotate-45"></div>
                                    <div className="text-center">
                                        <p className={isDarkMode ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-gray-900'}>85%</p>
                                        <p className={isDarkMode ? 'text-xs text-gray-400' : 'text-xs text-gray-500'}>{t('admin.growth')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 mt-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[var(--primary-orange)]"></div>
                                        <span className="text-gray-600">{t('admin.main_dishes')}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">65%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                        <span className="text-gray-600">{t('admin.desserts')}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">35%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className={isDarkMode ? 'bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-700' : 'bg-white rounded-2xl shadow-sm overflow-hidden'}>
                        <div className={isDarkMode ? 'p-6 border-b border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4' : 'p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4'}>
                            <h3 className={isDarkMode ? 'font-bold text-white text-lg' : 'font-bold text-gray-900 text-lg'}>{t('admin.recent_orders')}</h3>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('admin.search_placeholder')}
                                        className="bg-gray-50 border-none outline-none text-sm px-4 py-2 rounded-lg text-gray-700 w-full md:w-64 focus:ring-2 focus:ring-[var(--primary-orange)]"
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                                    <Filter size={16} />
                                    {t('admin.filters')}
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">{t('admin.column_id')}</th>
                                        <th className="px-6 py-4">{t('admin.column_customer')}</th>
                                        <th className="px-6 py-4">{t('admin.column_status')}</th>
                                        <th className="px-6 py-4">{t('admin.column_amount')}</th>
                                        <th className="px-6 py-4">{t('admin.column_date')}</th>
                                        <th className="px-6 py-4 text-right">{t('admin.column_action')}</th>
                                    </tr>
                                </thead>
                                <tbody className={isDarkMode ? "divide-y divide-gray-700" : "divide-y divide-gray-100"}>
                                    {recentOrders.map((order, i) => (
                                        <tr key={order._id || i} className={isDarkMode ? "hover:bg-gray-700 transition-colors" : "hover:bg-gray-50 transition-colors"}>
                                            <td className={isDarkMode ? "px-6 py-4 font-medium text-white" : "px-6 py-4 font-medium text-gray-900"}>
                                                #{order._id?.slice(-6).toUpperCase() || 'ID'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                        {order.customer?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className={isDarkMode ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-900"}>{order.customer?.name || t('admin.unknown')}</p>
                                                        <p className={isDarkMode ? "text-xs text-gray-400" : "text-xs text-gray-500"}>{order.customer?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`
                                                    px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1
                                                    ${order.status === 'delivered'
                                                        ? 'bg-green-100 text-green-700'
                                                        : order.status === 'pending'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                    }
                                                `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : order.status === 'pending' ? 'bg-orange-500' : 'bg-blue-500'
                                                        }`}></span>
                                                    {t(`admin.${order.status}`) || order.status}
                                                </span>
                                            </td>
                                            <td className={isDarkMode ? "px-6 py-4 font-bold text-white" : "px-6 py-4 font-bold text-gray-900"}>
                                                {order.totalAmount} DA
                                            </td>
                                            <td className={isDarkMode ? "px-6 py-4 text-gray-300 text-sm" : "px-6 py-4 text-gray-500 text-sm"}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-[var(--primary-orange)] transition-colors">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!loading && recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className={isDarkMode ? "px-6 py-12 text-center text-gray-400" : "px-6 py-12 text-center text-gray-500"}>
                                                {t('admin.no_orders')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </AdminRoute>
    );
}
