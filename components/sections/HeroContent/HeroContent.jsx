"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./HeroContent.css";
import { ClientsSatisfaits } from "../Hero2Optimized/Hero2Optimized";

const LOTTIE_URL = "https://framerusercontent.com/assets/7Us0KKzHO2n8Jsf36VlImXFCQQ.json";
const CTA_AVATAR = {
  src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693",
  srcSet: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?scale-down-to=512&lossless=1&width=693&height=693 512w,https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693 693w",
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
    alt: "Illustration décorative du service",
  },
  {
    name: "Martin Riedweg",
    role: "Fondateur de Rentala",
    src: "https://framerusercontent.com/images/retw1gdTPy8WtAlUAkOQQM70dNw.png?width=640&height=640",
    srcSet: "https://framerusercontent.com/images/retw1gdTPy8WtAlUAkOQQM70dNw.png?scale-down-to=512&width=640&height=640 512w,https://framerusercontent.com/images/retw1gdTPy8WtAlUAkOQQM70dNw.png?width=640&height=640 640w",
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
    alt: "Illustration décorative du service",
  },
];

const REALISATIONS = [
  {
    src: "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069",
    srcSet: "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?scale-down-to=512&width=1339&height=1069 512w,https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?scale-down-to=1024&width=1339&height=1069 1024w,https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069 1339w",
    alt: "Hero section du site de Spreak",
  },
  {
    src: "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?width=2206&height=1223",
    srcSet: "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?scale-down-to=512&width=2206&height=1223 512w,https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?scale-down-to=1024&width=2206&height=1223 1024w,https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?scale-down-to=2048&width=2206&height=1223 2048w,https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?width=2206&height=1223 2206w",
    alt: "Hero section du site : Clovarex",
  },
  {
    src: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854",
    srcSet: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=512&width=1071&height=854 512w,https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=1024&width=1071&height=854 1024w,https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854 1071w",
    alt: "Section processus du site de Spreak",
  },
  {
    src: "https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?width=2288&height=1189",
    srcSet: "https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?scale-down-to=512&width=2288&height=1189 512w,https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?scale-down-to=1024&width=2288&height=1189 1024w,https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?scale-down-to=2048&width=2288&height=1189 2048w,https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?width=2288&height=1189 2288w",
    alt: "Hero section du site de  keyframe agency",
  },
  {
    src: "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884",
    srcSet: "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?scale-down-to=512&width=1331&height=884 512w,https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?scale-down-to=1024&width=1331&height=884 1024w,https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884 1331w",
    alt: "Hero section du site de  keyframe agency",
  },
  {
    src: "https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?width=1650&height=922",
    srcSet: "https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?scale-down-to=512&width=1650&height=922 512w,https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?scale-down-to=1024&width=1650&height=922 1024w,https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?width=1650&height=922 1650w",
    alt: "Hero section du site de  keyframe agency",
  },
  {
    src: "https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?width=2355&height=1126",
    srcSet: "https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?scale-down-to=512&width=2355&height=1126 512w,https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?scale-down-to=1024&width=2355&height=1126 1024w,https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?scale-down-to=2048&width=2355&height=1126 2048w,https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?width=2355&height=1126 2355w",
    alt: "Hero section du site de Getly",
  },
  {
    src: "https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?width=1346&height=716",
    srcSet: "https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?scale-down-to=512&width=1346&height=716 512w,https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?scale-down-to=1024&width=1346&height=716 1024w,https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?width=1346&height=716 1346w",
    alt: "Hero section du site de Rentala",
    objectPosition: "49.6% 0%",
  },
  {
    src: "https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?width=1252&height=862",
    srcSet: "https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?scale-down-to=512&width=1252&height=862 512w,https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?scale-down-to=1024&width=1252&height=862 1024w,https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?width=1252&height=862 1252w",
    alt: "Section problèmes du site de Spreak",
  },
  {
    src: "https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?width=1600&height=1015",
    srcSet: "https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?scale-down-to=512&width=1600&height=1015 512w,https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?scale-down-to=1024&width=1600&height=1015 1024w,https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?width=1600&height=1015 1600w",
    alt: "Design d'un concept de hero section",
  },
  {
    src: "https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?width=2335&height=1137",
    srcSet: "https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?scale-down-to=512&width=2335&height=1137 512w,https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?scale-down-to=1024&width=2335&height=1137 1024w,https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?scale-down-to=2048&width=2335&height=1137 2048w,https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?width=2335&height=1137 2335w",
    alt: "Hero section du site en dark mode pour un graphiste indépendant",
    objectPosition: "49.9% 0%",
  },
  {
    src: "https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?width=6064&height=4060",
    srcSet: "https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?scale-down-to=512&width=6064&height=4060 512w,https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?scale-down-to=1024&width=6064&height=4060 1024w,https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?scale-down-to=2048&width=6064&height=4060 2048w,https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?scale-down-to=4096&width=6064&height=4060 4096w,https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?width=6064&height=4060 6064w",
    alt: "Hero section du site de Initly",
  },
];

const variantAliases = {
  Desktop: "desktop",
  RJSffQxK9: "desktop",
  Tablet: "tablet",
  m3crwfXsz: "tablet",
  Phone: "phone",
  BgL9HDX_p: "phone",
  auto: "auto",
};

function usePhoneMode(variant) {
  const forced = variantAliases[variant] || "auto";
  const getValue = () => {
    if (forced === "phone") return true;
    if (forced === "desktop" || forced === "tablet") return false;
    return typeof window !== "undefined" ? window.matchMedia("(max-width: 809px)").matches : false;
  };
  const [phone, setPhone] = useState(getValue);
  useEffect(() => {
    if (forced !== "auto") {
      setPhone(forced === "phone");
      return;
    }
    const media = window.matchMedia("(max-width: 809px)");
    const update = () => setPhone(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, [forced]);
  return phone;
}

function Profile({ client }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="hero-client-slot"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        className="hero-client-avatar"
        src={client.src}
        srcSet={client.srcSet}
        alt={client.alt}
        draggable="false"
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="hero-client-tooltip"
            role="dialog"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          >
            <p className="hero-client-name">{client.name}</p>
            <p className="hero-client-role">{client.role}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ClientsSatisfied() {
  return (
    <div className="hero-clients">
      <div className="hero-clients-avatars">
        {CLIENTS.map((client, index) => <Profile key={`${client.name}-${index}`} client={client} />)}
      </div>
      <p className="hero-clients-copy">+30 clients satisfaits</p>
    </div>
  );
}

function PrimaryCTA({ href, children }) {
  return (
    <motion.a
      className="hero-cta hero-cta-primary"
      href={href || undefined}
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      <span className="hero-cta-primary-inner">
        <span className="hero-cta-text">{children}</span>
        <motion.span
          className="hero-cta-avatar-frame"
          variants={{ rest: { rotate: 0 }, hover: { rotate: 10 } }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        >
          <img
            className="hero-cta-avatar"
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

function TertiaryCTA({ href, children }) {
  return (
    <a className="hero-cta hero-cta-tertiary" href={href || undefined}>
      <span className="hero-cta-tertiary-inner">
        <span className="hero-cta-text">{children}</span>
      </span>
    </a>
  );
}

function AvailabilityLottie() {
  const ref = useRef(null);
  useEffect(() => {
    let destroyed = false;
    let animation;
    import("lottie-web").then((module) => {
      if (destroyed || !ref.current) return;
      const lottie = module.default || module;
      animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: LOTTIE_URL,
        rendererSettings: {
          progressiveLoad: true,
          hideOnTransparent: true,
        },
      });
    }).catch(() => {});
    return () => {
      destroyed = true;
      animation?.destroy?.();
    };
  }, []);
  return (
    <div className="hero-availability-icon-box">
      <div ref={ref} className="hero-availability-lottie" />
    </div>
  );
}

function getAvailability() {
  const date = new Date();
  const month = date.toLocaleDateString("fr-FR", { month: "long" });
  const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const number = Math.ceil(6 - ((date.getDate() - 1) / totalDays) * 5);
  return { month, number };
}

function Availability() {
  const [{ month, number }, setValue] = useState(getAvailability);
  useEffect(() => {
    const update = () => setValue(getAvailability());
    update();
    const timer = window.setInterval(update, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <motion.div
      className="hero-availability"
      initial={{ opacity: 0.001, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
    >
      <AvailabilityLottie />
      <div className="hero-availability-copy">
        <span className="hero-availability-number">{number}</span>
        <span>places restantes pour {month}</span>
      </div>
    </motion.div>
  );
}

function DecorativeLeft() {
  return (
    <div className="hero-decoration hero-decoration-left" aria-hidden="true">
      <svg width="100%" height="100%" viewBox="-37 -37 661 870" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M587 697.026L113.779 142.135C80.7861 103.448 92.9246 44.058 138.451 21.4196C164.867 8.28399 196.428 11.1396 220.057 28.8031L261.423 59.7251C319.221 102.931 341.496 179.144 316.062 246.676L222.816 494.265C216.639 510.664 208.062 526.055 197.365 539.934L0 796" stroke="white" strokeOpacity="0.04" strokeWidth="74" />
      </svg>
    </div>
  );
}

function DecorativeRight() {
  return (
    <div className="hero-decoration hero-decoration-right" aria-hidden="true">
      <svg width="100%" height="100%" viewBox="-37 -37 923 822" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M700 382.5L526.344 407.605C375.39 429.429 269.358 262.853 353.028 135.328L370.981 107.966C389.114 80.3294 418.24 61.808 450.958 57.1079C565.559 40.6452 630.17 184.499 541.739 259.226L299.628 463.821L0 747.5" stroke="white" strokeOpacity="0.04" strokeWidth="74" />
      </svg>
    </div>
  );
}

function RealisationCard({ item }) {
  return (
    <div className="hero-realisation">
      <img
        src={item.src}
        srcSet={item.srcSet}
        sizes="(max-width: 809px) 365px, (max-width: 1399px) 475px, 607px"
        alt={item.alt}
        draggable="false"
        style={{ objectPosition: item.objectPosition || "center center" }}
      />
    </div>
  );
}

function Ticker() {
  const sequenceRef = useRef(null);
  const trackRef = useRef(null);
  useLayoutEffect(() => {
    const update = () => {
      if (!sequenceRef.current || !trackRef.current) return;
      const gap = 16;
      const shift = sequenceRef.current.getBoundingClientRect().width + gap;
      trackRef.current.style.setProperty("--ticker-shift", `${-shift}px`);
      trackRef.current.style.setProperty("--ticker-duration", `${shift / 50}s`);
    };
    update();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (observer && sequenceRef.current) observer.observe(sequenceRef.current);
    window.addEventListener("resize", update);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  const sequence = (key) => (
    <div className="hero-ticker-sequence" ref={key === "first" ? sequenceRef : undefined} aria-hidden={key !== "first"}>
      {REALISATIONS.map((item, index) => <RealisationCard item={item} key={`${key}-${index}`} />)}
    </div>
  );
  return (
    <div className="hero-ticker">
      <div className="hero-ticker-track" ref={trackRef}>
        {sequence("first")}
        {sequence("second")}
      </div>
    </div>
  );
}

export default function HeroContent({
  variant = "auto",
  servicesHref,
  callHref,
  className = "",
  style,
}) {
  const normalized = variantAliases[variant] || "auto";
  const phone = usePhoneMode(variant);
  const rootClass = `hero-content hero-variant-${normalized} ${className}`.trim();
  const mountTween = phone ? false : { opacity: 0.001, y: 45 };
  const mountStatus = phone ? false : { opacity: 0.001, y: 60 };
  const mountTicker = phone ? false : { opacity: 0.001, y: 60 };
  const titleInitial = phone ? false : { filter: "blur(15px)", opacity: 0.001, y: 10 };
  const subtitleInitial = phone ? false : { filter: "blur(10px)", opacity: 0.001, y: 10 };

  return (
    <section className={rootClass} style={style}>
      <div className="hero-inner">
        <div className="hero-section">
          <DecorativeLeft />
          <DecorativeRight />
          <div className="hero-main-content">
            <div className="hero-content-stack">
              <div className="hero-text-stack">
                <ClientsSatisfaits />
                <h1 className="hero-title">
                  {"Découvrez nos différents services World-class ".split(" ").map((word, index, words) => (
                    word ? (
                      <React.Fragment key={`${word}-${index}`}>
                        <motion.span
                          className="hero-title-word"
                          initial={titleInitial}
                          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                          transition={{ type: "tween", delay: 0.15, duration: 0.5, ease: [0.44, 0, 0.56, 1] }}
                        >
                          {word}
                        </motion.span>
                        {index < words.length - 1 ? " " : null}
                      </React.Fragment>
                    ) : null
                  ))}
                </h1>
                <motion.p
                  className="hero-subtitle"
                  initial={subtitleInitial}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.75 }}
                >
                  Trois offres claires, pensées pour élever votre image et générer des demandes
                </motion.p>
              </div>

              <motion.div
                className="hero-cta-row"
                initial={mountTween}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "tween", delay: 1, duration: 0.4, ease: [0.44, 0, 0.56, 1] }}
              >
                <div className="hero-services-cta-wrap">
                  <TertiaryCTA href={servicesHref}>Voir nos services</TertiaryCTA>
                </div>
                <div className="hero-call-cta-wrap">
                  <PrimaryCTA href={callHref}>Réserver un appel</PrimaryCTA>
                </div>
              </motion.div>

              <motion.div
                className="hero-status-wrap"
                initial={mountStatus}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "tween", delay: 0.8, duration: 0.4, ease: [0.44, 0, 0.56, 1] }}
              >
                <Availability />
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          className="hero-ticker-motion"
          initial={mountTicker}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "tween", delay: 1, duration: 0.4, ease: [0.44, 0, 0.56, 1] }}
        >
          <Ticker />
        </motion.div>
      </div>
    </section>
  );
}
