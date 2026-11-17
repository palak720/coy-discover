/** @type {import('next').NextConfig} 
const nextConfig = {};

export default nextConfig;*/

module.exports = {
  async rewrites() {
    return [
      { source: '/feed', destination: '/api/feed' },
      { source: '/swipe', destination: '/api/swipe' },
      { source: '/matches', destination: '/api/matches' },
    ];
  },
};
