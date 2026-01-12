'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { adminAPI } from '@/lib/api';
import { UserCog, Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Shield, Mail, Phone, User, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Admin {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminManagementPage() {
    const { language, t } = useLanguage();
    const { user: currentUser } = useAuth();
    const router = useRouter();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Check if user is Super Admin (only tabakhdziri@gmail.com can access)
        if (!currentUser) {
            router.push('/login');
            return;
        }

        if (currentUser.email !== 'tabakhdziri@gmail.com') {
            alert(language === 'ar'
                ? 'عذراً، هذه الصفحة مخصصة للمسؤول الرئيسي فقط'
                : 'Désolé, cette page est réservée au Super Admin uniquement');
            router.push('/admin');
            return;
        }

        fetchAdmins();
    }, [currentUser, router, language]);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllAdmins();
            const adminsData = Array.isArray(response) ? response : (response.data || []);
            setAdmins(adminsData);
        } catch (error) {
            console.error('Error fetching admins:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            alert(language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Veuillez remplir tous les champs requis');
            return;
        }

        if (!editingAdmin && !formData.password) {
            alert(language === 'ar' ? 'الرجاء إدخال كلمة المرور' : 'Veuillez entrer le mot de passe');
            return;
        }

        try {
            setSubmitting(true);

            if (editingAdmin) {
                const updateData: any = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                };

                if (formData.password) {
                    updateData.password = formData.password;
                }

                await adminAPI.updateAdmin(editingAdmin._id, updateData);
                alert(language === 'ar' ? 'تم تحديث المسؤول بنجاح' : 'Admin mis à jour avec succès');
            } else {
                await adminAPI.createAdmin(formData);
                alert(language === 'ar' ? 'تم إنشاء المسؤول بنجاح' : 'Admin créé avec succès');
            }

            resetForm();
            fetchAdmins();
        } catch (error: any) {
            console.error('Error saving admin:', error);
            alert(error.response?.data?.message || (language === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (admin: Admin) => {
        setEditingAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            phone: admin.phone || '',
            password: ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string, adminName: string) => {
        const confirmMessage = language === 'ar'
            ? `هل أنت متأكد من حذف المسؤول "${adminName}"؟`
            : `Êtes-vous sûr de vouloir supprimer l'admin "${adminName}"?`;

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            await adminAPI.deleteAdmin(id);
            alert(language === 'ar' ? 'تم حذف المسؤول بنجاح' : 'Admin supprimé avec succès');
            fetchAdmins();
        } catch (error: any) {
            console.error('Error deleting admin:', error);
            alert(error.response?.data?.message || (language === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'));
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await adminAPI.toggleAdminStatus(id);
            fetchAdmins();
        } catch (error: any) {
            console.error('Error toggling admin status:', error);
            alert(error.response?.data?.message || (language === 'ar' ? 'حدث خطأ' : 'Une erreur est survenue'));
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingAdmin(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                            <UserCog className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {language === 'ar' ? 'إدارة المسؤولين' : 'Gestion des Administrateurs'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {language === 'ar'
                                    ? 'إضافة وإدارة حسابات المسؤولين'
                                    : 'Ajouter et gérer les comptes administrateurs'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <Plus size={20} />
                        <span className="font-semibold">
                            {language === 'ar' ? 'إضافة مسؤول' : 'Ajouter un Admin'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Security Warning */}
            <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-xl p-5 shadow-md">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-yellow-500 rounded-lg">
                        <AlertTriangle className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-yellow-900 mb-1">
                            {language === 'ar' ? '⚠️ تنبيه أمني' : '⚠️ Avertissement de sécurité'}
                        </h3>
                        <p className="text-sm text-yellow-800">
                            {language === 'ar'
                                ? 'يمكن للمسؤولين الوصول إلى جميع البيانات والإعدادات. تأكد من منح صلاحيات المسؤول للأشخاص الموثوقين فقط.'
                                : 'Les administrateurs ont accès à toutes les données et paramètres. Assurez-vous de n\'accorder les privilèges d\'administrateur qu\'aux personnes de confiance.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">
                                {language === 'ar' ? 'إجمالي المسؤولين' : 'Total Admins'}
                            </p>
                            <p className="text-4xl font-bold">{admins.length}</p>
                        </div>
                        <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                            <UserCog size={40} />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-1">
                                {language === 'ar' ? 'المسؤولون النشطون' : 'Admins Actifs'}
                            </p>
                            <p className="text-4xl font-bold">{admins.filter(a => a.isActive).length}</p>
                        </div>
                        <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Eye size={40} />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium mb-1">
                                {language === 'ar' ? 'المسؤولون المعطلون' : 'Admins Inactifs'}
                            </p>
                            <p className="text-4xl font-bold">{admins.filter(a => !a.isActive).length}</p>
                        </div>
                        <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                            <EyeOff size={40} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Admins Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                </div>
            ) : admins.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                    <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                        <UserCog size={64} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'ar' ? 'لا يوجد مسؤولون بعد' : 'Aucun administrateur'}
                    </h3>
                    <p className="text-gray-600">
                        {language === 'ar' ? 'ابدأ بإضافة أول مسؤول' : 'Commencez par ajouter le premier admin'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        {language === 'ar' ? 'المسؤول' : 'Admin'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        {language === 'ar' ? 'الهاتف' : 'Téléphone'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        {language === 'ar' ? 'الحالة' : 'Statut'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        {language === 'ar' ? 'تاريخ الإنشاء' : 'Date de création'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        {language === 'ar' ? 'الإجراءات' : 'Actions'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {admins.map((admin) => {
                                    const isCurrentUser = currentUser?.id === admin._id;
                                    return (
                                        <tr key={admin._id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                            {admin.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        {admin.isActive && (
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-gray-900">
                                                                {admin.name}
                                                            </span>
                                                            {isCurrentUser && (
                                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                                    {language === 'ar' ? 'أنت' : 'Vous'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Mail size={16} className="text-gray-400" />
                                                    {admin.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Phone size={16} className="text-gray-400" />
                                                    {admin.phone || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${admin.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    <div className={`w-2 h-2 rounded-full ${admin.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    {admin.isActive
                                                        ? (language === 'ar' ? 'نشط' : 'Actif')
                                                        : (language === 'ar' ? 'غير نشط' : 'Inactif')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(admin.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(admin)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                                        title={language === 'ar' ? 'تعديل' : 'Modifier'}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    {!isCurrentUser && (
                                                        <>
                                                            <button
                                                                onClick={() => handleToggleStatus(admin._id)}
                                                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-150"
                                                                title={admin.isActive
                                                                    ? (language === 'ar' ? 'تعطيل' : 'Désactiver')
                                                                    : (language === 'ar' ? 'تفعيل' : 'Activer')}
                                                            >
                                                                {admin.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(admin._id, admin.name)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                                                title={language === 'ar' ? 'حذف' : 'Supprimer'}
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Shield className="text-white" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingAdmin
                                            ? (language === 'ar' ? 'تعديل المسؤول' : 'Modifier l\'Admin')
                                            : (language === 'ar' ? 'إضافة مسؤول جديد' : 'Ajouter un Nouvel Admin')}
                                    </h2>
                                </div>
                                <button
                                    onClick={resetForm}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-150"
                                >
                                    <X size={24} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <User size={16} />
                                    {language === 'ar' ? 'الاسم الكامل' : 'Nom Complet'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={language === 'ar' ? 'أدخل الاسم الكامل' : 'Entrez le nom complet'}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150 outline-none"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Mail size={16} />
                                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150 outline-none"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Phone size={16} />
                                    {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+213 XXX XXX XXX"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150 outline-none"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Shield size={16} />
                                    {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                                    {!editingAdmin && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingAdmin
                                        ? (language === 'ar' ? 'اتركه فارغاً للإبقاء على كلمة المرور الحالية' : 'Laissez vide pour garder le mot de passe actuel')
                                        : (language === 'ar' ? 'أدخل كلمة مرور قوية' : 'Entrez un mot de passe fort')}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150 outline-none"
                                    required={!editingAdmin}
                                    minLength={6}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    {language === 'ar' ? '⚠️ يجب أن تكون 6 أحرف على الأقل' : '⚠️ Minimum 6 caractères'}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                >
                                    <Save size={20} />
                                    {submitting
                                        ? (language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...')
                                        : (language === 'ar' ? 'حفظ' : 'Enregistrer')}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                                >
                                    {language === 'ar' ? 'إلغاء' : 'Annuler'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
