
'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { reviewsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ReviewForm({ onReviewSubmitted }: { onReviewSubmitted?: () => void }) {
    const { user, isAuthenticated } = useAuth();
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated && !name.trim()) {
            setMessage({ type: 'error', text: 'Veuillez entrer votre nom.' });
            return;
        }

        if (!comment.trim()) {
            setMessage({ type: 'error', text: 'Veuillez écrire un commentaire.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await reviewsAPI.create({
                rating,
                comment,
                name: isAuthenticated ? user?.name : name
            });
            setMessage({ type: 'success', text: 'Merci ! Votre avis a été envoyé et sera visible après validation.' });
            setComment('');
            setName('');
            setRating(5);
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Une erreur est survenue.' });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <p className="text-gray-600 mb-4">Veuillez vous connecter pour laisser un avis.</p>
                <a href="/login" className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors">
                    Se connecter
                </a>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all hover:shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="text-orange-500 fill-orange-500" />
                Laissez votre avis
            </h3>

            {message && (
                <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Note globale</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={`${(hoverRating || rating) >= star ? 'text-orange-400 fill-orange-400' : 'text-gray-300'} transition-colors`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {!isAuthenticated && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Votre nom</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                            placeholder="Entrez votre nom"
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Votre commentaire</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                        rows={4}
                        placeholder="Partagez votre expérience..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send size={20} />
                            Envoyer mon avis
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
