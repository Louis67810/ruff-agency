import type { Metadata } from "next";
import { cookies } from "next/headers";
import { analyticsCookieName, analyticsTokenIsValid } from "@/lib/saas-analytics/auth";
import { readAnalyticsEvents, summarizeAnalytics } from "@/lib/saas-analytics/store";
import { BehavioralIntelligenceApp } from "./behavioral-intelligence-app";
import "./behavioral-intelligence.css";
import "./visitor-history.css";

export const metadata: Metadata = {
  title: "Behavioral Intelligence OS | Ruff Agency",
  robots: { index: false, follow: false },
};

export default async function BehavioralIntelligencePage() {
  const authenticated = analyticsTokenIsValid(cookies().get(analyticsCookieName)?.value);
  const canReadPreviewData = process.env.NODE_ENV !== "production" || authenticated;
  const analytics = canReadPreviewData
    ? summarizeAnalytics(await readAnalyticsEvents(30), 30)
    : null;
  return <BehavioralIntelligenceApp initialAnalytics={analytics} />;
}
