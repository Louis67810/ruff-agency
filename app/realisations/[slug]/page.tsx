import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import HeroCaseStudy from "@/components/sections/HeroCaseStudy/HeroCaseStudy";
import ContentPageRealisationsSlug from "@/components/sections/ContentPageRealisationsSlug/ContentPageRealisationsSlug";
import CtaAuditRealisationsSlug from "@/components/sections/CtaAuditRealisationsSlug/CtaAuditRealisationsSlug";
import RealisationsOptimized from "@/components/sections/RealisationsOptimized/RealisationsOptimized";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { projects, getProject, getProjectHeroPhotos } from "@/lib/data/projects";
import JsonLd from "@/components/JsonLd";
import { headers } from "next/headers";
import { getEnglishProject } from "@/lib/data/projects-en";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function legacyGenerateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  const title = `${project.title} — Étude de cas | Ruff Agency`;
  const rawDescription = project.about || project.description;
  const description = rawDescription.length > 155 ? `${rawDescription.slice(0, 152).replace(/\s+\S*$/u, "").replace(/[\s,;:]+$/u, "")}…` : rawDescription;
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

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const sourceProject = getProject(params.slug);
  if (!sourceProject) return {};
  const english = headers().get("x-site-locale") === "en";
  const project = english ? getEnglishProject(sourceProject) : sourceProject;
  const title = `${project.title} — ${english ? "Case study" : "Étude de cas"} | Ruff Agency`;
  const description = (project.about || project.description).slice(0, 155);
  const path = `/realisations/${project.slug}`;
  const frenchUrl = `${SITE_URL}${path}`;
  const englishUrl = `${SITE_URL}/en${path}`;
  const url = english ? englishUrl : frenchUrl;
  return { title, description, alternates: { canonical: url, languages: { fr: frenchUrl, en: englishUrl } }, openGraph: { title, description, url, type: "website" } };
}

export default function RealisationSlugPage({ params }: { params: { slug: string } }) {
  const locale = headers().get("x-site-locale") === "en" ? "en" : "fr";
  const sourceProject = getProject(params.slug);
  const project = sourceProject ? (locale === "en" ? getEnglishProject(sourceProject) : sourceProject) : undefined;
  if (!project) notFound();
  const heroPhotos = getProjectHeroPhotos(project);
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
        locale={locale}
        slug={project.slug}
        title={project.heroTitle || project.title}
        photoDuSite={project.photoDuSite}
        videoSrc={project.heroVideoSrc}
        imageSlides={heroPhotos}
        realisationsHref={ROUTES.realisations}
        offersHref={ROUTES.landingPage}
        callHref={ROUTES.contact}
      />
      <ContentPageRealisationsSlug
        locale={locale}
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
      <CtaAuditRealisationsSlug locale={locale} />
      <RealisationsOptimized
        locale={locale}
        projects={locale === "en" ? projects.map(getEnglishProject) : projects}
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
