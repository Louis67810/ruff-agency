import { NextRequest, NextResponse } from "next/server";
import { writeAnalyticsEvent } from "@/lib/saas-analytics/store";
import {
  analyticsEventTypes,
  type AnalyticsEventInput,
} from "@/lib/saas-analytics/types";

export const runtime = "nodejs";

const idPattern = /^[a-zA-Z0-9_-]{8,80}$/;
const requests = new Map<string, { count: number; resetAt: number }>();

function parseEvent(value: unknown): AnalyticsEventInput | null {
  if (!value || typeof value !== "object") return null;
  const event = value as Record<string, unknown>;
  if (
    typeof event.eventType !== "string" ||
    !analyticsEventTypes.includes(
      event.eventType as (typeof analyticsEventTypes)[number],
    ) ||
    typeof event.visitorId !== "string" ||
    !idPattern.test(event.visitorId) ||
    typeof event.sessionId !== "string" ||
    !idPattern.test(event.sessionId) ||
    event.path !== "/saas-redesign"
  ) {
    return null;
  }

  const metadata =
    event.metadata && typeof event.metadata === "object"
      ? (Object.fromEntries(
          Object.entries(event.metadata as Record<string, unknown>)
            .slice(0, 12)
            .filter(
              ([, item]) =>
                item === null ||
                ["string", "number", "boolean"].includes(typeof item),
            )
            .map(([key, item]) => [key.slice(0, 48), item]),
        ) as AnalyticsEventInput["metadata"])
      : undefined;

  return {
    eventType: event.eventType as AnalyticsEventInput["eventType"],
    visitorId: event.visitorId,
    sessionId: event.sessionId,
    path: event.path,
    sectionId:
      typeof event.sectionId === "string"
        ? event.sectionId.slice(0, 60)
        : undefined,
    durationMs:
      typeof event.durationMs === "number"
        ? Math.min(Math.max(Math.round(event.durationMs), 0), 3_600_000)
        : undefined,
    value:
      typeof event.value === "number" && Number.isFinite(event.value)
        ? event.value
        : undefined,
    metadata,
  };
}

export async function POST(request: NextRequest) {
  const clientKey =
    request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const current = requests.get(clientKey);
  if (current && current.resetAt > now && current.count >= 120)
    return NextResponse.json({ error: "Too many events" }, { status: 429 });
  requests.set(clientKey, {
    count: current && current.resetAt > now ? current.count + 1 : 1,
    resetAt: now + 60_000,
  });

  if (Number(request.headers.get("content-length") ?? 0) > 12_000)
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });

  try {
    const body = await request.json();
    const inputs = (Array.isArray(body) ? body : [body])
      .slice(0, 20)
      .map(parseEvent)
      .filter((event): event is AnalyticsEventInput => Boolean(event));
    if (!inputs.length)
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });

    const country = (
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      "XX"
    ).toUpperCase();
    const countryCode = /^[A-Z]{2}$/.test(country) ? country : "XX";
    await Promise.all(
      inputs.map((event) => writeAnalyticsEvent(event, countryCode)),
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("SaaS analytics ingestion failed", error);
    return NextResponse.json(
      { error: "Analytics unavailable" },
      { status: 503 },
    );
  }
}
