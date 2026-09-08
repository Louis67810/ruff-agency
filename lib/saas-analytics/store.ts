import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type {
  AnalyticsEvent,
  AnalyticsEventInput,
  AnalyticsSummary,
} from "./types";

const localDirectory = path.join(process.cwd(), ".data");
const localFile = path.join(localDirectory, "saas-analytics.jsonl");

function supabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

function supabaseHeaders(key: string) {
  return {
    apikey: key,
    ...(key.startsWith("sb_") ? {} : { authorization: `Bearer ${key}` }),
  };
}

function toDatabaseRow(event: AnalyticsEvent) {
  return {
    id: event.id,
    created_at: event.createdAt,
    event_type: event.eventType,
    visitor_id: event.visitorId,
    session_id: event.sessionId,
    section_id: event.sectionId ?? null,
    country_code: event.countryCode,
    path: event.path,
    duration_ms: event.durationMs ?? null,
    value: event.value ?? null,
    metadata: event.metadata ?? {},
  };
}

function fromDatabaseRow(row: Record<string, unknown>): AnalyticsEvent {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    eventType: row.event_type as AnalyticsEvent["eventType"],
    visitorId: String(row.visitor_id),
    sessionId: String(row.session_id),
    sectionId: row.section_id ? String(row.section_id) : undefined,
    countryCode: String(row.country_code ?? "XX"),
    path: String(row.path ?? "/saas-redesign"),
    durationMs:
      typeof row.duration_ms === "number" ? row.duration_ms : undefined,
    value: typeof row.value === "number" ? row.value : undefined,
    metadata: (row.metadata ?? {}) as AnalyticsEvent["metadata"],
  };
}

export async function writeAnalyticsEvent(
  input: AnalyticsEventInput,
  countryCode: string,
) {
  const event: AnalyticsEvent = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    countryCode,
  };
  const config = supabaseConfig();

  if (config) {
    const response = await fetch(
      `${config.url}/rest/v1/saas_analytics_events`,
      {
        method: "POST",
        headers: {
          ...supabaseHeaders(config.key),
          "content-type": "application/json",
          prefer: "return=minimal",
        },
        body: JSON.stringify(toDatabaseRow(event)),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      throw new Error(`Supabase analytics insert failed (${response.status})`);
    }
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SaaS analytics storage is not configured");
  }
  await mkdir(localDirectory, { recursive: true });
  await appendFile(localFile, `${JSON.stringify(event)}\n`, "utf8");
}

export async function readAnalyticsEvents(days: number) {
  const cutoff = new Date(Date.now() - days * 86_400_000).toISOString();
  const config = supabaseConfig();
  if (config) {
    const query = new URLSearchParams({
      select: "*",
      created_at: `gte.${cutoff}`,
      order: "created_at.asc",
      limit: "20000",
    });
    const response = await fetch(
      `${config.url}/rest/v1/saas_analytics_events?${query}`,
      {
        headers: {
          ...supabaseHeaders(config.key),
        },
        cache: "no-store",
      },
    );
    if (!response.ok) {
      throw new Error(`Supabase analytics query failed (${response.status})`);
    }
    const rows = (await response.json()) as Record<string, unknown>[];
    return rows.map(fromDatabaseRow);
  }

  try {
    const contents = await readFile(localFile, "utf8");
    return contents
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as AnalyticsEvent)
      .filter((event) => event.createdAt >= cutoff);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

const sectionLabels: Record<string, string> = {
  hero: "Hero",
  problems: "Problems",
  vote: "Vote",
  solutions: "Solutions",
  results: "Results",
  metrics: "Conversion data",
  reviews: "Reviews",
  booking: "Booking",
  faq: "FAQ",
};

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function summarizeAnalytics(
  events: AnalyticsEvent[],
  rangeDays: number,
): AnalyticsSummary {
  const visitorIds = new Set(events.map((event) => event.visitorId));
  const sessionIds = new Set(events.map((event) => event.sessionId));
  const pageViews = events.filter((event) => event.eventType === "page_view");
  const returning = new Set(
    pageViews
      .filter((event) => Number(event.metadata?.visitCount ?? 1) > 1)
      .map((event) => event.visitorId),
  );
  const conversions = events.filter(
    (event) => event.eventType === "conversion",
  );
  const bouncedSessions = new Set(
    events
      .filter(
        (event) =>
          event.eventType === "session_end" && Boolean(event.metadata?.bounced),
      )
      .map((event) => event.sessionId),
  );

  const counts = (filter: (event: AnalyticsEvent) => string | undefined) => {
    const map = new Map<string, number>();
    events.forEach((event) => {
      const label = filter(event);
      if (label) map.set(label, (map.get(label) ?? 0) + 1);
    });
    return [...map.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  };
  const pageViewsFor = (key: string) =>
    counts((event) =>
      event.eventType === "page_view"
        ? String(event.metadata?.[key] ?? "Unknown")
        : undefined,
    );
  const paths = counts((event) =>
    event.eventType === "page_view" ? event.path : undefined,
  );
  const exitLinks = counts((event) =>
    event.eventType === "site_navigation" && event.metadata?.exitLink
      ? String(event.metadata.exitLink)
      : undefined,
  );
  const sessionDurations = events
    .filter((event) => event.eventType === "session_end" && event.durationMs)
    .map((event) => event.durationMs ?? 0);
  const recentSessions = new Set(
    events
      .filter((event) => Date.now() - Date.parse(event.createdAt) < 5 * 60_000)
      .map((event) => event.sessionId),
  );

  const sectionViews = new Map<string, Set<string>>();
  const sectionTimes = new Map<string, number[]>();
  const sectionConversions = new Map<string, number>();
  events.forEach((event) => {
    const section = event.sectionId;
    if (!section) return;
    if (event.eventType === "section_view") {
      if (!sectionViews.has(section)) sectionViews.set(section, new Set());
      sectionViews.get(section)?.add(event.sessionId);
    }
    if (event.eventType === "section_time" && event.durationMs) {
      if (!sectionTimes.has(section)) sectionTimes.set(section, []);
      sectionTimes.get(section)?.push(event.durationMs);
    }
    if (event.eventType === "conversion") {
      sectionConversions.set(
        section,
        (sectionConversions.get(section) ?? 0) + 1,
      );
    }
  });
  const orderedIds = Object.keys(sectionLabels).filter((id) =>
    sectionViews.has(id),
  );
  const sections = orderedIds.map((id, index) => {
    const views = sectionViews.get(id)?.size ?? 0;
    const nextViews = sectionViews.get(orderedIds[index + 1])?.size ?? views;
    const times = sectionTimes.get(id) ?? [];
    return {
      id,
      label: sectionLabels[id],
      views,
      dropOffRate: views ? Math.max(0, ((views - nextViews) / views) * 100) : 0,
      averageSeconds: times.length
        ? times.reduce((total, value) => total + value, 0) / times.length / 1000
        : 0,
      medianSeconds: median(times) / 1000,
      conversions: sectionConversions.get(id) ?? 0,
    };
  });

  const dailyMap = new Map<
    string,
    { visitors: Set<string>; conversions: number }
  >();
  events.forEach((event) => {
    const date = event.createdAt.slice(0, 10);
    const day = dailyMap.get(date) ?? {
      visitors: new Set<string>(),
      conversions: 0,
    };
    day.visitors.add(event.visitorId);
    if (event.eventType === "conversion") day.conversions += 1;
    dailyMap.set(date, day);
  });

  return {
    rangeDays,
    visitors: visitorIds.size,
    sessions: sessionIds.size,
    returningVisitors: returning.size,
    returnRate: visitorIds.size ? (returning.size / visitorIds.size) * 100 : 0,
    bounceRate: sessionIds.size
      ? (bouncedSessions.size / sessionIds.size) * 100
      : 0,
    mainSiteVisits: events.filter(
      (event) => event.eventType === "site_navigation",
    ).length,
    conversions: conversions.length,
    conversionRate: visitorIds.size
      ? (conversions.length / visitorIds.size) * 100
      : 0,
    averageSessionSeconds: sessionDurations.length
      ? sessionDurations.reduce((total, duration) => total + duration, 0) /
          sessionDurations.length /
          1000
      : 0,
    online: recentSessions.size,
    sources: pageViewsFor("channel"),
    referrers: pageViewsFor("referrer"),
    campaigns: pageViewsFor("campaign"),
    paths,
    entryPages: pageViewsFor("entryPath"),
    exitLinks,
    browsers: pageViewsFor("browser"),
    operatingSystems: pageViewsFor("operatingSystem"),
    devices: pageViewsFor("device"),
    countries: counts((event) =>
      event.eventType === "page_view" ? event.countryCode : undefined,
    ),
    ctas: counts((event) =>
      event.eventType === "cta_click"
        ? String(event.metadata?.label ?? "Unknown CTA")
        : undefined,
    ),
    interactions: counts((event) => {
      if (event.eventType === "vote") return "Votes";
      if (event.eventType === "before_after_interaction")
        return "Before / after";
      return undefined;
    }),
    sections,
    daily: [...dailyMap.entries()].map(([date, day]) => ({
      date,
      visitors: day.visitors.size,
      conversions: day.conversions,
    })),
  };
}
