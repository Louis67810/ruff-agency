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

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await localizedMetadata({
    path: "/outils-gratuits",
    frTitle: "Outils gratuits pour votre site web | Ruff Agency",
    frDescription: "Utilisez nos outils gratuits pour estimer le ROI d’une refonte de site et comparer les prix des plateformes de création de sites web.",
    enTitle: "Free website tools and calculators | Ruff Agency",
    enDescription: "Use free tools to estimate website redesign ROI and compare the prices of website builders and hosting platforms.",
  });
  const english = (await headers()).get("x-site-locale") === "en";
  const images = (english ? getEnglishFreeTools(freeTools) : freeTools).map((tool) => ({ url: `${SITE_URL}${tool.image}`, width: 6009, height: 4278, alt: tool.imageAlt }));
  return { ...metadata, robots: { index: true, follow: true }, openGraph: { ...metadata.openGraph, images }, twitter: { ...metadata.twitter, images } };
}

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
            ? "Estimate website redesign ROI and compare the cost of platforms for your next site."
            : "Estimez le potentiel d’une refonte et comparez les prix des plateformes pour créer votre site."
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
