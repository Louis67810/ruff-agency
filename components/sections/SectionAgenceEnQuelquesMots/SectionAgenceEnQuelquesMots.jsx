"use client";
import React from "react";
import { motion } from "framer-motion";
import "./SectionAgenceEnQuelquesMots.css";
import { GRID, LOGO, ARROW1, ARROW7, ARROW6, ARROW3, ARROW5 } from "./svgs.js";

const PROFILE_SRC = "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693";
const PROFILE_SRCSET = "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?scale-down-to=512&lossless=1&width=693&height=693 512w,https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693 693w";
const DESKTOP_IMAGE_SRC = "https://framerusercontent.com/images/18l0Od1PkkmlVdarjM1OiSRwGaI.png?width=2775&height=2322";
const DESKTOP_IMAGE_SRCSET = "https://framerusercontent.com/images/18l0Od1PkkmlVdarjM1OiSRwGaI.png?scale-down-to=512&width=2775&height=2322 512w,https://framerusercontent.com/images/18l0Od1PkkmlVdarjM1OiSRwGaI.png?scale-down-to=1024&width=2775&height=2322 1024w,https://framerusercontent.com/images/18l0Od1PkkmlVdarjM1OiSRwGaI.png?scale-down-to=2048&width=2775&height=2322 2048w,https://framerusercontent.com/images/18l0Od1PkkmlVdarjM1OiSRwGaI.png?width=2775&height=2322 2775w";

const TICKER_VALUES = [
  { color: "rgb(221, 230, 255)", title: "Reconnaissance immédiate de votre marque", text: "Une image forte, mémorable, à vous." },
  { color: "rgb(244, 230, 255)", title: "Une offre enfin lisible et hiérarchisée", text: "Le visiteur comprend vite pourquoi vous.avoir payer, vous receverez un formulaire" },
  { color: "rgb(255, 248, 230)", title: " Fidélité à votre positionnement", text: "Image, message et promesse alignés." },
  { color: "rgb(233, 255, 230)", title: "Focus conversion", text: "Priorité aux inscriptions, appels, devis." },
  { color: "rgb(255, 207, 207)", title: "Des pages qui font avancer le business", text: "Clarté, crédibilité et action : sans bruit inutile." },
];

const DESKTOP_VALUES = [
  { className: "value-business", color: "rgb(255, 207, 207)", title: "Des pages qui font avancer le business", text: "Clarté, crédibilité et action : sans bruit inutile." },
  { className: "value-positioning", color: "rgb(255, 248, 230)", title: " Fidélité à votre positionnement", text: "Image, message et promesse alignés." },
  { className: "value-brand", color: "rgb(221, 230, 255)", title: "Reconnaissance immédiate de votre marque", text: "Une image forte, mémorable, à vous." },
  { className: "value-focus", color: "rgb(233, 255, 230)", title: "Focus conversion", text: "Priorité aux inscriptions, appels, devis." },
  { className: "value-offer", color: "rgb(244, 230, 255)", title: "Une offre enfin lisible et hiérarchisée", text: " Le visiteur comprend vite pourquoi vous." },
];

function RawSvg({ markup, className }) {
  return <div className={`agency-raw-svg ${className || ""}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />;
}

function ValueCard({ item, className = "" }) {
  return (
    <div className={`agency-value-card ${className}`} style={{ backgroundColor: item.color }}>
      <h4>{item.title}</h4>
      <p>{item.text}</p>
    </div>
  );
}

function Cta({ href }) {
  return (
    <a className="agency-cta" href={href}>
      <motion.div className="agency-cta-inner" whileHover={{ background: "linear-gradient(161deg, rgb(67, 108, 222) 0%, rgb(36, 77, 181) 100%)" }} transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}>
        <span>Réserver un appel</span>
        <motion.img
          src={PROFILE_SRC}
          srcSet={PROFILE_SRCSET}
          sizes="28px"
          alt="Photo de profil de Louis Staub"
          className="agency-cta-avatar"
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      </motion.div>
    </a>
  );
}

function AnimatedTitle() {
  const words = ["L'agence", "en", "quelques", "mots"];
  return (
    <h2 className="agency-title">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ filter: "blur(15px)", opacity: 0.001, y: 10 }}
          whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.44, 0, 0.56, 1] }}
        >
          {word}{i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </h2>
  );
}

function TickerStage() {
  const doubled = [...TICKER_VALUES, ...TICKER_VALUES];
  return (
    <div className="agency-responsive-stage">
      <RawSvg markup={GRID} className="agency-responsive-grid" />
      <RawSvg markup={LOGO} className="agency-responsive-logo" />
      <div className="agency-ticker-viewport">
        <div className="agency-ticker-track">
          {doubled.map((item, index) => <ValueCard key={index} item={item} className="agency-ticker-card" />)}
        </div>
      </div>
    </div>
  );
}

function DesktopStage() {
  return (
    <div className="agency-desktop-stage">
      <img
        className="agency-desktop-image"
        src={DESKTOP_IMAGE_SRC}
        srcSet={DESKTOP_IMAGE_SRCSET}
        sizes="872px"
        alt=""
      />
      <RawSvg markup={GRID} className="agency-desktop-grid" />
      <RawSvg markup={ARROW1} className="agency-arrow agency-arrow-1" />
      <RawSvg markup={ARROW7} className="agency-arrow agency-arrow-7" />
      <RawSvg markup={ARROW6} className="agency-arrow agency-arrow-6" />
      <RawSvg markup={ARROW3} className="agency-arrow agency-arrow-3" />
      <RawSvg markup={ARROW5} className="agency-arrow agency-arrow-5" />
      {DESKTOP_VALUES.map(item => <ValueCard key={item.className} item={item} className={`agency-desktop-card ${item.className}`} />)}
    </div>
  );
}

export default function SectionAgenceEnQuelquesMots({ callHref = "#" }) {
  return (
    <section className="agency-root">
      <div className="agency-header">
        <div className="agency-header-row">
          <div className="agency-copy">
            <AnimatedTitle />
            <motion.p
              className="agency-subtitle"
              initial={{ filter: "blur(10px)", opacity: 0.001, y: 10 }}
              whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0, delay: 0.75, duration: 0.5 }}
            >
              Transformez vos visiteurs en clients et .
            </motion.p>
          </div>
          <Cta href={callHref} />
        </div>
      </div>
      <DesktopStage />
      <TickerStage />
    </section>
  );
}
