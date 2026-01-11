'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initialize theme from localStorage on mount
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('admin-theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        } else if (savedTheme === 'light') {
            setIsDarkMode(false);
        } else {
            // Default to system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    }, []);

    // Save theme preference to localStorage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('admin-theme', isDarkMode ? 'dark' : 'light');
        }
    }, [isDarkMode, mounted]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return null;
    }

    return (
        <AdminThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </AdminThemeContext.Provider>
    );
}

export function useAdminTheme() {
    const context = useContext(AdminThemeContext);
    if (context === undefined) {
        throw new Error('useAdminTheme must be used within AdminThemeProvider');
    }
    return context;
}
