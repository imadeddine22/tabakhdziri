'use client';

import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <LanguageProvider>
            <AuthProvider>
                <CartProvider>
                    <Header />
                    {children}
                    <Footer />
                </CartProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}
