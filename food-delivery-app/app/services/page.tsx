'use client';

import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface InstagramPost {
    _id: string;
    image: string;
    postUrl: string;
    order: number;
    isActive: boolean;
}

export default function ServicesPage() {
    const { language } = useLanguage();
    const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInstagramPosts();
    }, []);

    const fetchInstagramPosts = async () => {
        try {
            const response = await api.get('/instagram');
            setInstagramPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching Instagram posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const services = [
        {
            id: 1,
            titleFr: "Dining Guides",
            titleAr: "أدلة الطعام",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <path fill="currentColor" d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66zm6.78-1.81c1.53.71 3.68.21 5.27-1.38c1.91-1.91 2.28-4.65.81-6.12c-1.46-1.46-4.2-1.1-6.12.81c-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88l1.41-1.41L13.41 13.1z" />
                </svg>
            ),
            iconBg: "bg-pink-100",
            iconColor: "text-red-500",
            cardBg: "bg-white",
            descriptionFr: "Detailed reviews of local eateries, covering various cuisines, price points, and dining experiences.",
            descriptionAr: "مراجعات تفصيلية للمطاعم المحلية، تغطي مختلف المأكولات ونقاط الأسعار وتجارب تناول الطعام."
        },
        {
            id: 2,
            titleFr: "100% Fresh Food",
            titleAr: "طعام طازج 100%",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m-5.5-2.5l7.51-3.49L17.5 6.5L9.99 9.99zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1s-1.1-.49-1.1-1.1s.49-1.1 1.1-1.1" />
                </svg>
            ),
            iconBg: "bg-pink-100",
            iconColor: "text-red-500",
            cardBg: "bg-white",
            descriptionFr: "Detailed reviews of local eateries, covering various cuisines, price points, and dining experiences.",
            descriptionAr: "مراجعات تفصيلية للمطاعم المحلية، تغطي مختلف المأكولات ونقاط الأسعار وتجارب تناول الطعام."
        },
        {
            id: 3,
            titleFr: "Special Offers And Discounts",
            titleAr: "عروض وخصومات خاصة",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <path fill="currentColor" d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67l-.5-.68C10.96 2.54 10.05 2 9 2C7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2m-5-2c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M9 4c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m11 15H4v-2h16zm0-5H4V8h5.08L7 10.83L8.62 12L12 7.4l3.38 4.6L17 10.83L14.92 8H20z" />
                </svg>
            ),
            iconBg: "bg-pink-100",
            iconColor: "text-red-500",
            cardBg: "bg-white",
            descriptionFr: "Detailed reviews of local eateries, covering various cuisines, price points, and dining experiences.",
            descriptionAr: "مراجعات تفصيلية للمطاعم المحلية، تغطي مختلف المأكولات ونقاط الأسعار وتجارب تناول الطعام."
        },
        {
            id: 4,
            titleFr: "Fast Delivery",
            titleAr: "توصيل سريع",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <path fill="currentColor" d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5z" />
                </svg>
            ),
            iconBg: "bg-pink-100",
            iconColor: "text-red-500",
            cardBg: "bg-white",
            descriptionFr: "Detailed reviews of local eateries, covering various cuisines, price points, and dining experiences.",
            descriptionAr: "مراجعات تفصيلية للمطاعم المحلية، تغطي مختلف المأكولات ونقاط الأسعار وتجارب تناول الطعام."
        },
        {
            id: 5,
            titleFr: "Catering Services",
            titleAr: "خدمات الطعام",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <path fill="currentColor" d="M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4m-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2z" />
                </svg>
            ),
            iconBg: "bg-pink-100",
            iconColor: "text-red-500",
            cardBg: "bg-white",
            descriptionFr: "Detailed reviews of local eateries, covering various cuisines, price points, and dining experiences.",
            descriptionAr: "مراجعات تفصيلية للمطاعم المحلية، تغطي مختلف المأكولات ونقاط الأسعار وتجارب تناول الطعام."
        },
        {
            id: 6,
            titleFr: "Online Ordering",
            titleAr: "الطلب عبر الإنترنت",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <path fill="currentColor" d="M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25q0-.075.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2" />
                </svg>
            ),
            iconBg: "bg-pink-100",
            iconColor: "text-red-500",
            cardBg: "bg-white",
            descriptionFr: "Detailed reviews of local eateries, covering various cuisines, price points, and dining experiences.",
            descriptionAr: "مراجعات تفصيلية للمطاعم المحلية، تغطي مختلف المأكولات ونقاط الأسعار وتجارب تناول الطعام."
        }
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <div
                className="relative h-[500px] bg-cover bg-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&q=80)',
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-12 h-0.5 bg-white"></div>
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                        <div className="w-12 h-0.5 bg-white"></div>
                    </div>
                    <h1 className="text-white text-5xl md:text-7xl font-bold text-center mb-4">
                        {language === 'ar' ? 'خدماتنا' : 'Nos Services'}
                    </h1>
                    <p className="text-white text-2xl md:text-3xl font-serif italic text-center">
                        {language === 'ar'
                            ? 'حلول شاملة لجميع احتياجات مناسباتكم'
                            : 'Solutions complètes pour tous vos événements'}
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#FF8C42]"
                        >
                            {/* Icon */}
                            <div className={`${service.iconBg} w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:shadow-lg`}>
                                <span className={service.iconColor}>
                                    {service.icon}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 text-gray-800 group-hover:text-[#FF8C42]">
                                {language === 'ar' ? service.titleAr : service.titleFr}
                            </h3>

                            {/* Description */}
                            <p className="leading-relaxed text-gray-600">
                                {language === 'ar' ? service.descriptionAr : service.descriptionFr}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instagram Gallery Section - Scrolling Marquee */}
            <div className="bg-white py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">
                        {language === 'ar' ? 'تابعنا على إنستغرام' : 'Suivez-nous sur Instagram'}
                    </h2>
                    <div className="w-16 h-1 bg-[#FF8C42] mx-auto"></div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C42]"></div>
                    </div>
                ) : instagramPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">
                            {language === 'ar' ? 'لا توجد منشورات بعد' : 'Aucun post pour le moment'}
                        </p>
                    </div>
                ) : (
                    <div className="relative overflow-hidden">
                        <div className="flex gap-6 animate-instagram-scroll" style={{ width: 'max-content' }}>
                            {instagramPosts.map((post) => {
                                const imageUrl = 'http://localhost:5000' + post.image;
                                return (
                                    <a
                                        key={post._id}
                                        href={post.postUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative flex-shrink-0 w-[280px] h-[280px] overflow-hidden rounded-2xl group cursor-pointer shadow-xl"
                                    >
                                        <Image
                                            src={imageUrl}
                                            alt="Instagram Post"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-white transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Contact Footer Section */}
            <div className="bg-[#0a1628] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#FF8C42] rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Address */}
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-[#FF8C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Address</div>
                                <div className="text-lg font-bold">Rghaia , Alger , Algeria </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-[#FF8C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Send Email</div>
                                <div className="text-lg font-bold">tabakhdziri@gmail.com</div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-[#FF8C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Call Emergency</div>
                                <div className="text-lg font-bold">0560604172</div>
                            </div>
                        </div>

                        {/* Scroll to Top Button */}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
                        >
                            <svg className="w-6 h-6 text-[#FF8C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
