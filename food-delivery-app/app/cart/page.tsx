'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import { ordersAPI, isAuthenticated } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface CartItem {
    id: string | number;
    name: string;
    price: number;
    image?: string;
    description?: string;
    quantity: number;
    type?: string;
}

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { t, language } = useLanguage();
    const router = useRouter();
    const [customerName, setCustomerName] = useState('');
    const [customerSurname, setCustomerSurname] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [eventType, setEventType] = useState('');
    const [customEventType, setCustomEventType] = useState(''); // للحدث المخصص
    const [teamGender, setTeamGender] = useState('');
    const [wilaya, setWilaya] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Liste des 58 wilayas d'Algérie
    const wilayas = [
        '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna',
        '06 - Béjaïa', '07 - Biskra', '08 - Béchar', '09 - Blida', '10 - Bouira',
        '11 - Tamanrasset', '12 - Tébessa', '13 - Tlemcen', '14 - Tiaret', '15 - Tizi Ouzou',
        '16 - Alger', '17 - Djelfa', '18 - Jijel', '19 - Sétif', '20 - Saïda',
        '21 - Skikda', '22 - Sidi Bel Abbès', '23 - Annaba', '24 - Guelma', '25 - Constantine',
        '26 - Médéa', '27 - Mostaganem', '28 - M\'Sila', '29 - Mascara', '30 - Ouargla',
        '31 - Oran', '32 - El Bayadh', '33 - Illizi', '34 - Bordj Bou Arréridj', '35 - Boumerdès',
        '36 - El Tarf', '37 - Tindouf', '38 - Tissemsilt', '39 - El Oued', '40 - Khenchela',
        '41 - Souk Ahras', '42 - Tipaza', '43 - Mila', '44 - Aïn Defla', '45 - Naâma',
        '46 - Aïn Témouchent', '47 - Ghardaïa', '48 - Relizane', '49 - Timimoun', '50 - Bordj Badji Mokhtar',
        '51 - Ouled Djellal', '52 - Béni Abbès', '53 - In Salah', '54 - In Guezzam', '55 - Touggourt',
        '56 - Djanet', '57 - El M\'Ghair', '58 - El Meniaa'
    ];

    // Types d'événements
    const eventTypes = [
        'Mariage',
        'Fiançailles',
        'Anniversaire',
        'Baptême',
        'Circoncision',
        'Fête religieuse',
        'Événement d\'entreprise',
        'Autre'
    ];

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        // Validate all fields
        if (!customerName.trim()) {
            alert('Veuillez entrer votre nom');
            return;
        }
        if (!customerSurname.trim()) {
            alert('Veuillez entrer votre prénom');
            return;
        }
        if (!customerPhone.trim()) {
            alert('Veuillez entrer votre numéro de téléphone');
            return;
        }
        if (!eventType) {
            alert('Veuillez sélectionner le type d\'événement');
            return;
        }
        if (eventType === 'Autre' && !customEventType.trim()) {
            alert('Veuillez préciser le type d\'événement');
            return;
        }
        if (!teamGender) {
            alert('Veuillez sélectionner le type d\'équipe');
            return;
        }
        if (!wilaya) {
            alert('Veuillez sélectionner la wilaya');
            return;
        }
        if (!eventLocation.trim()) {
            alert('Veuillez entrer le lieu exact de l\'événement');
            return;
        }
        if (!eventDate) {
            alert('Veuillez sélectionner la date de l\'événement');
            return;
        }
        if (!eventTime) {
            alert('Veuillez sélectionner l\'heure de l\'événement');
            return;
        }

        // Check if user is authenticated
        if (!isAuthenticated()) {
            const confirmLogin = confirm('Vous devez vous connecter pour passer une commande. Voulez-vous vous connecter maintenant?');
            if (confirmLogin) {
                router.push('/login');
            }
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Prepare order data
            const orderData = {
                customerInfo: {
                    firstName: customerSurname,
                    lastName: customerName,
                    phone: customerPhone
                },
                items: cart.map((item: CartItem) => ({
                    dishId: String(item.id),
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image || ''
                })),
                eventDetails: {
                    eventType: eventType === 'Autre' ? `Autre: ${customEventType}` : eventType,
                    teamGender,
                    wilaya,
                    location: eventLocation,
                    date: eventDate,
                    time: eventTime
                },
                totalAmount: getCartTotal()
            };

            console.log('📦 إرسال طلب جديد...');
            console.log('📋 بيانات الطلب:', orderData);

            // Send order to backend
            const response = await ordersAPI.create(orderData);

            console.log('✅ استجابة الخادم:', response);

            // Clear cart and form
            clearCart();
            setCustomerName('');
            setCustomerSurname('');
            setCustomerPhone('');
            setEventType('');
            setCustomEventType('');
            setTeamGender('');
            setWilaya('');
            setEventLocation('');
            setEventDate('');
            setEventTime('');

            // Show success message
            alert('Commande passée avec succès! Nous vous contacterons bientôt.');

            // Redirect to home
            router.push('/');
        } catch (err: any) {
            console.error('❌ خطأ في الطلب:', err);
            console.error('  الاستجابة:', err.response);
            console.error('  البيانات:', err.response?.data);
            console.error('  الحالة:', err.response?.status);

            setError(err.response?.data?.message || 'Erreur lors de la commande. Veuillez réessayer.');
            alert('Erreur lors de la commande: ' + (err.response?.data?.message || 'Veuillez réessayer'));
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityInputChange = (itemId: string, value: string) => {
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue > 0) {
            updateQuantity(itemId, numValue);
        } else if (value === '') {
            // Allow empty input temporarily
            return;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('cart.title')}</h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t('cart.empty')}</h2>
                        <p className="text-gray-600 mb-6">{t('cart.emptyMessage')}</p>
                        <Link
                            href="/"
                            className="inline-block bg-[var(--primary-orange)] text-white px-8 py-3 rounded-lg hover:bg-[#e67a2e] transition-colors font-medium"
                        >
                            {t('cart.discoverRestaurants')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {t('cart.items')} ({cart.length})
                                    </h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                    >
                                        {t('cart.clearCart')}
                                    </button>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {cart.map((item: CartItem) => (
                                        <div key={item.id} className="p-4 sm:p-6">
                                            <div className="flex gap-3 sm:gap-4 mb-4">
                                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={item.image || '/images/placeholder.png'}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="96px"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{item.name}</h3>
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">{item.description}</p>

                                                    {/* السعر - يظهر هنا على الهاتف */}
                                                    <div className="sm:hidden">
                                                        <span className="inline-block bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white font-bold px-3 py-1.5 rounded-full text-sm">
                                                            {item.price * item.quantity} DA
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* السعر - يظهر هنا على الشاشات الكبيرة */}
                                                <div className="hidden sm:flex items-start">
                                                    <span className="bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white font-bold px-4 py-2 rounded-full whitespace-nowrap">
                                                        {item.price * item.quantity} DA
                                                    </span>
                                                </div>
                                            </div>

                                            {/* أزرار الكمية والحذف */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityInputChange(String(item.id), e.target.value)}
                                                        onBlur={(e) => {
                                                            if (!e.target.value || parseInt(e.target.value) < 1) {
                                                                updateQuantity(item.id, 1);
                                                            }
                                                        }}
                                                        className="w-16 sm:w-24 text-center font-semibold text-gray-800 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent"
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-600 hover:text-red-700 p-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('cart.orderSummary')}</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('cart.subtotal')}</span>
                                        <span>{getCartTotal()} DA</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-800">
                                        <span>{t('cart.total')}</span>
                                        <span className="text-[var(--primary-orange)]">{getCartTotal()} DA</span>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="space-y-4 mb-6">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-3">{t('cart.eventDetails')}</h3>

                                    {/* Customer Name */}
                                    <div>
                                        <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('cart.customerName')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="customer-name"
                                                type="text"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                placeholder="Ex: Benali"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Customer Surname */}
                                    <div>
                                        <label htmlFor="customer-surname" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('cart.customerSurname')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="customer-surname"
                                                type="text"
                                                value={customerSurname}
                                                onChange={(e) => setCustomerSurname(e.target.value)}
                                                placeholder="Ex: Ahmed"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Customer Phone */}
                                    <div>
                                        <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('cart.customerPhone')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="customer-phone"
                                                type="tel"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                                placeholder="Ex: 0555 12 34 56"
                                                maxLength={15}
                                                pattern="[0-9\s]+"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Event Type */}
                                    <div>
                                        <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('cart.eventType')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                                </svg>
                                            </div>
                                            <select
                                                id="event-type"
                                                value={eventType}
                                                onChange={(e) => setEventType(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent appearance-none bg-white"
                                            >
                                                <option value="">{t('cart.selectEventType')}</option>
                                                {eventTypes.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Event Type - يظهر فقط عندما يختار "Autre" */}
                                    {eventType === 'Autre' && (
                                        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 animate-fadeIn">
                                            <label htmlFor="custom-event-type" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('cart.specifyEventType')}
                                            </label>
                                            <input
                                                id="custom-event-type"
                                                type="text"
                                                value={customEventType}
                                                onChange={(e) => setCustomEventType(e.target.value)}
                                                placeholder={t('cart.specifyEventPlaceholder')}
                                                className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent"
                                            />
                                            <p className="text-sm text-gray-600 mt-2">
                                                {t('cart.specifyEventNote')}
                                            </p>
                                        </div>
                                    )}

                                    {/* Team Gender Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('cart.teamType')}
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setTeamGender('Hommes')}
                                                className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${teamGender === 'Hommes'
                                                    ? 'border-[var(--primary-orange)] bg-orange-50 text-[var(--primary-orange)]'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>{t('cart.men')}</span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTeamGender('Femmes')}
                                                className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${teamGender === 'Femmes'
                                                    ? 'border-[var(--primary-orange)] bg-orange-50 text-[var(--primary-orange)]'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>{t('cart.women')}</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Wilaya Selection */}
                                    <div>
                                        <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('cart.wilaya')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <select
                                                id="wilaya"
                                                value={wilaya}
                                                onChange={(e) => setWilaya(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent appearance-none bg-white"
                                            >
                                                <option value="">{t('cart.selectWilaya')}</option>
                                                {wilayas.map((w) => (
                                                    <option key={w} value={w}>{w}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Location */}
                                    <div>
                                        <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('cart.eventLocation')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <input
                                                id="event-location"
                                                type="text"
                                                value={eventLocation}
                                                onChange={(e) => setEventLocation(e.target.value)}
                                                placeholder="Ex: Salle El Yasmine, Rue Didouche Mourad"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Event Date */}
                                    <div>
                                        <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('cart.eventDate')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="event-date"
                                                type="date"
                                                value={eventDate}
                                                onChange={(e) => setEventDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Event Time */}
                                    <div>
                                        <label htmlFor="event-time" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('cart.eventTime')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="event-time"
                                                type="time"
                                                value={eventTime}
                                                onChange={(e) => setEventTime(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full bg-[var(--primary-green)] text-white py-3 rounded-lg hover:bg-[#45a049] transition-colors font-medium mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Envoi en cours...' : 'Passer la commande'}
                                </button>

                                <Link
                                    href="/"
                                    className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Continuer mes achats
                                </Link>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-start gap-3 text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-[var(--primary-green)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>L’équipe se déplace dans toutes les wilayas pour assurer un service rapide et sécurisé.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
