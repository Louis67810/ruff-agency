"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@heroicons/react/24/solid";
import { normalizeSaasWebsite, stripWebsiteProtocol, normalizeWorkEmail, validateBriefStep, validateCompletedBrief, briefMrrOptions as mrrBands, briefChangeOptions as changeOptions } from "@/lib/saas-brief/validation";
import { captureBriefAttribution, type BriefAttribution } from "@/lib/saas-brief/attribution";

type SaveResult = { ok: boolean; error?: string; step?: number };
const stepCount = 5;
const stepQuestions = [
  "What’s your SaaS website?",
  "What’s your work email?",
  "What’s your current MRR?",
  "What needs to change?",
  "Anything else we should know?",
];

type BriefDraft = {
  website: string;
  email: string;
  mrr: string;
  changes: string[];
  details: string;
  step: number;
  submitted: boolean;
};

export default function SaasBriefForm() {
  const [step, setStep] = useState(0);
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [mrr, setMrr] = useState("");
  const [changes, setChanges] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [ready, setReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const submittingRef = useRef(false);
  const saveQueue = useRef<Promise<SaveResult>>(Promise.resolve({ ok: true }));
  const stepPanelRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const briefSession = useRef<{ id: string; token: string; visitorId: string; revision: number } | null>(null);
  const startedAt = useRef(Date.now());
  const attribution = useRef<BriefAttribution | null>(null);
  const latestDraft = useRef<BriefDraft>({ website, email, mrr, changes, details, step, submitted });
  latestDraft.current = { website, email, mrr, changes, details, step, submitted };
  const progress = Math.round(((step + 1) / stepCount) * 100);
  const normalizedWebsite = normalizeSaasWebsite(website) ?? website.trim();
  const briefMessage = [
    "Hi Ruff Agency, I'd like to discuss a redesign for my SaaS.",
    "",
    `SaaS website: ${normalizedWebsite}`,
    mrr ? `Current MRR: ${mrr}` : "",
    changes.length ? `What needs to change: ${changes.join(", ")}` : "",
    details.trim() ? `Additional details: ${details.trim()}` : "",
  ].filter(Boolean).join("\n");
  const briefSubject = `SaaS redesign brief — ${normalizedWebsite}`;
  const whatsappHref = `https://api.whatsapp.com/send/?phone=33636465091&text=${encodeURIComponent(briefMessage)}&type=phone_number&app_absent=0`;
  const emailHref = `mailto:?subject=${encodeURIComponent(briefSubject)}&body=${encodeURIComponent(briefMessage)}`;

  async function saveDraft(complete = latestDraft.current.submitted): Promise<SaveResult> {
    const session = briefSession.current;
    if (!session) return { ok: false, error: "The form is still loading. Please try again." };
    if (!complete && (submittingRef.current || latestDraft.current.submitted)) return { ok: true };
    const draft = latestDraft.current;
    const payload = {
      id: session.id,
      token: session.token,
      visitorId: session.visitorId,
      revision: ++session.revision,
      lastStep: complete ? stepCount : draft.step,
      website: normalizeSaasWebsite(draft.website) ?? draft.website.trim(),
      email: normalizeWorkEmail(draft.email) ?? draft.email.trim(),
      mrr: draft.mrr,
      changes: draft.changes,
      details: draft.details,
      durationMs: Math.min(Date.now() - startedAt.current, 86_400_000),
      completed: complete,
      attribution: attribution.current,
    };
    // Keep draft writes in order so an autosave cannot undo final completion.
    const request = saveQueue.current.then(async (): Promise<SaveResult> => {
      if (!complete && payload.revision < session.revision) return { ok: true };
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15_000);
      try {
        const response = await fetch("/api/saas-brief", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
          signal: controller.signal,
        });
        if (response.ok) return { ok: true };
        const issue = await response.json().catch(() => null) as { error?: string; step?: number } | null;
        const invalidStep = issue?.step;
        if (response.status === 400 && typeof invalidStep === "number" && Number.isInteger(invalidStep) && invalidStep >= 0 && invalidStep < stepCount) {
          return { ok: false, error: issue?.error || "Please check this answer.", step: invalidStep };
        }
        const error = response.status === 429 ? "Too many attempts. Please wait a moment and try again."
          : response.status === 413 ? "Your brief is too long. Shorten your additional details and try again."
          : "We couldn't save your brief right now. Your answers are still here. Please try again in a moment.";
        return { ok: false, error };
      } catch {
        return { ok: false, error: controller.signal.aborted
          ? "Saving took too long. Your answers are still here. Please try again."
          : "We couldn't reach the server. Check your connection and try again." };
      } finally {
        window.clearTimeout(timeout);
      }
    });
    saveQueue.current = request;
    return request;
  }

  useEffect(() => {
    setReady(true);
    if (!attribution.current) attribution.current = captureBriefAttribution();
    if (!briefSession.current) {
      let visitorId = crypto.randomUUID();
      try {
        const existing = localStorage.getItem("ruff_saas_visitor_id");
        if (existing && /^[0-9a-f-]{36}$/i.test(existing)) visitorId = existing;
        else localStorage.setItem("ruff_saas_visitor_id", visitorId);
      } catch { /* Private browsing may block local storage. */ }
      const id = crypto.randomUUID();
      briefSession.current = { id, token: crypto.randomUUID(), visitorId, revision: -1 };
    }
    void saveDraft(false);
    const flush = () => {
      if (!submittingRef.current && !latestDraft.current.submitted) void saveDraft(false);
    };
    const whenHidden = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", whenHidden);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", whenHidden);
    };
  }, []);

  useEffect(() => {
    if (!briefSession.current || submitted || isSaving) return;
    const timer = window.setTimeout(() => { void saveDraft(); }, 550);
    return () => window.clearTimeout(timer);
  }, [website, email, mrr, changes, details, step, submitted, isSaving]);

  useLayoutEffect(() => {
    if (step === 0) return;
    const panel = stepPanelRef.current;
    if (!panel) return;
    const top = panel.closest("form")?.getBoundingClientRect().top ?? panel.getBoundingClientRect().top;
    if (top < 16) window.scrollTo({ top: Math.max(0, window.scrollY + top - 16), behavior: "instant" });
    panel.focus({ preventScroll: true });
  }, [step]);

  function toggleChange(option: string) {
    setSelectionError("");
    setChanges((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    setSelectionError("");
    const issue = validateBriefStep(latestDraft.current, step);
    if (issue) {
      setSelectionError(issue);
      if (step === 1) emailInputRef.current?.focus();
      return;
    }
    if (step === stepCount - 1) {
      const invalid = validateCompletedBrief(latestDraft.current);
      if (invalid) {
        setStep(invalid.step);
        setSelectionError(invalid.error);
        return;
      }
      submittingRef.current = true;
      setIsSaving(true);
      const saved = await saveDraft(true);
      submittingRef.current = false;
      setIsSaving(false);
      if (!saved.ok) {
        if (saved.step !== undefined) setStep(saved.step);
        setSelectionError(saved.error || "Please try again.");
        return;
      }
      setSubmitted(true);
      return;
    }
    setStep((current) => current + 1);
  }

  function goBack() {
    setSelectionError("");
    setStep((current) => Math.max(0, current - 1));
  }

  function trackWhatsAppClick() {
    const session = briefSession.current;
    if (!session) return;
    void fetch("/api/saas-brief/whatsapp-click", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: session.id, token: session.token }),
      keepalive: true,
    }).catch(() => { /* The WhatsApp link must remain usable if tracking is unavailable. */ });
  }

  return (
    <main className="sb-page">
      <div className="sb-haze sb-haze--top" aria-hidden="true" />
      <div className="sb-haze sb-haze--left" aria-hidden="true" />
      <div className="sb-outline sb-outline--left" aria-hidden="true" />
      <div className="sb-outline sb-outline--right" aria-hidden="true" />
      <div className="sb-wrap">
        <header className="sb-header">
          <a className="sb-brand" href="/en/saas-redesign" aria-label="Ruff Agency home">
            <img src="/ruff-logo-mark.svg" alt="" width="69" height="44" />
            <span>.agency</span>
          </a>
          <div className="sb-heading">
            <h1>You’re One Step Away From Standing Out</h1>
            <p>
              Our agency helps your SaaS do what AI can’t: bring real design
              taste and creative direction to the table.
            </p>
          </div>
          <div className="sb-rule" />
        </header>

        <form className="sb-form" onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
          {submitted ? (
              <div className="sb-success" role="status" aria-live="polite">
                <span className="sb-success-icon"><CheckIcon /></span>
                <button className="sb-back sb-success-back" onClick={() => { setSubmitted(false); goBack(); }} type="button">
                  <ArrowLeftIcon aria-hidden="true" /><span>Back to the previous question</span>
                </button>
                <h2>Thanks for telling us about your SaaS.</h2>
                <p>Your brief is saved. Choose how you’d like to contact us.</p>
                <div className="sb-send-actions">
                  <a
                    className="sb-submit sb-send-cta sb-send-cta--whatsapp"
                    href={whatsappHref}
                    onClick={trackWhatsAppClick}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.55 0 .22 5.33.22 11.9c0 2.1.55 4.15 1.6 5.96L.12 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.56 0 11.9-5.34 11.9-11.9a11.82 11.82 0 0 0-3.49-8.42ZM12.1 21.77h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.85 9.85 0 0 1-1.52-5.23c0-5.47 4.45-9.92 9.92-9.92a9.86 9.86 0 0 1 7.02 2.91 9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.93 9.92Zm5.45-7.43c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.47-2.4-1.49-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.49 1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.3 1.27.48 1.7.61.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.13-.27-.2-.57-.35Z"/></svg>
                    <span>Send on WhatsApp</span>
                  </a>
                  <a className="sb-email-link" href={emailHref}>Send by email</a>
                </div>
            </div>
          ) : (
            <>
              <div
                className="sb-step-panel"
                key={step}
                ref={stepPanelRef}
                tabIndex={-1}
                aria-live="polite"
              >
                {step > 0 && (
                  <button className="sb-back" onClick={goBack} type="button" disabled={isSaving}>
                    <ArrowLeftIcon aria-hidden="true" /><span>Back</span>
                  </button>
                )}
                <h2 className="sb-question">{stepQuestions[step]}</h2>
                {step === stepCount - 1 && <span className="sb-optional">Optional. You can continue without answering.</span>}
                <div className="sb-question-rule" aria-hidden="true" />
                {step === 0 && (
                  <label className="sb-field">
                    <span className="sb-sr-only">Your SaaS website</span>
                    <span className="sb-url-field">
                      <span aria-hidden="true">https://</span>
                      <input
                        aria-label="Your SaaS website, after https://"
                        autoComplete="url"
                        name="website"
                        maxLength={500}
                        onChange={(event) => { setWebsite(stripWebsiteProtocol(event.target.value)); setSelectionError(""); }}
                        placeholder="saas.com"
                        required
                        inputMode="url"
                        type="text"
                        value={website}
                      />
                    </span>
                  </label>
                )}
                {step === 1 && (
                  <label className="sb-field">
                    <span className="sb-sr-only">Work email</span>
                    <input
                      ref={emailInputRef}
                      autoComplete="email"
                      name="email"
                      maxLength={254}
                      aria-invalid={Boolean(selectionError)}
                      aria-describedby={selectionError ? "sb-form-error" : undefined}
                      onChange={(event) => { setEmail(event.target.value); setSelectionError(""); }}
                      placeholder="you@saas.com"
                      required
                      type="email"
                      value={email}
                    />
                  </label>
                )}
                {step === 2 && (
                  <fieldset className="sb-choice-group" aria-required="true">
                    <legend className="sb-sr-only">Current MRR</legend>
                    <div className="sb-choice-row sb-choice-row--vertical">
                      {mrrBands.map((band) => (
                        <button
                          aria-pressed={mrr === band}
                          className={`sb-choice${mrr === band ? " is-selected" : ""}`}
                          key={band}
                          onClick={() => {
                            setMrr(band);
                            setSelectionError("");
                          }}
                          type="button"
                        >
                          <span className="sb-choice-check" aria-hidden="true">
                            <CheckIcon className={mrr === band ? "is-visible" : ""} />
                          </span>
                          <span className="sb-choice-label">{band}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}
                {step === 3 && (
                  <fieldset className="sb-choice-group" aria-required="true">
                    <legend className="sb-sr-only">What needs to change? Choose all that apply.</legend>
                    <div className="sb-choice-row sb-choice-row--vertical">
                      {changeOptions.map((option) => {
                        const selected = changes.includes(option);
                        return (
                          <button
                            aria-pressed={selected}
                            className={`sb-choice${selected ? " is-selected" : ""}`}
                            key={option}
                            onClick={() => toggleChange(option)}
                            type="button"
                          >
                            <span className="sb-choice-check" aria-hidden="true">
                              <CheckIcon className={selected ? "is-visible" : ""} />
                            </span>
                            <span className="sb-choice-label">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}
                {step === 4 && (
                  <label className="sb-field sb-field--details">
                    <span className="sb-sr-only">Anything else we should know?</span>
                    <textarea
                      disabled={isSaving}
                      maxLength={800}
                      name="details"
                      onChange={(event) => setDetails(event.target.value)}
                      placeholder="Tell us a little more about your goals…"
                      rows={4}
                      value={details}
                    />
                  </label>
                )}
                <p id="sb-form-error" className="sb-form-error" role="alert">
                  {selectionError}
                </p>
              </div>

              <div className="sb-form-footer">
                <button className="sb-submit" disabled={!ready || isSaving} type="submit">
                  <span>{isSaving ? "Saving…" : step === stepCount - 1 ? "Save My Brief" : "Continue"}</span>
                  <ArrowRightIcon aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </form>

        {!submitted && (
          <div className="sb-progress-wrap">
            <span className="sb-progress-label" aria-hidden="true">
              {step + 1}/{stepCount}
            </span>
            <div
              className="sb-progress"
              role="progressbar"
              aria-label="Form progress"
              aria-valuemin={1}
              aria-valuemax={stepCount}
              aria-valuenow={step + 1}
              aria-valuetext={`${step + 1} of ${stepCount}`}
            >
              <div className="sb-progress-track">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
