'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';
import ProductForm from '@/components/admin/ProductForm';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Plus, Search, Edit2, Trash2, Filter, X } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                productsAPI.getAll(),
                categoriesAPI.getAll()
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        try {
            console.log('=== Product Form Submission ===');
            console.log('Editing existing product:', !!editingProduct);

            // Log FormData contents for debugging
            console.log('FormData entries:');
            for (const [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value);
            }

            if (editingProduct) {
                await productsAPI.update(editingProduct._id, formData);
            } else {
                await productsAPI.create(formData);
            }
            setIsFormOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error: any) {
            console.error('=== Error saving product ===');
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            console.error('Error response data:', error.response?.data);

            const errorData = error.response?.data;
            let message = 'Une erreur est survenue lors de l\'enregistrement.';

            if (errorData) {
                message = errorData.message || message;

                // Add more detailed error info if available
                if (errorData.error) {
                    message += `\n\nDétails: ${errorData.error}`;
                }

                if (errorData.errorName) {
                    message += `\n\nType d'erreur: ${errorData.errorName}`;
                }

                if (errorData.validationErrors) {
                    message += '\n\nErreurs de validation:';
                    Object.entries(errorData.validationErrors).forEach(([field, err]: [string, any]) => {
                        message += `\n- ${field}: ${err.message}`;
                    });
                }
            }

            alert(message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await productsAPI.delete(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminRoute>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
                            <p className="text-gray-500">Ajouter, modifier ou supprimer vos plats.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingProduct(null);
                                setIsFormOpen(true);
                            }}
                            className="flex items-center justify-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
                        >
                            <Plus size={20} />
                            <span>Ajouter un produit</span>
                        </button>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">
                            <Filter size={18} />
                            <span>Filtres</span>
                        </button>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Produit</th>
                                            <th className="px-6 py-4">Catégorie</th>
                                            <th className="px-6 py-4">Prix</th>
                                            <th className="px-6 py-4">Stock</th>
                                            <th className="px-6 py-4">Disponibilité</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {filteredProducts.map((product) => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                            <img
                                                                src={getImageUrl(product.mainImage || product.image)}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => e.currentTarget.src = '/images/placeholder.png'}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{product.name}</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-xs font-bold">
                                                        {product.category?.name || 'Sans catégorie'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    {product.price} DA
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {product.stock}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {product.isAvailable ? 'En vente' : 'Indisponible'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingProduct(product);
                                                                setIsFormOpen(true);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal for Form */}
                {isFormOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
                        <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                                </h2>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>
                            <ProductForm
                                categories={categories}
                                initialData={editingProduct}
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
