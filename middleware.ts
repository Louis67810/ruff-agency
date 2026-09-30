import { NextRequest, NextResponse } from "next/server";

const LOCALE_PREFIX = "/en";

// Cloudflare's country code is available as `cf-ipcountry` on the deployed site.
// Keep the French experience for countries where French is official or widely
// used; visitors everywhere else get English by default.
const FRENCH_SPEAKING_COUNTRIES = new Set([
  "AD", "BE", "BJ", "BF", "BI", "CM", "CA", "CF", "TD", "KM", "CD", "CG",
  "CI", "DJ", "GQ", "FR", "GA", "GN", "HT", "LU", "MG", "ML", "MR", "MU",
  "MC", "MA", "NE", "RW", "SN", "SC", "CH", "TG", "TN", "VU",
]);

function getDefaultLocale(request: NextRequest) {
  const country = (
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    ""
  ).toUpperCase();
  return FRENCH_SPEAKING_COUNTRIES.has(country) ? "fr" : "en";
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (!isLocal && (url.hostname === "www.ruff.agency" || url.protocol === "http:")) {
    url.hostname = "ruff.agency";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = request.nextUrl;
  const hasEnglishPrefix = pathname === LOCALE_PREFIX || pathname.startsWith(`${LOCALE_PREFIX}/`);

  const requestedLocale = request.nextUrl.searchParams.get("site-locale");
  if (!hasEnglishPrefix && (requestedLocale === "fr" || requestedLocale === "en")) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("site-locale");
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set("site-locale", requestedLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (hasEnglishPrefix) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === LOCALE_PREFIX ? "/" : pathname.slice(LOCALE_PREFIX.length);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-site-locale", "en");
    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    response.cookies.set("site-locale", "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const locale = request.cookies.get("site-locale")?.value === "fr" || request.cookies.get("site-locale")?.value === "en"
    ? request.cookies.get("site-locale")!.value
    : getDefaultLocale(request);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (!request.cookies.has("site-locale")) response.cookies.set("site-locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
