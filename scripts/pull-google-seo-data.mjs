import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { google } from "googleapis";

const root = process.cwd();
const keyFile = path.resolve(
  root,
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    ".secrets/ruff-seo-reader.json",
);
const siteUrl = process.env.GSC_SITE_URL || "sc-domain:ruff.agency";
const propertyId = process.env.GA4_PROPERTY_ID || "523661734";
const lookbackDays = Number(process.env.SEO_LOOKBACK_DAYS || 28);
const outputDir = path.resolve(root, ".data/seo");
const historyDir = path.join(outputDir, "history");

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function aggregateSearchConsole(rows, dimensionIndex) {
  const grouped = new Map();

  for (const row of rows) {
    const key = row.keys?.[dimensionIndex] || "(non défini)";
    const current = grouped.get(key) || {
      value: key,
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
    };
    const impressions = number(row.impressions);
    current.clicks += number(row.clicks);
    current.impressions += impressions;
    current.weightedPosition += number(row.position) * impressions;
    grouped.set(key, current);
  }

  return [...grouped.values()]
    .map((item) => ({
      value: item.value,
      clicks: item.clicks,
      impressions: item.impressions,
      ctr: item.impressions ? item.clicks / item.impressions : 0,
      position: item.impressions
        ? item.weightedPosition / item.impressions
        : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
}

function aggregateGaRows(rows) {
  const grouped = new Map();

  for (const row of rows) {
    const page = row.dimensionValues?.[0]?.value || "(non défini)";
    const current = grouped.get(page) || {
      page,
      sessions: 0,
      activeUsers: 0,
      engagedSessions: 0,
      keyEvents: 0,
    };
    current.sessions += number(row.metricValues?.[0]?.value);
    current.activeUsers += number(row.metricValues?.[1]?.value);
    current.engagedSessions += number(row.metricValues?.[2]?.value);
    current.keyEvents += number(row.metricValues?.[3]?.value);
    grouped.set(page, current);
  }

  return [...grouped.values()].sort(
    (a, b) => b.sessions - a.sessions || b.activeUsers - a.activeUsers,
  );
}

function markdownTable(headers, rows) {
  return [
    "| " + headers.join(" | ") + " |",
    "| " + headers.map(() => "---").join(" | ") + " |",
    ...rows.map((row) => "| " + row.join(" | ") + " |"),
  ].join("\n");
}

await access(keyFile);

const end = new Date();
end.setUTCDate(end.getUTCDate() - 1);
const start = new Date(end);
start.setUTCDate(start.getUTCDate() - lookbackDays + 1);
const startDate = isoDate(start);
const endDate = isoDate(end);

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/analytics.readonly",
  ],
});

const searchConsole = google.searchconsole({ version: "v1", auth });
const analytics = google.analyticsdata({ version: "v1beta", auth });

const [
  searchResponse,
  searchTotalsResponse,
  gaSummaryResponse,
  gaPagesResponse,
] =
  await Promise.all([
    searchConsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query", "page"],
        rowLimit: 25000,
        dataState: "final",
      },
    }),
    searchConsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        rowLimit: 1,
        dataState: "final",
      },
    }),
    analytics.properties.runReport({
      property: "properties/" + propertyId,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "engagedSessions" },
          { name: "keyEvents" },
        ],
      },
    }),
    analytics.properties.runReport({
      property: "properties/" + propertyId,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "landingPagePlusQueryString" }],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "engagedSessions" },
          { name: "keyEvents" },
        ],
        limit: "10000",
      },
    }),
  ]);

const searchRows = searchResponse.data.rows || [];
const searchTotals = searchTotalsResponse.data.rows?.[0] || {};
const gaSummary = gaSummaryResponse.data.rows?.[0]?.metricValues || [];
const queries = aggregateSearchConsole(searchRows, 0);
const searchPages = aggregateSearchConsole(searchRows, 1);
const landingPages = aggregateGaRows(gaPagesResponse.data.rows || []);
const report = {
  generatedAt: new Date().toISOString(),
  period: { startDate, endDate, lookbackDays },
  sources: {
    searchConsole: { siteUrl },
    analytics: { propertyId },
  },
  analytics: {
    totals: {
      sessions: number(gaSummary[0]?.value),
      activeUsers: number(gaSummary[1]?.value),
      engagedSessions: number(gaSummary[2]?.value),
      keyEvents: number(gaSummary[3]?.value),
    },
    landingPages,
  },
  searchConsole: {
    totals: {
      clicks: number(searchTotals.clicks),
      impressions: number(searchTotals.impressions),
      ctr: number(searchTotals.ctr),
      position: number(searchTotals.position),
    },
    queries,
    pages: searchPages,
  },
  opportunities: {
    queries: queries.filter(
      (item) =>
        item.impressions >= 5 &&
        item.position >= 3 &&
        item.position <= 20 &&
        item.ctr < 0.15,
    ),
    pages: searchPages.filter(
      (item) =>
        item.impressions >= 5 &&
        item.position >= 3 &&
        item.position <= 20 &&
        item.ctr < 0.15,
    ),
  },
};

const topQueries = report.searchConsole.queries.slice(0, 20);
const topSearchPages = report.searchConsole.pages.slice(0, 20);
const topLandingPages = report.analytics.landingPages.slice(0, 20);
const formatPercent = (value) => (value * 100).toFixed(1) + "%";

const markdown = [
  "# Rapport SEO Ruff Agency",
  "",
  "Période : " + startDate + " → " + endDate,
  "",
  "## Synthèse",
  "",
  "- Sessions GA4 : " + report.analytics.totals.sessions,
  "- Utilisateurs actifs : " + report.analytics.totals.activeUsers,
  "- Sessions engagées : " + report.analytics.totals.engagedSessions,
  "- Événements clés : " + report.analytics.totals.keyEvents,
  "- Clics Search Console : " + report.searchConsole.totals.clicks,
  "- Impressions Search Console : " + report.searchConsole.totals.impressions,
  "- Position moyenne : " + report.searchConsole.totals.position.toFixed(1),
  "",
  "## Opportunités immédiates",
  "",
  ...(report.opportunities.pages.length
    ? report.opportunities.pages.map(
        (item) =>
          "- " +
          item.value +
          " — " +
          item.impressions +
          " impressions, position " +
          item.position.toFixed(1) +
          ", CTR " +
          formatPercent(item.ctr),
      )
    : ["- Pas encore assez de données pour isoler une opportunité fiable."]),
  "",
  "## Requêtes Search Console",
  "",
  markdownTable(
    ["Requête", "Clics", "Impressions", "CTR", "Position"],
    topQueries.map((item) => [
      item.value.replaceAll("|", "\\|"),
      item.clicks,
      item.impressions,
      formatPercent(item.ctr),
      item.position.toFixed(1),
    ]),
  ),
  "",
  "## Pages Search Console",
  "",
  markdownTable(
    ["Page", "Clics", "Impressions", "CTR", "Position"],
    topSearchPages.map((item) => [
      item.value.replaceAll("|", "\\|"),
      item.clicks,
      item.impressions,
      formatPercent(item.ctr),
      item.position.toFixed(1),
    ]),
  ),
  "",
  "## Landing pages GA4",
  "",
  markdownTable(
    ["Landing page", "Sessions", "Utilisateurs", "Engagées", "Événements clés"],
    topLandingPages.map((item) => [
      item.page.replaceAll("|", "\\|"),
      item.sessions,
      item.activeUsers,
      item.engagedSessions,
      item.keyEvents,
    ]),
  ),
  "",
].join("\n");

await Promise.all([
  mkdir(outputDir, { recursive: true }),
  mkdir(historyDir, { recursive: true }),
]);
await Promise.all([
  writeFile(
    path.join(outputDir, "google-report.json"),
    JSON.stringify(report, null, 2) + "\n",
    "utf8",
  ),
  writeFile(path.join(outputDir, "google-report.md"), markdown, "utf8"),
  writeFile(
    path.join(historyDir, endDate + ".json"),
    JSON.stringify(report, null, 2) + "\n",
    "utf8",
  ),
  writeFile(path.join(historyDir, endDate + ".md"), markdown, "utf8"),
]);

console.log(
  "Rapport créé : " + path.relative(root, path.join(outputDir, "google-report.md")),
);
