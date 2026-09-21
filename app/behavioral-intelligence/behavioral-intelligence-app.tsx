"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { AnalyticsSummary, AnalyticsViewport } from "@/lib/saas-analytics/types";
import { geoGraticule, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { ExactAnalyticsDashboard, type MetricKey } from "./exact-analytics-dashboard";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  FileText,
  Filter,
  Globe2,
  House,
  Layers3,
  Menu,
  Megaphone,
  MousePointer2,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
type View = "home" | "ads" | "pages" | "profiles" | "live";
type Detail = { type: "ad" | "page" | "profile"; name: string } | null;
type Metric = "visitors" | "conversion" | "bounce" | "session" | "online";
type Range =
  | "Aujourd’hui"
  | "24 dernières heures"
  | "7 derniers jours"
  | "30 derniers jours";
type Ctx = { range: Range; granularity: string; offset: number };
const PROFILE =
    "/behavioral-assets/27e870d15fd2237a8a2574c88fc991785da752e2.png",
  AD = "/behavioral-assets/01ed28f95fa41d88c4f507f7dcd910917fbb72fa.jpg";
const nav = [
  { id: "home", label: "Home", icon: House },
  { id: "ads", label: "Ads", icon: Megaphone },
  { id: "pages", label: "Pages", icon: FileText },
  { id: "profiles", label: "Profils", icon: UserRound },
  { id: "live", label: "En direct", icon: Globe2 },
] as const;

// Kept in the codebase for the next tracking iteration, but intentionally
// disabled while the static page previews are being stabilised.
const INTERACTIVE_PREVIEWS_ENABLED = false;

function FigmaCompareIcon() {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M31.669 15.003H11.1c-1.676 0-2.514 0-2.723-.515-.208-.514.385-1.12 1.57-2.33l3.74-3.822M8.336 25h20.57c1.675 0 2.513 0 2.722.515.209.514-.384 1.12-1.57 2.33l-3.74 3.822" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function FigmaBellIcon() {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M4.214 23.993c-.355 2.255 1.23 3.82 3.17 4.6 7.438 2.99 17.788 2.99 25.227 0 1.94-.78 3.525-2.345 3.17-4.6-.218-1.386-1.295-2.54-2.093-3.667-1.045-1.494-1.149-3.124-1.149-4.858 0-6.7-5.615-12.132-12.542-12.132-6.926 0-12.54 5.432-12.54 12.132 0 1.734-.104 3.364-1.15 4.858-.797 1.127-1.874 2.281-2.092 3.667ZM15 35c1.327 1.036 3.08 1.667 5 1.667 1.921 0 3.673-.631 5-1.667" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
const profiles = [
  {
    name: "Décideurs rapides",
    share: 21,
    image: "/behavioral-profiles/decideurs-rapides.png",
    imagePosition: "50% 30%",
    conversion: 14.8,
    session: "1m 24s",
    signal: "Processus → Réservation",
  },
  {
    name: "Chercheurs de preuves",
    share: 19,
    image: "/behavioral-profiles/chercheurs-de-preuves.png",
    imagePosition: "50% 30%",
    conversion: 8.7,
    session: "3m 08s",
    signal: "Cas clients → Tarifs",
  },
  {
    name: "Comparateurs",
    share: 16,
    image: "/behavioral-profiles/comparateurs.png",
    imagePosition: "50% 28%",
    conversion: 5.6,
    session: "5m 11s",
    signal: "Travaux → Cas clients",
  },
  {
    name: "Sensibles au prix",
    share: 13,
    image: "/behavioral-profiles/sensibles-au-prix.png",
    imagePosition: "50% 27%",
    conversion: 3.1,
    session: "4m 42s",
    signal: "Tarifs ↔ FAQ",
  },
  {
    name: "Explorateurs",
    share: 11,
    image: "/behavioral-profiles/explorateurs.png",
    imagePosition: "50% 28%",
    conversion: 4.4,
    session: "2m 36s",
    signal: "Accueil → Services",
  },
  {
    name: "Visiteurs récurrents",
    share: 9,
    image: "/behavioral-profiles/visiteurs-recurrents.png",
    imagePosition: "50% 30%",
    conversion: 11.2,
    session: "6m 03s",
    signal: "3 visites avant action",
  },
];
const ads = [
  {
    name: "Remote closer Founder 04",
    network: "X Ads",
    ctr: 4.8,
    conversion: 8.1,
    clicks: 1284,
    status: "Active",
    country: "United States",
    countryCode: "us",
  },
  {
    name: "Case study Retargeting",
    network: "Meta",
    ctr: 3.9,
    conversion: 6.7,
    clicks: 942,
    status: "Active",
    country: "United Kingdom",
    countryCode: "gb",
  },
  {
    name: "Brand search France",
    network: "Google",
    ctr: 7.2,
    conversion: 12.4,
    clicks: 684,
    status: "Active",
    country: "France",
    countryCode: "fr",
  },
  {
    name: "SaaS redesign Proof",
    network: "LinkedIn",
    ctr: 2.8,
    conversion: 5.9,
    clicks: 516,
    status: "Paused",
    country: "Germany",
    countryCode: "de",
  },
  {
    name: "Pricing objection 02",
    network: "X Ads",
    ctr: 4.1,
    conversion: 7.3,
    clicks: 438,
    status: "Active",
    country: "Canada",
    countryCode: "ca",
  },
  {
    name: "Founder POV 07",
    network: "Meta",
    ctr: 3.4,
    conversion: 6.1,
    clicks: 391,
    status: "Draft",
    country: "Australia",
    countryCode: "au",
  },
];
const adLandingPaths: Record<string, string> = {
  "Remote closer Founder 04": "/saas-redesign",
  "Case study Retargeting": "/realisations",
  "Brand search France": "/services",
  "SaaS redesign Proof": "/saas-redesign",
  "Pricing objection 02": "/services/optimisation-conversion",
};
const pages = [
  {
    path: "/",
    name: "Home",
    preview: "/behavioral-previews/home.png",
    visitors: 2400,
    conversion: 7.8,
    bounce: 48,
    time: "1m 48s",
  },
  {
    path: "/services",
    name: "Services",
    preview: "/behavioral-previews/services.png",
    visitors: 1700,
    conversion: 12.6,
    bounce: 39,
    time: "2m 54s",
  },
  {
    path: "/agence",
    name: "Agency",
    preview: "/behavioral-previews/agence.png",
    visitors: 1300,
    conversion: 9.4,
    bounce: 42,
    time: "3m 11s",
  },
  {
    path: "/realisations",
    name: "Réalisations",
    preview: "/behavioral-previews/realisations.png",
    visitors: 988,
    conversion: 8.2,
    bounce: 45,
    time: "2m 08s",
  },
  {
    path: "/30-min",
    name: "30 min",
    preview: "/behavioral-previews/30-min.png",
    visitors: 724,
    conversion: 10.1,
    bounce: 36,
    time: "2m 42s",
  },
  {
    path: "/saas-redesign",
    name: "SaaS redesign",
    preview: "/behavioral-previews/saas-redesign.png",
    visitors: 512,
    conversion: 31.4,
    bounce: 21,
    time: "1m 16s",
  },
];
const charts: Record<Range, number[]> = {
  "Aujourd’hui": [
    28, 38, 33, 46, 57, 51, 68, 74, 63, 55, 48, 61, 79, 72, 85, 93, 81, 69, 76,
    89, 97, 88, 73, 64,
  ],
  "24 dernières heures": [
    183, 167, 151, 158, 189, 185, 197, 181, 199, 187, 176, 171, 132, 116, 96,
    72, 101, 65, 126, 118, 151, 148, 154, 82,
  ],
  "7 derniers jours": [
    312, 338, 294, 381, 356, 421, 397, 442, 408, 459, 431, 478, 446, 493,
  ],
  "30 derniers jours": [
    118, 132, 126, 151, 147, 163, 158, 176, 169, 188, 181, 201, 194, 213, 207,
    226, 218, 239, 231, 248, 241, 259, 253, 272, 264, 281, 274, 293, 286, 304,
  ],
};
const factor: Record<Range, number> = {
    "Aujourd’hui": 0.24,
    "24 dernières heures": 1,
    "7 derniers jours": 6.7,
    "30 derniers jours": 27.4,
  },
  scale: Record<Metric, number> = {
    visitors: 1,
    conversion: 0.73,
    bounce: 0.46,
    session: 0.62,
    online: 0.28,
  };

function parseComparisonRequest(input: string): { pair: string; metric: MetricKey } {
  const normalized = input.toLocaleLowerCase("fr-FR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const countries = [
    { aliases: ["etats-unis", "etats unis", "united states", "usa", "us"], label: "États-Unis" },
    { aliases: ["france"], label: "France" },
    { aliases: ["royaume-uni", "united kingdom", "uk"], label: "United Kingdom" },
    { aliases: ["allemagne", "germany"], label: "Germany" },
    { aliases: ["inde", "india"], label: "India" },
    { aliases: ["canada"], label: "Canada" },
    { aliases: ["australie", "australia"], label: "Australia" },
  ];
  const found = countries
    .flatMap((country) => country.aliases.map((alias) => ({ ...country, alias, index: normalized.indexOf(alias) })))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index)
    .filter((item, index, list) => list.findIndex((candidate) => candidate.label === item.label) === index)
    .slice(0, 2);
  const metric = /\b(trafic|traffic|visiteurs?|visits?)\b/.test(normalized) ? "visitors"
    : /\bsessions?\b/.test(normalized) ? "sessions"
      : /\b(page views?|pages?)\b/.test(normalized) ? "views"
        : /\b(engagement|engagees?|engaged)\b/.test(normalized) ? "engaged"
          : /\b(conversions?|conversion)\b/.test(normalized) ? "conversion"
            : /\b(rebond|bounce)\b/.test(normalized) ? "bounce"
              : /\b(scroll|defilement)\b/.test(normalized) ? "scroll"
                : /\b(cta|clics?|clicks?)\b/.test(normalized) ? "cta"
                  : "visitors";
  if (found.length === 2) return { pair: `${found[0].label} avec ${found[1].label}`, metric };
  const fallback = input.replace(/^(compare(?:-moi)?|comparer)\s*/i, "").replace(/\b(le|la|les|du|de|des|trafic|traffic|visiteurs?|sessions?|pages?|conversion|rebond|scroll)\b/gi, "").split(/,|\s+avec\s+|\s+vs\s+|\s+et\s+/i).map((value) => value.trim()).filter(Boolean);
  return { pair: fallback.length >= 2 ? `${fallback[0]} avec ${fallback[1]}` : input.trim(), metric };
}

type ComparisonCandidate = { label: string; kind: string; value?: number };
type JevInterpretation = {
  targets: string[];
  metric: MetricKey;
  suggestions?: ComparisonCandidate[];
  provider?: "jev" | "local";
};

const defaultCountries: ComparisonCandidate[] = [
  "France", "États-Unis", "United Kingdom", "Germany", "India", "Canada", "Australia",
].map((label) => ({ label, kind: "Pays" }));

function buildComparisonCandidates(analytics: AnalyticsSummary | null): ComparisonCandidate[] {
  const from = (items: Array<{ label: string; value?: number }> | undefined, kind: string) =>
    (items ?? []).map((item) => ({ label: item.label, kind, value: item.value }));
  const candidates: ComparisonCandidate[] = [
    ...defaultCountries,
    ...from(analytics?.countries, "Pays"),
    ...from(analytics?.paths, "Page"),
    ...from(analytics?.entryPages, "Page d’entrée"),
    ...from(analytics?.exitLinks, "Lien de sortie"),
    ...from(analytics?.sources, "Source"),
    ...from(analytics?.referrers, "Référent"),
    ...from(analytics?.campaigns, "Campagne"),
    ...from(analytics?.browsers, "Navigateur"),
    ...from(analytics?.operatingSystems, "Système"),
    ...from(analytics?.devices, "Appareil"),
    ...from(analytics?.ctas, "CTA"),
    ...from(analytics?.interactions, "Interaction"),
    ...(analytics?.sections ?? []).map((item) => ({ label: item.label, kind: "Section", value: item.views })),
    ...(analytics?.pageSections ?? []).map((item) => ({ label: `${item.path} · ${item.label}`, kind: "Section", value: item.reachedPeople })),
    ...profiles.map((item) => ({ label: item.name, kind: "Profil", value: item.share })),
    ...ads.flatMap((item) => [
      { label: item.name, kind: "Publicité", value: item.clicks },
      { label: item.network, kind: "Réseau publicitaire" },
    ]),
    ...pages.flatMap((item) => [
      { label: item.path, kind: "Page", value: item.visitors },
      { label: item.name, kind: "Page", value: item.visitors },
    ]),
  ];
  return candidates.filter((candidate, index, list) =>
    candidate.label.trim() && list.findIndex((item) => item.label === candidate.label && item.kind === candidate.kind) === index,
  );
}

function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function rankComparisonCandidates(query: string, candidates: ComparisonCandidate[]) {
  const normalizedQuery = normalizeSearch(query);
  const tokens = normalizedQuery.split(/[^a-z0-9]+/).filter((token) => token.length > 1);
  return candidates
    .map((candidate, index) => {
      const haystack = normalizeSearch(`${candidate.label} ${candidate.kind}`);
      const matches = tokens.filter((token) => haystack.includes(token)).length;
      const exact = normalizedQuery.includes(normalizeSearch(candidate.label)) ? 30 : 0;
      const popularity = Math.min(7, Math.log10(Math.max(1, candidate.value ?? 1)) * 2);
      return { candidate, score: exact + matches * 9 + popularity - index / 10000 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((item) => item.candidate);
}

function useComparisonSuggestions(query: string, candidates: ComparisonCandidate[]) {
  const [suggestions, setSuggestions] = useState(() => rankComparisonCandidates("", candidates));
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<"jev" | "local">("local");
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions(rankComparisonCandidates("", candidates));
      setProvider("local");
      return;
    }
    setSuggestions(rankComparisonCandidates(query, candidates));
    setProvider("local");
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/jev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ query, candidates }),
        });
        const result = await response.json() as JevInterpretation;
        setSuggestions(result.suggestions?.length ? result.suggestions : rankComparisonCandidates(query, candidates));
        setProvider(result.provider ?? "local");
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSuggestions(rankComparisonCandidates(query, candidates));
          setProvider("local");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, candidates]);
  return { suggestions, loading, provider };
}

async function interpretComparisonRequest(input: string, analytics: AnalyticsSummary | null): Promise<{ pair: string; metric: MetricKey }> {
  const fallback = parseComparisonRequest(input);
  const candidates = buildComparisonCandidates(analytics);
  try {
    const response = await fetch("/api/jev", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: input, candidates }) });
    if (!response.ok) return fallback;
    const result = await response.json() as JevInterpretation;
    if (!Array.isArray(result.targets) || result.targets.length < 2) return fallback;
    const resolvedTargets = result.targets.slice(0, 2).map((target) => candidates.find((candidate) => candidate.label === target));
    if (!resolvedTargets[0] || !resolvedTargets[1] || resolvedTargets[0].kind !== resolvedTargets[1].kind) return fallback;
    return { pair: `${result.targets[0]} avec ${result.targets[1]}`, metric: result.metric ?? fallback.metric };
  } catch {
    return fallback;
  }
}

export function BehavioralIntelligenceApp({ initialAnalytics }: { initialAnalytics: AnalyticsSummary | null }) {
  const [view, setView] = useState<View>("home"),
    [detail, setDetail] = useState<Detail>(null),
    [detailOrigin, setDetailOrigin] = useState<View | null>(null),
    [mobile, setMobile] = useState(false),
    [searchOpen, setSearchOpen] = useState(false),
    [compare, setCompare] = useState(false),
    [compareMetric, setCompareMetric] = useState<MetricKey | null>(null),
    [searchMetric, setSearchMetric] = useState<MetricKey | null>(null),
    [searchFilter, setSearchFilter] = useState<string | null>(null),
    [comparisonPair, setComparisonPair] = useState<string | null>(null),
    [compareRelative, setCompareRelative] = useState(false),
    [notificationsOpen, setNotificationsOpen] = useState(false),
    [query, setQuery] = useState(""),
    [chips, setChips] = useState<string[]>([]),
    [range, setRange] = useState<Range>("24 dernières heures"),
    [rangeOpen, setRangeOpen] = useState(false),
    [granularity, setGranularity] = useState("Heure"),
    [offset, setOffset] = useState(0),
    [refresh, setRefresh] = useState(false),
    [stickyAnalyticsControls, setStickyAnalyticsControls] = useState<ReactNode | null>(null);
  const title = detail?.name ?? nav.find((n) => n.id === view)?.label ?? "Home",
    ctx = { range, granularity, offset };
  const comparisonCandidates = useMemo(() => buildComparisonCandidates(initialAnalytics), [initialAnalytics]);
  const activeComparisonPair = comparisonPair ?? chips.find((chip) => /\s+avec\s+/i.test(chip)) ?? null;
  const updateChips = (next: string[]) => {
    setChips(next);
    if (next.length === 0) {
      setSearchFilter(null);
      setSearchMetric(null);
    }
    if (!activeComparisonPair || next.includes(activeComparisonPair)) return;
    setComparisonPair(null);
    setCompareMetric(null);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view, detail]);
  const go = (v: View) => {
    setView(v);
    setDetail(null);
    setDetailOrigin(null);
    setStickyAnalyticsControls(null);
    setMobile(false);
  };
  const submit = async (v: string, selectedTargets: string[] = []) => {
    if (v.trim()) {
      const parsed = await interpretComparisonRequest(v, initialAnalytics);
      const pair = selectedTargets.length === 2 ? `${selectedTargets[0]} avec ${selectedTargets[1]}` : parsed.pair;
      setChips([pair]);
      setComparisonPair(pair);
      setCompareMetric(parsed.metric);
      setSearchFilter(null);
      setSearchMetric(null);
    }
    setSearchOpen(false);
    setQuery("");
  };
  return (
    <div className="fw-shell">
      <aside className={`fw-sidebar ${mobile ? "is-open" : ""}`}>
        <div className="fw-logo">
          <img src="/ruff-logo.png" alt="Ruff Agency" />
          <button aria-label="Fermer" onClick={() => setMobile(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="fw-side-rule" />
        <nav aria-label="Navigation principale">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={view === id ? "is-active" : ""}
              onClick={() => go(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="fw-main">
        <h1 className="fw-sr-only">{title}</h1>
        <header className="fw-mobile-head">
          <button aria-label="Menu" onClick={() => setMobile(true)}>
            <Menu size={21} />
          </button>
          <b>{title}</b>
        </header>
        <header className={`fw-topbar ${stickyAnalyticsControls ? "has-analytics-controls" : ""} ${detail ? "is-detail" : ""}`}>
          <div className="fw-topbar-primary">
            <BreadcrumbTrail items={detail ? [
              ...(detailOrigin === "home" ? [{ label: "Home", onClick: () => go("home") }] : []),
              { label: detail.type === "page" ? "Page" : detail.type === "profile" ? "Profil" : "Ads", onClick: () => detail.type === "page" ? go("pages") : detail.type === "profile" ? go("profiles") : go("ads") },
              { label: detail.name, current: true },
            ] : [{ label: view === "home" ? "Dashboard" : view === "ads" ? "Ads" : view === "pages" ? "Page" : view === "profiles" ? "Profils" : "En direct", current: true }]} />
            <div className="fw-sticky-search"><SearchBar chips={chips} setChips={updateChips} onSearch={() => setSearchOpen(true)} onCompare={() => { setCompareMetric(null); setCompare(true); }} /></div>
            <div className="fw-topbar-actions">
              <button className="fw-figma-icon-button" onClick={() => { setCompareMetric(null); setCompare(true); }} aria-label="Comparer"><FigmaCompareIcon /><span>Comparer</span></button>
              <button className="fw-figma-icon-button" onClick={() => setNotificationsOpen((open) => !open)} aria-label="Notifications"><FigmaBellIcon /><span>Notifications</span></button>
              <button className="fw-ads-cta" onClick={() => go("ads")}><Plus size={23} />Créer une publicité</button>
            </div>
          </div>
          <div className={`fw-topbar-secondary ${stickyAnalyticsControls ? "has-controls" : "is-empty"}`} aria-hidden={!stickyAnalyticsControls}>
            <div className="fw-sticky-analytics-controls">{stickyAnalyticsControls}</div>
          </div>
        </header>
        <div className="fw-content">
          {detail ? (
                <DetailView
              key={`${detail.type}-${detail.name}`}
              detail={detail}
              ctx={ctx}
                  initialAnalytics={initialAnalytics}
                  compareMetric={compareMetric}
                  onCompareMetricChange={setCompareMetric}
                  compareRelative={compareRelative}
                  comparisonPair={activeComparisonPair}
                  onStickyControlsChange={setStickyAnalyticsControls}
            />
          ) : (
            <>
              {view === "home" && (
                <Home
                  ctx={ctx}
                  openProfile={(name) => { setDetailOrigin("home"); setDetail({ type: "profile", name }); }}
                  openPage={(name) => { setDetailOrigin("home"); setDetail({ type: "page", name }); }}
                  onStickyControlsChange={setStickyAnalyticsControls}
                  initialAnalytics={initialAnalytics}
                  compareMetric={compareMetric}
                  onCompareMetricChange={setCompareMetric}
                  compareRelative={compareRelative}
                  comparisonPair={activeComparisonPair}
                  externalFilter={searchFilter}
                  externalMetric={searchMetric}
                />
              )}{" "}
              {view === "ads" && (
                <FigmaAds open={(name) => { setDetailOrigin(null); setDetail({ type: "ad", name }); }} />
              )}{" "}
              {view === "pages" && (
                <FigmaPages
                  open={(name) => { setDetailOrigin(null); setDetail({ type: "page", name }); }}
                />
              )}{" "}
              {view === "profiles" && (
                <FigmaProfiles
                  open={(name) => { setDetailOrigin(null); setDetail({ type: "profile", name }); }}
                />
              )}{" "}
              {view === "live" && <Live />}
            </>
          )}
        </div>
      </main>
      <nav className="fw-mobile-tabs" aria-label="Navigation mobile">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={view === id ? "is-active" : ""}
            onClick={() => go(id)}
          >
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {searchOpen && (
        <SearchOverlay
          query={query}
          setQuery={setQuery}
          close={() => setSearchOpen(false)}
          submit={submit}
          candidates={comparisonCandidates}
          onFilter={(value) => {
            setChips([value]);
            setSearchFilter(value);
            setSearchMetric(null);
            setComparisonPair(null);
            setCompareMetric(null);
            setSearchOpen(false);
            setQuery("");
          }}
          onMetric={(metric, label) => {
            setChips([`Graphique · ${label}`]);
            setSearchMetric(metric);
            setSearchFilter(null);
            setComparisonPair(null);
            setCompareMetric(null);
            setSearchOpen(false);
            setQuery("");
          }}
        />
      )}{" "}
      {compare && (
        <QuickCompare
          close={() => setCompare(false)}
          compareRelative={compareRelative}
          setCompareRelative={setCompareRelative}
          setMetric={setCompareMetric}
          interpret={async (value) => interpretComparisonRequest(value, initialAnalytics)}
          candidates={comparisonCandidates}
          setComparisonPair={(value) => setComparisonPair(value)}
          apply={(v) => {
            setChips(v);
            setCompare(false);
          }}
        />
      )}
      {notificationsOpen && <NotificationsPanel close={() => setNotificationsOpen(false)} analytics={initialAnalytics} />}
    </div>
  );
}
function Controls(p: {
  range: Range;
  setRange: (v: Range) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  granularity: string;
  setGranularity: (v: string) => void;
  offset: number;
  setOffset: (v: number) => void;
  refresh: boolean;
  onRefresh: () => void;
}) {
  const ranges: Range[] = [
    "Aujourd’hui",
    "24 dernières heures",
    "7 derniers jours",
    "30 derniers jours",
  ];
  return (
    <div className="fw-controls">
      <button
        className="fw-control-icon"
        aria-label="Période précédente"
        onClick={() => p.setOffset(p.offset - 1)}
      >
        <ArrowLeft size={16} />
      </button>
      <div className="fw-control-wrap">
        <button onClick={() => p.setOpen(!p.open)}>
          <CalendarDays size={16} />
          {p.range}
          {p.offset < 0 && ` · ${Math.abs(p.offset)} avant`}
          <ChevronDown size={15} />
        </button>
        {p.open && (
          <div className="fw-popover">
            {ranges.map((r) => (
              <button
                key={r}
                className={r === p.range ? "is-active" : ""}
                onClick={() => {
                  p.setRange(r);
                  p.setOffset(0);
                  p.setOpen(false);
                }}
              >
                {r}
                {r === p.range && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <select
        aria-label="Granularité"
        value={p.granularity}
        onChange={(e) => p.setGranularity(e.target.value)}
      >
        <option>Heure</option>
        <option>Jour</option>
        <option>Semaine</option>
      </select>
      <button
        className={`fw-control-icon ${p.refresh ? "is-spinning" : ""}`}
        aria-label="Actualiser"
        onClick={p.onRefresh}
      >
        <RefreshCw size={16} />
      </button>
    </div>
  );
}
function SearchBar({
  chips,
  setChips,
  onSearch,
  onCompare,
}: {
  chips: string[];
  setChips: (v: string[]) => void;
  onSearch: () => void;
  onCompare: () => void;
}) {
  return (
    <div className="fw-command">
      <button className="fw-command-input" onClick={onSearch}>
        <Search size={21} />
        <span>Comparer une page, une campagne, un UTM ou une audience…</span>
      </button>
      <div className="fw-command-actions">
        {chips.slice(0, 2).map((c) => (
          <span key={c} className={/\s+avec\s+/i.test(c) ? "is-comparison" : "is-filter"}>
            <i>{/\s+avec\s+/i.test(c) ? <FigmaCompareIcon /> : <Filter size={14} />}</i>
            {c}
            <button
              aria-label={`Retirer ${c}`}
              onClick={() => setChips(chips.filter((x) => x !== c))}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <button onClick={onCompare}>
          <SlidersHorizontal size={16} />
          Comparer
        </button>
      </div>
    </div>
  );
}
function Home({
  ctx,
  openProfile,
  openPage,
  onStickyControlsChange,
  initialAnalytics,
  compareMetric,
  onCompareMetricChange,
  compareRelative,
  comparisonPair,
  externalFilter,
  externalMetric,
}: {
  ctx: Ctx;
  openProfile: (n: string) => void;
  openPage: (n: string) => void;
  onStickyControlsChange: (controls: ReactNode | null) => void;
  initialAnalytics: AnalyticsSummary | null;
  compareMetric: MetricKey | null;
  onCompareMetricChange: (value: MetricKey | null) => void;
  compareRelative: boolean;
  comparisonPair: string | null;
  externalFilter: string | null;
  externalMetric: MetricKey | null;
}) {
  const pageOptions = useMemo(() => pages.map(({ name, path }) => ({ name, path })), []);
  return (
    <div className="fw-view">
      <ProfileRail open={openProfile} />
      <ExactAnalyticsDashboard analytics={initialAnalytics} compareMetric={compareMetric} onCompareMetricChange={onCompareMetricChange} compareRelative={compareRelative} comparisonPair={comparisonPair} externalFilter={externalFilter} externalMetric={externalMetric} pageOptions={pageOptions} onStickyControlsChange={onStickyControlsChange} onSelectPage={openPage} />
    </div>
  );
}
function BreadcrumbTrail({ items }: { items: Array<{ label: string; onClick?: () => void; current?: boolean }> }) {
  return <div className="fw-breadcrumb">{items.map((item, index) => <span className="fw-breadcrumb-item" key={`${item.label}-${index}`}>
    {index > 0 && <i>/</i>}
    {item.onClick ? <button onClick={item.onClick}>{item.label}</button> : <strong className={item.current ? "is-current" : ""}>{item.label}</strong>}
  </span>)}</div>;
}

function SectionTopbar({ items, action }: { items: Array<{ label: string; onClick?: () => void; current?: boolean }>; action?: ReactNode }) {
  return <div className="fw-section-topbar">
    <BreadcrumbTrail items={items} />
    {action}
  </div>;
}

function ProfileRail({ open }: { open: (n: string) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollRail = (direction: -1 | 1) => railRef.current?.scrollBy({ left: direction * 420, behavior: "smooth" });
  return (
    <section className="fw-profile-rail-wrap" aria-label="Profils type de clients">
      <div className="fw-profile-rail-heading"><h2>Profils type de clients :</h2><div><button aria-label="Profils précédents" onClick={() => scrollRail(-1)}><ArrowLeft size={17} /></button><button aria-label="Profils suivants" onClick={() => scrollRail(1)}><ArrowRight size={17} /></button></div></div>
      <div className="fw-profile-rail" ref={railRef}>
        {profiles.map((p, i) => (
          <button key={p.name} onClick={() => open(p.name)}>
            <span className={`fw-profile-orbs orb-${i % 5}`} aria-hidden="true">
              <Image src={p.image} alt="" fill sizes="174px" className="fw-profile-photo" style={{ objectPosition: p.imagePosition }} />
            </span>
            <span className="fw-profile-meta"><strong>{p.name}</strong><b><span aria-hidden="true">•</span>{p.share}% <svg viewBox="0 0 10 9" aria-hidden="true"><path d="M.23 6.05 3.22.86C3.89-.28 5.54-.29 6.21.86l3.02 5.18c.67 1.15-.16 2.59-1.49 2.59H1.73C.4 8.63-.43 7.2.23 6.05Z" fill="currentColor" /></svg></b></span>
          </button>
        ))}
      </div>
      <div className="fw-profile-fade" aria-hidden="true" />
    </section>
  );
}

const metricDefs: {
  key: Metric;
  label: string;
  value: (f: number) => string;
  delta: string;
  up: boolean;
}[] = [
  {
    key: "visitors",
    label: "Visiteurs",
    value: (f) => Math.round(3137 * f).toLocaleString("fr-FR"),
    delta: "29%",
    up: false,
  },
  {
    key: "conversion",
    label: "Taux de conversion",
    value: (f) => `${(8.7 + Math.log2(Math.max(f, 0.2)) * 0.3).toFixed(1)}%`,
    delta: "2.1%",
    up: true,
  },
  {
    key: "bounce",
    label: "Taux de rebond",
    value: (f) => `${Math.round(60 - Math.log2(Math.max(f, 0.2)))}%`,
    delta: "3%",
    up: true,
  },
  {
    key: "session",
    label: "Temps de session",
    value: () => "1m 46s",
    delta: "21%",
    up: true,
  },
  {
    key: "online",
    label: "En ligne",
    value: () => "40",
    delta: "maintenant",
    up: true,
  },
];
function Analytics({
  ctx,
  compact = false,
  dataFilter = null,
}: {
  ctx: Ctx;
  compact?: boolean;
  dataFilter?: string | null;
}) {
  const [metric, setMetric] = useState<Metric>("visitors"),
    [expanded, setExpanded] = useState(false);
  return (
    <>
      <article className={`fw-analytics ${compact ? "is-compact" : ""}`}>
        <div className="fw-metric-row">
          {metricDefs.map((m, i) => (
            <button
              key={m.key}
              className={metric === m.key ? "is-active" : ""}
              onClick={() => {
                setMetric(m.key);
                if (m.key !== "visitors") setExpanded(true);
              }}
            >
              <span>
                {m.label}
                {m.key === "online" && <i className="fw-live-pulse" />}
              </span>
              <b>{m.value(factor[ctx.range] * (dataFilter ? 0.38 : 1))}</b>
              <small className={m.up ? "up" : "down"}>
                {m.delta}
                {i < 4 &&
                  (m.up ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  ))}
              </small>
            </button>
          ))}
        </div>
        <Chart metric={metric} ctx={ctx} dataFilter={dataFilter} />
      </article>
      {expanded && (
        <MetricModal
          metric={metric}
          ctx={ctx}
          close={() => setExpanded(false)}
        />
      )}
    </>
  );
}
function Chart({
  metric,
  ctx,
  large = false,
  dataFilter = null,
}: {
  metric: Metric;
  ctx: Ctx;
  large?: boolean;
  dataFilter?: string | null;
}) {
  const rawValues = charts[ctx.range];
  const targetPoints =
    ctx.granularity === "Semaine"
      ? 4
      : ctx.granularity === "Jour"
        ? 7
        : rawValues.length;
  const groupedValues = Array.from(
    { length: Math.min(targetPoints, rawValues.length) },
    (_, index) => {
      const start = Math.floor((index * rawValues.length) / targetPoints);
      const end = Math.max(
        start + 1,
        Math.floor(((index + 1) * rawValues.length) / targetPoints),
      );
      const bucket = rawValues.slice(start, end);
      return bucket.reduce((sum, value) => sum + value, 0) / bucket.length;
    },
  );
  const [hover, setHover] = useState<number | null>(null),
    values = groupedValues.map((v, i) =>
      Math.max(
        3,
        Math.round(
          v *
            scale[metric] *
            (1 + ctx.offset * 0.035) *
            (dataFilter ? 0.38 : 1) +
            (i % 3) * 2,
        ),
      ),
    ),
    max = Math.ceil(Math.max(...values) / 50) * 50,
    pts = values.map((v, i) => ({
      x: (i / (values.length - 1)) * 100,
      y: 42 - (v / max) * 36,
      v,
    })),
    line = pts
      .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" "),
    labels =
      ctx.granularity === "Semaine"
        ? ["S1", "S2", "S3", "S4"]
        : ctx.granularity === "Jour"
          ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
          : ctx.range.includes("24") || ctx.range === "Aujourd’hui"
        ? ["14h", "17h", "20h", "23h", "2h", "5h", "8h", "11h"]
        : ctx.range.includes("7")
          ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
          : ["1", "5", "9", "13", "17", "21", "25", "30"];
  return (
    <div className={`fw-chart ${large ? "is-large" : ""}`}>
      <div className="fw-y">
        <span>{max}</span>
        <span>{Math.round(max * 0.66)}</span>
        <span>{Math.round(max * 0.43)}</span>
        <span>{Math.round(max * 0.21)}</span>
        <span>0</span>
      </div>
      <svg
        viewBox="0 0 100 44"
        preserveAspectRatio="none"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - r.left) / r.width;
          setHover(
            Math.max(
              0,
              Math.min(
                values.length - 1,
                Math.round(ratio * (values.length - 1)),
              ),
            ),
          );
        }}
        onMouseLeave={() => setHover(null)}
      >
        {[6, 15, 24, 33, 42].map((y) => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} />
        ))}
        <defs>
          <linearGradient id={`fill-${metric}`} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#8dcdff" stopOpacity=".42" />
            <stop offset="1" stopColor="#8dcdff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L100 44 L0 44Z`} fill={`url(#fill-${metric})`} />
        <path
          d={line}
          fill="none"
          stroke="#76c5f7"
          strokeWidth=".75"
          vectorEffect="non-scaling-stroke"
        />
        {hover !== null && (
          <>
            <line
              className="fw-hover-line"
              x1={pts[hover].x}
              x2={pts[hover].x}
              y1="3"
              y2="42"
            />
            <circle
              cx={pts[hover].x}
              cy={pts[hover].y}
              r="1"
              fill="#fff"
              stroke="#45a9e7"
              strokeWidth=".7"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>
      {hover !== null && (
        <div
          className="fw-chart-tooltip"
          style={{ left: `${Math.min(88, Math.max(8, pts[hover].x))}%` }}
        >
          <span>
            {
              labels[
                Math.min(
                  labels.length - 1,
                  Math.floor(hover / (values.length / labels.length)),
                )
              ]
            }
          </span>
          <b>{values[hover].toLocaleString("fr-FR")}</b>
          <small>{metricDefs.find((m) => m.key === metric)?.label}</small>
        </div>
      )}
      <div className="fw-x">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}
function Breakdown({
  title,
  tabs,
  selected,
  onFilter,
}: {
  title: string;
  tabs: Record<string, string[][]>;
  selected: string | null;
  onFilter: (value: string | null) => void;
}) {
  const names = Object.keys(tabs),
    [active, setActive] = useState(names[0]);
  return (
    <article className="fw-card">
      <CardTabs
        tabs={names}
        active={active}
        setActive={(v) => {
          setActive(v);
          onFilter(null);
        }}
        total={selected ?? "Tous"}
      />
      <div className="fw-card-title">{title}</div>
      <div className="fw-data-bars">
        {tabs[active].map(([name, value], i) => (
          <button
            key={name}
            className={selected === name ? "is-filtered" : ""}
            onClick={() => onFilter(selected === name ? null : name)}
          >
            <span>{name}</span>
            <i>
              <b style={{ width: `${Math.max(18, 100 - i * 17)}%` }} />
            </i>
            <strong>{value}</strong>
            <em>
              <Filter size={13} />
            </em>
          </button>
        ))}
      </div>
    </article>
  );
}
function AnalyticsExtensions({
  selected,
  onFilter,
}: {
  selected: string | null;
  onFilter: (value: string | null) => void;
}) {
  const [goalTab, setGoalTab] = useState("Goal");
  const [answerTab, setAnswerTab] = useState("Answers");
  const [mapTab, setMapTab] = useState("Map");
  const mapRows: Record<string, Array<[string, number]>> = {
    Map: [
      ["France", 764],
      ["United States", 1284],
      ["United Kingdom", 412],
    ],
    Country: [
      ["France", 764],
      ["United States", 1284],
      ["United Kingdom", 412],
    ],
    Region: [
      ["Île-de-France", 486],
      ["California", 392],
      ["Greater London", 241],
    ],
    City: [
      ["Paris", 318],
      ["New York", 274],
      ["London", 226],
    ],
  };
  const toggle = (value: string) => onFilter(selected === value ? null : value);
  return (
    <div className="fw-analytics-extensions">
      <article className="fw-card fw-goal-card">
        <Segmented
          options={["Goal", "Funnel"]}
          active={goalTab}
          change={setGoalTab}
        />
        {goalTab === "Goal" ? (
          <div className="fw-goal">
            <strong>Book a call</strong>
            <b>274</b>
            <span>8.7% des visiteurs</span>
            <div>
              <i style={{ width: "68%" }} />
            </div>
          </div>
        ) : (
          <Funnel />
        )}
      </article>
      <article className="fw-card fw-map-card">
        <CardTabs
          tabs={["Map", "Country", "Region", "City"]}
          active={mapTab}
          setActive={setMapTab}
          total="Tous"
        />
        <div className="fw-mini-map">
          <span className="dot one" />
          <span className="dot two" />
          <span className="dot three" />
          <span className="dot four" />
        </div>
        <div className="fw-map-list">
          {mapRows[mapTab].map(([x, value]) => (
            <button
              key={x}
              className={selected === x ? "is-active" : ""}
              onClick={() => toggle(x)}
            >
              <span>{x}</span>
              <b>{value}</b>
            </button>
          ))}
        </div>
      </article>
      <article className="fw-card fw-goal-card">
        <Segmented
          options={["Answers", "Indexing", "Training"]}
          active={answerTab}
          change={setAnswerTab}
        />
        <div className="fw-answer-list">
          {answerTab === "Answers" ? (
            [
              ["ChatGPT", "184"],
              ["Perplexity", "72"],
              ["Claude", "41"],
            ].map(([x, v]) => (
              <button key={x} onClick={() => toggle(x)}>
                <span>{x}</span>
                <b>{v}</b>
              </button>
            ))
          ) : (
            <div className="fw-empty-analytics">
              <Sparkles size={20} />
              <b>{answerTab}</b>
              <span>Aucune donnée pour cette période</span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
function CardTabs({
  tabs,
  active,
  setActive,
  total,
}: {
  tabs: string[];
  active: string;
  setActive: (v: string) => void;
  total: string;
}) {
  return (
    <div className="fw-card-tabs">
      <div>
        {tabs.map((t) => (
          <button
            key={t}
            className={active === t ? "is-active" : ""}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <button>
        {total}
        <ChevronDown size={13} />
      </button>
    </div>
  );
}
function Ads({
  ctx,
  open,
  compare,
}: {
  ctx: Ctx;
  open: (n: string) => void;
  compare: () => void;
}) {
  const [network, setNetwork] = useState("Tous"),
    [sort, setSort] = useState("Performance"),
    shown = useMemo(
      () =>
        [
          ...(network === "Tous"
            ? ads
            : ads.filter((a) => a.network === network)),
        ].sort((a, b) =>
          sort === "Volume"
            ? b.clicks - a.clicks
            : sort === "Conversion"
              ? b.conversion - a.conversion
              : b.ctr - a.ctr,
        ),
      [network, sort],
    );
  return (
    <div className="fw-view">
      <Header title="Toutes les publicités" />
      <FilterStrip
        options={["Tous", "X Ads", "Meta", "Google", "LinkedIn"]}
        active={network}
        change={setNetwork}
        compare={compare}
      />
      <Segmented
        options={["Performance", "Volume", "Conversion"]}
        active={sort}
        change={setSort}
      />
      <div className="fw-tile-grid">
        {shown.map((a) => (
          <button
            className="fw-ad-tile"
            key={a.name}
            onClick={() => open(a.name)}
          >
            <div className="fw-ad-image">
              <Image
                src={AD}
                alt=""
                fill
                sizes="(max-width:700px) 100vw,25vw"
              />
            </div>
            <span className={`fw-status ${a.status.toLowerCase()}`}>
              {a.status}
            </span>
            <h2>{a.name}</h2>
            <p>
              {a.network} · {ctx.range}
            </p>
            <div>
              <span>
                <small>CTR</small>
                <b>{a.ctr}%</b>
              </span>
              <span>
                <small>Conversion</small>
                <b>{a.conversion}%</b>
              </span>
              <span>
                <small>Clics</small>
                <b>{num(Math.round(a.clicks * factor[ctx.range]))}</b>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
function Pages({ ctx, open }: { ctx: Ctx; open: (n: string) => void }) {
  const [tab, setTab] = useState("Toutes"),
    [sort, setSort] = useState("Visiteurs"),
    shown = useMemo(
      () =>
        [...pages].sort((a, b) =>
          sort === "Conversion"
            ? b.conversion - a.conversion
            : sort === "Rebond"
              ? a.bounce - b.bounce
              : b.visitors - a.visitors,
        ),
      [sort],
    );
  return (
    <div className="fw-view">
      <Header title="Toutes les pages" />
      <Segmented
        options={["Toutes", "Entrées", "Sorties"]}
        active={tab}
        change={setTab}
      />
      <Segmented
        options={["Visiteurs", "Conversion", "Rebond"]}
        active={sort}
        change={setSort}
      />
      <div className="fw-tile-grid fw-page-grid">
        {shown.map((p, i) => (
          <button
            className="fw-page-tile"
            key={p.path}
            onClick={() => open(p.name)}
          >
            <div className={`fw-page-preview tone-${i % 4}`}>
              <span>{p.path}</span>
              <div />
              <div />
              <i />
            </div>
            <h2>{p.name}</h2>
            <p>
              {p.path} · {tab}
            </p>
            <div>
              <span>
                <small>Visiteurs</small>
                <b>{num(Math.round(p.visitors * factor[ctx.range]))}</b>
              </span>
              <span>
                <small>Conversion</small>
                <b>{p.conversion}%</b>
              </span>
              <span>
                <small>Rebond</small>
                <b>{p.bounce}%</b>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
function Profiles({
  ctx,
  open,
  compare,
}: {
  ctx: Ctx;
  open: (n: string) => void;
  compare: () => void;
}) {
  const [sort, setSort] = useState("Part"),
    shown = useMemo(
      () =>
        [...profiles].sort((a, b) =>
          sort === "Conversion"
            ? b.conversion - a.conversion
            : sort === "Session"
              ? parseInt(b.session) - parseInt(a.session)
              : b.share - a.share,
        ),
      [sort],
    );
  return (
    <div className="fw-view">
      <Header
        title="Tous les profils"
        action={
          <button className="fw-dark-btn" onClick={compare}>
            <Layers3 size={16} />
            Comparer
          </button>
        }
      />
      <Segmented
        options={["Part", "Conversion", "Session"]}
        active={sort}
        change={setSort}
      />
      <div className="fw-profile-grid">
        {shown.map((p) => (
          <button key={p.name} onClick={() => open(p.name)}>
            <Image
              src={p.image}
              alt=""
              width={320}
              height={320}
              style={{ objectPosition: p.imagePosition }}
            />
            <div>
              <span>{p.name}</span>
              <b>{p.share}%</b>
            </div>
            <p>{p.signal}</p>
            <aside>
              <span>
                <small>Conversion</small>
                {p.conversion}%
              </span>
              <span>
                <small>Session</small>
                {p.session}
              </span>
              <span>
                <small>{ctx.range}</small>
                {Math.round((3137 * factor[ctx.range] * p.share) / 100)}
              </span>
            </aside>
          </button>
        ))}
      </div>
    </div>
  );
}
function Header({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="fw-view-head">
      <h1>{title}</h1>
      {action}
    </div>
  );
}
function Segmented({
  options,
  active,
  change,
}: {
  options: string[];
  active: string;
  change: (v: string) => void;
}) {
  return (
    <div className="fw-segmented">
      {options.map((o) => (
        <button
          key={o}
          className={active === o ? "is-active" : ""}
          onClick={() => change(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
function FilterStrip({
  options,
  active,
  change,
  compare,
}: {
  options: string[];
  active: string;
  change: (v: string) => void;
  compare: () => void;
}) {
  return (
    <div className="fw-filter-strip">
      <div>
        {options.map((o) => (
          <button
            key={o}
            className={active === o ? "is-active" : ""}
            onClick={() => change(o)}
          >
            {o}
          </button>
        ))}
      </div>
      <button onClick={compare}>
        <Layers3 size={15} />
        Comparer
      </button>
    </div>
  );
}
function FigmaAds({ open }: { open: (n: string) => void }) {
  return (
    <div className="fw-figma-list fw-ads-list">
      <div className="fw-figma-grid fw-figma-ads">
        {ads.concat(ads.slice(0, 2)).map((ad, index) => (
          <button key={`${ad.name}-${index}`} onClick={() => open(ad.name)}>
            <CreativePreview ad={ad} index={index} />
            <h2>{ad.name}</h2>
          </button>
        ))}
      </div>
    </div>
  );
}
function FigmaPages({ open }: { open: (n: string) => void }) {
  return (
    <div className="fw-figma-list">
      <div className="fw-figma-grid fw-figma-pages">
        {pages.concat(pages.slice(0, 2)).map((page, index) => (
          <button key={`${page.path}-${index}`} onClick={() => open(page.name)}>
            <PagePreview page={page} />
            <h2>{page.name}</h2>
          </button>
        ))}
      </div>
    </div>
  );
}
function CreativePreview({ ad, index }: { ad: (typeof ads)[number]; index: number }) {
  return <div className="fw-figma-preview fw-creative-preview">
    <Image src={AD} alt={`Aperçu de ${ad.name}`} fill sizes="(max-width: 760px) 50vw, 25vw" style={{ objectPosition: `${42 + (index % 4) * 12}% ${40 + (index % 3) * 12}%` }} />
  </div>;
}
function PagePreview({ page }: { page: (typeof pages)[number] }) {
  return <div className="fw-figma-preview fw-page-preview">
    <Image src={page.preview} alt={`Preview hero de ${page.name}`} fill sizes="(max-width: 760px) 50vw, 25vw" />
  </div>;
}
function FigmaProfiles({ open }: { open: (n: string) => void }) {
  return (
    <div className="fw-figma-list">
      <div className="fw-figma-profile-grid">
        {profiles.map((profile) => (
          <button
            key={profile.name}
            onClick={() => open(profile.name)}
          >
            <Image
              src={profile.image}
              alt=""
              width={320}
              height={320}
              style={{ objectPosition: profile.imagePosition }}
            />
            <span className="fw-profile-card-meta">
              <strong>{profile.name}</strong>
              <b>
                <i aria-hidden="true">•</i>
                {profile.share}%
                <svg viewBox="0 0 10 9" aria-hidden="true">
                  <path d="M.23 6.05 3.22.86C3.89-.28 5.54-.29 6.21.86l3.02 5.18c.67 1.15-.16 2.59-1.49 2.59H1.73C.4 8.63-.43 7.2.23 6.05Z" fill="currentColor" />
                </svg>
              </b>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
function ListSearch({ compare, search }: { compare: () => void; search: () => void }) {
  return (
    <div className="fw-list-search">
      <button onClick={search}>
        <Search size={20} />
        <span>Rechercher une page, une campagne ou un profil</span>
      </button>
      <button onClick={compare}>
        <SlidersHorizontal size={15} />
        Comparer
      </button>
    </div>
  );
}

function LivePagePreview({
  title,
  path,
  analytics,
}: {
  title: string;
  path: string;
  analytics: AnalyticsSummary | null;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [hovered, setHovered] = useState<{ label: string; count: number; kind: string; people: number; averageSeconds: number; x: number; y: number } | null>(null);
  const [heatmapReadout, setHeatmapReadout] = useState<{ label: string; reachPercent: number; people: number; averageSeconds: number } | null>(null);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [viewport, setViewport] = useState<AnalyticsViewport>("desktop");
  const pageScrollZones = useMemo(
    () => (analytics?.scrollZones ?? []).filter((item) => item.path === path && item.viewport === viewport),
    [analytics, path, viewport],
  );
  const pageSections = useMemo(
    () => (analytics?.pageSections ?? []).filter((item) => item.path === path && item.viewport === viewport),
    [analytics, path, viewport],
  );
  const scrollReachByZone = useMemo(() => pageScrollZones.reduce((map, item) => {
    map.set(item.zone, (map.get(item.zone) ?? 0) + item.value);
    return map;
  }, new Map<number, number>()), [pageScrollZones]);
  const maxScrollReach = Math.max(...scrollReachByZone.values(), 1);
  const pageObservedPeopleTotal = analytics?.scrollZoneTotals.find((item) => item.path === path && item.viewport === viewport)?.value ?? 0;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let disconnectFrame: (() => void) | undefined;
    const connect = () => {
      disconnectFrame?.();
      const document = frame.contentDocument;
      if (!document) return;
      const heatmapClass = "fw-injected-scroll-heatmap";
      const heatmapStyleClass = "fw-injected-scroll-heatmap-style";
      document.querySelector(`.${heatmapClass}`)?.remove();
      document.querySelector(`.${heatmapStyleClass}`)?.remove();
      if (heatmapEnabled) {
        const style = document.createElement("style");
        style.className = heatmapStyleClass;
        style.textContent = `.${heatmapClass}{position:absolute;inset:0 auto auto 0;width:100%;z-index:2147483000;pointer-events:none;mix-blend-mode:multiply}.fw-injected-scroll-heat-zone{position:absolute;left:0;width:100%;overflow:hidden;filter:blur(22px) saturate(1.55);background:radial-gradient(ellipse at 18% 38%,rgba(255,36,12,calc(var(--heat)*.95)) 0 7%,rgba(255,176,0,calc(var(--heat)*.78)) 19%,transparent 46%),radial-gradient(ellipse at 55% 42%,rgba(255,226,0,calc(var(--heat)*.82)) 0 9%,rgba(40,211,110,calc(var(--heat)*.58)) 28%,transparent 60%),radial-gradient(ellipse at 84% 62%,rgba(255,43,14,calc(var(--heat)*.95)) 0 8%,rgba(255,170,0,calc(var(--heat)*.74)) 20%,transparent 46%),linear-gradient(110deg,rgba(35,92,255,calc((1 - var(--heat))*.34)),rgba(35,171,255,calc((1 - var(--heat))*.22)) 45%,rgba(32,92,236,calc((1 - var(--heat))*.34)))}`;
        document.head.appendChild(style);
        const layer = document.createElement("div");
        layer.className = heatmapClass;
        const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, 1);
        const zoneHeight = documentHeight / 8;
        for (let zoneIndex = 0; zoneIndex < 8; zoneIndex += 1) {
          const zone = document.createElement("div");
          const reach = scrollReachByZone.get(zoneIndex) ?? 0;
          const intensity = pageScrollZones.length ? 0.08 + (reach / maxScrollReach) * 0.92 : 0.06;
          zone.className = "fw-injected-scroll-heat-zone";
          zone.style.top = `${zoneIndex * zoneHeight}px`;
          zone.style.height = `${zoneHeight + 18}px`;
          zone.style.setProperty("--heat", String(intensity));
          zone.dataset.scrollZone = String(zoneIndex);
          layer.appendChild(zone);
        }
        layer.style.height = `${documentHeight}px`;
        document.body.appendChild(layer);
      }
      const getSectionMetric = (element: Element) => {
        const section = element.closest("section[id], [data-analytics-section], main > section");
        const sectionId = section?.getAttribute("data-analytics-section") ?? section?.id;
        return sectionId ? pageSections.find((item) => item.id === sectionId) : undefined;
      };
      const getTarget = (element: Element) => {
        const target = element.closest("a,button,[data-analytics-cta]");
        const section = element.closest("section[id], [data-analytics-section], main > section");
        if (!target && element !== section) return null;
        const htmlTarget = (target ?? section) as HTMLElement;
        const label = (htmlTarget.textContent || htmlTarget.getAttribute("aria-label") || "Zone d’attention").replace(/\s+/g, " ").trim().slice(0, 58);
        const ctaId = target ? htmlTarget.dataset.analyticsCta : undefined;
        const href = target instanceof HTMLAnchorElement ? new URL(target.href, window.location.origin).pathname : "";
        const cta = ctaId ? analytics?.ctaDetails.find((item) => item.path === path && item.id === ctaId) : undefined;
        const navigation = target ? analytics?.navigationClicks.find((item) => item.path === path && item.destination === href) : undefined;
        const sectionMetric = getSectionMetric(target ?? section ?? element);
        return { label, count: cta?.value ?? navigation?.value ?? 0, kind: cta ? "CTA" : navigation ? "Navigation" : "Attention", people: sectionMetric?.reachedPeople ?? 0, averageSeconds: sectionMetric?.averageSeconds ?? 0 };
      };
      const updateHeatmapReadout = (clientY: number, element?: Element | null) => {
        if (!heatmapEnabled) return;
        const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, 1);
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const absoluteY = Math.max(0, Math.min(documentHeight - 1, scrollTop + clientY));
        const zone = Math.min(7, Math.floor((absoluteY / documentHeight) * 8));
        const people = scrollReachByZone.get(zone) ?? 0;
        const sectionElement = (element ?? document.elementFromPoint(Math.max(0, (document.defaultView?.innerWidth ?? 1) / 2), clientY))?.closest("section[id], [data-analytics-section], main > section");
        const sectionId = sectionElement?.getAttribute("data-analytics-section") ?? sectionElement?.id;
        const section = sectionId ? pageSections.find((item) => item.id === sectionId) : undefined;
        setHeatmapReadout({
          label: section?.label ?? "Défilement de page",
          people,
          reachPercent: pageObservedPeopleTotal ? Math.round((people / pageObservedPeopleTotal) * 100) : 0,
          averageSeconds: section?.averageSeconds ?? 0,
        });
      };
      const move = (event: MouseEvent) => {
        const target = getTarget(event.target as Element);
        const x = ((event.clientX / Math.max(document.documentElement.clientWidth, 1)) * 100);
        const y = ((event.clientY / Math.max(document.documentElement.clientHeight, 1)) * 100);
        setHovered(target ? { ...target, x, y } : null);
        updateHeatmapReadout(event.clientY, event.target as Element);
      };
      const clearHover = () => setHovered(null);
      const leaveDocument = (event: MouseEvent) => {
        if (!event.relatedTarget) clearHover();
      };
      document.addEventListener("mousemove", move, { passive: true });
      document.addEventListener("mouseover", move, { passive: true });
      document.addEventListener("mouseout", leaveDocument, { passive: true });
      frame.addEventListener("mouseleave", clearHover);
      const scroll = () => updateHeatmapReadout((document.defaultView?.innerHeight ?? 600) * 0.5);
      document.addEventListener("scroll", scroll, { passive: true });
      const resize = () => {
        if (!heatmapEnabled) return;
        frame.contentDocument?.querySelector(`.${heatmapClass}`)?.remove();
        frame.contentDocument?.querySelector(`.${heatmapStyleClass}`)?.remove();
        connect();
      };
      window.addEventListener("resize", resize);
      disconnectFrame = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseover", move);
        document.removeEventListener("scroll", scroll);
        document.removeEventListener("mouseout", leaveDocument);
        frame.removeEventListener("mouseleave", clearHover);
        window.removeEventListener("resize", resize);
      };
      return disconnectFrame;
    };
    frame.addEventListener("load", connect);
    if (frame.contentDocument?.readyState === "complete") connect();
    return () => {
      frame.removeEventListener("load", connect);
      disconnectFrame?.();
      setHeatmapReadout(null);
      frame.contentDocument?.querySelector(".fw-injected-scroll-heatmap")?.remove();
      frame.contentDocument?.querySelector(".fw-injected-scroll-heatmap-style")?.remove();
    };
  }, [analytics, path, pageSections, pageScrollZones, scrollReachByZone, maxScrollReach, pageObservedPeopleTotal, heatmapEnabled, viewport]);

  return (
    <section className="fw-interactive-preview-card fw-live-page-card" aria-label={`Preview live de ${title}`}>
      <header>
        <div className="fw-live-page-title">
          <h2>{title}</h2>
          <div className="fw-live-heatmap-control">
            <span>Heatmap</span>
            <button className={`fw-live-heatmap-toggle ${heatmapEnabled ? "is-active" : ""}`} onClick={() => setHeatmapEnabled((value) => !value)} aria-label="Activer ou désactiver la heatmap" aria-pressed={heatmapEnabled}>
              <i />
            </button>
          </div>
          <div className="fw-live-viewport-control" aria-label="Viewport de la donnée">
            {(["desktop", "tablet", "mobile"] as AnalyticsViewport[]).map((item) => (
              <button key={item} className={viewport === item ? "is-active" : ""} onClick={() => setViewport(item)} aria-pressed={viewport === item}>
                {item === "desktop" ? "Desktop" : item === "tablet" ? "Tablette" : "Mobile"}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className={`fw-live-page-frame is-${viewport}`}>
        <iframe ref={frameRef} title={`Page réelle ${title}`} src={path} />
        {hovered && <aside className="fw-live-hover-card is-hovered" style={{ left: `${Math.min(Math.max(hovered.x, 12), 78)}%`, top: `${Math.min(Math.max(hovered.y, 16), 72)}%` }}>
          <strong>{hovered.label}</strong>
          <span>{hovered.kind === "Attention" ? "Section observée" : `${hovered.kind} · ${num(hovered.count)} clics`}</span>
          <small>{hovered.people ? `${hovered.people} personnes observées dans cette section` : "Aucune personne observée pour cette section"}</small>
          <small>{hovered.averageSeconds ? `${Math.round(hovered.averageSeconds)} s d’attention moyenne dans cette section` : "Données d’attention en cours de collecte"}</small>
        </aside>}
        {heatmapEnabled && <aside className="fw-live-heatmap-readout" aria-live="polite">
          <strong>{heatmapReadout?.label ?? "Déplacez la souris sur la page"}</strong>
          <span>{heatmapReadout ? `${heatmapReadout.people} / ${pageObservedPeopleTotal} personnes observées (${heatmapReadout.reachPercent}%)` : "Données de scroll en cours de collecte"}</span>
          <small>{heatmapReadout?.averageSeconds ? `${Math.round(heatmapReadout.averageSeconds)} s d’attention moyenne dans cette section` : "Aucune durée mesurée pour cette section"}</small>
        </aside>}
      </div>
    </section>
  );
}

function InteractivePreview({
  title,
  path,
  image,
  analytics,
  kind,
}: {
  title: string;
  path: string;
  image: string;
  analytics: AnalyticsSummary | null;
  kind: "page" | "ad";
}) {
  const [active, setActive] = useState<string | null>(null);
  if (kind === "page") return <LivePagePreview title={title} path={path} analytics={analytics} />;
  const adCtas = analytics?.ctas.reduce((sum, item) => sum + item.value, 0) ?? 0;
  const hotspots = [
    { id: "creative-cta", label: "CTA de la publicité", count: analytics?.ctas[0]?.value ?? 0, className: "fw-interactive-hotspot-ad" },
  ];
  return (
    <section className="fw-interactive-preview-card" aria-label={`Preview interactive de ${title}`}>
      <header>
        <div>
          <span>Preview interactive</span>
          <h2>{title}</h2>
        </div>
        <small>{path}</small>
      </header>
      <div className={`fw-interactive-preview ${kind === "ad" ? "is-ad" : ""}`}>
        <Image src={image} alt={`Preview de ${title}`} fill sizes="(max-width: 900px) 100vw, 760px" />
        <div className="fw-interactive-preview-shade" />
        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            className={`${hotspot.className} ${active === hotspot.id ? "is-active" : ""}`}
            onMouseEnter={() => setActive(hotspot.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(hotspot.id)}
            onBlur={() => setActive(null)}
            aria-label={`${hotspot.label}: ${hotspot.count} clics`}
          >
            <span>{hotspot.label}</span>
            <b>{num(hotspot.count)} clics</b>
          </button>
        ))}
        <div className="fw-interactive-preview-hint"><MousePointer2 size={14} /> Survole les zones suivies</div>
      </div>
      <footer>
        <span><MousePointer2 size={14} /> CTA suivis : {num(adCtas)}</span>
        <span>Navigation : 0</span>
      </footer>
    </section>
  );
}

function DetailView({
  detail,
  initialAnalytics,
  compareMetric,
  onCompareMetricChange,
  compareRelative,
  comparisonPair,
  onStickyControlsChange,
}: {
  detail: NonNullable<Detail>;
  ctx: Ctx;
  initialAnalytics: AnalyticsSummary | null;
  compareMetric: MetricKey | null;
  onCompareMetricChange: (value: MetricKey | null) => void;
  compareRelative: boolean;
  comparisonPair: string | null;
  onStickyControlsChange: (controls: ReactNode | null) => void;
}) {
  if (detail.type === "ad") {
    const selectedAd = ads.find((ad) => ad.name === detail.name) ?? ads[0];
    return (
      <div className="fw-detail fw-ad-detail">
        <aside>
          <h1>We’re hiring a remote closer.</h1>
          <Image src={AD} alt="Créatif publicitaire" width={520} height={580} />
          <div className="fw-targets">
            <span className="fw-target-country"><img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedAd.countryCode.toUpperCase()}.svg`} alt="" /><span>{selectedAd.country}</span><em>Targeted country</em></span>
            <span>SaaS founders</span>
            <span>utm_campaign=founder-04</span>
          </div>
        </aside>
        <section>
          {INTERACTIVE_PREVIEWS_ENABLED && <InteractivePreview title={selectedAd.name} path={`ad:${selectedAd.name}`} image={AD} analytics={initialAnalytics} kind="ad" />}
          <ExactAnalyticsDashboard mode="ad" scope={detail.name} linkedPagePath={adLandingPaths[selectedAd.name]} analytics={initialAnalytics} compareMetric={compareMetric} onCompareMetricChange={onCompareMetricChange} compareRelative={compareRelative} comparisonPair={comparisonPair} onStickyControlsChange={onStickyControlsChange} />
        </section>
      </div>
    );
  }
  return (
    <div className="fw-view fw-analytics-detail">
      {detail.type === "page" && (() => {
        const selectedPage = pages.find((page) => page.name === detail.name) ?? pages[0];
        return INTERACTIVE_PREVIEWS_ENABLED && <InteractivePreview title={selectedPage.name} path={selectedPage.path} image={selectedPage.preview} analytics={initialAnalytics} kind="page" />;
      })()}
      <ExactAnalyticsDashboard
        mode={detail.type === "profile" ? "profile" : "page"}
        scope={detail.name}
        analytics={initialAnalytics}
        compareMetric={compareMetric}
        onCompareMetricChange={onCompareMetricChange}
        compareRelative={compareRelative}
        comparisonPair={comparisonPair}
        onStickyControlsChange={onStickyControlsChange}
      />
    </div>
  );
}
function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MousePointer2;
  label: string;
  value: string;
}) {
  return (
    <article>
      <span>
        <Icon size={17} />
      </span>
      <p>{label}</p>
      <b>{value}</b>
      <small>+12%</small>
    </article>
  );
}
function Funnel() {
  return (
    <div className="fw-funnel">
      {[
        ["Visite", 100],
        ["Engagé", 76],
        ["Évaluation", 44],
        ["Prêt", 22],
        ["Converti", 9],
      ].map(([l, v]) => (
        <div key={l as string}>
          <span>{l}</span>
          <i style={{ width: `${v}%` }}>{v}%</i>
        </div>
      ))}
    </div>
  );
}
function MetricModal({
  metric,
  ctx,
  close,
}: {
  metric: Metric;
  ctx: Ctx;
  close: () => void;
}) {
  const d = metricDefs.find((m) => m.key === metric)!;
  return (
    <div className="fw-overlay" onMouseDown={close}>
      <section
        className="fw-metric-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header>
          <div>
            <span>{ctx.range}</span>
            <h2>{d.label}</h2>
          </div>
          <button aria-label="Fermer" onClick={close}>
            <X size={18} />
          </button>
        </header>
        <Chart metric={metric} ctx={ctx} large />
        <div className="fw-modal-stats">
          <span>
            <small>Moyenne</small>
            <b>{d.value(factor[ctx.range])}</b>
          </span>
          <span>
            <small>Meilleur segment</small>
            <b>Décideurs rapides</b>
          </span>
          <span>
            <small>Évolution</small>
            <b>+12.4%</b>
          </span>
        </div>
      </section>
    </div>
  );
}
function Live() {
  const visitors = [
    { code: "in", country: "India", city: "Bengaluru", page: "/pricing", device: "Desktop", source: "Google", lat: 12.97, lon: 77.59, color: "#85d5ff" },
    { code: "fr", country: "France", city: "Paris", page: "/", device: "Mobile", source: "Direct", lat: 48.86, lon: 2.35, color: "#bfaaff" },
    { code: "us", country: "United States", city: "New York", page: "/work", device: "Desktop", source: "X", lat: 40.71, lon: -74.01, color: "#ffbf83" },
    { code: "gb", country: "United Kingdom", city: "London", page: "/process", device: "Desktop", source: "Google", lat: 51.51, lon: -0.13, color: "#a5e3ba" },
    { code: "au", country: "Australia", city: "Sydney", page: "/booking", device: "Mobile", source: "Meta", lat: -33.87, lon: 151.21, color: "#ff9da9" },
    { code: "ca", country: "Canada", city: "Toronto", page: "/services/saas", device: "Desktop", source: "Direct", lat: 43.65, lon: -79.38, color: "#91b8ff" },
  ];
  const [tab, setTab] = useState<"Visitors" | "Activity">("Visitors");
  const [summaryTab, setSummaryTab] = useState<"Countries" | "Pages" | "Devices">("Countries");
  const [selected, setSelected] = useState(0);
  const [visitorOverlay, setVisitorOverlay] = useState(false);
  const [rotation, setRotation] = useState<[number, number]>([18, -18]);
  const [drag, setDrag] = useState<{ x: number; y: number; rotation: [number, number] } | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setTick((value) => value + 1), 3500); return () => window.clearInterval(timer); }, []);
  const collection = useMemo(() => feature(world as any, (world as any).objects.countries) as any, []);
  const projection = useMemo(() => geoOrthographic().translate([380, 380]).scale(342).rotate(rotation).clipAngle(90), [rotation]);
  const mapPath = useMemo(() => geoPath(projection), [projection]);
  const countries = useMemo(() => collection.features.map((item: any, index: number) => <path key={index} d={mapPath(item) ?? ""} />), [collection, mapPath]);
  const graticule = useMemo(() => mapPath(geoGraticule()()) ?? "", [mapPath]);
  const projectedVisitors = visitors.map((visitor, index) => ({ ...visitor, index, point: projection([visitor.lon, visitor.lat]) })).filter((visitor): visitor is typeof visitor & { point: [number, number] } => Boolean(visitor.point));
  const selectedVisitor = visitors[selected];
  const summary = summaryTab === "Countries"
    ? visitors.map((visitor) => visitor.country)
    : summaryTab === "Pages"
      ? visitors.map((visitor) => visitor.page)
      : visitors.map((visitor) => visitor.device);
  return <div className="fw-live-view">
    <div className="fw-live-globe-shell">
      <svg className="fw-live-globe" viewBox="0 0 760 760" role="img" aria-label="Globe interactif des visiteurs en direct" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDrag({ x: event.clientX, y: event.clientY, rotation }); }} onPointerMove={(event) => { if (!drag) return; setRotation([drag.rotation[0] + (event.clientX - drag.x) * .28, Math.max(-58, Math.min(58, drag.rotation[1] - (event.clientY - drag.y) * .2))]); }} onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}>
        <defs><radialGradient id="live-globe-fill" cx="34%" cy="28%"><stop offset="0" stopColor="#244a78" /><stop offset=".7" stopColor="#112d52" /><stop offset="1" stopColor="#091b36" /></radialGradient><filter id="live-glow"><feGaussianBlur stdDeviation="4" /></filter></defs>
        <circle cx="380" cy="380" r="350" className="fw-live-globe-orbit" /><circle cx="380" cy="380" r="342" fill="url(#live-globe-fill)" />
        <path d={graticule} className="fw-live-graticule" />
        <g className="fw-live-countries">{countries}</g>
        {projectedVisitors.map((visitor) => <g key={visitor.city} className={`fw-live-point ${selected === visitor.index ? "is-selected" : ""}`} onClick={() => { setSelected(visitor.index); setVisitorOverlay(true); }} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && (setSelected(visitor.index), setVisitorOverlay(true))}>
          <circle cx={visitor.point[0]} cy={visitor.point[1]} r="16" fill={visitor.color} opacity=".22" filter="url(#live-glow)" /><circle cx={visitor.point[0]} cy={visitor.point[1]} r="7" fill={visitor.color} /><circle cx={visitor.point[0]} cy={visitor.point[1]} r="3" fill="#fff" />
        </g>)}
      </svg>
      <p className="fw-live-rotate-hint">Drag to rotate the globe</p>
      <section className="fw-live-summary">
        <header><b><BarChart3 size={19} />Live visitors</b><span><i />{58 + (tick % 4)} online now</span></header>
        <nav>{(["Countries", "Pages", "Devices"] as const).map((item) => <button key={item} className={summaryTab === item ? "is-active" : ""} onClick={() => setSummaryTab(item)}>{item}</button>)}</nav>
        <div className="fw-live-summary-list">{summary.slice(0, 4).map((item, index) => <button key={`${item}-${index}`} className={selected === index ? "is-active" : ""} onClick={() => setSelected(index)}><span>{summaryTab === "Countries" && <img className="fw-live-flag" src={`https://flagcdn.com/w40/${visitors[index].code}.png`} alt="" />}{item}</span><b>{[25, 12, 8, 5][index]}</b></button>)}</div>
      </section>
      <section className="fw-live-selected"><span><img className="fw-live-flag" src={`https://flagcdn.com/w40/${selectedVisitor.code}.png`} alt="" />{selectedVisitor.country}</span><b>{selectedVisitor.city}</b><p>{selectedVisitor.page} · {selectedVisitor.device} · {selectedVisitor.source}</p></section>
      {visitorOverlay && <div className="fw-live-visitor-overlay" role="dialog" aria-label={`Live session in ${selectedVisitor.city}`}>
        <button className="fw-live-overlay-close" aria-label="Close visitor details" onClick={() => setVisitorOverlay(false)}><X /></button>
        <span className="fw-live-overlay-kicker"><img className="fw-live-flag" src={`https://flagcdn.com/w40/${selectedVisitor.code}.png`} alt="" />Live session</span>
        <h2>{selectedVisitor.city}, {selectedVisitor.country}</h2>
        <p className="fw-live-overlay-page">Currently viewing <b>{selectedVisitor.page}</b></p>
        <div className="fw-live-overlay-grid"><span><small>Session</small><b>04m 18s</b></span><span><small>Device</small><b>{selectedVisitor.device}</b></span><span><small>Source</small><b>{selectedVisitor.source}</b></span><span><small>Last action</small><b>CTA viewed</b></span></div>
        <div className="fw-live-overlay-route"><i />Entered via {selectedVisitor.source.toLowerCase()} · 3 pages viewed · 1 active session</div>
      </div>}
      <section className="fw-live-feed">
        <div>{(["Visitors", "Activity"] as const).map((item) => <button className={tab === item ? "is-active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
        {(tab === "Visitors" ? visitors : visitors.slice().reverse()).slice(0, 4).map((visitor, index) => <button key={`${visitor.city}-${tab}`} onClick={() => setSelected(visitors.indexOf(visitor))}><span className="fw-live-activity-dot" style={{ background: visitor.color }} /><strong><img className="fw-live-flag" src={`https://flagcdn.com/w40/${visitor.code}.png`} alt="" />{visitor.city}</strong><em>{tab === "Visitors" ? visitor.page : `${visitor.source} → ${visitor.page}`}</em><small>{index === 0 ? "now" : `${index + 1} min ago`}</small></button>)}
      </section>
    </div>
  </div>;
}
function NotificationsPanel({ close, analytics }: { close: () => void; analytics: AnalyticsSummary | null }) {
  const items = [
    analytics?.online ? { title: `${analytics.online} visiteurs en direct`, detail: "Une activité est actuellement observée sur le site." } : null,
    analytics?.ctaClicks ? { title: `${analytics.ctaClicks} clics CTA enregistrés`, detail: "Les interactions des appels à l’action ont été mises à jour." } : null,
    analytics?.conversions ? { title: `${analytics.conversions} conversions observées`, detail: "Consultez les détails dans les statistiques et les profils." } : null,
  ].filter(Boolean) as Array<{ title: string; detail: string }>;
  const visibleItems = items.length ? items : [{ title: "Aucune notification récente", detail: "Les alertes liées aux visites, CTA et conversions apparaîtront ici." }];
  return <div className="fw-notification-layer" role="presentation" onMouseDown={close}>
    <aside className="fw-notification-panel" role="dialog" aria-label="Notifications" onMouseDown={(event) => event.stopPropagation()}>
      <header><strong>Notifications</strong><button onClick={close} aria-label="Fermer"><X size={17} /></button></header>
      <div>{visibleItems.map((item) => <article key={item.title}><i /><span><b>{item.title}</b><small>{item.detail}</small></span></article>)}</div>
    </aside>
  </div>;
}

function SearchOverlay({
  query,
  setQuery,
  close,
  submit,
  candidates,
  onFilter,
  onMetric,
}: {
  query: string;
  setQuery: (v: string) => void;
  close: () => void;
  submit: (v: string, selectedTargets?: string[]) => void | Promise<void>;
  candidates: ComparisonCandidate[];
  onFilter: (value: string) => void;
  onMetric: (metric: MetricKey, label: string) => void;
}) {
  const { suggestions } = useComparisonSuggestions(query, candidates);
  const normalizedQuery = normalizeSearch(query);
  const compareRequested = /\b(compar|compare|versus|vs|contre)\w*\b|\savec\s/.test(normalizedQuery);
  const metricRequested = /\b(graph|graphique|evolution|tendance|courbe|taux|trafic|visiteurs?|sessions?|pages?|conversion|rebond|scroll|cta|clics?)\b/.test(normalizedQuery);
  const metric = parseComparisonRequest(query).metric;
  const metricLabels: Partial<Record<MetricKey, string>> = {
    visitors: "Visiteurs", sessions: "Sessions", views: "Pages vues", engaged: "Sessions engagées",
    conversion: "Taux de conversion", bounce: "Taux de rebond", scroll: "Profondeur de scroll", cta: "Clics CTA", bookings: "Réservations",
  };
  const commandWords = new Set(["comparer", "compare", "comparaison", "details", "close details", "ouvrir le menu"]);
  const exactTargets = candidates
    .map((candidate) => ({ candidate, normalizedLabel: normalizeSearch(candidate.label), index: normalizedQuery.indexOf(normalizeSearch(candidate.label)) }))
    .filter((item) => item.normalizedLabel.length > 1 && item.index >= 0 && !commandWords.has(item.normalizedLabel))
    .sort((a, b) => a.index - b.index || Number(b.candidate.kind === "Pays") - Number(a.candidate.kind === "Pays"))
    .filter((item, index, list) => list.findIndex((other) => other.candidate.label === item.candidate.label) === index)
    .map((item) => item.candidate);
  const uniqueSuggestions = suggestions.filter((candidate, index, list) => list.findIndex((item) => item.label === candidate.label) === index);
  const firstComparisonTarget = exactTargets[0] ?? uniqueSuggestions[0];
  const compatibleTargets = firstComparisonTarget
    ? [...exactTargets.slice(1), ...uniqueSuggestions, ...candidates]
        .filter((candidate) => candidate.kind === firstComparisonTarget.kind && candidate.label !== firstComparisonTarget.label)
        .filter((candidate, index, list) => list.findIndex((item) => item.label === candidate.label) === index)
    : [];
  const exactCompatibleTarget = exactTargets.slice(1).find((candidate) => candidate.kind === firstComparisonTarget?.kind);
  const comparisonPairs: Array<[ComparisonCandidate, ComparisonCandidate]> = firstComparisonTarget
    ? (exactCompatibleTarget
        ? [[firstComparisonTarget, exactCompatibleTarget]]
        : compatibleTargets.slice(0, 5).map((candidate) => [firstComparisonTarget, candidate]))
    : [];
  const displaySuggestions = suggestions
    .filter((candidate, index, list) => {
      const first = list.findIndex((item) => item.label === candidate.label);
      if (first === index) return !list.some((item, itemIndex) => itemIndex > index && item.label === candidate.label && item.kind === "Pays");
      return candidate.kind === "Pays" && !list.slice(0, index).some((item) => item.label === candidate.label && item.kind === "Pays");
    })
    .slice(0, 8);
  const runPrimary = () => {
    if (compareRequested && comparisonPairs[0]) return submit(query, comparisonPairs[0].map((item) => item.label));
    if (metricRequested) return onMetric(metric, metricLabels[metric] ?? "Visiteurs");
    if (displaySuggestions[0]) return onFilter(displaySuggestions[0].label);
  };
  return (
    <div className="fw-overlay fw-command-layer" onMouseDown={close}>
      <section
        className="fw-command-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="fw-command-field">
          <Search size={22} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" ? close() : e.key === "Enter" && runPrimary()}
            placeholder="Rechercher avec Jeff…"
          />
          <kbd>Esc</kbd>
        </div>
        <div className="fw-command-results" role="listbox" aria-label="Résultats de recherche">
          {compareRequested && comparisonPairs.map((pair, index) => <button key={`${pair[0].kind}-${pair[0].label}-${pair[1].label}`} className={index === 0 ? "is-primary" : ""} onClick={() => submit(query, pair.map((item) => item.label))} role="option">
            <i className="is-compare"><FigmaCompareIcon /></i>
            <span><b>Comparer {pair[0].label} et {pair[1].label}</b><small>Comparaison · {pair[0].kind} · {metricLabels[metric] ?? "Visiteurs"}</small></span>
          </button>)}
          {!compareRequested && metricRequested && <button onClick={() => onMetric(metric, metricLabels[metric] ?? "Visiteurs")} role="option">
            <i><BarChart3 size={18} /></i>
            <span><b>Afficher l’évolution — {metricLabels[metric] ?? "Visiteurs"}</b><small>Graphique principal</small></span>
          </button>}
          {!compareRequested && displaySuggestions.map((candidate) => <button key={`${candidate.kind}-${candidate.label}`} onClick={() => onFilter(candidate.label)} role="option">
            <i><Filter size={17} /></i>
            <span><b>{candidate.label}</b><small>Filtrer par {candidate.kind.toLocaleLowerCase("fr-FR")}</small></span>
            {typeof candidate.value === "number" && <em>{num(candidate.value)}</em>}
          </button>)}
          {!query.trim() && <p>Tapez un pays, une page, une métrique ou une comparaison.</p>}
        </div>
      </section>
    </div>
  );
}
function Compare({
  close,
  apply,
}: {
  close: () => void;
  apply: (v: string[]) => void;
}) {
  const opts = [
      "Page /pricing",
      "Page /work",
      "UTM founder-04",
      "X Ads",
      "Google Ads",
      "Profil Chercheurs de preuves",
      "France",
      "Mobile",
    ],
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState<string[]>([
      "Page /pricing",
      "Page /work",
    ]),
    toggle = (i: string) =>
      setSelected((c) =>
        c.includes(i) ? c.filter((v) => v !== i) : [...c, i],
      );
  return (
    <div className="fw-overlay" onMouseDown={close}>
      <section
        className="fw-compare-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header>
          <div>
            <h2>Comparer des dimensions</h2>
            <p>Pages, publicités, profils, UTMs et sources.</p>
          </div>
          <button aria-label="Fermer" onClick={close}>
            <X size={18} />
          </button>
        </header>
        <label>
          <Search size={18} />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une métrique ou une dimension"
          />
        </label>
        <div className="fw-compare-options">
          {opts
            .filter((i) => i.toLowerCase().includes(search.toLowerCase()))
            .map((i) => (
              <button
                key={i}
                className={selected.includes(i) ? "is-active" : ""}
                onClick={() => toggle(i)}
              >
                <span>{i}</span>
                {selected.includes(i) && <Check size={15} />}
              </button>
            ))}
        </div>
        <footer>
          <span>{selected.length} éléments sélectionnés</span>
          <button onClick={() => apply(selected)}>
            Afficher la comparaison
            <ArrowRight size={15} />
          </button>
        </footer>
      </section>
    </div>
  );
}
function num(v: number) {
  return v >= 1000
    ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`
    : v.toLocaleString("fr-FR");
}

function QuickCompare({
  close,
  compareRelative,
  setCompareRelative,
  setMetric,
  interpret,
  candidates,
  setComparisonPair,
  apply,
}: {
  close: () => void;
  compareRelative: boolean;
  setCompareRelative: (value: boolean) => void;
  setMetric: (value: MetricKey | null) => void;
  interpret: (value: string) => Promise<{ pair: string; metric: MetricKey }>;
  candidates: ComparisonCandidate[];
  setComparisonPair: (value: string | null) => void;
  apply: (v: string[]) => void;
}) {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<ComparisonCandidate[]>([]);
  const { suggestions, loading, provider } = useComparisonSuggestions(value, candidates);
  const toggle = (candidate: ComparisonCandidate) => setSelected((current) => {
    const exists = current.some((item) => item.label === candidate.label && item.kind === candidate.kind);
    if (exists) return current.filter((item) => item.label !== candidate.label || item.kind !== candidate.kind);
    if (current[0] && current[0].kind !== candidate.kind) return [candidate];
    return current.length < 2 ? [...current, candidate] : [current[1], candidate];
  });
  const submit = async (text: string, selectedTargets = selected.map((item) => item.label)) => {
    if (text.trim()) {
      const parsed = await interpret(text);
      const pair = selectedTargets.length === 2 ? `${selectedTargets[0]} avec ${selectedTargets[1]}` : parsed.pair;
      setComparisonPair(pair);
      setMetric(parsed.metric);
      setCompareRelative(false);
      apply([pair]);
    }
  };
  return (
    <div className="fw-quick-compare-shell" onMouseDown={close}>
      <section
        className="fw-quick-compare"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div>
          <Search size={18} />
          <input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit(value || selected.map((item) => item.label).join(" avec "))}
            placeholder="Comparer n’importe quelle donnée"
          />
          <button aria-label="Fermer" onClick={close}>
            <X size={16} />
          </button>
        </div>
        <div className="fw-chart-compare-row">
          <span>Comparer relativement</span>
          <button className={`fw-chart-compare-toggle ${compareRelative ? "is-on" : ""}`} aria-label="Comparer relativement" aria-pressed={compareRelative} onClick={() => setCompareRelative(!compareRelative)}><i /></button>
        </div>
        <div className="fw-smart-search-head fw-smart-search-head-compact">
          <span><Sparkles size={13} />{loading ? "Recherche…" : `${suggestions.length} options`}</span>
          <small>{provider === "jev" ? "Jeff" : "Données disponibles"}</small>
        </div>
        {selected.length > 0 && <div className="fw-smart-selected">
          {selected.map((item) => <button key={`${item.kind}-${item.label}`} onClick={() => toggle(item)}>{item.label}<X size={11} /></button>)}
          <span>{selected.length}/2</span>
        </div>}
        <div className="fw-smart-results fw-smart-results-compact" role="listbox" aria-label="Options de comparaison">
          {suggestions.filter((candidate) => !selected[0] || candidate.kind === selected[0].kind).map((candidate) => {
            const active = selected.some((item) => item.label === candidate.label && item.kind === candidate.kind);
            return <button key={`${candidate.kind}-${candidate.label}`} className={active ? "is-selected" : ""} onClick={() => toggle(candidate)} role="option" aria-selected={active}>
              <span><b>{candidate.label}</b><small>{candidate.kind}</small></span>
              {active ? <Check size={14} /> : <Plus size={14} />}
            </button>;
          })}
        </div>
        <button className="fw-smart-apply" disabled={selected.length !== 2 && !value.trim()} onClick={() => submit(value || selected.map((item) => item.label).join(" avec "))}>
          {selected.length === 2 ? `Comparer ${selected[0].label} et ${selected[1].label}` : "Laisser Jeff choisir"}<ArrowRight size={13} />
        </button>
      </section>
    </div>
  );
}
