import { NextRequest, NextResponse } from "next/server";
import { analyticsCookieName, analyticsTokenIsValid } from "@/lib/saas-analytics/auth";
import { isAllowedBriefOrigin } from "@/lib/saas-brief/request-origin";
import { listReplays, readReplay, saveReplayChunk } from "@/lib/session-replay/store";
import { isReplayPath, type ReplayEvent } from "@/lib/session-replay/types";

export const runtime = "nodejs";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const attempts = new Map<string, { count: number; until: number }>();
export async function GET(request: NextRequest) {
  if (!analyticsTokenIsValid(request.cookies.get(analyticsCookieName)?.value)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const visitor = request.nextUrl.searchParams.get("visitor");
  const id = request.nextUrl.searchParams.get("id");
  const after = Number(request.nextUrl.searchParams.get("after") ?? -1);
  if ((!visitor || !uuid.test(visitor)) && (!id || !uuid.test(id))) return NextResponse.json({ error: "Invalid replay" }, { status: 400 });
  if (!Number.isInteger(after) || after < -1 || after > 10000) return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
  try { return NextResponse.json(visitor ? { sessions: await listReplays(visitor) } : await readReplay(id!, after), { headers: { "Cache-Control": "private, no-store" } }); }
  catch { return NextResponse.json({ error: "Recordings unavailable" }, { status: 503 }); }
}
export async function POST(request: NextRequest) {
  if (!isAllowedBriefOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return new NextResponse(null, { status: 415 });
  const key = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const previous = attempts.get(key);
  if (previous && previous.until > now && previous.count >= 90) return new NextResponse(null, { status: 429 });
  // Bound this best-effort per-instance limiter; storage also enforces per-recording quotas.
  if (attempts.size > 5000) for (const [ip, entry] of attempts) if (entry.until <= now) attempts.delete(ip);
  if (attempts.size > 10000 && !previous) return new NextResponse(null, { status: 429 });
  attempts.set(key, { count: previous && previous.until > now ? previous.count + 1 : 1, until: previous && previous.until > now ? previous.until : now + 60000 });
  if (Number(request.headers.get("content-length") ?? 0) > 2_000_000) return new NextResponse(null, { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) return new NextResponse(null, { status: 400 });
  const decoder = new TextDecoder();
  let text = "", bytes = 0;
  for (;;) {
    const chunk = await reader.read();
    if (chunk.done) break;
    bytes += chunk.value.byteLength;
    if (bytes > 2_000_000) { await reader.cancel(); return new NextResponse(null, { status: 413 }); }
    text += decoder.decode(chunk.value, { stream: true });
  }
  text += decoder.decode();
  let body;
  try { body = JSON.parse(text); } catch { return new NextResponse(null, { status: 400 }); }
  if (!body || ![body.id, body.visitorId, body.sessionId, body.token].every((value) => typeof value === "string" && uuid.test(value))
    || typeof body.path !== "string" || body.path.length > 240 || !isReplayPath(body.path) || body.consent !== true
    || !Number.isInteger(body.sequence) || body.sequence < 0 || body.sequence > 500
    || !Array.isArray(body.events) || !body.events.length || body.events.length > 3000
    || !body.events.every((event: ReplayEvent) => event && Number.isInteger(event.type) && event.type >= 0 && event.type <= 6 && Number.isFinite(event.timestamp) && Math.abs(now - event.timestamp) < 30 * 60_000)) return new NextResponse(null, { status: 400 });
  if (body.sequence === 0 && (!body.events.some((event: ReplayEvent) => event.type === 2) || !body.events.some((event: ReplayEvent) => event.type === 4))) return new NextResponse(null, { status: 400 });
  try {
    await saveReplayChunk(body);
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Recording could not be saved" }, { status: 503 }); }
}
