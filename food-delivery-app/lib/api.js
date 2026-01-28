import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Validation - ensure environment variables are set
if (!API_URL || !BACKEND_URL) {
    console.error('❌ Missing required environment variables:');
    if (!API_URL) console.error('  - NEXT_PUBLIC_API_URL is not defined');
    if (!BACKEND_URL) console.error('  - NEXT_PUBLIC_BACKEND_URL is not defined');
    console.error('💡 Please check your .env.local file');
}

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
};

console.log('🔗 API URL:', API_URL);
console.log('🔗 Backend URL:', BACKEND_URL);

// Retry helper function for failed requests
const retryRequest = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            const isLastAttempt = i === retries - 1;
            const isRetryable = error.code === 'ECONNABORTED' ||
                error.code === 'ERR_NETWORK' ||
                error.response?.status >= 500;

            if (isLastAttempt || !isRetryable) {
                throw error;
            }

            console.log(`⚠️ محاولة ${i + 1} فشلت، إعادة المحاولة بعد ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
};

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    timeout: 60000, // 60 seconds for Render cold starts
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests automatically
api.interceptors.request.use(
    (config) => {
        console.log('\n📤 إرسال طلب:', config.method?.toUpperCase(), config.url);
        console.log('  Base URL:', config.baseURL);
        console.log('  Full URL:', config.baseURL + config.url);
        console.log('  Headers:', config.headers);

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('  ✅ Token added');
            } else {
                console.log('  ⚠️ No token found');
            }
        }
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => {
        console.log('✅ استجابة ناجحة:', response.config.url, 'Status:', response.status);
        return response;
    },
    (error) => {
        console.error('\n❌ خطأ في الاستجابة:');
        console.error('  URL:', error.config?.url);
        console.error('  Status:', error.response?.status);
        console.error('  Message:', error.message);
        console.error('  Response data:', error.response?.data);
        console.error('  Network Error:', error.code === 'ERR_NETWORK');

        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data.data || response.data;
    },
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data.data || response.data;
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data.data || response.data;
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    }
};

// Products API
export const productsAPI = {
    getAll: async (params) => {
        return retryRequest(async () => {
            const response = await api.get('/products', { params });
            return response.data.data || response.data;
        });
    },
    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data.data || response.data;
    },
    create: async (formData) => {
        const response = await api.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data || response.data;
    },
    update: async (id, formData) => {
        const response = await api.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data || response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data.data || response.data;
    },
    getFeatured: async () => {
        const response = await api.get('/products/featured');
        return response.data.data || response.data;
    },
    addReview: async (id, reviewData) => {
        const response = await api.post(`/products/${id}/reviews`, reviewData);
        return response.data.data || response.data;
    }
};

// Categories API
export const categoriesAPI = {
    getAll: async () => {
        return retryRequest(async () => {
            const response = await api.get('/categories');
            return response.data.data || response.data;
        });
    },
    getById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data.data || response.data;
    },
    create: async (formData) => {
        const response = await api.post('/categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data || response.data;
    },
    update: async (id, formData) => {
        const response = await api.put(`/categories/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data || response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data.data || response.data;
    }
};

// Orders API
export const ordersAPI = {
    create: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data.data || response.data;
    },
    getMyOrders: async () => {
        const response = await api.get('/orders');
        return response.data.data || response.data;
    },
    getById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data.data || response.data;
    },
    downloadInvoice: async (orderId) => {
        const response = await api.get(`/orders/${orderId}/invoice`, {
            responseType: 'blob'
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `facture-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};

// Admin API
export const adminAPI = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data.data || response.data;
    },
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data.data || response.data;
    },
    updateUser: async (id, userData) => {
        const response = await api.patch(`/admin/users/${id}`, userData);
        return response.data.data || response.data;
    },
    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data.data || response.data;
    },
    // Admin Management
    getAllAdmins: async () => {
        const response = await api.get('/admin/admins');
        return response.data.data || response.data;
    },
    createAdmin: async (adminData) => {
        const response = await api.post('/admin/admins', adminData);
        return response.data.data || response.data;
    },
    updateAdmin: async (id, adminData) => {
        const response = await api.put(`/admin/admins/${id}`, adminData);
        return response.data.data || response.data;
    },
    deleteAdmin: async (id) => {
        const response = await api.delete(`/admin/admins/${id}`);
        return response.data.data || response.data;
    },
    toggleAdminStatus: async (id) => {
        const response = await api.patch(`/admin/admins/${id}/toggle`);
        return response.data.data || response.data;
    },
    getAllOrders: async () => {
        const response = await api.get('/orders/all/orders');
        return response.data.data || response.data;
    },
    updateOrderStatus: async (id, status) => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data.data || response.data;
    }
};

// Contact API
export const contactAPI = {
    sendMessage: async (contactData) => {
        const response = await api.post('/contact', contactData);
        return response.data.data || response.data;
    },
    getAll: async () => {
        const response = await api.get('/contact');
        return response.data.data || response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/contact/${id}`);
        return response.data.data || response.data;
    },
    updateStatus: async (id, statusData) => {
        const response = await api.patch(`/contact/${id}/status`, statusData);
        return response.data.data || response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/contact/${id}`);
        return response.data.data || response.data;
    }
};

// Reviews API
export const reviewsAPI = {
    create: async (data) => {
        const response = await api.post('/reviews', data);
        return response.data.data || response.data;
    },
    getApproved: async () => {
        const response = await api.get('/reviews');
        return response.data.data || response.data;
    },
    getAllAdmin: async () => {
        const response = await api.get('/reviews/admin');
        return response.data.data || response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.patch(`/reviews/${id}/status`, { status });
        return response.data.data || response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data.data || response.data;
    }
};

// Auth Helpers
export const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('token');
    }
    return false;
};

export const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    return null;
};

export const saveAuthData = (token, user) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }
};

// Legacy/Compat helpers for existing pages
export const getDishes = async () => {
    try {
        console.log('🔄 Fetching dishes from API...');
        const data = await productsAPI.getAll();
        console.log('📦 API Response:', data);
        console.log('📊 Data structure:', {
            hasData: !!data,
            isArray: Array.isArray(data),
            dataType: typeof data,
            dataLength: Array.isArray(data) ? data.length : 0,
            sampleData: Array.isArray(data) ? data[0] : null
        });

        // productsAPI.getAll() already unwraps response.data.data
        // So 'data' is already the array of dishes
        const dishes = Array.isArray(data) ? data : [];
        console.log('✅ Returning dishes:', dishes.length);
        return dishes;
    } catch (error) {
        console.error('❌ Error fetching dishes from API:', error);
        // Fallback to local JSON
        try {
            const response = await fetch('/data/dishes.json');
            const fallbackData = await response.json();
            console.log('📁 Using fallback data:', fallbackData.length);
            return fallbackData;
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
            return [];
        }
    }
};

export const getCategories = async () => {
    try {
        console.log('🔄 Fetching categories from API...');
        const data = await categoriesAPI.getAll();
        console.log('📂 Categories Response:', data);

        // categoriesAPI.getAll() already unwraps response.data.data
        // So 'data' is already the array of categories
        const categories = Array.isArray(data) ? data : [];
        console.log('✅ Returning categories:', categories.length);
        return categories;
    } catch (error) {
        console.error('❌ Error fetching categories from API:', error);
        // Fallback to local JSON
        try {
            const response = await fetch('/data/categories.json');
            const fallbackData = await response.json();
            console.log('📁 Using fallback categories:', fallbackData.length);
            return fallbackData;
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
            return [];
        }
    }
};

export const getRestaurant = async (id) => {
    try {
        const data = await productsAPI.getById(id);
        return data.data;
    } catch (error) {
        console.error('Error fetching product from API:', error);
        // Fallback to local JSON
        const response = await fetch('/data/dishes.json');
        const dishes = await response.json();
        return dishes.find(d => d.id === id) || null;
    }
};

export default api;
