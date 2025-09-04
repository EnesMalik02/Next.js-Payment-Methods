import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // iyzipay paketini server-side için external olarak ayarla
    if (isServer) {
      config.externals.push('iyzipay');
    }
    
    // Dynamic imports için fallback
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;
