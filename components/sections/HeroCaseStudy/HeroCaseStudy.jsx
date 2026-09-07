"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import usePauseVideoWhenHidden from "../../hooks/usePauseVideoWhenHidden";
import "./HeroCaseStudy.css";
import { localizeHref } from "@/lib/i18n";

const CTA_AVATAR = {
  src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693",
  srcSet:
    "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?scale-down-to=512&lossless=1&width=693&height=693 512w, https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693 693w",
};

const spring = { type: "spring", bounce: 0.2, duration: 0.4 };
const titleTransition = {
  delay: 0.15,
  duration: 0.5,
  ease: [0.44, 0, 0.56, 1],
};
const ctaTransition = { delay: 1, duration: 0.4, ease: [0.44, 0, 0.56, 1] };
const imageTransition = {
  type: "spring",
  bounce: 0.2,
  delay: 1.6,
  duration: 0.6,
};
const EMPTY_SLIDES = [];

function normalizeImage(value) {
  if (!value) return null;
  if (typeof value === "string") return { src: value };
  if (typeof value === "object" && typeof value.src === "string") return value;
  return null;
}

function PlaybackIcon({ paused }) {
  return paused ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5 18 12 8 18.5Z" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.5 6v12M16.5 6v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRight({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role="presentation"
      aria-hidden="true"
    >
      <path
        d="M 0 12 L 6 6 L 0 0"
        fill="transparent"
        stroke="rgb(0,0,0)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(9 6)"
      />
    </svg>
  );
}

function BreadcrumbLink({ href, children }) {
  return (
    <a className="hero-breadcrumb-link" href={href}>
      {children}
    </a>
  );
}

function CTA({ variant = "primary", href = "#", children, fullWidth = false }) {
  const primary = variant === "primary";
  return (
    <motion.a
      className={`hero-cta hero-cta-${variant}${fullWidth ? " hero-cta-full" : ""}`}
      href={href}
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      <motion.span
        className="hero-cta-inner"
        variants={
          primary
            ? {
                rest: {
                  background:
                    "linear-gradient(90deg, rgb(78, 125, 250) 0%, rgb(1, 71, 255) 100%)",
                },
                hover: {
                  background:
                    "linear-gradient(161deg, rgb(67, 108, 222) 0%, rgb(36, 77, 181) 100%)",
                },
              }
            : undefined
        }
        transition={spring}
      >
        <span className="hero-cta-label">{children}</span>
        {primary && (
          <motion.span
            className="hero-cta-avatar-wrap"
            variants={{ rest: { rotate: 0 }, hover: { rotate: 10 } }}
            transition={spring}
          >
            <img
              className="hero-cta-avatar"
              src={CTA_AVATAR.src}
              srcSet={CTA_AVATAR.srcSet}
              sizes="28px"
              alt="Photo de profil de Louis Staub"
            />
          </motion.span>
        )}
      </motion.span>
    </motion.a>
  );
}

function useIsPhone() {
  const [isPhone, setIsPhone] = React.useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 809px)").matches,
  );
  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 809px)");
    const update = () => setIsPhone(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return isPhone;
}

function AnimatedTitle({ text }) {
  const words = String(text || "").split(/(\s+)/);
  return (
    <h1 className="hero-title hero-title-animated" aria-label={text}>
      {words.map((word, index) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <motion.span
            className="hero-title-word"
            key={`${word}-${index}`}
            initial={{ filter: "blur(15px)", opacity: 0.001, y: 10 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={titleTransition}
          >
            {word}
          </motion.span>
        ),
      )}
    </h1>
  );
}

export default function HeroCaseStudy({
  slug = "",
  title = "Refonte du design d’un SaaS pour maximiser la crédibilité et la conversion",
  photoDuSite,
  videoSrc = "",
  imageSlides = EMPTY_SLIDES,
  realisationsHref = "#",
  offersHref = "#",
  callHref = "#",
  className = "",
  locale = "fr",
}) {
  const english = locale === "en";
  realisationsHref = localizeHref(realisationsHref, locale);
  offersHref = localizeHref(offersHref, locale);
  callHref = localizeHref(callHref, locale);
  const siteImage = normalizeImage(photoDuSite);
  const slides = React.useMemo(() => {
    const seen = new Set();
    return [siteImage, ...imageSlides.map(normalizeImage)].filter((image) => {
      if (!image?.src || seen.has(image.src)) return false;
      seen.add(image.src);
      return true;
    });
  }, [photoDuSite, imageSlides]);
  const [slideIndex, setSlideIndex] = React.useState(0);
  const [isVideoPaused, setIsVideoPaused] = React.useState(false);
  const videoRef = React.useRef(null);
  const cancelVisibilityResume = usePauseVideoWhenHidden(videoRef, videoSrc);
  const isPhone = useIsPhone();

  React.useEffect(() => {
    setSlideIndex(0);
    setIsVideoPaused(false);
    if (videoSrc || slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [videoSrc, slides]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    cancelVisibilityResume();
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const handleVideoKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleVideo();
  };

  const activeImage = slides[slideIndex] || siteImage;

  return (
    <section className={`hero-case-study ${className}`.trim()}>
      <div className="hero-case-study-inner">
        <div className="hero-copy-row">
          <div className="hero-copy-column">
            <div className="hero-copy-stack">
              <nav
                className="hero-breadcrumb"
                aria-label={english ? "Breadcrumb" : "Fil d’Ariane"}
              >
                <BreadcrumbLink href={realisationsHref}>
                  {english ? "Our work" : "Réalisations"}
                </BreadcrumbLink>
                <ChevronRight className="hero-breadcrumb-chevron" />
                <BreadcrumbLink href="#">{slug}</BreadcrumbLink>
              </nav>

              <div className="hero-heading-wrap">
                <AnimatedTitle text={title} />
                <h2 className="hero-title hero-title-mobile">{title}</h2>
              </div>

              <motion.div
                className="hero-cta-row"
                initial={isPhone ? false : { opacity: 0.001, y: 45 }}
                animate={isPhone ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={isPhone ? undefined : ctaTransition}
              >
                <div className="hero-offers-cta">
                  <CTA variant="secondary" href={offersHref}>
                    {english ? "View our offers" : "Voir nos offres"}
                  </CTA>
                </div>
                <div className="hero-call-cta">
                  <CTA variant="primary" href={callHref} fullWidth>
                    {english ? "Book a call" : "Réserver un appel"}
                  </CTA>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="hero-project-wrap">
          <motion.div
            className="hero-project-motion"
            initial={{ opacity: 0.001, y: 58 }}
            animate={{ opacity: 1, y: 0 }}
            transition={imageTransition}
          >
            <AnimatePresence initial={false}>
              {videoSrc ? (
                <motion.video
                  key={videoSrc}
                  ref={videoRef}
                  className="hero-project-image hero-project-video"
                  src={videoSrc}
                  poster={siteImage?.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  role="button"
                  tabIndex={0}
                  aria-label={
                    isVideoPaused
                      ? "Reprendre la vidéo"
                      : "Mettre la vidéo en pause"
                  }
                  aria-pressed={isVideoPaused}
                  onClick={toggleVideo}
                  onKeyDown={handleVideoKeyDown}
                  onCanPlay={(event) => {
                    void event.currentTarget.play().catch(() => {});
                  }}
                  onPlay={() => setIsVideoPaused(false)}
                  onPause={() => setIsVideoPaused(true)}
                  initial={{ opacity: 0.001 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.44, 0, 0.56, 1] }}
                />
              ) : activeImage ? (
                <motion.img
                  key={`image-${activeImage.src}`}
                  className="hero-project-image"
                  src={activeImage.src}
                  srcSet={activeImage.srcSet || activeImage.srcset}
                  sizes="(max-width: 809px) 344px, (max-width: 1399px) 718px, 1324px"
                  alt={activeImage.alt || "Image du projet présenté"}
                  initial={{ opacity: 0.001 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.001 }}
                  transition={{ duration: 0.45, ease: [0.44, 0, 0.56, 1] }}
                />
              ) : (
                <motion.div
                  key="missing-image"
                  className="hero-project-image hero-missing-image"
                  aria-label="Image requise"
                />
              )}
            </AnimatePresence>
            {videoSrc ? (
              <span
                className={`hero-video-play-state${isVideoPaused ? " is-paused" : ""}`}
                aria-hidden="true"
              >
                <PlaybackIcon paused={isVideoPaused} />
              </span>
            ) : null}
          </motion.div>
        </div>
      </div>

      <svg
        className="hero-deco hero-deco-right"
        width="923"
        height="822"
        viewBox="-37 -37 923 822"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M700 382.5L526.344 407.605C375.39 429.429 269.358 262.853 353.028 135.328L370.981 107.966C389.114 80.3294 418.24 61.808 450.958 57.1079C565.559 40.6452 630.17 184.499 541.739 259.226L299.628 463.821L0 747.5"
          stroke="#0147FF"
          strokeOpacity="0.04"
          strokeWidth="74"
        />
      </svg>
      <svg
        className="hero-deco hero-deco-left"
        width="661"
        height="870"
        viewBox="-37 -37 661 870"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M587 697.026L113.779 142.135C80.7861 103.448 92.9246 44.058 138.451 21.4196C164.867 8.28399 196.428 11.1396 220.057 28.8031L261.423 59.7251C319.221 102.931 341.496 179.144 316.062 246.676L222.816 494.265C216.639 510.664 208.062 526.055 197.365 539.934L0 796"
          stroke="#0147FF"
          strokeOpacity="0.04"
          strokeWidth="74"
        />
      </svg>
    </section>
  );
}
