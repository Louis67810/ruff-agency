import { NextRequest, NextResponse } from "next/server";
import {
  analyticsCookieName,
  createAnalyticsToken,
  passwordIsValid,
} from "@/lib/saas-analytics/auth";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.resetAt > now && entry.count >= 5)
    return NextResponse.json({ error: "Try again later" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;
  if (
    !body ||
    typeof body.password !== "string" ||
    !passwordIsValid(body.password)
  ) {
    attempts.set(key, {
      count: entry && entry.resetAt > now ? entry.count + 1 : 1,
      resetAt: now + 15 * 60_000,
    });
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  attempts.delete(key);
  const token = createAnalyticsToken();
  if (!token)
    return NextResponse.json(
      { error: "Dashboard not configured" },
      { status: 503 },
    );
  const response = NextResponse.json({ ok: true });
  response.cookies.set(analyticsCookieName, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(analyticsCookieName, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
