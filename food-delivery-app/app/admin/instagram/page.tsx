'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import api, { getImageUrl } from '@/lib/api';
import Image from 'next/image';
import { Instagram, Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';

interface InstagramPost {
    _id: string;
    image: string;
    postUrl: string;
    order: number;
    isActive: boolean;
    createdAt: string;
}

export default function InstagramManagementPage() {
    const { language, t } = useLanguage();
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);
    const [formData, setFormData] = useState({
        postUrl: '',
        order: 0,
        isActive: true
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/instagram/admin/all');
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching Instagram posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedImage && !editingPost) {
            alert(language === 'ar' ? 'الرجاء اختيار صورة' : 'Veuillez sélectionner une image');
            return;
        }

        if (!formData.postUrl) {
            alert(language === 'ar' ? 'الرجاء إدخال رابط المنشور' : 'Veuillez entrer le lien du post');
            return;
        }

        try {
            setSubmitting(true);
            const formDataToSend = new FormData();
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }
            formDataToSend.append('postUrl', formData.postUrl);
            formDataToSend.append('order', formData.order.toString());
            formDataToSend.append('isActive', formData.isActive.toString());

            if (editingPost) {
                await api.put(`/instagram/${editingPost._id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/instagram', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            resetForm();
            fetchPosts();
        } catch (error: any) {
            console.error('Error saving Instagram post:', error);
            alert(error.response?.data?.message || 'Error saving post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (post: InstagramPost) => {
        setEditingPost(post);
        setFormData({
            postUrl: post.postUrl,
            order: post.order,
            isActive: post.isActive
        });
        setImagePreview(getImageUrl(post.image));
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنشور؟' : 'Êtes-vous sûr de vouloir supprimer ce post?')) {
            return;
        }

        try {
            await api.delete(`/instagram/${id}`);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting Instagram post:', error);
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await api.patch(`/instagram/${id}/toggle`);
            fetchPosts();
        } catch (error) {
            console.error('Error toggling Instagram post status:', error);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingPost(null);
        setFormData({
            postUrl: '',
            order: 0,
            isActive: true
        });
        setSelectedImage(null);
        setImagePreview('');
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Instagram className="text-pink-500" />
                        {language === 'ar' ? 'إدارة منشورات Instagram' : 'Gestion des Posts Instagram'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {language === 'ar'
                            ? 'إدارة المنشورات المعروضة في صفحة الخدمات'
                            : 'Gérer les posts affichés sur la page des services'}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                    <Plus size={20} />
                    {language === 'ar' ? 'إضافة منشور جديد' : 'Ajouter un Post'}
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingPost
                                    ? (language === 'ar' ? 'تعديل المنشور' : 'Modifier le Post')
                                    : (language === 'ar' ? 'إضافة منشور جديد' : 'Ajouter un Nouveau Post')}
                            </h2>
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {language === 'ar' ? 'الصورة' : 'Image'}
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                                    />
                                    {imagePreview && (
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Post URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {language === 'ar' ? 'رابط المنشور على Instagram' : 'Lien du Post Instagram'}
                                </label>
                                <input
                                    type="url"
                                    value={formData.postUrl}
                                    onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })}
                                    placeholder="https://www.instagram.com/p/..."
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            {/* Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {language === 'ar' ? 'الترتيب' : 'Ordre'}
                                </label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-pink-500 rounded"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                    {language === 'ar' ? 'نشط' : 'Actif'}
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                >
                                    <Save className="inline mr-2" size={20} />
                                    {submitting
                                        ? (language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...')
                                        : (language === 'ar' ? 'حفظ' : 'Enregistrer')}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-300"
                                >
                                    {language === 'ar' ? 'إلغاء' : 'Annuler'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Posts Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Instagram size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                        {language === 'ar' ? 'لا توجد منشورات بعد' : 'Aucun post pour le moment'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-64 bg-gray-200">
                                <Image
                                    src={getImageUrl(post.image)}
                                    alt="Instagram Post"
                                    fill
                                    className="object-cover"
                                />
                                {!post.isActive && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                                            {language === 'ar' ? 'غير نشط' : 'Inactif'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">
                                        {language === 'ar' ? 'الترتيب:' : 'Ordre:'} {post.order}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${post.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {post.isActive
                                            ? (language === 'ar' ? 'نشط' : 'Actif')
                                            : (language === 'ar' ? 'غير نشط' : 'Inactif')}
                                    </span>
                                </div>
                                <a
                                    href={post.postUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-pink-500 hover:text-pink-600 truncate block mb-4"
                                >
                                    {post.postUrl}
                                </a>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Edit2 size={16} />
                                        {language === 'ar' ? 'تعديل' : 'Modifier'}
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(post._id)}
                                        className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-colors"
                                    >
                                        {post.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
