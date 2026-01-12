
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';
import { reviewsAPI } from '@/lib/api';
import { Check, X, Trash2, MessageSquare, Star, Clock } from 'lucide-react';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await reviewsAPI.getAllAdmin();
            // التعامل مع البيانات سواء كانت مصفوفة مباشرة أو مغلفة في data
            const reviewsData = Array.isArray(res) ? res : (res.data || []);
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await reviewsAPI.updateStatus(id, status);
            fetchReviews(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
            try {
                await reviewsAPI.delete(id);
                fetchReviews();
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };

    // التأكد من أن reviews مصفوفة قبل التصفية
    const filteredReviews = Array.isArray(reviews)
        ? reviews.filter(r => r && (filter === 'all' || r.status === filter))
        : [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1"><Check size={12} /> Approuvé</span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1"><X size={12} /> Rejeté</span>;
            default:
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> En attente</span>;
        }
    };

    return (
        <AdminRoute>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Avis Clients</h1>
                            <p className="text-gray-500">Gérez les avis et commentaires des clients.</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === f
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                            >
                                {f === 'all' ? 'Tous' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Reviews List */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
                            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500">Aucun avis {filter !== 'all' && `avec le statut ${filter}`} trouvé.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredReviews.map((review) => (
                                <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                    {review.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{review.name}</h3>
                                                    <p className="text-xs text-gray-500">User ID: {review.user}</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(review.status)}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < review.rating ? "currentColor" : "none"}
                                                    className={i < review.rating ? "text-orange-400" : "text-gray-300"}
                                                />
                                            ))}
                                            <span className="text-sm text-gray-500 ml-2">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-xl italic border border-gray-100">
                                            "{review.comment}"
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                        {review.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(review._id, 'approved')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium border border-green-200"
                                                >
                                                    <Check size={16} /> Approuver
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(review._id, 'rejected')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                                                >
                                                    <X size={16} /> Rejeter
                                                </button>
                                            </>
                                        )}
                                        {review.status === 'approved' && (
                                            <button
                                                onClick={() => handleStatusUpdate(review._id, 'rejected')}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-200"
                                            >
                                                <X size={16} /> Rejeter
                                            </button>
                                        )}
                                        {review.status === 'rejected' && (
                                            <button
                                                onClick={() => handleStatusUpdate(review._id, 'approved')}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-200"
                                            >
                                                <Check size={16} /> Approuver
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
                                        >
                                            <Trash2 size={16} /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </AdminRoute>
    );
}
