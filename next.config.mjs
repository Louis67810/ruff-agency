/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "framerusercontent.com" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/ressources/nouveau-logo-bonduelle-analyse-refonte-identite-visuelle",
        destination: "/ressources/nouveau-logo-bonduelle",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
