'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

import { getImageUrl } from '@/lib/imageHelper';

export default function DishCard({ restaurant }) {
    const { t, translateField } = useLanguage();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if user is authenticated
        if (!isAuthenticated()) {
            // Redirect to login page if not authenticated
            router.push('/login');
            return;
        }

        addToCart({
            id: restaurant._id || restaurant.id,
            name: translateField(restaurant, 'name'),
            price: restaurant.price || 0,
            image: restaurant.mainImage || restaurant.image,
            type: restaurant.type || restaurant.cuisine
        });

        // Show toast notification
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className="relative">
            <Link href={`/product/${restaurant._id || restaurant.id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-transparent">
                    {/* Image Container */}
                    <div className="relative h-48 w-full bg-gray-200">
                        <Image
                            src={getImageUrl(restaurant.mainImage || restaurant.image)}
                            alt={translateField(restaurant, 'name')}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Featured Badge */}
                        {restaurant.featured && (
                            <div className="absolute top-3 left-3">
                                <span className="bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                                    {t('products.featured')}
                                </span>
                            </div>
                        )}

                        {/* Rating Badge */}
                        <div className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-full shadow-md border border-gray-200">
                            <span className="text-sm font-semibold text-gray-800">
                                {restaurant.rating?.toFixed(1) || '0.0'}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                            {translateField(restaurant, 'name')}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {translateField(restaurant, 'description') || restaurant.type || restaurant.cuisine}
                        </p>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{restaurant.preparationTime || restaurant.deliveryTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>{restaurant.servings || t('products.available')}</span>
                            </div>
                        </div>

                        {/* Price and Add to Cart */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                {t('products.price')}: <span className="font-semibold text-[var(--primary-green)] text-base">{restaurant.price ? `${restaurant.price} DA` : restaurant.minOrder}</span>
                            </p>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className="bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-hover)] hover:shadow-lg text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center gap-1 shadow-md"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {t('products.addToCart')}
                            </button>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-slide-in">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">{t('products.addedToCart')}</span>
                </div>
            )}
        </div>
    );
}
