"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { AnalyticsEventInput } from "@/lib/saas-analytics/types";
import type { AnalyticsViewport } from "@/lib/saas-analytics/types";

type ClientEvent = Omit<
  AnalyticsEventInput,
  "visitorId" | "sessionId" | "path"
>;

declare global {
  interface WindowEventMap {
    "saas:analytics": CustomEvent<ClientEvent>;
  }
}

const sectionSelectors = [
  ["hero", ".sr-hero"],
  ["problems", ".sr-problems"],
  ["vote", ".sr-trust-choice"],
  ["solutions", ".sr-solution"],
  ["results", ".sr-results"],
  ["metrics", ".sr-metrics"],
  ["reviews", ".sr-proof-reviews"],
  ["booking", ".sr-book"],
  ["faq", ".sr-live-faq"],
] as const;

function getStableId(storage: Storage, key: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  storage.setItem(key, value);
  return value;
}

function getViewport(): AnalyticsViewport {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

export function trackSaasEvent(detail: ClientEvent) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("saas:analytics", { detail }));
}

export function SaasAnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    // The dashboard and its management tools are intentionally excluded: they
    // must never pollute the acquisition data they display.
    if (pathname.startsWith("/saas-redesign/analytics") || pathname.startsWith("/saas-redesign/tweets-admin") || pathname.startsWith("/saas-redesign/content-editor") || pathname.startsWith("/behavioral-intelligence")) return;
    const visitorId = getStableId(localStorage, "ruff_saas_visitor_id");
    const sessionId = getStableId(sessionStorage, "ruff_saas_session_id");
    const visitCount =
      Number(localStorage.getItem("ruff_saas_visits") ?? 0) + 1;
    localStorage.setItem("ruff_saas_visits", String(visitCount));

    const startedAt = performance.now();
    const viewedSections = new Set<string>();
    const activeSince = new Map<string, number>();
    const durations = new Map<string, number>();
    let interactionCount = 0;
    let ended = false;
    const scrollThresholds = [25, 50, 75, 90];
    const sentScrollThresholds = new Set<number>();
    const sentScrollZones = new Set<number>();

    const referrerUrl = document.referrer;
    const referrer = referrerUrl ? (() => { try { return new URL(referrerUrl).hostname; } catch { return "Direct"; } })() : "Direct";
    const campaign = new URLSearchParams(window.location.search).get("utm_campaign") ?? "None";
    const channel = !referrerUrl ? "Direct" : /google|bing|duckduckgo|yahoo/i.test(referrer) ? "Organic search" : /facebook|instagram|linkedin|x[.]com|twitter|tiktok/i.test(referrer) ? "Organic social" : referrer === window.location.hostname ? "Internal" : "Referral";
    const agent = navigator.userAgent;
    const browser = /Edg\//.test(agent) ? "Edge" : /Firefox\//.test(agent) ? "Firefox" : /Safari\//.test(agent) && !/Chrome\//.test(agent) ? "Safari" : /Chrome\//.test(agent) ? "Chrome" : "Other";
    const operatingSystem = /Windows/i.test(agent) ? "Windows" : /Android/i.test(agent) ? "Android" : /iPhone|iPad|iPod/i.test(agent) ? "iOS" : /Mac OS/i.test(agent) ? "macOS" : /Linux/i.test(agent) ? "Linux" : "Other";
    const device = /Mobi|Android|iPhone/i.test(agent) ? "Mobile" : /iPad|Tablet/i.test(agent) ? "Tablet" : "Desktop";
    const entryPath = sessionStorage.getItem("ruff_saas_entry_path") ?? pathname;
    sessionStorage.setItem("ruff_saas_entry_path", entryPath);
    const commonMetadata = { visitCount, referrer, channel, campaign, browser, operatingSystem, device, entryPath, viewport: getViewport() };

    const decorate = (event: ClientEvent): AnalyticsEventInput => ({
      ...event,
      visitorId,
      sessionId,
      path: pathname,
      metadata: { ...commonMetadata, ...event.metadata },
    });
    const send = (event: ClientEvent) => {
      void fetch("/api/saas-analytics/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(decorate(event)),
        keepalive: true,
      }).catch(() => undefined);
    };
    const sendBatch = (events: ClientEvent[]) => {
      const body = JSON.stringify(events.map(decorate));
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/saas-analytics/events",
          new Blob([body], { type: "application/json" }),
        );
      } else {
        void fetch("/api/saas-analytics/events", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          keepalive: true,
        });
      }
    };

    send({ eventType: "page_view" });

    const sectionByElement = new Map<Element, string>();
    const sectionLabelsById = new Map<string, string>();
    const registerSection = (element: Element, id: string) => {
      const html = element as HTMLElement;
      const label = html.querySelector("h1, h2, h3")?.textContent?.replace(/\s+/g, " ").trim() || id;
      html.dataset.analyticsSection = id;
      sectionByElement.set(element, id);
      sectionLabelsById.set(id, label.slice(0, 100));
    };
    sectionSelectors.forEach(([id, selector]) => {
      const element = document.querySelector(selector);
      if (element) registerSection(element, id);
    });
    if (!sectionByElement.size) {
      Array.from(document.querySelectorAll("body > section, main section, main > div, main [data-analytics-section]"))
        .filter((element) => (element as HTMLElement).offsetHeight >= 120)
        .forEach((element, index) => {
        const html = element as HTMLElement;
        registerSection(element, html.dataset.analyticsSection || html.id || `section-${index + 1}`);
        });
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        entries.forEach((entry) => {
          const sectionId = sectionByElement.get(entry.target);
          if (!sectionId) return;
          if (entry.isIntersecting) {
            activeSince.set(sectionId, now);
            if (!viewedSections.has(sectionId)) {
              viewedSections.add(sectionId);
              send({ eventType: "section_view", sectionId, metadata: { sectionLabel: sectionLabelsById.get(sectionId) ?? sectionId } });
            }
          } else {
            const sectionStart = activeSince.get(sectionId);
            if (sectionStart !== undefined) {
              durations.set(
                sectionId,
                (durations.get(sectionId) ?? 0) + now - sectionStart,
              );
              activeSince.delete(sectionId);
            }
          }
        });
      },
      { threshold: 0.35 },
    );
    sectionByElement.forEach((_, element) => observer.observe(element));

    const customEvent = (event: WindowEventMap["saas:analytics"]) => {
      interactionCount += 1;
      send(event.detail);
    };
    window.addEventListener("saas:analytics", customEvent);

    const click = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "a,button,[data-analytics-cta]",
      );
      if (!target) return;
      const isCta = target.matches("[data-analytics-cta],a[href='#book'],a[href*='cal.com']");
      const sectionId = [...sectionByElement.entries()].find(([element]) =>
        element.contains(target),
      )?.[1];
      const label = (
        target.textContent?.trim() ||
        target.getAttribute("aria-label") ||
        "Unlabelled control"
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 100);
      interactionCount += 1;
      const ctaId = target.dataset.analyticsCta || label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (isCta) {
        send({ eventType: "cta_click", sectionId, metadata: { label, ctaId, ctaType: target.dataset.analyticsCtaType ?? "primary" } });
      }

      const anchor = target instanceof HTMLAnchorElement ? target : null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      if (isCta && (url.hash === "#book" || /cal\.com$/i.test(url.hostname))) {
        send({ eventType: "conversion", sectionId, metadata: { label, ctaId, conversionType: "booked_call" } });
      }
      if (
        url.origin === window.location.origin &&
        url.pathname !== pathname
      ) {
        send({
          eventType: "site_navigation",
          sectionId,
          metadata: { destination: url.pathname, label },
        });
      } else if (url.origin !== window.location.origin) {
        send({ eventType: "site_navigation", sectionId, metadata: { destination: url.hostname, exitLink: url.hostname, label } });
      }
    };
    document.addEventListener("click", click, true);

    const scroll = () => {
      const documentHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const depth = Math.min(100, Math.round((window.scrollY / documentHeight) * 100));
      scrollThresholds.forEach((threshold) => {
        if (depth >= threshold && !sentScrollThresholds.has(threshold)) {
          sentScrollThresholds.add(threshold);
          send({ eventType: "scroll_depth", value: threshold, metadata: { depth: threshold } });
        }
      });
      const zone = Math.min(7, Math.floor(depth / 12.5));
      if (!sentScrollZones.has(zone)) {
        sentScrollZones.add(zone);
        const midpoint = window.scrollY + window.innerHeight * 0.45;
        const sectionId = [...sectionByElement.entries()].find(([element]) => {
          const rect = element.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = top + rect.height;
          return midpoint >= top && midpoint < bottom;
        })?.[1];
        send({
          eventType: "scroll_zone",
          sectionId,
          value: zone,
          metadata: {
            depth,
            zone,
            sectionLabel: sectionId ? sectionLabelsById.get(sectionId) ?? sectionId : null,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
          },
        });
      }
    };
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();

    const endSession = () => {
      if (ended) return;
      ended = true;
      const now = performance.now();
      activeSince.forEach((start, sectionId) => {
        durations.set(sectionId, (durations.get(sectionId) ?? 0) + now - start);
      });
      const events: ClientEvent[] = [...durations.entries()]
        .filter(([, durationMs]) => durationMs >= 250)
        .map(([sectionId, durationMs]) => ({
          eventType: "section_time",
          sectionId,
          durationMs,
          metadata: { sectionLabel: sectionLabelsById.get(sectionId) ?? sectionId },
        }));
      const totalDuration = now - startedAt;
      events.push({
        eventType: "session_end",
        durationMs: totalDuration,
        metadata: {
          bounced: interactionCount === 0 && totalDuration < 10_000,
          sectionsViewed: viewedSections.size,
        },
      });
      sendBatch(events);
    };
    const visibility = () => {
      if (document.visibilityState === "hidden") endSession();
    };
    window.addEventListener("pagehide", endSession);
    document.addEventListener("visibilitychange", visibility);

    return () => {
      observer.disconnect();
      window.removeEventListener("saas:analytics", customEvent);
      document.removeEventListener("click", click, true);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pagehide", endSession);
      document.removeEventListener("visibilitychange", visibility);
      endSession();
    };
  }, [pathname]);

  return null;
}
