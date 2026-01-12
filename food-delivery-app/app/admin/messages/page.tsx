'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';
import { contactAPI } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import {
    Search,
    Trash2,
    Eye,
    Mail,
    Phone,
    Calendar,
    Users as UsersIcon,
    X,
    MessageSquare,
    CheckCircle,
    Circle
} from 'lucide-react';

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { t, isRTL } = useLanguage();

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await contactAPI.getAll();
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(t('delete_confirm'))) {
            try {
                await contactAPI.delete(id);
                fetchMessages();
                if (selectedMessage?._id === id) {
                    setSelectedMessage(null);
                }
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const handleView = async (message: any) => {
        setSelectedMessage(message);
        if (message.status === 'new') {
            try {
                await contactAPI.updateStatus(message._id, { status: 'read' });
                // Update local state to reflect read status
                setMessages(prev => prev.map(m =>
                    m._id === message._id ? { ...m, status: 'read' } : m
                ));
            } catch (error) {
                console.error('Error updating message status:', error);
            }
        }
    };

    const filteredMessages = Array.isArray(messages)
        ? messages.filter(m =>
            m && (
                m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.subject?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'read': return 'bg-gray-100 text-gray-800';
            case 'replied': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminRoute>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="text-[var(--primary-orange)]" />
                            {t('messages_title')}
                        </h1>
                        <p className="text-gray-500">{t('messages_subtitle')}</p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <span className={isRTL ? 'absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400' : 'absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400'}>
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={isRTL ? 'w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary-orange)] outline-none bg-white text-gray-900' : 'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary-orange)] outline-none bg-white text-gray-900'}
                        />
                    </div>

                    {/* Messages List */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-orange)]"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                        <tr>
                                            <th className={isRTL ? 'px-6 py-4 text-right' : 'px-6 py-4 text-left'}>{t('column_sender')}</th>
                                            <th className={isRTL ? 'px-6 py-4 text-right' : 'px-6 py-4 text-left'}>{t('column_subject')}</th>
                                            <th className={isRTL ? 'px-6 py-4 text-right' : 'px-6 py-4 text-left'}>{t('column_status')}</th>
                                            <th className={isRTL ? 'px-6 py-4 text-right' : 'px-6 py-4 text-left'}>{t('column_date')}</th>
                                            <th className={isRTL ? 'px-6 py-4 text-left' : 'px-6 py-4 text-right'}>{t('column_action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredMessages.map((msg) => (
                                            <tr key={msg._id}
                                                onClick={() => handleView(msg)}
                                                className={msg.status === 'new' ? 'hover:bg-gray-50 transition-colors cursor-pointer bg-blue-50/50' : 'hover:bg-gray-50 transition-colors cursor-pointer'}
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className={msg.status === 'new' ? 'font-bold text-gray-900' : 'font-bold text-gray-600'}>
                                                            {msg.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{msg.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">
                                                            {msg.eventType}
                                                        </span>
                                                        <span className={msg.status === 'new' ? 'truncate max-w-[200px] text-gray-600 font-medium' : 'truncate max-w-[200px] text-gray-600'}>
                                                            {msg.message}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={'px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ' + getStatusColor(msg.status)}>
                                                        {msg.status === 'new' && <Circle size={8} fill="currentColor" />}
                                                        {msg.status === 'read' && <CheckCircle size={12} />}
                                                        {t(msg.status) || msg.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className={isRTL ? 'px-6 py-4 text-left' : 'px-6 py-4 text-right'}>
                                                    <div className={isRTL ? 'flex items-center gap-2 justify-start' : 'flex items-center gap-2 justify-end'}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleView(msg);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title={t('view_details')}
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(msg._id, e)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title={t('delete')}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredMessages.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    {t('no_orders') /* Reusing no orders text or add specific one */}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Message Details Modal */}
                    {selectedMessage && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedMessage(null)} />
                            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                                <div className="flex justify-between items-start mb-6 border-b pb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {t('message_details')}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {t('sent_at')}: {new Date(selectedMessage.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Sender Info */}
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <UsersIcon size={16} />
                                            {t('sender_info')}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{t('column_sender')}</p>
                                                <p className="font-medium text-gray-900">{selectedMessage.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{t('email')}</p>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-gray-400" />
                                                    <a href={`mailto:${selectedMessage.email}`} className="font-medium text-blue-600 hover:underline">
                                                        {selectedMessage.email}
                                                    </a>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{t('phone')}</p>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-gray-400" />
                                                    <a href={`tel:${selectedMessage.phone}`} className="font-medium text-gray-900 hover:underline">
                                                        {selectedMessage.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Info */}
                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                        <h3 className="text-sm font-bold text-[var(--primary-orange)] mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <Calendar size={16} />
                                            {t('event_info')}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Type</p>
                                                <p className="font-bold text-gray-900">{selectedMessage.eventType}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{t('guests')}</p>
                                                <p className="font-bold text-gray-900">{selectedMessage.guests} Personnes</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{t('column_date')}</p>
                                                <p className="font-bold text-gray-900">{new Date(selectedMessage.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Body */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <MessageSquare size={16} />
                                            {t('column_message')}
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {selectedMessage.message}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        {t('close')}
                                    </button>
                                    <button
                                        onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                                        className="px-6 py-2.5 bg-[var(--primary-orange)] text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                                    >
                                        Répondre par Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AdminLayout>
        </AdminRoute>
    );
}
