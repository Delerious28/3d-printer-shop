/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false
  },
  experimental: {
    optimizePackageImports: []
  }
};

export default nextConfig;
