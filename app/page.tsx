import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/Footer";
import HeroOptimized from "@/components/sections/HeroOptimized/HeroOptimized";
import BenefitsOptimized from "@/components/sections/BenefitsOptimized";
import ProcessusOptimized from "@/components/sections/ProcessusOptimized/ProcessusOptimized";
import AvisOptimized from "@/components/sections/AvisOptimized/AvisOptimized";
import ComparatifOptimized from "@/components/sections/ComparatifOptimized/ComparatifOptimized";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import PrixOptimized from "@/components/sections/PrixOptimized/PrixOptimized";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { projects } from "@/lib/data/projects";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Ruff Agency — Landing pages & sites World-class",
  description:
    "On crée des landing pages et des sites World-class : design premium, copywriting orienté conversion et développement web sur-mesure.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: { url: `${SITE_URL}/`, type: "website" },
};

export default function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ruff Agency",
    url: SITE_URL,
    description: "On crée des landing pages et des sites World-class.",
  };
  return (
    <>
      <SiteNav {...NAV_PROPS} />
      <HeroOptimized
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        reviewsHref={ROUTES.agence}
      />
      <BenefitsOptimized bookingHref={ROUTES.contact} />
      <ProcessusOptimized projectHref={ROUTES.contact} />
      <AvisOptimized />
      <ComparatifOptimized bookingHref={ROUTES.contact} />
      <RealisationsOptimized projects={projects} />
      <PrixOptimized bookingHref={ROUTES.contact} secondaryHref={ROUTES.realisations} />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
      <JsonLd data={organizationSchema} />
    </>
  );
}
