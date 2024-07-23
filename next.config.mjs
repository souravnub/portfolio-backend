/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "know-sourav.netlify.app",
            },
            {
                hostname: "local-portfolio-bucket.s3.us-east-1.amazonaws.com",
            },
            {
                hostname: "portfolio-bucket-prod.s3.us-east-1.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;
