import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  analyticsCookieName,
  analyticsTokenIsValid,
  localPreviewPassword,
} from "@/lib/saas-analytics/auth";
import { AnalyticsDashboard } from "./analytics-dashboard";
import "./analytics.css";

export const metadata: Metadata = {
  title: "SaaS landing analytics | Ruff Agency",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  const authenticated = analyticsTokenIsValid(
    cookies().get(analyticsCookieName)?.value,
  );
  return (
    <AnalyticsDashboard
      initiallyAuthenticated={authenticated}
      localPassword={localPreviewPassword()}
    />
  );
}
