"use client";

import React, { useEffect, useRef, useState } from "react";
import "./StackSection3.css";

const FAQS = [
  {
    question: "Comment savoir si je dois choisir une landing page ou un site multi-pages ?",
    answer: "Une landing page est pensée pour un seul objectif : générer une action précise (leads, inscriptions, ventes, etc.). Elle est idéale pour des campagnes payantes, des lancements, des webinaires ou encore des pages de vente. Un site multi-pages convient davantage aux SaaS, services, agences et marques, car il donne une image plus professionnelle et permet de présenter votre activité de façon plus complète.",
  },
  {
    question: "Est-ce que je reçois un audit de mon site lorsque je réserve un appel ?",
    answer: "Oui. Lors de l'appel, nous pourrons vous présenter l'audit de votre site. Il vous suffit de renseigner l’URL de votre site. Cela nous permet de commencer l’appel en vous expliquant concrètement ce qui peut être optimisé.",
  },
  {
    question: "Que se passe t-il si je ne suis pas satisfait",
    answer: "Votre satisfaction est garantie à 100 %. Nous perfectionnons votre site jusqu’à ce qu’il corresponde exactement à vos attentes. Et si malgré tout vous n’êtes pas satisfait, nous procédons à un remboursement intégral.",
  },
  {
    question: "Sur quel logiciel réalisez vous vos landings pages ?",
    answer: "Nous utilisons Figma pour la phase de design, puis Framer pour le développement.",
  },
  {
    question: "Est-ce que je peux suivre l'avancement de mon project en direct ?",
    answer: "Oui. Vous pourrez suivre la progression de votre projet directement via WhatsApp. Nous vous partageons chaque jour l’avancement, et vous pourrez demander facilement des modifications à tout moment.",
  },
  {
    question: "Est-ce que le développement est intégré ?",
    answer: "Oui. Le développement est intégré directement sur Framer, ce qui vous permet de lancer votre site rapidement sans passer par une étape technique supplémentaire.",
  },
  {
    question: "Quellles sont vos conditions de paiements ?",
    answer: "Le règlement se fait en deux étapes : 50 % au lancement du projet et 50 % à la livraison, avant l’envoi du lien final. Cette organisation garantit une collaboration fluide et équilibrée.",
  },
];

const PROFILE_IMAGE = "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693";
const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=33636465091&text=Bonjour%2C+je+vous+contacte+par+rapport+%C3%A0+vos+landing+pages.&type=phone_number&app_absent=0";

function useInViewOnce(threshold = 0.5) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function ChevronDown({ open }) {
  return (
    <svg
      className={`s3-faq-chevron${open ? " is-open" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M 12 6 L 6 0 L 0 6" transform="translate(6 9)" />
    </svg>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const [ref, visible] = useInViewOnce(0.5);

  return (
    <li
      ref={ref}
      className={`s3-faq-item s3-reveal-up${visible ? " is-visible" : ""}${open ? " is-open" : ""}`}
      onClick={() => setOpen((value) => !value)}
    >
      <div className="s3-faq-header">
        <p className="s3-faq-question">{question}</p>
        <div className="s3-faq-chevron-wrap">
          <ChevronDown open={open} />
        </div>
      </div>

      <div className="s3-answer-clip" aria-hidden={!open}>
        <div className="s3-answer-inner">
          <p className="s3-faq-answer">{answer}</p>
        </div>
      </div>

      <div className="s3-faq-line" />
    </li>
  );
}

function PrimaryCTA({ href, onClick }) {
  const [ref, visible] = useInViewOnce(0.5);
  const safeHref = href || "#";

  return (
    <div ref={ref} className={`s3-cta-reveal${visible ? " is-visible" : ""}`}>
      <a
        className="s3-cta"
        href={safeHref}
        onClick={(event) => {
          if (safeHref === "#") event.preventDefault();
          onClick?.(event);
        }}
      >
        <span className="s3-cta-inner">
          <span className="s3-cta-label">Réserver un appel</span>
          <img
            className="s3-cta-avatar"
            src={PROFILE_IMAGE}
            alt="Photo de profil de Louis Staub"
            width="28"
            height="28"
            loading="lazy"
          />
        </span>
      </a>
    </div>
  );
}

export function StackSection3({
  className = "",
  style,
  padding = "196px 48px 300px 48px",
  ctaHref = "#",
  onCtaClick,
}) {
  const [titleRef, titleVisible] = useInViewOnce(0.5);
  const [copyRef, copyVisible] = useInViewOnce(0.5);

  return (
    <section
      className={`stack-section-3 ${className}`.trim()}
      style={{ "--s3-padding": padding, ...style }}
    >
      <div className="s3-content">
        <div className="s3-layout">
          <div className="s3-copy">
            <div
              ref={titleRef}
              className={`s3-title-wrap s3-reveal-title${titleVisible ? " is-visible" : ""}`}
            >
              <h2 className="s3-title">Des questions ? On y répond</h2>
            </div>

            <div
              ref={copyRef}
              className={`s3-description-wrap s3-reveal-copy${copyVisible ? " is-visible" : ""}`}
            >
              <p className="s3-description">
                Vous avez encore des questions&nbsp;? Réservez un appel ou
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  {" "}envoyez-nous un message ici
                </a>
              </p>
            </div>

            <PrimaryCTA href={ctaHref} onClick={onCtaClick} />
          </div>

          <ul className="s3-faq-list">
            {FAQS.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default StackSection3;
