"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isReplayPath, REPLAY_CONSENT_KEY, type ReplayEvent } from "@/lib/session-replay/types";

export function SessionReplayRecorder() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<"loading" | "yes" | "no">("loading");
  useEffect(() => {
    const readChoice = () => { try {
      if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) { setChoice("no"); return; }
      const stored = JSON.parse(localStorage.getItem(REPLAY_CONSENT_KEY) ?? "null");
      setChoice(stored && Date.now() - stored.at < 180 * 86400000 ? stored.allowed ? "yes" : "no" : "no");
    } catch { setChoice("no"); } };
    readChoice();
    const sync = (event: StorageEvent) => { if (event.key === REPLAY_CONSENT_KEY) readChoice(); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (choice !== "yes" || !isReplayPath(pathname)) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let flush: (() => void) | undefined;
    const start = async () => {
      try {
        const visitorId = localStorage.getItem("ruff_saas_visitor_id");
        const sessionId = sessionStorage.getItem("ruff_saas_session_id");
        if (!visitorId || !sessionId) return;
        const { record } = await import("@rrweb/record");
        if (cancelled) return;
        const id = crypto.randomUUID(), token = crypto.randomUUID();
        let sequence = 0, busy = false, failed = false;
        let queue: ReplayEvent[] = [];
        let inFlight: ReplayEvent[] | null = null;
        let failures = 0;
        const send = async () => {
          if (busy || failed || (!queue.length && !inFlight)) return;
          busy = true;
          if (!inFlight) {
            inFlight = [];
            let size = 0;
            while (queue.length && inFlight.length < 1000) {
              const nextSize = new TextEncoder().encode(JSON.stringify(queue[0])).length;
              if (size + nextSize > 1_800_000) break;
              size += nextSize;
              inFlight.push(queue.shift()!);
            }
            if (!inFlight.length) { failed = true; stop?.(); busy = false; return; }
          }
          const body = JSON.stringify({ id, token, visitorId, sessionId, path: pathname, consent: true, sequence, events: inFlight });
          try {
            const response = await fetch("/api/session-replay", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: new TextEncoder().encode(body).length < 60_000 });
            if (!response.ok) throw new Error("Replay upload failed");
            sequence++; inFlight = null; failures = 0;
          } catch { if (++failures >= 3) { failed = true; stop?.(); } }
          finally { busy = false; }
        };
        flush = () => { void send(); };
        stop = record({
          emit(event) {
            // Never retain query strings or hashes from the captured page URL.
            if (event.type === 4) event = { ...event, data: { ...event.data, href: `${location.origin}${pathname}` } };
            queue.push(event);
            if (queue.length > 10000) { failed = true; stop?.(); queue = []; }
          },
          maskAllInputs: true,
          maskTextSelector: "[data-replay-private], [contenteditable]",
          blockSelector: "form, input, textarea, select, [contenteditable], iframe, [data-replay-private], .sr-live-faq, .sr-final-faq, .replay-consent",
          recordCanvas: false,
          collectFonts: false,
          inlineImages: false,
          recordCrossOriginIframes: false,
          slimDOMOptions: "all",
          sampling: { mousemove: 100, scroll: 150, media: 500, input: "last" },
        });
        timer = setInterval(flush, 3000);
        timeout = setTimeout(() => { stop?.(); flush?.(); }, 20 * 60_000);
        flush();
      } catch { /* Recording must never prevent browsing. */ }
    };
    void start();
    const leave = () => flush?.();
    window.addEventListener("pagehide", leave);
    return () => {
      cancelled = true; stop?.(); flush?.();
      clearInterval(timer); clearTimeout(timeout);
      window.removeEventListener("pagehide", leave);
    };
  }, [choice, pathname]);
  return null;
}
