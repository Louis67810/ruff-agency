"use client";

import React, {
  CSSProperties,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./HeroOptimized.module.css";

const LOTTIE_PLAYER_SRC =
  "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.js";
const AVAILABILITY_LOTTIE =
  "https://framerusercontent.com/assets/7Us0KKzHO2n8Jsf36VlImXFCQQ.json";
const PROFILE_IMAGE =
  "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693";

const TITLE = "On crée des landing pages et des sites World-class";
const SUBTITLE =
  "Transformez vos visiteurs en clients et renforcez votre crédibilité grâce à une landing page ou un site premium, optimisée pour la conversion.";

const desktopColumnA = [
  "https://framerusercontent.com/images/4vAacJVgYA7Lm66yEtkrBvos4aU.png?lossless=1&width=1065&height=618",
  "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884",
  "https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?width=2355&height=1126",
  "https://framerusercontent.com/images/GPppfvk1rXAk9lRawY9rD2BbNvk.png?width=1181&height=899",
  "https://framerusercontent.com/images/Nnax5elQvwnh9XmfuNMwymDCs.png?width=847&height=761",
] as const;

const desktopColumnB = [
  "https://framerusercontent.com/images/jQFI2KOlB2QYgaKnj70tuTfuZGI.png?width=2274&height=1158",
  "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?width=2206&height=1223",
  "https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?lossless=1&width=1453&height=844",
  "https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?width=1346&height=716",
  "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854",
  "https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?width=1600&height=1015",
  "https://framerusercontent.com/images/3y1Az3QkXv41MdvFclgAnW2GLqY.png?lossless=1&width=975&height=621",
  "https://framerusercontent.com/images/7f3zNNxlgLkanlFoVjpocYa31Jg.png?lossless=1&width=1330&height=815",
] as const;

const desktopColumnC = [
  "https://framerusercontent.com/images/wsgs0QoESRfBUCKKFn2FiBNraQc.jpg?lossless=1&width=4548&height=3045",
  "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069",
  "https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?width=2335&height=1137",
  "https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?width=1650&height=922",
  "https://framerusercontent.com/images/w6ciCcNESabQAAUEF0ypoFjelbY.png?width=1441&height=939",
  "https://framerusercontent.com/images/GPqbsgxvV0vyfHsINBltgt5Pcg.jpg?lossless=1&width=6064&height=4064",
  "https://framerusercontent.com/images/KbVpwrZT3Qt6klybg8GsX0GvCo.png?width=1263&height=859",
] as const;

const mobileCards = [
  { src: "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069", alt: "Hero section du site de Spreak", width: 296 },
  { src: "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?width=2206&height=1223", alt: "Hero section du site : Clovarex", width: 297 },
  { src: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854", alt: "Section processus du site de Spreak", width: 296 },
  { src: "https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?width=2288&height=1189", alt: "Hero section du site de Keyframe agency", width: 296 },
  { src: "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884", alt: "Hero section du site de Keyframe agency", width: 296 },
  { src: "https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?width=1650&height=922", alt: "Hero section du site de keyframe agency", width: 297 },
  { src: "https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?width=2355&height=1126", alt: "Hero section du site de Getly", width: 296 },
  { src: "https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?width=1346&height=716", alt: "Hero section du site de Rentala", width: 296 },
  { src: "https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?width=1252&height=862", alt: "Section problèmes du site de Spreak", width: 297 },
  { src: "https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?width=1600&height=1015", alt: "Design d'un concept de hero section", width: 296 },
  { src: "https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?width=2335&height=1137", alt: "Hero section du site en dark mode pour un graphiste indépendant", width: 296 },
  { src: "https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?width=6064&height=4060", alt: "Hero section du site de Initly", width: 296 },
] as const;

const reviews = [
  { text: "Un vrai professionnel, malgré son jeune âge. Louis m’a livré un site soigné, fluide et parfaitement conforme à mes attentes. Il écoute, il ajuste, il vise juste. Une très belle rigueur, et surtout une vraie volonté de bien faire.", name: "Julie Zagula", role: "CEO of Keyframe agency" },
  { text: "Je suis ravi d'avoir commandé ma landing page. Le service était très rapide et fiable. Ils ont une réponse à toutes mes problématiques, je les recommande.", name: "Noe eltm", role: "CEO de Myminia" },
  { text: "10/10 Ruff agency m'a délivré mon site très rapidement et ont été très réactifs. Les assets et les animations sont magnifiques.", name: "Antoine", role: "CEO de Keyframe agency" },
  { text: "En plus de la rapidité, leur service client est top ! Ils ont toujours été à l'écoute, et le design de notre site est tout simplement unique. Bravo à toute l'équipe !", name: "William ", role: "CEO de Star Agency" },
  { text: "J’ai fait appel à Ruff Agency pour le redesign de Rentala et je suis ravi du résultat. Le design est moderne et clair. Mention spéciale pour le copywriting : les textes sont percutants et mettent parfaitement en valeur notre proposition.", name: "Martin Riedweg", role: "Fondateur de Rentala" },
  { text: "Nous avons commandé un site multi-page et l’expérience a été excellente du début à la fin. Le site a été livré rapidement, avec un design clair et professionnel. ", name: "Dominique ZENGLEIN", role: "Expert-comptable" },
  { text: "I opted for their premium package and the competitor analysis was a game changer. The insights they provided gave us a significant edge. Highly recommended!", name: "Jake D.", role: "Fondateur de SAG" },
  { text: "Le site est non seulement beau, mais il a aussi boosté notre taux de conversion. Chaque détail a été pensé pour maximiser notre efficacité. Merci Ruff Agency !", name: "Nicolas H.", role: "Fondateur de Gourdy" },
  // Framer contains a ninth transition state that visually returns to Julie before cycling to Noe.
  { text: "Un vrai professionnel, malgré son jeune âge. Louis m’a livré un site soigné, fluide et parfaitement conforme à mes attentes. Il écoute, il ajuste, il vise juste. Une très belle rigueur, et surtout une vraie volonté de bien faire.", name: "Julie Zagula", role: "CEO of Keyframe agency" },
] as const;

const reviewAvatars = [
  "https://framerusercontent.com/images/Rs1MOk1Qd1pxrn7JYpN6GTVmHA.png?width=323&height=323",
  "https://framerusercontent.com/images/04bJRj3zbLlXKoiLCfmSP5AE04.png?width=512&height=512",
  "https://framerusercontent.com/images/0SixqGEsBFgn4ozNN2CBtsxIIiQ.png?width=512&height=512",
  "https://framerusercontent.com/images/73Cu5sIzzyDcGSfi1gB4CDNwE.png?scale-down-to=512&width=640&height=641",
  "https://framerusercontent.com/images/QNfNpwWE97G49aSXHLZjsGtt4.png?width=240&height=240",
  "https://framerusercontent.com/images/J81LxrAxlo03ZYwFX1bZNxmkcSw.png?width=171&height=171",
  "https://framerusercontent.com/images/35xtTh0zL1BwewHUbCmFa9gBBpE.png?width=512&height=512",
  "https://framerusercontent.com/images/CbybdbTpqQvpCDpVkEtQYI2Fo.png?width=472&height=472",
] as const;

// Exact Framer layout positions for the 8 avatars across the 9 review variants.
const avatarLeft = [
  [0, 79, 112, 145, 180, 215, 259, 259],
  [0, 0, 79, 112, 147, 179, 216, 259],
  [259, 0, 0, 79, 114, 146, 183, 219],
  [219, 259, 0, 0, 79, 111, 148, 184],
  [187, 219, 259, 0, 0, 79, 116, 152],
  [150, 182, 219, 259, 0, 0, 79, 115],
  [114, 146, 183, 219, 259, 0, 0, 79],
  [79, 111, 148, 184, 259, 259, 0, 0],
  [0, 111, 148, 184, 219, 259, 259, 0],
] as const;

const avatarOpacity = [
  [1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 0],
] as const;

const avatarSaturation = [
  [1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
] as const;

const avatarZIndex = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
] as const;

export type HeroOptimizedProps = {
  className?: string;
  style?: CSSProperties;
  realisationsHref?: string;
  bookingHref?: string;
  reviewsHref?: string;
};

function Availability() {
  const [month, setMonth] = useState("");
  const [remaining, setRemaining] = useState(6);
  const [lottieReady, setLottieReady] = useState(false);

  useEffect(() => {
    const date = new Date();
    const totalDays = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();

    setMonth(date.toLocaleDateString("fr-FR", { month: "long" }));
    setRemaining(Math.ceil(6 - ((date.getDate() - 1) / totalDays) * 5));

    if (customElements.get("dotlottie-player")) {
      setLottieReady(true);
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${LOTTIE_PLAYER_SRC}"]`,
    );
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
    <div className={styles.availability}>
      <div className={styles.availabilityIcon} aria-hidden="true">
        {lottieReady ? (
          React.createElement("dotlottie-player", {
            src: AVAILABILITY_LOTTIE,
            autoplay: true,
            loop: true,
            speed: 1,
            background: "transparent",
          })
        ) : (
          <span className={styles.availabilityFallback} />
        )}
      </div>
      <div className={styles.availabilityText}>
        <span className={styles.availabilityNumber}>{remaining}</span>
        <span>places restantes pour {month}</span>
      </div>
    </div>
  );
}

function AnimatedTitle() {
  const words = TITLE.split(" ");
  return (
    <h1 className={styles.title}>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span
            className={styles.titleWord}
            style={{ "--word-index": index } as CSSProperties}
          >
            {word}
          </span>
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
      const spans = Array.from(
        node.querySelectorAll<HTMLElement>("[data-subtitle-word]"),
      );
      const lineTops: number[] = [];

      for (const span of spans) {
        const top = Math.round(span.offsetTop);
        let lineIndex = lineTops.findIndex((lineTop) => Math.abs(lineTop - top) <= 1);
        if (lineIndex === -1) {
          lineTops.push(top);
          lineIndex = lineTops.length - 1;
        }
        span.style.setProperty("--line-index", String(lineIndex));
      }
    };

    updateLines();
    const observer = new ResizeObserver(updateLines);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <p className={styles.subtitle} ref={ref}>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span className={styles.subtitleWord} data-subtitle-word>
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </p>
  );
}

function CTA({
  kind,
  href,
  children,
}: {
  kind: "secondary" | "primary";
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className={`${styles.cta} ${
        kind === "primary" ? styles.ctaPrimary : styles.ctaSecondary
      }`}
      href={href}
    >
      <span className={styles.ctaInner}>
        <span className={styles.ctaLabel}>{children}</span>
        {kind === "primary" && (
          <img
            className={styles.ctaAvatar}
            src={PROFILE_IMAGE}
            alt="Photo de profil de Louis Staub"
            width={28}
            height={28}
          />
        )}
      </span>
    </a>
  );
}

function ReviewPointer() {
  const rawId = useId().replace(/:/g, "");
  const filterId = `review-filter-${rawId}`;
  const gradientId = `review-gradient-${rawId}`;
  const clipId = `review-clip-${rawId}`;

  return (
    <>
      <div className={styles.reviewPointer} aria-hidden="true">
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
          <g clipPath={`url(#${clipId})`}>
            <g filter={`url(#${filterId})`}>
              <path
                d="M16.8077 12.7426L22.2539 7.41484C22.8946 6.78813 22.4509 5.7 21.5547 5.7H8.80142C7.95058 5.7 7.48844 6.69496 8.03731 7.34509L12.4175 12.5333C13.5421 13.8654 15.5614 13.9617 16.8077 12.7426Z"
                fill="white"
              />
              <path
                d="M8.80176 6.2H21.5547C21.9747 6.20002 22.1958 6.67793 21.958 6.9959L21.9043 7.05742L16.458 12.3855C15.4195 13.4012 13.7369 13.3206 12.7998 12.2107L8.41895 7.02226C8.145 6.69719 8.3765 6.2 8.80176 6.2Z"
                stroke={`url(#${gradientId})`}
                strokeOpacity="0.26"
              />
            </g>
          </g>
          <defs>
            <filter
              id={filterId}
              x="1.79956"
              y="4.7"
              width="26.7571"
              height="28.8981"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.360784 0 0 0 0 0.360784 0 0 0 0 0.360784 0 0 0 0.1 0"
              />
              <feBlend mode="normal" in2="BackgroundImageFix" result="shadow1" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.360784 0 0 0 0 0.360784 0 0 0 0 0.360784 0 0 0 0.09 0"
              />
              <feBlend mode="normal" in2="shadow1" result="shadow2" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="8" />
              <feGaussianBlur stdDeviation="2.5" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.360784 0 0 0 0 0.360784 0 0 0 0 0.360784 0 0 0 0.05 0"
              />
              <feBlend mode="normal" in2="shadow2" result="shadow3" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="14" />
              <feGaussianBlur stdDeviation="3" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.360784 0 0 0 0 0.360784 0 0 0 0 0.360784 0 0 0 0.01 0"
              />
              <feBlend mode="normal" in2="shadow3" result="shadow4" />
              <feBlend mode="normal" in="SourceGraphic" in2="shadow4" result="shape" />
            </filter>
            <linearGradient
              id={gradientId}
              x1="114"
              y1="-82.5"
              x2="114"
              y2="15.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopOpacity="0.61" />
              <stop offset="1" />
            </linearGradient>
            <clipPath id={clipId}>
              <rect width="30" height="22" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className={styles.reviewPointerCover} aria-hidden="true">
        <svg viewBox="0 0 14.5 2" width="15" height="2">
          <path d="M 0 0 L 1 2 L 13.5 2 L 14.5 0 Z" fill="white" />
        </svg>
      </div>
    </>
  );
}

function ReviewCard({ href }: { href: string }) {
  const [variant, setVariant] = useState(0);

  useEffect(() => {
    let timer: number | undefined;

    const advance = (next: number, delay: number) => {
      timer = window.setTimeout(() => {
        setVariant(next);
        advance(next === 8 ? 1 : next + 1, 5700);
      }, delay);
    };

    advance(1, 3700);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  const current = reviews[variant];

  return (
    <div className={styles.reviewRoot}>
      <div className={styles.reviewBubble}>
        <ReviewPointer />
        <p className={styles.reviewText}>{current.text}</p>
        <div className={styles.reviewMeta}>
          <p>{current.name}</p>
          <p>{current.role}</p>
        </div>
      </div>

      <div className={styles.reviewRail}>
        {reviewAvatars.map((src, index) => (
          <img
            key={src}
            className={styles.reviewAvatar}
            src={src}
            alt=""
            width={48}
            height={48}
            style={{
              left: avatarLeft[variant][index],
              opacity: avatarOpacity[variant][index],
              filter: `saturate(${avatarSaturation[variant][index]})`,
              WebkitFilter: `saturate(${avatarSaturation[variant][index]})`,
              zIndex: avatarZIndex[variant][index],
            }}
          />
        ))}

        <div className={styles.reviewProgress} aria-hidden="true">
          <span />
        </div>

        <a className={styles.reviewLink} href={href}>
          Tout voir
        </a>
      </div>
    </div>
  );
}

function SmallPortfolioCard({ src }: { src: string }) {
  return (
    <img
      className={styles.smallPortfolioCard}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}

function TickerGroup({ items }: { items: readonly string[] }) {
  return (
    <div className={styles.tickerGroup}>
      {items.map((src) => (
        <SmallPortfolioCard src={src} key={src} />
      ))}
    </div>
  );
}

function VerticalTicker({
  items,
  reverse = false,
  extraClass = "",
}: {
  items: readonly string[];
  reverse?: boolean;
  extraClass?: string;
}) {
  // One Framer ticker item is the whole card group. Cards inside the group use 16px;
  // the ticker itself adds a 10px gap between repeated groups.
  const groupHeight = items.length * 248 + (items.length - 1) * 16;
  const cycleDistance = groupHeight + 10;
  const duration = `${(cycleDistance / 50).toFixed(4)}s`;

  return (
    <div className={`${styles.verticalTicker} ${extraClass}`}>
      <div
        className={`${styles.verticalTrack} ${
          reverse ? styles.verticalTrackReverse : ""
        }`}
        style={
          {
            "--ticker-distance": `${cycleDistance}px`,
            "--ticker-duration": duration,
          } as CSSProperties
        }
      >
        <TickerGroup items={items} />
        <TickerGroup items={items} />
        <TickerGroup items={items} />
      </div>
    </div>
  );
}

function PortfolioWall() {
  const mobileDistance =
    mobileCards.reduce((sum, item) => sum + item.width, 0) +
    mobileCards.length * 16;
  const mobileDuration = `${(mobileDistance / 50).toFixed(4)}s`;

  return (
    <div className={styles.wallViewport}>
      <div className={styles.desktopWall}>
        <VerticalTicker items={desktopColumnA} />
        <VerticalTicker items={desktopColumnA} extraClass={styles.tabletOnlyColumn} />
        <VerticalTicker items={desktopColumnB} reverse />
        <VerticalTicker items={desktopColumnC} />
      </div>

      <div className={styles.wallWash} aria-hidden="true" />

      <div
        className={styles.mobileTicker}
        style={
          {
            "--mobile-distance": `${mobileDistance}px`,
            "--mobile-duration": mobileDuration,
          } as CSSProperties
        }
      >
        <div className={styles.mobileTrack}>
          {[...mobileCards, ...mobileCards, ...mobileCards].map((item, index) => (
            <img
              key={`${item.src}-${index}`}
              className={styles.mobileCard}
              src={item.src}
              alt={index < mobileCards.length ? item.alt : ""}
              width={item.width}
              style={{ width: item.width }}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroOptimized({
  className = "",
  style,
  realisationsHref = "#",
  bookingHref = "#",
  reviewsHref = "#",
}: HeroOptimizedProps) {
  return (
    <section className={`${styles.root} ${className}`} style={style}>
      <div className={styles.heroSection}>
        <div className={styles.leftSection}>
          <div className={styles.topContent}>
            <Availability />

            <div className={styles.textContent}>
              <AnimatedTitle />
              <AnimatedSubtitle />
            </div>

            <div className={styles.ctaRow}>
              <CTA kind="secondary" href={realisationsHref}>
                Voir nos réalisations
              </CTA>
              <CTA kind="primary" href={bookingHref}>
                Réserver un appel
              </CTA>
            </div>
          </div>

          <div className={styles.reviewWrap}>
            <ReviewCard href={reviewsHref} />
          </div>
        </div>

        <PortfolioWall />
      </div>
    </section>
  );
}
