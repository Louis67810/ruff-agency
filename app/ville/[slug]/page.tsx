import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import HeroOptimized from "@/components/sections/HeroOptimized/HeroOptimized";
import BenefitsOptimized from "@/components/sections/BenefitsOptimized";
import ProcessusOptimized from "@/components/sections/ProcessusOptimized/ProcessusOptimized";
import AvisOptimized from "@/components/sections/AvisOptimized/AvisOptimized";
import ComparatifOptimized from "@/components/sections/ComparatifOptimized/ComparatifOptimized";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import PrixOptimized from "@/components/sections/PrixOptimized/PrixOptimizedServer";
import SectionAvis from "@/components/sections/SectionAvis";
import StackSection3 from "@/components/sections/StackSection3/StackSection3Server";
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
import { headers } from "next/headers";
import {
  englishLocationTitle,
  englishLocationSubtitle,
} from "@/lib/data/locations-en";

const PREFIX = "agence-web-design-";

export function generateStaticParams() {
  return locations.map((location) => ({
    slug: `${PREFIX}${location.citySlug}`,
  }));
}

async function legacyGenerateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const citySlug = slug.startsWith(PREFIX) ? slug.slice(PREFIX.length) : "";
  const location = getLocationBySlug(citySlug);
  if (!location) return { title: "Page introuvable" };

  const route = locationRoute(location);
  const title = `Agence web design à ${location.cityName}`;
  const description = `Agence web design à ${location.cityName} spécialisée en landing pages et sites performants pour renforcer votre image et convertir plus de visiteurs.`;

  return {
    title: `${title} | Ruff Agency`,
    description,
    alternates: { canonical: `${SITE_URL}${route}` },
    openGraph: { url: `${SITE_URL}${route}`, type: "website" },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const citySlug = slug.startsWith(PREFIX) ? slug.slice(PREFIX.length) : "";
  const location = getLocationBySlug(citySlug);
  if (!location) return { title: "Page introuvable" };
  const english = (await headers()).get("x-site-locale") === "en";
  const path = locationRoute(location);
  const frenchUrl = `${SITE_URL}${path}`;
  const englishUrl = `${SITE_URL}/en${path}`;
  const url = english ? englishUrl : frenchUrl;
  const title = english ? englishLocationTitle(location) : locationTitle(location);
  const description = english
    ? `Web design agency in ${location.cityName} specializing in high-performing landing pages and websites.`
    : `Agence web design à ${location.cityName} spécialisée en landing pages et sites performants pour renforcer votre image et convertir plus de visiteurs.`;
  return { title: `${title} | Ruff Agency`, description, robots: { index: false, follow: true }, alternates: { canonical: url, languages: { fr: frenchUrl, en: englishUrl } }, openGraph: { title, description, url, type: "website" } };
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
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "fr";

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
        title={
          locale === "en"
            ? englishLocationTitle(location)
            : locationTitle(location)
        }
        subtitle={
          locale === "en"
            ? englishLocationSubtitle(location)
            : locationSubtitle(location)
        }
        locale={locale}
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        reviewsHref={ROUTES.agence}
      />
      <BenefitsOptimized locale={locale} bookingHref={ROUTES.contact} />
      <ProcessusOptimized locale={locale} projectHref={ROUTES.contact} />
      <AvisOptimized locale={locale} />
      <ComparatifOptimized locale={locale} bookingHref={ROUTES.contact} />
      <RealisationsOptimized locale={locale} projects={projects} />
      <PrixOptimized
        bookingHref={ROUTES.contact}
        secondaryHref={ROUTES.realisations}
      />
      <SectionAvis />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
      <JsonLd data={organizationSchema} />
    </>
  );
}

