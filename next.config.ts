import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingExcludes: {
    '/photography/[slug]': ['./public/images/photography/**'],
    '/photography': ['./public/images/photography/**'],
  },
};

export default nextConfig;
