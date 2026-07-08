/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile the shared workspace package from its TypeScript source.
  transpilePackages: ["@demo/ui"],
  experimental: {
    // Allow server actions / route handlers to read & write local JSON files.
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
