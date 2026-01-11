'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const validImages = images && images.length > 0 ? images : ['/images/placeholder.png'];

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <>
            <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                    <img
                        src={getImageUrl(validImages[currentIndex])}
                        alt={`${productName} - صورة ${currentIndex + 1}`}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() => setIsFullscreen(true)}
                        onError={(e) => e.currentTarget.src = '/images/placeholder.png'}
                    />

                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                        {currentIndex + 1} / {validImages.length}
                    </div>

                    {/* Navigation Arrows */}
                    {validImages.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="الصورة السابقة"
                            >
                                <ChevronLeft size={24} className="text-gray-800" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="الصورة التالية"
                            >
                                <ChevronRight size={24} className="text-gray-800" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail Images */}
                {validImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                        {validImages.map((img: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => goToImage(index)}
                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentIndex === index
                                        ? 'border-orange-500 ring-2 ring-orange-200 scale-105'
                                        : 'border-gray-200 hover:border-orange-300'
                                    }`}
                                aria-label={`عرض الصورة ${index + 1}`}
                            >
                                <img
                                    src={getImageUrl(img)}
                                    alt={`${productName} - مصغرة ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.currentTarget.src = '/images/placeholder.png'}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                        aria-label="إغلاق"
                    >
                        <X size={24} />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute top-4 left-4 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentIndex + 1} / {validImages.length}
                    </div>

                    {/* Main Image */}
                    <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <img
                            src={getImageUrl(validImages[currentIndex])}
                            alt={`${productName} - صورة ${currentIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => e.currentTarget.src = '/images/placeholder.png'}
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {validImages.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                                aria-label="الصورة السابقة"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                                aria-label="الصورة التالية"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Thumbnail Strip */}
                    {validImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
                            {validImages.map((img: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => goToImage(index)}
                                    className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${currentIndex === index
                                            ? 'border-orange-500 scale-110'
                                            : 'border-white/30 hover:border-white/60'
                                        }`}
                                >
                                    <img
                                        src={getImageUrl(img)}
                                        alt={`مصغرة ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.currentTarget.src = '/images/placeholder.png'}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
