"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/solid";
import { DECOR_SVG } from "../../footer/Footer";
import CtaAuditRealisationsSlug from "../CtaAuditRealisationsSlug/CtaAuditRealisationsSlug";
import "./ArticleQuiz.css";

// Les mêmes réalisations que le ticker du hero de la page d'accueil.
// Les deux colonnes sont volontairement distinctes afin qu'aucune image ne se répète côte à côte.
const HOME_TICKER_COLUMNS = [
  [
    "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069",
    "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854",
    "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884",
    "https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?width=2355&height=1126",
    "https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?width=1252&height=862",
    "https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?width=2335&height=1137",
  ],
  [
    "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?width=2206&height=1223",
    "https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?width=2288&height=1189",
    "https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?width=1650&height=922",
    "https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?width=1346&height=716",
    "https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?width=1600&height=1015",
  ],
];
const DEFAULT_CTA = {
  title: "Votre landing page mérite une refonte pensée pour convertir.",
  description:
    "Réservez un appel pour identifier les opportunités les plus importantes sur votre site.",
  label: "Réserver un appel",
  href: "/contact",
  badge: "Recommandé pour vous",
};
const DEFAULT_ENGLISH_CTA = {
  title: "Your landing page deserves a conversion-focused redesign.",
  description:
    "Book a call to identify the most important opportunities on your website.",
  label: "Book a call",
  href: "/contact",
  badge: "Recommended for you",
};

export function QuizRecommendation({
  cta = {},
  inQuiz = false,
  english = false,
}) {
  const content = { ...(english ? DEFAULT_ENGLISH_CTA : DEFAULT_CTA), ...cta };
  return (
    <>
      <div
        className={`aq-recommendation${inQuiz ? " aq-recommendation--in-quiz" : ""}`}
        aria-live="polite"
      >
        <div className="aq-recommendation-copy">
          <span className="aq-recommendation-badge">{content.badge}</span>
          <h3>{content.title}</h3>
          <p>{content.description}</p>
          <a className="footer-cta" href={content.href}>
            <span className="footer-cta-inner">
              <span className="footer-cta-text">{content.label}</span>
            </span>
          </a>
        </div>
        <div className="aq-recommendation-visuals" aria-hidden="true">
          {HOME_TICKER_COLUMNS.map((column, columnIndex) => (
            <div
              className={`aq-recommendation-ticker aq-recommendation-ticker--${columnIndex + 1}`}
              key={columnIndex}
            >
              <div className="aq-recommendation-ticker-track">
                {[...column, ...column].map((src, index) => (
                  <div
                    className="aq-recommendation-ticker-card"
                    key={`${columnIndex}-${src}-${index}`}
                  >
                    <img src={src} alt="Illustration de la question" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <span
          className="aq-recommendation-decor"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: DECOR_SVG }}
        />
      </div>
    </>
  );
}

export default function ArticleQuiz({ quiz, locale = "fr" }) {
  const english = locale === "en";
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [resultScores, setResultScores] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const question = quiz.questions[questionIndex];
  const isComplete = questionIndex >= quiz.questions.length;
  const activeResult = useMemo(() => {
    const configuredResults = Object.entries(quiz.results || {});
    if (!configuredResults.length) return quiz.result;
    const [resultId, result] = configuredResults.reduce(
      (best, candidate) =>
        (resultScores[candidate[0]] || 0) > (resultScores[best[0]] || 0)
          ? candidate
          : best,
      configuredResults[0],
    );
    return { id: resultId, ...result };
  }, [quiz.result, quiz.results, resultScores]);
  const progress = Math.round(
    (Math.min(questionIndex + 1, quiz.questions.length) /
      quiz.questions.length) *
      100,
  );
  useEffect(() => () => window.clearTimeout(timerRef.current), []);
  const resetQuiz = () => {
    window.clearTimeout(timerRef.current);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setResultScores({});
    setIsTransitioning(false);
  };
  const selectAnswer = (answerIndex) => {
    if (isTransitioning || isComplete) return;
    const answer = question.answers[answerIndex];
    if (typeof answer === "object" && answer.resultId)
      setResultScores((scores) => ({
        ...scores,
        [answer.resultId]: (scores[answer.resultId] || 0) + 1,
      }));
    setSelectedAnswer(answerIndex);
    setIsTransitioning(true);
    timerRef.current = window.setTimeout(() => {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setIsTransitioning(false);
    }, 900);
  };
  const completionCta = activeResult?.cta || quiz.cta;
  const showAuditCta = completionCta?.variant === "audit";
  return (
    <section
      className={`aq-root ${isComplete ? "is-complete" : ""}${showAuditCta ? " aq-root--audit-cta" : ""}`}
      aria-label={quiz.title}
    >
      {!isComplete ? (
        <>
          <header className="aq-intro">
            <p>{quiz.eyebrow}</p>
            <h2>{quiz.title}</h2>
            <span>{quiz.description}</span>
          </header>
          <div
            className="aq-progress"
            aria-label={`Question ${questionIndex + 1} ${english ? "of" : "sur"} ${quiz.questions.length}`}
          >
            <div>
              <span>
                Question {questionIndex + 1} {english ? "of" : "sur"}{" "}
                {quiz.questions.length}
              </span>
              <span>{progress}%</span>
            </div>
            <i>
              <b style={{ width: `${progress}%` }} />
            </i>
          </div>
          <div
            className={`aq-question ${isTransitioning ? "is-selecting" : ""}`}
            aria-live="polite"
          >
            <h3>{question.question}</h3>
            <div className="aq-answers">
              {question.answers.map((answer, answerIndex) => {
                const isSelected = answerIndex === selectedAnswer;
                const label =
                  typeof answer === "string" ? answer : answer.label;
                return (
                  <button
                    key={`${label}-${answerIndex}`}
                    type="button"
                    className={isSelected ? "is-selected" : ""}
                    onClick={() => selectAnswer(answerIndex)}
                    disabled={isTransitioning}
                  >
                    <span>{isSelected ? <CheckIcon /> : null}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <header className="aq-intro aq-intro-complete">
            <p>
              {activeResult?.eyebrow ||
                (english ? "Your recommendation" : "Votre recommandation")}
            </p>
            <h2>
              {activeResult?.title ||
                (english
                  ? "An opportunity worth taking"
                  : "Une opportunité à saisir")}
            </h2>
            <span>{activeResult?.description}</span>
          </header>
          {showAuditCta ? (
            <CtaAuditRealisationsSlug
              locale={locale}
              compact
              eyebrow={completionCta.badge}
              title={completionCta.title}
              availability={completionCta.availability}
            />
          ) : (
            <QuizRecommendation cta={completionCta} english={english} inQuiz />
          )}
          <button type="button" className="aq-replay" onClick={resetQuiz}>
            <ArrowPathIcon />
            {english ? "Retake the quiz" : "Rejouer le quiz"}
          </button>
        </>
      )}
    </section>
  );
}
