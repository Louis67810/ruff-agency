import { createHash, randomBytes, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { analyticsCookieName, analyticsTokenIsValid } from "@/lib/saas-analytics/auth";
import { ApiError, database, categories, ensureCategory, postFromRow, postInput, validId, dateOnly, timestamp, supabase } from "@/lib/linkedin/store";
import { openapi } from "@/lib/linkedin/openapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: { segments: string[] } };
const query = (values: Record<string, string>) => new URLSearchParams(values);
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers: { "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

async function authorize(request: NextRequest, write: boolean, sessionOnly = false) {
  const bearer = request.headers.get("authorization");
  if (bearer && !sessionOnly) {
    const token = bearer.match(/^Bearer (li_[a-f0-9]{64})$/)?.[1];
    if (!token) throw new ApiError(401, "Clé API invalide.");
    const rows = await database("linkedin_api_keys", query({ select: "id,scopes,expires_at", token_hash: `eq.${hash(token)}`, revoked_at: "is.null", expires_at: `gt.${new Date().toISOString()}`, limit: "1" }));
    const key = rows[0];
    if (!key) throw new ApiError(401, "Clé API invalide ou expirée.");
    if (!key.scopes.includes(write ? "posts:write" : "posts:read")) throw new ApiError(403, "Cette clé n’autorise pas cette action.");
    return;
  }
  if (!analyticsTokenIsValid(request.cookies.get(analyticsCookieName)?.value)) throw new ApiError(401, "Connecte-toi à ton espace privé.");
  if (write) {
    const origin = request.headers.get("origin");
    if (!origin || new URL(origin).host !== (request.headers.get("host") ?? request.nextUrl.host) || new URL(origin).protocol !== request.nextUrl.protocol)
      throw new ApiError(403, "Origine de la requête non autorisée.");
  }
}

async function body(request: NextRequest) {
  if (Number(request.headers.get("content-length") ?? "0") > 150000) throw new ApiError(413, "Le texte envoyé est trop volumineux.");
  const text = await request.text();
  if (Buffer.byteLength(text) > 150000) throw new ApiError(413, "Le texte envoyé est trop volumineux.");
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected object");
    return value;
  } catch { throw new ApiError(400, "Envoie un objet JSON valide."); }
}

async function handler(request: NextRequest, { params }: Context) {
  try {
    const [resource, id, extra] = params.segments;
    const method = request.method;
    if (extra) throw new ApiError(404, "Route introuvable.");
    await authorize(request, method !== "GET", resource === "keys");

    if (resource === "openapi.json" && !id && method === "GET") return json(openapi(request.nextUrl.origin));

    if (resource === "keys") {
      if (!id && method === "GET") return json({ keys: await database("linkedin_api_keys", query({ select: "id,name,prefix,scopes,created_at,expires_at,revoked_at", order: "created_at.desc" })) });
      if (!id && method === "POST") {
        const source = await body(request);
        const name = typeof source.name === "string" ? source.name.trim() : "Agent IA";
        if (!name || name.length > 80) throw new ApiError(400, "Le nom de la clé doit faire entre 1 et 80 caractères.");
        const scopes = source.readOnly === true ? ["posts:read"] : ["posts:read", "posts:write"];
        const token = `li_${randomBytes(32).toString("hex")}`;
        const expires_at = new Date(Date.now() + 365 * 86400000).toISOString();
        const [key] = await database("linkedin_api_keys", new URLSearchParams(), "POST", { id: randomUUID(), name, prefix: token.slice(0, 11), token_hash: hash(token), scopes, expires_at });
        return json({ token, id: key.id, name, scopes, expiresAt: expires_at }, 201);
      }
      if (id && method === "DELETE") {
        await database("linkedin_api_keys", query({ id: `eq.${validId(id)}` }), "PATCH", { revoked_at: new Date().toISOString() });
        return json({ ok: true });
      }
    }

    if (resource === "categories" && !id) {
      if (method === "GET") return json({ categories: await categories() });
      if (method === "POST") {
        const source = await body(request);
        if (typeof source.name !== "string" || !source.name.trim() || source.name.length > 60) throw new ApiError(400, "Le nom de la catégorie doit faire entre 1 et 60 caractères.");
        return json({ name: await ensureCategory(source.name.trim().replace(/\s+/g, " ")) }, 201);
      }
    }

    if (resource === "posts") {
      if (id) validId(id);
      if (method === "GET") {
        const q = query({ select: "*" });
        if (id) q.set("id", `eq.${id}`);
        const p = request.nextUrl.searchParams;
        const ascending = p.get("order") === "asc";
        q.set("order", `created_at.${ascending ? "asc" : "desc"},id.${ascending ? "asc" : "desc"}`);
        for (const [parameter, column, operator] of [["createdAfter", "created_at", "gte"], ["createdBefore", "created_at", "lt"], ["updatedAfter", "updated_at", "gt"]]) {
          const value = p.get(parameter); if (value) q.append(column, `${operator}.${timestamp(value)}`);
        }
        for (const [parameter, operator] of [["date", "eq"], ["dateFrom", "gte"], ["dateTo", "lte"]]) {
          const value = p.get(parameter); if (value) q.append("publication_date", `${operator}.${dateOnly(value)}`);
        }
        if (p.get("unscheduled") === "true") q.append("publication_date", "is.null");
        if (p.has("category")) q.set("category", `eq.${p.get("category")}`);
        const limit = p.has("limit") ? Number(p.get("limit")) : 100;
        if (!Number.isInteger(limit) || limit < 1 || limit > 200) throw new ApiError(400, "La limite doit être comprise entre 1 et 200.");
        q.set("limit", String(limit + 1));
        if (p.has("cursor")) {
          let cursor: { createdAt: string; id: string };
          try { cursor = JSON.parse(Buffer.from(p.get("cursor")!, "base64url").toString()); timestamp(cursor.createdAt); validId(cursor.id); }
          catch { throw new ApiError(400, "Curseur de pagination invalide."); }
          const op = ascending ? "gt" : "lt";
          q.set("or", `(created_at.${op}.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.${op}.${cursor.id}))`);
        }
        const rows = await database("linkedin_posts", q);
        if (id) { if (!rows[0]) throw new ApiError(404, "Post introuvable."); return json({ post: postFromRow(rows[0]) }); }
        const posts = rows.slice(0, limit).map(postFromRow);
        const last = posts.at(-1);
        const nextCursor = rows.length > limit && last ? Buffer.from(JSON.stringify({ createdAt: last.createdAt, id: last.id })).toString("base64url") : null;
        return json({ posts, nextCursor });
      }
      if (!id && method === "POST") {
        const source = await body(request);
        const row = postInput(source, false);
        row.category = await ensureCategory(String(row.category ?? ""));
        const [post] = await database("linkedin_posts", new URLSearchParams(), "POST", { ...row, id: source.id ? validId(source.id) : randomUUID() });
        return json({ post: postFromRow(post) }, 201);
      }
      if (id && (method === "PATCH" || method === "DELETE")) {
        const [current] = await database("linkedin_posts", query({ select: "*", id: `eq.${id}`, limit: "1" }));
        if (!current) throw new ApiError(404, "Post introuvable.");
        let source: Record<string, any> = {};
        if (method === "PATCH") source = await body(request);
        const expectedVersion = method === "DELETE" ? request.nextUrl.searchParams.get("version") : source.expectedVersion;
        if (expectedVersion !== undefined && expectedVersion !== null && Number(expectedVersion) !== current.version) throw new ApiError(409, "Ce post a changé sur un autre appareil. Recharge-le avant de modifier.");
        const q = query({ id: `eq.${id}`, version: `eq.${current.version}` });
        if (method === "DELETE") {
          const removed = await database("linkedin_posts", q, "DELETE");
          if (!removed.length) throw new ApiError(409, "Ce post a changé sur un autre appareil.");
          return json({ ok: true });
        }
        const row = postInput(source, true);
        if ("category" in row) row.category = await ensureCategory(String(row.category ?? ""));
        const [post] = await database("linkedin_posts", q, "PATCH", { ...row, version: current.version + 1, updated_at: new Date().toISOString() });
        if (!post) throw new ApiError(409, "Ce post a changé sur un autre appareil.");
        return json({ post: postFromRow(post) });
      }
    }

    if (resource === "media") {
      if (!id && method === "POST") {
        if (Number(request.headers.get("content-length") ?? "0") > 3300000) throw new ApiError(413, "Choisis une image de moins de 3 Mo.");
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File) || file.size === 0 || file.size > 3 * 1024 * 1024) throw new ApiError(400, "Choisis une image de moins de 3 Mo.");
        const bytes = Buffer.from(await file.arrayBuffer());
        let extension = "";
        if (file.type === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension = "png";
        if (file.type === "image/jpeg" && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) extension = "jpg";
        if (file.type === "image/gif" && /^GIF8[79]a$/.test(bytes.subarray(0, 6).toString())) extension = "gif";
        if (file.type === "image/webp" && bytes.subarray(0,4).toString() === "RIFF" && bytes.subarray(8,12).toString() === "WEBP") extension = "webp";
        if (!extension) throw new ApiError(400, "Utilise une image JPG, PNG, WebP ou GIF valide.");
        const filename = `${randomUUID()}.${extension}`;
        await supabase(`storage/v1/object/linkedin-media/${filename}`, { method: "POST", headers: { "content-type": file.type, "x-upsert": "false" }, body: bytes });
        return json({ image: `/api/linkedin/media/${filename}` }, 201);
      }
      if (id && method === "GET") {
        if (!/^[a-f0-9-]{36}\.(png|jpg|webp|gif)$/.test(id)) throw new ApiError(404, "Image introuvable.");
        const response = await supabase(`storage/v1/object/authenticated/linkedin-media/${id}`);
        return new Response(response.body, { headers: { "content-type": response.headers.get("content-type") ?? "application/octet-stream", "cache-control": "private, no-store", "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'" } });
      }
    }
    throw new ApiError(404, "Route ou méthode introuvable.");
  } catch (error) {
    if (error instanceof ApiError) return json({ error: error.message }, error.status);
    console.error("LinkedIn API failed", error instanceof Error ? error.name : "Unknown error");
    return json({ error: "La requête n’a pas pu aboutir. Réessaie dans un instant." }, 500);
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
