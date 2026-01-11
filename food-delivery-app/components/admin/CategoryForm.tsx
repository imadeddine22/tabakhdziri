'use client';

import { useState } from 'react';
import { Tags, Image as ImageIcon, Check } from 'lucide-react';

interface CategoryFormProps {
    initialData?: any;
    onSubmit: (data: FormData) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

export default function CategoryForm({ initialData, onSubmit, onCancel, loading }: CategoryFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(initialData?.image || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key as keyof typeof formData].toString());
        });
        if (image) {
            data.append('image', image);
        }
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Information Section */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nom de la catégorie</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <Tags size={18} />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="ex: Plats Traditionnels"
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
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Description courte de la catégorie..."
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="isActive" className="ml-3 text-sm font-bold text-gray-700">Catégorie active</label>
                    </div>
                </div>

                {/* Cover Image Section */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Image de couverture</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-green-500 transition-colors cursor-pointer relative overflow-hidden group">
                        {imagePreview ? (
                            <div className="absolute inset-0 w-full h-full">
                                <img src={imagePreview.startsWith('data:') ? imagePreview : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${imagePreview}`} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-bold flex items-center">
                                        <ImageIcon size={20} className="mr-2" /> Changer l'image
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1 text-center text-gray-500">
                                <ImageIcon size={48} className="mx-auto text-gray-400" />
                                <div className="flex text-sm text-gray-600 font-bold">Télécharger une image</div>
                                <p className="text-xs">Recommandé: 800x400px</p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>

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
                    className="flex items-center space-x-2 px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <Check size={20} />
                            <span>{initialData ? 'Mettre à jour' : 'Créer la catégorie'}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
