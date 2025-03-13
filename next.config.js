/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ytimg.com', 'yt3.ggpht.com', 'yt3.googleusercontent.com'],
  },
  // experimental: {
  //   serverActions: true,
  // },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', etc. on the client to prevent issues
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
        util: false,
        url: false,
        stream: false,
        crypto: false,
        os: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        constants: false,
        events: false,
        stream: false,
        string_decoder: false,
        buffer: false,
      };
      
      // Prevent importing from node: scheme
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:events': 'events',
        'node:stream': 'stream-browserify',
        'node:buffer': 'buffer',
        'node:util': 'util',
        'node:path': 'path-browserify',
      };
    }
    return config;
  },
};

module.exports = nextConfig; 