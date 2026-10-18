export const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type BriefAttribution = { path: string; utm: Partial<Record<(typeof utmKeys)[number], string>> };

export function normalizeBriefAttribution(value: unknown): BriefAttribution | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.path !== "string" || !raw.path.startsWith("/") || raw.path.startsWith("//") || raw.path.length > 500) return null;
  const utm: BriefAttribution["utm"] = {};
  if (raw.utm && typeof raw.utm === "object") {
    for (const key of utmKeys) {
      const entry = (raw.utm as Record<string, unknown>)[key];
      if (typeof entry === "string" && entry.trim()) utm[key] = entry.trim().slice(0, 100);
    }
  }
  return { path: raw.path.split(/[?#]/, 1)[0], utm };
}

export function attributionQuery(value: BriefAttribution | null) {
  const params = new URLSearchParams();
  for (const key of utmKeys) if (value?.utm[key]) params.set(key, value.utm[key]!);
  return params.toString();
}

export function matchesBriefAttribution(value: BriefAttribution | null, page: string, utm: string) {
  return (!page || value?.path === page)
    && (utm === "*" || (utm === "unknown" ? !value : Boolean(value) && attributionQuery(value) === utm));
}

export function captureBriefAttribution(): BriefAttribution {
  let attribution: BriefAttribution | null = null;
  try {
    const saved = JSON.parse(sessionStorage.getItem("ruff_saas_brief_source") ?? "null");
    if (saved && Date.now() - Number(saved.savedAt) < 30 * 60_000) attribution = normalizeBriefAttribution(saved);
  } catch { /* Storage can be unavailable in private browsing. */ }
  if (!attribution) {
    let path = window.location.pathname;
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin === window.location.origin) path = referrer.pathname;
    } catch { /* A direct form visit has no referring page. */ }
    attribution = { path, utm: {} };
  }
  const params = new URLSearchParams(window.location.search);
  if (utmKeys.some((key) => params.has(key))) {
    attribution.utm = {};
    for (const key of utmKeys) {
      const value = params.get(key)?.trim().slice(0, 100);
      if (value) attribution.utm[key] = value;
    }
  }
  return attribution;
}
