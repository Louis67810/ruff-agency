"use client";

import { useEffect } from "react";

const X_PIXEL_ID = "rf4si";

export const X_CONVERSION_EVENTS = {
  briefCtaClick: "tw-rf4si-rhhtc",
  briefSubmitted: "tw-rf4si-rhhtd",
  whatsappContactClick: "tw-rf4si-rhhtf",
  emailContactClick: "tw-rf4si-rhhtg",
} as const;

type Twq = ((...args: unknown[]) => void) & {
  exe?: (...args: unknown[]) => void;
  queue: IArguments[];
  version: string;
};

declare global {
  interface Window {
    twq?: Twq;
    __ruffXPixelInitialized?: boolean;
  }
}

function initializeXPixel() {
  if (typeof window === "undefined" || window.__ruffXPixelInitialized) return;

  window.__ruffXPixelInitialized = true;
  if (!window.twq) {
    const twq = function (...args: unknown[]) {
      if (twq.exe) twq.exe(...args);
      else twq.queue.push(arguments);
    } as Twq;
    twq.queue = [];
    twq.version = "1.1";
    window.twq = twq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://static.ads-twitter.com/uwt.js";
    document.head.appendChild(script);
  }

  window.twq("config", X_PIXEL_ID);
}

export function trackXConversion(eventId: string) {
  initializeXPixel();
  window.twq?.("event", eventId, {});
}

export default function SaasRedesignXPixel() {
  useEffect(() => {
    initializeXPixel();

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      let destination: URL;
      try {
        destination = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (
        destination.origin === window.location.origin &&
        /^\/en\/saas-redesign\/brief\/?$/.test(destination.pathname)
      ) {
        const sourceParams = new URLSearchParams(window.location.search);
        ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "twclid"].forEach((key) => {
          const value = sourceParams.get(key);
          if (value && !destination.searchParams.has(key)) {
            destination.searchParams.set(key, value);
          }
        });
        anchor.href = destination.href;
        trackXConversion(X_CONVERSION_EVENTS.briefCtaClick);
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
