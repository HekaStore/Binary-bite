/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Guarantees zero unconfigured domain errors on Vercel
  },
};

export default nextConfig;

