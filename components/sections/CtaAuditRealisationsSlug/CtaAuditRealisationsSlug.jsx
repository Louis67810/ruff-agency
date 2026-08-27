"use client";
import React, { useMemo, useState } from "react";
import "./CtaAuditRealisationsSlug.css";

const DEFAULT_REVENUE_OPTIONS = [
  "0 - 50k EUR",
  "50k - 150k EUR",
  "150k - 500k EUR",
  "+1M EUR",
];
const INITIAL_DATA = {
  name: "",
  email: "",
  phone: "",
  revenue: "",
  website: "",
};

const ASSETS = {
  arrow:
    "https://framerusercontent.com/images/B5OX1PNiI9DWmjLzDIRM8INSk.svg?width=24&height=24",
  name: "https://framerusercontent.com/images/j7g10opHUNhn6wwdBjqIsUL7YzQ.svg?width=24&height=24",
  email:
    "https://framerusercontent.com/images/nzBGeewWvf03LT2AHkedWlEKag.svg?width=24&height=24",
  phone:
    "https://framerusercontent.com/images/xWQoQ8t1QlzfahsIfFu7Fux8GlU.svg?width=24&height=24",
  revenue:
    "https://framerusercontent.com/images/nQrlj5JNqHFgm8M53Ebo5FIVzcI.svg?width=24&height=24",
  website:
    "https://framerusercontent.com/images/VXoRUUHIIvTQQuuClb9oPEhwQRA.svg?width=24&height=24",
  success:
    "https://framerusercontent.com/images/u7YpUNGm0SjR3lPDWwaomrJ1U2I.svg?width=24&height=24",
  avatar1:
    "https://framerusercontent.com/images/vQSphHdDMyf2M01VZj4zismEo.png?width=995&height=997",
  avatar2:
    "https://framerusercontent.com/images/U79Uc28QcBRQZ92ELfd3OSvLCN0.png?width=1106&height=1106",
  avatar3:
    "https://framerusercontent.com/images/iSbFW3k0lUZ5gm1fWdaTGxAkncI.png?width=1127&height=1127",
  product:
    "https://framerusercontent.com/images/qyxLaPTqXm3xPca6HluLQobpAmk.png?width=1179&height=1060",
};

const AVATAR2_SRCSET =
  "https://framerusercontent.com/images/U79Uc28QcBRQZ92ELfd3OSvLCN0.png?scale-down-to=512&width=1106&height=1106 512w, https://framerusercontent.com/images/U79Uc28QcBRQZ92ELfd3OSvLCN0.png?scale-down-to=1024&width=1106&height=1106 1024w, https://framerusercontent.com/images/U79Uc28QcBRQZ92ELfd3OSvLCN0.png?width=1106&height=1106 1106w";
const AVATAR3_SRCSET =
  "https://framerusercontent.com/images/iSbFW3k0lUZ5gm1fWdaTGxAkncI.png?scale-down-to=512&width=1127&height=1127 512w, https://framerusercontent.com/images/iSbFW3k0lUZ5gm1fWdaTGxAkncI.png?scale-down-to=1024&width=1127&height=1127 1024w, https://framerusercontent.com/images/iSbFW3k0lUZ5gm1fWdaTGxAkncI.png?width=1127&height=1127 1127w";
const PRODUCT_SRCSET =
  "https://framerusercontent.com/images/qyxLaPTqXm3xPca6HluLQobpAmk.png?scale-down-to=512&width=1179&height=1060 512w, https://framerusercontent.com/images/qyxLaPTqXm3xPca6HluLQobpAmk.png?scale-down-to=1024&width=1179&height=1060 1024w, https://framerusercontent.com/images/qyxLaPTqXm3xPca6HluLQobpAmk.png?width=1179&height=1060 1179w";

function normalizeWebsite(value) {
  const clean = value.trim();
  if (!clean) return clean;
  if (/^https?:\/\//i.test(clean)) return clean;
  return `https://${clean}`;
}

function fieldIsReady(step, data) {
  if (step === "name") return data.name.trim().length > 1;
  if (step === "contact")
    return data.email.trim().length > 3 && data.phone.trim().length > 4;
  if (step === "company")
    return data.revenue.trim().length > 0 && data.website.trim().length > 3;
  return false;
}

function IconBubble({ src, compact = false }) {
  return (
    <span
      className={
        compact ? "cta-audit-icon-bubble compact" : "cta-audit-icon-bubble"
      }
    >
      <img src={src} alt="Illustration de l’audit de site" draggable="false" />
    </span>
  );
}

function AuditMiniForm({
  webhookUrl,
  redirectUrl = "",
  onComplete,
  revenueOptions = DEFAULT_REVENUE_OPTIONS,
  english = false,
}) {
  const [step, setStep] = useState("name");
  const [data, setData] = useState(INITIAL_DATA);
  const [isSending, setIsSending] = useState(false);
  const canContinue = fieldIsReady(step, data);
  const isTwoLineStep = step === "contact" || step === "company";

  const options = useMemo(
    () => revenueOptions.filter(Boolean),
    [revenueOptions],
  );
  const updateField = (field, value) =>
    setData((current) => ({ ...current, [field]: value }));

  const continueForm = async () => {
    if (!canContinue || isSending) return;
    setIsSending(true);
    const completed = step === "company";

    if (completed && webhookUrl) {
      const payload = {
        status: "pending",
        step,
        source: "framer-agenceflow-mini-form",
        submittedAt: new Date().toISOString(),
        data: {
          ...data,
          phone: data.phone.trim(),
          website: normalizeWebsite(data.website),
        },
      };
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
        if (!response.ok) throw new Error(`Webhook error ${response.status}`);
      } catch (error) {
        console.error("AgenceFlow webhook error", error);
      }
    }

    setIsSending(false);
    if (completed) {
      setStep("done");
      onComplete?.(data);
      if (redirectUrl)
        window.setTimeout(() => {
          window.location.href = redirectUrl;
        }, 350);
      return;
    }
    setStep(step === "name" ? "contact" : "company");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      continueForm();
    }
  };

  return (
    <div className="cta-audit-form-wrapper">
      <div
        className={`cta-audit-form-shell ${isTwoLineStep ? "two-line" : ""} ${step === "contact" ? "contact" : ""}`}
        onKeyDown={handleKeyDown}
      >
        {step === "name" && (
          <>
            <IconBubble src={ASSETS.name} />
            <input
              aria-label={english ? "Name" : "Nom"}
              value={data.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={english ? "Your name" : "Votre nom"}
            />
          </>
        )}

        {step === "contact" && (
          <div className="cta-audit-two-line-group">
            <label className="cta-audit-inline-field">
              <IconBubble src={ASSETS.email} compact />
              <input
                aria-label={english ? "Email address" : "Adresse mail"}
                type="email"
                value={data.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder={english ? "Email address" : "Adresse mail"}
              />
            </label>
            <label className="cta-audit-inline-field">
              <IconBubble src={ASSETS.phone} compact />
              <input
                aria-label={english ? "Phone number" : "Numero de telephone"}
                type="tel"
                value={data.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder={english ? "Phone" : "Telephone"}
              />
            </label>
          </div>
        )}

        {step === "company" && (
          <div className="cta-audit-two-line-group">
            <label className="cta-audit-inline-field">
              <IconBubble src={ASSETS.revenue} compact />
              <select
                aria-label={english ? "Revenue range" : "Tranche de CA"}
                value={data.revenue}
                onChange={(e) => updateField("revenue", e.target.value)}
              >
                <option value="">
                  {english ? "Revenue range" : "Tranche de CA"}
                </option>
                {options.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="cta-audit-inline-field">
              <IconBubble src={ASSETS.website} compact />
              <input
                aria-label={english ? "Website" : "Site internet"}
                value={data.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder={english ? "Website" : "Site internet"}
              />
            </label>
          </div>
        )}

        {step === "done" && (
          <>
            <IconBubble src={ASSETS.success} />
            <div className="cta-audit-success">
              {english
                ? "Thank you, your request has been sent"
                : "Merci, c'est envoye"}
            </div>
          </>
        )}

        {step !== "done" && step !== "company" && (
          <button
            className="cta-audit-arrow"
            aria-label={english ? "Continue" : "Continuer"}
            type="button"
            onClick={continueForm}
            disabled={!canContinue || isSending}
          >
            <img src={ASSETS.arrow} alt="Flèche vers l’étape suivante" draggable="false" />
          </button>
        )}
      </div>

      {step === "company" && (
        <button
          className="cta-audit-submit-outer"
          type="button"
          onClick={continueForm}
          disabled={!canContinue || isSending}
          style={{ opacity: canContinue ? 1 : 0.5 }}
        >
          <span className="cta-audit-submit-inner">
            {english ? "Send" : "Envoyer"}
          </span>
        </button>
      )}
    </div>
  );
}

function SmallAvatar({ className, src, srcSet }) {
  return (
    <div className={`cta-audit-avatar ${className}`}>
      <img src={src} srcSet={srcSet} alt="Illustration de l’audit de site" draggable="false" />
    </div>
  );
}

export default function CtaAuditRealisationsSlug({
  webhookUrl = "https://agenceflow.vercel.app/api/audits/webhook",
  redirectUrl = "",
  onComplete,
  compact = false,
  eyebrow = "Réponse en moins de 48h",
  title = "Recevez un audit personnalisé de votre site par des experts",
  availability = "3 places disponibles pour Juin",
  locale = "fr",
}) {
  const english = locale === "en";
  return (
    <section
      className={`cta-audit-section${compact ? " cta-audit-section--compact" : ""}`}
    >
      <div className="cta-audit-card">
        <div className="cta-audit-vector-one" aria-hidden="true">
          <svg viewBox="-75 -75 1905 1064" preserveAspectRatio="none">
            <path
              opacity="0.77"
              d="M1755 346.216L1444.33 597.907L1220.6 770.466C1116.96 850.401 968.541 833.415 885.641 732.131L443.777 192.283C414.242 156.198 412.832 104.711 440.349 67.0652C459.433 40.957 487.535 22.8696 519.203 16.3134L546.335 10.6963C579.513 3.82734 614.062 9.92013 642.89 27.7239L679.215 50.1587C783.066 114.297 779.919 266.365 673.505 326.153L654.933 336.587C643.536 342.991 631.529 348.243 619.09 352.267L531.906 380.472C491.356 393.591 448.06 395.764 406.399 386.772L390.361 383.311C278.452 359.156 176.566 301.458 98.2913 217.911L0 113"
              stroke="url(#cta-audit-gradient-one)"
              strokeOpacity="0.05"
              strokeWidth="148.009"
              fill="none"
            />
            <defs>
              <linearGradient
                id="cta-audit-gradient-one"
                x1="835.39"
                y1="789.492"
                x2="1350.79"
                y2="478.072"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0398851" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="cta-audit-copy-column">
          <div className="cta-audit-copy-top">
            <div className="cta-audit-pill">
              {english ? "Reply within 48 hours" : eyebrow}
            </div>
            <h2 className="cta-audit-title">
              <span>
                {english
                  ? "Get a personalized website audit from experts"
                  : title}
              </span>
            </h2>
            <div className="cta-audit-form-slot">
              <AuditMiniForm
                webhookUrl={webhookUrl}
                redirectUrl={redirectUrl}
                onComplete={onComplete}
                english={english}
              />
            </div>
          </div>
          <div className="cta-audit-availability">
            <span className="cta-audit-status-wrap">
              <span className="cta-audit-status-halo" />
              <span className="cta-audit-status-dot" />
            </span>
            <span>{english ? "3 spots available in June" : availability}</span>
          </div>
        </div>

        <div className="cta-audit-product" aria-hidden="true">
          <img
            src={ASSETS.product}
            srcSet={PRODUCT_SRCSET}
            alt="Illustration de l’audit de site"
            draggable="false"
          />
        </div>

        <div className="cta-audit-vector-two" aria-hidden="true">
          <svg viewBox="-75 -75 1840 2139" preserveAspectRatio="none">
            <path
              opacity="0.77"
              d="M1185.17 177.634L1253.5 575.816L1294.45 854.474C1313.82 986.31 1222.94 1108.99 1091.18 1128.86L391.746 1234.36C345.265 1241.37 299.767 1216.73 280.246 1173.97C266.292 1143.4 264.313 1108.71 274.699 1076.75L282.539 1052.64C293.091 1020.17 315.934 993.126 346.176 977.291L387.372 955.722C496.221 898.731 626.671 977.734 626.595 1100.6L626.58 1124.56C626.572 1138.26 625.176 1151.92 622.413 1165.34L604.374 1252.94C595.563 1295.73 575.329 1335.34 545.82 1367.56L537.238 1376.92C458.939 1462.41 356.161 1521.64 242.942 1546.52L100.419 1577.85"
              stroke="url(#cta-audit-gradient-two)"
              strokeOpacity="0.05"
              strokeWidth="148.009"
              fill="none"
            />
            <defs>
              <linearGradient
                id="cta-audit-gradient-two"
                x1="1119.29"
                y1="1201.47"
                x2="1114.09"
                y2="595.22"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0398851" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}
