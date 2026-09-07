"use client";

import { useEffect } from "react";
import type { AnalyticsEventInput } from "@/lib/saas-analytics/types";

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

export function trackSaasEvent(detail: ClientEvent) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("saas:analytics", { detail }));
}

export function SaasAnalyticsTracker() {
  useEffect(() => {
    if (window.location.pathname !== "/saas-redesign") return;
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

    const decorate = (event: ClientEvent): AnalyticsEventInput => ({
      ...event,
      visitorId,
      sessionId,
      path: "/saas-redesign",
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

    send({ eventType: "page_view", metadata: { visitCount } });

    const sectionByElement = new Map<Element, string>();
    sectionSelectors.forEach(([id, selector]) => {
      const element = document.querySelector(selector);
      if (element) sectionByElement.set(element, id);
    });
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
              send({ eventType: "section_view", sectionId });
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
        "a,button",
      );
      if (!target) return;
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
      send({ eventType: "cta_click", sectionId, metadata: { label } });

      const anchor = target instanceof HTMLAnchorElement ? target : null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.hash === "#book" || /cal\.com$/i.test(url.hostname)) {
        send({ eventType: "conversion", sectionId, metadata: { label } });
      }
      if (
        url.origin === window.location.origin &&
        url.pathname !== "/saas-redesign"
      ) {
        send({
          eventType: "site_navigation",
          sectionId,
          metadata: { destination: url.pathname },
        });
      }
    };
    document.addEventListener("click", click, true);

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
      window.removeEventListener("pagehide", endSession);
      document.removeEventListener("visibilitychange", visibility);
      endSession();
    };
  }, []);

  return null;
}
