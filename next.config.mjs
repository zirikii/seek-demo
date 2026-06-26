/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allow server actions / route handlers to read & write local JSON files.
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
