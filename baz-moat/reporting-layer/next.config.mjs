/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Sub-1.5s LCP: no images, server-rendered, minimal JS. poweredByHeader off.
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;