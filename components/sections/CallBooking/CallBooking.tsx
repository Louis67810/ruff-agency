"use client";

import { useEffect } from "react";
import {
  Availability,
  ClientsSatisfaits,
} from "@/components/sections/Hero2Optimized/Hero2Optimized";
import { useLocale } from "@/components/LocaleProvider";
import { trackSaasEvent } from "@/app/saas-redesign/saas-analytics-tracker";
import "./CallBooking.css";

declare global {
  interface Window {
    Cal?: any;
  }
}

const CAL_SCRIPT = "https://app.cal.com/embed/embed.js";

function initialiseCalAfterHydration(locale: "fr" | "en") {
  (function (C: Window, A: string, L: string) {
    const push = (api: any, args: IArguments | unknown[]) => {
      api.q.push(args);
    };
    const documentRef = C.document;
    C.Cal =
      C.Cal ||
      (function () {
        const cal = C.Cal;
        const args = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          documentRef.head.appendChild(
            documentRef.createElement("script"),
          ).src = A;
          cal.loaded = true;
        }
        if (args[0] === L) {
          const api: any = function () {
            push(api, arguments);
          };
          const namespace = args[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            push(cal.ns[namespace], args);
            push(cal, ["initNamespace", namespace]);
          } else push(cal, args);
          return api;
        }
        push(cal, args);
      } as any);
  })(window, CAL_SCRIPT, "init");

  const cal = window.Cal;
  cal("init", "discovery-call", { origin: "https://app.cal.com" });
  cal.config = cal.config || {};
  cal.config.forwardQueryParams = true;
  cal.ns["discovery-call"]("inline", {
    elementOrSelector: "#my-cal-inline-discovery-call",
    config: { layout: "month_view", locale, useSlotsViewOnSmallScreen: "true" },
    calLink: "ruffagency/discovery-call",
  });
  cal.ns["discovery-call"]("ui", {
    hideEventTypeDetails: false,
    layout: "month_view",
  });
}

export default function CallBooking({ locale }: { locale?: "fr" | "en" }) {
  const english = (locale ?? useLocale()) === "en";
  useEffect(() => {
    initialiseCalAfterHydration(english ? "en" : "fr");
    const cal = window.Cal?.ns?.["discovery-call"];
    if (!cal) return;
    const onBooking = (event: { detail?: { data?: { uid?: string } } }) => {
      const uid = event.detail?.data?.uid;
      if (uid) {
        const key = `ruff_saas_booking_${uid}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      }
      trackSaasEvent({
        eventType: "conversion",
        sectionId: "booking",
        metadata: { conversionType: "booking_confirmed", ...(uid ? { bookingUid: uid } : {}) },
      });
    };
    cal("on", { action: "bookingSuccessfulV2", callback: onBooking });
    return () => cal("off", { action: "bookingSuccessfulV2", callback: onBooking });
  }, [english]);

  return (
    <main className="call-booking">
      <section
        className="call-booking__intro"
        aria-labelledby="call-booking-title"
      >
        <ClientsSatisfaits />
        <h1 id="call-booking-title">
          {english
            ? "Book a 30-minute call"
            : "Réserver un appel de 30 minutes"}
        </h1>
        <p>
          {english
            ? "During these 30 minutes, we will review your current situation and understand your needs."
            : "Pendant ces 30 minutes nous allons analyser votre situation actuelle pour comprendre vos besoins."}
        </p>
        <div className="call-booking__availability">
          <Availability english={english} />
        </div>
      </section>
      <section
        className="call-booking__calendar"
        aria-label={
          english
            ? "Choose a time for your call"
            : "Choisir un créneau pour votre appel"
        }
      >
        <div id="my-cal-inline-discovery-call" />
      </section>
    </main>
  );
}
