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
  title: "Copywriting — Ruff Agency",
  description: "Des mots clairs et persuasifs pour transformer l'attention en confiance et en actions.",
  alternates: { canonical: `${SITE_URL}/services/copywriting` },
  openGraph: { url: `${SITE_URL}/services/copywriting`, type: "website" },
};

const copywritingBenefits = [
  ["Message limpide", "Votre offre devient immédiatement compréhensible, sans jargon ni détour."],
  ["Voix de marque", "Un ton juste et reconnaissable qui donne de la personnalité à chaque page."],
  ["Arguments solides", "Des bénéfices concrets qui répondent aux vraies objections de vos prospects."],
  ["Parcours convaincant", "Chaque écran guide naturellement la lecture vers la prochaine action."],
  ["Contenu durable", "Une base éditoriale cohérente que vous pouvez décliner sur tous vos supports."],
  ["Actions plus fortes", "Des appels à l'action précis, au bon moment et avec les bons mots."],
] as const;

const copywritingProcess = [
  ["Brief & immersion", "1 jour"],
  ["Positionnement", "2 jours"],
  ["Structure des messages", "2 jours"],
  ["Rédaction", "4 jours"],
  ["Optimisation finale", "1 jour"],
] as const;

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/services/copywriting", frTitle: "Copywriting — Ruff Agency", frDescription: "Des mots clairs et persuasifs pour transformer l’attention en confiance et en actions.", enTitle: "Copywriting — Ruff Agency", enDescription: "Clear, persuasive words that turn attention into trust and action." }); }

export default function CopywritingService() {
  return (
    <>
      <SiteNav {...NAV_PROPS} theme="dark" fill="transparent" fill2="transparent" className="service-page-nav" />
      <ServicePageTop
        locale={headers().get("x-site-locale") === "en" ? "en" : "fr"}
        bookingHref={ROUTES.contact}
        realisationsHref={ROUTES.realisations}
        heroImageSrc="/images/services-menu/copywriting-hero.jpg"
        heroGradient
        initialVideoConfig={{ darkness: 0.94, offsetX: 0, offsetY: 7, scale: 1.14, playbackRate: 0.5 }}
        wideHeroTitle
        balancedHeroTitle
        initialHeroTitleWidth={690}
        heroTitle="On écrit des textes qui vendent"
        heroSubtitle="Des mots précis, humains et convaincants pour faire comprendre votre offre et donner envie d'avancer."
        showPlayer={false}
        benefitCopyOverride={copywritingBenefits}
        processCopyOverride={copywritingProcess}
        showProcessDurations={false}
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

