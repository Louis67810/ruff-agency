import { NextRequest, NextResponse } from "next/server";
import {
  analyticsCookieName,
  analyticsTokenIsValid,
} from "@/lib/saas-analytics/auth";
import {
  filterAnalyticsEvents,
  readAnalyticsEvents,
  summarizeAnalytics,
} from "@/lib/saas-analytics/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !analyticsTokenIsValid(request.cookies.get(analyticsCookieName)?.value))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const requested = Number(request.nextUrl.searchParams.get("days") ?? 30);
  const days = [1, 7, 30, 90].includes(requested) ? requested : 30;
  try {
    const rawFilters = request.nextUrl.searchParams.get("filters");
    const filters = rawFilters ? JSON.parse(rawFilters) : [];
    const matchMode = request.nextUrl.searchParams.get("match") === "event" ? "event" : "visitor";
    const events = await readAnalyticsEvents(days);
    const filteredEvents = Array.isArray(filters)
      ? filterAnalyticsEvents(events, filters.filter((value): value is string => typeof value === "string"), matchMode)
      : events;
    return NextResponse.json(summarizeAnalytics(filteredEvents, days));
  } catch (error) {
    console.error("SaaS analytics summary failed", error);
    return NextResponse.json(
      { error: "Analytics unavailable" },
      { status: 503 },
    );
  }
}
