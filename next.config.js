/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Hide server errors from users in production
  compress: true,
  
  // Custom webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Only show detailed errors in development
    if (!dev) {
      config.optimization.minimize = true;
    }
    
    return config;
  },
  
  // Environment-specific configuration
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Custom headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Redirect configuration
  async redirects() {
    return [
      // Redirect old /site route to /find
      {
        source: '/site',
        destination: '/find',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
