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
  title: "Développement Framer — Ruff Agency",
  description:
    "Des sites Framer rapides, soignés et fidèles à votre direction artistique.",
  alternates: { canonical: `${SITE_URL}/services/developpement-framer` },
  openGraph: {
    url: `${SITE_URL}/services/developpement-framer`,
    type: "website",
  },
};
const benefits = [
  [
    "Design fidèle",
    "Une intégration Framer qui respecte chaque détail de votre direction artistique.",
  ],
  [
    "Édition simple",
    "Vous gardez la main sur vos contenus grâce à une structure claire et facile à modifier.",
  ],
  [
    "Rapide par nature",
    "Des pages fluides et performantes pour une expérience qui reste agréable.",
  ],
  [
    "Responsive soigné",
    "Une interface cohérente et précise sur desktop, tablette et mobile.",
  ],
  [
    "SEO prêt",
    "Un socle propre pour rendre vos pages lisibles et visibles dans les recherches.",
  ],
  [
    "Publication sereine",
    "Un accompagnement clair pour mettre en ligne et faire évoluer votre site.",
  ],
] as const;
const process = [
  ["Cadrage", "1 jour"],
  ["Structure Framer", "1 jour"],
  ["Intégration", "1 jour"],
  ["Responsive", "1 jour"],
  ["Publication", "1 jour"],
] as const;

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/services/developpement-framer", frTitle: "Développement Framer — Ruff Agency", frDescription: "Des sites Framer rapides, soignés et fidèles à votre direction artistique.", enTitle: "Framer development — Ruff Agency", enDescription: "Fast, polished Framer websites that faithfully bring your art direction to life." }); }

export default function DeveloppementFramerService() {
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
        heroVideoSrc="/videos/development-react.mp4"
        heroTitle="On crée des sites Framer World-class"
        heroSubtitle="Des sites rapides, élégants et faciles à faire évoluer, intégrés avec précision dans Framer."
        wideHeroTitle
        initialHeroTitleWidth={700}
        showPlayer={false}
        benefitCopyOverride={benefits}
        processCopyOverride={process}
      />
      <AvisOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} />
      <ComparatifOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} bookingHref={ROUTES.contact} />
      <RealisationsOptimized locale={headers().get("x-site-locale") === "en" ? "en" : "fr"} projects={projects} />
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

