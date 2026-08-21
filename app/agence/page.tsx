import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/Footer";
import Hero2Optimized from "@/components/sections/Hero2Optimized/Hero2Optimized";
import SectionAgenceEnQuelquesMots from "@/components/sections/SectionAgenceEnQuelquesMots/SectionAgenceEnQuelquesMots";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos — Ruff Agency",
  description:
    "Découvrez Ruff Agency : une agence qui crée des landing pages et des sites World-class, pensés pour la conversion et le design.",
  alternates: { canonical: `${SITE_URL}/agence` },
  openGraph: { url: `${SITE_URL}/agence`, type: "website" },
};

export default function AgencePage() {
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(249, 251, 255)" fill2="rgb(249, 251, 255)" />
      <Hero2Optimized
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        showTicker={false}
      />
      <SectionAgenceEnQuelquesMots callHref={ROUTES.contact} />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}
