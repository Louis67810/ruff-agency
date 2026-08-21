"use client";

import React, { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Hero2Optimized.css";

const LOTTIE_PLAYER_SRC = "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.js";
const AVAILABILITY_LOTTIE = "https://framerusercontent.com/assets/7Us0KKzHO2n8Jsf36VlImXFCQQ.json";
const PROFILE_IMAGE = "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693";

const TITLE = "On crée des World-class landing pages";
const SUBTITLE = "La page qui transforme l’attention en demandes qualifiées.";

const clients = [
  { name: "Dominique Zenglein", role: "Associé du Cabinet Zorgniotti", src: "https://framerusercontent.com/images/Tjuvrsc26Y9bsmy4RsvuoOxs9Q.png?width=157&height=157" },
  { name: "Sacha Tassart", role: "Fondateur de Spreak", src: "https://framerusercontent.com/images/nLqNRYI5crcY5jbusSqlos90rs.png?width=200&height=200" },
  { name: "Martin Riedweg", role: "Fondateur de Rentala", src: "https://framerusercontent.com/images/retw1gdTPy8WtAlUAkOQQM70dNw.png?width=640&height=640" },
  { name: "Noé eltm", role: "Fondateur de Myminia", src: "https://framerusercontent.com/images/WLy8MmakiTBDk8q7dyr11OTsaJk.webp?width=512&height=512" },
  { name: "Julie Zagula", role: "Fondatrice de Clovarex", src: "https://framerusercontent.com/images/AH1BhliY7qwLdbhFi1HqZoEyBs.webp?width=344&height=333" },
  { name: "Antoine Troovy", role: "CEO de Keyframe.agency", src: "https://framerusercontent.com/images/V58PO9cFrXoX2nvvXl1unLY5Zps.png?width=512&height=512" },
] as const;

const portfolio = [
  { src: "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069", alt: "Hero section du site de Spreak" },
  { src: "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?width=2206&height=1223", alt: "Hero section du site : Clovarex" },
  { src: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854", alt: "Section processus du site de Spreak" },
  { src: "https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?width=2288&height=1189", alt: "Hero section du site de Keyframe agency" },
  { src: "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884", alt: "Hero section du site de Keyframe agency" },
  { src: "https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?width=1650&height=922", alt: "Hero section du site de Keyframe agency" },
  { src: "https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?width=2355&height=1126", alt: "Hero section du site de Getly" },
  { src: "https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?width=1346&height=716", alt: "Hero section du site de Rentala" },
  { src: "https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?width=1252&height=862", alt: "Section problèmes du site de Spreak" },
  { src: "https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?width=1600&height=1015", alt: "Design d’un concept de hero section" },
  { src: "https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?width=2335&height=1137", alt: "Hero section dark mode pour un graphiste indépendant" },
  { src: "https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?width=6064&height=4060", alt: "Hero section du site de Initly" },
] as const;

export type Hero2OptimizedProps = {
  className?: string;
  style?: CSSProperties;
  realisationsHref?: string;
  bookingHref?: string;
};

function ClientsSatisfaits() {
  return (
    <div className="h2-clients">
      <div className="h2-client-avatars">
        {clients.map((client) => (
          <div className="h2-client-slot" key={client.name}>
            <div className="h2-client-avatar-wrap">
              <img className="h2-client-avatar" src={client.src} alt="Photo de profil" />
              <div className="h2-client-tooltip" role="tooltip">
                <strong>{client.name}</strong>
                <span>{client.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p>+30 clients satisfaits</p>
    </div>
  );
}

function Availability() {
  const [month, setMonth] = useState("");
  const [remaining, setRemaining] = useState(6);
  const [lottieReady, setLottieReady] = useState(false);

  useEffect(() => {
    const date = new Date();
    const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    setMonth(date.toLocaleDateString("fr-FR", { month: "long" }));
    setRemaining(Math.ceil(6 - ((date.getDate() - 1) / totalDays) * 5));

    if (customElements.get("dotlottie-player")) {
      setLottieReady(true);
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${LOTTIE_PLAYER_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = LOTTIE_PLAYER_SRC;
      script.type = "module";
      script.async = true;
      document.head.appendChild(script);
    }
    const ready = () => setLottieReady(true);
    script.addEventListener("load", ready, { once: true });
    return () => script?.removeEventListener("load", ready);
  }, []);

  return (
    <div className="h2-availability">
      <div className="h2-availability-icon" aria-hidden="true">
        {lottieReady
          ? React.createElement("dotlottie-player", {
              src: AVAILABILITY_LOTTIE,
              autoplay: true,
              loop: true,
              speed: 1,
              background: "transparent",
            })
          : <span className="h2-availability-fallback" />}
      </div>
      <div className="h2-availability-text">
        <span className="h2-availability-number">{remaining}</span>
        <span>places restantes pour {month}</span>
      </div>
    </div>
  );
}

function AnimatedTitle() {
  const words = TITLE.split(" ");
  return (
    <h1 className="h2-title">
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span className="h2-title-word" style={{ "--word-index": index } as CSSProperties}>{word}</span>
          {index < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </h1>
  );
}

function AnimatedSubtitle() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = SUBTITLE.split(" ");

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const updateLines = () => {
      const spans = Array.from(node.querySelectorAll<HTMLElement>("[data-subtitle-word]"));
      const tops: number[] = [];
      for (const span of spans) {
        const top = Math.round(span.offsetTop);
        let line = tops.findIndex((v) => Math.abs(v - top) <= 1);
        if (line === -1) {
          tops.push(top);
          line = tops.length - 1;
        }
        span.style.setProperty("--line-index", String(line));
      }
    };
    updateLines();
    const observer = new ResizeObserver(updateLines);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <p className="h2-subtitle" ref={ref}>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span className="h2-subtitle-word" data-subtitle-word>{word}</span>
          {index < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </p>
  );
}

function CTA({ kind, href, children }: { kind: "secondary" | "primary"; href: string; children: React.ReactNode }) {
  return (
    <a className={`h2-cta ${kind === "primary" ? "h2-cta-primary" : "h2-cta-secondary"}`} href={href}>
      <span className="h2-cta-inner">
        <span className="h2-cta-label">{children}</span>
        {kind === "primary" && (
          <img className="h2-cta-avatar" src={PROFILE_IMAGE} alt="Photo de profil de Louis Staub" width={28} height={28} />
        )}
      </span>
    </a>
  );
}

function PortfolioTicker() {
  return (
    <div className="h2-ticker-viewport" aria-label="Réalisations">
      <div className="h2-ticker-track">
        {[0, 1, 2].map((group) => (
          <div className="h2-ticker-group" key={group} aria-hidden={group > 0 || undefined}>
            {portfolio.map((item, index) => (
              <img
                className="h2-portfolio-card"
                src={item.src}
                alt={group === 0 ? item.alt : ""}
                key={`${group}-${item.src}`}
                loading={index < 3 && group === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BackgroundShapes() {
  return (
    <div className="h2-background-shapes" aria-hidden="true">
      <svg className="h2-shape h2-shape-right" viewBox="-37 -37 923 822" fill="none">
        <path d="M700 382.5L526.344 407.605C375.39 429.429 269.358 262.853 353.028 135.328L370.981 107.966C389.114 80.3294 418.24 61.808 450.958 57.1079C565.559 40.6452 630.17 184.499 541.739 259.226L299.628 463.821L0 747.5" stroke="#0147FF" strokeOpacity="0.04" strokeWidth="74" />
      </svg>
      <svg className="h2-shape h2-shape-left" viewBox="-37 -37 661 870" fill="none">
        <path d="M587 697.026L113.779 142.135C80.7861 103.448 92.9246 44.058 138.451 21.4196C164.867 8.28399 196.428 11.1396 220.057 28.8031L261.423 59.7251C319.221 102.931 341.496 179.144 316.062 246.676L222.816 494.265C216.639 510.664 208.062 526.055 197.365 539.934L0 796" stroke="#0147FF" strokeOpacity="0.04" strokeWidth="74" />
      </svg>
    </div>
  );
}

export default function Hero2Optimized({
  className = "",
  style,
  realisationsHref = "#",
  bookingHref = "#",
}: Hero2OptimizedProps) {
  return (
    <section className={`h2-root ${className}`} style={style}>
      <BackgroundShapes />
      <div className="h2-wrapper">
        <div className="h2-hero-section">
          <div className="h2-left-section">
            <div className="h2-top-content">
              <div className="h2-text-content">
                <ClientsSatisfaits />
                <AnimatedTitle />
                <AnimatedSubtitle />
              </div>
              <div className="h2-cta-row">
                <CTA kind="secondary" href={realisationsHref}>Voir nos réalisations</CTA>
                <CTA kind="primary" href={bookingHref}>Réserver un appel</CTA>
              </div>
              <Availability />
            </div>
          </div>
        </div>
        <PortfolioTicker />
      </div>
    </section>
  );
}
