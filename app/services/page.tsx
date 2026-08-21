import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/Footer";
import HeroContent from "@/components/sections/HeroContent/HeroContent";
import Benefices2Optimized from "@/components/sections/Benefices2Optimized/Benefices2Optimized";
import AvisOptimized from "@/components/sections/AvisOptimized/AvisOptimized";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services — Ruff Agency",
  description:
    "Landing pages, sites internet et développement web sur-mesure : on crée des sites World-class pensés pour la conversion.",
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: { url: `${SITE_URL}/services`, type: "website" },
};

export default function ServicesPage() {
  return (
    <>
      <SiteNav {...NAV_PROPS} className="services-page-nav" fill="rgb(18, 26, 46)" fill2="rgb(18, 26, 46)" theme="dark" />
      <HeroContent servicesHref={ROUTES.services} callHref={ROUTES.contact} />
      <Benefices2Optimized
        bookingHref={ROUTES.contact}
        landingPageHref={ROUTES.landingPage}
        siteInternetHref={ROUTES.siteInternet}
        developpementWebHref={ROUTES.developpementWeb}
      />
      <AvisOptimized />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}
