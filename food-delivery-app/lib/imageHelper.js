export const getImageUrl = (path) => {
    if (!path) return '/images/placeholder.png'; // Fallback image

    // If it's already a full URL (http/https), return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Get API URL from env or default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');

    // Ensure path starts with / if not present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Return combined URL
    return `${baseUrl}${cleanPath}`;
};
