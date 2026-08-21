import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/Footer";
import HeroCaseStudy from "@/components/sections/HeroCaseStudy/HeroCaseStudy";
import ContentPageRealisationsSlug from "@/components/sections/ContentPageRealisationsSlug/ContentPageRealisationsSlug";
import CtaAuditRealisationsSlug from "@/components/sections/CtaAuditRealisationsSlug/CtaAuditRealisationsSlug";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { projects, getProject } from "@/lib/data/projects";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  const title = `${project.heroTitle || project.title} — Ruff Agency`;
  const description = project.about || project.description;
  const image = project.photoDuSite?.src || project.image;
  const url = `${SITE_URL}/realisations/${project.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default function RealisationSlugPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Réalisations", item: `${SITE_URL}/realisations` },
      { "@type": "ListItem", position: 3, name: project.title, item: `${SITE_URL}/realisations/${project.slug}` },
    ],
  };
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(249, 251, 255)" fill2="rgb(249, 251, 255)" />
      <HeroCaseStudy
        slug={project.slug}
        title={project.heroTitle || project.title}
        photoDuSite={project.photoDuSite}
        realisationsHref={ROUTES.realisations}
        offersHref={ROUTES.services}
        callHref={ROUTES.contact}
      />
      <ContentPageRealisationsSlug
        logo={project.logo}
        about={project.about}
        siteHref={project.siteHref}
        review={project.review}
        profilePhoto={project.profilePhoto}
        personName={project.personName}
        personRole={project.personRole}
        challengeSubtitle={project.challengeSubtitle}
        challenge1={project.challenge1}
        challenge2={project.challenge2}
        challenge3={project.challenge3}
        challenge4={project.challenge4}
        solutionSubtitle={project.solutionSubtitle}
        solution1={project.solution1}
        solution2={project.solution2}
        solution3={project.solution3}
        solution4={project.solution4}
        resultsSubtitle={project.resultsSubtitle}
        result1={project.result1}
        result2={project.result2}
        result3={project.result3}
        result4={project.result4}
        photos={project.photos}
        visibiliteAvantApres={project.visibiliteAvantApres}
        callHref={ROUTES.contact}
      />
      <CtaAuditRealisationsSlug />
      <RealisationsOptimized
        projects={projects}
        title="Nos dernières réalisations"
        background="transparent"
        showDecorations={false}
        showAll
        className="realisations-variant-slug"
      />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
      <JsonLd data={breadcrumbSchema} />
    </>
  );
}
