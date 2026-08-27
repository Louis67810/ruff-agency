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
  title: "SEO / GEO — Ruff Agency",
  description:
    "Une visibilité durable grâce à une stratégie SEO et GEO claire, utile et structurée.",
  alternates: { canonical: `${SITE_URL}/services/seo-geo` },
  openGraph: { url: `${SITE_URL}/services/seo-geo`, type: "website" },
};
const benefits = [
  [
    "Visibilité durable",
    "Une présence qui continue de travailler pour vous au fil des recherches.",
  ],
  [
    "Requêtes stratégiques",
    "Nous ciblons les recherches qui correspondent vraiment à votre offre et à vos clients.",
  ],
  [
    "Contenu utile",
    "Des pages pensées pour répondre clairement aux questions et gagner la confiance.",
  ],
  [
    "Structure saine",
    "Une architecture lisible pour les moteurs comme pour vos visiteurs.",
  ],
  [
    "Prêt pour l'IA",
    "Un contenu structuré pour être mieux compris par les moteurs de recherche et les assistants IA.",
  ],
  [
    "Mesure continue",
    "Des indicateurs simples pour savoir ce qui progresse et quoi améliorer.",
  ],
] as const;
const process = [
  ["Audit & cadrage", "1 jour"],
  ["Stratégie de mots-clés", "2 jours"],
  ["Structure éditoriale", "3 jours"],
  ["Optimisation", "4 jours"],
  ["Mise en ligne", "1 jour"],
] as const;

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/services/seo-geo", frTitle: "SEO / GEO — Ruff Agency", frDescription: "Une visibilité durable grâce à une stratégie SEO et GEO claire, utile et structurée.", enTitle: "SEO / GEO — Ruff Agency", enDescription: "A clear, useful and structured SEO and GEO strategy that builds lasting visibility." }); }

export default function SeoGeoService() {
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
        heroImageSrc="/images/services-menu/seo-geo-hero.png"
        heroGradient
        initialVideoConfig={{
          darkness: 0.94,
          offsetX: 0,
          offsetY: 7,
          scale: 1.14,
          playbackRate: 0.5,
        }}
        initialHeroTitleWidth={970}
        wideHeroTitle
        heroTitle="On rend votre marque visible dans les bons résultats"
        heroSubtitle="Une stratégie SEO et GEO structurée pour attirer les bonnes recherches et transformer la visibilité en opportunités."
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

