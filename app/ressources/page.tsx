import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import Hero2Optimized from "@/components/sections/Hero2Optimized/Hero2Optimized";
import ArticlesRessource from "@/components/sections/ArticlesRessource/ArticlesRessource";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { listedArticles, articleTags } from "@/lib/data/articles";
import { getEnglishArticles } from "@/lib/data/articles-en";
import { headers } from "next/headers";
import { localizedMetadata } from "@/lib/seo";

const legacyMetadata: Metadata = {
  title: "Ressources — Ruff Agency",
  description:
    "Articles, guides et conseils pour créer des landing pages et des sites qui convertissent vraiment.",
  alternates: { canonical: `${SITE_URL}/ressources` },
  openGraph: { url: `${SITE_URL}/ressources`, type: "website" },
};

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/ressources", frTitle: "Ressources — Ruff Agency", frDescription: "Articles, guides et conseils pour créer des landing pages et des sites qui convertissent vraiment.", enTitle: "Web design resources — Ruff Agency", enDescription: "Practical resources on web design, landing pages, copywriting, SEO and conversion." }); }

export default function RessourcesPage() {
  const locale = headers().get("x-site-locale") === "en" ? "en" : "fr";
  const localizedArticles =
    locale === "en" ? getEnglishArticles(listedArticles) : listedArticles;
  return (
    <>
      <SiteNav
        {...NAV_PROPS}
        fill="rgb(249, 251, 255)"
        fill2="rgb(249, 251, 255)"
      />
      <Hero2Optimized
        locale={locale}
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        className="h2-resources"
        title="Toutes nos ressources pour améliorer vos designs"
        subtitle="Les meilleures ressources sur l’acquisition : outils, conseils, guides et actualités."
        showTicker={false}
      />
      <ArticlesRessource
        locale={locale}
        tags={articleTags}
        articles={localizedArticles}
        callHref={ROUTES.contact}
      />
      <Footer
        bookingHref={ROUTES.contact}
        links={FOOTER_LINKS}
        visible={false}
        padding="96px 48px 64px 48px"
      />
    </>
  );
}
