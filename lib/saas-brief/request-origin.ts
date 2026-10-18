import type { NextRequest } from "next/server";

/** Next.js can expose an internal hostname behind the local server or a proxy. */
export function isAllowedBriefOrigin(request: Pick<NextRequest, "headers" | "nextUrl">) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    if (parsed.origin !== origin || !["http:", "https:"].includes(parsed.protocol)) return false;
    if (origin === "https://ruff.agency" || origin === "https://www.ruff.agency") return true;
    const host = request.headers.get("host");
    return parsed.protocol === request.nextUrl.protocol
      && parsed.host === (host || request.nextUrl.host);
  } catch {
    return false;
  }
}
