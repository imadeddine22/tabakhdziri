'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';
import { adminAPI } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import {
    Search,
    Filter,
    Eye,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Calendar,
    Clock,
    User,
    Package,
    Download,
    CheckCircle,
    X,
    AlertCircle
} from 'lucide-react';

export default function AdminOrdersPage() {
    const { t } = useLanguage();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getAllOrders();
            setOrders(response);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await adminAPI.updateOrderStatus(orderId, newStatus);
            if (selectedOrder?._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'preparing': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order._id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminRoute>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('admin.order_management')}</h1>
                        <p className="text-gray-500">{t('admin.order_management_subtitle')}</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder={t('admin.search_by_client')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white font-medium"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['all', 'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`
                                        px-4 py-2 rounded-xl text-sm font-bold border transition-all
                                        ${statusFilter === status
                                            ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
                                    `}
                                >
                                    {t(`admin.${status}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-4">{t('admin.order')}</th>
                                            <th className="px-6 py-4">{t('admin.client')}</th>
                                            <th className="px-6 py-4">{t('admin.event_type')}</th>
                                            <th className="px-6 py-4">{t('admin.total')}</th>
                                            <th className="px-6 py-4">{t('admin.status')}</th>
                                            <th className="px-6 py-4">{t('admin.date')}</th>
                                            <th className="px-6 py-4 text-right">{t('admin.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {filteredOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    #{order._id.slice(-6).toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900">
                                                            {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                                                        </span>
                                                        <span className="text-gray-500 text-xs">{order.customerInfo?.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">
                                                    {order.eventDetails?.eventType}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    {order.totalAmount} DA
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                                                        {t(`admin.${order.status}`)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fullscreen Modal / Sidebar for Order Detail */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-[70] flex justify-end">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                        <div className="relative bg-white w-full max-w-2xl h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                            {/* Header - Fixed */}
                            <div className="p-6 border-b flex items-center justify-between bg-white z-10 flex-shrink-0">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {t('admin.order_details')} #{selectedOrder._id.slice(-6).toUpperCase()}
                                </h2>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8" style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#fb923c #f3f4f6'
                            }}>
                                {/* Status Update */}
                                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                    <h3 className="font-bold text-orange-900 mb-4 flex items-center">
                                        <AlertCircle size={18} className="mr-2" /> {t('admin.update_status')}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => updateStatus(selectedOrder._id, status)}
                                                className={`
                                                    px-4 py-2 rounded-xl text-xs font-bold border transition-all
                                                    ${selectedOrder.status === status
                                                        ? 'bg-orange-500 text-white border-orange-500'
                                                        : 'bg-white text-gray-600 border-orange-200 hover:bg-orange-100'}`}
                                            >
                                                {t(`admin.${status}`)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Info Grid */}
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('admin.client')}</h4>
                                            <div className="flex items-start space-x-3">
                                                <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><User size={20} /></div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{selectedOrder.customerInfo?.firstName} {selectedOrder.customerInfo?.lastName}</p>
                                                    <p className="text-sm text-gray-500">{selectedOrder.customerInfo?.phone}</p>
                                                    <p className="text-sm text-gray-500">{selectedOrder.customerInfo?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('admin.event_info')}</h4>
                                            <p className="text-sm font-bold text-gray-900">{selectedOrder.eventDetails?.eventType} ({selectedOrder.eventDetails?.teamGender})</p>
                                            <div className="mt-2 space-y-2">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin size={16} className="mr-2 shrink-0" />
                                                    <span>{selectedOrder.eventDetails?.wilaya}, {selectedOrder.eventDetails?.location}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar size={16} className="mr-2 shrink-0" />
                                                    <span>{new Date(selectedOrder.eventDetails?.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Clock size={16} className="mr-2 shrink-0" />
                                                    <span>{selectedOrder.eventDetails?.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('admin.order_products')}</h4>
                                            <div className="space-y-4">
                                                {selectedOrder.items?.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                            <img
                                                                src={item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.image}`}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                                            <p className="text-xs text-gray-500">{item.quantity} x {item.price} DA</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-gray-500 text-sm">{t('admin.subtotal')}</span>
                                                <span className="font-bold text-gray-900">{selectedOrder.totalAmount} DA</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t mt-2">
                                                <span className="font-bold text-gray-900">{t('admin.total')}</span>
                                                <span className="text-lg font-black text-orange-500">{selectedOrder.totalAmount} DA</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                {selectedOrder.notes && (
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                        <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">{t('admin.customer_notes')}</h4>
                                        <p className="text-sm text-blue-800 italic">"{selectedOrder.notes}"</p>
                                    </div>
                                )}

                                {/* Extra padding at bottom for footer */}
                                <div className="h-24"></div>
                            </div>

                            {/* Footer / Actions - Fixed */}
                            <div className="p-6 bg-white/95 backdrop-blur-md border-t flex space-x-4 flex-shrink-0">
                                <button className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20">
                                    <Download size={20} />
                                    <span>{t('admin.generate_invoice')}</span>
                                </button>
                                <button
                                    onClick={() => updateStatus(selectedOrder._id, 'cancelled')}
                                    className="px-8 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-xl shadow-red-500/20"
                                >
                                    {t('admin.cancel_order')}
                                </button>
                                <button
                                    onClick={() => updateStatus(selectedOrder._id, 'confirmed')}
                                    className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/20"
                                >
                                    {t('admin.confirm_order')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </AdminRoute>
    );
}
