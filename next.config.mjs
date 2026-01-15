/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore 'tap' module which is a test dependency
    config.resolve.fallback = {
      ...config.resolve.fallback,
      tap: false,
    }
    return config
  },
}

export default nextConfig
