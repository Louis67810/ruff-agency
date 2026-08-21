import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/Footer";
import Hero2Optimized from "@/components/sections/Hero2Optimized/Hero2Optimized";
import PointsFocusOptimized from "@/components/sections/PointsFocusOptimized/PointsFocusOptimized";
import ProcessusOptimized from "@/components/sections/ProcessusOptimized/ProcessusOptimized";
import AvisOptimized from "@/components/sections/AvisOptimized/AvisOptimized";
import ComparatifOptimized from "@/components/sections/ComparatifOptimized/ComparatifOptimized";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import PrixOptimized from "@/components/sections/PrixOptimized/PrixOptimized";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { projects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Landing Page — Ruff Agency",
  description:
    "Des landing pages premium, orientées conversion : design haut de gamme, copywriting percutant et structure pensée pour vendre.",
  alternates: { canonical: `${SITE_URL}/services/landing-page` },
  openGraph: { url: `${SITE_URL}/services/landing-page`, type: "website" },
};

export default function LandingPageService() {
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(249, 251, 255)" fill2="rgb(249, 251, 255)" />
      <Hero2Optimized realisationsHref={ROUTES.realisations} bookingHref={ROUTES.contact} />
      <PointsFocusOptimized
        heading="Nos points de focus"
        points={[
          { title: "Message clair", text: "Notre offre est présentée de façon simple et évidente : ce que vous faites, pour qui, et pourquoi vous choisir." },
          { title: "Image de marque forte", text: "Une exécution soignée renforce votre positionnement et vous permet d'attirer des prospects mieux alignés." },
          { title: "Structure persuasive", text: "On déroule les bons éléments dans le bon ordre pour réduire les doutes et accélérer la décision." },
          { title: "Différenciation réelle", text: "Une page qui ressemble à votre marque, pas à toutes les autres, pour marquer les esprits et rester mémorable." },
          { title: "Visibilité Google", text: "Un contenu organisé et pertinent aide votre page à gagner des opportunités de visibilité sur vos requêtes clés." },
          { title: "Prise de contact fluide", text: "Tout est fait pour faciliter l'action : demander un devis, réserver un appel, ou s'inscrire, sans hésitation." },
        ]}
      />
      <ProcessusOptimized projectHref={ROUTES.contact} />
      <AvisOptimized />
      <ComparatifOptimized bookingHref={ROUTES.contact} />
      <RealisationsOptimized projects={projects} />
      <PrixOptimized bookingHref={ROUTES.contact} secondaryHref={ROUTES.realisations} />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}
