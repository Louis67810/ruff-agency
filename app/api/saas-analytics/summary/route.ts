import { NextRequest, NextResponse } from "next/server";
import {
  analyticsCookieName,
  analyticsTokenIsValid,
} from "@/lib/saas-analytics/auth";
import {
  analyticsSeries,
  analyticsVisitors,
  filterAnalyticsEvents,
  readAnalyticsEvents,
  summarizeAnalytics,
} from "@/lib/saas-analytics/store";
import type { AnalyticsEvent } from "@/lib/saas-analytics/types";

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
    if (request.nextUrl.searchParams.get("report") === "1") {
      const parseList = (value: string | null): string[] => {
        if (!value) return [];
        try { const parsed: unknown = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, 30) : []; }
        catch { return []; }
      };
      const selectedFilters = parseList(rawFilters);
      const targets = parseList(request.nextUrl.searchParams.get("targets"));
      const granularity = request.nextUrl.searchParams.get("granularity") ?? (days === 1 ? "Hourly" : "Daily");
      const now = Date.now();
      const start = now - days * 86_400_000;
      const events = await readAnalyticsEvents(days * 2);
      const currentEvents = events.filter((event) => Date.parse(event.createdAt) >= start);
      const previousEvents = events.filter((event) => Date.parse(event.createdAt) < start);
      const scope = (source: AnalyticsEvent[], selected: string[]) => filterAnalyticsEvents(source, selected, "event");
      const current = scope(currentEvents, selectedFilters);
      const previous = scope(previousEvents, selectedFilters);
      const comparison = targets.map((target) => {
        const targetFilters = [...selectedFilters.filter((filter) => !targets.includes(filter)), target];
        const matching = scope(currentEvents, targetFilters);
        return { label: target, summary: summarizeAnalytics(matching, days), previous: summarizeAnalytics(scope(previousEvents, targetFilters), days), series: analyticsSeries(matching, days, granularity, now) };
      });
      return NextResponse.json({ summary: summarizeAnalytics(current, days), previous: summarizeAnalytics(previous, days), series: analyticsSeries(current, days, granularity, now), comparison, ...(request.nextUrl.searchParams.get("visitors") === "1" ? { visitors: analyticsVisitors(current) } : {}) }, { headers: { "Cache-Control": "private, no-store" } });
    }
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
