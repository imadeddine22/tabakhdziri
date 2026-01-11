'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { AdminThemeProvider } from '@/context/AdminThemeContext';

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LanguageProvider>
            <AdminThemeProvider>
                {children}
            </AdminThemeProvider>
        </LanguageProvider>
    );
}
