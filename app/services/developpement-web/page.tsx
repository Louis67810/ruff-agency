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
  title: "Développement web — Ruff Agency",
  description:
    "Développement web sur-mesure : des intégrations propres et maintenables, pensées pour durer et performer.",
  alternates: { canonical: `${SITE_URL}/services/developpement-web` },
  openGraph: { url: `${SITE_URL}/services/developpement-web`, type: "website" },
};

export default function DeveloppementWebService() {
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(241, 255, 239)" fill2="rgb(241, 255, 239)" />
      <Hero2Optimized
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        className="h2-developpement-web"
        title="Développement web sur-mesure"
        subtitle="Des intégrations propres et maintenables, pensées pour durer."
      />
      <PointsFocusOptimized
        heading="Nos points de focus"
        points={[
          { title: "Intégration Framer", text: "Un rendu net et soigné, fidèle à votre direction artistique, pour une perception haut de gamme." },
          { title: "Contenu modifiable", text: "Votre site ou landing est pensé pour que vous puissiez ajuster textes et visuels sans galère, directement dans Framer." },
          { title: "Vitesse & fluidité", text: "Une page rapide donne une meilleure première impression et aide à garder l'attention jusqu'à l'action." },
          { title: "Mise en ligne simple", text: "Un process clair pour publier proprement, avec une structure facile à gérer au quotidien." },
          { title: "Visibilité Google", text: "On prépare la page pour être mieux comprise et plus facilement trouvée sur les requêtes cohérentes avec votre offre." },
          { title: "Suivi & mesure", text: "Mise en place du nécessaire pour suivre ce qui fonctionne (demandes, clics, sources) et améliorer en continu." },
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
