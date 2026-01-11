'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
    token?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
    requireAuth: () => boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        }
    }, []);

    // Login function
    const login = (userData: User) => {
        setUser(userData);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
            if (userData.token) {
                localStorage.setItem('token', userData.token);
            }
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        router.push('/');
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!user;
    };

    // Require authentication - redirect to login if not authenticated
    const requireAuth = () => {
        if (!isAuthenticated()) {
            router.push('/login');
            return false;
        }
        return true;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated,
                requireAuth,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
