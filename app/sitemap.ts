import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { projects } from "@/lib/data/projects";
import { getArticleModifiedDate, listedArticles } from "@/lib/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { route: "", priority: 1 },
    { route: "/30-min", priority: 0.8 },
    { route: "/agence", priority: 0.8 },
    { route: "/services", priority: 0.8 },
    { route: "/realisations", priority: 0.8 },
    { route: "/ressources", priority: 0.8 },
    { route: "/outils-gratuits", priority: 0.8 },
    { route: "/services/landing-page", priority: 0.7 },
    { route: "/services/website", priority: 0.7 },
    { route: "/services/branding", priority: 0.7 },
    { route: "/services/product-design", priority: 0.7 },
    { route: "/services/copywriting", priority: 0.7 },
    { route: "/services/seo-geo", priority: 0.7 },
    { route: "/services/optimisation-conversion", priority: 0.7 },
    { route: "/services/developpement-framer", priority: 0.7 },
    { route: "/services/developpement-web", priority: 0.7 },
  ];

  const pages = staticRoutes.map(({ route, priority }) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const realisationPages = projects.map((project) => ({
    url: `${SITE_URL}/realisations/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articlePages = listedArticles.map((article) => ({
    url: `${SITE_URL}/ressources/${article.slug}`,
    ...(getArticleModifiedDate(article) ? { lastModified: getArticleModifiedDate(article) } : {}),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const frenchPages = [...pages, ...realisationPages, ...articlePages];
  const englishPages = frenchPages.map((page) => ({
    ...page,
    url: `${SITE_URL}/en${new URL(page.url).pathname === "/" ? "" : new URL(page.url).pathname}`,
  }));
  return [...frenchPages, ...englishPages];
}
