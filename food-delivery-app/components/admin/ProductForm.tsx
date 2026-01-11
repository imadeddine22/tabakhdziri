'use client';

import { useState } from 'react';
import { ShoppingBag, Package, DollarSign, Image as ImageIcon, Check, X, Languages } from 'lucide-react';

interface ProductFormProps {
    initialData?: any;
    categories: any[];
    onSubmit: (data: FormData) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

export default function ProductForm({ initialData, categories, onSubmit, onCancel, loading }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        name_ar: initialData?.name_ar || '',
        description_ar: initialData?.description_ar || '',
        price: initialData?.price || '',
        category: initialData?.category?._id || initialData?.category || '',
        stock: initialData?.stock || '100',
        isAvailable: initialData?.isAvailable !== undefined ? initialData.isAvailable : true,
        featured: initialData?.featured || false
    });

    const [translating, setTranslating] = useState(false);

    // Main image (displayed in cards)
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState(initialData?.mainImage || initialData?.image || '');

    // Additional images (displayed in product page)
    const [additionalImages, setAdditionalImages] = useState<File[]>([]);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(
        initialData?.additionalImages || []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMainImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + additionalImages.length > 4) {
            alert('Vous pouvez télécharger 4 images supplémentaires maximum');
            return;
        }

        const newImages = [...additionalImages, ...files].slice(0, 4);
        setAdditionalImages(newImages);

        // Create previews
        const newPreviews = [...additionalImagePreviews];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                setAdditionalImagePreviews([...newPreviews].slice(0, 4));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeAdditionalImage = (index: number) => {
        const newImages = additionalImages.filter((_, i) => i !== index);
        const newPreviews = additionalImagePreviews.filter((_, i) => i !== index);
        setAdditionalImages(newImages);
        setAdditionalImagePreviews(newPreviews);
    };

    const handleAutoTranslate = async () => {
        if (!formData.name && !formData.description) {
            alert('Veuillez d\'abord remplir le nom et/ou la description en français');
            return;
        }

        setTranslating(true);
        try {
            const textsToTranslate = [];
            if (formData.name) textsToTranslate.push(formData.name);
            if (formData.description) textsToTranslate.push(formData.description);

            // Using Google Translate API (free tier via MyMemory API)
            const translations = await Promise.all(
                textsToTranslate.map(async (text) => {
                    const response = await fetch(
                        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|ar`
                    );
                    const data = await response.json();
                    return data.responseData.translatedText;
                })
            );

            setFormData(prev => ({
                ...prev,
                name_ar: formData.name ? translations[0] : prev.name_ar,
                description_ar: formData.description ? (formData.name ? translations[1] : translations[0]) : prev.description_ar
            }));

            alert('✅ Traduction automatique terminée!');
        } catch (error) {
            console.error('Translation error:', error);
            alert('❌ Erreur lors de la traduction. Veuillez réessayer.');
        } finally {
            setTranslating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key as keyof typeof formData].toString());
        });

        // Append main image first
        if (mainImage) {
            data.append('images', mainImage);
        }

        // Then append additional images
        additionalImages.forEach((image) => {
            data.append('images', image);
        });

        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: General Info */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nom du produit</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <ShoppingBag size={18} />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="ex: Couscous Royal"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Description détaillée du plat..."
                            required
                        />
                    </div>

                    {/* Auto-Translate Button */}
                    <div className="flex items-center justify-center py-4">
                        <button
                            type="button"
                            onClick={handleAutoTranslate}
                            disabled={translating || (!formData.name && !formData.description)}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {translating ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Traduction en cours...</span>
                                </>
                            ) : (
                                <>
                                    <Languages size={20} />
                                    <span>🇫🇷 → 🇩🇿 Traduire en arabe</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Arabic Translation Fields */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border-2 border-purple-200">
                        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                            <Languages className="mr-2" size={20} />
                            الترجمة العربية (Arabic Translation)
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    اسم المنتج (Nom en arabe)
                                </label>
                                <input
                                    type="text"
                                    name="name_ar"
                                    value={formData.name_ar}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                                    placeholder="مثال: كسكس ملكي"
                                    dir="rtl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    الوصف (Description en arabe)
                                </label>
                                <textarea
                                    name="description_ar"
                                    value={formData.description_ar}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                                    placeholder="وصف تفصيلي للطبق..."
                                    dir="rtl"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Prix (DA)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <DollarSign size={18} />
                                </span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <Package size={18} />
                                </span>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="100"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isAvailable"
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                            className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="isAvailable" className="ml-3 text-sm font-bold text-gray-700">Disponible à la vente</label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="featured"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="featured" className="ml-3 text-sm font-bold text-gray-700">
                            ⭐ Produit mis en avant
                        </label>
                    </div>
                </div>

                {/* Right Side: Images Upload */}
                <div className="space-y-6">
                    {/* Main Image */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Image principale (affichée dans les cartes)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-orange-500 transition-colors cursor-pointer relative overflow-hidden group">
                            {mainImagePreview ? (
                                <div className="absolute inset-0 w-full h-full">
                                    <img src={mainImagePreview} alt="Image principale" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-bold flex items-center">
                                            <ImageIcon size={20} className="mr-2" /> Changer l'image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1 text-center text-gray-500">
                                    <ImageIcon size={48} className="mx-auto text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <span className="font-bold text-orange-600">Télécharger l'image principale</span>
                                    </div>
                                    <p className="text-xs">PNG, JPG jusqu'à 5MB</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleMainImageChange}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {/* Additional Images */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Images supplémentaires (jusqu'à 4 images)
                        </label>

                        {/* Image Previews Grid */}
                        {additionalImagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {additionalImagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAdditionalImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Button */}
                        {additionalImagePreviews.length < 4 && (
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-orange-500 transition-colors cursor-pointer relative overflow-hidden group">
                                <div className="space-y-1 text-center text-gray-500">
                                    <ImageIcon size={48} className="mx-auto text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <span className="font-bold text-orange-600">
                                            {additionalImagePreviews.length > 0 ? 'Ajouter une autre image' : 'Télécharger des images'}
                                        </span>
                                    </div>
                                    <p className="text-xs">PNG, JPG jusqu'à 5MB ({additionalImagePreviews.length}/4)</p>
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleAdditionalImagesChange}
                                    accept="image/*"
                                    multiple
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100 mt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <Check size={20} />
                            <span>{initialData ? 'Mettre à jour' : 'Créer le produit'}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
