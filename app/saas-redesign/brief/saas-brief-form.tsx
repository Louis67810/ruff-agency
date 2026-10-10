"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Logo } from "@/components/navigation/NavBar";

const mrrBands = ["<5k", "5–10k", "10–30k", "30k+"];
const changeOptions = [
  "Looks generic",
  "Low conversion",
  "Outgrown the brand",
  "Other",
];
const stepCount = 5;
const stepQuestions = [
  "What’s your SaaS website?",
  "What’s your work email?",
  "What’s your current MRR?",
  "What needs to change?",
  "Anything else we should know?",
];

export default function SaasBriefForm() {
  const [step, setStep] = useState(0);
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [mrr, setMrr] = useState("");
  const [changes, setChanges] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const stepPanelRef = useRef<HTMLDivElement>(null);
  const progress = Math.round(((step + 1) / stepCount) * 100);
  const briefMessage = [
    "Hi Ruff Agency, I'd like to discuss a redesign for my SaaS.",
    "",
    `SaaS website: ${website}`,
    `Work email: ${email}`,
    `Current MRR: ${mrr}`,
    `What needs to change: ${changes.join(", ")}`,
    details.trim() ? `Additional details: ${details.trim()}` : "",
  ].filter(Boolean).join("\n");
  const briefSubject = `SaaS redesign brief — ${website}`;
  const whatsappHref = `https://api.whatsapp.com/send/?phone=33636465091&text=${encodeURIComponent(briefMessage)}&type=phone_number&app_absent=0`;
  const emailHref = `mailto:?subject=${encodeURIComponent(briefSubject)}&body=${encodeURIComponent(briefMessage)}`;

  useEffect(() => {
    if (step === 2 || step === 3)
      stepPanelRef.current?.focus({ preventScroll: true });
    if (step > 0)
      formRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
  }, [step]);

  function toggleChange(option: string) {
    setSelectionError("");
    setChanges((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSelectionError("");

    if (step === 2 && !mrr) {
      setSelectionError("Choose your current MRR to continue.");
      return;
    }
    if (step === 0) {
      const value = website.trim();
      if (value && !/^https?:\/\//i.test(value)) setWebsite(`https://${value}`);
    }
    if (step === 3 && changes.length === 0) {
      setSelectionError("Choose at least one priority to continue.");
      return;
    }
    if (step === stepCount - 1) {
      setSubmitted(true);
      return;
    }
    setStep((current) => current + 1);
  }

  function goBack() {
    setSelectionError("");
    setStep((current) => Math.max(0, current - 1));
  }

  return (
    <main className="sb-page">
      <div className="sb-haze sb-haze--top" aria-hidden="true" />
      <div className="sb-haze sb-haze--left" aria-hidden="true" />
      <div className="sb-outline sb-outline--left" aria-hidden="true" />
      <div className="sb-outline sb-outline--right" aria-hidden="true" />

      <div className="sb-wrap">
        <header className="sb-header">
          <Logo className="sb-brand" href="/en/saas-redesign" />
          <div className="sb-heading">
            <h1>You’re One Step Away From Standing Out</h1>
            <p>
              Our agency helps your SaaS do what AI can’t: bring real design
              taste and creative direction to the table.
            </p>
          </div>
          <div className="sb-rule" />
        </header>

        <form className="aq-root sb-form" onSubmit={handleSubmit} ref={formRef}>
          {submitted ? (
              <div className="sb-success" role="status" aria-live="polite">
                <span className="sb-success-icon"><CheckIcon /></span>
                <button className="sb-back sb-success-back" onClick={() => { setSubmitted(false); goBack(); }} type="button">
                  <ArrowLeftIcon aria-hidden="true" /><span>Back to the previous question</span>
                </button>
                <h2>Thanks for telling us about your SaaS.</h2>
                <p>Choose how you’d like to send your brief.</p>
                <div className="sb-send-actions">
                  <a
                    className="sb-submit sb-send-cta sb-send-cta--whatsapp"
                    href={whatsappHref}
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
                  <button className="sb-back" onClick={goBack} type="button">
                    <ArrowLeftIcon aria-hidden="true" /><span>Back</span>
                  </button>
                )}
                <h2 className="sb-question">{stepQuestions[step]}</h2>
                <div className="sb-question-rule" aria-hidden="true" />
                {step === 0 && (
                  <label className="sb-field">
                    <span className="sb-sr-only">Your SaaS</span>
                    <input
                      autoComplete="url"
                      autoFocus
                      name="website"
                      onChange={(event) => setWebsite(event.target.value)}
                      onBlur={(event) => {
                        const value = event.currentTarget.value.trim();
                        if (value && !/^https?:\/\//i.test(value)) setWebsite(`https://${value}`);
                      }}
                      placeholder="https://saas.com"
                      required
                      inputMode="url"
                      type="text"
                      value={website}
                    />
                  </label>
                )}
                {step === 1 && (
                  <label className="sb-field">
                    <span className="sb-sr-only">Work email</span>
                    <input
                      autoComplete="email"
                      autoFocus
                      name="email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@saas.com"
                      required
                      type="email"
                      value={email}
                    />
                  </label>
                )}
                {step === 2 && (
                  <fieldset className="sb-choice-group">
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
                  <fieldset className="sb-choice-group">
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
                      autoFocus
                      maxLength={800}
                      name="details"
                      onChange={(event) => setDetails(event.target.value)}
                      placeholder="Tell us a little more about your goals…"
                      rows={4}
                      value={details}
                    />
                  </label>
                )}
                <p className="sb-form-error" role="alert">
                  {selectionError}
                </p>
              </div>

              <div className="sb-form-footer">
                <button className="sb-submit" type="submit">
                  <span>{step === stepCount - 1 ? "Send My SaaS" : "Continue"}</span>
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
