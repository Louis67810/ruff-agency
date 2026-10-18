"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, RefreshCw, X } from "lucide-react";
import type { BriefResponse } from "@/lib/saas-brief/store";
import { briefReference } from "@/lib/saas-brief/validation";
import { attributionQuery, matchesBriefAttribution } from "@/lib/saas-brief/attribution";
import "./saas-brief-dashboard.css";

type MainTab = "insights" | "submissions";
type InsightTab = "answers" | "visits" | "dropoffs";
type SubmissionFilter = "all" | "completed" | "partial";
type Range = "all" | "7" | "30" | "90";

const questions = [
  "What's your SaaS website?",
  "What's your work email?",
  "What's your current MRR?",
  "What needs to change?",
  "Anything else we should know?",
];
const ranges: Record<Range, string> = { all: "All time", "7": "Last 7 days", "30": "Last 30 days", "90": "Last 90 days" };
const mrrOptions = ["<5k", "5–10k", "10–30k", "30k+"];
const changeOptions = ["Looks generic", "Low conversion", "Outgrown the brand", "Other"];
const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

function hasAnswer(row: BriefResponse) {
  return Boolean(row.website || row.email || row.mrr || row.changes.length || row.details);
}

function duration(ms: number) {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function AnswerCard({ title, values }: { title: string; values: Array<{ label: string; count: number }> }) {
  const count = values.reduce((total, item) => total + item.count, 0);
  const max = Math.max(...values.map((item) => item.count), 1);
  return <article className="bf-answer-card">
    <div className="bf-answer-heading"><div><h3>{title}</h3><p>{count} answers</p></div><span>Bar</span></div>
    {values.length ? <div className="bf-answer-rows">{values.map((item) => <div className="bf-answer-row" key={item.label}>
      <div className="bf-answer-bar" style={{ "--bar-width": `${Math.max(14, item.count / max * 100)}%` } as React.CSSProperties}><span>{item.label}</span></div>
      <b>{item.count}</b>
    </div>)}</div> : <p className="bf-empty-small">No answers yet</p>}
  </article>;
}

export function SaasBriefDashboard({ pageOptions = [] }: { pageOptions?: Array<{ name: string; path: string }> }) {
  const [rows, setRows] = useState<BriefResponse[]>([]);
  const [source, setSource] = useState<"local" | "supabase" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainTab, setMainTab] = useState<MainTab>("insights");
  const [insightTab, setInsightTab] = useState<InsightTab>("answers");
  const [filter, setFilter] = useState<SubmissionFilter>("all");
  const [range, setRange] = useState<Range>("all");
  const [selected, setSelected] = useState<BriefResponse | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("");
  const [utm, setUtm] = useState("*");
  const sourcePages = useMemo(() => {
    const options = new Map<string, string>();
    pageOptions.forEach((option) => {
      if (!option.path.includes("?")) options.set(option.path, option.name);
    });
    rows.forEach((row) => {
      if (row.attribution && !options.has(row.attribution.path)) options.set(row.attribution.path, row.attribution.path);
    });
    return [...options].sort(([a], [b]) => a.localeCompare(b));
  }, [rows, pageOptions]);
  const utmOptions = useMemo(() => {
    const values = new Set<string>();
    rows.forEach((row) => {
      if (row.attribution && (!page || row.attribution.path === page)) {
        const query = attributionQuery(row.attribution);
        if (query) values.add(query);
      }
    });
    pageOptions.forEach((option) => {
      const [path, query] = option.path.split("?", 2);
      if (query && (!page || path === page)) values.add(query);
    });
    return [...values].sort();
  }, [rows, pageOptions, page]);

  async function load() {
    try {
      const response = await fetch("/api/saas-brief", { cache: "no-store" });
      if (!response.ok) throw new Error("The form data could not be loaded.");
      const data = await response.json() as { responses: BriefResponse[]; source: "local" | "supabase" };
      setRows(data.responses);
      setSource(data.source);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The form data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void load(); }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const scoped = useMemo(() => {
    const cutoff = range === "all" ? 0 : Date.now() - Number(range) * 86_400_000;
    return rows.filter((row) => Date.parse(row.startedAt) >= cutoff
      && matchesBriefAttribution(row.attribution, page, utm)
    ).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }, [rows, range, page, utm]);
  const responded = useMemo(() => scoped.filter(hasAnswer), [scoped]);
  const completed = responded.filter((row) => row.completedAt);
  const partial = responded.filter((row) => !row.completedAt);
  const filtered = filter === "completed" ? completed : filter === "partial" ? partial : responded;
  const visible = filtered.filter((row) => {
    const term = search.trim().toLowerCase();
    return !term || [briefReference(row.id), row.website, row.email].some((value) => value.toLowerCase().includes(term));
  });
  const uniqueRespondents = new Set(responded.map((row) => row.visitorId)).size;
  const averageDuration = scoped.length ? scoped.reduce((sum, row) => sum + row.durationMs, 0) / scoped.length : 0;

  const mrrCounts = mrrOptions.map((label) => ({ label, count: responded.filter((row) => row.mrr === label).length })).filter((item) => item.count);
  const changeCounts = changeOptions.map((label) => ({ label, count: responded.filter((row) => row.changes.includes(label)).length })).filter((item) => item.count);
  const websiteAnswers = responded.filter((row) => row.website).map((row) => row.website);
  const emailAnswers = responded.filter((row) => row.email).map((row) => row.email);
  const detailsAnswers = responded.filter((row) => row.details).map((row) => row.details);
  const visitDays = useMemo(() => {
    const byDay = new Map<string, number>();
    scoped.forEach((row) => {
      const day = row.startedAt.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    });
    return [...byDay].sort(([a], [b]) => a.localeCompare(b)).slice(-14);
  }, [scoped]);
  const maxDaily = Math.max(...visitDays.map(([, value]) => value), 1);

  function downloadCsv() {
    const columns = ["Brief reference", "Source page", "UTM", "Started at", "Completed at", "Status", "WhatsApp CTA clicked at", "Website", "Work email", "Current MRR", "What needs to change", "Additional details", "Last question reached", "Visit duration"];
    const lines = [columns.map(csvCell).join(","), ...visible.map((row) => [
      briefReference(row.id), row.attribution?.path ?? "Unknown", row.attribution ? attributionQuery(row.attribution) || "No UTM" : "Unknown", formatDate(row.startedAt), row.completedAt ? formatDate(row.completedAt) : "", row.completedAt ? "Completed" : "Partial", row.whatsappClickedAt ? formatDate(row.whatsappClickedAt) : "",
      row.website, row.email, row.mrr, row.changes.join("; "), row.details, questions[Math.min(row.lastStep, 4)], duration(row.durationMs),
    ].map(csvCell).join(","))];
    const url = URL.createObjectURL(new Blob(["\ufeff", lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `saas-brief-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <section className="bf-dashboard" aria-label="SaaS brief form">
    <header className="bf-header">
      <div><p className="bf-eyebrow">SAAS REDESIGN / FORM</p><h2>Form responses</h2><p>Live insights and every saved response, including unfinished briefs.</p></div>
      <button className="bf-refresh" onClick={() => { setLoading(true); void load(); }} type="button"><RefreshCw size={16} /> Refresh</button>
    </header>
    {source === "local" && <p className="bf-local-note">Local preview data. The deployed form uses Supabase when its server credentials are configured.</p>}
    <div className="bf-main-tabs" role="tablist" aria-label="Form data">
      <button role="tab" aria-selected={mainTab === "insights"} className={mainTab === "insights" ? "is-active" : ""} onClick={() => setMainTab("insights")}>Insights</button>
      <button role="tab" aria-selected={mainTab === "submissions"} className={mainTab === "submissions" ? "is-active" : ""} onClick={() => setMainTab("submissions")}>Submissions</button>
    </div>
    {error && <div className="bf-error" role="alert">{error}</div>}
    <div className="bf-source-controls">
      <label>Source page<select aria-label="Form source page" value={page} onChange={(event) => { setPage(event.target.value); setUtm("*"); }}><option value="">All pages</option>{sourcePages.map(([path, name]) => <option key={path} value={path}>{name} ({path})</option>)}</select></label>
      <label>UTM campaign<select aria-label="Form UTM campaign" value={utm} onChange={(event) => setUtm(event.target.value)}><option value="*">All UTM campaigns</option><option value="">No UTM</option>{utmOptions.map((query) => <option key={query} value={query}>{decodeURIComponent(query.replaceAll("+", " "))}</option>)}<option value="unknown">Unknown attribution</option></select></label>
      <label className="bf-range">Date range<select value={range} onChange={(event) => setRange(event.target.value as Range)}>{Object.entries(ranges).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    {rows.some((row) => !row.attribution) && <p className="bf-attribution-note">Older visits without a recorded source are listed as unknown, separately from visits without UTM tags.</p>}
    {loading && !rows.length ? <p className="bf-loading">Loading form data…</p> : mainTab === "insights" ? <>
      <div className="bf-controls">
        <div className="bf-pills" role="tablist" aria-label="Insights view">
          {(["answers", "visits", "dropoffs"] as const).map((tab) => <button key={tab} role="tab" aria-selected={insightTab === tab} className={insightTab === tab ? "is-active" : ""} onClick={() => setInsightTab(tab)}>{tab === "dropoffs" ? "Drop-offs" : tab[0].toUpperCase() + tab.slice(1)}</button>)}
        </div>
      </div>
      <div className="bf-stats">
        {[{ label: "Visits", value: scoped.length }, { label: "Submissions", value: completed.length }, { label: "Unique respondents", value: uniqueRespondents }, { label: "Visit duration", value: duration(averageDuration) }].map((stat) => <div className="bf-stat" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}
      </div>
      {insightTab === "answers" && <div className="bf-answers">
        <AnswerCard title="What’s your current MRR?" values={mrrCounts} />
        <AnswerCard title="What needs to change?" values={changeCounts} />
        {[
          { title: "What’s your SaaS website?", answers: websiteAnswers },
          { title: "What’s your work email?", answers: emailAnswers },
          { title: "Anything else we should know?", answers: detailsAnswers },
        ].map(({ title, answers }) => <article className="bf-answer-card" key={title}><div className="bf-answer-heading"><div><h3>{title}</h3><p>{answers.length} answers</p></div></div>{answers.length ? <ul className="bf-text-answers">{answers.map((answer, index) => <li key={`${answer}-${index}`}>{answer}</li>)}</ul> : <p className="bf-empty-small">No answers yet</p>}</article>)}
      </div>}
      {insightTab === "visits" && <div className="bf-panel"><h3>Form visits</h3><p>Visits recorded when the SaaS brief opens.</p>{visitDays.length ? <div className="bf-daily-chart">{visitDays.map(([day, count]) => <div className="bf-daily-day" key={day}><b>{count}</b><span style={{ height: `${Math.max(10, count / maxDaily * 100)}%` }} /><small>{new Date(`${day}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</small></div>)}</div> : <p className="bf-empty-small">No visits yet</p>}</div>}
      {insightTab === "dropoffs" && <div className="bf-panel"><h3>Where people stop</h3><p>Unfinished visits grouped by their last question.</p><div className="bf-dropoffs">{questions.map((question, index) => {
        const count = scoped.filter((row) => !row.completedAt && row.lastStep === index).length;
        return <div className="bf-dropoff" key={question}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{question}</strong><div className="bf-dropoff-track"><i style={{ width: `${scoped.length ? count / scoped.length * 100 : 0}%` }} /></div></div><b>{count}</b></div>;
      })}</div></div>}
    </> : <>
      <div className="bf-submission-controls">
        <div className="bf-submission-filters" role="tablist" aria-label="Submission status">
          {(["all", "completed", "partial"] as const).map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item[0].toUpperCase() + item.slice(1)} <span>{item === "all" ? responded.length : item === "completed" ? completed.length : partial.length}</span></button>)}
        </div>
        <input aria-label="Find a brief by reference, website or email" className="bf-search" onChange={(event) => setSearch(event.target.value)} placeholder="Find a brief" type="search" value={search} />
        <button className="bf-download" onClick={downloadCsv} disabled={!visible.length}><ArrowDownToLine size={16} /> Download CSV</button>
      </div>
    <div className="bf-table-scroll"><table className="bf-table"><thead><tr><th>Brief reference</th><th>Started at</th><th>Source page</th><th>UTM</th><th>Status</th><th>WhatsApp CTA clicked</th><th>SaaS website</th><th>Work email</th><th>Current MRR</th><th>What needs to change?</th><th>Additional details</th><th>Last question</th><th>Visit duration</th></tr></thead><tbody>{visible.map((row) => <tr key={row.id} onClick={() => setSelected(row)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setSelected(row); }}><td>{briefReference(row.id)}</td><td>{formatDate(row.startedAt)}</td><td>{row.attribution?.path ?? "Unknown"}</td><td>{row.attribution ? attributionQuery(row.attribution) || "No UTM" : "Unknown"}</td><td><span className={`bf-status ${row.completedAt ? "is-complete" : ""}`}>{row.completedAt ? "Completed" : "Partial"}</span></td><td>{row.whatsappClickedAt ? formatDate(row.whatsappClickedAt) : "—"}</td><td>{row.website || "—"}</td><td>{row.email || "—"}</td><td>{row.mrr || "—"}</td><td>{row.changes.join(", ") || "—"}</td><td>{row.details || "—"}</td><td>{questions[Math.min(row.lastStep, 4)]}</td><td>{duration(row.durationMs)}</td></tr>)}</tbody></table>{!visible.length && <div className="bf-table-empty">No {filter === "all" ? "" : `${filter} `}responses in this period.</div>}</div>
    </>}
    {selected && <div className="bf-detail-backdrop" onMouseDown={() => setSelected(null)}><aside className="bf-detail" role="dialog" aria-modal="true" aria-label="Form response" onMouseDown={(event) => event.stopPropagation()}><div className="bf-detail-header"><div><span>{selected.completedAt ? "COMPLETED" : "PARTIAL"} RESPONSE · {briefReference(selected.id)}</span><h3>{selected.website || selected.email || "Unfinished visit"}</h3></div><button onClick={() => setSelected(null)} aria-label="Close response"><X size={20} /></button></div><p>Started {formatDate(selected.startedAt)} · {duration(selected.durationMs)}</p><p>Source page: {selected.attribution?.path ?? "Unknown"}</p><p>UTM: {selected.attribution ? attributionQuery(selected.attribution) || "No UTM" : "Unknown"}</p><p>WhatsApp CTA clicked: {selected.whatsappClickedAt ? formatDate(selected.whatsappClickedAt) : "—"}</p>{questions.map((question, index) => <section key={question}><h4>{question}</h4><div>{index === 0 ? selected.website : index === 1 ? selected.email : index === 2 ? selected.mrr : index === 3 ? selected.changes.join(", ") : selected.details || "—"}</div></section>)}</aside></div>}
  </section>;
}
