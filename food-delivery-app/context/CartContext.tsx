'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    [key: string]: any;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: any) => void;
    removeFromCart: (itemId: string | number) => void;
    updateQuantity: (itemId: string | number, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (error) {
                    console.error('Error parsing cart data:', error);
                    localStorage.removeItem('cart');
                }
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (item: any) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === item.id);

            if (existingItem) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }

            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string | number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId: string | number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
