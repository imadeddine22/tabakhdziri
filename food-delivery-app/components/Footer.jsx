'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
    const { t, language } = useLanguage();

    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF8C42] rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6BCF7F] rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <img
                                src="/logo.png"
                                alt="Tabakh Dziri Logo"
                                className="h-32 w-auto transform hover:scale-105 transition-transform duration-300"
                            />
                            <h3 className="text-2xl md:text-3xl font-bold text-white">
                                Tabakh Dziri
                            </h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            {language === 'ar'
                                ? 'نقدم لكم أشهى الأطباق بجودة عالية، مع تنقّل فريقنا إلى المكان الذي تختارونه لخدمتكم بكل احترافية.'
                                : 'Nous vous offrons les meilleurs plats de haute qualité, avec le déplacement de notre équipe à l\'endroit de votre choix pour vous servir avec professionnalisme.'}
                        </p>

                        {/* Social Media */}
                        <div>
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-[#FF8C42] to-[#6BCF7F] rounded-full"></div>
                                {t('hero.followUs')}
                            </h4>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.facebook.com/share/14WqAjkmLHG/?mibextid=wwXIfr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center hover:from-[#1877F2] hover:to-[#0C63D4] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                                    title="Facebook"
                                >
                                    <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                                </a>

                                <a
                                    href="https://www.instagram.com/tbakh_djazayri?igsh=MTE2NWh3cjl4dDl1OA=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center hover:from-[#E1306C] hover:to-[#833AB4] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50"
                                    title="Instagram"
                                >
                                    <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                                </a>

                                <a
                                    href="https://www.tiktok.com/@groupe649azizi?_r=1&_t=ZS-92tjJtGv0lR"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center hover:from-black hover:to-[#00F2EA] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50"
                                    title="TikTok"
                                >
                                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://wa.me/213560604172"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center hover:from-[#25D366] hover:to-[#128C7E] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/50"
                                    title="WhatsApp"
                                >
                                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-[#FF8C42] to-[#6BCF7F] rounded-full"></div>
                            {language === 'ar' ? 'روابط سريعة' : 'Liens Rapides'}
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { href: '/', label: language === 'ar' ? 'الرئيسية' : 'Accueil' },
                                { href: '/about', label: language === 'ar' ? 'من نحن' : 'À propos' },
                                { href: '/plats', label: language === 'ar' ? 'قائمة الطعام' : 'Menu' },
                                { href: '/services', label: language === 'ar' ? 'خدماتنا' : 'Services' },
                                { href: '/contact', label: language === 'ar' ? 'اتصل بنا' : 'Contact' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-[#FF8C42] transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-0.5 bg-[#FF8C42] group-hover:w-4 transition-all duration-300"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-[#FF8C42] to-[#6BCF7F] rounded-full"></div>
                            {language === 'ar' ? 'تواصل معنا' : 'Contactez-nous'}
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-[#FF8C42] group-hover:to-[#FF8C42] transition-all duration-300">
                                    <Phone className="w-5 h-5 text-gray-300 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'اتصل بنا' : 'Appelez-nous'}</p>
                                    <div className="flex flex-col gap-1">
                                        <a href="tel:+213560604172" className="text-gray-300 hover:text-[#FF8C42] transition-colors">
                                            0560 604 172
                                        </a>
                                        <a href="tel:+213795577945" className="text-gray-300 hover:text-[#FF8C42] transition-colors">
                                            07 95 577 945
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li className="flex items-start gap-3 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-[#FF8C42] group-hover:to-[#FF8C42] transition-all duration-300">
                                    <Mail className="w-5 h-5 text-gray-300 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'راسلنا' : 'Écrivez-nous'}</p>
                                    <a href="mailto:contact@tabakhdziri.com" className="text-gray-300 hover:text-[#FF8C42] transition-colors break-all">
                                        contact@tabakhdziri.com
                                    </a>
                                </div>
                            </li>

                            <li className="flex items-start gap-3 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-[#6BCF7F] group-hover:to-[#6BCF7F] transition-all duration-300">
                                    <Clock className="w-5 h-5 text-gray-300 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'ساعات العمل' : 'Horaires'}</p>
                                    <p className="text-gray-300 text-sm">
                                        {language === 'ar' ? 'يومياً: 10:00 - 23:00' : 'Tous les jours: 10:00 - 23:00'}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
