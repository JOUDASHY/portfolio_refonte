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
        hostname: "media.zenfs.com",
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
      {
        protocol: "https",
        hostname: "test-back.unityfianar.site",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "test-back.unityfianar.site",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "www.google.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "youtu.be",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "intradys.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "itechgems.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "apprendre-la-programmation.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wallpapercave.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },




    ],
  },
};

export default nextConfig;
