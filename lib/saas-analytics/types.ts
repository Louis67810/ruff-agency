export const analyticsEventTypes = [
  "page_view",
  "section_view",
  "section_time",
  "scroll_depth",
  "scroll_zone",
  "cta_click",
  "vote",
  "before_after_interaction",
  "conversion",
  "site_navigation",
  "session_end",
] as const;

export type AnalyticsEventType = (typeof analyticsEventTypes)[number];
export type AnalyticsViewport = "desktop" | "tablet" | "mobile";

export type AnalyticsEventInput = {
  eventType: AnalyticsEventType;
  visitorId: string;
  sessionId: string;
  sectionId?: string;
  path: string;
  durationMs?: number;
  value?: number;
  metadata?: Record<string, string | number | boolean | null>;
};

export type AnalyticsEvent = AnalyticsEventInput & {
  id: string;
  createdAt: string;
  countryCode: string;
};

export type AnalyticsSummary = {
  rangeDays: number;
  visitors: number;
  sessions: number;
  pageViews: number;
  engagedSessions: number;
  scrollDepth: number;
  ctaClicks: number;
  bookedCalls: number;
  returningVisitors: number;
  returnRate: number;
  bounceRate: number;
  mainSiteVisits: number;
  conversions: number;
  conversionRate: number;
  averageSessionSeconds: number;
  online: number;
  sources: Array<{ label: string; value: number }>;
  referrers: Array<{ label: string; value: number }>;
  campaigns: Array<{ label: string; value: number }>;
  paths: Array<{ label: string; value: number }>;
  entryPages: Array<{ label: string; value: number }>;
  exitLinks: Array<{ label: string; value: number }>;
  browsers: Array<{ label: string; value: number }>;
  operatingSystems: Array<{ label: string; value: number }>;
  devices: Array<{ label: string; value: number }>;
  countries: Array<{ label: string; value: number }>;
  ctas: Array<{ label: string; value: number }>;
  ctaDetails: Array<{
    id: string;
    label: string;
    value: number;
    path: string;
    section?: string;
  }>;
  navigationClicks: Array<{
    label: string;
    value: number;
    path: string;
    destination: string;
  }>;
  interactions: Array<{ label: string; value: number }>;
  sections: Array<{
    id: string;
    label: string;
    views: number;
    dropOffRate: number;
    averageSeconds: number;
    medianSeconds: number;
    bounceRate: number;
    conversions: number;
  }>;
  scrollZones: Array<{
    path: string;
    zone: number;
    value: number;
    section?: string;
    viewport: AnalyticsViewport;
  }>;
  scrollZoneTotals: Array<{ path: string; value: number; viewport: AnalyticsViewport }>;
  pageSessionTotals: Array<{ path: string; value: number }>;
  pageSections: Array<{
    path: string;
    id: string;
    label: string;
    reachedPeople: number;
    averageSeconds: number;
    conversions: number;
    viewport: AnalyticsViewport;
  }>;
  daily: Array<{ date: string; visitors: number; conversions: number }>;
};
