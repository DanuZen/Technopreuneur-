/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  async redirects() {
    return [
      { source: '/evaluasi', destination: '/evaluate', permanent: true },
      { source: '/onboarding', destination: '/evaluate?tab=questionnaire', permanent: true },
      { source: '/cv', destination: '/evaluate', permanent: true },
      { source: '/cv-builder', destination: '/evaluate?tab=questionnaire', permanent: true },
      { source: '/lowongan', destination: '/jobs', permanent: true },
      { source: '/loker', destination: '/jobs', permanent: true },
      { source: '/karir', destination: '/jobs', permanent: true },
      { source: '/masuk', destination: '/login', permanent: true },
      { source: '/daftar', destination: '/register', permanent: true },
      { source: '/tentang', destination: '/about', permanent: true },
      { source: '/tentang-kami', destination: '/about', permanent: true },
      { source: '/beranda', destination: '/', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/candidate', destination: '/dashboard', permanent: false },
      { source: '/ats', destination: '/evaluate', permanent: true },
      { source: '/apply', destination: '/jobs', permanent: false },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const targetUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;
    return [
      {
        source: '/api/:path*',
        destination: `${targetUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
