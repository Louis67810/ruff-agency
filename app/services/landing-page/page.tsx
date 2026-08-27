import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import ServicePageTop from "@/components/sections/ServicePageTop/ServicePageTop";
import AvisOptimized from "@/components/sections/AvisOptimized/AvisOptimized";
import ComparatifOptimized from "@/components/sections/ComparatifOptimized/ComparatifOptimized";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import PrixOptimized from "@/components/sections/PrixOptimized/PrixOptimizedServer";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3Server";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { projects } from "@/lib/data/projects";
import { headers } from "next/headers";
import { localizedMetadata } from "@/lib/seo";

const landingPageProcess = [["Cadrage", "1 jour"], ["Stratégie", "1 jour"], ["Design", "3 jours"], ["Développement", "4 jours"], ["Mise en ligne", "1 jour"]] as const;

const legacyMetadata: Metadata = {
  title: "Landing Page — Ruff Agency",
  description:
    "Des landing pages premium, orientées conversion : design haut de gamme, copywriting percutant et structure pensée pour vendre.",
  alternates: { canonical: `${SITE_URL}/services/landing-page` },
  openGraph: { url: `${SITE_URL}/services/landing-page`, type: "website" },
};

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/services/landing-page", frTitle: "Landing page — Ruff Agency", frDescription: "Des landing pages premium, orientées conversion : design haut de gamme, copywriting percutant et structure pensée pour vendre.", enTitle: "Landing pages — Ruff Agency", enDescription: "Premium, conversion-focused landing pages with high-end design, compelling copy and a structure built to sell." }); }

export default function LandingPageService() {
  return (
    <>
      <SiteNav {...NAV_PROPS} theme="dark" fill="transparent" fill2="transparent" className="service-page-nav" />
      <ServicePageTop
        locale={headers().get("x-site-locale") === "en" ? "en" : "fr"}
        bookingHref={ROUTES.contact}
        realisationsHref={ROUTES.realisations}
        heroVideoSrc="/videos/landing-page-hero.mp4"
        processCopyOverride={landingPageProcess}
        heroTitle="On crée des landing pages World-class"
        heroSubtitle="La page qui transforme l’attention en demandes qualifiées."
      />
      <AvisOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} />
      <ComparatifOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} bookingHref={ROUTES.contact} />
      <RealisationsOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} projects={projects} />
      <PrixOptimized bookingHref={ROUTES.contact} secondaryHref={ROUTES.realisations} />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}

