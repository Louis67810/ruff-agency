import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import ServicePageTop from "@/components/sections/ServicePageTop/ServicePageTop";
import AvisOptimized from "@/components/sections/AvisOptimized/AvisOptimized";
import ComparatifOptimized from "@/components/sections/ComparatifOptimized/ComparatifOptimized";
import PrixOptimized from "@/components/sections/PrixOptimized/PrixOptimizedServer";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3Server";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { headers } from "next/headers";
import { localizedMetadata } from "@/lib/seo";

const legacyMetadata: Metadata = {
  title: "Branding — Ruff Agency",
  description: "Une identité de marque forte, cohérente et mémorable pour clarifier votre positionnement.",
  alternates: { canonical: `${SITE_URL}/services/branding` },
  openGraph: { url: `${SITE_URL}/services/branding`, type: "website" },
};

const brandingBenefits = [
  ["Positionnement clair", "Une marque qui exprime immédiatement votre valeur et parle aux bons clients."],
  ["Identité mémorable", "Un univers visuel cohérent qui vous distingue et reste en tête."],
  ["Crédibilité renforcée", "Des codes premium qui installent la confiance dès le premier contact."],
  ["Système cohérent", "Des règles simples pour garder la même qualité sur chaque support."],
  ["Marque évolutive", "Une identité pensée pour accompagner vos offres et votre croissance."],
  ["Prête à déployer", "Tous les éléments nécessaires pour communiquer avec constance et impact."],
] as const;

const brandingProcess = [
  ["Cadrage", "1 jour"],
  ["Plateforme de marque", "2 jours"],
  ["Direction artistique", "4 jours"],
  ["Système visuel", "5 jours"],
  ["Livraison", "1 jour"],
] as const;

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/services/branding", frTitle: "Branding — Ruff Agency", frDescription: "Une identité de marque forte, cohérente et mémorable pour clarifier votre positionnement.", enTitle: "Branding — Ruff Agency", enDescription: "A strong, coherent and memorable brand identity that clarifies your positioning." }); }

export default function BrandingService() {
  return (
    <>
      <SiteNav {...NAV_PROPS} theme="dark" fill="transparent" fill2="transparent" className="service-page-nav" />
      <ServicePageTop
        locale={headers().get("x-site-locale") === "en" ? "en" : "fr"}
        bookingHref={ROUTES.contact}
        realisationsHref={ROUTES.realisations}
        heroVideoSrc="/videos/landing-page-v2.mp4"
        wideHeroTitle
        heroTitle="On crée des identités de marque World-class"
        heroSubtitle="Nous construisons des identités fortes, cohérentes et mémorables pour clarifier votre positionnement et renforcer votre crédibilité."
        showPlayer={false}
        benefitCopyOverride={brandingBenefits}
        processCopyOverride={brandingProcess}
      />
      <AvisOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} />
      <ComparatifOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} bookingHref={ROUTES.contact} />
      <PrixOptimized bookingHref={ROUTES.contact} secondaryHref={ROUTES.realisations} />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}

