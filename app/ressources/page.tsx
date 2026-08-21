import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/Footer";
import Hero2Optimized from "@/components/sections/Hero2Optimized/Hero2Optimized";
import ArticlesRessource from "@/components/sections/ArticlesRessource/ArticlesRessource";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { articles, articleTags } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Ressources — Ruff Agency",
  description:
    "Articles, guides et conseils pour créer des landing pages et des sites qui convertissent vraiment.",
  alternates: { canonical: `${SITE_URL}/ressources` },
  openGraph: { url: `${SITE_URL}/ressources`, type: "website" },
};

export default function RessourcesPage() {
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(249, 251, 255)" fill2="rgb(249, 251, 255)" />
      <Hero2Optimized
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        className="h2-resources"
        showTicker={false}
      />
      <ArticlesRessource tags={articleTags} articles={articles} callHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} visible={false} padding="96px 48px 64px 48px" />
    </>
  );
}
