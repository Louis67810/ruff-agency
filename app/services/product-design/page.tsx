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
  title: "Product design — Ruff Agency",
  description: "Des expériences digitales claires, utiles et désirables, pensées autour de vos utilisateurs.",
  alternates: { canonical: `${SITE_URL}/services/product-design` },
  openGraph: { url: `${SITE_URL}/services/product-design`, type: "website" },
};

const productBenefits = [
  ["Expérience intuitive", "Chaque parcours est simple à comprendre, agréable à utiliser et pensé pour réduire les frictions."],
  ["Interface sur mesure", "Une interface unique, conçue autour de vos usages et de vos objectifs produit."],
  ["Décisions éclairées", "Une hiérarchie claire qui aide vos utilisateurs à avancer naturellement vers la bonne action."],
  ["Système cohérent", "Des composants solides pour garder la même qualité d’expérience sur tous les écrans."],
  ["Produit évolutif", "Une base flexible qui accompagne vos nouvelles fonctionnalités et vos futurs besoins."],
  ["Impact mesurable", "Un design qui transforme les usages en satisfaction, engagement et résultats."],
] as const;

const productProcess = [
  ["Cadrage produit", "1 jour"],
  ["Recherche utilisateur", "3 jours"],
  ["Architecture UX", "4 jours"],
  ["UI design", "5 jours"],
  ["Prototype livré", "2 jours"],
] as const;

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/services/product-design", frTitle: "Product design — Ruff Agency", frDescription: "Des expériences digitales claires, utiles et désirables, pensées autour de vos utilisateurs.", enTitle: "Product design — Ruff Agency", enDescription: "Clear, useful and desirable digital experiences designed around your users." }); }

export default function ProductDesignService() {
  return (
    <>
      <SiteNav {...NAV_PROPS} theme="dark" fill="transparent" fill2="transparent" className="service-page-nav" />
      <ServicePageTop
        locale={headers().get("x-site-locale") === "en" ? "en" : "fr"}
        bookingHref={ROUTES.contact}
        realisationsHref={ROUTES.realisations}
        heroImageSrc="/images/services-menu/product-design-hero.png"
        heroGradient
        initialVideoConfig={{ darkness: 0.94, offsetX: 0, offsetY: 7, scale: 1.14, playbackRate: 0.5 }}
        heroTitle="On crée des produits digitaux World-class"
        heroSubtitle="Nous concevons des expériences digitales claires, utiles et désirables, de la première idée jusqu'au prototype."
        showPlayer={false}
        benefitCopyOverride={productBenefits}
        processCopyOverride={productProcess}
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

