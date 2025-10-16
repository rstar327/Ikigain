/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['storage.googleapis.com', 'www.ikigain.org'],
    unoptimized: true, // For Replit compatibility
  },
  // Enable static exports for better SEO
  output: 'standalone',
  // Disable strict mode for compatibility with some components
  reactStrictMode: false,
  // Custom webpack config for assets
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/images/',
          outputPath: 'static/images/',
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;