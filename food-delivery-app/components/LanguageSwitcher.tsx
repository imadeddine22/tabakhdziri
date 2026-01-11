'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'fr' ? 'ar' : 'fr');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition-colors border border-gray-200"
            title={language === 'fr' ? 'Passer à l\'arabe' : 'التبديل للفرنسية'}
        >
            <Globe size={20} className="text-orange-500" />
            <span className="font-semibold text-gray-700">
                {language === 'fr' ? 'عربي' : 'Français'}
            </span>
        </button>
    );
}
