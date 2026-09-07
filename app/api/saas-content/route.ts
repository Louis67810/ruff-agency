import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  analyticsCookieName,
  analyticsTokenIsValid,
} from "@/lib/saas-analytics/auth";

export const runtime = "nodejs";

const contentPath = path.join(
  process.cwd(),
  "app",
  "saas-redesign",
  "content.json",
);
let mutationQueue: Promise<unknown> = Promise.resolve();

type Realization = {
  id: string;
  title: string;
  copy: string;
  before: string;
  after: string;
};

type Review = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

type Content = { realizations: Realization[]; reviews: Review[] };

function isAuthenticated(request: NextRequest) {
  return analyticsTokenIsValid(request.cookies.get(analyticsCookieName)?.value);
}

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function cleanAsset(value: unknown) {
  const asset = cleanText(value, 1000);
  return asset.startsWith("/") || /^https:\/\//i.test(asset) ? asset : "";
}

function cleanId(value: unknown) {
  return cleanText(value, 80)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateContent(value: unknown): Content | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  if (!Array.isArray(source.realizations) || !Array.isArray(source.reviews))
    return null;

  const realizations = source.realizations.slice(0, 100).map((item) => {
    const entry = (item ?? {}) as Record<string, unknown>;
    return {
      id: cleanId(entry.id) || crypto.randomUUID(),
      title: cleanText(entry.title, 120),
      copy: cleanText(entry.copy, 400),
      before: cleanAsset(entry.before),
      after: cleanAsset(entry.after),
    };
  });
  const reviews = source.reviews.slice(0, 100).map((item) => {
    const entry = (item ?? {}) as Record<string, unknown>;
    return {
      id: cleanId(entry.id) || crypto.randomUUID(),
      name: cleanText(entry.name, 100),
      role: cleanText(entry.role, 140),
      quote: cleanText(entry.quote, 1200),
      avatar: cleanAsset(entry.avatar),
    };
  });

  if (
    realizations.some(
      (item) => !item.title || !item.copy || !item.before || !item.after,
    ) ||
    reviews.some(
      (item) => !item.name || !item.role || !item.quote || !item.avatar,
    )
  )
    return null;
  return { realizations, reviews };
}

async function readContent(): Promise<Content> {
  return JSON.parse(await readFile(contentPath, "utf8")) as Content;
}

async function writeContent(content: Content) {
  const temporaryPath = `${contentPath}.${process.pid}.tmp`;
  await writeFile(
    temporaryPath,
    `${JSON.stringify(content, null, 2)}\n`,
    "utf8",
  );
  await rename(temporaryPath, contentPath);
}

async function mutateContent(operation: (content: Content) => Content) {
  const task = mutationQueue.then(async () => {
    const current = await readContent();
    const next = operation(current);
    await writeContent(next);
    return next;
  });
  mutationQueue = task.catch(() => undefined);
  return task;
}

function canWrite() {
  return process.env.NODE_ENV !== "production";
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const content = await readFile(contentPath, "utf8");
  return new NextResponse(content, {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Hard-coded content can only be edited on the local project." },
      { status: 403 },
    );
  const content = validateContent(await request.json().catch(() => null));
  if (!content)
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  await writeContent(content);
  return NextResponse.json({ ok: true, content });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite())
    return NextResponse.json(
      { error: "Hard-coded content can only be edited on the local project." },
      { status: 403 },
    );
  try {
    const body = (await request.json()) as {
      kind?: "realizations" | "reviews";
      item?: unknown;
    };
    if (body.kind !== "realizations" && body.kind !== "reviews")
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    const candidate = validateContent({
      realizations: body.kind === "realizations" ? [body.item] : [],
      reviews: body.kind === "reviews" ? [body.item] : [],
    });
    if (!candidate)
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    const item = candidate[body.kind][0];
    const content = await mutateContent((current) => ({
      ...current,
      [body.kind as string]: [...current[body.kind!], item],
    }));
    console.log("[saas-content] item added", {
      kind: body.kind,
      id: item.id,
      count: content[body.kind].length,
    });
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("[saas-content] add failed", error);
    return NextResponse.json({ error: "Unable to add content" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite())
    return NextResponse.json({ error: "Local editing only" }, { status: 403 });
  try {
    const body = (await request.json()) as {
      kind?: "realizations" | "reviews";
      order?: string[];
    };
    if (
      (body.kind !== "realizations" && body.kind !== "reviews") ||
      !Array.isArray(body.order)
    )
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    const content = await mutateContent((current) => {
      const currentItems = current[body.kind!] as Array<Realization | Review>;
      const byId = new Map<string, Realization | Review>(
        currentItems.map((item) => [item.id, item] as const),
      );
      const ordered = body.order!.map((id) => byId.get(id)).filter(Boolean);
      const included = new Set(ordered.map((item) => item!.id));
      return {
        ...current,
        [body.kind as string]: [
          ...ordered,
          ...currentItems.filter((item) => !included.has(item.id)),
        ],
      } as Content;
    });
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("[saas-content] reorder failed", error);
    return NextResponse.json({ error: "Unable to reorder content" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite())
    return NextResponse.json({ error: "Local editing only" }, { status: 403 });
  const kind = request.nextUrl.searchParams.get("kind") as
    | "realizations"
    | "reviews";
  const id = request.nextUrl.searchParams.get("id");
  if ((kind !== "realizations" && kind !== "reviews") || !id)
    return NextResponse.json({ error: "Invalid delete request" }, { status: 400 });
  try {
    const content = await mutateContent((current) => ({
      ...current,
      [kind]: current[kind].filter((item) => item.id !== id),
    }));
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("[saas-content] delete failed", error);
    return NextResponse.json({ error: "Unable to delete content" }, { status: 500 });
  }
}
