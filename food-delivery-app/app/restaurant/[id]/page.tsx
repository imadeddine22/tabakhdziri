'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getRestaurant } from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function RestaurantPage() {
    const params = useParams();
    const { addToCart } = useCart();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [addedItems, setAddedItems] = useState<any>({});

    useEffect(() => {
        async function fetchRestaurant() {
            if (params.id) {
                const data = await getRestaurant(params.id);
                setRestaurant(data);
                setLoading(false);
            }
        }
        fetchRestaurant();
    }, [params.id]);

    const handleAddToCart = (item: any) => {
        addToCart(item);
        setAddedItems({ ...addedItems, [item.id]: true });
        setTimeout(() => {
            setAddedItems({ ...addedItems, [item.id]: false });
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-orange)]"></div>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="responsive-container py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Restaurant non trouvé</h1>
                    <a href="/" className="text-[var(--primary-orange)] hover:underline">
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Restaurant Header */}
            <div className="relative h-80 bg-gray-900">
                <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="responsive-container">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
                                <p className="text-white/90 text-lg mb-4">{restaurant.cuisine}</p>
                                <div className="flex items-center gap-6 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400">⭐</span>
                                        <span>{restaurant.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{restaurant.deliveryTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        <span>Livraison: {restaurant.deliveryFee}</span>
                                    </div>
                                </div>
                            </div>
                            {restaurant.featured && (
                                <span className="bg-[var(--primary-orange)] text-white px-6 py-2 rounded-full font-medium">
                                    ⭐ Vedette
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Restaurant Info */}
            <div className="bg-gray-50 border-b border-gray-200 py-4">
                <div className="responsive-container">
                    <div className="flex items-center gap-8 text-sm text-gray-600">
                        <div>
                            <span className="font-semibold text-gray-800">Commande minimum:</span> {restaurant.minOrder}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Adresse:</span> {restaurant.address}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Téléphone:</span> {restaurant.phone}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="responsive-container py-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Menu</h2>

                {restaurant.menu && restaurant.menu.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurant.menu.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="relative h-48 bg-gray-200">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-[var(--primary-orange)]">{item.price} DA</span>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${addedItems[item.id]
                                                ? 'bg-[var(--primary-green)] text-white'
                                                : 'bg-[var(--primary-orange)] text-white hover:bg-[#e67a2e]'
                                                }`}
                                        >
                                            {addedItems[item.id] ? '✓ Ajouté' : 'Ajouter'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">Menu non disponible pour le moment</p>
                        <p className="text-gray-400 text-sm mt-2">Contactez le restaurant pour plus d'informations</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
