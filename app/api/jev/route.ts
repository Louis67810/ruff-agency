import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Candidate = { label: string; kind?: string; value?: number };
const metrics = ["visitors", "sessions", "views", "engaged", "conversion", "bounce", "scroll", "cta", "bookings"];

function normalize(value: string) {
  return value.toLocaleLowerCase("fr-FR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function inferMetric(query: string) {
  const value = normalize(query);
  if (/\b(conversions?|conversion)\b/.test(value)) return "conversion";
  if (/\b(rebond|bounce)\b/.test(value)) return "bounce";
  if (/\b(scroll|defilement)\b/.test(value)) return "scroll";
  if (/\b(cta|clics?|clicks?)\b/.test(value)) return "cta";
  if (/\b(sessions?)\b/.test(value)) return "sessions";
  if (/\b(pages?|vues?|views?)\b/.test(value)) return "views";
  if (/\b(engagement|engagees?|engaged)\b/.test(value)) return "engaged";
  return "visitors";
}

function rankCandidates(query: string, candidates: Candidate[]) {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(/[^a-z0-9]+/).filter((token) => token.length > 1);
  const aliases: Record<string, string> = {
    pays: "country", country: "country", countries: "country", page: "page", pages: "page",
    source: "source", campagne: "campaign", campaigns: "campaign", profil: "profile", profils: "profile",
    appareil: "device", device: "device", navigateur: "browser", section: "section", cta: "cta",
  };
  return candidates
    .map((candidate, index) => {
      const haystack = normalize(`${candidate.label} ${candidate.kind ?? ""}`);
      const matchingTokens = tokens.filter((token) => haystack.includes(aliases[token] ?? token));
      const phraseBonus = normalizedQuery.includes(normalize(candidate.label)) ? 30 : 0;
      const valueBonus = Math.min(8, Math.log10(Math.max(1, candidate.value ?? 1)) * 2);
      return { ...candidate, score: phraseBonus + matchingTokens.length * 9 + valueBonus - index / 10000 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(({ score: _score, ...candidate }) => candidate);
}

function explicitTargets(query: string, candidates: Candidate[]) {
  const normalizedQuery = normalize(query);
  const countryAliases: Record<string, string[]> = {
    "etats unis": ["etats unis", "united states", "usa", "us"],
    france: ["france"],
    "united kingdom": ["united kingdom", "royaume uni", "uk", "gb"],
    germany: ["germany", "allemagne", "de"],
    india: ["india", "inde", "in"],
    canada: ["canada"],
    australia: ["australia", "australie", "au"],
  };
  const matches = candidates.flatMap((candidate) => {
    const labels = [candidate.label, ...(countryAliases[normalize(candidate.label)] ?? [])];
    return labels.map((label) => ({ candidate, label, index: normalizedQuery.indexOf(normalize(label)) }));
  })
    .filter((item) => item.index >= 0 && item.label.length > 1)
    .sort((a, b) => a.index - b.index)
    .filter((item, index, list) => list.findIndex((entry) => entry.candidate.label === item.candidate.label && entry.candidate.kind === item.candidate.kind) === index);
  const firstKind = matches[0]?.candidate.kind;
  return matches.filter((item) => item.candidate.kind === firstKind).map((item) => item.candidate);
}

function choice(answer: unknown) {
  if (!answer || typeof answer !== "object") return null;
  const value = answer as Record<string, unknown>;
  for (const key of ["choice", "value", "label", "result"]) if (typeof value[key] === "string") return value[key] as string;
  return null;
}

function parseAnswers(payload: unknown) {
  const answers = payload && typeof payload === "object" && "answers" in payload ? (payload as { answers?: Record<string, unknown> }).answers ?? {} : {};
  const targets = [choice(answers.target_a), choice(answers.target_b), choice(answers.target_c)]
    .filter((value): value is string => Boolean(value))
    .filter((value, index, list) => list.indexOf(value) === index);
  const metric = choice(answers.metric);
  return { targets, metric: metric && metrics.includes(metric) ? metric : "visitors" };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.TYPESAFE_API_KEY;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let query = "";
  let candidates: Candidate[] = [];
  try {
    const body = await request.json() as { query?: unknown; candidates?: unknown };
    query = typeof body.query === "string" ? body.query.trim() : "";
    candidates = Array.isArray(body.candidates)
      ? body.candidates.filter((item): item is Candidate => Boolean(item && typeof item === "object" && typeof (item as Candidate).label === "string")).slice(0, 250)
      : [];
    if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });
    const localSuggestions = rankCandidates(query, candidates);
    const localTargets = explicitTargets(query, candidates);
    const localResult = { targets: localTargets.map((candidate) => candidate.label), metric: inferMetric(query), suggestions: localSuggestions, provider: "local" };
    if (!apiKey) return NextResponse.json(localResult);
    const options = candidates.map((candidate) => candidate.label);
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 3500);
    const response = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "jev-latest",
        state: JSON.stringify({ request: query, available_dimensions: candidates }),
        questions: {
          target_a: { type: "choice", instructions: "Choose the first data dimension or entity requested. Return one exact option from the list.", options },
          target_b: { type: "choice", instructions: "Choose the second requested entity. It must have the same kind/category as target_a (country with country, page with page, campaign with campaign). Return one exact option from the list.", options },
          target_c: { type: "choice", instructions: "If the user requested a third entity, choose it with the same kind/category as target_a. Otherwise return the first option.", options },
          metric: { type: "choice", instructions: "Choose the metric requested by the user.", options: metrics },
        },
      }),
    });
    if (!response.ok) return NextResponse.json(localResult);
    const interpreted = parseAnswers(await response.json());
    if (localTargets.length >= 2) interpreted.targets = localTargets.map((candidate) => candidate.label);
    const selectedCandidates = interpreted.targets.map((target) => candidates.find((candidate) => candidate.label === target));
    if (selectedCandidates.length >= 2 && selectedCandidates.some((candidate) => !candidate || candidate.kind !== selectedCandidates[0]?.kind)) {
      interpreted.targets = [];
    }
    const preferred = interpreted.targets
      .map((target) => candidates.find((candidate) => candidate.label === target))
      .filter((candidate): candidate is Candidate => Boolean(candidate));
    const suggestions = [...preferred, ...localSuggestions]
      .filter((candidate, index, list) => list.findIndex((item) => item.label === candidate.label && item.kind === candidate.kind) === index)
      .slice(0, 12);
    return NextResponse.json({ ...interpreted, suggestions, provider: "jev" });
  } catch (error) {
    console.error("Jev interpretation failed", error);
    return NextResponse.json({ targets: [], metric: inferMetric(query), suggestions: rankCandidates(query, candidates), provider: "local" });
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
