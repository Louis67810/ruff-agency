"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import usePauseVideoWhenHidden from "../../hooks/usePauseVideoWhenHidden";
import "./HeroRealisations.css";
import { localizeHref } from "@/lib/i18n";

const LOTTIE_URL =
  "https://framerusercontent.com/assets/7Us0KKzHO2n8Jsf36VlImXFCQQ.json";
const VIDEO_URL =
  "https://framerusercontent.com/assets/DGCBKS0bAT9vQ3hBqQNayQ1oOxE.mp4";
const VIDEO_SEQUENCE = [
  "/videos/site-internet-landing.mp4",
  "/videos/landing-page-hero.mp4",
  "/videos/landing-page-v2.mp4",
  "/videos/development-react.mp4",
  VIDEO_URL,
];

const CTA_AVATAR = {
  src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693",
  srcSet:
    "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?scale-down-to=512&lossless=1&width=693&height=693 512w,https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693 693w",
};

const CLIENTS = [
  {
    name: "Dominique Zenglein",
    role: "Associé du Cabinet Zorgniotti",
    src: "https://framerusercontent.com/images/Tjuvrsc26Y9bsmy4RsvuoOxs9Q.png?width=157&height=157",
    alt: "Photo de profil",
  },
  {
    name: " Sacha Tassart",
    role: "Fondateur de Spreak",
    src: "https://framerusercontent.com/images/nLqNRYI5crcY5jbusSqlos90rs.png?width=200&height=200",
    alt: "Illustration décorative de la réalisation",
  },
  {
    name: "Martin Riedweg",
    role: "Fondateur de Rentala",
    src: "https://framerusercontent.com/images/retw1gdTPy8WtAlUAkOQQM70dNw.png?width=640&height=640",
    srcSet:
      "https://framerusercontent.com/images/retw1gdTPy8WtAlUAkOQQM70dNw.png?scale-down-to=512&width=640&height=640 512w,https://framerusercontent.com/images/retw1gdTPy8WtAlUAkOQQM70dNw.png?width=640&height=640 640w",
    alt: "Photo de profil",
  },
  {
    name: "Noé eltm",
    role: "Fondateur de Myminia",
    src: "https://framerusercontent.com/images/WLy8MmakiTBDk8q7dyr11OTsaJk.webp?width=512&height=512",
    alt: "Photo de profil",
  },
  {
    name: "Julie Zagula",
    role: "Fondatrice de Clovarex",
    src: "https://framerusercontent.com/images/AH1BhliY7qwLdbhFi1HqZoEyBs.webp?width=344&height=333",
    alt: "Photo de profil",
  },
  {
    name: "Antoine Troovy",
    role: "CEO de Keyframe.agency",
    src: "https://framerusercontent.com/images/V58PO9cFrXoX2nvvXl1unLY5Zps.png?width=512&height=512",
    alt: "Illustration décorative de la réalisation",
  },
];

const LEFT_REALISATION = {
  src: "https://framerusercontent.com/images/d9w5aUESVvP0NmZfOs03uqvBqE.png?width=1220&height=776",
  srcSet:
    "https://framerusercontent.com/images/d9w5aUESVvP0NmZfOs03uqvBqE.png?scale-down-to=512&width=1220&height=776 512w,https://framerusercontent.com/images/d9w5aUESVvP0NmZfOs03uqvBqE.png?scale-down-to=1024&width=1220&height=776 1024w,https://framerusercontent.com/images/d9w5aUESVvP0NmZfOs03uqvBqE.png?width=1220&height=776 1220w",
};
const RIGHT_REALISATION = {
  src: "https://framerusercontent.com/images/GgZk6Z0p8QpLSVhRMQ8LWgvgcU.png?width=1232&height=790",
  srcSet:
    "https://framerusercontent.com/images/GgZk6Z0p8QpLSVhRMQ8LWgvgcU.png?scale-down-to=512&width=1232&height=790 512w,https://framerusercontent.com/images/GgZk6Z0p8QpLSVhRMQ8LWgvgcU.png?scale-down-to=1024&width=1232&height=790 1024w,https://framerusercontent.com/images/GgZk6Z0p8QpLSVhRMQ8LWgvgcU.png?width=1232&height=790 1232w",
};

const variantAliases = {
  Desktop: "desktop",
  zxyWVOw1p: "desktop",
  desktop: "desktop",
  Tablet: "tablet",
  pAlaKLU0v: "tablet",
  tablet: "tablet",
  Phone: "phone",
  KDtq0un6E: "phone",
  phone: "phone",
  auto: "auto",
};

function useResolvedMode(variant) {
  const forced = variantAliases[variant] || "auto";
  const getMode = () => {
    if (forced !== "auto") return forced;
    if (typeof window === "undefined") return "desktop";
    if (window.innerWidth <= 809) return "phone";
    if (window.innerWidth <= 1399) return "tablet";
    return "desktop";
  };
  const [mode, setMode] = useState(getMode);
  useEffect(() => {
    if (forced !== "auto") {
      setMode(forced);
      return;
    }
    const update = () => setMode(getMode());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [forced]);
  return mode;
}

function Profile({ client, mobile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="realisations-client-slot"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        className="realisations-client-avatar"
        src={client.src}
        srcSet={client.srcSet}
        alt={client.alt}
        draggable="false"
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="realisations-client-tooltip"
            role="dialog"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          >
            <p className="realisations-client-name">{client.name}</p>
            <p className="realisations-client-role">{client.role}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ClientsSatisfied({ mobile }) {
  return (
    <div className={`realisations-clients${mobile ? " is-mobile" : ""}`}>
      <div className="realisations-clients-avatars">
        {CLIENTS.map((client, index) => (
          <Profile
            key={`${client.name}-${index}`}
            client={client}
            mobile={mobile}
          />
        ))}
      </div>
      <p className="realisations-clients-copy">+30 clients satisfaits</p>
    </div>
  );
}

const SUBTITLE_TEXT =
  "Découvrez des projets que nous avons menés avec soin, du concept à la mise en œuvre.";
const ENGLISH_SUBTITLE_TEXT =
  "Explore projects we have crafted with care, from concept to launch.";

function AnimatedSubtitle({ disabled, english = false }) {
  const subtitleText = english ? ENGLISH_SUBTITLE_TEXT : SUBTITLE_TEXT;
  const charsRef = useRef([]);
  const [lineIndexes, setLineIndexes] = useState([]);

  useLayoutEffect(() => {
    if (disabled) return;
    const nodes = charsRef.current.filter(Boolean);
    if (!nodes.length) return;
    const tops = [];
    const indexes = nodes.map((node) => {
      const top = Math.round(node.getBoundingClientRect().top * 10) / 10;
      let index = tops.findIndex((value) => Math.abs(value - top) < 1);
      if (index === -1) {
        tops.push(top);
        index = tops.length - 1;
      }
      return index;
    });
    setLineIndexes((current) =>
      current.length === indexes.length &&
      current.every((value, i) => value === indexes[i])
        ? current
        : indexes,
    );
  }, [disabled]);

  if (disabled) return <p className="realisations-subtitle">{subtitleText}</p>;

  let charIndex = 0;
  const words = subtitleText.split(" ");
  return (
    <p className="realisations-subtitle" aria-label={subtitleText}>
      {words.map((word, wordIndex) => (
        <React.Fragment key={`${word}-${wordIndex}`}>
          <span className="realisations-subtitle-word">
            {Array.from(word).map((char, indexInWord) => {
              const index = charIndex++;
              const line = lineIndexes[index] ?? 0;
              return (
                <motion.span
                  aria-hidden="true"
                  className="realisations-subtitle-char"
                  key={`${char}-${indexInWord}`}
                  ref={(node) => {
                    charsRef.current[index] = node;
                  }}
                  initial={{ filter: "blur(10px)", opacity: 0.001, y: 10 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    bounce: 0,
                    delay: 0.6 + line * 0.15,
                    duration: 0.5,
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </p>
  );
}

function OffersCTA({ href, english = false }) {
  return (
    <a
      className="realisations-cta realisations-cta-offers"
      href={href || undefined}
    >
      <span className="realisations-cta-offers-inner">
        <span className="realisations-cta-text dark">
          {english ? "View our offers" : "Voir nos offres"}
        </span>
      </span>
    </a>
  );
}

function CallCTA({ href, fullWidth, english = false }) {
  return (
    <motion.a
      className={`realisations-cta realisations-cta-call${fullWidth ? " is-full" : ""}`}
      href={href || undefined}
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      <span className="realisations-cta-call-inner">
        <span className="realisations-cta-text">
          {english ? "Book a call" : "Réserver un appel"}
        </span>
        <motion.span
          className="realisations-cta-avatar-frame"
          variants={{ rest: { rotate: 0 }, hover: { rotate: 10 } }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        >
          <img
            className="realisations-cta-avatar"
            src={CTA_AVATAR.src}
            srcSet={CTA_AVATAR.srcSet}
            sizes="28px"
            alt="Photo de profil de Louis Staub"
            draggable="false"
          />
        </motion.span>
      </span>
    </motion.a>
  );
}

function AvailabilityLottie() {
  const ref = useRef(null);
  useEffect(() => {
    let destroyed = false;
    let animation;
    import("lottie-web")
      .then((module) => {
        if (destroyed || !ref.current) return;
        const lottie = module.default || module;
        animation = lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: LOTTIE_URL,
          rendererSettings: { progressiveLoad: true, hideOnTransparent: true },
        });
      })
      .catch(() => {});
    return () => {
      destroyed = true;
      animation?.destroy?.();
    };
  }, []);
  return (
    <div className="realisations-availability-icon-box">
      <div ref={ref} className="realisations-availability-lottie" />
    </div>
  );
}

function getAvailability(english = false) {
  const date = new Date();
  const month = date.toLocaleDateString(english ? "en-US" : "fr-FR", {
    month: "long",
  });
  const totalDaysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  const number = Math.ceil(6 - ((date.getDate() - 1) / totalDaysInMonth) * 5);
  return { month, number };
}

function Availability({ english = false }) {
  const [{ month, number }, setValue] = useState(() =>
    getAvailability(english),
  );
  useEffect(() => {
    const update = () => setValue(getAvailability(english));
    update();
    const timer = window.setInterval(update, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [english]);
  return (
    <motion.div
      className="realisations-availability"
      initial={{ opacity: 0.001, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
    >
      <AvailabilityLottie />
      <div className="realisations-availability-copy">
        <span className="realisations-availability-number">{number}</span>
        <span>
          {english
            ? `spots left for ${month}`
            : `places restantes pour ${month}`}
        </span>
      </div>
    </motion.div>
  );
}

function DecorativeRight() {
  return (
    <svg
      className="realisations-decoration realisations-decoration-right"
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
  );
}
function DecorativeLeft() {
  return (
    <svg
      className="realisations-decoration realisations-decoration-left"
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
  );
}

function ImageCard({ side, item, mode }) {
  const tabletRight = mode === "tablet" && side === "right";
  return (
    <motion.div
      className={`realisations-card realisations-card-${side}`}
      initial={tabletRight ? false : { opacity: 0.001, y: 58 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
    >
      <img
        src={item.src}
        srcSet={item.srcSet}
        sizes={
          mode === "tablet"
            ? side === "left"
              ? "469.9061px"
              : "466.1188px"
            : "725px"
        }
        alt="Illustration décorative des réalisations"
        draggable="false"
      />
    </motion.div>
  );
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

function VideoCard({ mode }) {
  const noMotion = mode === "phone";
  const videoRef = useRef(null);
  const [videoIndex, setVideoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeVideo = VIDEO_SEQUENCE[videoIndex];
  const cancelVisibilityResume = usePauseVideoWhenHidden(videoRef, activeVideo);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    cancelVisibilityResume();
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    togglePlayback();
  };

  return (
    <motion.div
      className={`realisations-card realisations-card-video${isPaused ? " is-paused" : ""}`}
      initial={noMotion ? false : { opacity: 0.001, y: 58 }}
      animate={noMotion ? undefined : { opacity: 1, y: 0 }}
      transition={
        noMotion
          ? undefined
          : { type: "spring", bounce: 0.2, delay: 0.4, duration: 0.6 }
      }
      role="button"
      tabIndex={0}
      aria-label={isPaused ? "Reprendre la vidéo" : "Mettre la vidéo en pause"}
      aria-pressed={isPaused}
      onClick={togglePlayback}
      onKeyDown={handleKeyDown}
    >
      <video
        key={`${videoIndex}-${activeVideo}`}
        ref={videoRef}
        className="realisations-video"
        src={activeVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(event) => {
          event.currentTarget.currentTime = 0;
        }}
        onEnded={() =>
          setVideoIndex((current) => (current + 1) % VIDEO_SEQUENCE.length)
        }
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
      />
      <span className="realisations-video-play-state" aria-hidden="true">
        <PlaybackIcon paused={isPaused} />
      </span>
    </motion.div>
  );
}

export default function HeroRealisations({
  variant = "auto",
  offersHref,
  callHref,
  className = "",
  style,
  locale = "fr",
}) {
  const english = locale === "en";
  offersHref = localizeHref(offersHref, locale);
  callHref = localizeHref(callHref, locale);
  const normalized = variantAliases[variant] || "auto";
  const mode = useResolvedMode(variant);
  const phone = mode === "phone";
  const rootClass =
    `hero-realisations hero-realisations-${normalized} ${className}`.trim();
  const titleInitial = phone
    ? false
    : { filter: "blur(15px)", opacity: 0.001, y: 10 };
  const ctaInitial = phone ? false : { opacity: 0.001, y: 45 };

  return (
    <section className={rootClass} style={style}>
      <div className="realisations-inner">
        <div className="realisations-hero-section">
          <div className="realisations-main-content">
            <div className="realisations-content-stack">
              <div className="realisations-text-stack">
                <ClientsSatisfied mobile={phone} />
                <h1 className="realisations-title">
                  {(english ? "Our work" : "Nos réalisations")
                    .split(" ")
                    .map((word, index) => (
                      <React.Fragment key={`${word}-${index}`}>
                        <motion.span
                          className="realisations-title-word"
                          initial={titleInitial}
                          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                          transition={{
                            type: "tween",
                            delay: 0.15,
                            duration: 0.5,
                            ease: [0.44, 0, 0.56, 1],
                          }}
                        >
                          {word}
                        </motion.span>
                        {index === 0 ? " " : null}
                      </React.Fragment>
                    ))}
                </h1>
                <AnimatedSubtitle disabled={phone} english={english} />
              </div>

              <motion.div
                className="realisations-cta-row"
                initial={ctaInitial}
                animate={phone ? undefined : { opacity: 1, y: 0 }}
                transition={
                  phone
                    ? undefined
                    : {
                        type: "tween",
                        delay: 1,
                        duration: 0.4,
                        ease: [0.44, 0, 0.56, 1],
                      }
                }
              >
                {!phone && <OffersCTA href={offersHref} english={english} />}
                <CallCTA href={callHref} fullWidth={phone} english={english} />
              </motion.div>

              <Availability english={english} />
            </div>
          </div>
        </div>

        <div className="realisations-gallery">
          {!phone && (
            <ImageCard side="left" item={LEFT_REALISATION} mode={mode} />
          )}
          <VideoCard mode={mode} />
          {!phone && (
            <ImageCard side="right" item={RIGHT_REALISATION} mode={mode} />
          )}
        </div>
      </div>
      <DecorativeRight />
      <DecorativeLeft />
    </section>
  );
}
