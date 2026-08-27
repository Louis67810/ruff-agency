import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import HeroRealisations from "@/components/sections/HeroRealisations/HeroRealisations";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import StackSection3 from "@/components/sections/StackSection3/StackSection3Server";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { projects } from "@/lib/data/projects";
import { getEnglishProjects } from "@/lib/data/projects-en";
import { headers } from "next/headers";
import { localizedMetadata } from "@/lib/seo";

const legacyMetadata: Metadata = {
  title: "Réalisations — Ruff Agency",
  description:
    "Découvrez nos réalisations : landing pages, sites internet et refontes pour SaaS, agences, cabinets et indépendants.",
  alternates: { canonical: `${SITE_URL}/realisations` },
  openGraph: { url: `${SITE_URL}/realisations`, type: "website" },
};

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/realisations", frTitle: "Réalisations — Ruff Agency", frDescription: "Découvrez nos réalisations : landing pages, sites internet et refontes pour SaaS, agences, cabinets et indépendants.", enTitle: "Web design case studies — Ruff Agency", enDescription: "Explore Ruff Agency’s landing pages and websites designed for clarity, credibility and conversion." }); }

export default function RealisationsPage() {
  const locale = headers().get("x-site-locale") === "en" ? "en" : "fr";
  const localizedProjects = locale === "en" ? getEnglishProjects(projects) : projects;
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(249, 251, 255)" fill2="rgb(249, 251, 255)" />
      <HeroRealisations locale={locale} offersHref={ROUTES.landingPage} callHref={ROUTES.contact} />
      <RealisationsOptimized locale={locale} projects={localizedProjects} background="transparent" showDecorations={false} showAll className="realisations-variant-clean" />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}
