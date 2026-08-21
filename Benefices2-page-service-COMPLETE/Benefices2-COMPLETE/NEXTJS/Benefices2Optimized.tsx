"use client";

import React from "react";
import "./Benefices2Optimized.css";

export type Benefices2OptimizedProps = {
  className?: string;
  bookingHref?: string;
  landingPageHref?: string;
  siteInternetHref?: string;
  developpementWebHref?: string;
  avatarSrc?: string;
  videoSrc?: string;
};

const DEFAULT_AVATAR =
  "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693";

const DEFAULT_VIDEO =
  "https://framerusercontent.com/assets/DGCBKS0bAT9vQ3hBqQNayQ1oOxE.mp4";

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="b2-arrow">
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PrimaryCta({ href, avatarSrc }: { href: string; avatarSrc: string }) {
  return (
    <a href={href} className="b2-primary-cta">
      <span className="b2-primary-inner">
        <span className="b2-primary-label">Réserver un appel</span>
        <img
          className="b2-primary-avatar"
          src={avatarSrc}
          alt="Photo de profil de Louis Staub"
        />
      </span>
    </a>
  );
}

function ServiceCard({ title, href }: { title: string; href: string }) {
  return (
    <article className="b2-service-card">
      <div className="b2-service-content">
        <h3>{title}</h3>
        <a href={href} className="b2-detail-link">
          <span>Voir en détail</span>
          <ArrowRight />
        </a>
      </div>
    </article>
  );
}

export default function Benefices2Optimized({
  className = "",
  bookingHref = "#",
  landingPageHref = "#",
  siteInternetHref = "#",
  developpementWebHref = "#",
  avatarSrc = DEFAULT_AVATAR,
  videoSrc = DEFAULT_VIDEO,
}: Benefices2OptimizedProps) {
  return (
    <section className={`b2-section ${className}`.trim()}>
      <div className="b2-content">
        <div className="b2-header-block">
          <div className="b2-header-row">
            <div className="b2-copy">
              <h2 className="b2-title">Nos services</h2>
              <p className="b2-subtitle">
                Transformez vos visiteurs en clients et renforcez votre crédibilité grâce à une landing page premium,
                optimisée pour la conversion.
              </p>
            </div>
            <PrimaryCta href={bookingHref} avatarSrc={avatarSrc} />
          </div>
        </div>

        <div className="b2-top-separator" aria-hidden="true" />

        <div className="b2-services-area">
          <div className="b2-services-row">
            <div className="b2-video-frame">
              <video
                className="b2-video"
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>

            <div className="b2-services-list">
              <ServiceCard title="Landing Page" href={landingPageHref} />
              <div className="b2-service-separator" aria-hidden="true" />
              <ServiceCard title="Site Internet" href={siteInternetHref} />
              <div className="b2-service-separator" aria-hidden="true" />
              <ServiceCard title="Développement Web" href={developpementWebHref} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
