'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';
import { adminAPI } from '@/lib/api';
import { User, Search, Trash2, Shield, ShieldAlert, Mail, Phone, Calendar } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getAllUsers();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);



    const handleDelete = async (id: string) => {
        if (confirm('Supprimer définitivement cet utilisateur ?')) {
            try {
                await adminAPI.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const filteredUsers = Array.isArray(users)
        ? users.filter(u =>
            u && (
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : [];

    return (
        <AdminRoute>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
                        <p className="text-gray-500">Gérez les comptes des clients et administrateurs.</p>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur (nom, email)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white shadow-sm"
                        />
                    </div>

                    {/* Users Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map((user) => (
                                <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group">
                                    {/* Admin Badge */}
                                    <div className={`absolute top-4 right-4 p-1.5 rounded-lg ${user.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {user.role === 'admin' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${user.role === 'admin' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 line-clamp-1">{user.name}</h3>
                                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                                            <div className="flex items-center space-x-2">
                                                <Mail size={16} className="text-gray-400" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone size={16} className="text-gray-400" />
                                                <span>{user.phone || 'Non renseigné'}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar size={16} className="text-gray-400" />
                                                <span>Inscrit le {new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end pt-4 border-t border-gray-50">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer l'utilisateur"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </AdminRoute>
    );
}
