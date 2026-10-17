"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { DotLottie } from "@lottiefiles/dotlottie-web";
import styles from "./exact-process-cards.module.css";

type Step = {
  label: string;
  title: string;
  description: string;
  color: string;
  animation: string;
  transform: { x: number; y: number; scale: number };
};

const steps: Step[] = [
  {
    label: "Étape 1",
    title: "Réserver un appel de 30 minutes",
    description:
      "Pendant ces 30 minutes nous allons analyser votre situation actuelle pour comprendre vos besoins.",
    color: "#EAEFFF",
    animation: "/assets/process-lottie/etape-1.json",
    transform: { x: -18, y: 137, scale: 1.8 },
  },
  {
    label: "Étape 2",
    title: "Remplir un formulaire et onboarding",
    description:
      "Après avoir payé, vous recevrez un formulaire et pourrez suivre l’avancée du projet en direct.",
    color: "#EEE8FF",
    animation: "/assets/process-lottie/etape-2.lottie",
    transform: { x: -13, y: 71, scale: 1.5 },
  },
  {
    label: "Étape 3",
    title: "Création de la landing page",
    description:
      "Une fois le formulaire complété, nous lançons la création de votre landing page, livrée sous 10 jours.",
    color: "#FFF8E6",
    animation: "/assets/process-lottie/etape-3.lottie",
    transform: { x: -2, y: 104, scale: 1.6 },
  },
];

const englishSteps: Step[] = steps.map((step, index) => ({
  ...step,
  label: `Step ${index + 1}`,
  title: [
    "Book a 30-minute call",
    "Complete the onboarding form",
    "We create your landing page",
  ][index],
  description: [
    "During these 30 minutes, we will review your current situation and understand your needs.",
    "Once you have paid, you will receive a form and track the project progress live.",
    "Once the form is complete, we create your landing page and deliver it within 10 days.",
  ][index],
}));

function ProcessAnimation({ step, deferWhenHidden = false }: { step: Step; deferWhenHidden?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let player: DotLottie | undefined;
    let cancelled = false;
    let loading = false;
    let inViewport = !deferWhenHidden;
    const syncPlayback = () => {
      if (!player?.isLoaded) return;
      if (inViewport && !document.hidden) player.play();
      else player.pause();
    };

    const loadPlayer = () => {
      if (loading || cancelled) return;
      loading = true;
      void import("@lottiefiles/dotlottie-web").then(
        ({ DotLottie: DotLottiePlayer }) => {
          if (cancelled) return;
          player = new DotLottiePlayer({
            canvas,
            src: step.animation,
            autoplay: false,
            loop: true,
            // Avoid resizing a detached canvas during Next.js navigation.
            renderConfig: { autoResize: false, devicePixelRatio: 2 },
          });
          player.addEventListener("load", syncPlayback);
          syncPlayback();
        },
      ).catch(() => { loading = false; });
    };

    let preloadObserver: IntersectionObserver | undefined;
    let visibilityObserver: IntersectionObserver | undefined;
    if (deferWhenHidden && typeof IntersectionObserver !== "undefined") {
      const container = canvas.parentElement ?? canvas;
      preloadObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        loadPlayer();
        preloadObserver?.disconnect();
      }, { rootMargin: "600px 0px" });
      visibilityObserver = new IntersectionObserver(([entry]) => {
        inViewport = entry.isIntersecting;
        syncPlayback();
      });
      preloadObserver.observe(container);
      visibilityObserver.observe(container);
    } else {
      inViewport = true;
      loadPlayer();
    }
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      cancelled = true;
      preloadObserver?.disconnect();
      visibilityObserver?.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      player?.removeEventListener("load", syncPlayback);
      void player?.destroy();
    };
  }, [step, deferWhenHidden]);

  return (
    <div className={styles.visual} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{
          transform: `translate3d(${step.transform.x}px, ${step.transform.y}px, 0) scale(${step.transform.scale})`,
        }}
      />
    </div>
  );
}

/** The three-card Process section extracted from the current Framer page. */
export function ExactProcessCards() {
  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <h2 id="process-title">
            Un processus de création simple et efficace pour des projets uniques
          </h2>
          <a href="#contact">Je lance mon projet maintenant</a>
        </div>

        <ExactProcessCardGrid />
      </div>
    </section>
  );
}

function CardReveal({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`${styles.cardReveal} ${visible ? styles.isVisible : ""}`}
      style={{ "--card-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Cartes seules, pour remplacer une zone existante sans toucher au titre ou au CTA. */
export function ExactProcessCardGrid({
  locale = "fr",
  variant = "default",
}: {
  locale?: "fr" | "en";
  variant?: "default" | "saas";
}) {
  const localizedSteps = locale === "en" ? englishSteps : steps;
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1399px)");
    const syncLayout = () => {
      const nextVisibleCards =
        window.innerWidth <= 809 ? 1 : query.matches ? 2 : 3;
      setVisibleCards(nextVisibleCards);
      setActiveIndex((current) =>
        Math.min(current, localizedSteps.length - nextVisibleCards),
      );
    };
    syncLayout();
    query.addEventListener("change", syncLayout);
    window.addEventListener("resize", syncLayout);
    return () => {
      query.removeEventListener("change", syncLayout);
      window.removeEventListener("resize", syncLayout);
    };
  }, []);

  const maxIndex = Math.max(0, localizedSteps.length - visibleCards);
  const goTo = (index: number) =>
    setActiveIndex(Math.max(0, Math.min(index, maxIndex)));
  const isCarousel = visibleCards < localizedSteps.length;

  return (
    <div className={`${styles.carousel} ${variant === "saas" ? styles.saasVariant : ""}`} data-carousel={isCarousel || undefined}>
      <div
        ref={viewportRef}
        className={styles.viewport}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const distance =
            event.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(distance) < 40) return;
          goTo(activeIndex + (distance < 0 ? 1 : -1));
        }}
      >
        <div className={styles.grid} data-active-step={activeIndex}>
          {localizedSteps.map((step, index) => (
            <CardReveal key={step.label} delay={0.8 + index * 0.35}>
              <article className={styles.card}>
                <span
                  className={styles.label}
                  style={{ backgroundColor: step.color }}
                >
                  {step.label}
                </span>
                <div className={styles.copy}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <ProcessAnimation step={step} deferWhenHidden={variant === "saas"} />
              </article>
            </CardReveal>
          ))}
        </div>
      </div>
      <div
        className={styles.navigation}
        aria-label="Navigation entre les étapes"
      >
        <button
          className={styles.arrow}
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Étape précédente"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15.75 19.5-7.5-7.5 7.5-7.5" />
          </svg>
        </button>
        <button
          className={styles.arrow}
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === maxIndex}
          aria-label="Étape suivante"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
