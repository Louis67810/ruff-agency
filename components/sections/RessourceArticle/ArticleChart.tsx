"use client";

import type { FeatureCollection, Geometry } from "geojson";
import { useEffect, useState } from "react";
import { feature as topojsonFeature } from "topojson-client";
import worldCountries from "world-atlas/countries-110m.json";
import { Area, AreaChart } from "@/components/charts/area-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { HeatmapCells, HeatmapChart, HeatmapTooltip } from "@/components/charts/heatmap";
import { SankeyChart, SankeyLink, SankeyNode, SankeyTooltip } from "@/components/charts/sankey";
import { ChoroplethChart, ChoroplethFeatureComponent, ChoroplethTooltip } from "@/components/charts/choropleth";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";
import type { ArticleChartData } from "@/lib/data/articles";

type ChartVariant = "bar" | "area" | "sankey" | "heatmap" | "funnel" | "choropleth";

const demoSeries = [
  { name: "Jan", value: 28, secondary: 18, date: new Date("2026-01-01") },
  { name: "Fév", value: 42, secondary: 25, date: new Date("2026-02-01") },
  { name: "Mar", value: 36, secondary: 31, date: new Date("2026-03-01") },
  { name: "Avr", value: 58, secondary: 39, date: new Date("2026-04-01") },
  { name: "Mai", value: 67, secondary: 44, date: new Date("2026-05-01") },
  { name: "Juin", value: 83, secondary: 52, date: new Date("2026-06-01") },
];

const demoSankeyData = {
  nodes: [
    { name: "Visiteurs", category: "source" as const },
    { name: "Article", category: "landing" as const },
    { name: "Newsletter", category: "outcome" as const },
    { name: "Contact", category: "outcome" as const },
  ],
  links: [
    { source: 0, target: 1, value: 100 },
    { source: 1, target: 2, value: 58 },
    { source: 1, target: 3, value: 29 },
  ],
};

const demoHeatmapData = Array.from({ length: 18 }, (_, column) => ({
  bin: column,
  bins: Array.from({ length: 7 }, (_, row) => ({
    bin: row,
    count: (column * 3 + row * 2 + (column % 4) * row) % 5,
    date: new Date(2026, 0, 4 + column * 7 + row),
  })),
}));

const worldMap = topojsonFeature(
  worldCountries as never,
  (worldCountries as unknown as { objects: { countries: never } }).objects.countries
) as unknown as FeatureCollection<Geometry, { name?: string; value?: number }>;

const demoMapValues: Record<string, number> = {
  France: 82,
  Germany: 74,
  Spain: 63,
  Italy: 69,
  Belgium: 57,
  Switzerland: 51,
  Portugal: 43,
  "United Kingdom": 78,
  Canada: 67,
  "United States of America": 88,
  Brazil: 59,
  Japan: 71,
  Australia: 54,
};

function makeMapData(values: Record<string, number>): FeatureCollection<Geometry, { name?: string; value?: number }> {
  return { ...worldMap, features: worldMap.features.map((country) => ({
    ...country,
    properties: {
      ...country.properties,
      value: values[country.properties?.name || ""] || 0,
    },
  })) };
}

function makeHeatmapData(cells: NonNullable<ArticleChartData["cells"]>) {
  if (!cells.length) return demoHeatmapData;
  const byDate = new Map(cells.map((cell) => [cell.date, cell.value]));
  const dates = cells.map((cell) => new Date(`${cell.date}T00:00:00`)).sort((a, b) => a.getTime() - b.getTime());
  const first = new Date(dates[0]);
  first.setDate(first.getDate() - first.getDay());
  const weeks = Math.floor((dates[dates.length - 1].getTime() - first.getTime()) / 604800000) + 1;
  return Array.from({ length: weeks }, (_, column) => ({ bin: column, bins: Array.from({ length: 7 }, (_, row) => {
    const date = new Date(first);
    date.setDate(first.getDate() + column * 7 + row);
    const key = date.toISOString().slice(0, 10);
    return { bin: row, count: byDate.get(key) || 0, date };
  }) }));
}

const heatmapColors = ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"] as const;
const greyFlow = ["#343A46", "#59606D", "#7A818D", "#9EA4AD"];

function ChartCanvas({ variant, isMobile, data, valueLabel = "Valeur", unit = "" }: { variant: ChartVariant; isMobile: boolean; data?: ArticleChartData; valueLabel?: string; unit?: string }) {
  const series = data?.series?.length ? data.series.map((point, index) => ({ name: point.label, value: point.value, secondary: point.secondary, date: point.date ? new Date(point.date) : new Date(2026, index, 1) })) : demoSeries;
  const sankeyData = data?.nodes?.length && data?.links?.length ? { nodes: data.nodes, links: data.links } : demoSankeyData;
  const heatmapData = data?.cells?.length ? makeHeatmapData(data.cells) : demoHeatmapData;
  const mapData = makeMapData(data?.regions && Object.keys(data.regions).length ? data.regions : demoMapValues);
  const tooltipLabel = unit ? `${valueLabel} (${unit})` : valueLabel;
  if (variant === "bar") return <BarChart data={series} xDataKey="name" aspectRatio="2 / 1" margin={{ top: 24, right: 16, bottom: 48, left: 16 }}><Grid /><Bar dataKey="value" fill="#3566E1" lineCap={16} /><BarXAxis showAllLabels /><ChartTooltip showDatePill={false} rows={(point) => [{ color: "#3566E1", label: tooltipLabel, value: Number(point.value) }]} /></BarChart>;
  if (variant === "area") return <AreaChart data={series} xDataKey="date" aspectRatio="2 / 1" margin={{ top: 24, right: 16, bottom: 48, left: 16 }}><Grid /><Area dataKey="value" fill="#E7EDFB" fillOpacity={1} gradientToOpacity={0} stroke="#3566E1" strokeWidth={3} />{series.some((point) => point.secondary != null) ? <Area dataKey="secondary" fill="#F3F6FD" fillOpacity={0.85} gradientToOpacity={0} stroke="#8DA7E8" strokeWidth={2} /> : null}<XAxis numTicks={6} /><ChartTooltip rows={(point) => [{ color: "#3566E1", label: tooltipLabel, value: Number(point.value) }, ...(point.secondary == null ? [] : [{ color: "#8DA7E8", label: "Secondaire", value: Number(point.secondary) }])]} /></AreaChart>;
  if (variant === "sankey") return <SankeyChart data={sankeyData} aspectRatio="2 / 1" margin={isMobile ? { top: 32, right: 76, bottom: 32, left: 76 } : undefined}><SankeyLink stroke="#A8ADB5" strokeOpacity={0.55} useGradient={false} /><SankeyNode getNodeColor={(_, index) => greyFlow[index % greyFlow.length] || "#7A818D"} /><SankeyTooltip /></SankeyChart>;
  if (variant === "heatmap") return <HeatmapChart data={heatmapData} layout="fluid" levelColors={heatmapColors} margin={{ top: 34, right: 12, bottom: 12, left: 12 }}><HeatmapCells cornerRadius={3} activeScale={1.08} /><HeatmapTooltip /></HeatmapChart>;
  if (variant === "funnel") { const fallback = [{ label: "Visites", value: 1000 }, { label: "Lectures", value: 720 }, { label: "Clics", value: 390 }, { label: "Contacts", value: 145 }]; const funnelSeries = data?.series?.length ? data.series : fallback; return <FunnelChart data={funnelSeries.map((point, index) => ({ label: point.label, value: point.value, gradient: [{ offset: "0%", color: ["#3566E1", "#5278DA", "#7895DE", "#A6B8E5"][Math.min(index, 3)] }, { offset: "100%", color: ["#6F8FE3", "#93AAE5", "#BBC8EA", "#E7EDFB"][Math.min(index, 3)] }] }))} showPercentage showValues showLabels grid />; }
  return <ChoroplethChart data={mapData} aspectRatio="2 / 1" center={[0, 18]} zoomEnabled><ChoroplethFeatureComponent getFeatureColor={(country) => { const value = Number(country.properties.value || 0); if (!value) return "#EEF1F6"; return value > 80 ? "#3566E1" : value > 65 ? "#6487E2" : value > 50 ? "#96ACE7" : "#C8D4F0"; }} stroke="#fff" strokeWidth={0.65} /><ChoroplethTooltip getFeatureValue={(country) => Number(country.properties.value || 0)} valueLabel={tooltipLabel} /></ChoroplethChart>;
}

export default function ArticleChart({ variant, title, description, data, valueLabel, unit, source }: { variant: ChartVariant; title: string; description?: string; data?: ArticleChartData; valueLabel?: string; unit?: string; source?: string }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 809px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const usesDemoData = !data || !Object.values(data).some((value) => Array.isArray(value) ? value.length : value && Object.keys(value).length);
  return <figure className="ra-chart-card">
    <figcaption><span>{variant}</span><h3>{title}</h3>{description ? <p>{description}</p> : null}{source ? <p>Source : {source}</p> : usesDemoData ? <p>Données de démonstration.</p> : null}</figcaption>
    <div className={`ra-chart-canvas ra-chart-canvas--${variant}`}><ChartCanvas variant={variant} isMobile={isMobile} data={data} valueLabel={valueLabel} unit={unit} /></div>
  </figure>;
}
