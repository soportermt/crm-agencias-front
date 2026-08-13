/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-connectivity/:path*',
        destination: 'https://ia.rutamayatravel.com/:path*',
      },
    ];
  },
};

export default nextConfig;