"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowRightIcon,
  ChartBarSquareIcon,
  CodeBracketSquareIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  PresentationChartLineIcon,
  RocketLaunchIcon,
  SparklesIcon,
  SwatchIcon,
} from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Cta from "@/components/ui/Cta";
import { useLocale } from "@/components/LocaleProvider";
import { translateText } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import { ClientsSatisfaits } from "@/components/sections/Hero2Optimized/Hero2Optimized";
import "./ServicePageTop.css";

const PLAYER_DURATION = 5200;
// Délai du suivi horizontal de l'indicateur (modifiable pour tester d'autres ressentis).
const TIMELINE_DELAY_MS = 500;
const services = [
  {
    name: "Landing Page",
    src: "/images/services-menu/landing-page.png",
    kind: "image",
  },
  { name: "Website", src: "/images/services-menu/website.png", kind: "image" },
  {
    name: "Product design",
    src: "/images/services-menu/product-design.png",
    kind: "image",
  },
  {
    name: "Branding",
    src: "/images/services-menu/branding.png",
    kind: "image",
  },
  {
    name: "SEO / GEO",
    src: "/images/services-menu/seo-geo.png",
    kind: "image",
  },
  {
    name: "Optimisation conversion",
    src: "/images/services-menu/conversion-optimisation.png",
    kind: "image",
  },
  {
    name: "Copywriting",
    src: "/images/services-menu/copywriting.png",
    kind: "image",
  },
  {
    name: "Développement Framer",
    src: "/images/services-menu/website.png",
    kind: "image",
  },
  {
    name: "Développement React / Next.js",
    src: "/images/services-menu/development-react.png",
    kind: "image",
  },
] as const;
const defaultPlayerSlides = [
  {
    name: "Vidéo hero",
    src: "/videos/site-internet-landing.mp4",
    kind: "video",
  },
  {
    name: "Vidéo Landing Page",
    src: "/videos/landing-page-hero.mp4",
    kind: "video",
  },
  { name: "Vidéo v2", src: "/videos/landing-page-v2.mp4", kind: "video" },
  {
    name: "Vidéo Développement React",
    src: "/videos/development-react.mp4",
    kind: "video",
  },
  {
    name: "Spreak",
    src: "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069",
    kind: "image",
  },
  {
    name: "Clovarex",
    src: "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?width=2206&height=1223",
    kind: "image",
  },
  {
    name: "Processus Spreak",
    src: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854",
    kind: "image",
  },
  {
    name: "Keyframe agency",
    src: "https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?width=2288&height=1189",
    kind: "image",
  },
  {
    name: "Keyframe",
    src: "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884",
    kind: "image",
  },
  {
    name: "Keyframe motion",
    src: "https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?width=1650&height=922",
    kind: "image",
  },
  {
    name: "Getly",
    src: "https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?width=2355&height=1126",
    kind: "image",
  },
  {
    name: "Rentala",
    src: "https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?width=1346&height=716",
    kind: "image",
  },
  {
    name: "Spreak problèmes",
    src: "https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?width=1252&height=862",
    kind: "image",
  },
  {
    name: "Concept hero",
    src: "https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?width=1600&height=1015",
    kind: "image",
  },
  {
    name: "Dark mode",
    src: "https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?width=2335&height=1137",
    kind: "image",
  },
  {
    name: "Initly",
    src: "https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?width=6064&height=4060",
    kind: "image",
  },
] as const;
type ServiceSlide = { name: string; src: string; kind: "video" | "image" };
const benefits = [
  [
    SwatchIcon,
    "Image de marque forte",
    "Un site qui donne une impression sérieuse et premium, et qui installe votre crédibilité durablement.",
    "sp-icon-pink",
  ],
  [
    ChartBarSquareIcon,
    "Offre mieux organisée",
    "Vos services deviennent faciles à comprendre et à comparer, ce qui réduit les abandons et les questions inutiles.",
    "sp-icon-yellow",
  ],
  [
    SparklesIcon,
    "Visibilité Google",
    "Un contenu organisé et pertinent aide votre page à gagner des opportunités de visibilité sur vos requêtes clés.",
    "sp-icon-green",
  ],
  [
    CodeBracketSquareIcon,
    "Différenciation",
    "Un design qui reflète votre niveau et votre positionnement, sans effet « site générique ».",
    "sp-icon-violet",
  ],
  [
    RocketLaunchIcon,
    "Évolutif et durable",
    "Un site pensé pour grandir : ajouter des pages, clarifier une offre, lancer une campagne, sans repartir de zéro.",
    "sp-icon-blue",
  ],
  [
    PencilIcon,
    "Message clair",
    "Votre offre est présentée de façon simple et évidente : ce que vous faites, pour qui, et pourquoi vous choisir.",
    "sp-icon-orange",
  ],
] as const;
const process = [
  ["Cadrage", "1 jour", "#FFDDBE", "#693F1714", "#663B12"],
  ["Stratégie", "2 jours", "#CCEAFF", "#0C426614", "#0C4266"],
  ["Design", "4 jours", "#FFEBC0", "#AF662714", "#AF6627"],
  ["Développement", "5 jours", "#D1DEFF", "#293E7414", "#293E74"],
  ["Mise en ligne", "1 jour", "#DDFFDD", "#4E884E14", "#4E884E"],
] as const;

type ServicePageTopProps = {
  bookingHref: string;
  realisationsHref: string;
  heroVideoSrc?: string;
  heroImageSrc?: string;
  heroImageSlides?: readonly string[];
  heroGradient?: boolean;
  showVideoTuner?: boolean;
  initialVideoConfig?: Partial<{
    darkness: number;
    offsetX: number;
    offsetY: number;
    scale: number;
    playbackRate: number;
  }>;
  wideHeroTitle?: boolean;
  heroTitleLines?: readonly [string, string];
  showHeroTitleTuner?: boolean;
  balancedHeroTitle?: boolean;
  extraWideHeroTitle?: boolean;
  initialHeroTitleWidth?: number;
  heroTitle?: ReactNode;
  heroSubtitle?: string;
  playerSlidesOverride?: readonly ServiceSlide[];
  showPlayer?: boolean;
  benefitCopyOverride?: readonly (readonly [string, string])[];
  processCopyOverride?: readonly (readonly [string, string])[];
  showProcessDurations?: boolean;
  locale?: "fr" | "en";
};

export default function ServicePageTop({
  bookingHref,
  realisationsHref,
  heroVideoSrc = "/videos/site-internet-landing.mp4",
  heroImageSrc,
  heroImageSlides,
  heroGradient = false,
  showVideoTuner = true,
  initialVideoConfig,
  wideHeroTitle = false,
  heroTitleLines,
  showHeroTitleTuner = false,
  balancedHeroTitle = false,
  extraWideHeroTitle = false,
  initialHeroTitleWidth,
  heroTitle = "On crée des sites web World-class",
  heroSubtitle = "Nous créons des sites web conçus pour que vos clients ne partent plus sans convertir et pour élever votre image de marque.",
  playerSlidesOverride,
  showPlayer = true,
  benefitCopyOverride,
  processCopyOverride,
  showProcessDurations = true,
}: ServicePageTopProps) {
  const locale = (arguments[0] as ServicePageTopProps).locale ?? useLocale();
  bookingHref = localizeHref(bookingHref, locale) || "#";
  realisationsHref = localizeHref(realisationsHref, locale) || "#";
  const localizedTitle = translateText(heroTitle, locale);
  const localizedSubtitle = translateText(heroSubtitle, locale);
  heroTitle = localizedTitle;
  heroSubtitle = localizedSubtitle;
  const playerSlides = playerSlidesOverride ?? defaultPlayerSlides;
  const activeBenefitCopy = (
    benefitCopyOverride ??
    benefits.map(([, title, text]) => [title, text] as const)
  ).map(
    ([title, text]) =>
      [translateText(title, locale), translateText(text, locale)] as const,
  );
  const activeProcessCopy = (
    processCopyOverride ??
    process.map(([title, duration]) => [title, duration] as const)
  ).map(
    ([title, duration]) =>
      [translateText(title, locale), translateText(duration, locale)] as const,
  );
  const sectionDifferenceTitle = translateText(
    "Ce qui fait la différence",
    locale,
  );
  const sectionDifferenceText = translateText(
    "Une identité claire, cohérente et mémorable, pensée pour renforcer votre positionnement.",
    locale,
  );
  const sectionProcessTitle = translateText(
    "Un processus de branding clair et efficace",
    locale,
  );
  const sectionProcessText = translateText(
    "Une méthode structurée pour construire une marque distinctive et prête à grandir.",
    locale,
  );
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const startedAt = useRef<number | null>(null);
  const progressRef = useRef(0);
  const animationPausedAt = useRef<number | null>(null);
  const progressBars = useRef<Array<HTMLSpanElement | null>>([]);
  const processRef = useRef<HTMLDivElement | null>(null);
  const processFrame = useRef<number | null>(null);
  const pendingTimelineOffset = useRef(0);
  const [timelineOffset, setTimelineOffset] = useState(0);
  const [timelineConfig, setTimelineConfig] = useState({
    delay: TIMELINE_DELAY_MS,
    easing: "cubic-bezier(.2,.7,.2,1)",
  });
  const [videoConfig, setVideoConfig] = useState({
    darkness: 0.94,
    offsetX: 0,
    offsetY: 0,
    scale: 1.12,
    playbackRate: 0.5,
    ...initialVideoConfig,
  });
  const [editableTitleLines, setEditableTitleLines] = useState<
    [string, string]
  >([...((heroTitleLines ?? ["", ""]) as [string, string])]);
  const [heroTitleWidth, setHeroTitleWidth] = useState(
    initialHeroTitleWidth ??
      (balancedHeroTitle ? 760 : extraWideHeroTitle ? 1100 : 900),
  );
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const activeHeroImageSrc = heroImageSlides?.[heroImageIndex] ?? heroImageSrc;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const playerSectionRef = useRef<HTMLElement | null>(null);
  const [heroInView, setHeroInView] = useState(false);
  const [playerInView, setPlayerInView] = useState(false);

  useEffect(() => {
    if (!heroImageSlides || heroImageSlides.length < 2) return;
    const timer = window.setInterval(
      () => setHeroImageIndex((value) => (value + 1) % heroImageSlides.length),
      3000,
    );
    return () => window.clearInterval(timer);
  }, [heroImageSlides]);

  useEffect(() => {
    const observe = (
      node: HTMLElement | null,
      setter: (value: boolean) => void,
    ) => {
      if (!node) return () => undefined;
      const observer = new IntersectionObserver(
        ([entry]) => setter(entry.isIntersecting),
        { threshold: 0.12 },
      );
      observer.observe(node);
      return () => observer.disconnect();
    };
    const stopHero = observe(heroRef.current, setHeroInView);
    const stopPlayer = observe(playerSectionRef.current, setPlayerInView);
    return () => {
      stopHero();
      stopPlayer();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current)
      videoRef.current.playbackRate = videoConfig.playbackRate;
  }, [videoConfig.playbackRate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (heroInView) void video.play();
    else video.pause();
  }, [heroInView]);

  useEffect(() => {
    const player = playerVideoRef.current;
    if (!player || playerSlides[current].kind !== "video") return;
    player.playbackRate = 1;
    if (playing && playerInView) void player.play();
    else player.pause();
  }, [current, playing, playerInView]);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".sp-player .sp-media, .sp-player .sp-copy > *, .sp-player + .sp-section > header h2, .sp-player + .sp-section > header p, .sp-player + .sp-section .sp-grid article",
      ),
    );
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.16 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const grid = processRef.current;
    if (!grid || grid.querySelector(".sp-process-indicator")) return;
    const line = grid.querySelector(".sp-process-line");
    const marker = grid.querySelector(".sp-process-start");
    if (!line || !marker) return;
    const indicator = document.createElement("span");
    indicator.className = "sp-process-indicator";
    grid.insertBefore(indicator, line);
    indicator.append(line, marker);
  }, [timelineConfig]);

  useEffect(() => {
    processRef.current?.style.setProperty(
      "--timeline-delay",
      `${timelineConfig.delay}ms`,
    );
    processRef.current?.style.setProperty(
      "--timeline-easing",
      timelineConfig.easing,
    );
  }, [timelineConfig]);

  const paintProgress = (activeIndex: number, ratio: number) => {
    progressBars.current.forEach((bar, index) => {
      if (bar)
        bar.style.width = `${index < activeIndex ? 100 : index === activeIndex ? ratio * 100 : 0}%`;
    });
  };

  useEffect(() => {
    if (!playing || !playerInView || playerSlides[current].kind === "video") {
      if (startedAt.current !== null && animationPausedAt.current === null)
        animationPausedAt.current = performance.now();
      return;
    }
    if (startedAt.current !== null && animationPausedAt.current !== null) {
      startedAt.current += performance.now() - animationPausedAt.current;
      animationPausedAt.current = null;
    }
    let frame = 0;
    const tick = (time: number) => {
      if (startedAt.current === null)
        startedAt.current = time - progressRef.current * PLAYER_DURATION;
      const next = Math.min(1, (time - startedAt.current) / PLAYER_DURATION);
      if (next >= 1) {
        startedAt.current = time;
        progressRef.current = 0;
        setCurrent((value) => {
          const following = (value + 1) % playerSlides.length;
          paintProgress(following, 0);
          return following;
        });
      } else {
        progressRef.current = next;
        paintProgress(current, next);
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, current, playerInView]);

  const selectSlide = (index: number) => {
    const selected = (index + playerSlides.length) % playerSlides.length;
    startedAt.current = null;
    animationPausedAt.current = null;
    progressRef.current = 0;
    paintProgress(selected, 0);
    setCurrent(selected);
  };

  const handleProcessPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !processRef.current) return;
    const rect = processRef.current.getBoundingClientRect();
    const next = Math.max(
      0,
      Math.min(rect.width - 31, event.clientX - rect.left - 17),
    );
    pendingTimelineOffset.current = next;
    if (processFrame.current === null) {
      processFrame.current = window.requestAnimationFrame(() => {
        if (processRef.current)
          processRef.current.style.setProperty(
            "--timeline-offset",
            `${pendingTimelineOffset.current}px`,
          );
        processFrame.current = null;
      });
    }
  };

  const copyTimelineConfig = () => {
    void navigator.clipboard?.writeText(
      JSON.stringify(timelineConfig, null, 2),
    );
  };
  const copyVideoConfig = () => {
    void navigator.clipboard?.writeText(JSON.stringify(videoConfig, null, 2));
  };
  const copyHeroTitle = () => {
    void navigator.clipboard?.writeText(
      JSON.stringify(
        {
          titleWidth: heroTitleWidth,
          ...(heroTitleLines
            ? { line1: editableTitleLines[0], line2: editableTitleLines[1] }
            : {}),
        },
        null,
        2,
      ),
    );
  };

  return (
    <>
      <section
        className={`sp-hero ${activeHeroImageSrc ? "sp-hero-static" : ""} ${wideHeroTitle ? "sp-hero-title-wide" : ""} ${balancedHeroTitle ? "sp-hero-title-balanced" : ""} ${extraWideHeroTitle ? "sp-hero-title-extra-wide" : ""}`}
        style={{ "--hero-title-width": `${heroTitleWidth}px` } as CSSProperties}
        ref={heroRef}
      >
        {activeHeroImageSrc ? (
          <img
            className="sp-hero-video sp-hero-image"
            src={activeHeroImageSrc}
            alt="Illustration décorative du service"
            style={{
              transform: `translate(${videoConfig.offsetX}%, ${videoConfig.offsetY}%) scale(${videoConfig.scale})`,
            }}
          />
        ) : (
          <video
            ref={videoRef}
            className="sp-hero-video"
            src={heroVideoSrc}
            loop
            muted
            playsInline
            style={{
              transform: `translate(${videoConfig.offsetX}%, ${videoConfig.offsetY}%) scale(${videoConfig.scale})`,
            }}
          />
        )}
        <div
          className={`sp-hero-overlay ${activeHeroImageSrc && heroGradient ? "sp-hero-gradient-rectangle-540" : ""}`}
          style={{
            background:
              activeHeroImageSrc && heroGradient
                ? undefined
                : `rgba(0,0,0,${videoConfig.darkness})`,
          }}
        />
        <div className="sp-hero-content">
          <ClientsSatisfaits />
          <h1>
            {heroTitleLines
              ? editableTitleLines
                  .map((line) => translateText(line, locale))
                  .join(" ")
              : heroTitle}
          </h1>
          <p>{heroSubtitle}</p>
          <div className="sp-actions">
            <Cta
              kind="secondary"
              href={realisationsHref}
              label={translateText("Voir nos réalisations", locale)}
            >
              {translateText("Voir nos réalisations", locale)}
            </Cta>
            <Cta
              kind="primary"
              href={bookingHref}
              label={translateText("Réserver un appel", locale)}
            >
              {translateText("Réserver un appel", locale)}
            </Cta>
          </div>
        </div>
        <div className="sp-ticker">
          <div>
            {[0, 1, 2].map((group) => (
              <span className="sp-ticker-group" key={group}>
                {services.map(({ name, src }) => (
                  <span className="sp-ticker-card" key={`${group}-${name}`}>
                    <img src={src} alt="Aperçu visuel du service" />
                    {name}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>
      {showPlayer && (
        <section className="sp-player" ref={playerSectionRef}>
          <div className="sp-media">
            {playerSlides[current].kind === "video" ? (
              <video
                ref={playerVideoRef}
                className="sp-player-media-video"
                src={playerSlides[current].src}
                muted
                playsInline
                onTimeUpdate={(event) => {
                  const video = event.currentTarget;
                  if (video.duration)
                    paintProgress(current, video.currentTime / video.duration);
                }}
                onEnded={() => selectSlide(current + 1)}
              />
            ) : (
              <img
                src={playerSlides[current].src}
                alt={`Aperçu ${playerSlides[current].name}`}
              />
            )}
            <div className="sp-progress">
              {playerSlides.map(({ name }, index) => (
                <button
                  aria-label={name}
                  className={index === current ? "active" : ""}
                  onClick={() => selectSlide(index)}
                  key={name}
                >
                  <span
                    ref={(node) => {
                      progressBars.current[index] = node;
                    }}
                  />
                </button>
              ))}
            </div>
            <button
              className="sp-pause"
              aria-label={playing ? "Mettre en pause" : "Lire"}
              onClick={() => setPlaying((value) => !value)}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <span className="sp-arrows">
              <button
                aria-label="Vidéo précédente"
                onClick={() => selectSlide(current - 1)}
              >
                <ChevronLeftIcon />
              </button>
              <button
                aria-label="Vidéo suivante"
                onClick={() => selectSlide(current + 1)}
              >
                <ChevronRightIcon />
              </button>
            </span>
          </div>
          <div className="sp-copy">
            <h2>
              {translateText("Un site qui rend votre valeur évidente", locale)}
            </h2>
            <p>
              {translateText(
                "Une expérience claire et premium, pensée pour présenter votre activité, rassurer vos prospects et les faire passer à l’action.",
                locale,
              )}
            </p>
            <p>
              {translateText(
                "Chaque écran est construit pour être facile à comprendre, agréable à utiliser et cohérent avec votre image.",
                locale,
              )}
            </p>
          </div>
        </section>
      )}
      <section className="sp-section">
        <header>
          <h2>{sectionDifferenceTitle}</h2>
          <p>{sectionDifferenceText}</p>
        </header>
        <div className="sp-grid">
          {benefits.map(([Icon, fallbackTitle, fallbackText, color], index) => {
            const [title, text] = activeBenefitCopy[index] ?? [
              fallbackTitle,
              fallbackText,
            ];
            return (
              <article key={title}>
                <span className="sp-card-edge" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={color}>
                  <Icon />
                </span>
                <div className="sp-card-copy">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="sp-section sp-process">
        <header>
          <h2>{sectionProcessTitle}</h2>
          <p>{sectionProcessText}</p>
        </header>
        <div
          className="sp-process-scroll"
          role="region"
          aria-label={translateText("Étapes du processus", locale)}
          tabIndex={0}
        >
          <div
            className="sp-process-grid"
            ref={processRef}
            onPointerMove={handleProcessPointerMove}
          >
            <span className="sp-process-line" aria-hidden="true" />
            <img
              className="sp-process-start"
              src="/images/service-page/1824-2921.svg"
              alt="Illustration décorative du service"
              aria-hidden="true"
              style={{ transform: `translateY(${timelineOffset}px)` }}
            />
            {Array.from({ length: 6 }, (_, index) => (
              <span className="sp-process-rail" key={index} aria-hidden="true" />
            ))}
            {process.map(
              (
                [fallbackTitle, fallbackDuration, background, iconBg, color],
                index,
              ) => {
                const [title, duration] = activeProcessCopy[index] ?? [
                  fallbackTitle,
                  fallbackDuration,
                ];
                return (
                  <article
                    className={`sp-process-card sp-process-card-${index}`}
                    style={{
                      backgroundColor: background,
                      borderColor: `${color}2B`,
                      color,
                    }}
                    key={title}
                  >
                    <span
                      className="sp-process-icon"
                      style={{
                        backgroundColor: iconBg,
                        borderColor: `${color}1C`,
                      }}
                    >
                      <PresentationChartLineIcon />
                    </span>
                    <strong>{title}</strong>
                    {showProcessDurations && (
                      <small
                        className="sp-process-duration"
                        style={{ color: `${color}B3` }}
                      >
                        {duration}
                      </small>
                    )}
                  </article>
                );
              },
            )}
          </div>
        </div>
      </section>
    </>
  );
}
