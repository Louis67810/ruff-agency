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

const websiteProcess = [["Cadrage", "2 jours"], ["Stratégie", "3 jours"], ["Design", "6 jours"], ["Développement", "7 jours"], ["Mise en ligne", "2 jours"]] as const;

const legacyMetadata: Metadata = {
  title: "Website — Ruff Agency",
  description:
    "On crée des sites Website World-class : un site complet pour présenter votre activité et convertir vos visiteurs.",
  alternates: { canonical: `${SITE_URL}/services/website` },
  openGraph: { url: `${SITE_URL}/services/website`, type: "website" },
};

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/services/website", frTitle: "Création de site internet — Ruff Agency", frDescription: "On crée des sites internet World-class : un site complet pour présenter votre activité et convertir vos visiteurs.", enTitle: "Website design — Ruff Agency", enDescription: "Complete websites designed to present your business clearly and turn visitors into customers." }); }

export default function SiteInternetService() {
  return (
    <>
      <SiteNav {...NAV_PROPS} theme="dark" fill="transparent" fill2="transparent" className="service-page-nav" />
      <ServicePageTop locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} bookingHref={ROUTES.contact} realisationsHref={ROUTES.realisations} processCopyOverride={websiteProcess} />
      <AvisOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} />
      <ComparatifOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} bookingHref={ROUTES.contact} />
      <RealisationsOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} projects={projects} className="service-realisations-section" />
      <PrixOptimized bookingHref={ROUTES.contact} secondaryHref={ROUTES.realisations} />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}

