'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } else {
            // إذا لم يكن هناك theme محفوظ، تأكد من إزالة class dark
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, []);

    // Update DOM when theme changes
    useEffect(() => {
        console.log('Theme changed to:', theme, 'Mounted:', mounted);
        if (mounted) {
            // إزالة جميع الـ classes المتعلقة بالثيم أولاً
            document.documentElement.classList.remove('dark', 'light');

            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
                console.log('✅ Added dark class. Current classes:', document.documentElement.className);
            } else {
                // تأكد من إزالة class dark تماماً
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
                console.log('✅ Removed dark class. Current classes:', document.documentElement.className);
            }
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        console.log('🔄 Toggling theme from', theme, 'to', newTheme);
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        console.log('💾 Saved to localStorage:', localStorage.getItem('theme'));
    };

    // Always provide the context, even before mounting to prevent context errors
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
