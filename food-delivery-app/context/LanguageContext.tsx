'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';

type Language = 'fr' | 'ar';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    translateField: (obj: any, fieldName: string) => string;
    dir: 'ltr' | 'rtl';
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = { fr, ar };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('fr');

    useEffect(() => {
        // Load language from localStorage
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'fr' || savedLang === 'ar')) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        // Update document direction
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return typeof value === 'string' ? value : key;
    };

    /**
     * دالة ترجمة تلقائية للحقول الديناميكية
     * تبحث عن حقل الترجمة العربية (field_ar) وتعيده إذا كانت اللغة عربية
     * مثال: translateField(product, 'name') سيعيد product.name_ar إذا كانت اللغة عربية
     */
    const translateField = (obj: any, fieldName: string): string => {
        if (!obj) return '';
        
        // إذا كانت اللغة عربية، ابحث عن الحقل العربي
        if (language === 'ar') {
            const arFieldName = `${fieldName}_ar`;
            // إذا وجد الحقل العربي وليس فارغاً، أعده
            if (obj[arFieldName] && obj[arFieldName].trim() !== '') {
                return obj[arFieldName];
            }
        }
        
        // إذا لم يوجد حقل عربي أو اللغة فرنسية، أعد الحقل الأصلي
        return obj[fieldName] || '';
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';
    const isRTL = language === 'ar';

    useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
    }, [language, dir]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, translateField, dir, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
