"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { AnalyticsSummary } from "@/lib/saas-analytics/types";

function number(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(
    value,
  );
}

function Empty({ children }: { children: string }) {
  return <div className="sad-empty">{children}</div>;
}

function MiniLine({ summary }: { summary: AnalyticsSummary }) {
  const points = summary.daily;
  if (!points.length)
    return <Empty>No visits recorded in this period yet.</Empty>;
  const maximum = Math.max(...points.map((point) => point.visitors), 1);
  const path = points
    .map((point, index) => {
      const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
      const y = 88 - (point.visitors / maximum) * 68;
      return `${index ? "L" : "M"}${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      className="sad-line"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label="Visitors over time"
    >
      <defs>
        <linearGradient id="sad-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fb8e0" stopOpacity=".34" />
          <stop offset="1" stopColor="#6fb8e0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[22, 44, 66, 88].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} className="sad-grid-line" />
      ))}
      <path d={`${path} L100,100 L0,100 Z`} fill="url(#sad-area)" />
      <path
        d={path}
        fill="none"
        stroke="#6fb8e0"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Ranking({
  items,
  empty,
}: {
  items: Array<{ label: string; value: number }>;
  empty: string;
}) {
  if (!items.length) return <Empty>{empty}</Empty>;
  const maximum = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="sad-ranking">
      {items.slice(0, 6).map((item) => (
        <div className="sad-rank" key={item.label}>
          <span>{item.label}</span>
          <strong>{number(item.value)}</strong>
          <i style={{ width: `${(item.value / maximum) * 100}%` }} />
        </div>
      ))}
    </div>
  );
}

export function AnalyticsDashboard({
  initiallyAuthenticated,
  localPassword,
}: {
  initiallyAuthenticated: boolean;
  localPassword: string | null;
}) {
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(initiallyAuthenticated);
  const [averagePrice, setAveragePrice] = useState(2000);
  const [closingRate, setClosingRate] = useState(30);

  const load = useCallback(async (range: number) => {
    setLoading(true);
    const response = await fetch(`/api/saas-analytics/summary?days=${range}`, {
      cache: "no-store",
    });
    if (response.status === 401) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    if (!response.ok) {
      setError("The analytics store is not available yet.");
      setLoading(false);
      return;
    }
    setSummary((await response.json()) as AnalyticsSummary);
    setError("");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) void load(days);
  }, [authenticated, days, load]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/saas-analytics/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(body?.error ?? "Unable to sign in");
      return;
    }
    setAuthenticated(true);
  };

  const estimates = useMemo(() => {
    const leads = summary?.conversions ?? 0;
    const clients = leads * (closingRate / 100);
    return { leads, clients, revenue: clients * averagePrice };
  }, [summary, averagePrice, closingRate]);

  if (!authenticated) {
    return (
      <main className="sad sad-login">
        <form className="sad-login-card" onSubmit={signIn}>
          <span className="sad-kicker">[ SECURE PREVIEW ]</span>
          <h1>Landing analytics</h1>
          <p>This dashboard is private and protected server-side.</p>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
            />
          </label>
          <button type="submit">Open dashboard</button>
          {error && <p className="sad-error">{error}</p>}
          {localPassword && (
            <small>
              Local preview password: <code>{localPassword}</code>
            </small>
          )}
        </form>
      </main>
    );
  }

  return (
    <main className="sad">
      <header className="sad-header">
        <div>
          <span className="sad-kicker">[ RUFF / SAAS LANDING ]</span>
          <h1>Analytics overview</h1>
          <p>Only activity on /saas-redesign is included.</p>
        </div>
        <div className="sad-actions">
          <div className="sad-range">
            {[7, 30, 90].map((range) => (
              <button
                key={range}
                className={days === range ? "is-active" : ""}
                onClick={() => setDays(range)}
              >
                {range}d
              </button>
            ))}
          </div>
          <a href="/saas-redesign/tweets-admin">Manage tweets</a>
          <a href="/saas-redesign">Open landing</a>
        </div>
      </header>

      {error && <div className="sad-alert">{error}</div>}
      <section className={`sad-content${loading ? " is-loading" : ""}`}>
        <div className="sad-kpis">
          {[
            ["Visitors", summary?.visitors ?? 0, "Unique visitors"],
            [
              "Return rate",
              `${number(summary?.returnRate ?? 0, 1)}%`,
              `${summary?.returningVisitors ?? 0} returned`,
            ],
            [
              "Bounce rate",
              `${number(summary?.bounceRate ?? 0, 1)}%`,
              "No interaction under 10s",
            ],
            [
              "Conversions",
              summary?.conversions ?? 0,
              `${number(summary?.conversionRate ?? 0, 1)}% visitor rate`,
            ],
            [
              "Main site visits",
              summary?.mainSiteVisits ?? 0,
              "After this landing",
            ],
          ].map(([label, value, hint]) => (
            <article className="sad-card sad-kpi" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{hint}</small>
            </article>
          ))}
        </div>

        <div className="sad-grid sad-grid--main">
          <article className="sad-card sad-chart-card">
            <div className="sad-card-head">
              <div>
                <span>[ UNIQUE VISITORS ]</span>
                <h2>Traffic over time</h2>
              </div>
              <strong>{number(summary?.visitors ?? 0)}</strong>
            </div>
            {summary && <MiniLine summary={summary} />}
          </article>
          <article className="sad-card">
            <div className="sad-card-head">
              <div>
                <span>[ LOCATION ]</span>
                <h2>Top countries</h2>
              </div>
            </div>
            <Ranking
              items={summary?.countries ?? []}
              empty="Country data appears in production through the hosting headers."
            />
          </article>
        </div>

        <article className="sad-card sad-section-table">
          <div className="sad-card-head">
            <div>
              <span>[ JOURNEY ]</span>
              <h2>Section performance</h2>
            </div>
            <small>Average and median active viewport time</small>
          </div>
          {!summary?.sections.length ? (
            <Empty>
              Scroll through the landing once to start collecting section data.
            </Empty>
          ) : (
            <div className="sad-table">
              <div className="sad-table-row sad-table-head">
                <span>Section</span>
                <span>Views</span>
                <span>Drop-off</span>
                <span>Average</span>
                <span>Median</span>
                <span>Conversions</span>
              </div>
              {summary.sections.map((section) => (
                <div className="sad-table-row" key={section.id}>
                  <strong>{section.label}</strong>
                  <span>{section.views}</span>
                  <span>{number(section.dropOffRate, 1)}%</span>
                  <span>{number(section.averageSeconds, 1)}s</span>
                  <span>{number(section.medianSeconds, 1)}s</span>
                  <span>{section.conversions}</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <div className="sad-grid sad-grid--three">
          <article className="sad-card">
            <div className="sad-card-head">
              <div>
                <span>[ CLICKS ]</span>
                <h2>Top CTAs</h2>
              </div>
            </div>
            <Ranking items={summary?.ctas ?? []} empty="No CTA click yet." />
          </article>
          <article className="sad-card">
            <div className="sad-card-head">
              <div>
                <span>[ INTERACTIONS ]</span>
                <h2>Interactive sections</h2>
              </div>
            </div>
            <Ranking
              items={summary?.interactions ?? []}
              empty="No vote or before/after interaction yet."
            />
          </article>
          <article className="sad-card sad-calculator">
            <div className="sad-card-head">
              <div>
                <span>[ REVENUE MODEL ]</span>
                <h2>Client value calculator</h2>
              </div>
            </div>
            <label>
              Average service price{" "}
              <div>
                <span>$</span>
                <input
                  type="number"
                  min="0"
                  value={averagePrice}
                  onChange={(event) =>
                    setAveragePrice(Number(event.target.value))
                  }
                />
              </div>
            </label>
            <label>
              Call closing rate{" "}
              <div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={closingRate}
                  onChange={(event) =>
                    setClosingRate(Number(event.target.value))
                  }
                />
                <span>%</span>
              </div>
            </label>
            <div className="sad-calculator-result">
              <span>Estimated value from {estimates.leads} tracked leads</span>
              <strong>${number(estimates.revenue)}</strong>
              <small>
                ≈ {number(estimates.clients, 1)} clients at this closing rate
              </small>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
