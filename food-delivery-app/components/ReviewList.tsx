
'use client';

import { useEffect, useState } from 'react';
import { Star, User, Quote } from 'lucide-react';
import { reviewsAPI } from '@/lib/api';

export default function ReviewList() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await reviewsAPI.getApproved();
                setReviews(res.data || []);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 h-64 rounded-2xl"></div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <Quote className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 font-medium">Aucun avis pour le moment. Soyez le premier !</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Quote size={40} className="text-orange-500" />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                            {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                            <div className="flex text-orange-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={i < review.rating ? "currentColor" : "none"}
                                        className={i < review.rating ? "text-orange-400" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed italic relative z-10">
                        "{review.comment}"
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400 font-medium">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
