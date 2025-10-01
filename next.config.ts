import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s.yimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "portfolio.unityfianar.site",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "portfolio.unityfianar.site",
        pathname: "/**",
      },
      
    ],
  },
};

export default nextConfig;
