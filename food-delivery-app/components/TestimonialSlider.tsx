
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { reviewsAPI } from '@/lib/api';

export default function TestimonialSlider({ initialTestimonials, language }: { initialTestimonials: any[], language: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await reviewsAPI.getApproved();
                if (res.data && res.data.length > 0) {
                    setReviews(res.data);
                } else {
                    setReviews(initialTestimonials); // Fallback to provided hardcoded ones
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setReviews(initialTestimonials);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [initialTestimonials]);

    useEffect(() => {
        if (reviews.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [reviews.length]);

    if (loading || reviews.length === 0) return null;

    const currentReview = reviews[currentIndex];

    // Normalize data structure between API review and local testimonial
    // Local: { name, date, textFr, textAr, image }
    // API: { name, createdAt, comment, user: { name? }, rating }

    const displayText = currentReview.comment || (language === 'ar' ? currentReview.textAr : currentReview.textFr);
    const displayDate = currentReview.createdAt
        ? new Date(currentReview.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { day: 'numeric', month: 'short' })
        : currentReview.date;
    const displayName = currentReview.name;
    const displayImage = currentReview.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ff8c42&color=fff`;

    return (
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 md:p-12 transition-all duration-500">
            <div className="flex items-start gap-6 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                        src={displayImage}
                        alt={displayName}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h4 className="text-white font-bold text-xl">
                        {displayName}
                    </h4>
                    <p className="text-gray-400">{displayDate}</p>
                </div>
            </div>

            <p className="text-white text-lg italic leading-relaxed mb-6 min-h-[100px]">
                "{displayText}"
            </p>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2">
                {reviews.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                            ? 'bg-[#FF8C42] w-8'
                            : 'bg-gray-500'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
