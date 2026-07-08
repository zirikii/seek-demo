/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Compile the shared workspace package from its TypeScript source.
  transpilePackages: ["@demo/ui"],
};

export default nextConfig;
