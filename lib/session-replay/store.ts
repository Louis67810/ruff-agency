import "server-only";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ReplayEvent, ReplaySession } from "./types";

const directory = path.join(process.cwd(), ".data", "session-replay-chunks");
function config() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) return { url: url.replace(/\/$/, ""), key };
  if (process.env.NODE_ENV === "production") throw new Error("Replay storage unavailable");
  return null;
}
async function database(route: string, init?: RequestInit) {
  const c = config();
  if (!c) throw new Error("Replay database unavailable");
  const response = await fetch(`${c.url}/rest/v1/${route}`, {
    ...init, headers: { apikey: c.key, ...(c.key.startsWith("sb_") ? {} : { authorization: `Bearer ${c.key}` }), "content-type": "application/json", ...init?.headers }, cache: "no-store",
  });
  if (!response.ok) throw new Error(`Replay storage failed (${response.status})`);
  return response.json();
}
type Chunk = { id: string; visitorId: string; sessionId: string; path: string; tokenHash: string; sequence: number; events: ReplayEvent[]; savedAt: string };
async function localChunks(): Promise<Chunk[]> {
  try {
    const files = (await readdir(directory)).filter((name) => name.endsWith(".json"));
    const chunks = await Promise.all(files.map(async (name) => JSON.parse(await readFile(path.join(directory, name), "utf8")) as Chunk));
    return chunks.filter((row) => Date.parse(row.savedAt) > Date.now() - 7 * 86_400_000).sort((a, b) => a.savedAt.localeCompare(b.savedAt) || a.sequence - b.sequence);
  }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
}
export async function saveReplayChunk(input: Omit<Chunk, "tokenHash" | "savedAt"> & { token: string }) {
  const { token, ...values } = input;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  if (config()) {
    await database("rpc/save_saas_replay_chunk", { method: "POST", body: JSON.stringify({ p_id: input.id, p_visitor: input.visitorId, p_session: input.sessionId, p_path: input.path, p_token: tokenHash, p_sequence: input.sequence, p_events: input.events }) });
    return;
  }
  const chunks = await localChunks();
  const existing = chunks.find((row) => row.id === input.id);
  if (existing && (existing.tokenHash !== tokenHash || existing.visitorId !== input.visitorId || existing.path !== input.path || existing.sessionId !== input.sessionId)) throw new Error("Replay ownership mismatch");
  if (!existing && input.sequence !== 0) throw new Error("Missing replay start");
  if (chunks.some((row) => row.id === input.id && row.sequence === input.sequence)) return;
  await mkdir(directory, { recursive: true });
  const destination = path.join(directory, `${input.id}-${input.sequence}.json`);
  const temporary = `${destination}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify({ ...values, tokenHash, savedAt: new Date().toISOString() }), "utf8");
  await rename(temporary, destination);
}
export async function listReplays(visitorId: string): Promise<ReplaySession[]> {
  if (config()) {
    const query = new URLSearchParams({ select: "id,visitor_id,session_id,path,started_at,updated_at,event_count", visitor_id: `eq.${visitorId}`, expires_at: `gt.${new Date().toISOString()}`, order: "started_at.desc", limit: "50" });
    return database(`saas_session_replays?${query}`);
  }
  const rows = new Map<string, ReplaySession>();
  for (const chunk of await localChunks()) {
    if (chunk.visitorId !== visitorId) continue;
    const existing = rows.get(chunk.id);
    rows.set(chunk.id, { id: chunk.id, visitor_id: visitorId, session_id: chunk.sessionId, path: chunk.path, started_at: existing?.started_at ?? chunk.savedAt, updated_at: chunk.savedAt, event_count: (existing?.event_count ?? 0) + chunk.events.length });
  }
  return [...rows.values()].sort((a, b) => b.started_at.localeCompare(a.started_at)).slice(0, 50);
}
export async function readReplay(id: string, after: number) {
  let chunks: Array<{ sequence: number; events: ReplayEvent[] }>;
  if (config()) {
    // Join the parent to enforce expiry even before the hourly cleanup runs.
    const query = new URLSearchParams({ select: "sequence,events,saas_session_replays!inner(expires_at)", replay_id: `eq.${id}`, sequence: `gt.${after}`, "saas_session_replays.expires_at": `gt.${new Date().toISOString()}`, order: "sequence.asc", limit: "50" });
    chunks = await database(`saas_replay_chunks?${query}`);
  } else {
    chunks = (await localChunks()).filter((row) => row.id === id && row.sequence > after).sort((a, b) => a.sequence - b.sequence).slice(0, 50);
  }
  return { chunks, cursor: chunks.at(-1)?.sequence ?? after, more: chunks.length === 50 };
}
