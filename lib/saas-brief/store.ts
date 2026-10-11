import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const localDirectory = path.join(process.cwd(), ".data");
const localFile = path.join(localDirectory, "saas-brief-responses.jsonl");

export type BriefResponse = {
  id: string;
  visitorId: string;
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
  revision: number;
  lastStep: number;
  website: string;
  email: string;
  mrr: string;
  changes: string[];
  details: string;
  durationMs: number;
};

export type BriefSnapshot = Pick<BriefResponse,
  "id" | "visitorId" | "revision" | "lastStep" | "website" | "email" | "mrr" | "changes" | "details" | "durationMs"
> & { completed: boolean; tokenHash: string };

function supabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

export function briefStoreIsConfigured() {
  return Boolean(supabaseConfig());
}

function headers(key: string) {
  return {
    apikey: key,
    ...(key.startsWith("sb_") ? {} : { authorization: `Bearer ${key}` }),
    "content-type": "application/json",
  };
}

function fromRow(row: Record<string, unknown>): BriefResponse {
  return {
    id: String(row.id),
    visitorId: String(row.visitor_id),
    startedAt: String(row.started_at),
    updatedAt: String(row.updated_at),
    completedAt: row.completed_at ? String(row.completed_at) : null,
    revision: Number(row.revision ?? 0),
    lastStep: Number(row.last_step ?? 0),
    website: String(row.website ?? ""),
    email: String(row.email ?? ""),
    mrr: String(row.mrr ?? ""),
    changes: Array.isArray(row.changes) ? row.changes.map(String) : [],
    details: String(row.details ?? ""),
    durationMs: Number(row.duration_ms ?? 0),
  };
}

export async function saveBriefResponse(snapshot: BriefSnapshot) {
  const now = new Date().toISOString();
  const fields = {
    updated_at: now,
    completed_at: snapshot.completed ? now : null,
    revision: snapshot.revision,
    last_step: snapshot.lastStep,
    website: snapshot.website,
    email: snapshot.email,
    mrr: snapshot.mrr,
    changes: snapshot.changes,
    details: snapshot.details,
    duration_ms: snapshot.durationMs,
  };
  const row = {
    id: snapshot.id,
    edit_token_hash: snapshot.tokenHash,
    visitor_id: snapshot.visitorId,
    started_at: now,
    ...fields,
  };
  const config = supabaseConfig();

  if (config) {
    const base = `${config.url}/rest/v1/saas_brief_responses`;
    const inserted = await fetch(`${base}?on_conflict=id`, {
      method: "POST",
      headers: { ...headers(config.key), prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (!inserted.ok) throw new Error(`Supabase brief insert failed (${inserted.status})`);
    const query = new URLSearchParams({
      id: `eq.${snapshot.id}`,
      edit_token_hash: `eq.${snapshot.tokenHash}`,
      revision: `lt.${snapshot.revision}`,
    });
    const updated = await fetch(`${base}?${query}`, {
      method: "PATCH",
      headers: { ...headers(config.key), prefer: "return=minimal" },
      body: JSON.stringify(fields),
      cache: "no-store",
    });
    if (!updated.ok) throw new Error(`Supabase brief update failed (${updated.status})`);
    return;
  }

  if (process.env.NODE_ENV === "production")
    throw new Error("SaaS brief storage is not configured");
  await mkdir(localDirectory, { recursive: true });
  await appendFile(localFile, `${JSON.stringify(row)}\n`, "utf8");
}

export async function readBriefResponses(): Promise<BriefResponse[]> {
  const config = supabaseConfig();
  if (config) {
    const all: BriefResponse[] = [];
    for (let offset = 0; ; offset += 1000) {
      const query = new URLSearchParams({
        select: "id,visitor_id,started_at,updated_at,completed_at,revision,last_step,website,email,mrr,changes,details,duration_ms",
        order: "started_at.asc,id.asc",
        limit: "1000",
        offset: String(offset),
      });
      const response = await fetch(`${config.url}/rest/v1/saas_brief_responses?${query}`, {
        headers: headers(config.key), cache: "no-store",
      });
      if (!response.ok) throw new Error(`Supabase brief query failed (${response.status})`);
      const rows = (await response.json()) as Record<string, unknown>[];
      all.push(...rows.map(fromRow));
      if (rows.length < 1000) break;
    }
    return all;
  }

  if (process.env.NODE_ENV === "production")
    throw new Error("SaaS brief storage is not configured");
  try {
    const contents = await readFile(localFile, "utf8");
    const latest = new Map<string, BriefResponse>();
    for (const line of contents.split("\n")) {
      if (!line) continue;
      const row = fromRow(JSON.parse(line) as Record<string, unknown>);
      const previous = latest.get(row.id);
      if (!previous || row.revision >= previous.revision) {
        latest.set(row.id, { ...row, startedAt: previous?.startedAt ?? row.startedAt });
      }
    }
    return [...latest.values()].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
