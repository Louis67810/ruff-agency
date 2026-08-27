import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import Hero2Optimized from "@/components/sections/Hero2Optimized/Hero2Optimized";
import SectionAgenceEnQuelquesMots from "@/components/sections/SectionAgenceEnQuelquesMots/SectionAgenceEnQuelquesMots";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3Server";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { headers } from "next/headers";
import { localizedMetadata } from "@/lib/seo";

const legacyMetadata: Metadata = {
  title: "À propos — Ruff Agency",
  description:
    "Découvrez Ruff Agency : une agence qui crée des landing pages et des sites World-class, pensés pour la conversion et le design.",
  alternates: { canonical: `${SITE_URL}/agence` },
  openGraph: { url: `${SITE_URL}/agence`, type: "website" },
};

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/agence", frTitle: "À propos — Ruff Agency", frDescription: "Découvrez Ruff Agency : une agence qui crée des landing pages et des sites World-class, pensés pour la conversion et le design.", enTitle: "About Ruff Agency — World-class web design", enDescription: "Discover Ruff Agency, an agency creating premium landing pages and websites designed for conversion." }); }

export default function AgencePage() {
  const locale = headers().get("x-site-locale") === "en" ? "en" : "fr";
  return (
    <>
      <SiteNav
        {...NAV_PROPS}
        fill="rgb(249, 251, 255)"
        fill2="rgb(249, 251, 255)"
      />
      <Hero2Optimized
        locale={locale}
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        title="L'agence qui réinvente le design Web"
        subtitle="Découvrez notre histoire, nos valeurs et notre façon de travailler."
        showTicker={false}
      />
      <SectionAgenceEnQuelquesMots callHref={ROUTES.contact} />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}

