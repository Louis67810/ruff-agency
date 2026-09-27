export type Qualification = "low" | "medium" | "high";
export type Domain = { id: string; label: string; aliases: string[]; baseRate: number; targetRate: number };

// Editorial modelling assumptions, not published industry benchmarks.
export const DOMAINS: Domain[] = [
  { id: "b2b-services", label: "Prestations B2B", aliases: ["prestation b2b", "service b2b", "conseil b2b", "consulting", "agence b2b"], baseRate: 0.9, targetRate: 2.4 },
  { id: "agency", label: "Agence", aliases: ["agence", "agence marketing", "agence web", "agence de communication"], baseRate: 1, targetRate: 2.6 },
  { id: "saas", label: "Logiciel SaaS", aliases: ["saas", "logiciel", "software", "application b2b"], baseRate: 0.85, targetRate: 2.4 },
  { id: "ecommerce", label: "E-commerce", aliases: ["ecommerce", "e-commerce", "boutique en ligne", "vente en ligne"], baseRate: 1.2, targetRate: 3 },
  { id: "training", label: "Formation", aliases: ["formation", "cours en ligne", "coaching", "formateur"], baseRate: 1.1, targetRate: 2.8 },
  { id: "health", label: "Santé et bien-être", aliases: ["sante", "bien etre", "santé", "bien-être", "therapeute"], baseRate: 1.2, targetRate: 2.8 },
  { id: "real-estate", label: "Immobilier", aliases: ["immobilier", "agence immobiliere", "promoteur"], baseRate: 0.75, targetRate: 2.1 },
  { id: "finance", label: "Finance et assurance", aliases: ["finance", "assurance", "courtier", "fintech"], baseRate: 0.85, targetRate: 2.3 },
  { id: "industry", label: "Industrie", aliases: ["industrie", "industriel", "fabricant", "manufacture"], baseRate: 0.7, targetRate: 1.9 },
  { id: "local", label: "Services locaux", aliases: ["artisan", "services locaux", "restaurant", "commerce local"], baseRate: 1.4, targetRate: 3.2 },
  { id: "other", label: "Autre activité", aliases: ["autre", "general"], baseRate: 1, targetRate: 2.5 },
];

export const QUALIFICATION = {
  low: { label: "Peu qualifiés", factor: 0.65 },
  medium: { label: "Moyennement qualifiés", factor: 1 },
  high: { label: "Très qualifiés", factor: 1.45 },
} as const;

export function normalizeDomain(value: string) {
  return value.toLocaleLowerCase("fr-FR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function rankDomains(query: string) {
  const normalized = normalizeDomain(query);
  if (!normalized) return DOMAINS.slice(0, 6);
  const tokens = normalized.split(" ").filter((token) => token.length > 1);
  return DOMAINS.map((domain) => {
    const names = [domain.label, ...domain.aliases].map(normalizeDomain);
    const score = Math.max(...names.map((name) => name === normalized ? 100 : name.includes(normalized) ? 60 : tokens.reduce((total, token) => total + (name.includes(token) ? 12 : 0), 0)));
    return { domain, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 6).map(({ domain }) => domain);
}

export function estimateConversion(input: { domain: Domain; qualification: Qualification; sales: number; price: number; currentRate: number; investment: number }) {
  const factor = QUALIFICATION[input.qualification].factor;
  const baseline = Math.max(0.1, input.domain.baseRate * factor);
  const currentRate = Math.min(100, Math.max(0.1, input.currentRate || baseline));
  const target = Math.min(20, input.domain.targetRate * factor);
  const alreadyHigh = currentRate >= target;
  // Editorial scenario: a bounded uplift adjusted by lead quality and sector.
  const afterRate = alreadyHigh ? currentRate : Math.min(target, Math.max(currentRate * (1 + 0.7 * factor), baseline * (1 + 0.7 * factor)));
  const visits = Math.max(0, input.sales) / (currentRate / 100);
  const afterSales = visits * afterRate / 100;
  const extraSales = Math.max(0, afterSales - Math.max(0, input.sales));
  const extraRevenue = extraSales * Math.max(0, input.price);
  const investment = Math.max(0, input.investment);
  const roiTwelveMonths = investment > 0 ? ((12 * extraRevenue - investment) / investment) * 100 : null;
  return { baseline, currentRate, afterRate, alreadyHigh, visits, afterSales, extraSales, extraRevenue, roiTwelveMonths, paybackMonths: extraRevenue > 0 ? investment / extraRevenue : null };
}
