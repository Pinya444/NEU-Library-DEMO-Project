import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Google profile photos from sign-in
    remotePatterns: [
      {
        protocol: "https",
        hostname:  "lh3.googleusercontent.com",
        pathname:  "/**",
      },
    ],
  },
};

export default nextConfig;
