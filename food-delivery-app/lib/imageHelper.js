export const getImageUrl = (path) => {
    if (!path) return '/images/placeholder.png'; // Fallback image

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
        console.error('❌ NEXT_PUBLIC_BACKEND_URL is not defined in environment variables');
        return '/images/placeholder.png';
    }

    // If it's already a full URL (http/https), return it as-is
    if (path.startsWith('http')) {
        return path;
    }

    // Ensure path starts with / if not present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Return combined URL
    return `${backendUrl}${cleanPath}`;
};
