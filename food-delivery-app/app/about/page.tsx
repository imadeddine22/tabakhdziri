'use client';

import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ReviewForm from '@/components/ReviewForm';
import TestimonialSlider from '@/components/TestimonialSlider';

export default function AboutPage() {
    const { t, language } = useLanguage();
    const [currentTestimonial, setCurrentTestimonial] = useState(0); // Kept for legacy if needed, but TestimonialSlider handles its own state

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" className="transition-all duration-300 group-hover:scale-110">
                    <path fill="currentColor" d="M0 3.75A.75.75 0 0 1 .75 3h7.497c1.566 0 2.945.8 3.751 2.014A4.495 4.495 0 0 1 15.75 3h7.5a.75.75 0 0 1 .75.75v15.063a.752.752 0 0 1-.755.75l-7.682-.052a3 3 0 0 0-2.142.878l-.89.891a.75.75 0 0 1-1.061 0l-.902-.901a2.996 2.996 0 0 0-2.121-.879H.75a.75.75 0 0 1-.75-.75Zm12.75 15.232a4.503 4.503 0 0 1 2.823-.971l6.927.047V4.5h-6.75a3 3 0 0 0-3 3ZM11.247 7.497a3 3 0 0 0-3-2.997H1.5V18h6.947c1.018 0 2.006.346 2.803.98Z" />
                </svg>
            ),
            titleFr: 'Pour Tous les Goûts',
            titleAr: 'لكل الأذواق',
            descFr: 'Une variété de plats traditionnels algériens pour satisfaire tous les palais',
            descAr: 'مجموعة متنوعة من الأطباق الجزائرية التقليدية لإرضاء جميع الأذواق'
        },
        {
            icon: (
                <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="transition-all duration-300 group-hover:scale-110">
                    <path fill="currentColor" fillRule="evenodd" d="M6.404 4.998c-.476 0-.814.318-.878.697c-.45 2.664-1.073 7.295-1.023 12.214c.017 1.735 1.157 3.255 2.961 3.66c2.542.572 5.531.572 8.073 0c1.804-.405 2.943-1.925 2.961-3.66c.05-4.92-.574-9.55-1.024-12.214c-.064-.38-.402-.697-.879-.697h-1.002l.406 8.932a1.5 1.5 0 0 1-2.997.136l-.413-9.068h-2.178l-.413 9.068a1.5 1.5 0 0 1-2.996-.136l.406-8.932zm-4.823.032C1.986 2.633 4.071.998 6.404.998h10.191c2.333 0 4.418 1.634 4.823 4.03c.47 2.787 1.133 7.675 1.08 12.922c-.036 3.51-2.392 6.693-6.084 7.522q-.728.164-1.484.276l1.63 15.525c.276 2.627-1.36 5.268-4.084 5.647c-.352.05-.688.081-.975.081s-.623-.032-.975-.08c-2.723-.38-4.36-3.02-4.084-5.648l1.63-15.525q-.757-.113-1.484-.276c-3.693-.83-6.05-4.011-6.085-7.523C.45 12.703 1.111 7.816 1.581 5.03m43.919.968c-9.941 0-18 8.059-18 18s8.059 18 18 18a2 2 0 0 1 0 4c-12.15 0-22-9.85-22-22s9.85-22 22-22a2 2 0 1 1 0 4m-.5 9a9 9 0 0 0 0 18a2.5 2.5 0 0 1 0 5c-7.732 0-14-6.268-14-14s6.268-14 14-14a2.5 2.5 0 1 1 0 5" clipRule="evenodd" />
                </svg>
            ),
            titleFr: 'Ingrédients Frais',
            titleAr: 'مكونات طازجة',
            descFr: 'Nous utilisons uniquement des ingrédients frais et de qualité supérieure',
            descAr: 'نستخدم فقط المكونات الطازجة وذات الجودة العالية'
        },
        {
            icon: (
                <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="transition-all duration-300 group-hover:scale-110">
                    <path fill="currentColor" fillRule="evenodd" d="M18 3c-.623 0-1.216.127-1.756.355A5 5 0 0 0 12 1a5 5 0 0 0-4.356 2.543A4.5 4.5 0 1 0 5.5 12v6.25h13v-6.277A4.5 4.5 0 0 0 18 3m.5 16.75h-13V23h13z" clipRule="evenodd" />
                </svg>
            ),
            titleFr: 'Chefs Expérimentés',
            titleAr: 'طهاة ذوو خبرة',
            descFr: 'Notre équipe de chefs passionnés apporte des années d\'expérience',
            descAr: 'فريقنا من الطهاة المتحمسين يجلب سنوات من الخبرة'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Boujloud',
            date: '12 Oct',
            textFr: 'Service exceptionnel et plats délicieux ! Tabakh Dziri a rendu notre mariage inoubliable.',
            textAr: 'خدمة استثنائية وأطباق لذيذة! طباخ جزيري جعل زفافنا لا يُنسى.',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
        },
        {
            name: 'Ahmed',
            date: '5 Nov',
            textFr: 'Qualité exceptionnelle et professionnalisme remarquable. Je recommande vivement !',
            textAr: 'جودة استثنائية واحترافية ملحوظة. أوصي بشدة!',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        {
            name: 'Fatima',
            date: '20 Nov',
            textFr: 'Des saveurs authentiques qui rappellent la cuisine de ma grand-mère. Magnifique !',
            textAr: 'نكهات أصيلة تذكرني بطبخ جدتي. رائع!',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
        }
    ];



    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <div
                className="relative h-[500px] bg-cover bg-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)',
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
                        {language === 'ar' ? 'من نحن' : 'À propos de nous'}
                    </h1>
                    <p className="text-white text-2xl md:text-3xl font-serif italic text-center">
                        {language === 'ar'
                            ? 'نطبخ أطباقاً لذيذة منذ 2005'
                            : 'Cuisiner des plats délicieux depuis 2005'}
                    </p>
                </div>
            </div>

            {/* Our Story Section - First */}
            <div className="bg-white py-20 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 text-9xl">🍽️</div>
                    <div className="absolute bottom-10 right-10 text-9xl">☕</div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="w-16 h-1 bg-[#FF8C42] mx-auto mb-6"></div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        {language === 'ar' ? 'قصتنا' : 'Our Story'}
                    </h2>
                    <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                        {language === 'ar'
                            ? 'تأسست طباخ جزيري في عام 2005 بشغف لتقديم أفضل الأطباق الجزائرية التقليدية. على مر السنين، أصبحنا الخيار الأول للعائلات والمناسبات الخاصة في جميع أنحاء الجزائر.'
                            : 'Tabakh Dziri a été fondé en 2005 avec la passion de servir les meilleurs plats algériens traditionnels. Au fil des ans, nous sommes devenus le premier choix pour les familles et les événements spéciaux à travers l\'Algérie.'}
                    </p>
                    <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                        {language === 'ar'
                            ? 'نحن نؤمن بأن الطعام الجيد يجمع الناس معاً. كل وصفة نستخدمها تم تناقلها عبر الأجيال، مع لمسة عصرية تناسب الأذواق المعاصرة.'
                            : 'Nous croyons que la bonne nourriture rassemble les gens. Chaque recette que nous utilisons a été transmise de génération en génération, avec une touche moderne qui convient aux goûts contemporains.'}
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        {language === 'ar'
                            ? 'من حفلات الزفاف الكبيرة إلى التجمعات العائلية الحميمة، نحن هنا لجعل كل لحظة خاصة ولا تُنسى.'
                            : 'Des grands mariages aux réunions familiales intimes, nous sommes là pour rendre chaque moment spécial et inoubliable.'}
                    </p>

                    {/* Signature */}
                    <div className="mt-12">


                    </div>
                </div>
            </div>

            {/* Features Section - After Our Story */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group bg-white p-8 rounded-lg text-center hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-[#FF8C42]">
                            <div className="text-gray-700 group-hover:text-[#FF8C42] transition-colors duration-300 mb-4 flex justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#FF8C42] transition-colors duration-300 mb-3">
                                {language === 'ar' ? feature.titleAr : feature.titleFr}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {language === 'ar' ? feature.descAr : feature.descFr}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Choose Tabakh Dziri Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
                        <Image
                            src="/images/chef-team.png"
                            alt="Chef Team"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            {language === 'ar' ? 'لماذا تختار طباخ جزيري' : 'Pourquoi choisir Tabakh Dziri'}
                        </h2>
                        <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                            {language === 'ar'
                                ? 'نحن نقدم تجربة طهي استثنائية تجمع بين النكهات التقليدية والتقنيات الحديثة. كل طبق يتم إعداده بعناية فائقة لضمان رضاكم التام.'
                                : 'Nous offrons une expérience culinaire exceptionnelle qui combine saveurs traditionnelles et techniques modernes. Chaque plat est préparé avec le plus grand soin pour garantir votre entière satisfaction.'}
                        </p>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                            {language === 'ar'
                                ? 'فريقنا من الطهاة المحترفين ملتزم بتقديم أفضل الأطباق الجزائرية الأصيلة لجعل مناسبتكم لا تُنسى.'
                                : 'Notre équipe de chefs professionnels s\'engage à offrir les meilleurs plats algériens authentiques pour rendre votre événement inoubliable.'}
                        </p>
                        <Link href="/contact">
                            <button className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-orange-500 transition-colors">
                                {language === 'ar' ? 'حجز موعد' : 'Reservez un rendez-vous'}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>


            {/* Testimonials Section */}
            <div
                className="relative py-20 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80)',
                }}
            >
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-white mb-12 text-center">
                        {language === 'ar' ? 'ماذا يقول عملاؤنا' : 'Ce que disent nos clients'}
                    </h2>

                    {/* Add Review Form here */}
                    <div className="mb-12">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">
                                {language === 'ar' ? 'شاركنا برأيك' : 'Laissez votre avis'}
                            </h3>
                            <ReviewForm onReviewSubmitted={() => {
                                // Optional: refresh reviews if we move the fetching logic up
                            }} />
                        </div>
                    </div>

                    {/* Testimonial Slider */}
                    <TestimonialSlider initialTestimonials={testimonials} language={language} />
                </div>
            </div>


            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-50 border border-gray-200"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div >
    );
}
