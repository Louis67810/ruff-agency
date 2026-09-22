"use client";

import { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import type { AnalyticsSummary } from "@/lib/saas-analytics/types";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { FunnelChart } from "@/components/charts/funnel-chart";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Apple,
  Filter,
  Globe2,
  Laptop,
  Monitor,
  RefreshCw,
  Search,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";

type Row = { name: string; value: number; icon?: string; path?: string };
type DashboardMode = "home" | "page" | "profile" | "ad";
export type MetricKey = "visitors" | "views" | "sessions" | "engaged" | "scroll" | "cta" | "bookings" | "bounce" | "session" | "conversion" | "share" | "calls" | "impressions" | "clicks" | "ctr" | "cpa" | "spend" | "returning" | "returnRate" | "mainSiteVisits" | "conversions" | "online" | "pagesPerSession" | "conversionsPerVisitor" | "conversionsPerSession" | "preConversionTime" | "engagementRate";

const comparisonPalette = ["#8DCDFF", "#8DA8FF", "#AA99FF", "#FAC666", "#FA9C66", "#E16540", "#95EB73", "#DBEB73", "#FF8DA0", "#F78DFF"];

function comparisonChartColors(seriesCount: number) {
  const count = Math.max(1, seriesCount);
  return Array.from({ length: count }, (_, index) => comparisonPalette[Math.round((index * comparisonPalette.length) / count) % comparisonPalette.length]);
}

const visitorSeries = [455, 455, 415, 386, 365, 409, 364, 414, 367, 378, 348, 305, 287, 282, 210, 170, 131, 139, 150, 128, 159, 188, 251, 274, 27];
const baseSeries: Record<MetricKey, number[]> = {
  visitors: visitorSeries,
  views: visitorSeries.map((value, index) => value * (1.22 + (index % 4) * 0.045)),
  sessions: visitorSeries.map((value, index) => value * (0.76 + (index % 3) * 0.04)),
  engaged: visitorSeries.map((value, index) => value * (0.58 + (index % 4) * 0.035)),
  scroll: [42, 45, 47, 44, 51, 54, 52, 56, 58, 55, 61, 63, 60, 66, 68, 64, 70, 72, 69, 74, 76, 73, 78, 81, 77],
  cta: [54, 61, 58, 67, 72, 69, 76, 81, 78, 84, 88, 92, 90, 97, 103, 99, 108, 114, 111, 119, 124, 131, 137, 142, 128],
  bookings: [8, 10, 9, 13, 15, 14, 17, 20, 18, 22, 24, 27, 25, 29, 33, 31, 36, 39, 37, 42, 45, 48, 52, 56, 49],
  bounce: [61, 63, 64, 62, 60, 66, 63, 65, 61, 64, 67, 62, 63, 64, 66, 65, 68, 64, 62, 61, 63, 65, 64, 66, 64],
  session: [84, 88, 91, 86, 94, 100, 96, 102, 98, 91, 87, 83, 78, 74, 71, 68, 72, 76, 79, 82, 88, 92, 97, 104, 69],
  conversion: [6.2, 6.8, 7.1, 6.6, 7.4, 8.1, 7.8, 8.6, 8.2, 7.9, 8.8, 9.2, 8.7, 9.4, 9.8, 8.9, 8.4, 9.1, 9.7, 10.2, 9.6, 10.4, 10.8, 11.1, 9.8],
  share: [18, 18.4, 19.1, 18.8, 19.6, 20.2, 20.8, 20.1, 21.2, 20.7, 21.6, 22.1, 21.8, 22.7, 23.2, 22.5, 23.6, 24.1, 23.7, 24.8, 25.1, 24.6, 25.8, 26.2, 25.4],
  calls: [8, 11, 9, 14, 12, 16, 13, 18, 17, 20, 16, 22, 24, 19, 27, 25, 29, 31, 28, 34, 30, 37, 39, 42, 33],
  impressions: visitorSeries.map((value, index) => value * (7.4 + (index % 5) * 0.3)),
  clicks: [182, 194, 176, 205, 221, 198, 236, 248, 229, 254, 271, 246, 288, 302, 278, 314, 296, 328, 341, 319, 352, 366, 381, 397, 354],
  ctr: [4.1, 4.3, 4.0, 4.5, 4.8, 4.4, 5.0, 5.2, 4.9, 5.4, 5.1, 5.7, 5.5, 5.9, 6.1, 5.8, 6.3, 6.0, 6.5, 6.7, 6.4, 6.9, 7.1, 7.4, 6.8],
  cpa: [74, 71, 78, 69, 66, 72, 63, 61, 65, 58, 62, 55, 57, 52, 49, 53, 47, 50, 45, 43, 46, 41, 39, 37, 42],
  spend: [420, 438, 451, 466, 472, 489, 503, 518, 532, 541, 558, 571, 587, 599, 614, 628, 641, 656, 672, 689, 703, 718, 734, 749, 762],
  returning: visitorSeries.map((value) => value * 0.22),
  returnRate: visitorSeries.map(() => 22),
  mainSiteVisits: visitorSeries.map((value) => value * 0.62),
  conversions: visitorSeries.map((value) => value * 0.08),
  online: visitorSeries.map((value) => value * 0.01),
  pagesPerSession: visitorSeries.map(() => 2.6),
  conversionsPerVisitor: visitorSeries.map(() => 0.08),
  conversionsPerSession: visitorSeries.map(() => 0.1),
  preConversionTime: [84, 88, 91, 86, 94, 100, 96, 102, 98, 91, 87, 83, 78, 74, 71, 68, 72, 76, 79, 82, 88, 92, 97, 104, 69],
  engagementRate: visitorSeries.map(() => 70),
};

const sourceData: Record<string, Row[]> = {
  Channel: [
    { name: "Direct", value: 3200 },
    { name: "Organic social", value: 1700 },
    { name: "Organic search", value: 612 },
    { name: "Referral", value: 151 },
    { name: "A.I.", value: 87 },
    { name: "Newsletter", value: 65 },
    { name: "Email", value: 43 },
  ],
  Referrer: [
    { name: "google.com", value: 2110 },
    { name: "x.com", value: 1460 },
    { name: "linkedin.com", value: 938 },
    { name: "bing.com", value: 681 },
    { name: "newsletter", value: 594 },
  ],
  Campaign: [
    { name: "founder-04", value: 1840 },
    { name: "proof-retarget", value: 1384 },
    { name: "brand-fr", value: 976 },
    { name: "pricing-objection", value: 642 },
  ],
};

const pathData: Record<string, Row[]> = {
  Hostname: [
    { name: "ruff.agency", value: 4900 },
    { name: "app.ruff.agency", value: 883 },
  ],
  Page: [
    { name: "/", value: 4900 },
    { name: "/today", value: 1500 },
    { name: "/about", value: 681 },
    { name: "/category/leaderboards-attention", value: 556 },
    { name: "/categories", value: 425 },
    { name: "/daily", value: 394 },
    { name: "/category/seo-ai-visibility", value: 338 },
    { name: "/category/marketing-advertising", value: 246 },
    { name: "/rules", value: 243 },
    { name: "/category/ai-agents-infrastructure", value: 222 },
  ],
  "Entry page": [
    { name: "/", value: 3860 },
    { name: "/today", value: 731 },
    { name: "/about", value: 344 },
    { name: "/categories", value: 238 },
    { name: "/daily", value: 194 },
  ],
  "Exit link": [
    { name: "/booking", value: 1304 },
    { name: "calendly.com", value: 782 },
    { name: "linkedin.com", value: 419 },
    { name: "x.com", value: 288 },
  ],
};

const locationData: Record<string, Row[]> = {
  Country: [
    { name: "United States", value: 1810 },
    { name: "United Kingdom", value: 642 },
    { name: "France", value: 521 },
    { name: "Germany", value: 494 },
    { name: "India", value: 366 },
    { name: "Canada", value: 318 },
    { name: "Australia", value: 228 },
  ],
  Region: [
    { name: "California", value: 601 },
    { name: "England", value: 532 },
    { name: "Île-de-France", value: 288 },
    { name: "New York", value: 263 },
    { name: "Bavaria", value: 199 },
  ],
  City: [
    { name: "London", value: 318 },
    { name: "New York", value: 247 },
    { name: "Paris", value: 226 },
    { name: "San Francisco", value: 212 },
    { name: "Berlin", value: 187 },
  ],
};

const countryCodes: Record<string, string> = {
  "United States": "US",
  "États-Unis": "US",
  "United Kingdom": "GB",
  France: "FR",
  Germany: "DE",
  India: "IN",
  Canada: "CA",
  Australia: "AU",
  Pakistan: "PK",
  Bangladesh: "BD",
  Spain: "ES",
  Turkey: "TR",
  Uzbekistan: "UZ",
};

const systemData: Record<string, Row[]> = {
  Browser: [
    { name: "Chrome", value: 3600 },
    { name: "Safari", value: 906 },
    { name: "Twitter", value: 714 },
    { name: "Edge", value: 149 },
    { name: "Firefox", value: 103 },
    { name: "LinkedIn", value: 97 },
    { name: "Facebook", value: 48 },
    { name: "GSA", value: 38 },
    { name: "Opera", value: 25 },
    { name: "Samsung Internet", value: 19 },
  ],
  OS: [
    { name: "Windows", value: 2140 },
    { name: "macOS", value: 1538 },
    { name: "iOS", value: 941 },
    { name: "Android", value: 806 },
    { name: "Linux", value: 358 },
  ],
  Device: [
    { name: "Desktop", value: 3918 },
    { name: "Mobile", value: 1694 },
    { name: "Tablet", value: 171 },
  ],
};

const browserIcons: Record<string, string> = {
  Chrome: "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/chrome/chrome_64x64.png",
  Safari: "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/safari/safari_64x64.png",
  Edge: "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/edge/edge_64x64.png",
  Firefox: "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/firefox/firefox_64x64.png",
  Opera: "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/opera/opera_64x64.png",
  "Samsung Internet": "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/samsung-internet/samsung-internet_64x64.png",
};

const colors = ["#e6f4ff", "#cce9ff", "#acdafe", "#87c9fb", "#66b6f3", "#479fe8", "#2588db"];
const datafastPieColors = ["#daefff", "rgba(218,239,255,.38)", "rgba(218,239,255,.35)", "rgba(218,239,255,.32)", "rgba(218,239,255,.29)", "rgba(218,239,255,.26)", "rgba(218,239,255,.23)"];
const periods = ["Last 24 hours", "Last 7 days", "Last 30 days"];
const granularities = ["Hourly", "Daily", "Weekly"];

const homeJourneyTabs: Record<string, Row[]> = {
  "Conversion journey": [
    { name: "Visitors", value: 12400 },
    { name: "Scrolled to value section", value: 6800 },
    { name: "Reached contact section", value: 3200 },
    { name: "Started booking", value: 1500 },
    { name: "Booked call", value: 620 },
  ],
  "Section reach": [
    { name: "Visitors", value: 12400 },
    { name: "Hero viewed", value: 9800 },
    { name: "Scrolled to value section", value: 6800 },
    { name: "Reached contact section", value: 2100 },
    { name: "Booked call", value: 620 },
  ],
};

function pageSectionFunnelTabs(path: string | null, analytics?: AnalyticsSummary | null): Record<string, Row[]> | null {
  if (!path || !analytics) return null;
  const sections = analytics.pageSections.filter((section) => section.path === path);
  if (!sections.length) return null;
  const pageViews = analytics.paths.find((item) => item.label === path)?.value ?? sections[0].reachedPeople;
  return {
    "Section reach": [
      { name: "Page visitors", value: pageViews },
      ...sections.map((section) => ({ name: section.label, value: section.reachedPeople })),
    ],
  };
}

function compact(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : value.toLocaleString("en-US");
}

function smoothPath(points: Array<[number, number]>) {
  if (points.length < 2) return "";
  return points.reduce((path, point, index) => {
    if (!index) return `M${point[0]},${point[1]}`;
    const prev = points[index - 1];
    const cx = (prev[0] + point[0]) / 2;
    return `${path} C${cx},${prev[1]} ${cx},${point[1]} ${point[0]},${point[1]}`;
  }, "");
}

export function ExactAnalyticsDashboard({ mode = "home", scope, linkedPagePath, analytics, compareMetric = null, onCompareMetricChange, compareRelative = false, comparisonPair = null, externalFilter = null, externalMetric = null, onStickyControlsChange, onSelectPage, pageOptions = [], selectedPagePath = "", onSelectedPagePathChange, analyticsPeriod, onAnalyticsPeriodChange, analyticsGranularity, onAnalyticsGranularityChange }: { mode?: DashboardMode; scope?: string; linkedPagePath?: string; analytics?: AnalyticsSummary | null; compareMetric?: MetricKey | null; onCompareMetricChange?: (value: MetricKey | null) => void; compareRelative?: boolean; comparisonPair?: string | null; externalFilter?: string | null; externalMetric?: MetricKey | null; onStickyControlsChange?: (controls: ReactNode | null) => void; onSelectPage?: (page: string) => void; pageOptions?: Array<{ name: string; path: string }>; selectedPagePath?: string; onSelectedPagePathChange?: (path: string) => void; analyticsPeriod?: string; onAnalyticsPeriodChange?: (period: "Last 24 hours" | "Last 7 days" | "Last 30 days") => void; analyticsGranularity?: string; onAnalyticsGranularityChange?: (granularity: string) => void }) {
  const firstMetric: MetricKey = mode === "ad" ? "impressions" : "visitors";
  const [metric, setMetric] = useState<MetricKey>(firstMetric);
  const activeCompareMetric = comparisonPair ? metric : compareMetric;
  const [localGranularity, setLocalGranularity] = useState(granularities[0]);
  const granularity = analyticsGranularity ?? localGranularity;
  const setGranularity = onAnalyticsGranularityChange ?? setLocalGranularity;
  const [periodOpen, setPeriodOpen] = useState(false);
  const [granularityOpen, setGranularityOpen] = useState(false);
  const [localPeriodIndex, setLocalPeriodIndex] = useState(0);
  const periodIndex = analyticsPeriod ? Math.max(0, periods.indexOf(analyticsPeriod)) : localPeriodIndex;
  const setPeriodIndex = (next: number | ((current: number) => number)) => {
    const index = typeof next === "function" ? next(periodIndex) : next;
    if (onAnalyticsPeriodChange) onAnalyticsPeriodChange(periods[index] as "Last 24 hours" | "Last 7 days" | "Last 30 days");
    else setLocalPeriodIndex(index);
  };
  const [pageOpen, setPageOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [revision, setRevision] = useState(0);
  const [filters, setFilters] = useState<string[]>([]);
  const [scopeActive, setScopeActive] = useState(Boolean(scope));
  const [filterRemoving, setFilterRemoving] = useState<string | null>(null);
  const [filterPicker, setFilterPicker] = useState<{ title: string; rows: Row[]; onChoose: (row: Row) => void } | null>(null);
  const [filterPickers, setFilterPickers] = useState<Record<string, { title: string; rows: Row[]; onChoose: (row: Row) => void }>>({});
  const [filteredAnalytics, setFilteredAnalytics] = useState<{ key: string; summary: AnalyticsSummary } | null>(null);
  const [filterError, setFilterError] = useState(false);
  const [comparisonAnalytics, setComparisonAnalytics] = useState<AnalyticsSummary | null>(null);
  const [comparisonAnalyticsPair, setComparisonAnalyticsPair] = useState<AnalyticsSummary[]>([]);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [searchOverlay, setSearchOverlay] = useState<{ title: string; rows: Row[]; onChoose: (row: Row) => void } | null>(null);
  // Filtered summaries come from the event store; never shrink values with a
  // visual factor, otherwise the dashboard would show invented numbers.
  const filterFactor = 1;
  const appliedFilters = selectedPagePath ? [...filters.filter((filter) => filter !== selectedPagePath), selectedPagePath] : filters;
  const filterDays = analyticsPeriod === "Last 24 hours" ? 1 : analyticsPeriod === "Last 7 days" ? 7 : 30;
  const filterKey = appliedFilters.length ? `${filterDays}:${appliedFilters.join("|")}` : null;
  const selectedFilter = filters.at(-1) ?? null;
  const pageFilterPath = selectedPagePath || filters.find((value) => value.startsWith("/")) || null;
  useEffect(() => {
    setFilters(externalFilter ? [externalFilter] : []);
  }, [externalFilter]);
  useEffect(() => {
    if (externalMetric) setMetric(externalMetric);
  }, [externalMetric]);
  useEffect(() => {
    if (!appliedFilters.length) {
      setFilteredAnalytics(null);
      setFilterError(false);
      return;
    }
    const controller = new AbortController();
    setFilterError(false);
    fetch(`/api/saas-analytics/summary?days=${filterDays}&match=${selectedPagePath ? "event" : "visitor"}&filters=${encodeURIComponent(JSON.stringify(appliedFilters))}`, { signal: controller.signal, cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Analytics unavailable")))
      .then((summary: AnalyticsSummary | null) => { if (summary) setFilteredAnalytics({ key: filterKey ?? "", summary }); })
      .catch(() => { if (!controller.signal.aborted) setFilterError(true); });
    return () => controller.abort();
  }, [filterKey]);
  const analyticsView = filteredAnalytics?.key === filterKey ? filteredAnalytics.summary : filterKey ? null : analytics;
  const comparisonNames = comparisonPair?.split(/\s+avec\s+/i).map((value) => value.trim()).filter(Boolean) ?? [];
  useEffect(() => {
    const targets = comparisonPair?.split(/\s+avec\s+/i).map((value) => value.trim()).filter(Boolean) ?? [];
    if (targets.length < 2) {
      setComparisonAnalytics(null);
      setComparisonAnalyticsPair([]);
      return;
    }
    const controller = new AbortController();
    Promise.all(targets.map((target) => {
      const scopedFilters = [...filters.filter((filter) => filter !== target), target];
      return fetch(`/api/saas-analytics/summary?days=30&match=event&filters=${encodeURIComponent(JSON.stringify(scopedFilters))}`, { signal: controller.signal, cache: "no-store" }).then((response) => response.ok ? response.json() : null);
    }))
      .then((summaries: Array<AnalyticsSummary | null>) => { setComparisonAnalyticsPair(summaries.map((summary) => summary).filter((summary): summary is AnalyticsSummary => Boolean(summary))); setComparisonAnalytics(summaries[1] ?? null); })
      .catch(() => setComparisonAnalytics(null));
    return () => controller.abort();
  }, [comparisonPair, filterKey]);
  const comparisonValue = comparisonAnalytics && activeCompareMetric ? metricValue(comparisonAnalytics, activeCompareMetric) : null;
  const comparisonScale = comparisonAnalytics && analyticsView && activeCompareMetric
    ? comparisonValue && metricValue(analyticsView, activeCompareMetric) ? comparisonValue / Math.max(1, metricValue(analyticsView, activeCompareMetric)) : 1
    : 1;
  const comparisonSeries = comparisonNames.slice(1).map((label, index) => ({
    label,
    scale: comparisonAnalyticsPair[index + 1] && analyticsView && activeCompareMetric
      ? metricValue(comparisonAnalyticsPair[index + 1], activeCompareMetric) / Math.max(1, metricValue(analyticsView, activeCompareMetric))
      : 1,
  }));
  const pageFunnelTabs = useMemo(() => pageSectionFunnelTabs(pageFilterPath, analyticsView), [pageFilterPath, analyticsView]);
  const linkedPageFunnelTabs = useMemo(() => pageSectionFunnelTabs(linkedPagePath ?? null, analyticsView), [linkedPagePath, analyticsView]);
  const liveSourceData: Record<string, Row[]> = analyticsView ? {
    Channel: analyticsView.sources.map((item) => ({ name: item.label, value: item.value })),
    Referrer: analyticsView.referrers.map((item) => ({ name: item.label, value: item.value })),
    Campaign: analyticsView.campaigns.map((item) => ({ name: item.label, value: item.value })),
  } : sourceData;
  const livePathData: Record<string, Row[]> = analyticsView ? {
    Hostname: pathData.Hostname,
    Page: analyticsView.paths.map((item) => ({ name: item.label, value: item.value })),
    "Entry page": analyticsView.entryPages.map((item) => ({ name: item.label, value: item.value })),
    "Exit link": analyticsView.exitLinks.map((item) => ({ name: item.label, value: item.value })),
  } : pathData;
  const liveSystemData: Record<string, Row[]> = analyticsView ? {
    Browser: analyticsView.browsers.map((item) => ({ name: item.label, value: item.value })),
    OS: analyticsView.operatingSystems.map((item) => ({ name: item.label, value: item.value })),
    Device: analyticsView.devices.map((item) => ({ name: item.label, value: item.value })),
  } : systemData;
  const liveLocationData: Record<string, Row[]> = analyticsView ? {
    ...locationData,
    Country: analyticsView.countries.some((item) => countryCodes[item.label])
      ? analyticsView.countries.map((item) => ({ name: item.label, value: item.value }))
      : locationData.Country,
  } : locationData;
  const comparisonContextRows = comparisonRows(liveLocationData.Country ?? [], comparisonPair);
  useEffect(() => {
    setScopeActive(Boolean(scope));
  }, [scope]);
  const scopeFactor = scope && scopeActive ? 0.72 + (scope.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 29) / 100 : 1;
  const applyFilter = (value: string | null) => {
    setFilterRemoving(null);
    setFilters((current) => value && !current.includes(value) ? [...current, value] : current);
    if (typeof window !== "undefined") window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };
  const openSearch = (title: string, rows: Row[], choose?: (row: Row) => void) => {
    const onChoose = choose ?? ((row: Row) => { applyFilter(row.name); setSearchOverlay(null); });
    const picker = { title, rows, onChoose };
    setFilterPicker(picker);
    setSearchOverlay(picker);
  };
  const selectFilter = (title: string, rows: Row[], row: Row) => {
    const onChoose = (next: Row) => {
      const nextPicker = { title, rows, onChoose };
      setFilterPickers((current) => ({ ...current, [next.name]: nextPicker }));
      applyFilter(next.name);
      setSearchOverlay(null);
    };
    const picker = { title, rows, onChoose };
    setFilterPicker(picker);
    setFilterPickers((current) => ({ ...current, [row.name]: picker }));
    applyFilter(row.name);
    if (title === "Page") onSelectPage?.(pageNameFromPath(row.name));
  };
  const clearFilter = (value: string) => {
    setFilterRemoving(value);
    if (value === scope) setScopeActive(false);
    window.setTimeout(() => {
      setFilters((current) => current.filter((item) => item !== value));
      setFilterRemoving((current) => current === value ? null : current);
    }, 180);
  };

  const chooseDashboardPage = (path: string) => {
    onSelectedPagePathChange?.(path);
    setPageOpen(false);
  };
  const toolbarPageProps = mode === "home" && onSelectedPagePathChange
    ? { selectedPagePath, pageOptions, pageOpen, setPageOpen, onPageChange: chooseDashboardPage }
    : {};

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRevision((value) => value + 1);
      setRefreshing(false);
    }, 520);
  };

  useEffect(() => {
    if (!onStickyControlsChange) return;
    onStickyControlsChange(<AnalyticsToolbar {...{ scope: scopeActive ? scope : undefined, periodIndex, setPeriodIndex, granularity, setGranularity, periodOpen, setPeriodOpen, granularityOpen, setGranularityOpen, refreshing, refresh, filters, onFilterClick: (value: string) => { const picker = filterPickers[value] ?? filterPicker; if (picker) setSearchOverlay(picker); }, clearFilter, filterRemoving, ...toolbarPageProps }} />);
  }, [onStickyControlsChange, mode, scope, scopeActive, periodIndex, granularity, periodOpen, granularityOpen, refreshing, filters, filterPicker, filterPickers, filterRemoving, selectedPagePath, pageOpen]);

  return (
    <section className="df-dashboard">
      <div ref={toolbarRef} className={onStickyControlsChange ? "df-home-toolbar-source" : undefined}>
        <AnalyticsToolbar {...{ scope: scopeActive ? scope : undefined, periodIndex, setPeriodIndex, granularity, setGranularity, periodOpen, setPeriodOpen, granularityOpen, setGranularityOpen, refreshing, refresh, filters, onFilterClick: (value: string) => { const picker = filterPickers[value] ?? filterPicker; if (picker) setSearchOverlay(picker); }, clearFilter, filterRemoving, ...toolbarPageProps }} />
      </div>

      {filterKey && !analyticsView ? <div className="df-filter-status" role="status">{filterError ? "Statistiques indisponibles pour ce filtre." : "Chargement des statistiques de la page…"}</div> : <MainAnalytics mode={mode} scope={scope} analytics={analyticsView} metric={metric} setMetric={setMetric} compareMetric={activeCompareMetric} compareLabel={comparisonNames[1] ?? comparisonPair} compareValue={comparisonValue} compareScale={comparisonScale} comparisonSeries={comparisonSeries} compareRelative={compareRelative} onCompareMetricChange={onCompareMetricChange} period={periods[periodIndex]} granularity={granularity} factor={filterFactor * scopeFactor} filter={filterKey} revision={revision} />}

      {(!filterKey || analyticsView) && <div className="df-grid">
        <SourceCard data={liveSourceData} comparisonPair={comparisonPair} comparisonContextRows={comparisonContextRows} comparisonAnalytics={comparisonAnalyticsPair} onFilter={applyFilter} selectedFilter={selectedFilter} onSearch={(tab, rows) => openSearch(tab, rows)} onSelectFilter={selectFilter} />
        <BarsCard tabs={livePathData} initial="Page" total={analyticsView ? compact(analyticsView.pageViews) : "5.8k"} comparisonPair={comparisonPair} comparisonContextRows={comparisonContextRows} comparisonAnalytics={comparisonAnalyticsPair} onFilter={applyFilter} selectedFilter={selectedFilter} onSearch={(tab, rows) => openSearch(tab, rows)} onSelectFilter={selectFilter} />
        {mode === "home" && <PageInsightCards analytics={analyticsView} comparisonPair={comparisonPair} comparisonAnalytics={comparisonAnalyticsPair} onSearch={(title, rows) => openSearch(title, rows)} />}
        <LocationCard data={liveLocationData} comparisonPair={comparisonPair} comparisonContextRows={comparisonContextRows} comparisonAnalytics={comparisonAnalyticsPair} onFilter={applyFilter} selectedFilter={selectedFilter} onSearch={(tab, rows) => openSearch(tab, rows)} onSelectFilter={selectFilter} />
        <BarsCard tabs={liveSystemData} initial="Browser" comparisonPair={comparisonPair} comparisonContextRows={comparisonContextRows} comparisonAnalytics={comparisonAnalyticsPair} onFilter={applyFilter} selectedFilter={selectedFilter} icons onSearch={(tab, rows) => openSearch(tab, rows)} onSelectFilter={selectFilter} />
        {mode === "home" && pageFunnelTabs && <FunnelCard tabs={pageFunnelTabs} initial="Section reach" />}
        {mode !== "home" && <DetailInsightCards mode={mode} onFilter={applyFilter} pageFunnelTabs={linkedPageFunnelTabs} />}
      </div>}
      {searchOverlay && <AnalyticsSearchOverlay title={searchOverlay.title} rows={searchOverlay.rows} onChoose={searchOverlay.onChoose} comparisonPair={comparisonPair} comparisonContextRows={comparisonContextRows} close={() => setSearchOverlay(null)} />}
    </section>
  );
}

function PageHeatmapPanel({ analytics, pagePath }: { analytics?: AnalyticsSummary | null; pagePath: string }) {
  const [heatmapEnabled, setHeatmapEnabled] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const sections = analytics?.sections ?? [];
  const selected = sections.find((section) => section.id === selectedId) ?? sections[0];
  const maxAttention = Math.max(...sections.map((section) => section.averageSeconds), 1);
  const attentionShare = selected && sections.length
    ? Math.round((selected.averageSeconds / Math.max(sections.reduce((sum, section) => sum + section.averageSeconds, 0), 1)) * 100)
    : 0;

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsSinceUpdate((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <article className="df-card df-page-heatmap-card" aria-label="Heatmap d’attention par section">
      <header className="df-page-heatmap-header">
        <div>
          <span className="df-card-kicker">Attention par zone · {pagePath}</span>
          <h2>Heatmap de lecture et d’attention</h2>
          <p>Les zones sont regroupées par section pour visualiser où les visiteurs restent réellement.</p>
        </div>
        <div className="df-page-heatmap-actions">
          <span className="df-live-status"><i />Actualisé il y a {secondsSinceUpdate}s</span>
          <button className={`df-heatmap-toggle ${heatmapEnabled ? "is-active" : ""}`} onClick={() => setHeatmapEnabled((value) => !value)} aria-pressed={heatmapEnabled}>
            <i />{heatmapEnabled ? "Heatmap active" : "Heatmap masquée"}
          </button>
        </div>
      </header>
      <div className={`df-heatmap-layout ${heatmapEnabled ? "is-colored" : ""}`}>
        <div className="df-heatmap-visual" role="img" aria-label="Carte de chaleur des sections">
          {["hero", "problems", "solutions", "results", "metrics", "reviews", "booking", "faq"].map((id, index) => {
            const section = sections.find((item) => item.id === id);
            const intensity = section ? Math.max(0.12, section.averageSeconds / maxAttention) : 0.12;
            return <button key={id} className={`df-heatmap-zone zone-${index} ${selected?.id === id ? "is-selected" : ""}`} style={{ "--heat": heatmapEnabled ? intensity : 0.12 } as React.CSSProperties} onClick={() => setSelectedId(id)} aria-label={`${section?.label ?? id}, ${section?.bounceRate ? Math.round(section.bounceRate) : 0}% de rebond`}>
              <span>{section?.label ?? id}</span>
              <b>{section ? `${Math.round(section.averageSeconds)}s` : "—"}</b>
            </button>;
          })}
          <div className="df-heatmap-legend"><span>Faible attention</span><i /><span>Forte attention</span></div>
        </div>
        <aside className="df-heatmap-details">
          <div className="df-heatmap-details-heading"><span>Section sélectionnée</span><strong>{selected?.label ?? "Aucune donnée"}</strong></div>
          <div className="df-heatmap-detail-grid">
            <span><small>Temps moyen</small><b>{selected ? `${Math.round(selected.averageSeconds)}s` : "—"}</b></span>
            <span><small>Part de l’attention</small><b>{attentionShare}%</b></span>
            <span><small>Taux de rebond</small><b>{selected ? `${Math.round(selected.bounceRate)}%` : "—"}</b></span>
            <span><small>Conversions</small><b>{selected?.conversions ?? "—"}</b></span>
          </div>
          <div className="df-heatmap-compare"><span>Comparer les sections</span>{sections.slice(0, 6).map((section) => <button key={section.id} className={selected?.id === section.id ? "is-active" : ""} onClick={() => setSelectedId(section.id)}><span>{section.label}</span><b>{Math.round(section.bounceRate)}% rebond</b></button>)}</div>
        </aside>
      </div>
    </article>
  );
}

function pageNameFromPath(path: string) {
  const mapped = ({ "/": "Home", "/services": "Services", "/agence": "Agency", "/realisations": "Réalisations" } as Record<string, string>)[path];
  return mapped ?? (path.replace(/^\//, "") || "Home");
}

function pagePathFromScope(scope?: string) {
  return ({ Home: "/", Services: "/services", Agency: "/agence", "Réalisations": "/realisations", "30 min": "/30-min", "SaaS redesign": "/saas-redesign" } as Record<string, string>)[scope ?? ""] ?? "/";
}

function AnalyticsToolbar({ scope, periodIndex, setPeriodIndex, granularity, setGranularity, periodOpen, setPeriodOpen, granularityOpen, setGranularityOpen, refreshing, refresh, filters, onFilterClick, clearFilter, filterRemoving = null, selectedPagePath, pageOptions, pageOpen, setPageOpen, onPageChange, compact = false }: {
  scope?: string;
  periodIndex: number;
  setPeriodIndex: (value: number | ((current: number) => number)) => void;
  granularity: string;
  setGranularity: (value: string) => void;
  periodOpen: boolean;
  setPeriodOpen: (value: boolean | ((current: boolean) => boolean)) => void;
  granularityOpen: boolean;
  setGranularityOpen: (value: boolean | ((current: boolean) => boolean)) => void;
  refreshing: boolean;
  refresh: () => void;
  filters: string[];
  onFilterClick?: (value: string) => void;
  clearFilter?: (value: string) => void;
  filterRemoving?: string | null;
  selectedPagePath?: string;
  pageOptions?: Array<{ name: string; path: string }>;
  pageOpen?: boolean;
  setPageOpen?: (open: boolean | ((current: boolean) => boolean)) => void;
  onPageChange?: (path: string) => void;
  compact?: boolean;
}) {
  return <div className={`df-toolbar ${compact ? "df-toolbar-compact" : ""}`} role="toolbar" aria-label="Analytics controls">
    <button className="df-domain-pill" type="button" aria-label="Domaine ruff.agency"><img className="df-domain-icon" src="/icon.png" alt="" />ruff.agency</button>
    {onPageChange && <div className="df-control-anchor">
      <button className="df-page-select" type="button" aria-label={`Page : ${pageOptions?.find((option) => option.path === selectedPagePath)?.name ?? "All"}`} aria-expanded={pageOpen} onClick={() => setPageOpen?.((open) => !open)}>
        {pageOptions?.find((option) => option.path === selectedPagePath)?.name ?? "All"}
        {!selectedPagePath && <ChevronDown />}
      </button>
      {pageOpen && <div className="df-picker df-page-picker">
        {[{ name: "All", path: "" }, ...(pageOptions ?? [])].map((option) => <button key={option.path} className={option.path === selectedPagePath ? "is-active" : ""} onClick={() => onPageChange(option.path)}>{option.name}</button>)}
      </div>}
    </div>}
    <div className="df-period-group">
      <button className="df-icon-btn" aria-label="Previous period" disabled={periodIndex === 0} onClick={() => setPeriodIndex((value) => Math.max(0, value - 1))}><ChevronLeft /></button>
      <div className="df-control-anchor">
        <button className="df-control" onClick={() => setPeriodOpen((value) => !value)}>{periods[periodIndex]}<ChevronDown /></button>
        {periodOpen && <Picker items={periods} active={periods[periodIndex]} choose={(value) => { setPeriodIndex(periods.indexOf(value)); setPeriodOpen(false); }} />}
      </div>
      <button className="df-icon-btn" aria-label="Next period" disabled={periodIndex === periods.length - 1} onClick={() => setPeriodIndex((value) => Math.min(periods.length - 1, value + 1))}><ChevronRight /></button>
    </div>
    <div className="df-control-anchor">
      <button className="df-control" onClick={() => setGranularityOpen((value) => !value)}>{granularity}<ChevronDown /></button>
      {granularityOpen && <Picker items={granularities} active={granularity} choose={(value) => { setGranularity(value); setGranularityOpen(false); }} />}
    </div>
    <button className={`df-icon-btn ${refreshing ? "is-refreshing" : ""}`} aria-label="Refresh" onClick={refresh}><RefreshCw /></button>
    {(scope || filters.length > 0) && <div className="df-filter-list">
      {scope && <div className={`df-active-filter ${filterRemoving === scope ? "is-removing" : ""}`}><button className="df-active-filter-value" onClick={() => onFilterClick?.(scope)}><Filter />{scope}</button><button className="df-active-filter-clear" aria-label={`Remove ${scope} filter`} onClick={() => clearFilter?.(scope)}><X /></button></div>}
      {filters.map((filter) => <div key={filter} className={`df-active-filter ${filterRemoving === filter ? "is-removing" : ""}`}><button className="df-active-filter-value" onClick={() => onFilterClick?.(filter)}><Filter />{filter}</button><button className="df-active-filter-clear" aria-label={`Remove ${filter} filter`} onClick={() => clearFilter?.(filter)}><X /></button></div>)}
    </div>}
  </div>;
}

function Picker({ items, active, choose }: { items: string[]; active: string; choose: (value: string) => void }) {
  return <div className="df-picker">{items.map((item) => <button key={item} className={item === active ? "is-active" : ""} onClick={() => choose(item)}>{item}</button>)}</div>;
}

function MainAnalytics({ mode, scope, analytics, metric, setMetric, compareMetric = null, compareLabel = null, compareValue = null, compareScale = 1, comparisonSeries = [], compareRelative = false, onCompareMetricChange, period, granularity, factor, filter, revision }: { mode: DashboardMode; scope?: string; analytics?: AnalyticsSummary | null; metric: MetricKey; setMetric: (value: MetricKey) => void; compareMetric?: MetricKey | null; compareLabel?: string | null; compareValue?: number | null; compareScale?: number; comparisonSeries?: Array<{ label: string; scale: number }>; compareRelative?: boolean; onCompareMetricChange?: (value: MetricKey | null) => void; period: string; granularity: string; factor: number; filter: string | null; revision: number }) {
  const periodFactor = filter ? 1 : period === periods[0] ? 1 : period === periods[1] ? 6.8 : 27.2;
  const metrics: Array<{ key: MetricKey; label: string; value: string; change: string; arrow?: string; online?: boolean }> = mode === "home"
    ? [
        { key: "visitors", label: "Visitors", value: compact(Math.round((analytics?.visitors ?? 5783) * periodFactor * factor)), change: "12.4%", arrow: "up" },
        { key: "sessions", label: "Sessions", value: compact(Math.round((analytics?.sessions ?? 4521) * periodFactor * factor)), change: "9.8%", arrow: "up" },
        { key: "views", label: "Page views", value: compact(Math.round((analytics?.pageViews ?? 8124) * periodFactor * factor)), change: "14.2%", arrow: "up" },
        { key: "engaged", label: "Engaged sessions", value: compact(Math.round((analytics?.engagedSessions ?? 3180) * periodFactor * factor)), change: "7.6%", arrow: "up" },
        { key: "session", label: "Average session time", value: analytics ? `${Math.floor(analytics.averageSessionSeconds / 60)}m ${Math.round(analytics.averageSessionSeconds % 60)}s` : factor < 1 ? "54s" : "1m 9s", change: "8.1%", arrow: "up" },
        { key: "scroll", label: "Scroll depth", value: `${Math.round((analytics?.scrollDepth || 64) * factor)}%`, change: "5.3%", arrow: "up" },
        { key: "bounce", label: "Bounce rate", value: `${Math.round(64 + (factor < 1 ? 3 : 0))}%`, change: "4%", arrow: "down-good" },
        { key: "conversion", label: "Conversion rate", value: `${((analytics?.conversionRate ?? 8.7) * factor).toFixed(1)}%`, change: "2.1%", arrow: "up" },
        { key: "cta", label: "CTA clicks", value: compact(Math.round((analytics?.ctaClicks ?? 684) * periodFactor * factor)), change: "11.3%", arrow: "up" },
        { key: "bookings", label: "Booked calls", value: compact(Math.round((analytics?.bookedCalls ?? 180) * periodFactor * factor)), change: "9.2%", arrow: "up" },
        { key: "returning", label: "Returning visitors", value: compact(Math.round((analytics?.returningVisitors ?? 1272) * periodFactor * factor)), change: "8.4%", arrow: "up" },
        { key: "returnRate", label: "Return rate", value: `${(analytics?.returnRate ?? 22).toFixed(1)}%`, change: "4.0%", arrow: "up" },
        { key: "mainSiteVisits", label: "Main site visits", value: compact(Math.round((analytics?.mainSiteVisits ?? 3584) * periodFactor * factor)), change: "6.2%", arrow: "up" },
        { key: "conversions", label: "Conversions", value: compact(Math.round((analytics?.conversions ?? 462) * periodFactor * factor)), change: "7.1%", arrow: "up" },
        { key: "online", label: "Online now", value: String(analytics?.online ?? 1), change: "now", online: true },
        { key: "pagesPerSession", label: "Pages per session", value: ((analytics?.pageViews ?? 8124) / Math.max(1, analytics?.sessions ?? 4521)).toFixed(2), change: "3.2%", arrow: "up" },
        { key: "conversionsPerVisitor", label: "Conversions / visitor", value: `${(((analytics?.conversions ?? 462) / Math.max(1, analytics?.visitors ?? 5783)) * 100).toFixed(1)}%`, change: "1.8%", arrow: "up" },
        { key: "conversionsPerSession", label: "Conversions / session", value: `${(((analytics?.conversions ?? 462) / Math.max(1, analytics?.sessions ?? 4521)) * 100).toFixed(1)}%`, change: "2.4%", arrow: "up" },
        { key: "preConversionTime", label: "Avg. time before conversion", value: analytics ? `${Math.floor(analytics.averageSessionSeconds / 60)}m ${Math.round(analytics.averageSessionSeconds % 60)}s` : "1m 09s", change: "6.5%", arrow: "down-good" },
        { key: "engagementRate", label: "Engagement rate", value: `${(((analytics?.engagedSessions ?? 3180) / Math.max(1, analytics?.sessions ?? 4521)) * 100).toFixed(1)}%`, change: "4.7%", arrow: "up" },
      ]
    : mode === "ad"
    ? [
        { key: "impressions", label: "Impressions", value: compact(Math.round(42840 * periodFactor * factor)), change: "18%", arrow: "up" },
        { key: "clicks", label: "Clicks", value: compact(Math.round(2104 * periodFactor * factor)), change: "12%", arrow: "up" },
        { key: "ctr", label: "CTR", value: `${(4.9 + (factor < 1 ? 0.7 : 0)).toFixed(1)}%`, change: "0.8%", arrow: "up" },
        { key: "views", label: "Landing page views", value: compact(Math.round(3180 * periodFactor * factor)), change: "14%", arrow: "up" },
        { key: "conversion", label: "Conversion rate", value: `${(8.7 + (factor < 1 ? 1.1 : 0)).toFixed(1)}%`, change: "2.1%", arrow: "up" },
        { key: "cpa", label: "Cost / conversion", value: `${Math.round(59 * (factor < 1 ? 0.84 : 1))} €`, change: "7%", arrow: "down-good" },
        { key: "spend", label: "Spend", value: `${compact(Math.round(12400 * periodFactor * factor))} €`, change: "9%", arrow: "up" },
      ]
    : mode === "profile"
      ? [
          { key: "visitors", label: "Visitors", value: compact(Math.round(1214 * periodFactor * factor)), change: "16%", arrow: "up" },
          { key: "share", label: "Audience share", value: `${Math.round(21 * factor)}%`, change: "3.4%", arrow: "up" },
          { key: "conversion", label: "Conversion rate", value: `${(14.8 * factor).toFixed(1)}%`, change: "2.6%", arrow: "up" },
          { key: "bounce", label: "Bounce rate", value: `${Math.round(48 + (factor < 1 ? 4 : 0))}%`, change: "5%", arrow: "down-good" },
          { key: "session", label: "Session time", value: factor < 1 ? "1m 12s" : "2m 18s", change: "21%", arrow: "up" },
        { key: "calls", label: "Booked calls", value: compact(Math.round(180 * periodFactor * factor)), change: "11%", arrow: "up" },
        { key: "sessions", label: "Sessions", value: compact(Math.round(930 * periodFactor * factor)), change: "13%", arrow: "up" },
        { key: "engaged", label: "Engaged sessions", value: compact(Math.round(612 * periodFactor * factor)), change: "10%", arrow: "up" },
        { key: "cta", label: "CTA clicks", value: compact(Math.round(684 * periodFactor * factor)), change: "11%", arrow: "up" },
        ]
      : mode === "page"
        ? [
            { key: "visitors", label: "Visitors", value: compact(Math.round(3137 * periodFactor * factor)), change: "29%", arrow: "up" },
            { key: "views", label: "Page views", value: compact(Math.round(4682 * periodFactor * factor)), change: "18%", arrow: "up" },
            { key: "conversion", label: "Conversion rate", value: `${(8.7 * factor).toFixed(1)}%`, change: "2.1%", arrow: "up" },
            { key: "bounce", label: "Bounce rate", value: `${Math.round(60 + (factor < 1 ? 5 : 0))}%`, change: "3%", arrow: "down-good" },
            { key: "session", label: "Session time", value: factor < 1 ? "52s" : "1m 46s", change: "21%", arrow: "up" },
            { key: "calls", label: "Conversions", value: compact(Math.round(274 * periodFactor * factor)), change: "8%", arrow: "up" },
            { key: "sessions", label: "Sessions", value: compact(Math.round(2460 * periodFactor * factor)), change: "16%", arrow: "up" },
            { key: "scroll", label: "Scroll depth", value: `${Math.round(61 * factor)}%`, change: "6%", arrow: "up" },
            { key: "cta", label: "CTA clicks", value: compact(Math.round(442 * periodFactor * factor)), change: "13%", arrow: "up" },
          ]
        : [
            { key: "visitors", label: "Visitors", value: compact(Math.round(5783 * periodFactor * factor)), change: "20%", arrow: "up" },
            { key: "views", label: "Page views", value: compact(Math.round(8124 * periodFactor * factor)), change: "14%", arrow: "up" },
            { key: "conversion", label: "Conversion rate", value: `${(8.7 * factor).toFixed(1)}%`, change: "2.1%", arrow: "up" },
            { key: "bounce", label: "Bounce rate", value: `${Math.round(64 + (factor < 1 ? 3 : 0))}%`, change: "4%", arrow: "down-good" },
            { key: "session", label: "Session time", value: factor < 1 ? "54s" : "1m 9s", change: "1%", arrow: "down-bad" },
            { key: "calls", label: "Online", value: String(Math.round(55 * factor)), change: "now", online: true },
          ];
  const compareItem = compareMetric && !compareLabel ? metrics.find((item) => item.key === compareMetric) : null;
  return (
    <article className="df-card df-main-card">
      <div className="df-metrics">
        {metrics.map((item) => {
          return <button key={item.key} className={`df-metric is-clickable ${metric !== item.key ? "is-inactive" : ""}`} onClick={() => { if (compareMetric === item.key) onCompareMetricChange?.(metric); setMetric(item.key); }}>
            <span className="df-metric-label">{item.label}{item.online && <i className="df-online-dot" />}</span>
            <strong>{item.value}</strong>
            <small>{item.change}{item.arrow && <i className={`df-delta ${item.arrow}`} />}</small>
          </button>;
        })}
      {compareItem && <div className="df-metric df-metric-compare">
          <span className="df-metric-label">{compareItem.label}</span>
          <strong>{compareItem.value}</strong>
          <small>{compareItem.change}{compareItem.arrow && <i className={`df-delta ${compareItem.arrow}`} />}</small>
        </div>}
      {compareLabel && compareValue !== null && <div className="df-metric df-metric-compare">
        <span className="df-metric-label">{compareLabel}</span>
        <strong>{formatChartValue(compareMetric ?? metric, compareValue)}</strong>
        <small>{compareRelative && compareMetric ? `${compareValue >= (analytics ? metricValue(analytics, compareMetric) : 0) ? "+" : ""}${(((compareValue - (analytics ? metricValue(analytics, compareMetric) : 0)) / Math.max(1, analytics ? metricValue(analytics, compareMetric) : 1)) * 100).toFixed(1)}%` : "Comparaison"}</small>
      </div>}
      </div>
      <InteractiveChart metric={metric} compareMetric={compareMetric} compareLabel={compareLabel} compareScale={compareScale} comparisonSeries={comparisonSeries} compareRelative={compareRelative} scope={scope} period={period} granularity={granularity} factor={factor} filter={filter} revision={revision} />
    </article>
  );
}

function PageInsightCards({ analytics, comparisonPair, comparisonAnalytics = [], onSearch }: { analytics?: AnalyticsSummary | null; comparisonPair?: string | null; comparisonAnalytics?: AnalyticsSummary[]; onSearch?: (title: string, rows: Row[]) => void }) {
  const sections = analytics?.sections ?? [];
  const scrollRows = Object.values((analytics?.scrollZones ?? []).reduce<Record<string, Row>>((result, item) => {
    const label = `${Math.round(item.zone)}% scroll`;
    result[label] = { name: label, value: (result[label]?.value ?? 0) + item.value };
    return result;
  }, {}));
  const cards = [
    { title: "Taux de rebond par section", rows: sections.map((item) => ({ name: item.label, value: Math.round(item.bounceRate) })).sort((a, b) => b.value - a.value), suffix: "%", tone: "primary" as const },
    { title: "Conversions par section", rows: sections.map((item) => ({ name: item.label, value: item.conversions })).sort((a, b) => b.value - a.value), tone: "primary" as const },
    { title: "Profondeur de scroll par zone", rows: scrollRows.sort((a, b) => b.value - a.value), tone: "primary" as const },
  ];

  return <><SectionOverviewCard analytics={analytics} comparisonPair={comparisonPair} comparisonAnalytics={comparisonAnalytics} onSearch={onSearch} />{cards.map((card) => <PageInsightCard key={card.title} {...card} comparisonPair={comparisonPair} comparisonAnalytics={comparisonAnalytics} onSearch={onSearch} />)}</>;
}

function SectionOverviewCard({ analytics, comparisonPair, comparisonAnalytics = [], onSearch }: { analytics?: AnalyticsSummary | null; comparisonPair?: string | null; comparisonAnalytics?: AnalyticsSummary[]; onSearch?: (title: string, rows: Row[]) => void }) {
  const [metric, setMetric] = useState<"views" | "time">("views");
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => { setActiveIndex(0); }, [comparisonPair]);
  const summary = comparisonAnalytics[activeIndex] ?? analytics;
  const rows = summary?.sections.map((item) => ({ name: item.label, value: metric === "views" ? item.views : Math.round(item.averageSeconds) })).sort((a, b) => b.value - a.value) ?? [];
  const title = metric === "views" ? "Sections les plus vues" : "Temps moyen par section";
  return <article className="df-card df-page-insight-card df-section-overview-card">
    <CardHead><Tabs items={["Sections les plus vues", "Temps moyen par section"]} active={title} onChange={(next) => setMetric(next === "Temps moyen par section" ? "time" : "views")} /></CardHead>
    <div className="df-card-body"><DatafastPie rows={rows.length ? rows : [{ name: "Aucune donnée", value: 0 }]} selectedFilter={null} onSelect={() => undefined} tone={activeIndex > 0 ? "compare" : "primary"} caption={metric === "views" ? "visites" : "secondes"} valueSuffix={metric === "time" ? "s" : ""} /></div>
    <button className="df-details" onClick={() => onSearch?.(title, rows)}>Details</button>
    {comparisonPair && comparisonPair.split(/\s+avec\s+/i).filter(Boolean).length >= 2 && comparisonAnalytics.length >= 2 && <ComparisonTabs comparisonPair={comparisonPair} activeIndex={activeIndex} onChange={setActiveIndex} />}
  </article>;
}

function PageInsightCard({ title, rows, suffix = "", visual = "list", comparisonPair, comparisonAnalytics = [], onSearch }: { title: string; rows: Row[]; suffix?: string; visual?: "list" | "pie"; comparisonPair?: string | null; comparisonAnalytics?: AnalyticsSummary[]; onSearch?: (title: string, rows: Row[]) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => setActiveIndex(0), [comparisonPair]);
  const comparisonNames = comparisonPair?.split(/\s+avec\s+/i).map((value) => value.trim()).filter(Boolean) ?? [];
  const comparisonSummary = comparisonAnalytics[activeIndex];
  const comparisonRows = comparisonSummary ? (() => {
    if (title === "Sections les plus vues") return comparisonSummary.sections.map((item) => ({ name: item.label, value: item.views })).sort((a, b) => b.value - a.value);
    if (title === "Temps moyen par section") return comparisonSummary.sections.map((item) => ({ name: item.label, value: Math.round(item.averageSeconds) })).sort((a, b) => b.value - a.value);
    if (title === "Taux de rebond par section") return comparisonSummary.sections.map((item) => ({ name: item.label, value: Math.round(item.bounceRate) })).sort((a, b) => b.value - a.value);
    if (title === "Conversions par section") return comparisonSummary.sections.map((item) => ({ name: item.label, value: item.conversions })).sort((a, b) => b.value - a.value);
    return Object.values(comparisonSummary.scrollZones.reduce<Record<string, Row>>((result, item) => {
      const label = `${Math.round(item.zone)}% scroll`;
      result[label] = { name: label, value: (result[label]?.value ?? 0) + item.value };
      return result;
    }, {})).sort((a, b) => b.value - a.value);
  })() : rows;
  const visibleRows = comparisonSummary ? comparisonRows : rows;
  return <article className="df-card df-page-insight-card">
    <CardHead><strong className="df-page-insight-title">{title}</strong></CardHead>
    <div className="df-card-body">{visual === "pie" ? <DatafastPie rows={visibleRows.length ? visibleRows : [{ name: "Aucune donnée", value: 0 }]} selectedFilter={null} onSelect={() => undefined} tone={activeIndex > 0 ? "compare" : "primary"} /> : <BarList rows={visibleRows.length ? visibleRows : [{ name: "Aucune donnée", value: 0 }]} onSelect={() => undefined} action="inspect" seriesTone={activeIndex > 0 ? "compare" : "primary"} valueSuffix={suffix} />}</div>
    <button className="df-details" onClick={() => onSearch?.(title, visibleRows)}>Details</button>
    {comparisonPair && comparisonNames.length >= 2 && comparisonAnalytics.length >= 2 && <ComparisonTabs comparisonPair={comparisonPair} activeIndex={activeIndex} onChange={setActiveIndex} />}
  </article>;
}

function InteractiveChart({ metric, compareMetric, compareLabel, compareScale = 1, comparisonSeries = [], compareRelative, scope, period, granularity, factor, filter, revision }: { metric: MetricKey; compareMetric: MetricKey | null; compareLabel?: string | null; compareScale?: number; comparisonSeries?: Array<{ label: string; scale: number }>; compareRelative: boolean; scope?: string; period: string; granularity: string; factor: number; filter: string | null; revision: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [selection, setSelection] = useState<[number, number] | null>(null);
  const [viewWidth, setViewWidth] = useState(1040);
  useEffect(() => {
    if (!wrapRef.current) return;
    const measure = () => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) setViewWidth(Math.max(720, (rect.width / Math.max(1, rect.height)) * 390));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);
  const target = granularity === "Weekly" ? 8 : granularity === "Daily" ? 14 : 25;
  const filterSeed = (filter ?? scope ?? "all").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const makeValues = (chartMetric: MetricKey, scale = 1) => Array.from({ length: target }, (_, i) => {
    const raw = baseSeries[chartMetric];
    const source = raw[Math.round((i / Math.max(1, target - 1)) * (raw.length - 1))];
    const jitter = revision ? ((i * 7 + revision * 3) % 11) - 5 : 0;
    const compareSeed = compareLabel ? compareLabel.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) : 0;
    const shape = filter || scope || compareLabel ? 0.82 + Math.sin((i + (filterSeed + compareSeed) % 9) * 0.76) * 0.18 + Math.cos((i * 1.7 + filterSeed + compareSeed) * 0.31) * 0.1 : 1;
    return Math.max(0.1, (source + jitter) * factor * shape * scale);
  });
  const values = useMemo(() => makeValues(metric), [metric, target, factor, filter, filterSeed, scope, revision]);
  const compareValues = useMemo(() => compareMetric ? makeValues(compareMetric, compareScale) : null, [compareMetric, compareLabel, compareScale, target, factor, filter, filterSeed, scope, revision]);
  const seriesColors = comparisonChartColors(compareValues ? Math.max(2, comparisonSeries.length + 1) : 1);
  const compareColor = seriesColors[1] ?? comparisonPalette[5];
  const extraCompareSeries = comparisonSeries.slice(1).map((series, seriesIndex) => ({ ...series, color: seriesColors[seriesIndex + 2] ?? comparisonPalette[(seriesIndex + 2) % comparisonPalette.length], values: makeValues(metric, series.scale) }));
  const percentageMetric = ["bounce", "conversion", "share", "ctr", "scroll"].includes(metric);
  const maxValue = Math.max(...values, ...(compareValues ?? []), ...extraCompareSeries.flatMap((series) => series.values));
  const max = percentageMetric ? Math.max(10, Math.ceil(maxValue / 10) * 10) : Math.max(10, Math.ceil(maxValue / 100) * 100);
  const left = 46, right = 14, top = 20, bottom = 34, width = viewWidth, height = 390;
  const innerW = width - left - right, innerH = height - top - bottom;
  const points = values.map((value, i) => [left + (i / Math.max(1, values.length - 1)) * innerW, top + innerH - (value / max) * innerH] as [number, number]);
  const line = smoothPath(points);
  const solidLine = smoothPath(points.slice(0, -1));
  const area = `${line} L${points.at(-1)?.[0]},${top + innerH} L${left},${top + innerH} Z`;
  const labels = granularity === "Weekly" ? ["W1", "W2", "W3", "W4", "W5"] : granularity === "Daily" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["9am", "1pm", "5pm", "9pm", "1am", "5am", "9am"];
  const yLabels = [max, Math.round(max * 0.6), Math.round(max * 0.3), 0];
  const onMove = (event: React.PointerEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
    const index = Math.max(0, Math.min(values.length - 1, Math.round(((x - left) / innerW) * (values.length - 1))));
    setHover(index);
    if (dragStart !== null) setSelection([Math.min(dragStart, index), Math.max(dragStart, index)]);
  };
  const onDown = (event: React.PointerEvent<SVGRectElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
    const index = Math.max(0, Math.min(values.length - 1, Math.round(((x - left) / innerW) * (values.length - 1))));
    setDragStart(index);
    setSelection([index, index]);
    setHover(index);
  };
  const onUp = (event: React.PointerEvent<SVGRectElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragStart(null);
  };
  const selectedRange = selection && selection[1] > selection[0] ? selection : null;
  const formatDelta = (from: number, to: number) => `${to - from >= 0 ? "+" : ""}${((to - from) / Math.max(0.1, from) * 100).toFixed(1)}%`;
  const labelForIndex = (index: number) => labels[Math.min(labels.length - 1, Math.round((index / Math.max(1, values.length - 1)) * (labels.length - 1)))];
  const primaryDisplay = (index: number) => compareRelative && compareValues ? "100%" : formatChartValue(metric, values[index]);
  const compareDisplay = (index: number) => compareRelative && compareValues ? formatDelta(values[index], compareValues[index]) : formatChartValue(compareMetric!, compareValues![index]);
  const rangeSummary = selectedRange ? {
    start: selectedRange[0],
    end: selectedRange[1],
    primary: formatDelta(values[selectedRange[0]], values[selectedRange[1]]),
    compare: compareValues ? formatDelta(compareValues[selectedRange[0]], compareValues[selectedRange[1]]) : null,
  } : null;
  return <div className="df-chart-wrap" ref={wrapRef}>
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id={`df-gradient-${metric}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8DCDFF" stopOpacity=".5" /><stop offset="45%" stopColor="#8DCDFF" stopOpacity=".08" /><stop offset="100%" stopColor="#8DCDFF" stopOpacity="0" /></linearGradient>{compareValues && <linearGradient id={`df-gradient-compare-${compareMetric}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={compareColor} stopOpacity=".34" /><stop offset="45%" stopColor={compareColor} stopOpacity=".08" /><stop offset="100%" stopColor={compareColor} stopOpacity="0" /></linearGradient>}</defs>
      {yLabels.map((label, index) => { const y = top + (index / (yLabels.length - 1)) * innerH; return <g key={label}><line x1={left} x2={width - right} y1={y} y2={y} className="df-grid-line" /><text x="8" y={y + 4}>{label}</text></g>; })}
      <path d={area} fill={`url(#df-gradient-${metric})`} />
      {compareValues && <path d={`${smoothPath(compareValues.map((value, i) => [left + (i / Math.max(1, compareValues.length - 1)) * innerW, top + innerH - (value / max) * innerH] as [number, number]))} L${left + innerW},${top + innerH} L${left},${top + innerH} Z`} fill={`url(#df-gradient-compare-${compareMetric})`} />}
      <path d={solidLine} className="df-chart-line" />
      {compareValues && <path d={smoothPath(compareValues.map((value, i) => [left + (i / Math.max(1, compareValues.length - 1)) * innerW, top + innerH - (value / max) * innerH] as [number, number]))} className="df-chart-line is-compare" style={{ stroke: compareColor }} />}
      {extraCompareSeries.map((series, seriesIndex) => <path key={series.label} d={smoothPath(series.values.map((value, i) => [left + (i / Math.max(1, series.values.length - 1)) * innerW, top + innerH - (value / max) * innerH] as [number, number]))} className={`df-chart-line df-chart-line-extra extra-${seriesIndex}`} style={{ stroke: series.color }} />)}
      <path d={`${smoothPath(points.slice(-2))}`} className="df-chart-line is-dashed" />
      {hover !== null && <g><rect x={Math.max(left, points[hover][0] - innerW / values.length / 2)} y={top} width={innerW / values.length} height={innerH} className="df-hover-band" /><line x1={points[hover][0]} x2={points[hover][0]} y1={top} y2={top + innerH} className="df-hover-line" /><circle cx={points[hover][0]} cy={points[hover][1]} r="5" className="df-hover-dot" />{compareValues && <circle cx={points[hover][0]} cy={top + innerH - (compareValues[hover] / max) * innerH} r="5" className="df-hover-dot is-compare" style={{ fill: compareColor }} />}{extraCompareSeries.map((series, seriesIndex) => <circle key={series.label} cx={points[hover][0]} cy={top + innerH - (series.values[hover] / max) * innerH} r="5" className={`df-hover-dot extra-${seriesIndex}`} style={{ fill: series.color }} />)}</g>}
      {selectedRange && <rect x={points[selectedRange[0]][0]} y={top} width={points[selectedRange[1]][0] - points[selectedRange[0]][0]} height={innerH} className="df-selection-band" />}
      <rect x={left} y={top} width={innerW} height={innerH} fill="transparent" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={() => { if (dragStart === null) setHover(null); }} />
      {labels.map((label, index) => <text key={`${label}-${index}`} x={left + (index / (labels.length - 1)) * innerW} y={height - 8} textAnchor="middle">{label}</text>)}
    </svg>
    {hover !== null && <div className="df-chart-tooltip" style={{ left: `${Math.min(89, Math.max(11, (points[hover][0] / width) * 100))}%`, top: `${Math.max(22, (points[hover][1] / height) * 100)}%` }}><b>{labelForIndex(hover)} · {period}</b><span><i />{metricLabel(metric)}<strong>{primaryDisplay(hover)}</strong></span>{compareValues && <span className="df-tooltip-compare"><i style={{ background: compareColor }} />{compareLabel ?? metricLabel(compareMetric!)}<strong>{compareDisplay(hover)}</strong></span>}{extraCompareSeries.map((series) => <span key={series.label} className="df-tooltip-compare df-tooltip-extra"><i style={{ background: series.color }} />{series.label}<strong>{compareRelative ? formatDelta(values[hover], series.values[hover]) : formatChartValue(metric, series.values[hover])}</strong></span>)}{rangeSummary && <div className="df-tooltip-range"><b>Zone sélectionnée</b><span className="df-tooltip-range-period">{labelForIndex(rangeSummary.start)} <em>→</em> {labelForIndex(rangeSummary.end)}</span><span><i className="df-tooltip-primary-dot" />{metricLabel(metric)}<strong>{rangeSummary.primary}</strong></span>{rangeSummary.compare !== null && <span className="df-tooltip-compare"><i style={{ background: compareColor }} />{compareLabel ?? metricLabel(compareMetric!)}<strong>{rangeSummary.compare}</strong></span>}{extraCompareSeries.map((series) => <span key={series.label} className="df-tooltip-compare df-tooltip-extra"><i style={{ background: series.color }} />{series.label}<strong>{formatDelta(series.values[rangeSummary.start], series.values[rangeSummary.end])}</strong></span>)}</div>}</div>}
  </div>;
}

function metricValue(analytics: AnalyticsSummary, metric: MetricKey) {
  const values: Partial<Record<MetricKey, number>> = {
    visitors: analytics.visitors,
    sessions: analytics.sessions,
    views: analytics.pageViews,
    engaged: analytics.engagedSessions,
    scroll: analytics.scrollDepth,
    cta: analytics.ctaClicks,
    bookings: analytics.bookedCalls,
    bounce: analytics.bounceRate,
    conversion: analytics.conversionRate,
    calls: analytics.conversions,
    session: analytics.averageSessionSeconds,
    returning: analytics.returningVisitors,
    returnRate: analytics.returnRate,
    mainSiteVisits: analytics.mainSiteVisits,
    conversions: analytics.conversions,
    online: analytics.online,
    pagesPerSession: analytics.pageViews / Math.max(1, analytics.sessions),
    conversionsPerVisitor: (analytics.conversions / Math.max(1, analytics.visitors)) * 100,
    conversionsPerSession: (analytics.conversions / Math.max(1, analytics.sessions)) * 100,
    preConversionTime: analytics.averageSessionSeconds,
    engagementRate: (analytics.engagedSessions / Math.max(1, analytics.sessions)) * 100,
  };
  return values[metric] ?? analytics.visitors;
}

function metricLabel(metric: MetricKey) {
  return ({ visitors: "Visitors", views: "Page views", sessions: "Sessions", engaged: "Engaged sessions", scroll: "Scroll depth", cta: "CTA clicks", bookings: "Booked calls", bounce: "Bounce rate", session: "Session time", conversion: "Conversion rate", share: "Audience share", calls: "Conversions", impressions: "Impressions", clicks: "Clicks", ctr: "CTR", cpa: "Cost / conversion", spend: "Spend", returning: "Returning visitors", returnRate: "Return rate", mainSiteVisits: "Main site visits", conversions: "Conversions", online: "Online now", pagesPerSession: "Pages per session", conversionsPerVisitor: "Conversions / visitor", conversionsPerSession: "Conversions / session", preConversionTime: "Avg. time before conversion", engagementRate: "Engagement rate" } as Record<MetricKey, string>)[metric];
}

function formatChartValue(metric: MetricKey, value: number) {
  if (["bounce", "conversion", "share", "ctr", "scroll", "returnRate", "conversionsPerVisitor", "conversionsPerSession", "engagementRate"].includes(metric)) return `${value.toFixed(1)}%`;
  if (metric === "session" || metric === "preConversionTime") return `${Math.floor(value / 60)}m ${Math.round(value % 60)}s`;
  if (metric === "pagesPerSession") return value.toFixed(2);
  if (metric === "cpa" || metric === "spend") return `${compact(Math.round(value))} €`;
  return compact(Math.round(value));
}

function Tabs({ items, active, onChange, ariaLabel = "Dashboard tabs" }: { items: string[]; active: string; onChange: (value: string) => void; ariaLabel?: string }) {
  const activateWithKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const key = event.key;
    const nextIndex = key === "ArrowRight" ? (index + 1) % items.length : key === "ArrowLeft" ? (index - 1 + items.length) % items.length : key === "Home" ? 0 : key === "End" ? items.length - 1 : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    onChange(items[nextIndex]);
    window.requestAnimationFrame(() => document.getElementById(`dashboard-tab-${items[nextIndex]}`)?.focus());
  };
  return <div className="dashboard-tabs" role="tablist" aria-label={ariaLabel} data-dashboard-tabs>
    {items.map((item, index) => <button key={item} id={`dashboard-tab-${item}`} className="dashboard-tab" type="button" role="tab" aria-selected={item === active} tabIndex={item === active ? 0 : -1} onClick={() => onChange(item)} onKeyDown={(event) => activateWithKeyboard(event, index)}>
      <span className="dashboard-tab-active-indicator" aria-hidden="true" />
      <span className="dashboard-tab-label">{item}</span>
    </button>)}
  </div>;
}

function piePoint(radius: number, angle: number) {
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function pieArcPath(innerRadius: number, outerRadius: number, start: number, end: number) {
  const outerStart = piePoint(outerRadius, start);
  const outerEnd = piePoint(outerRadius, end);
  const innerEnd = piePoint(innerRadius, end);
  const innerStart = piePoint(innerRadius, start);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M${outerStart.x.toFixed(2)},${outerStart.y.toFixed(2)} A${outerRadius},${outerRadius} 0 ${largeArc} 1 ${outerEnd.x.toFixed(2)},${outerEnd.y.toFixed(2)} L${innerEnd.x.toFixed(2)},${innerEnd.y.toFixed(2)} A${innerRadius},${innerRadius} 0 ${largeArc} 0 ${innerStart.x.toFixed(2)},${innerStart.y.toFixed(2)}Z`;
}

function DatafastPie({ rows, selectedFilter, onSelect, tone = "primary", caption = "visits", valueSuffix = "" }: { rows: Row[]; selectedFilter: string | null; onSelect: (row: Row) => void; tone?: "primary" | "compare"; caption?: string; valueSuffix?: string }) {
  const [hovered, setHovered] = useState<Row | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const pieColors = tone === "compare" ? ["#F6DF8E", "#F6DF8E", "#F6DF8E", "#F6DF8E", "#F6DF8E"] : datafastPieColors;
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  const center = { x: 190, y: 192 };
  const outerRadius = 116;
  const innerRadius = 69;
  let cursor = -Math.PI / 2;
  const slices = rows.map((row, index) => {
    const span = (row.value / total) * Math.PI * 2;
    const gap = Math.min(0.045, span * 0.35);
    const slice = { row, index, start: cursor + gap / 2, end: cursor + span - gap / 2, mid: cursor + span / 2 };
    cursor += span;
    return slice;
  });
  const rawLabels = slices.map((slice, index) => {
    const right = Math.cos(slice.mid) >= 0;
    const labelPoint = piePoint(outerRadius + 13, slice.mid);
    const labelY = Math.max(30, Math.min(354, center.y + labelPoint.y));
    const elbowX = center.x + labelPoint.x + (right ? 15 : -15);
    const endX = elbowX + (right ? 30 : -30);
    return { ...slice, right, labelY, elbowX, endX, color: datafastPieColors[index % datafastPieColors.length] };
  });
  const distributeLabels = (items: typeof rawLabels) => {
    const sorted = [...items].sort((a, b) => a.labelY - b.labelY).map((item) => ({ ...item }));
    sorted.forEach((item, index) => {
      item.labelY = index === 0 ? Math.max(38, item.labelY) : Math.max(item.labelY, sorted[index - 1].labelY + 34);
    });
    const overflow = sorted.length ? sorted[sorted.length - 1].labelY - 346 : 0;
    if (overflow > 0) sorted.forEach((item) => { item.labelY -= overflow; });
    return sorted;
  };
  const labels = [...distributeLabels(rawLabels.filter((label) => label.right)), ...distributeLabels(rawLabels.filter((label) => !label.right))];
  const onMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };
  return <div className="df-datafast-pie">
    <svg viewBox="0 0 536 384" role="img" aria-label="Channel par source" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
      <g transform={`translate(${center.x},${center.y})`}>
        {slices.map((slice) => {
          const isActive = hovered?.name === slice.row.name || selectedFilter === slice.row.name;
          const isMuted = Boolean(hovered) && !isActive;
          return <path
            key={slice.row.name}
            d={pieArcPath(innerRadius, outerRadius, slice.start, slice.end)}
            fill={pieColors[slice.index % pieColors.length]}
            stroke="#d2e6f4"
            strokeWidth="1"
            className={`df-datafast-pie-arc ${isMuted ? "is-muted" : ""} ${isActive ? "is-active" : ""}`}
            onPointerEnter={() => setHovered(slice.row)}
            onClick={() => onSelect(slice.row)}
          />;
        })}
        <circle r={innerRadius - 1} fill="#fff" />
      </g>
      {labels.map((label) => {
        const isActive = hovered?.name === label.row.name || selectedFilter === label.row.name;
        const isMuted = Boolean(hovered) && !isActive;
        const iconDomain = label.row.name.includes(".") ? label.row.name.replace(/^www\./, "") : "";
        return <g key={`label-${label.row.name}`} className={`df-datafast-pie-label ${isMuted ? "is-muted" : ""} ${isActive ? "is-active" : ""}`}>
          <path d={`M${(center.x + piePoint(outerRadius + 2, label.mid).x).toFixed(2)},${(center.y + piePoint(outerRadius + 2, label.mid).y).toFixed(2)} L${label.elbowX.toFixed(2)},${label.labelY.toFixed(2)} L${label.endX.toFixed(2)},${label.labelY.toFixed(2)}`} />
          {iconDomain && <image href={`https://icons.duckduckgo.com/ip3/${iconDomain}.ico`} x={label.right ? label.endX + 6 : label.endX - 22} y={label.labelY - 8} width="16" height="16" preserveAspectRatio="xMidYMid meet" />}
          <text x={label.right ? label.endX + (iconDomain ? 28 : 7) : label.endX - (iconDomain ? 28 : 7)} y={label.labelY - 2} textAnchor={label.right ? "start" : "end"}>{label.row.name}</text>
          <text className="df-datafast-pie-value" x={label.right ? label.endX + (iconDomain ? 28 : 7) : label.endX - (iconDomain ? 28 : 7)} y={label.labelY + 13} textAnchor={label.right ? "start" : "end"}>{compact(label.row.value)}{valueSuffix} · {((label.row.value / total) * 100).toFixed(1)}%</text>
        </g>;
      })}
      <text className="df-datafast-pie-total" x={center.x} y={center.y - 2} textAnchor="middle">{compact(total)}</text>
      <text className="df-datafast-pie-caption" x={center.x} y={center.y + 17} textAnchor="middle">{caption}</text>
    </svg>
    {hovered && <div className="df-datafast-pie-tooltip" style={{ left: `${Math.min(80, Math.max(5, (pointer.x / 536) * 100))}%`, top: `${Math.min(86, Math.max(8, (pointer.y / 384) * 100))}%` }}><span>{hovered.name}</span><b>{compact(hovered.value)} · {((hovered.value / total) * 100).toFixed(1)}%</b></div>}
  </div>;
}

function comparisonRows(rows: Row[], comparisonPair?: string | null) {
  const names = comparisonPair?.split(/\s+avec\s+/i).map((value) => value.trim()).filter(Boolean) ?? [];
  return names.map((name) => {
    const normalized = name.toLowerCase();
    const aliases = normalized === "états-unis" || normalized === "etats-unis" ? ["états-unis", "etats-unis", "united states", "usa", "us"] : [normalized];
    return rows.find((row) => aliases.includes(row.name.toLowerCase())) ?? null;
  });
}

function comparisonSummaryFallbackRows(summaries: AnalyticsSummary[], comparisonPair: string | null | undefined, key: keyof AnalyticsSummary) {
  const names = comparisonPair?.split(/\s+avec\s+/i).map((value) => value.trim()).filter(Boolean) ?? [];
  return names.map((name, index) => {
    const collection = summaries[index]?.[key];
    if (!Array.isArray(collection)) return null;
    const found = (collection as Array<{ label: string; value: number }>).find((row) => row.label.toLowerCase() === name.toLowerCase());
    if (found) return { name, value: found.value };
    const summary = summaries[index];
    const value = key === "paths" || key === "entryPages" || key === "exitLinks" ? summary.pageViews : summary.visitors;
    return { name, value };
  });
}

function ComparisonTabs({ comparisonPair, activeIndex, onChange }: { comparisonPair?: string | null; activeIndex: number; onChange: (index: number) => void }) {
  const names = comparisonPair?.split(/\s+avec\s+/i).map((value) => value.trim()).filter(Boolean) ?? [];
  if (names.length < 2) return null;
  return <Tabs items={names} active={names[activeIndex] ?? names[0]} onChange={(name) => onChange(names.indexOf(name))} ariaLabel="Choisir la comparaison" />;
}

function comparisonDataRows(summaries: AnalyticsSummary[], index: number, key: keyof AnalyticsSummary, fallback: Row[]) {
  if (key === "countries") {
    const names = (fallback.length >= 2 ? fallback : []).map((row) => row.name);
    const summary = summaries[index];
    if (summary && names.length >= 2) {
      return names.map((name) => {
        const normalized = name.toLocaleLowerCase("fr-FR").replace("états-unis", "united states");
        const found = summary.countries.find((row) => row.label.toLocaleLowerCase() === normalized || (normalized === "united states" && row.label.toLocaleLowerCase() === "etats-unis"));
        return { name, value: found?.value ?? summary.visitors };
      });
    }
  }
  const collection = summaries[index]?.[key];
  if (Array.isArray(collection) && collection.length > 0) return (collection as Array<{ label: string; value: number }>).map((row) => ({ name: row.label, value: row.value }));
  const factor = index === 0 ? 0.82 : 1.14;
  return fallback.map((row, rowIndex) => ({ ...row, value: Math.max(1, Math.round(row.value * (factor + rowIndex * 0.015))) }));
}

function comparisonRowsForTab(rows: Row[], comparisonPair?: string | null, comparisonAnalytics: AnalyticsSummary[] = [], activeIndex = 0, fallbackKey?: keyof AnalyticsSummary) {
  if (!comparisonPair || !fallbackKey || comparisonAnalytics.length < 2) return rows;
  const names = comparisonPair.split(/\s+avec\s+/i).map((value) => value.trim()).filter(Boolean);
  const fallback = fallbackKey === "countries" && names.length >= 2 ? names.map((name) => ({ name, value: 0 })) : rows;
  return comparisonDataRows(comparisonAnalytics, activeIndex, fallbackKey, fallback);
}

function ComparisonSummary({ rows, comparisonPair, comparisonAnalytics = [], comparisonContextRows = [], fallbackKey }: { rows: Row[]; comparisonPair?: string | null; comparisonAnalytics?: AnalyticsSummary[]; comparisonContextRows?: Array<Row | null>; fallbackKey?: keyof AnalyticsSummary }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const selected = comparisonRows(rows, comparisonPair);
  const fallback = selected.some((row) => !row) && fallbackKey ? comparisonSummaryFallbackRows(comparisonAnalytics, comparisonPair, fallbackKey) : [];
  const resolved = selected.map((row, index) => row ?? fallback[index] ?? comparisonContextRows[index] ?? null);
  if (resolved.length < 2 || resolved.some((row) => !row)) return null;
  const resolvedRows = resolved as Row[];
  const active = resolvedRows[Math.min(activeIndex, resolvedRows.length - 1)];
  return <div className="df-card-comparison" aria-label={`Comparaison de ${resolvedRows.map((row) => row.name).join(", ")}`}>
    <div className="df-comparison-tabs" role="tablist" aria-label="Choisir la comparaison">
      {resolvedRows.map((row, index) => <button key={row.name} type="button" role="tab" aria-selected={activeIndex === index} className={`df-comparison-tab ${activeIndex === index ? "is-active" : ""}`} onClick={() => setActiveIndex(index)}>
        <i className={`df-comparison-dot ${index === 0 ? "is-first" : "is-second"}`} />
        <span>{row.name}</span>
      </button>)}
    </div>
    <div className="df-comparison-selected" role="tabpanel">
      <i className={`df-comparison-dot ${activeIndex === 0 ? "is-first" : "is-second"}`} />
      <span>{active.name}</span>
      <b>{compact(active.value)}</b>
    </div>
  </div>;
}

function SourceCard({ data = sourceData, comparisonPair, comparisonContextRows = [], comparisonAnalytics = [], onFilter, selectedFilter, onSearch, onSelectFilter }: { data?: Record<string, Row[]>; comparisonPair?: string | null; comparisonContextRows?: Array<Row | null>; comparisonAnalytics?: AnalyticsSummary[]; onFilter: (value: string) => void; selectedFilter: string | null; onSearch?: (tab: string, rows: Row[]) => void; onSelectFilter?: (tab: string, rows: Row[], row: Row) => void }) {
  const [tab, setTab] = useState("Channel");
  const [comparisonIndex, setComparisonIndex] = useState(0);
  const rows = data[tab] ?? [];
  useEffect(() => setComparisonIndex(0), [comparisonPair, tab]);
  const fallbackKey = tab === "Channel" ? "sources" : tab === "Referrer" ? "referrers" : "campaigns";
  const chartRows = comparisonRowsForTab(rows, comparisonPair, comparisonAnalytics, comparisonIndex, fallbackKey);
  const total = chartRows.reduce((sum, row) => sum + row.value, 0);
  return <article className="df-card">
    <CardHead><Tabs items={Object.keys(data)} active={tab} onChange={setTab} /><span className="df-head-total"><b>All</b> ({compact(total)})</span></CardHead>
      <div className={`df-card-body df-source-body ${tab === "Channel" ? "is-channel" : "is-list"}`}>
        {tab === "Channel" ? <DatafastPie rows={chartRows} selectedFilter={selectedFilter} tone={comparisonIndex === 1 ? "compare" : "primary"} onSelect={(row) => onSelectFilter ? onSelectFilter(tab, chartRows, row) : onFilter(row.name)} /> : <BarList rows={chartRows} seriesTone={comparisonIndex === 1 ? "compare" : "primary"} onSelect={(row) => onSelectFilter ? onSelectFilter(tab, chartRows, row) : onFilter(row.name)} selectedFilter={selectedFilter} />}
      </div><ComparisonTabs comparisonPair={comparisonPair} activeIndex={comparisonIndex} onChange={setComparisonIndex} /><button className="df-details" onClick={() => onSearch?.(tab, chartRows)}>Details</button>
  </article>;
}

function CardHead({ children }: { children: React.ReactNode }) { return <div className="df-card-head">{children}</div>; }

function BarsCard({ tabs, initial, total, comparisonPair, comparisonContextRows = [], comparisonAnalytics = [], onFilter, selectedFilter, icons: showIcons = false, interaction = "filter", onSearch, onSelectFilter }: { tabs: Record<string, Row[]>; initial: string; total?: string; comparisonPair?: string | null; comparisonContextRows?: Array<Row | null>; comparisonAnalytics?: AnalyticsSummary[]; onFilter?: (value: string) => void; selectedFilter?: string | null; icons?: boolean; interaction?: "filter" | "inspect"; onSearch?: (tab: string, rows: Row[]) => void; onSelectFilter?: (tab: string, rows: Row[], row: Row) => void }) {
  const [tab, setTab] = useState(initial);
  const [comparisonIndex, setComparisonIndex] = useState(0);
  const [selected, setSelected] = useState<Row | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const rows = tabs[tab];
  useEffect(() => setComparisonIndex(0), [comparisonPair, tab]);
  const fallbackKey = tab === "Page" ? "paths" : tab === "Entry page" ? "entryPages" : tab === "Exit link" ? "exitLinks" : tab === "Browser" ? "browsers" : tab === "OS" ? "operatingSystems" : "devices";
  const chartRows = comparisonRowsForTab(rows, comparisonPair, comparisonAnalytics, comparisonIndex, fallbackKey);
  const select = (row: Row) => {
    if (interaction === "filter") onSelectFilter ? onSelectFilter(tab, chartRows, row) : onFilter?.(row.name);
    else {
      setSelected(row);
      setDetailsOpen(true);
    }
  };
  return <article className="df-card">
    <CardHead><Tabs items={Object.keys(tabs)} active={tab} onChange={setTab} />{total && <span className="df-head-total"><b>All</b> ({total})</span>}</CardHead>
    <div className="df-card-body"><BarList rows={chartRows} seriesTone={comparisonIndex === 1 ? "compare" : "primary"} onSelect={select} icons={showIcons} action={interaction} selectedFilter={selectedFilter} systemTab={showIcons ? tab : undefined} /></div><ComparisonTabs comparisonPair={comparisonPair} activeIndex={comparisonIndex} onChange={setComparisonIndex} />
    <button className="df-details" onClick={() => onSearch ? onSearch(tab, chartRows) : setDetailsOpen((value) => !value)}>{detailsOpen ? "Close details" : "Details"}</button>
    {detailsOpen && <CardDetails row={selected ?? chartRows[0]} total={chartRows.reduce((sum, row) => sum + row.value, 0)} close={() => setDetailsOpen(false)} />}
  </article>;
}

function CardDetails({ row, total, close }: { row: Row; total: number; close: () => void }) {
  const percentage = Math.round((row.value / total) * 100);
  return <div className="df-card-details-popover" role="dialog" aria-label={`Details for ${row.name}`}>
    <button aria-label="Close details" onClick={close}><X /></button>
    <span>Selected detail</span><b>{row.name}</b>
    <strong>{compact(row.value)}</strong><small>{percentage}% of the visible total</small>
  </div>;
}

function BarList({ rows, comparisonPair, onSelect, icons: showIcons = false, flags: showFlags = false, action = "filter", selectedFilter, systemTab, seriesTone = "primary", valueSuffix = "" }: { rows: Row[]; comparisonPair?: string | null; onSelect: (value: Row) => void; icons?: boolean; flags?: boolean; action?: "filter" | "inspect"; selectedFilter?: string | null; systemTab?: string; seriesTone?: "primary" | "compare"; valueSuffix?: string }) {
  const max = Math.max(...rows.map((row) => row.value));
  const comparisonNames = comparisonPair?.split(/\s+avec\s+/i).map((value) => value.trim()).filter(Boolean) ?? [];
  return <div className="df-bar-list">{rows.map((row) => <button className={`df-bar-row ${selectedFilter === row.name ? "is-filtered" : ""} ${comparisonNames.includes(row.name) ? "is-comparing" : ""} ${seriesTone === "compare" ? "is-comparison-series" : ""}`} key={row.name} onClick={() => onSelect(row)}><i className="df-bar-fill" style={{ width: `${Math.max(4, max ? (row.value / max) * 86 : 4)}%` }} />{showFlags && countryCodes[row.name] && <img className="df-flag-icon" src={`https://flagcdn.com/w40/${countryCodes[row.name].toLowerCase()}.png`} alt={`${row.name} flag`} />}{showIcons && <span className="df-system-icon">{systemIcon(systemTab, row.name)}</span>}<span>{row.name}</span><b>{compact(row.value)}{valueSuffix}</b><span className="df-bar-action">{action === "filter" ? <Filter /> : <Search />}<em>{action === "filter" ? `Filter by ${row.name}` : `View ${row.name} details`}</em></span></button>)}</div>;
}

function systemIcon(tab: string | undefined, name: string) {
  const size = 14;
  if (tab === "Browser") {
    if (browserIcons[name]) return <img src={browserIcons[name]} alt="" width={size} height={size} />;
    return <Globe2 size={size} />;
  }
  if (tab === "OS") {
    if (name === "macOS" || name === "iOS") return <Apple size={size} />;
    if (name === "Android") return <Smartphone size={size} />;
    if (name === "Linux") return <Laptop size={size} />;
    return <Monitor size={size} />;
  }
  if (name === "Mobile") return <Smartphone size={size} />;
  if (name === "Tablet") return <Tablet size={size} />;
  return <Monitor size={size} />;
}

function LocationCard({ data = locationData, comparisonPair, comparisonContextRows = [], comparisonAnalytics = [], onFilter, selectedFilter, onSearch, onSelectFilter }: { data?: Record<string, Row[]>; comparisonPair?: string | null; comparisonContextRows?: Array<Row | null>; comparisonAnalytics?: AnalyticsSummary[]; onFilter: (value: string) => void; selectedFilter: string | null; onSearch?: (tab: string, rows: Row[]) => void; onSelectFilter?: (tab: string, rows: Row[], row: Row) => void }) {
  const [tab, setTab] = useState("Map");
  const [comparisonIndex, setComparisonIndex] = useState(0);
  useEffect(() => setComparisonIndex(0), [comparisonPair, tab]);
  const selectMapCountry = (name: string) => {
    const row = (data.Country ?? []).find((item) => item.name === name) ?? { name, value: 0 };
    if (onSelectFilter) onSelectFilter("Country", data.Country ?? [], row);
    else onFilter(name);
  };
  const locationRows = data[tab] ?? [];
  const chartRows = tab === "Country" ? comparisonRowsForTab(locationRows, comparisonPair, comparisonAnalytics, comparisonIndex, "countries") : locationRows;
  return <article className={`df-card df-location-card ${tab === "Map" ? "is-map" : ""}`}><CardHead><Tabs items={["Map", "Country", "Region", "City"]} active={tab} onChange={setTab} /></CardHead><div className="df-card-body df-location-body">{tab === "Map" ? <WorldMap onFilter={selectMapCountry} comparisonPair={comparisonPair} /> : <BarList rows={chartRows} seriesTone={comparisonIndex === 1 ? "compare" : "primary"} onSelect={(row) => onSelectFilter ? onSelectFilter(tab, chartRows, row) : onFilter(row.name)} selectedFilter={selectedFilter} flags={tab === "Country"} />}</div>{tab !== "Map" && <button className="df-details" onClick={() => onSearch?.(tab, chartRows)}>Details</button>}{tab === "Country" && <ComparisonTabs comparisonPair={comparisonPair} activeIndex={comparisonIndex} onChange={setComparisonIndex} />}</article>;
}

function WorldMap({ onFilter, comparisonPair }: { onFilter: (value: string) => void; comparisonPair?: string | null }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const paths = useMemo(() => {
    const collection = feature(world as any, (world as any).objects.countries) as any;
    const projection = geoMercator().fitExtent([[12, 10], [788, 365]], collection);
    const path = geoPath(projection);
    return collection.features.map((item: any, index: number) => <path key={index} d={path(item) ?? ""} />);
  }, []);
  const points = [
    ["United States", 22, 43, 1810], ["United Kingdom", 47, 35, 642], ["France", 49, 40, 521], ["Germany", 52, 37, 494], ["India", 68, 55, 366], ["Australia", 84, 76, 228],
  ] as const;
  const comparisonNames = comparisonPair?.split(/\s+avec\s+/i).map((value) => value.trim().toLowerCase()) ?? [];
  const zoomAtPoint = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    setZoom((currentZoom) => {
      const nextZoom = Math.min(4, Math.max(1, currentZoom + (event.deltaY < 0 ? 0.16 : -0.16)));
      const ratio = nextZoom / currentZoom;
      setPan((currentPan) => ({ x: point.x - (point.x - currentPan.x) * ratio, y: point.y - (point.y - currentPan.y) * ratio }));
      return nextZoom;
    });
  };
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
    setDragging(true);
  };
  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPan({ x: drag.panX + event.clientX - drag.x, y: drag.panY + event.clientY - drag.y });
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className={`df-world ${dragging ? "is-dragging" : ""}`} onWheel={zoomAtPoint} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} aria-label="Interactive visitor map"><div className="df-world-zoom" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}><svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g>{paths}</g></svg>{points.map(([name, x, y, value]) => <button className={comparisonNames.includes(name.toLowerCase()) || (name === "United States" && comparisonNames.some((value) => value.includes("états") || value.includes("etats"))) ? "is-comparing" : ""} key={name} aria-label={`Filter by ${name}`} style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${1 / zoom})` }} onClick={() => onFilter(name)}><span>{name} · {compact(value)}</span></button>)}</div><span className="df-map-zoom-hint">Glisser pour déplacer · Molette pour zoomer · {Math.round(zoom * 100)}%</span></div>;
}

function DetailInsightCards({ mode, onFilter, pageFunnelTabs }: { mode: Exclude<DashboardMode, "home">; onFilter: (value: string) => void; pageFunnelTabs?: Record<string, Row[]> | null }) {
  const ctaTabs: Record<string, Row[]> = mode === "ad" ? {
    "Ad actions": [
      { name: "Landing page clicks", value: 1184 },
      { name: "Profile visits", value: 624 },
      { name: "Video completions", value: 418 },
      { name: "Booked calls", value: 128 },
    ],
    "CTR by CTA": [
      { name: "Book a call", value: 74 },
      { name: "See the case study", value: 62 },
      { name: "View pricing", value: 49 },
      { name: "Learn more", value: 37 },
    ],
  } : {
    "CTA clicks": [
      { name: "Book a call", value: 684 },
      { name: "View pricing", value: 442 },
      { name: "See case studies", value: 318 },
      { name: "Start a project", value: 226 },
      { name: "Contact", value: 184 },
    ],
    "CTA conversion": [
      { name: "Book a call", value: 148 },
      { name: "Start a project", value: 112 },
      { name: "View pricing", value: 87 },
      { name: "Contact", value: 64 },
    ],
  };
  const pageJourney = [
    { name: "Page visitors", value: 12400 },
    { name: "Hero viewed", value: 6800 },
    { name: "Main section reached", value: 3200 },
    { name: "Contact section reached", value: 1500 },
    { name: "Conversion", value: 620 },
  ];
  const profileJourney = [
    { name: "Profile visitors", value: 12400 },
    { name: "Intent recognized", value: 6800 },
    { name: "Qualified audience", value: 3200 },
    { name: "Call intent", value: 1500 },
    { name: "Booked call", value: 620 },
  ];
  const adJourney = [
    { name: "Impressions", value: 12400 },
    { name: "Clicks", value: 6800 },
    { name: "Landing page visits", value: 3200 },
    { name: "Qualified actions", value: 1500 },
    { name: "Conversions", value: 620 },
  ];
  const sectionReach = mode === "ad" ? [
    { name: "Impressions", value: 12400 },
    { name: "Landing page views", value: 8600 },
    { name: "Engaged visits", value: 4200 },
    { name: "Qualified actions", value: 1800 },
    { name: "Conversions", value: 620 },
  ] : mode === "profile" ? [
    { name: "Profile visitors", value: 12400 },
    { name: "Hero viewed", value: 9800 },
    { name: "Proof section viewed", value: 6800 },
    { name: "Contact intent", value: 2100 },
    { name: "Booked call", value: 620 },
  ] : [
    { name: "Page visitors", value: 12400 },
    { name: "Hero viewed", value: 9800 },
    { name: "Main section reached", value: 6800 },
    { name: "Contact section reached", value: 2100 },
    { name: "Conversion", value: 620 },
  ];
  const journey = mode === "profile" ? profileJourney : mode === "ad" ? adJourney : pageJourney;
  const primaryJourneyLabel = mode === "profile" ? "Persona journey" : mode === "ad" ? "Ad funnel" : "Conversion journey";
  const secondaryJourneyLabel = mode === "ad" ? "Drop-off by stage" : "Section reach";
  const sectionTabs: Record<string, Row[]> = {
    [primaryJourneyLabel]: journey,
    ...(pageFunnelTabs ?? { [secondaryJourneyLabel]: sectionReach }),
  };
  return <>
    <BarsCard tabs={ctaTabs} initial={Object.keys(ctaTabs)[0]} total="CTA" interaction="inspect" />
    <FunnelCard tabs={sectionTabs} initial={Object.keys(sectionTabs)[0]} />
  </>;
}

function FunnelCard({ tabs, initial }: { tabs: Record<string, Row[]>; initial: string }) {
  const [tab, setTab] = useState(initial);
  const [active, setActive] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const rows = tabs[tab];
  const largest = rows[0].value;
  const activeRow = rows[active] ?? rows[0];
  const formatFunnelValue = (value: number) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString("en-US");
  const funnelData = rows.map((row) => ({
    label: row.name,
    value: row.value,
    displayValue: formatFunnelValue(row.value),
  }));
  return <article className="df-card df-funnel-card">
    <CardHead><Tabs items={Object.keys(tabs)} active={tab} onChange={(value) => { setTab(value); setActive(0); }} /><span className="df-head-total"><b>Journey</b></span></CardHead>
    <div className="df-funnel-card-body">
      <FunnelChart
        className="df-bklit-funnel"
        color="#8dcdff"
        data={funnelData}
        edges="curved"
        gap={4}
        layers={3}
        labelLayout="spread"
        onHoverChange={(index) => { if (index !== null) setActive(index); }}
        showLabels
        showPercentage
        showValues
        staggerDelay={0.12}
      />
    </div>
    <button className="df-details" onClick={() => setDetailsOpen((value) => !value)}>{detailsOpen ? "Close details" : "Details"}</button>
    {detailsOpen && <FunnelDetailsOverlay rows={rows} activeIndex={active} close={() => setDetailsOpen(false)} />}
  </article>;
}

function FunnelDetailsOverlay({ rows, activeIndex, close }: { rows: Row[]; activeIndex: number; close: () => void }) {
  const [query, setQuery] = useState("");
  const visibleRows = rows.filter((row) => row.name.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = rows[activeIndex] ?? rows[0];
  return <div className="df-funnel-overlay" role="dialog" aria-modal="true" aria-label="Funnel details">
    <button className="df-funnel-overlay-backdrop" aria-label="Close funnel details" onClick={close} />
    <div className="df-funnel-overlay-panel">
      <div className="df-funnel-overlay-head"><div><span>Funnel details</span><strong>{selected.name}</strong></div><button aria-label="Close funnel details" onClick={close}><X /></button></div>
      <label className="df-funnel-search"><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a stage or metric…" /></label>
      <div className="df-funnel-overlay-summary"><b>{compact(selected.value)}</b><span>{selected.name}</span><small>{activeIndex === 0 ? "100% of visitors" : `${Math.round((selected.value / rows[activeIndex - 1].value) * 100)}% from previous stage`}</small></div>
      <div className="df-funnel-overlay-results">{visibleRows.map((row, index) => <button key={row.name} onClick={() => setQuery(row.name)}><span>{row.name}</span><b>{compact(row.value)}</b><em>{Math.round((row.value / rows[0].value) * 100)}%</em></button>)}{visibleRows.length === 0 && <p>No matching stage.</p>}</div>
    </div>
  </div>;
}

function AnalyticsSearchOverlay({ title, rows, onChoose, comparisonPair, comparisonContextRows, close }: { title: string; rows: Row[]; onChoose: (row: Row) => void; comparisonPair?: string | null; comparisonContextRows?: Array<Row | null>; close: () => void }) {
  const [query, setQuery] = useState("");
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  const visibleRows = rows.filter((row) => row.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="df-funnel-overlay" role="dialog" aria-modal="true" aria-label={`${title} search`}>
    <button className="df-funnel-overlay-backdrop" aria-label={`Close ${title} search`} onClick={close} />
    <div className="df-funnel-overlay-panel">
      <div className="df-funnel-overlay-head"><div><span>{title}</span><strong>Choose a result</strong></div><button aria-label={`Close ${title} search`} onClick={close}><X /></button></div>
      <ComparisonSummary rows={rows} comparisonPair={comparisonPair} comparisonContextRows={comparisonContextRows} />
      <label className="df-funnel-search"><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}…`} /></label>
      <div className="df-funnel-overlay-results">{visibleRows.map((row) => <button key={row.name} onClick={() => onChoose(row)}><span>{row.name}</span><b>{compact(row.value)}</b><em>{((row.value / total) * 100).toFixed(1)}%</em></button>)}{visibleRows.length === 0 && <p>No matching result.</p>}</div>
    </div>
  </div>;
}
