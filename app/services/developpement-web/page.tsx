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

const legacyMetadata: Metadata = {
  title: "Développement code (React) — Ruff Agency",
  description: "Des sites React et Next.js rapides, robustes et pensés pour évoluer avec votre activité.",
  alternates: { canonical: `${SITE_URL}/services/developpement-web` },
  openGraph: { url: `${SITE_URL}/services/developpement-web`, type: "website" },
};

const developmentBenefits = [
  ["Code sur mesure", "Une base technique adaptée à votre produit, sans compromis sur la qualité ni la maintenabilité."],
  ["Rapidité d'exécution", "Des interfaces rapides et fluides pour offrir une expérience fiable sur chaque écran."],
  ["Architecture solide", "Une structure claire qui facilite les évolutions, les intégrations et le travail en équipe."],
  ["SEO technique", "Un socle propre pour aider vos pages à être comprises et indexées efficacement."],
  ["Évolutif par nature", "Ajoutez des fonctionnalités et des pages sans repartir de zéro."],
  ["Mise en ligne maîtrisée", "Un déploiement propre, documenté et prêt pour la production."],
] as const;

const developmentProcess = [
  ["Cadrage technique", "1 jour"],
  ["Architecture", "1 jour"],
  ["Développement React", "1 jour"],
  ["Intégrations", "1 jour"],
  ["Mise en production", "1 jour"],
] as const;

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/services/developpement-web", frTitle: "Développement code (React) — Ruff Agency", frDescription: "Des sites React et Next.js rapides, robustes et pensés pour évoluer avec votre activité.", enTitle: "React web development — Ruff Agency", enDescription: "Fast, robust React and Next.js websites built to evolve with your business." }); }

export default function DeveloppementWebService() {
  return (
    <>
      <SiteNav {...NAV_PROPS} theme="dark" fill="transparent" fill2="transparent" className="service-page-nav" />
      <ServicePageTop
        locale={headers().get("x-site-locale") === "en" ? "en" : "fr"}
        bookingHref={ROUTES.contact}
        realisationsHref={ROUTES.realisations}
        heroVideoSrc="/videos/development-react.mp4"
        wideHeroTitle
        heroTitle="On développe des sites World-class en code React"
        heroTitleLines={["On développe des sites", "World-class en code React."]}
        showHeroTitleTuner
        heroSubtitle="Des interfaces rapides, robustes et évolutives, conçues pour transformer votre vision en produit digital."
        showPlayer={false}
        benefitCopyOverride={developmentBenefits}
        processCopyOverride={developmentProcess}
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

