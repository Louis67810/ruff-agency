import { NextRequest, NextResponse } from "next/server";
import {
  analyticsCookieName,
  analyticsTokenIsValid,
} from "@/lib/saas-analytics/auth";
import {
  deleteTweet,
  readTweets,
  reorderTweets,
  saveTweet,
  tweetsAreConfigured,
} from "@/lib/saas-tweets/store";
import type { SaasTweet } from "@/app/saas-redesign/tweets";

export const runtime = "nodejs";

function isAuthenticated(request: NextRequest) {
  return analyticsTokenIsValid(request.cookies.get(analyticsCookieName)?.value);
}

function text(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function id(value: unknown) {
  return text(value, 80)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTweet(value: unknown): SaasTweet | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const href = text(source.href, 500);
  const accent = text(source.accent, 7) || "#d9f0ff";
  const tweet: SaasTweet = {
    id: id(source.id) || crypto.randomUUID(),
    name: text(source.name, 100),
    handle: text(source.handle, 100),
    copy: text(source.copy, 500),
    href,
    accent,
    position:
      typeof source.position === "number"
        ? Math.max(0, Math.round(source.position))
        : 0,
    published: source.published !== false,
  };
  if (
    !tweet.name ||
    !tweet.handle ||
    !tweet.copy ||
    !/^https:\/\/(x\.com|twitter\.com)\//i.test(href) ||
    !/^#[0-9a-f]{6}$/i.test(accent)
  )
    return null;
  return tweet;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({
      configured: tweetsAreConfigured(),
      tweets: await readTweets(true),
    });
  } catch (error) {
    console.error("SaaS tweets read failed", error);
    return NextResponse.json({ error: "Tweets unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tweet = parseTweet(await request.json().catch(() => null));
  if (!tweet)
    return NextResponse.json({ error: "Invalid tweet" }, { status: 400 });
  try {
    await saveTweet(tweet);
    return NextResponse.json({ ok: true, tweet });
  } catch (error) {
    console.error("SaaS tweet save failed", error);
    return NextResponse.json({ error: "Unable to save tweet" }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    order?: unknown;
  } | null;
  if (!body || !Array.isArray(body.order))
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  const order = body.order.map(id).filter(Boolean).slice(0, 100);
  if (!order.length || new Set(order).size !== order.length)
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  try {
    await reorderTweets(order);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SaaS tweets reorder failed", error);
    return NextResponse.json({ error: "Unable to reorder tweets" }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tweetId = id(request.nextUrl.searchParams.get("id"));
  if (!tweetId)
    return NextResponse.json({ error: "Invalid tweet" }, { status: 400 });
  try {
    await deleteTweet(tweetId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SaaS tweet delete failed", error);
    return NextResponse.json({ error: "Unable to delete tweet" }, { status: 503 });
  }
}
