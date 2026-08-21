import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/Footer";
import HeroRealisations from "@/components/sections/HeroRealisations/HeroRealisations";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import StackSection3 from "@/components/sections/StackSection3/StackSection3";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { projects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Réalisations — Ruff Agency",
  description:
    "Découvrez nos réalisations : landing pages, sites internet et refontes pour SaaS, agences, cabinets et indépendants.",
  alternates: { canonical: `${SITE_URL}/realisations` },
  openGraph: { url: `${SITE_URL}/realisations`, type: "website" },
};

export default function RealisationsPage() {
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(249, 251, 255)" fill2="rgb(249, 251, 255)" />
      <HeroRealisations offersHref={ROUTES.services} callHref={ROUTES.contact} />
      <RealisationsOptimized projects={projects} background="transparent" showDecorations={false} showAll className="realisations-variant-clean" />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
    </>
  );
}
