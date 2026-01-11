'use client';

import { useEffect, useState } from 'react';
import { ordersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag,
    Calendar,
    MapPin,
    Clock,
    Download,
    ChevronRight,
    Package,
    AlertCircle
} from 'lucide-react';

export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await ordersAPI.getMyOrders();
                console.log('📦 Orders response:', response);
                // API already unwraps response.data.data, so response is the actual data
                setOrders(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user, authLoading, router]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleDownloadInvoice = async (orderId: string) => {
        try {
            await ordersAPI.downloadInvoice(orderId);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Erreur lors du téléchargement de la facture');
        }
    };

    if (authLoading || (loading && !orders.length)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
                    <p className="text-gray-600 mt-2">Suivez l'état de vos commandes et téléchargez vos factures.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Vous n'avez pas encore passé de commande</h2>
                        <p className="text-gray-500 mt-2 mb-8">Découvrez notre menu et passez votre première commande aujourd'hui !</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                        >
                            Voir le menu
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-orange-200 transition-colors">
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Commande #{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-sm font-bold text-gray-900">Passée le {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                                            {order.status === 'pending' ? 'En attente' :
                                                order.status === 'confirmed' ? 'Confirmée' :
                                                    order.status === 'delivered' ? 'Livrée' : order.status}
                                        </span>
                                        <button
                                            onClick={() => handleDownloadInvoice(order._id)}
                                            className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                                            title="Télécharger facture"
                                        >
                                            <Download size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="flex flex-wrap gap-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl pr-4">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                                                        <p className="text-[10px] text-gray-500">{item.quantity} x {item.price} DA</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin size={16} className="mr-2 text-gray-400" />
                                                <span>{order.eventDetails?.wilaya}, {order.eventDetails?.location}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar size={16} className="mr-2 text-gray-400" />
                                                <span>{new Date(order.eventDetails?.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-center">
                                        <p className="text-sm text-gray-500 mb-1">Total payé</p>
                                        <p className="text-2xl font-black text-orange-500">{order.totalAmount} DA</p>
                                        <button className="mt-4 flex items-center justify-center space-x-2 text-xs font-bold text-gray-900 hover:text-orange-500 transition-colors">
                                            <span>Détails de l'événement</span>
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">Besoin d'aide ?</h4>
                        <p className="text-gray-500 text-sm mt-1">Si vous avez des questions sur vos commandes, n'hésitez pas à nous contacter directement sur WhatsApp ou par téléphone.</p>
                        <button
                            onClick={() => router.push('/contact')}
                            className="text-[var(--primary-green)] font-bold text-sm mt-3 hover:underline"
                        >
                            Contactez le support
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
