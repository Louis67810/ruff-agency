import Image from "next/image";
import React from "react";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/solid";
import "./HeroSectionSlugRessource.css";
import { localizeHref } from "@/lib/i18n";

function normalizeImage(value) {
  if (!value) return null;
  if (typeof value === "string") return { src: value };
  if (typeof value === "object" && typeof value.src === "string") return value;
  return null;
}

function ChevronRight() {
  return (
    <svg className="hsr-chevron" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function cleanDate(value) {
  return String(value || "").replace(/^Dernière mise à jour le\s+/i, "");
}

export default function HeroSectionSlugRessource({
  breadcrumbTitle = "",
  title,
  profilePhoto,
  author = "Louis Staub",
  mainImage,
  mainVideo,
  updatedAt = "",
  readingMinutes = 1,
  homeHref = "/",
  resourcesHref = "/ressources",
  articleHref = "#",
  resourcesLabel = "Ressources",
  hideMeta = false,
  centered = false,
  children,
  className = "",
  style,
  locale = "fr",
}) {
  const english = locale === "en";
  homeHref = localizeHref(homeHref, locale);
  resourcesHref = localizeHref(resourcesHref, locale);
  articleHref = localizeHref(articleHref, locale);
  const profile = normalizeImage(profilePhoto);
  const heroImage = normalizeImage(mainImage);

  return (
    <section
      className={`hsr-root ${centered ? "hsr-root--centered" : ""} ${hideMeta ? "hsr-root--without-meta" : ""} ${className}`.trim()}
      style={style}
    >
      <div className="hsr-inner">
        <nav
          className="hsr-breadcrumb"
          aria-label={english ? "Breadcrumb" : "Fil d’Ariane"}
        >
          <a href={homeHref}>{english ? "Home" : "Accueil"}</a>
          <ChevronRight />
          <a href={resourcesHref}>{resourcesLabel}</a>
          <ChevronRight />
          <a href={articleHref} aria-current="page">
            {breadcrumbTitle || title}
          </a>
        </nav>

        <div className="hsr-heading">
          <h1>{title}</h1>
          {!hideMeta && (
            <div className="hsr-meta">
              <div className="hsr-author">
                {profile ? (
                  <Image
                    src={profile.src}
                    alt={profile.alt || `Portrait de ${author}`}
                    width={72}
                    height={72}
                    sizes="36px"
                  />
                ) : null}
                <span>
                  <small>{english ? "Written by:" : "Écrit par :"}</small>
                  {author}
                </span>
              </div>
              <i aria-hidden="true" />
              <div className="hsr-meta-item">
                <span className="hsr-meta-icon hsr-meta-icon-blue">
                  <ClockIcon />
                </span>
                <span>
                  {english
                    ? `${readingMinutes} min read`
                    : `${readingMinutes} min de lecture`}
                </span>
              </div>
              <i aria-hidden="true" />
              <div className="hsr-meta-item">
                <span className="hsr-meta-icon">
                  <CalendarDaysIcon />
                </span>
                <time>{cleanDate(updatedAt)}</time>
              </div>
            </div>
          )}
        </div>

        <div className="hsr-image-frame">
          {children ||
            (mainVideo?.src ? (
              <video
                className="hsr-main-video"
                controls
                playsInline
                preload="metadata"
                poster={mainVideo.poster}
                aria-label={mainVideo.title || title}
              >
                <source src={mainVideo.src} type="video/mp4" />
              </video>
            ) : heroImage ? (
              <Image
                className="hsr-main-image"
                src={heroImage.src}
                    alt={heroImage.alt || title || "Image de la ressource"}
                fill
                priority
                sizes="(max-width: 809px) calc(100vw - 48px), (max-width: 1399px) calc(100vw - 96px), 1054px"
              />
            ) : null)}
        </div>
      </div>
    </section>
  );
}
