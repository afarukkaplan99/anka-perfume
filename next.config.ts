import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    middlewarePrefetch: false,
  },
};

module.exports = nextConfig;
