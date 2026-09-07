import { NextRequest, NextResponse } from "next/server";
import {
  analyticsCookieName,
  analyticsTokenIsValid,
} from "@/lib/saas-analytics/auth";
import {
  readAnalyticsEvents,
  summarizeAnalytics,
} from "@/lib/saas-analytics/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!analyticsTokenIsValid(request.cookies.get(analyticsCookieName)?.value))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const requested = Number(request.nextUrl.searchParams.get("days") ?? 30);
  const days = [7, 30, 90].includes(requested) ? requested : 30;
  try {
    const events = await readAnalyticsEvents(days);
    return NextResponse.json(summarizeAnalytics(events, days));
  } catch (error) {
    console.error("SaaS analytics summary failed", error);
    return NextResponse.json(
      { error: "Analytics unavailable" },
      { status: 503 },
    );
  }
}
