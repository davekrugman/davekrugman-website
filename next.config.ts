import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingExcludes: {
    '/*': ['./public/images/photography/**'],
  },
};

export default nextConfig;
