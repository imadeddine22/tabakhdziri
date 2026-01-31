/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.tabakhedjazayri.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
    },
}

module.exports = nextConfig
