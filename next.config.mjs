/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Exclude test files from build
  webpack: (config, { isServer }) => {
    // Ignore test-related modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      tap: false,
      desm: false,
    }

    // Exclude test files from bundling
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    config.module.rules.push({
      test: /\.test\.(js|mjs|ts|tsx)$/,
      loader: 'ignore-loader',
    })

    return config
  },
}

export default nextConfig
