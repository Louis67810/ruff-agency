import type { Metadata } from "next";
import { cookies } from "next/headers";
import { analyticsCookieName, analyticsTokenIsValid } from "@/lib/saas-analytics/auth";
import { readAnalyticsEvents, summarizeAnalytics } from "@/lib/saas-analytics/store";
import { BehavioralIntelligenceApp } from "./behavioral-intelligence-app";
import { BehavioralIntelligenceLogin } from "./behavioral-login";
import "./behavioral-intelligence.css";
import "./visitor-history.css";

export const metadata: Metadata = {
  title: "Behavioral Intelligence OS | Ruff Agency",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BehavioralIntelligencePage() {
  const authenticated = analyticsTokenIsValid(cookies().get(analyticsCookieName)?.value);
  if (process.env.NODE_ENV === "production" && !authenticated) {
    return <BehavioralIntelligenceLogin />;
  }
  let analytics = null;
  try {
    analytics = summarizeAnalytics(await readAnalyticsEvents(30), 30);
  } catch (error) {
    console.error("Behavioral Intelligence data unavailable", error);
    return <main className="fw-login-page"><div className="fw-login-card" role="alert">
      <span>RUFF / PRIVATE ANALYTICS</span>
      <h1>Statistiques indisponibles</h1>
      <p>La source de données ne répond pas. Réessayez dans quelques instants.</p>
      <a href="/behavioral-intelligence">Réessayer</a>
    </div></main>;
  }
  return <BehavioralIntelligenceApp initialAnalytics={analytics} />;
}
