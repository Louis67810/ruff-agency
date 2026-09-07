import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  analyticsCookieName,
  analyticsTokenIsValid,
} from "@/lib/saas-analytics/auth";

export const runtime = "nodejs";

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export async function POST(request: NextRequest) {
  if (
    !analyticsTokenIsValid(request.cookies.get(analyticsCookieName)?.value)
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Uploads can only be added to the local project." },
      { status: 403 },
    );

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > 12_000_000)
    return NextResponse.json(
      { error: "Choose an image smaller than 12 MB." },
      { status: 400 },
    );
  const extension = extensions[file.type];
  if (!extension)
    return NextResponse.json(
      { error: "Use a PNG, JPG, WebP, GIF or SVG image." },
      { status: 400 },
    );

  const directory = path.join(
    process.cwd(),
    "public",
    "landing-assets",
    "uploads",
  );
  await mkdir(directory, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ path: `/landing-assets/uploads/${filename}` });
}
