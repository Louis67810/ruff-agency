import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/Footer";
import HeroOptimized from "@/components/sections/HeroOptimized/HeroOptimized";
import BenefitsOptimized from "@/components/sections/BenefitsOptimized";
import ProcessusOptimized from "@/components/sections/ProcessusOptimized/ProcessusOptimized";
import AvisOptimized from "@/components/sections/AvisOptimized/AvisOptimized";
import ComparatifOptimized from "@/components/sections/ComparatifOptimized/ComparatifOptimized";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import PrixOptimized from "@/components/sections/PrixOptimized/PrixOptimized";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { projects } from "@/lib/data/projects";
import {
  locations,
  getLocationBySlug,
  locationTitle,
  locationSubtitle,
  locationRoute,
} from "@/lib/data/locations";
import JsonLd from "@/components/JsonLd";

const PREFIX = "agence-web-design-";

export function generateStaticParams() {
  return locations.map((location) => ({
    slug: `${PREFIX}${location.citySlug}`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const citySlug = slug.startsWith(PREFIX) ? slug.slice(PREFIX.length) : "";
  const location = getLocationBySlug(citySlug);
  if (!location) return { title: "Page introuvable" };

  const route = locationRoute(location);
  const title = locationTitle(location);
  const description = locationSubtitle(location);

  return {
    title: `${title} | Ruff Agency`,
    description,
    alternates: { canonical: `${SITE_URL}${route}` },
    openGraph: { url: `${SITE_URL}${route}`, type: "website" },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const citySlug = slug.startsWith(PREFIX) ? slug.slice(PREFIX.length) : "";
  const location = getLocationBySlug(citySlug);
  if (!location) return notFound();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ruff Agency",
    url: SITE_URL,
    description: `Agence de web design à ${location.cityName} : on crée des landing pages et des sites World-class.`,
  };

  return (
    <>
      <SiteNav {...NAV_PROPS} />
      <HeroOptimized
        title={locationTitle(location)}
        subtitle={locationSubtitle(location)}
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        reviewsHref={ROUTES.agence}
      />
      <BenefitsOptimized bookingHref={ROUTES.contact} />
      <ProcessusOptimized projectHref={ROUTES.contact} />
      <AvisOptimized />
      <ComparatifOptimized bookingHref={ROUTES.contact} />
      <RealisationsOptimized projects={projects} />
      <PrixOptimized bookingHref={ROUTES.contact} secondaryHref={ROUTES.realisations} />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
      <JsonLd data={organizationSchema} />
    </>
  );
}
