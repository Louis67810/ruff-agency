/** URL publique du site (canonical, sitemap, Open Graph). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ruff.agency";

export const ROUTES = {
  home: "/",
  landingPage: "/services/landing-page",
  siteInternet: "/services/website",
  branding: "/services/branding",
  productDesign: "/services/product-design",
  copywriting: "/services/copywriting",
  seoGeo: "/services/seo-geo",
  conversionOptimisation: "/services/optimisation-conversion",
  developpementFramer: "/services/developpement-framer",
  developpementWeb: "/services/developpement-web",
  realisations: "/realisations",
  realisation: (slug: string) => `/realisations/${slug}`,
  ressources: "/ressources",
  ressource: (slug: string) => `/ressources/${slug}`,
  freeTools: "/outils-gratuits",
  agence: "/agence",
  contact: "/30-min",
};

/** Props communs de la navbar, utilisés sur toutes les pages. */
export const NAV_PROPS = {
  homeHref: ROUTES.home,
  projectsHref: ROUTES.realisations,
  resourcesHref: ROUTES.ressources,
  freeToolsHref: ROUTES.freeTools,
  aboutHref: ROUTES.agence,
  ctaHref: ROUTES.contact,
  landingHref: ROUTES.landingPage,
  websiteHref: ROUTES.siteInternet,
  brandingHref: ROUTES.branding,
  productDesignHref: ROUTES.productDesign,
  copywritingHref: ROUTES.copywriting,
  seoGeoHref: ROUTES.seoGeo,
  conversionOptimisationHref: ROUTES.conversionOptimisation,
  framerHref: ROUTES.developpementFramer,
  developmentHref: ROUTES.developpementWeb,
};

/**
 * Mapping des clés internes du footer vers les routes publiques connues.
 * Les clés sans correspondance connue sont volontairement omises :
 * le footer les laisse alors inactives (aucune URL inventée).
 */
export const FOOTER_LINKS = {
  home: ROUTES.home,
  work: ROUTES.realisations,
  resources: ROUTES.ressources,
  freeTools: ROUTES.freeTools,
  about: ROUTES.agence,
  booking: ROUTES.contact,
  landingPage: ROUTES.landingPage,
  website: ROUTES.siteInternet,
  branding: ROUTES.branding,
  productDesign: ROUTES.productDesign,
  seoGeo: ROUTES.seoGeo,
  conversionOptimisation: ROUTES.conversionOptimisation,
  copywriting: ROUTES.copywriting,
  developpementFramer: ROUTES.developpementFramer,
  developpementWeb: ROUTES.developpementWeb,
};
