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
        source: "/site-internet",
        destination: "/services/website",
        permanent: true,
      },
      {
        source: "/services/site-internet",
        destination: "/services/website",
        permanent: true,
      },
      { source: "/services/ressources", destination: "/ressources", permanent: true },
      { source: "/inspirations", destination: "/ressources", permanent: true },
      { source: "/realisations/landing-page", destination: "/services/landing-page", permanent: true },
      { source: "/realisations/a-propos", destination: "/agence", permanent: true },
      { source: "/realisations/services", destination: "/services", permanent: true },
      { source: "/realisations/realisations", destination: "/realisations", permanent: true },
      { source: "/realisations/site-internet", destination: "/services/website", permanent: true },
      { source: "/realisations/developppement-web", destination: "/services/developpement-web", permanent: true },
      { source: "/realisations/30-min", destination: "/30-min", permanent: true },
      { source: "/30-min/realisations", destination: "/realisations", permanent: true },
      { source: "/30-min/services", destination: "/services", permanent: true },
      { source: "/30-min/ressources", destination: "/ressources", permanent: true },
      { source: "/services/ville/agence-web-design-marseille", destination: "/ville/agence-web-design-marseille", permanent: true },
      { source: "/services/ville/agence-web-design-toulouse", destination: "/ville/agence-web-design-toulouse", permanent: true },
      { source: "/site-internet/ville/agence-web-design-nice", destination: "/ville/agence-web-design-nice", permanent: true },
      { source: "/realisations/ville/agence-web-design-nice", destination: "/ville/agence-web-design-nice", permanent: true },
      { source: "/ville/agence-web-design-strasbourg/ville/agence-web-design-lyon", destination: "/ville/agence-web-design-lyon", permanent: true },
      { source: "/ville/agence-web-design-strasbourg/ville/agence-web-design-marseille", destination: "/ville/agence-web-design-marseille", permanent: true },
      { source: "/ville/agence-web-design-strasbourg/ville/agence-web-design-nice", destination: "/ville/agence-web-design-nice", permanent: true },
      { source: "/ville/agence-web-design-strasbourg/30-min", destination: "/30-min", permanent: true },
      { source: "/ville/agence-web-design-strasbourg/ressources", destination: "/ressources", permanent: true },
      { source: "/ville/agence-web-design-paris/realisations/spreak", destination: "/realisations/spreak", permanent: true },
      { source: "/ville/agence-web-design-strasbourg/realisations/keyframe-agency", destination: "/realisations/keyframe-agency", permanent: true },
      {
        source: "/ressources/nouveau-logo-bonduelle-analyse-refonte-identite-visuelle",
        destination: "/ressources/nouveau-logo-bonduelle",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
