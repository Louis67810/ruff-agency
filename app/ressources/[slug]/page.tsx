import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import HeroSectionSlugRessource from "@/components/sections/HeroSectionSlugRessource/HeroSectionSlugRessource";
import RessourceArticle from "@/components/sections/RessourceArticle/RessourceArticle";
import ArticlesRessource from "@/components/sections/ArticlesRessource/ArticlesRessource";
import StackSection3 from "@/components/sections/StackSection3/StackSection3Server";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { articleLinks, articles, getArticle, getArticleDescription, getArticleModifiedDate, getArticleReadingMinutes, listedArticles } from "@/lib/data/articles";
import JsonLd from "@/components/JsonLd";
import { headers } from "next/headers";
import { getEnglishArticle, getEnglishArticles } from "@/lib/data/articles-en";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const sourceArticle = getArticle(params.slug);
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "fr";
  const article = sourceArticle && (locale === "en" ? getEnglishArticle(sourceArticle) : sourceArticle);
  if (!article) return {};
  const title = `${article.title} — Ruff Agency`;
  const description = getArticleDescription(article);
  const modifiedTime = getArticleModifiedDate(article);
  const image = article.mainImage?.src || article.image?.src;
  const url = `${SITE_URL}${locale === "en" ? "/en" : ""}/ressources/${article.slug}`;
  return {
    title,
    description,
    robots: article.noIndex ? { index: false, follow: false, nocache: true } : undefined,
    alternates: { canonical: url, languages: { fr: `${SITE_URL}/ressources/${article.slug}`, en: `${SITE_URL}/en/ressources/${article.slug}` } },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime,
      images: image ? [{ url: image, alt: article.mainImage?.alt || article.image?.alt || article.title }] : undefined,
    },
  };
}

export default function RessourceSlugPage({ params }: { params: { slug: string } }) {
  const sourceArticle = getArticle(params.slug);
  const locale = headers().get("x-site-locale") === "en" ? "en" : "fr";
  const article = sourceArticle && (locale === "en" ? getEnglishArticle(sourceArticle) : sourceArticle);
  if (!article) notFound();
  const readingMinutes = getArticleReadingMinutes(article);
  const articleUrl = `${SITE_URL}${locale === "en" ? "/en" : ""}/ressources/${article.slug}`;
  const description = getArticleDescription(article);
  const modifiedTime = getArticleModifiedDate(article);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    image: article.mainImage?.src || article.image?.src,
    author: { "@type": "Person", name: article.author, url: `${SITE_URL}/agence` },
    publisher: { "@type": "Organization", name: "Ruff Agency", url: SITE_URL },
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(modifiedTime ? { dateModified: modifiedTime } : {}),
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
      <SiteNav {...NAV_PROPS} fill="rgb(251, 251, 251)" fill2="rgb(251, 251, 251)" />
      <HeroSectionSlugRessource
        locale={locale}
        breadcrumbTitle={article.breadcrumbTitle}
        title={article.title}
        profilePhoto={article.profilePhoto}
        author={article.author}
        mainImage={article.mainImage}
        mainVideo={article.mainVideo}
        updatedAt={article.updatedAt}
        readingMinutes={readingMinutes}
        homeHref={ROUTES.home}
        resourcesHref={ROUTES.ressources}
        articleHref={article.href}
      />
      <RessourceArticle
        locale={locale}
        articleTitle={article.title}
        articleUrl={articleUrl}
        quiz={article.quiz}
        articleLinks={locale === "en" ? getEnglishArticles(listedArticles).map(({ slug, title, tag }) => ({ slug, title, tag, href: `/en/ressources/${slug}` })) : articleLinks}
        authorPhoto={article.profilePhoto}
        authorName={article.author}
        authorRole={article.authorRole}
        authorBio={article.authorBio}
        contentBlocks={article.content.filter((block) => !article.hiddenContentTypes?.includes(block.type))}
        sources={article.sources}
      />
      <ArticlesRessource
        articles={locale === "en" ? listedArticles.map(getEnglishArticle) : listedArticles}
        callHref={ROUTES.contact}
        showFilters={false}
        showSidebar={false}
        className="ar-article-variant"
        heading={locale === "en" ? "Discover our free resources" : "Découvrez nos ressources gratuites"}
      />
      <StackSection3 ctaHref={ROUTES.contact} />
      <Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} />
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
    </>
  );
}
