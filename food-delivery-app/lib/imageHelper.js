export const getImageUrl = (path) => {
    if (!path) return '/images/placeholder.png'; // Fallback image

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
        console.error('❌ NEXT_PUBLIC_BACKEND_URL is not defined in environment variables');
        return '/images/placeholder.png';
    }

    // إذا كان الرابط يحتوي على localhost، استبدله بالـ backend URL
    if (path.includes('localhost:5000')) {
        return path.replace('http://localhost:5000', backendUrl);
    }

    // If it's already a full URL (http/https), return it
    if (path.startsWith('http')) {
        return path;
    }

    // Ensure path starts with / if not present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Return combined URL
    return `${backendUrl}${cleanPath}`;
};
