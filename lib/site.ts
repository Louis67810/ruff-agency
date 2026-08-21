/** URL publique du site (canonical, sitemap, Open Graph). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ruff.agency";

export const ROUTES = {
  home: "/",
  services: "/services",
  landingPage: "/services/landing-page",
  siteInternet: "/services/site-internet",
  developpementWeb: "/services/developpement-web",
  realisations: "/realisations",
  realisation: (slug: string) => `/realisations/${slug}`,
  ressources: "/ressources",
  ressource: (slug: string) => `/ressources/${slug}`,
  agence: "/agence",
  contact: "/contact",
};

/** Props communs de la navbar, utilisés sur toutes les pages. */
export const NAV_PROPS = {
  homeHref: ROUTES.home,
  servicesHref: ROUTES.services,
  projectsHref: ROUTES.realisations,
  resourcesHref: ROUTES.ressources,
  aboutHref: ROUTES.agence,
  ctaHref: ROUTES.contact,
  landingHref: ROUTES.landingPage,
  websiteHref: ROUTES.siteInternet,
  developmentHref: ROUTES.developpementWeb,
  allServicesHref: ROUTES.services,
};

/**
 * Mapping des clés internes du footer vers les routes publiques connues.
 * Les clés sans correspondance connue sont volontairement omises :
 * le footer les laisse alors inactives (aucune URL inventée).
 */
export const FOOTER_LINKS = {
  home: ROUTES.home,
  services: ROUTES.services,
  work: ROUTES.realisations,
  resources: ROUTES.ressources,
  about: ROUTES.agence,
  booking: ROUTES.contact,
  landingPage: ROUTES.landingPage,
  website: ROUTES.siteInternet,
};
