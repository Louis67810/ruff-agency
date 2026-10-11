import { NextRequest, NextResponse } from "next/server";

const LOCALE_PREFIX = "/en";

function getCountry(request: NextRequest) {
  const country = (
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    ""
  ).toUpperCase();
  return /^[A-Z]{2}$/.test(country) ? country : "";
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
    if (requestedLocale === "en") {
      const englishUrl = request.nextUrl.clone();
      englishUrl.pathname = `${LOCALE_PREFIX}${pathname === "/" ? "" : pathname}`;
      englishUrl.searchParams.delete("site-locale");
      const response = NextResponse.redirect(englishUrl);
      response.cookies.set("site-locale", "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }
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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", "fr");

  // Keep unprefixed pages consistently French for crawlers and canonical URLs.
  // Route a first visit to the homepage to English outside France; visitors can
  // still choose French explicitly through the language switcher cookie.
  const country = getCountry(request);
  const hasExplicitFrenchChoice = request.cookies.get("site-locale")?.value === "fr";
  const userAgent = request.headers.get("user-agent") ?? "";
  const isSearchCrawler = /Googlebot|Google-InspectionTool|bingbot|BingPreview|DuckDuckBot|YandexBot|Slurp/i.test(userAgent);
  if (
    pathname === "/" && country && country !== "FR" &&
    !hasExplicitFrenchChoice && !isSearchCrawler
  ) {
    const englishUrl = request.nextUrl.clone();
    englishUrl.pathname = LOCALE_PREFIX;
    return NextResponse.redirect(englishUrl, 302);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
