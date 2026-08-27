import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import FreeToolDetail from "@/components/sections/FreeToolDetail/FreeToolDetail";
import StackSection3 from "@/components/sections/StackSection3/StackSection3Server";
import { NAV_PROPS, FOOTER_LINKS, ROUTES, SITE_URL } from "@/lib/site";
import { freeTools, getFreeTool } from "@/lib/data/free-tools";
import { headers } from "next/headers";
import { getEnglishFreeTool } from "@/lib/data/free-tools-en";

export function generateStaticParams() { return freeTools.map((tool) => ({ slug: tool.slug })); }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = getFreeTool(params.slug);
  if (!tool) return { title: "Page introuvable" };
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "fr";
  const localizedTool = locale === "en" ? getEnglishFreeTool(tool) : tool;
  const prefix = locale === "en" ? "/en" : "";
  const url = `${SITE_URL}${prefix}/outils-gratuits/${tool.slug}`;
  return { title: `${localizedTool.title} | Ruff Agency`, description: localizedTool.description, alternates: { canonical: url, languages: { fr: `${SITE_URL}/outils-gratuits/${tool.slug}`, en: `${SITE_URL}/en/outils-gratuits/${tool.slug}` } }, openGraph: { url, type: "website" } };
}

export default async function FreeToolSlugPage({ params }: { params: { slug: string } }) {
  const tool = getFreeTool(params.slug);
  if (!tool) notFound();
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "fr";
  const localizedTool = locale === "en" ? getEnglishFreeTool(tool) : tool;
  return <><SiteNav {...NAV_PROPS} fill="rgb(251, 251, 251)" fill2="rgb(251, 251, 251)" /><FreeToolDetail locale={locale} tool={localizedTool} homeHref={ROUTES.home} toolsHref={ROUTES.freeTools} /><StackSection3 ctaHref={ROUTES.contact} /><Footer bookingHref={ROUTES.contact} links={FOOTER_LINKS} /></>;
}
