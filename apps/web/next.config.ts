import type { NextConfig } from 'next';

const isStaticBuild = process.env.BUILD_MODE === 'static';

const nextConfig: NextConfig = {
  // Hanya aktifkan 'export' jika kita menjalankan script build khusus cPanel
  // Jika tidak (saat npm run dev), biarkan undefined agar fitur dev berjalan normal
  output: isStaticBuild ? 'export' : undefined,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
} as any;

export default nextConfig;