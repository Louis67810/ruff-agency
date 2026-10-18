import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { recordBriefWhatsAppClick } from "@/lib/saas-brief/store";
import { isAllowedBriefOrigin } from "@/lib/saas-brief/request-origin";

export const runtime = "nodejs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  if (!isAllowedBriefOrigin(request))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 512)
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.id !== "string" || !uuidPattern.test(body.id) ||
    typeof body.token !== "string" || !uuidPattern.test(body.token))
    return NextResponse.json({ error: "Invalid response" }, { status: 400 });

  try {
    const tokenHash = createHash("sha256").update(body.token).digest("hex");
    const recorded = await recordBriefWhatsAppClick(body.id, tokenHash);
    return new NextResponse(null, {
      status: recorded ? 204 : 404,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("SaaS brief WhatsApp click save failed", error);
    return NextResponse.json({ error: "Click could not be saved" }, { status: 503 });
  }
}
