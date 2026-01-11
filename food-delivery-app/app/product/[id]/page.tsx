'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import StarRating from '@/components/StarRating';
import { productsAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingCart, Check } from 'lucide-react';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { t, translateField } = useLanguage();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [rating, setRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            if (params.id) {
                try {
                    const response = await productsAPI.getById(params.id as string);
                    setProduct(response);
                } catch (error) {
                    console.error('Error fetching product:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchProduct();
    }, [params.id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product._id,
                name: translateField(product, 'name'),
                price: product.price,
                image: product.mainImage || product.image,
                quantity: 1
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            alert(t('reviews.loginToReview'));
            router.push('/login');
            return;
        }

        setSubmittingReview(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            await productsAPI.addReview(product._id, {
                rating,
                name: user.name || 'Client'
            });
            // Refresh product data
            const response = await productsAPI.getById(params.id as string);
            setProduct(response);
            setRating(5);
            alert(t('reviews.reviewAdded'));
        } catch (error: any) {
            console.error('Error submitting review:', error);
            const errorMessage = error.response?.data?.message || t('reviews.reviewError');
            alert(errorMessage);
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('products.productNotFound')}</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="text-orange-500 hover:underline"
                    >
                        {t('common.backToHome')}
                    </button>
                </div>
            </div>
        );
    }

    // Use additionalImages for gallery, fallback to old images field
    const galleryImages = product.additionalImages && product.additionalImages.length > 0
        ? product.additionalImages
        : (product.images && product.images.length > 0 ? product.images : []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery - Only show if there are additional images */}
                        {galleryImages.length > 0 ? (
                            <ImageGallery
                                images={galleryImages}
                                productName={product.name}
                            />
                        ) : (
                            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                                <img
                                    src={product.mainImage || product.image || '/images/default-product.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.currentTarget.src = '/images/placeholder.png'}
                                />
                            </div>
                        )}

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{translateField(product, 'name')}</h1>

                                {/* Rating */}
                                <div className="flex items-center gap-3 mb-4">
                                    <StarRating
                                        rating={product.rating || 0}
                                        showValue={true}
                                    />
                                    <span className="text-sm text-gray-600">
                                        ({product.numReviews || 0} {t('products.reviews')})
                                    </span>
                                </div>

                                {/* Category */}
                                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                                    {translateField(product.category, 'name') || t('products.category')}
                                </span>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('products.description')}</h3>
                                <p className="text-gray-600 leading-relaxed">{translateField(product, 'description')}</p>
                            </div>

                            {/* Price & Stock */}
                            <div className="border-t border-b border-gray-200 py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">{t('products.price')}</span>
                                    <span className="text-3xl font-bold text-orange-500">{product.price} DA</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">{t('products.stock')}</span>
                                    <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock > 0 ? `${product.stock} ${t('products.available')}` : t('products.unavailable')}
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.isAvailable || product.stock === 0}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${added
                                    ? 'bg-green-500 text-white'
                                    : product.isAvailable && product.stock > 0
                                        ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {added ? (
                                    <>
                                        <Check size={24} />
                                        <span>{t('products.addedToCart')}</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={24} />
                                        <span>
                                            {product.isAvailable && product.stock > 0
                                                ? t('products.addToCart')
                                                : t('products.unavailable')}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="border-t border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('reviews.title')}</h2>

                        {/* Add Review Form */}
                        {typeof window !== 'undefined' && localStorage.getItem('token') ? (
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reviews.addReview')}</h3>
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    {/* Star Rating */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('reviews.yourRating')}
                                        </label>
                                        <StarRating
                                            rating={rating}
                                            interactive={true}
                                            onRatingChange={setRating}
                                            size={32}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                                    >
                                        {submittingReview ? t('reviews.submitting') : t('reviews.submitReview')}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-center">
                                <p className="text-gray-600 mb-4">{t('reviews.loginToReview')}</p>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                                >
                                    {t('common.login')}
                                </button>
                            </div>
                        )}

                        {/* Reviews List */}
                        <div className="space-y-4">
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((review: any, index: number) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{review.name}</h4>
                                                <div className="mt-1">
                                                    <StarRating
                                                        rating={review.rating}
                                                        size={16}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {t('reviews.noReviews')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
