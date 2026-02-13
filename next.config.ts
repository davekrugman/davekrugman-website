import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingExcludes: {
    '/*': ['./public/images/photography/**'],
  },
  images: {
    qualities: [70, 75, 85],
  },
};

export default nextConfig;
