/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "local-portfolio-bucket.s3.us-east-1.amazonaws.com",
            },
            {
                hostname: "portfolio-bucket-prod.s3.us-east-1.amazonaws.com",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: process.env.NEXT_PUBLIC_FRONTEND_URL,
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Content-type",
                        value: "application/json",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
