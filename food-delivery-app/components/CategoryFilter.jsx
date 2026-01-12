'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageHelper';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-6 bg-white border-y border-gray-200 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    {/* Scroll Buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-all duration-300 hidden md:block border border-gray-200"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-all duration-300 hidden md:block border border-gray-200"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Categories */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* "All" Button */}
                        <button
                            onClick={() => onSelectCategory(null)}
                            className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${selectedCategory === null ? 'scale-110' : ''
                                }`}
                        >
                            <div className={`relative w-20 h-20 rounded-full overflow-hidden border-4 transition-all flex items-center justify-center ${selectedCategory === null
                                ? 'border-[var(--primary-orange)] shadow-lg bg-gradient-to-br from-orange-400 to-orange-600'
                                : 'border-white group-hover:border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200'
                                }`}>
                                <svg
                                    className={`w-10 h-10 transition-colors ${selectedCategory === null ? 'text-white' : 'text-gray-600 group-hover:text-[var(--primary-orange)]'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>
                            <span className={`text-sm font-medium transition-colors ${selectedCategory === null
                                ? 'text-[var(--primary-orange)]'
                                : 'text-gray-700 group-hover:text-[var(--primary-orange)]'
                                }`}>
                                الكل
                            </span>
                        </button>

                        {/* Category Buttons */}
                        {categories.map((category) => (
                            <button
                                key={category._id || category.id}
                                onClick={() => onSelectCategory(category.name === selectedCategory ? null : category.name)}
                                className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${selectedCategory === category.name ? 'scale-110' : ''
                                    }`}
                            >
                                <div className={`relative w-20 h-20 rounded-full overflow-hidden border-4 transition-all ${selectedCategory === category.name
                                    ? 'border-[var(--primary-orange)] shadow-lg'
                                    : 'border-white group-hover:border-gray-200'
                                    }`}>
                                    <Image
                                        src={getImageUrl(category.image)}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                        onError={(e) => {
                                            // Fallback if image fails
                                            e.currentTarget.src = '/images/placeholder.png'; // You might want to handle this better with Next Image
                                        }}
                                    />
                                </div>
                                <span className={`text-sm font-medium transition-colors ${selectedCategory === category.name
                                    ? 'text-[var(--primary-orange)]'
                                    : 'text-gray-700 group-hover:text-[var(--primary-orange)]'
                                    }`}>
                                    {category.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
