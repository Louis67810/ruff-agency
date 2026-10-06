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
                <p className="sb-eyebrow">Your brief is ready</p>
                <h2>Thanks for telling us about your SaaS.</h2>
                <p>Choose how you’d like to send your brief.</p>
                <div className="sb-send-actions">
                  <a
                    className="sb-submit sb-send-cta sb-send-cta--whatsapp"
                    href={whatsappHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Send on WhatsApp</span>
                    <ArrowRightIcon aria-hidden="true" />
                  </a>
                  <a className="sb-submit sb-send-cta" href={emailHref}>
                    <span>Send by email</span>
                    <ArrowRightIcon aria-hidden="true" />
                  </a>
                </div>
                <a className="sb-back-link" href="/en/saas-redesign">
                  Back to the SaaS redesign page
                </a>
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
                <h2 className="sb-question">{stepQuestions[step]}</h2>
                {step === 0 && (
                  <label className="sb-field">
                    <span>Your SaaS</span>
                    <input
                      autoComplete="url"
                      autoFocus
                      name="website"
                      onChange={(event) => setWebsite(event.target.value)}
                      placeholder="saas.com"
                      required
                      type="text"
                      value={website}
                    />
                  </label>
                )}
                {step === 1 && (
                  <label className="sb-field">
                    <span>Work email</span>
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
                    <legend>Current MRR</legend>
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
                            {mrr === band ? <CheckIcon /> : null}
                          </span>
                          <span className="sb-choice-label">{band}</span>
                          <span className="sb-choice-trail" aria-hidden="true">
                            <span className="sb-choice-divider" />
                            <ArrowRightIcon />
                          </span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}
                {step === 3 && (
                  <fieldset className="sb-choice-group">
                    <legend>What needs to change?</legend>
                    <p className="sb-choice-hint">Choose all that apply.</p>
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
                              {selected ? <CheckIcon /> : null}
                            </span>
                            <span className="sb-choice-label">{option}</span>
                            <span className="sb-choice-trail" aria-hidden="true">
                              <span className="sb-choice-divider" />
                              <ArrowRightIcon />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}
                {step === 4 && (
                  <label className="sb-field sb-field--details">
                    <span>Anything else we should know?</span>
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
                {step > 0 && (
                  <button
                    className="sb-back"
                    onClick={goBack}
                    type="button"
                  >
                    <ArrowLeftIcon aria-hidden="true" />
                    <span>Back</span>
                  </button>
                )}
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
