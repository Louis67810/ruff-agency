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
  title: "Site Internet — Ruff Agency",
  description:
    "On crée des sites internet World-class : un site complet pour présenter votre activité et convertir vos visiteurs.",
  alternates: { canonical: `${SITE_URL}/services/site-internet` },
  openGraph: { url: `${SITE_URL}/services/site-internet`, type: "website" },
};

export default function SiteInternetService() {
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(255, 251, 239)" fill2="rgb(255, 251, 239)" />
      <Hero2Optimized
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        className="h2-site-internet"
        title="On crée des sites internet World-class"
        subtitle="Un site complet pour présenter votre activité et convertir."
      />
      <PointsFocusOptimized
        heading="Nos points de focus"
        points={[
          { title: "Message clair", text: "Votre offre est présentée de façon simple et évidente : ce que vous faites, pour qui, et pourquoi vous choisir." },
          { title: "Image de marque forte", text: "Un site qui donne une impression sérieuse et premium, et qui installe votre crédibilité durablement." },
          { title: "Offre mieux organisée", text: "Vos services deviennent faciles à comprendre et à comparer, ce qui réduit les abandons et les questions inutiles." },
          { title: "Visibilité Google", text: "Un contenu organisé et pertinent aide votre page à gagner des opportunités de visibilité sur vos requêtes clés." },
          { title: "Différenciation", text: "Un design qui reflète votre niveau et votre positionnement, sans effet « site générique »." },
          { title: "Évolutif et durable", text: "Un site pensé pour grandir : ajouter des pages, clarifier une offre, lancer une campagne, sans repartir de zéro." },
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
