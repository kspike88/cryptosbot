/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com'
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com'
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com'
      }
    ]
  }
}

<<<<<<< HEAD
const nextConfig: NextConfig = {
  images: {
    domains: ['assets.coingecko.com', 's2.coinmarketcap.com'],
  },
  /* other config options here */
};

export default nextConfig;
=======
module.exports = nextConfig
>>>>>>> e18488812e45c3ca6abf25cfc2545794884db9b6
