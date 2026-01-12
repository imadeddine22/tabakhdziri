export const getImageUrl = (path) => {
    if (!path) return '/images/placeholder.png'; // Fallback image

    // Get API URL from env or default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tabakhdziriback.onrender.com/api';
    const baseUrl = apiUrl.replace('/api', '');

    // إذا كان الرابط يحتوي على localhost، استبدله بالـ baseUrl الجديد
    if (path.includes('localhost:5000')) {
        return path.replace('http://localhost:5000', baseUrl);
    }

    // If it's already a full URL (http/https), return it
    if (path.startsWith('http')) {
        return path;
    }

    // Ensure path starts with / if not present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Return combined URL
    return `${baseUrl}${cleanPath}`;
};
