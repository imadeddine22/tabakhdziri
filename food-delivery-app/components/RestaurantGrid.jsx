'use client';

import { useState } from 'react';
import DishCard from './RestaurantCard';
import { useLanguage } from '@/context/LanguageContext';

export default function RestaurantGrid({ dishes }) {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showFilters, setShowFilters] = useState(false);
    const { t } = useLanguage();

    const handleFilterClick = () => {
        setShowFilters(!showFilters);
        // You can add filter panel logic here
        console.log('Filter button clicked');
    };

    return (
        <section id="all-restaurants" className="py-4 sm:py-8 bg-white transition-colors duration-300">
            <div className="responsive-container">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {t('products.ourDishes')} <span className="text-gray-500">({dishes.length})</span>
                    </h2>

                    {/* الأزرار - تظهر فقط على الشاشات الكبيرة */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Filter Button */}
                        <button
                            onClick={handleFilterClick}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 bg-white"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{t('products.filters')}</span>
                        </button>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-hover)] text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition-colors ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-hover)] text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Restaurant Grid */}
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'flex flex-col gap-4'
                }>
                    {dishes.map((dish) => (
                        <DishCard key={dish._id || dish.id} restaurant={dish} />
                    ))}
                </div>

                {/* Empty State */}
                {dishes.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg">{t('products.noDishesFound')}</p>
                        <p className="text-gray-400 text-sm mt-2">{t('products.tryModifyFilters')}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
