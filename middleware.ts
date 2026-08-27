import { NextRequest, NextResponse } from "next/server";

const LOCALE_PREFIX = "/en";

function isEnglish(request: NextRequest) {
  return /^(en|en-)/i.test((request.headers.get("accept-language") || "").trim());
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasEnglishPrefix = pathname === LOCALE_PREFIX || pathname.startsWith(`${LOCALE_PREFIX}/`);

  if (hasEnglishPrefix) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === LOCALE_PREFIX ? "/" : pathname.slice(LOCALE_PREFIX.length);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-site-locale", "en");
    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    response.cookies.set("site-locale", "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const hasFrenchPreference = request.cookies.get("site-locale")?.value === "fr";
  if (isEnglish(request) && !hasFrenchPreference && pathname !== "/robots.txt" && pathname !== "/sitemap.xml") {
    const url = request.nextUrl.clone();
    url.pathname = `${LOCALE_PREFIX}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set("site-locale", "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", "fr");
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (!request.cookies.has("site-locale")) response.cookies.set("site-locale", "fr", { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
