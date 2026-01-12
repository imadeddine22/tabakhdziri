'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';
import CategoryForm from '@/components/admin/CategoryForm';
import { categoriesAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Tags } from 'lucide-react';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoriesAPI.getAll();
            const categoriesData = Array.isArray(response) ? response : (response.data || []);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        try {
            if (editingCategory) {
                await categoriesAPI.update(editingCategory._id, formData);
            } else {
                await categoriesAPI.create(formData);
            }
            setIsFormOpen(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Une erreur est survenue lors de l\'enregistrement.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            try {
                await categoriesAPI.delete(id);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <AdminRoute>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h1>
                            <p className="text-gray-500">Organisez vos produits par catégories.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingCategory(null);
                                setIsFormOpen(true);
                            }}
                            className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-500/30"
                        >
                            <Plus size={20} />
                            <span>Ajouter une catégorie</span>
                        </button>
                    </div>

                    {/* Categories Table */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <div key={category._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-40 relative">
                                        <img
                                            src={category.image.startsWith('http') ? category.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${category.image}`}
                                            alt={category.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(category);
                                                    setIsFormOpen(true);
                                                }}
                                                className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="p-2 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal for Form */}
                {isFormOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
                        <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                                </h1>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>
                            <CategoryForm
                                initialData={editingCategory}
                                onCancel={() => setIsFormOpen(false)}
                                onSubmit={handleSubmit}
                                loading={false}
                            />
                        </div>
                    </div>
                )}
            </AdminLayout>
        </AdminRoute>
    );
}
