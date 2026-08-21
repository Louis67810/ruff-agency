import React from "react";
import "./HeroSectionSlugRessource.css";

const DEFAULT_TITLE = "Nouveau logo Bonduelle : analyse d'une refonte d'identité visuelle risquée";
const DEFAULT_DATE = "Dernière mise à jour le 15 juin 2026";

function normalizeImage(value) {
  if (!value) return null;
  if (typeof value === "string") return { src: value };
  if (typeof value === "object" && typeof value.src === "string") return value;
  return null;
}

function ChevronRight({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M 0 12 L 6 6 L 0 0" transform="translate(9 6)" />
    </svg>
  );
}

function BreadcrumbLink({ href, children }) {
  return (
    <a className="hsr-breadcrumb-link" href={href || "#"}>
      {children}
    </a>
  );
}

function TagPill({ label }) {
  return <div className="hsr-tag hsr-desktop-tablet-only">{label}</div>;
}

export default function HeroSectionSlugRessource({
  breadcrumbTitle = "",
  title = DEFAULT_TITLE,
  profilePhoto,
  author = "Louis Staub",
  mainImage,
  updatedAt = DEFAULT_DATE,
  homeHref = "#",
  resourcesHref = "#",
  articleHref = "#",
  tag = "Actualités",
  className = "",
  style
}) {
  const profile = normalizeImage(profilePhoto);
  const heroImage = normalizeImage(mainImage);

  return (
    <section className={`hsr-root ${className}`.trim()} style={style}>
      <div className="hsr-breadcrumb-wrap">
        <div className="hsr-breadcrumb-inner">
          <nav className="hsr-breadcrumb" aria-label="Fil d’Ariane">
            <BreadcrumbLink href={homeHref}>Accueil</BreadcrumbLink>
            <ChevronRight className="hsr-chevron" />
            <BreadcrumbLink href={resourcesHref}>Ressources</BreadcrumbLink>
            <ChevronRight className="hsr-chevron" />
            <BreadcrumbLink href={articleHref}>{breadcrumbTitle}</BreadcrumbLink>
          </nav>
        </div>
      </div>

      <div className="hsr-main">
        <div className="hsr-header-group">
          <div className="hsr-title-wrap">
            <h1 className="hsr-title">{title}</h1>
          </div>

          <div className="hsr-meta-row">
            <div className="hsr-meta-left">
              <TagPill label={tag} />
              <div className="hsr-date-pill">{updatedAt}</div>
            </div>

            <div className="hsr-author hsr-desktop-tablet-only">
              {profile ? (
                <img
                  className="hsr-author-photo"
                  src={profile.src}
                  srcSet={profile.srcSet}
                  sizes={profile.sizes || "48px"}
                  alt={profile.alt || ""}
                />
              ) : (
                <div className="hsr-author-photo hsr-image-empty" aria-hidden="true" />
              )}
              <div className="hsr-author-copy">
                <p className="hsr-author-name">{author}</p>
                <p className="hsr-author-label">Rédigé par :</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hsr-image-frame">
          {heroImage ? (
            <img
              className="hsr-main-image"
              src={heroImage.src}
              srcSet={heroImage.srcSet}
              sizes={heroImage.sizes || "(max-width: 809px) calc(100vw - 48px), min(calc(100vw - 128px), 1054px)"}
              alt={heroImage.alt || ""}
            />
          ) : (
            <div className="hsr-main-image hsr-image-empty" aria-hidden="true" />
          )}
        </div>
      </div>

      <svg className="hsr-deco hsr-deco-left hsr-desktop-tablet-only" viewBox="0 0 411 843" fill="none" aria-hidden="true">
        <path d="M382 720.784L-91.2215 165.893C-124.214 127.206 -112.075 67.8158 -66.5491 45.1774C-40.1332 32.0418 -8.57209 34.8974 15.0572 52.5609L56.4228 83.4829C114.221 126.689 136.496 202.902 111.062 270.434L17.8157 518.023C11.6395 534.422 3.06222 549.813 -7.63543 563.692L-205 819.758" stroke="#0147FF" strokeOpacity="0.04" strokeWidth="74" />
      </svg>

      <svg className="hsr-deco hsr-deco-right hsr-desktop-tablet-only" viewBox="0 0 600 756" fill="none" aria-hidden="true">
        <path d="M725.438 363.734L551.782 388.84C400.829 410.663 294.796 244.087 378.467 116.563L396.42 89.2005C414.553 61.5637 443.678 43.0423 476.397 38.3422C590.997 21.8796 655.608 165.733 567.177 240.461L325.066 445.055L25.4385 728.734" stroke="#0147FF" strokeOpacity="0.04" strokeWidth="74" />
      </svg>
    </section>
  );
}
