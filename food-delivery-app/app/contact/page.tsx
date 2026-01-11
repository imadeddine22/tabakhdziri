'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import Image from 'next/image';
import { contactAPI } from '@/lib/api';

export default function ContactPage() {
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        customEventType: '', // للحدث المخصص عندما يختار "Autre"
        guests: '',
        date: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await contactAPI.sendMessage({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                eventType: formData.eventType === 'autre'
                    ? `Autre: ${formData.customEventType}`
                    : formData.eventType,
                guests: parseInt(formData.guests),
                date: formData.date,
                message: formData.message
            });

            setSuccess(true);
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                eventType: '',
                customEventType: '',
                guests: '',
                date: '',
                message: ''
            });

            // Show success message
            alert(language === 'ar'
                ? 'شكراً لتواصلك معنا! سنرد عليك قريباً.'
                : 'Merci de nous avoir contactés ! Nous vous répondrons bientôt.');
        } catch (err: any) {
            console.error('Contact form error:', err);
            setError(err.response?.data?.message ||
                (language === 'ar' ? 'حدث خطأ أثناء إرسال الرسالة' : 'Erreur lors de l\'envoi du message'));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess(false);
    };

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <div
                className="relative h-[500px] bg-cover bg-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80)',
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-12 h-0.5 bg-white"></div>
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                        <div className="w-12 h-0.5 bg-white"></div>
                    </div>
                    <h1 className="text-white text-5xl md:text-7xl font-bold text-center mb-4">
                        {language === 'ar' ? 'اتصل بنا' : 'Contactez-Nous'}
                    </h1>
                    <p className="text-white text-2xl md:text-3xl font-serif italic text-center">
                        {language === 'ar'
                            ? 'نحن هنا لجعل مناسبتك لا تُنسى'
                            : 'Nous sommes là pour rendre votre événement inoubliable'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Large Circular Food Image */}
                    <div className="relative">
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            <Image
                                src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80"
                                alt="Delicious Food"
                                fill
                                className="object-cover rounded-full shadow-2xl"
                            />
                            {/* Decorative elements around the image */}
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[var(--primary-orange)] rounded-full opacity-20"></div>
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[var(--primary-green)] rounded-full opacity-20"></div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            {language === 'ar' ? 'أرسل لنا رسالة' : 'Envoyez-nous un Message'}
                        </h2>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                                {language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Votre message a été envoyé avec succès !'}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    {language === 'ar' ? 'الاسم الكامل' : 'Nom Complet'}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent outline-none bg-white text-gray-900"
                                    placeholder={language === 'ar' ? 'أدخل اسمك' : 'Votre nom'}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent outline-none bg-white text-gray-900"
                                    placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'Votre email'}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent outline-none bg-white text-gray-900"
                                    placeholder={language === 'ar' ? 'رقم هاتفك' : 'Votre téléphone'}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    {language === 'ar' ? 'نوع المناسبة' : 'Type d\'Événement'}
                                </label>
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent outline-none bg-white text-gray-900"
                                >
                                    <option value="">
                                        {language === 'ar' ? 'اختر نوع المناسبة' : 'Sélectionnez le type'}
                                    </option>
                                    <option value="mariage">{language === 'ar' ? 'زفاف' : 'Mariage'}</option>
                                    <option value="fiancailles">{language === 'ar' ? 'خطوبة' : 'Fiançailles'}</option>
                                    <option value="anniversaire">{language === 'ar' ? 'عيد ميلاد' : 'Anniversaire'}</option>
                                    <option value="entreprise">{language === 'ar' ? 'مناسبة عمل' : 'Événement d\'entreprise'}</option>
                                    <option value="autre">{language === 'ar' ? 'أخرى' : 'Autre'}</option>
                                </select>
                            </div>

                            {/* Custom Event Type - يظهر فقط عندما يختار "Autre" */}
                            {formData.eventType === 'autre' && (
                                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 animate-fadeIn">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        {language === 'ar' ? 'حدد نوع المناسبة' : 'Précisez le type d\'événement'}
                                    </label>
                                    <input
                                        type="text"
                                        name="customEventType"
                                        value={formData.customEventType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent outline-none"
                                        placeholder={language === 'ar' ? 'مثال: حفل تخرج، عقيقة، ختان...' : 'Ex: Remise de diplôme, Baptême, Circoncision...'}
                                    />
                                    <p className="text-sm text-gray-600 mt-2">
                                        {language === 'ar'
                                            ? '💡 الرجاء تحديد نوع المناسبة بالضبط'
                                            : '💡 Veuillez préciser le type exact de votre événement'}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        {language === 'ar' ? 'عدد الضيوف' : 'Nombre d\'Invités'}
                                    </label>
                                    <input
                                        type="number"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent outline-none bg-white text-gray-900"
                                        placeholder="100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        {language === 'ar' ? 'التاريخ' : 'Date'}
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent outline-none bg-white text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    {language === 'ar' ? 'رسالتك' : 'Votre Message'}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-orange)] focus:border-transparent outline-none resize-none bg-white text-gray-900"
                                    placeholder={language === 'ar' ? 'أخبرنا عن مناسبتك...' : 'Parlez-nous de votre événement...'}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="
  w-full 
  bg-[var(--primary-orange)] 
  text-white 
  py-4 
  rounded-lg 
  font-semibold 
  text-lg 
  hover:bg-[var(--primary-green)] 
  hover:shadow-lg 
  transition-all
  disabled:opacity-50
  disabled:cursor-not-allowed
"

                            >
                                {loading
                                    ? (language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...')
                                    : (language === 'ar' ? 'إرسال الرسالة' : 'Envoyer le Message')}
                            </button>
                        </form>
                    </div >
                </div >
            </div >
        </div >
    );
}
