/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Mark problematic Node.js packages as external for server
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'thread-stream',
    '@walletconnect/logger',
  ],
  // Enable Turbopack with resolver aliases for problematic modules
  turbopack: {
    resolveAlias: {
      'why-is-node-running': { browser: '' },
      'thread-stream': { browser: '' },
      'pino-pretty': { browser: '' },
      'pino-worker': { browser: '' },
      tap: { browser: '' },
      desm: { browser: '' },
    },
  },
  // Webpack config fallback (for non-turbopack builds)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Provide fallbacks for Node.js modules in client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        'why-is-node-running': false,
        'thread-stream': false,
        'pino-pretty': false,
        'pino-worker': false,
        'pino': false,
        tap: false,
        desm: false,
      }
    }

    // Exclude test files from bundling  
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    config.module.rules.push({
      test: /node_modules[\\/].*[\\/]test[\\/].*\.(js|mjs|ts|tsx)$/,
      use: 'null-loader',
    })
    config.module.rules.push({
      test: /\.test\.(js|mjs|ts|tsx)$/,
      use: 'null-loader',
    })

    return config
  },
}

export default nextConfig
