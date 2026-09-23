import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type {
  AnalyticsEvent,
  AnalyticsEventInput,
  AnalyticsSummary,
  AnalyticsSeriesPoint,
  AnalyticsVisitor,
  AnalyticsViewport,
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
    const all: AnalyticsEvent[] = [];
    for (let offset = 0; ; offset += 1000) {
      const query = new URLSearchParams({ select: "*", created_at: `gte.${cutoff}`, order: "created_at.asc,id.asc", limit: "1000", offset: String(offset) });
      const response = await fetch(`${config.url}/rest/v1/saas_analytics_events?${query}`, {
        headers: supabaseHeaders(config.key), cache: "no-store",
      });
      if (!response.ok) throw new Error(`Supabase analytics query failed (${response.status})`);
      const rows = (await response.json()) as Record<string, unknown>[];
      all.push(...rows.map(fromDatabaseRow));
      if (rows.length < 1000) break;
    }
    return all;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SaaS analytics storage is not configured");
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

const countryAliases: Record<string, string[]> = {
  "united states": ["us", "usa", "united states"],
  "états-unis": ["us", "usa", "united states"],
  "etats-unis": ["us", "usa", "united states"],
  "united kingdom": ["gb", "uk", "united kingdom"],
  france: ["fr", "france"],
  germany: ["de", "germany"],
  india: ["in", "india"],
  australia: ["au", "australia"],
  canada: ["ca", "canada"],
};

function eventMatchesFilter(event: AnalyticsEvent, filter: string) {
  const wanted = filter.trim().toLowerCase();
  if (!wanted) return true;
  if (event.path.toLowerCase() === wanted) return true;
  const countryValues = countryAliases[wanted] ?? [wanted];
  if (countryValues.includes(event.countryCode.toLowerCase())) return true;
  return Object.values(event.metadata ?? {}).some((value) => String(value ?? "").toLowerCase() === wanted);
}

/** Keeps only people who satisfy every selected criterion. */
export function filterAnalyticsEvents(
  events: AnalyticsEvent[],
  filters: string[],
  mode: "visitor" | "event" = "visitor",
) {
  if (!filters.length) return events;
  if (mode === "event") {
    return events.filter((event) => filters.every((filter) => eventMatchesFilter(event, filter)));
  }
  const matchingVisitors = filters.map((filter) => new Set(
    events.filter((event) => eventMatchesFilter(event, filter)).map((event) => event.visitorId),
  ));
  const visitors = matchingVisitors[0] ?? new Set<string>();
  for (const visitorId of [...visitors]) {
    if (matchingVisitors.some((set) => !set.has(visitorId))) visitors.delete(visitorId);
  }
  return events.filter((event) => visitors.has(event.visitorId));
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

function eventViewport(event: AnalyticsEvent): AnalyticsViewport {
  const viewport = event.metadata?.viewport;
  return viewport === "mobile" || viewport === "tablet" ? viewport : "desktop";
}

function isConfirmedConversion(event: AnalyticsEvent) {
  return event.eventType === "conversion" && event.metadata?.conversionType !== "booked_call";
}

export function summarizeAnalytics(
  events: AnalyticsEvent[],
  rangeDays: number,
): AnalyticsSummary {
  const visitorIds = new Set(events.map((event) => event.visitorId));
  const sessionIds = new Set(events.map((event) => event.sessionId));
  const pageViews = events.filter((event) => event.eventType === "page_view");
  const visitsByVisitor = new Map<string, Set<string>>();
  pageViews.forEach((event) => {
    const sessions = visitsByVisitor.get(event.visitorId) ?? new Set<string>();
    sessions.add(event.sessionId);
    visitsByVisitor.set(event.visitorId, sessions);
  });
  const returning = new Set(pageViews.filter((event) => Number(event.metadata?.visitCount ?? 1) > 1 || (visitsByVisitor.get(event.visitorId)?.size ?? 0) > 1).map((event) => event.visitorId));
  const conversions = events.filter(isConfirmedConversion);
  const convertingVisitors = new Set(conversions.map((event) => event.visitorId));
  const ctaClicks = events.filter((event) => event.eventType === "cta_click");
  const bookedCalls = conversions.filter(
    (event) => event.metadata?.conversionType === "booking_confirmed",
  );
  const engagedSessionIds = new Set(
    events
      .filter((event) => ["cta_click", "conversion", "section_view", "scroll_depth"].includes(event.eventType))
      .map((event) => event.sessionId),
  );
  const scrollDepthBySession = new Map<string, number>();
  events
    .filter((event) => event.eventType === "scroll_depth")
    .forEach((event) => {
      const depth = Number(event.metadata?.depth ?? 0);
      scrollDepthBySession.set(event.sessionId, Math.max(scrollDepthBySession.get(event.sessionId) ?? 0, depth));
    });
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
  const pageSessions = new Map<string, Set<string>>();
  const pageVisitors = new Map<string, Set<string>>();
  pageViews.forEach((event) => {
    if (!pageSessions.has(event.path)) pageSessions.set(event.path, new Set());
    pageSessions.get(event.path)?.add(event.sessionId);
    if (!pageVisitors.has(event.path)) pageVisitors.set(event.path, new Set());
    pageVisitors.get(event.path)?.add(event.visitorId);
  });
  const pageSessionTotals = [...pageSessions.entries()]
    .map(([path, sessions]) => ({ path, value: sessions.size }))
    .sort((a, b) => b.value - a.value);
  const pageVisitorTotals = [...pageVisitors.entries()].map(([path, visitors]) => ({ path, value: visitors.size })).sort((a, b) => b.value - a.value);
  const exitLinks = counts((event) =>
    event.eventType === "site_navigation" && event.metadata?.exitLink
      ? String(event.metadata.exitLink)
      : undefined,
  );
  const ctaDetails = [...ctaClicks.reduce((map, event) => {
    const id = String(event.metadata?.ctaId ?? event.metadata?.label ?? "unknown-cta");
    const label = String(event.metadata?.label ?? id);
    const key = `${event.path}::${id}`;
    const current = map.get(key) ?? { id, label, value: 0, path: event.path, section: event.sectionId };
    current.value += 1;
    map.set(key, current);
    return map;
  }, new Map<string, { id: string; label: string; value: number; path: string; section?: string }>()).values()]
    .sort((a, b) => b.value - a.value);
  const navigationClicks = [...events.filter((event) => event.eventType === "site_navigation").reduce((map, event) => {
    const destination = String(event.metadata?.destination ?? event.metadata?.exitLink ?? "Unknown");
    const label = String(event.metadata?.label ?? destination);
    const key = `${event.path}::${destination}`;
    const current = map.get(key) ?? { label, value: 0, path: event.path, destination };
    current.value += 1;
    map.set(key, current);
    return map;
  }, new Map<string, { label: string; value: number; path: string; destination: string }>()).values()]
    .sort((a, b) => b.value - a.value);
  const scrollZoneMap = new Map<string, { path: string; zone: number; section?: string; viewport: AnalyticsViewport; people: Set<string> }>();
  const scrollZonePeople = new Map<string, Set<string>>();
  events
    .filter((event) => event.eventType === "scroll_zone")
    .forEach((event) => {
      const zone = Math.max(0, Math.min(7, Number(event.metadata?.zone ?? event.value ?? 0)));
      const viewport = eventViewport(event);
      const key = `${event.path}::${viewport}::${zone}::${event.sectionId ?? ""}`;
      const current = scrollZoneMap.get(key) ?? { path: event.path, zone, section: event.sectionId, viewport, people: new Set<string>() };
      current.people.add(event.visitorId);
      scrollZoneMap.set(key, current);
      const totalKey = `${event.path}::${viewport}`;
      if (!scrollZonePeople.has(totalKey)) scrollZonePeople.set(totalKey, new Set());
      scrollZonePeople.get(totalKey)?.add(event.visitorId);
    });
  const scrollZones = [...scrollZoneMap.values()]
    .map(({ people, ...zone }) => ({ ...zone, value: people.size }))
    .sort((a, b) => a.path.localeCompare(b.path) || a.viewport.localeCompare(b.viewport) || a.zone - b.zone);
  const scrollZoneTotals = [...scrollZonePeople.entries()]
    .map(([key, people]) => {
      const [path, viewport] = key.split("::");
      return { path, viewport: viewport as AnalyticsViewport, value: people.size };
    })
    .sort((a, b) => b.value - a.value);
  const durationBySession = new Map<string, number>();
  events.filter((event) => event.eventType === "session_end" && event.durationMs).forEach((event) => {
    durationBySession.set(event.sessionId, (durationBySession.get(event.sessionId) ?? 0) + (event.durationMs ?? 0));
  });
  const sessionDurations = [...durationBySession.values()];
  const sessionStarts = new Map<string, number>();
  pageViews.forEach((event) => sessionStarts.set(event.sessionId, Math.min(sessionStarts.get(event.sessionId) ?? Infinity, Date.parse(event.createdAt))));
  const conversionTimes = conversions.map((event) => (Date.parse(event.createdAt) - (sessionStarts.get(event.sessionId) ?? Date.parse(event.createdAt))) / 1000).filter((value) => value >= 0);
  const latestSessionEvent = new Map<string, AnalyticsEvent>();
  events.forEach((event) => {
    const previous = latestSessionEvent.get(event.sessionId);
    if (!previous || previous.createdAt < event.createdAt) latestSessionEvent.set(event.sessionId, event);
  });
  const recentVisitors = new Set([...latestSessionEvent.values()]
    .filter((event) => event.eventType !== "session_end" && Date.now() - Date.parse(event.createdAt) < 5 * 60_000)
    .map((event) => event.visitorId));

  const sectionViews = new Map<string, Set<string>>();
  const sectionTimes = new Map<string, number[]>();
  const sectionConversions = new Map<string, number>();
  const sectionSessions = new Map<string, Set<string>>();
  events.forEach((event) => {
    const section = event.sectionId;
    if (!section) return;
    if (!sectionSessions.has(section)) sectionSessions.set(section, new Set());
    sectionSessions.get(section)?.add(event.sessionId);
    if (event.eventType === "section_view") {
      if (!sectionViews.has(section)) sectionViews.set(section, new Set());
      sectionViews.get(section)?.add(event.sessionId);
    }
    if (event.eventType === "section_time" && event.durationMs) {
      if (!sectionTimes.has(section)) sectionTimes.set(section, []);
      sectionTimes.get(section)?.push(event.durationMs);
    }
    if (isConfirmedConversion(event)) {
      sectionConversions.set(
        section,
        (sectionConversions.get(section) ?? 0) + 1,
      );
    }
  });
  const orderedIds = [...sectionViews.keys()];
  const sections = orderedIds.map((id, index) => {
    const views = sectionViews.get(id)?.size ?? 0;
    const nextViews = sectionViews.get(orderedIds[index + 1])?.size ?? views;
    const times = sectionTimes.get(id) ?? [];
    const sectionSessionIds = sectionSessions.get(id) ?? new Set<string>();
    const bouncedInSection = [...sectionSessionIds].filter((sessionId) => bouncedSessions.has(sessionId)).length;
    return {
      id,
      label: String(events.find((event) => event.sectionId === id)?.metadata?.sectionLabel ?? sectionLabels[id] ?? id),
      views,
      dropOffRate: views ? Math.max(0, ((views - nextViews) / views) * 100) : 0,
      averageSeconds: times.length
        ? times.reduce((total, value) => total + value, 0) / times.length / 1000
        : 0,
      medianSeconds: median(times) / 1000,
      bounceRate: sectionSessionIds.size ? (bouncedInSection / sectionSessionIds.size) * 100 : 0,
      conversions: sectionConversions.get(id) ?? 0,
    };
  });

  const pageSectionMap = new Map<string, {
    path: string;
    id: string;
    label: string;
    reachedPeople: Set<string>;
    durations: number[];
    conversions: number;
    viewport: AnalyticsViewport;
    firstSeen: string;
  }>();
  events.forEach((event) => {
    if (!event.sectionId) return;
    const viewport = eventViewport(event);
    const key = `${event.path}::${viewport}::${event.sectionId}`;
    const current = pageSectionMap.get(key) ?? {
      path: event.path,
      id: event.sectionId,
      label: String(event.metadata?.sectionLabel ?? sectionLabels[event.sectionId] ?? event.sectionId),
      reachedPeople: new Set<string>(),
      durations: [],
      conversions: 0,
      viewport,
      firstSeen: event.createdAt,
    };
    if (event.eventType === "section_view" || event.eventType === "scroll_zone") {
      current.reachedPeople.add(event.visitorId);
    }
    if (event.eventType === "section_time" && event.durationMs) current.durations.push(event.durationMs);
    if (isConfirmedConversion(event)) current.conversions += 1;
    pageSectionMap.set(key, current);
  });
  const pageSections = [...pageSectionMap.values()]
    .sort((a, b) => a.path.localeCompare(b.path) || a.firstSeen.localeCompare(b.firstSeen))
    .map(({ reachedPeople, durations, firstSeen: _firstSeen, ...section }) => ({
      ...section,
      reachedPeople: reachedPeople.size,
      averageSeconds: durations.length
        ? durations.reduce((total, value) => total + value, 0) / durations.length / 1000
        : 0,
    }));

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
    if (isConfirmedConversion(event)) day.conversions += 1;
    dailyMap.set(date, day);
  });

  return {
    rangeDays,
    visitors: visitorIds.size,
    sessions: sessionIds.size,
    pageViews: pageViews.length,
    engagedSessions: engagedSessionIds.size,
    scrollDepth: scrollDepthBySession.size
      ? [...scrollDepthBySession.values()].reduce((total, depth) => total + depth, 0) / scrollDepthBySession.size
      : 0,
    ctaClicks: ctaClicks.length,
    bookedCalls: bookedCalls.length,
    returningVisitors: returning.size,
    returnRate: visitorIds.size ? (returning.size / visitorIds.size) * 100 : 0,
    bounceRate: sessionIds.size
      ? (bouncedSessions.size / sessionIds.size) * 100
      : 0,
    mainSiteVisits: new Set(pageViews.filter((event) => event.path === "/").map((event) => event.sessionId)).size,
    conversions: conversions.length,
    conversionRate: visitorIds.size
      ? (convertingVisitors.size / visitorIds.size) * 100
      : 0,
    averageSessionSeconds: sessionDurations.length
      ? sessionDurations.reduce((total, duration) => total + duration, 0) /
          sessionDurations.length /
          1000
      : 0,
    preConversionSeconds: conversionTimes.length ? conversionTimes.reduce((sum, value) => sum + value, 0) / conversionTimes.length : 0,
    online: recentVisitors.size,
    hostnames: pageViewsFor("hostname"),
    regions: pageViewsFor("region"),
    cities: pageViewsFor("city"),
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
        ? String(event.metadata?.ctaId ?? event.metadata?.label ?? "Unknown CTA")
        : undefined,
    ),
    ctaDetails,
    navigationClicks,
    scrollZones,
    scrollZoneTotals,
    pageSessionTotals,
    pageVisitorTotals,
    pageSections,
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

export function analyticsSeries(events: AnalyticsEvent[], days: number, granularity: string, now = Date.now()): AnalyticsSeriesPoint[] {
  const count = granularity === "Weekly" ? Math.max(1, Math.ceil(days / 7)) : granularity === "Hourly" && days === 1 ? 24 : days;
  const width = (days * 86_400_000) / count;
  const start = now - days * 86_400_000;
  const groups = Array.from({ length: count }, () => [] as AnalyticsEvent[]);
  events.forEach((event) => {
    const index = Math.floor((Date.parse(event.createdAt) - start) / width);
    if (index >= 0 && index < count) groups[index].push(event);
  });
  return groups.map((group, index) => {
    const summary = summarizeAnalytics(group, days);
    const values: Record<string, number> = {
      visitors: summary.visitors, views: summary.pageViews, sessions: summary.sessions,
      engaged: summary.engagedSessions, scroll: summary.scrollDepth, cta: summary.ctaClicks,
      bookings: summary.bookedCalls, bounce: summary.bounceRate, session: summary.averageSessionSeconds,
      conversion: summary.conversionRate, calls: summary.conversions, returning: summary.returningVisitors,
      returnRate: summary.returnRate, mainSiteVisits: summary.mainSiteVisits, conversions: summary.conversions,
      online: summary.online, pagesPerSession: summary.sessions ? summary.pageViews / summary.sessions : 0,
      conversionsPerVisitor: summary.visitors ? summary.conversions / summary.visitors * 100 : 0,
      conversionsPerSession: summary.sessions ? summary.conversions / summary.sessions * 100 : 0,
      preConversionTime: summary.preConversionSeconds,
      engagementRate: summary.sessions ? summary.engagedSessions / summary.sessions * 100 : 0,
    };
    return { date: new Date(start + index * width).toISOString(), values };
  });
}

export function analyticsVisitors(events: AnalyticsEvent[]): AnalyticsVisitor[] {
  const byVisitor = new Map<string, AnalyticsEvent[]>();
  events.forEach((event) => byVisitor.set(event.visitorId, [...(byVisitor.get(event.visitorId) ?? []), event]));
  return [...byVisitor.entries()].map(([id, visitorEvents]) => {
    visitorEvents.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const pageViews = visitorEvents.filter((event) => event.eventType === "page_view");
    const latest = visitorEvents.at(-1)!;
    const latestSession = visitorEvents.filter((event) => event.sessionId === latest.sessionId);
    const sessionEnds = latestSession.filter((event) => event.eventType === "session_end");
    const lastPage = [...latestSession].reverse().find((event) => event.eventType === "page_view");
    const lastActivity = [...latestSession].reverse().find((event) => event.eventType !== "heartbeat" && event.eventType !== "session_end") ?? latest;
    return {
      id, firstSeen: visitorEvents[0].createdAt, lastSeen: latest.createdAt,
      countryCode: latest.countryCode,
      region: String(latest.metadata?.region ?? "") || undefined,
      city: String(latest.metadata?.city ?? "") || undefined,
      source: String(pageViews[0]?.metadata?.channel ?? "Unknown"),
      device: String(latest.metadata?.device ?? "Unknown"),
      visits: new Set(pageViews.map((event) => event.sessionId)).size,
      durationSeconds: Math.round(sessionEnds.reduce((sum, event) => sum + (event.durationMs ?? 0), 0) / 1000),
      pages: [...new Set(pageViews.map((event) => event.path))],
      sections: [...new Set(visitorEvents.filter((event) => event.eventType === "section_view").map((event) => String(event.metadata?.sectionLabel ?? event.sectionId ?? "")).filter(Boolean))],
      lastAction: lastActivity.eventType,
      conversions: visitorEvents.filter(isConfirmedConversion).length,
      online: latest.eventType !== "session_end" && Date.now() - Date.parse(latest.createdAt) < 5 * 60_000,
      currentPage: lastPage?.path,
    };
  }).sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
}
