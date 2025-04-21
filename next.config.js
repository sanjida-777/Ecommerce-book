/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Tell Next.js to use the public directory for static assets
  images: {
    unoptimized: true,
  },
  // Don't attempt to do SSR
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Customize the build output directory
  distDir: 'out',
};

module.exports = nextConfig;