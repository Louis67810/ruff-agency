import type { Metadata } from "next";
import { cookies } from "next/headers";
import { analyticsCookieName, analyticsTokenIsValid } from "@/lib/saas-analytics/auth";
import { readAnalyticsEvents, readFaqQuestionEvents, summarizeAnalytics, type FaqQuestionRecord } from "@/lib/saas-analytics/store";
import { BehavioralIntelligenceApp } from "./behavioral-intelligence-app";
import { BehavioralIntelligenceLogin } from "./behavioral-login";
import sitemap from "@/app/sitemap";
import { articles } from "@/lib/data/articles";
import { projects } from "@/lib/data/projects";
import { freeTools } from "@/lib/data/free-tools";
import { locations, locationRoute } from "@/lib/data/locations";
import "./behavioral-intelligence.css";
import "./visitor-history.css";

export const metadata: Metadata = {
  title: "Behavioral Intelligence OS | Ruff Agency",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BehavioralIntelligencePage({ searchParams }: { searchParams?: { view?: string } }) {
  const authenticated = analyticsTokenIsValid(cookies().get(analyticsCookieName)?.value);
  if (process.env.NODE_ENV === "production" && !authenticated) {
    return <BehavioralIntelligenceLogin />;
  }
  let analytics = null;
  let faqQuestions: FaqQuestionRecord[] = [];
  try {
    const [events, questions] = await Promise.all([readAnalyticsEvents(30), readFaqQuestionEvents()]);
    analytics = summarizeAnalytics(events, 30);
    faqQuestions = questions;
  } catch (error) {
    console.error("Behavioral Intelligence data unavailable", error);
    return <main className="fw-login-page"><div className="fw-login-card" role="alert">
      <span>RUFF / PRIVATE ANALYTICS</span>
      <h1>Statistiques indisponibles</h1>
      <p>La source de données ne répond pas. Réessayez dans quelques instants.</p>
      <a href="/behavioral-intelligence">Réessayer</a>
    </div></main>;
  }
  const titles = new Map<string, string>([
    ["/", "Home"], ["/agence", "Agence"], ["/services", "Services"],
    ["/realisations", "Réalisations"], ["/ressources", "Ressources"],
    ["/outils-gratuits", "Outils gratuits"], ["/30-min", "30 min"],
    ["/saas-redesign", "SaaS redesign"],
    ["/saas-redesign/brief", "Brief SaaS redesign"],
    ["/services/site-internet", "Site internet"],
    ...articles.map((article): [string, string] => [article.href, article.title]),
    ...projects.map((project): [string, string] => [project.href, project.title]),
    ...freeTools.map((tool): [string, string] => [tool.href, tool.title]),
    ...locations.map((location): [string, string] => [locationRoute(location), `Agence web design ${location.cityName}`]),
  ]);
  const paths = new Set([
    ...sitemap().map((entry) => new URL(entry.url).pathname),
    ...titles.keys(),
    ...[...titles.keys()].map((path) => path === "/" ? "/en" : `/en${path}`),
    ...locations.map(locationRoute),
  ]);
  const pageCatalog = [...paths].map((path) => ({
    path,
    name: path.startsWith("/en/") || path === "/en"
      ? `${titles.get(path.slice(3) || "/") ?? path} · EN`
      : titles.get(path) ?? path,
  }));
  const localPreview = process.env.NODE_ENV !== "production" && !(
    (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)
    && (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
  const initialView = searchParams?.view === "forms" ? "forms" : searchParams?.view === "questions" ? "questions" : searchParams?.view === "live" ? "live" : searchParams?.view === "history" ? "history" : "home";
  return <BehavioralIntelligenceApp initialAnalytics={analytics} initialFaqQuestions={faqQuestions} pageCatalog={pageCatalog} localPreview={localPreview} initialView={initialView} />;
}
