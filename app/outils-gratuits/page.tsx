import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import Hero2Optimized from "@/components/sections/Hero2Optimized/Hero2Optimized";
import ArticlesRessource from "@/components/sections/ArticlesRessource/ArticlesRessource";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { freeTools } from "@/lib/data/free-tools";
import { headers } from "next/headers";
import { getEnglishFreeTools } from "@/lib/data/free-tools-en";
import { localizedMetadata } from "@/lib/seo";

const legacyMetadata: Metadata = {
  title: "Outils gratuits — Ruff Agency",
  description:
    "Découvrez nos outils gratuits pour améliorer vos landing pages, vos messages et vos conversions.",
  alternates: { canonical: `${SITE_URL}/outils-gratuits` },
  openGraph: { url: `${SITE_URL}/outils-gratuits`, type: "website" },
};

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/outils-gratuits", frTitle: "Outils gratuits — Ruff Agency", frDescription: "Découvrez nos outils gratuits pour améliorer vos landing pages, vos messages et vos conversions.", enTitle: "Free web design tools — Ruff Agency", enDescription: "Free tools and resources to improve your landing pages, website and conversion rate." }); }

export default async function FreeToolsPage() {
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "fr";
  const tools = locale === "en" ? getEnglishFreeTools(freeTools) : freeTools;
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
        title={
          locale === "en"
            ? "Discover all our free tools"
            : "Découvrez tous nos outils gratuits"
        }
        subtitle={
          locale === "en"
            ? "Simple, practical tools to improve your pages and acquisition."
            : "Des outils simples et concrets pour améliorer vos pages et votre acquisition."
        }
        showTicker={false}
      />
      <ArticlesRessource
        articles={tools}
        showFilters={false}
        showSidebar={false}
        variant="tools"
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
