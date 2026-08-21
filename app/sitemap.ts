import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { projects } from "@/lib/data/projects";
import { articles } from "@/lib/data/articles";
import { locations, locationRoute } from "@/lib/data/locations";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { route: "", priority: 1 },
    { route: "/agence", priority: 0.8 },
    { route: "/realisations", priority: 0.8 },
    { route: "/ressources", priority: 0.8 },
    { route: "/services", priority: 0.8 },
    { route: "/services/landing-page", priority: 0.7 },
    { route: "/services/site-internet", priority: 0.7 },
    { route: "/services/developpement-web", priority: 0.7 },
  ];

  const pages = staticRoutes.map(({ route, priority }) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));

  const realisationPages = projects.map((project) => ({
    url: `${SITE_URL}/realisations/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articlePages = articles.map((article) => ({
    url: `${SITE_URL}/ressources/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const locationPages = locations.map((location) => ({
    url: `${SITE_URL}${locationRoute(location)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...realisationPages, ...articlePages, ...locationPages];
}
