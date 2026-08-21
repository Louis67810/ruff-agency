import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/Footer";
import HeroSectionSlugRessource from "@/components/sections/HeroSectionSlugRessource/HeroSectionSlugRessource";
import RessourceArticle from "@/components/sections/RessourceArticle/RessourceArticle";
import CtaAuditRealisationsSlug from "@/components/sections/CtaAuditRealisationsSlug/CtaAuditRealisationsSlug";
import ArticlesRessource from "@/components/sections/ArticlesRessource/ArticlesRessource";
import StackSection3 from "@/components/sections/StackSection3/StackSection3";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { articles, getArticle } from "@/lib/data/articles";
import { projects } from "@/lib/data/projects";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  const title = `${article.title} — Ruff Agency`;
  const firstParagraph =
    article.content.find(
      (block): block is { type: "paragraph"; text: string } =>
        block.type === "paragraph" && Boolean(block.text)
    )?.text ?? "";
  const description =
    firstParagraph.slice(0, 155) || `Article de ${article.author} sur ${article.title}.`;
  const image = article.mainImage?.src || article.image?.src;
  const url = `${SITE_URL}/ressources/${article.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default function RessourceSlugPage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  const firstParagraph =
    article.content.find(
      (block): block is { type: "paragraph"; text: string } =>
        block.type === "paragraph" && Boolean(block.text)
    )?.text ?? "";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: firstParagraph.slice(0, 155) || article.title,
    image: article.mainImage?.src || article.image?.src,
    author: { "@type": "Person", name: article.author },
    mainEntityOfPage: `${SITE_URL}/ressources/${article.slug}`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Ressources", item: `${SITE_URL}/ressources` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/ressources/${article.slug}` },
    ],
  };
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(255, 251, 239)" fill2="rgb(255, 251, 239)" />
      <HeroSectionSlugRessource
        breadcrumbTitle={article.breadcrumbTitle}
        title={article.title}
        profilePhoto={article.profilePhoto}
        author={article.author}
        mainImage={article.mainImage}
        updatedAt={article.updatedAt}
        homeHref={ROUTES.home}
        resourcesHref={ROUTES.ressources}
        articleHref={article.href}
        tag={article.tag}
      />
      <RessourceArticle
        about={article.about}
        authorPhoto={article.profilePhoto}
        authorName={article.author}
        authorRole={article.authorRole}
        authorBio={article.authorBio}
        contentBlocks={article.content}
        callHref={ROUTES.contact}
        realisationsHref={ROUTES.realisations}
        projects={projects}
      />
      <CtaAuditRealisationsSlug />
      <ArticlesRessource
        articles={articles}
        callHref={ROUTES.contact}
        showFilters={false}
        showSidebar={false}
        className="ar-article-variant"
      />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
    </>
  );
}
