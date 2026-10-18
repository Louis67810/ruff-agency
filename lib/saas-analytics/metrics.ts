import type { AnalyticsEvent } from "./types";
import type { BriefResponse } from "../saas-brief/store";

export const isSaasLandingPath = (path: string) => /^\/(?:en\/)?saas-redesign\/?$/.test(path);

export type BriefConversionFact = Pick<BriefResponse, "id" | "visitorId" | "startedAt" | "completedAt" | "attribution">;

/** Saved, completed briefs are the source of truth, including historical submissions. */
export function attributeBriefConversions(events: AnalyticsEvent[], briefs: BriefConversionFact[]) {
  const visits = events.filter((event) => event.eventType === "page_view" && isSaasLandingPath(event.path));
  const result = [...events];
  for (const brief of briefs) {
    if (!brief.completedAt || (brief.attribution && !isSaasLandingPath(brief.attribution.path))) continue;
    const start = Date.parse(brief.startedAt);
    const visit = visits.filter((event) => event.visitorId === brief.visitorId
      && Date.parse(event.createdAt) <= start + 5_000
      && (brief.attribution || start - Date.parse(event.createdAt) <= 30 * 60_000)
      && (!brief.attribution || event.path === brief.attribution.path)
      && Object.entries(brief.attribution?.utm ?? {}).every(([key, value]) => {
        const metadataKey = { utm_source: "utmSource", utm_medium: "utmMedium", utm_campaign: "campaign", utm_content: "utmContent", utm_term: "utmTerm" }[key];
        return String(event.metadata?.[metadataKey] ?? (key === "utm_campaign" ? event.metadata?.utmCampaign : "") ?? "") === value;
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    if (!visit || result.some((event) => event.eventType === "conversion" && event.metadata?.briefId === brief.id)) continue;
    result.push({
      ...visit,
      id: `brief-${brief.id}`,
      eventType: "conversion",
      createdAt: brief.completedAt,
      metadata: { ...visit.metadata, conversionType: "brief_completed", briefId: brief.id },
    });
  }
  return result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function hasEngagement(event: AnalyticsEvent) {
  if (["cta_click", "conversion", "vote", "before_after_interaction", "ticker_interaction", "integration_interaction", "faq_question", "site_navigation"].includes(event.eventType)) return true;
  if (event.eventType === "scroll_depth" || event.eventType === "scroll_zone") return Number(event.metadata?.depth ?? event.value ?? 0) > 0;
  return Number(event.metadata?.interactionCount ?? 0) > 0;
}

/** A bounce can be established after departure or inactivity, never from a live visit alone. */
export function bouncedSessionIds(events: AnalyticsEvent[], now = Date.now()) {
  const sessions = new Map<string, AnalyticsEvent[]>();
  for (const event of events) {
    const group = sessions.get(event.sessionId) ?? [];
    group.push(event);
    sessions.set(event.sessionId, group);
  }
  return new Set([...sessions].filter(([, group]) => {
    const saas = group.filter((event) => isSaasLandingPath(event.path));
    if (!saas.length) return group.some((event) => event.eventType === "session_end" && event.metadata?.bounced === true);
    if (group.some(hasEngagement)) return false;
    const latest = Math.max(...saas.map((event) => Date.parse(event.createdAt)));
    return saas.some((event) => event.eventType === "session_end") || now - latest >= 5 * 60_000;
  }).map(([id]) => id));
}
