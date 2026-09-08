export const analyticsEventTypes = [
  "page_view",
  "section_view",
  "section_time",
  "cta_click",
  "vote",
  "before_after_interaction",
  "conversion",
  "site_navigation",
  "session_end",
] as const;

export type AnalyticsEventType = (typeof analyticsEventTypes)[number];

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
  interactions: Array<{ label: string; value: number }>;
  sections: Array<{
    id: string;
    label: string;
    views: number;
    dropOffRate: number;
    averageSeconds: number;
    medianSeconds: number;
    conversions: number;
  }>;
  daily: Array<{ date: string; visitors: number; conversions: number }>;
};
