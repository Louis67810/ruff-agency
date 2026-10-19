import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { analyticsCookieName, analyticsTokenIsValid } from "@/lib/saas-analytics/auth";
import { briefStoreIsConfigured, deleteBriefResponse, readBriefResponses, saveBriefResponse, type BriefSnapshot } from "@/lib/saas-brief/store";
import { normalizeSaasWebsite, normalizeWorkEmail, validateCompletedBrief, briefMrrOptions, briefChangeOptions } from "@/lib/saas-brief/validation";
import { normalizeBriefAttribution } from "@/lib/saas-brief/attribution";
import { isAllowedBriefOrigin } from "@/lib/saas-brief/request-origin";

export const runtime = "nodejs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const allowedMrr = new Set<string>(["", ...briefMrrOptions]);
const allowedChanges = new Set<string>(briefChangeOptions);
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function DELETE(request: NextRequest) {
  if (!analyticsTokenIsValid(request.cookies.get(analyticsCookieName)?.value))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAllowedBriefOrigin(request))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !uuidPattern.test(id))
    return NextResponse.json({ error: "Invalid response ID" }, { status: 400 });
  try {
    const deleted = await deleteBriefResponse(id);
    if (!deleted) return NextResponse.json({ error: "Response not found" }, { status: 404 });
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("SaaS brief deletion failed", error);
    return NextResponse.json({ error: "Response could not be deleted" }, { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !analyticsTokenIsValid(request.cookies.get(analyticsCookieName)?.value))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const responses = await readBriefResponses();
    return NextResponse.json({ responses, source: briefStoreIsConfigured() ? "supabase" : "local" }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("SaaS brief query failed", error);
    return NextResponse.json({ error: "Responses unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAllowedBriefOrigin(request))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const current = attempts.get(clientKey);
  if (current && current.resetAt > now && current.count >= 120)
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  attempts.set(clientKey, {
    count: current && current.resetAt > now ? current.count + 1 : 1,
    resetAt: current && current.resetAt > now ? current.resetAt : now + 60_000,
  });
  if (Number(request.headers.get("content-length") ?? 0) > 16_000)
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid response" }, { status: 400 });
  const { id, token, visitorId, revision, lastStep, website, email, mrr, changes, details, durationMs, completed } = body;
  if (
    typeof id !== "string" || !uuidPattern.test(id) ||
    typeof token !== "string" || !uuidPattern.test(token) ||
    typeof visitorId !== "string" || !uuidPattern.test(visitorId) ||
    !Number.isInteger(revision) || Number(revision) < 0 || Number(revision) > 1_000_000 ||
    !Number.isInteger(lastStep) || Number(lastStep) < 0 || Number(lastStep) > 5 ||
    typeof website !== "string" || website.length > 500 ||
    typeof email !== "string" || email.length > 254 ||
    typeof mrr !== "string" || !allowedMrr.has(mrr) ||
    !Array.isArray(changes) || changes.length > 4 || !changes.every((item) => typeof item === "string" && allowedChanges.has(item)) ||
    typeof details !== "string" || details.length > 800 ||
    !Number.isInteger(durationMs) || Number(durationMs) < 0 || Number(durationMs) > 86_400_000 ||
    typeof completed !== "boolean"
  ) return NextResponse.json({ error: "Invalid response" }, { status: 400 });
  if (completed) {
    const issue = validateCompletedBrief({ website, email, mrr, changes: changes as string[], details });
    if (issue) return NextResponse.json(issue, { status: 400 });
    if (Number(lastStep) < 4) return NextResponse.json({ error: "Please complete the remaining questions.", step: Number(lastStep) }, { status: 400 });
  }

  const snapshot: BriefSnapshot = {
    id,
    tokenHash: createHash("sha256").update(token).digest("hex"),
    visitorId,
    revision: Number(revision),
    lastStep: Number(lastStep),
    website: normalizeSaasWebsite(website) ?? website.trim(),
    email: normalizeWorkEmail(email) ?? email.trim(),
    mrr,
    changes: changes as string[],
    details: details.trim(),
    durationMs: Number(durationMs),
    completed,
    attribution: normalizeBriefAttribution(body.attribution),
  };
  try {
    await saveBriefResponse(snapshot);
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("SaaS brief save failed", error);
    return NextResponse.json({ error: "Response could not be saved" }, { status: 503 });
  }
}
