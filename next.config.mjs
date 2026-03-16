/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ['via.placeholder.com'],
    unoptimized: true,
  },
};

export default nextConfig;
