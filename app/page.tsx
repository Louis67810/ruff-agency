import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import HeroOptimized from "@/components/sections/HeroOptimized/HeroOptimized";
import BenefitsOptimized from "@/components/sections/BenefitsOptimized";
import ProcessusOptimized from "@/components/sections/ProcessusOptimized/ProcessusOptimized";
import AvisOptimized from "@/components/sections/AvisOptimized/AvisOptimized";
import ComparatifOptimized from "@/components/sections/ComparatifOptimized/ComparatifOptimized";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import PrixOptimized from "@/components/sections/PrixOptimized/PrixOptimizedServer";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3Server";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { projects } from "@/lib/data/projects";
import JsonLd from "@/components/JsonLd";
import { headers } from "next/headers";
import { localizedMetadata } from "@/lib/seo";

const legacyMetadata: Metadata = {
  title: "Ruff Agency — Landing pages & sites World-class",
  description:
    "On crée des landing pages et des sites World-class : design premium, copywriting orienté conversion et développement web sur-mesure.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: { url: `${SITE_URL}/`, type: "website" },
};

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/", frTitle: "Ruff Agency — Landing pages & sites World-class", frDescription: "On crée des landing pages et des sites World-class : design premium, copywriting orienté conversion et développement web sur-mesure.", enTitle: "Ruff Agency — World-class landing pages and websites", enDescription: "Premium design, conversion-focused copywriting and custom development for websites that perform." }); }

export default function HomePage() {
  const locale = headers().get("x-site-locale") === "en" ? "en" : "fr";
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
        locale={locale}
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        reviewsHref={ROUTES.agence}
      />
      <BenefitsOptimized locale={locale} bookingHref={ROUTES.contact} />
      <ProcessusOptimized locale={locale} projectHref={ROUTES.contact} />
      <AvisOptimized locale={locale} />
      <ComparatifOptimized locale={locale} bookingHref={ROUTES.contact} />
      <RealisationsOptimized locale={locale} projects={projects} />
      <PrixOptimized
        bookingHref={ROUTES.contact}
        secondaryHref={ROUTES.realisations}
      />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
      <JsonLd data={organizationSchema} />
    </>
  );
}

