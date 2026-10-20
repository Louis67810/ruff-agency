import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const html = await readFile(path.join(process.cwd(), "public", "linkedin-atelier.html"), "utf8");
  return new Response(html, { headers: {
    "content-type": "text/html; charset=utf-8", "cache-control": "private, no-store",
    "x-robots-tag": "noindex, nofollow", "x-content-type-options": "nosniff",
    "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' data:; frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
  } });
}
