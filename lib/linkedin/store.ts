import "server-only";

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function configuration() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new ApiError(503, "Le stockage partagé n’est pas configuré.");
  return { url: url.replace(/\/$/, ""), key };
}

export async function supabase(path: string, init: RequestInit = {}) {
  const { url, key } = configuration();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  if (!key.startsWith("sb_")) headers.set("authorization", `Bearer ${key}`);
  const response = await fetch(`${url}/${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    if (response.status === 409) throw new ApiError(409, "Une donnée identique existe déjà.");
    console.error("LinkedIn storage request failed", response.status, path.split("?")[0]);
    throw new ApiError(503, "Le stockage partagé ne répond pas. Réessaie dans un instant.");
  }
  return response;
}

export async function database(table: string, query: URLSearchParams, method = "GET", body?: unknown) {
  const response = await supabase(`rest/v1/${table}?${query}`, {
    method,
    headers: { "content-type": "application/json", prefer: "return=representation" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return response.json() as Promise<Record<string, any>[]>;
}

export async function categories() {
  return (await database("linkedin_categories", new URLSearchParams({ select: "name", order: "name.asc", limit: "1000" }))).map(row => String(row.name));
}

export async function ensureCategory(name: string) {
  if (!name) return null;
  const find = async () => (await categories()).find(c => c.toLocaleLowerCase("fr") === name.toLocaleLowerCase("fr"));
  const existing = await find();
  if (existing) return existing;
  try {
    await database("linkedin_categories", new URLSearchParams(), "POST", { name });
    return name;
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) { const canonical = await find(); if (canonical) return canonical; }
    throw error;
  }
}

export function postFromRow(row: Record<string, any>) {
  const media = Array.isArray(row.media_paths) && row.media_paths.length
    ? row.media_paths.map((path: string) => `/api/linkedin/media/${path}`)
    : row.image_path ? [`/api/linkedin/media/${row.image_path}`] : [];
  return {
    id: row.id, title: row.title, body: row.body, category: row.category ?? "",
    date: row.publication_date ?? "", media, image: media[0] ?? "",
    stage: row.stage, x: row.x ?? undefined, y: row.y ?? undefined,
    createdAt: row.created_at, updatedAt: row.updated_at, version: row.version,
  };
}

function string(value: unknown, max: number, label: string) {
  if (typeof value !== "string" || value.length > max) throw new ApiError(400, `${label} invalide (maximum ${max} caractères).`);
  return value.trim();
}

export function validId(value: string) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(value)) throw new ApiError(400, "Identifiant invalide.");
  return value;
}

export function dateOnly(value: unknown) {
  if (value === "" || value === null) return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)
    throw new ApiError(400, "Utilise une date valide au format AAAA-MM-JJ.");
  return value;
}

export function timestamp(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value)))
    throw new ApiError(400, "Utilise une date et heure ISO 8601 avec fuseau.");
  return value;
}

export function postInput(input: unknown, partial: boolean) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new ApiError(400, "Le corps doit être un objet JSON.");
  const source = input as Record<string, unknown>;
  const row: Record<string, unknown> = {};
  if (!partial || "title" in source) { row.title = string(source.title, 120, "Le sujet"); if (!row.title) throw new ApiError(400, "Ajoute un sujet."); }
  if (!partial || "body" in source) row.body = string(source.body ?? "", 50000, "Le texte");
  if (!partial || "category" in source) row.category = string(source.category ?? "", 60, "La catégorie").replace(/\s+/g, " ") || null;
  if (!partial || "date" in source) row.publication_date = dateOnly(source.date ?? "");
  if (!partial || "stage" in source) {
    const stage = source.stage ?? "";
    if (!["", "À explorer", "En cours", "Prêtes à publier"].includes(String(stage))) throw new ApiError(400, "Statut inconnu.");
    row.stage = stage;
  }
  if (!partial || "media" in source || "image" in source) {
    const media = "media" in source ? source.media : [source.image ?? ""];
    if (!Array.isArray(media) || media.length > 10) throw new ApiError(400, "Ajoute au maximum 10 médias par idée.");
    const paths = [...new Set(media.map(item => {
      if (typeof item !== "string" || !/^\/api\/linkedin\/media\/[a-f0-9-]{36}\.(png|jpg|webp|gif)$/.test(item))
        throw new ApiError(400, "Envoie chaque image via POST /api/linkedin/media avant de l’associer au post.");
      return item.slice("/api/linkedin/media/".length);
    }))];
    row.media_paths = paths;
    row.image_path = paths[0] ?? null;
  }
  for (const key of ["x", "y"]) if (key in source) {
    const value = source[key];
    if (value !== null && (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > 100000)) throw new ApiError(400, "Position du canvas invalide.");
    row[key] = value;
  }
  return row;
}
