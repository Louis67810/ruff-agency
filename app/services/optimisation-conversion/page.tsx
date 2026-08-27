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
  title: "Optimisation conversion — Ruff Agency",
  description:
    "Des parcours plus clairs et plus efficaces pour transformer davantage de visiteurs en clients.",
  alternates: { canonical: `${SITE_URL}/services/optimisation-conversion` },
  openGraph: {
    url: `${SITE_URL}/services/optimisation-conversion`,
    type: "website",
  },
};
const benefits = [
  [
    "Parcours plus clair",
    "Chaque étape est pensée pour supprimer les hésitations et guider vers l'action.",
  ],
  [
    "Offre mieux comprise",
    "Une proposition de valeur visible immédiatement, sans effort pour vos visiteurs.",
  ],
  [
    "Friction réduite",
    "Nous identifions ce qui bloque vos prospects et simplifions l'expérience.",
  ],
  [
    "Confiance renforcée",
    "Les bons signaux au bon moment pour rassurer avant la décision.",
  ],
  [
    "Tests orientés impact",
    "Des améliorations priorisées selon leur potentiel réel sur vos résultats.",
  ],
  [
    "Résultats mesurables",
    "Un parcours conçu pour suivre les clics, demandes et conversions.",
  ],
] as const;
const process = [
  ["Analyse des données", "1 jour"],
  ["Identification des freins", "2 jours"],
  ["Hypothèses", "2 jours"],
  ["Optimisations", "4 jours"],
  ["Mesure & suivi", "1 jour"],
] as const;

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/services/optimisation-conversion", frTitle: "Optimisation conversion — Ruff Agency", frDescription: "Des parcours plus clairs et plus efficaces pour transformer davantage de visiteurs en clients.", enTitle: "Conversion optimization — Ruff Agency", enDescription: "Clearer, more effective journeys that turn more visitors into customers." }); }

export default function ConversionOptimisationService() {
  return (
    <>
      <SiteNav
        {...NAV_PROPS}
        theme="dark"
        fill="transparent"
        fill2="transparent"
        className="service-page-nav"
      />
      <ServicePageTop
        locale={headers().get("x-site-locale") === "en" ? "en" : "fr"}
        bookingHref={ROUTES.contact}
        realisationsHref={ROUTES.realisations}
        heroImageSrc="/images/services-menu/conversion-optimisation-hero.png"
        heroGradient
        initialVideoConfig={{
          darkness: 0.94,
          offsetX: 0,
          offsetY: 7,
          scale: 1.14,
          playbackRate: 0.5,
        }}
        wideHeroTitle
        balancedHeroTitle
        heroTitle="On transforme vos visiteurs en clients"
        heroSubtitle="Des parcours plus simples, plus rassurants et plus efficaces pour faire progresser vos conversions."
        showPlayer={false}
        benefitCopyOverride={benefits}
        processCopyOverride={process}
        showProcessDurations={false}
      />
      <AvisOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} />
      <ComparatifOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} bookingHref={ROUTES.contact} />
      <PrixOptimized
        bookingHref={ROUTES.contact}
        secondaryHref={ROUTES.realisations}
      />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}

