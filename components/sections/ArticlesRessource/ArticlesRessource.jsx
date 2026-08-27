"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import { localizeHref } from "@/lib/i18n";
import "./ArticlesRessource.css";

const LOTTIE_URL =
  "https://framerusercontent.com/assets/7Us0KKzHO2n8Jsf36VlImXFCQQ.json";
const CTA_PROFILE =
  "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693";

const CTA_IMAGES = [
  {
    src: "https://framerusercontent.com/images/w6ciCcNESabQAAUEF0ypoFjelbY.png?width=1441&height=939",
    srcSet:
      "https://framerusercontent.com/images/w6ciCcNESabQAAUEF0ypoFjelbY.png?scale-down-to=512&width=1441&height=939 512w, https://framerusercontent.com/images/w6ciCcNESabQAAUEF0ypoFjelbY.png?scale-down-to=1024&width=1441&height=939 1024w, https://framerusercontent.com/images/w6ciCcNESabQAAUEF0ypoFjelbY.png?width=1441&height=939 1441w",
  },
  {
    src: "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069",
    srcSet:
      "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?scale-down-to=512&width=1339&height=1069 512w, https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?scale-down-to=1024&width=1339&height=1069 1024w, https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069 1339w",
  },
  {
    src: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854",
    srcSet:
      "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=512&width=1071&height=854 512w, https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=1024&width=1071&height=854 1024w, https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854 1071w",
  },
];

const TAG_STYLES = {
  actualités: {
    background: "rgb(255, 237, 214)",
    color: "rgb(148, 110, 13)",
    label: "Actualités",
  },
  guide: {
    background: "rgb(225, 231, 250)",
    color: "rgb(91, 109, 171)",
    label: "Guide",
  },
  conseils: {
    background: "rgb(242, 248, 250)",
    color: "rgb(63, 134, 158)",
    label: "Conseils",
  },
  outils: {
    background: "rgb(233, 247, 233)",
    color: "rgb(72, 153, 72)",
    label: "Outils",
  },
  acquisition: {
    background: "rgb(237, 232, 250)",
    color: "rgb(109, 88, 166)",
    label: "Acquisition",
  },
};

function normalizeTag(value) {
  return String(value || "outils")
    .trim()
    .toLocaleLowerCase("fr-FR");
}

function FilterTab({ active, children, onClick }) {
  return (
    <button
      className={`ar-filter-tab${active ? " is-active" : ""}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ArticleTag({ tag, english = false }) {
  const key = normalizeTag(tag);
  const style = TAG_STYLES[key] || TAG_STYLES.outils;
  const englishLabels = {
    actualités: "News",
    guide: "Guide",
    conseils: "Advice",
    outils: "Tools",
    acquisition: "Acquisition",
  };
  return (
    <div
      className="ar-article-tag"
      style={{ backgroundColor: style.background, color: style.color }}
    >
      {english ? englishLabels[key] || "Tools" : style.label}
    </div>
  );
}

function ArticleCard({
  article,
  getArticleHref,
  variant = "resources",
  english = false,
}) {
  const image =
    typeof article.image === "string"
      ? { src: article.image }
      : article.image || {};
  const href = localizeHref(
    article.href || (getArticleHref ? getArticleHref(article) : "#"),
    english ? "en" : "fr",
  );

  return (
    <a className="ar-card" href={href}>
      <div className="ar-card-image-shell">
        {image.src ? (
          <img
            className="ar-card-image"
            src={image.src}
            srcSet={image.srcSet}
            sizes="(max-width: 809px) calc(100vw - 48px), (max-width: 1399px) calc(100vw - 128px), 42vw"
            alt={image.alt || `Illustration de ${article.title}`}
            loading="lazy"
          />
        ) : null}
      </div>

      {variant === "resources" ? (
        <ArticleTag tag={article.tag} english={english} />
      ) : null}

      <h4 className="ar-card-title">{article.title}</h4>

      {variant === "tools" && article.description ? (
        <p className="ar-card-description">{article.description}</p>
      ) : null}

      {variant === "resources" ? (
        <div className="ar-author">
          <div className="ar-author-photo-shell">
            {article.authorPhoto?.src || article.authorPhoto ? (
              <img
                className="ar-author-photo"
                src={
                  typeof article.authorPhoto === "string"
                    ? article.authorPhoto
                    : article.authorPhoto.src
                }
                srcSet={
                  typeof article.authorPhoto === "object"
                    ? article.authorPhoto.srcSet
                    : undefined
                }
                alt="Illustration décorative de la ressource"
                loading="lazy"
              />
            ) : null}
          </div>
          <div className="ar-author-copy">
            <p className="ar-author-label">
              {english ? "Written by:" : "Rédigé par :"}
            </p>
            <p className="ar-author-name">{article.author || ""}</p>
          </div>
        </div>
      ) : null}
    </a>
  );
}

function Availability({ english = false }) {
  const lottieRef = useRef(null);
  const [month, setMonth] = useState("");
  const [places, setPlaces] = useState(6);

  useEffect(() => {
    const date = new Date();
    setMonth(
      date.toLocaleDateString(english ? "en-US" : "fr-FR", { month: "long" }),
    );
    const totalDays = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    setPlaces(Math.ceil(6 - ((date.getDate() - 1) / totalDays) * 5));
  }, [english]);

  useEffect(() => {
    if (!lottieRef.current) return undefined;
    let destroyed = false;
    let animation;
    import("lottie-web")
      .then((module) => {
        if (destroyed || !lottieRef.current) return;
        const lottie = module.default || module;
        animation = lottie.loadAnimation({
          container: lottieRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: LOTTIE_URL,
        });
      })
      .catch(() => {});
    return () => {
      destroyed = true;
      animation?.destroy?.();
    };
  }, []);

  return (
    <motion.div
      className="ar-availability"
      initial={{ opacity: 0.001, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
    >
      <div className="ar-availability-icon">
        <div className="ar-availability-lottie" ref={lottieRef} />
      </div>
      <div className="ar-availability-text">
        <span className="ar-availability-number">{places}</span>
        <span>
          {english
            ? `spots left for ${month}`
            : `places restantes pour ${month}`}
        </span>
      </div>
    </motion.div>
  );
}

function SidebarCta({ callHref = "#", english = false }) {
  return (
    <aside className="ar-sidebar">
      <div className="ar-sidebar-card">
        <svg
          className="ar-sidebar-vector-a"
          width="1578"
          height="2104"
          viewBox="-75 -75 1578 2104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M316.78 185.701L656.237 396.965L892.48 551.955C1001.92 623.751 1034.41 769.562 965.806 881.029L602.489 1471.38C577.068 1512.69 525.851 1530.06 480.544 1512.74C459.264 1504.61 441.363 1489.51 429.755 1469.91L407.16 1431.75C385.74 1395.58 378.804 1352.64 387.745 1311.57C414.801 1187.28 565.639 1138.07 660.787 1222.49L669.256 1230C677.849 1237.62 685.661 1246.08 692.577 1255.26L749.182 1330.32C774.841 1364.35 791.056 1404.56 796.184 1446.87L810.223 1562.7C816.142 1611.53 807.032 1661.02 784.106 1704.54L670.387 1920.46"
            stroke="url(#ar-side-grad-a)"
            strokeOpacity="0.07"
            strokeWidth="148.009"
          />
          <defs>
            <linearGradient
              id="ar-side-grad-a"
              x1="1036.45"
              y1="909.756"
              x2="573.586"
              y2="524.554"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.0398851" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="ar-sidebar-copy">
          <Availability english={english} />
          <p className="ar-sidebar-title">
            {english
              ? "We create world-class landing pages and websites"
              : "On créé des World-class Landings pages et Sites"}
          </p>
          <p className="ar-sidebar-description">
            {english
              ? "We create landing pages in 10 days, designed to turn more visitors into customers and elevate your brand."
              : "Nous créons des landing pages en 10 jours conçues pour que vos clients ne partent plus sans convertir et pour élever votre image de marque."}
          </p>
        </div>

        <svg
          className="ar-sidebar-vector-b"
          width="1905"
          height="1053"
          viewBox="-75 -75 1905 1053"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1755 335.216L1444.33 586.907L1220.6 759.466C1116.96 839.401 968.541 822.415 885.641 721.131L446.585 184.713C415.864 147.18 416.198 93.0975 447.381 55.947C462.028 38.4976 482.149 26.5188 504.47 21.9603L547.917 13.0873C589.105 4.67565 631.951 12.1645 667.844 34.0489C776.448 100.266 773.62 258.904 662.725 321.209L652.854 326.755C642.839 332.382 632.289 336.997 621.359 340.533L531.906 369.472C491.356 382.591 448.06 384.764 406.399 375.772L292.35 351.156C244.262 340.777 200.481 315.983 166.846 280.083L0 102"
            stroke="url(#ar-side-grad-b)"
            strokeOpacity="0.05"
            strokeWidth="148.009"
          />
          <defs>
            <linearGradient
              id="ar-side-grad-b"
              x1="835.39"
              y1="778.492"
              x2="1350.79"
              y2="467.072"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.0398851" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <a className="ar-call-button" href={callHref}>
          <span className="ar-call-button-inner">
            {english ? "Book a call" : "Réserver un appel"}
          </span>
        </a>

        <div className="ar-sidebar-collage" aria-hidden="true">
          <img
            className="ar-collage-image ar-collage-image-a"
            src={CTA_IMAGES[0].src}
            srcSet={CTA_IMAGES[0].srcSet}
            alt="Illustration décorative de la ressource"
          />
          <img
            className="ar-collage-image ar-collage-image-b"
            src={CTA_IMAGES[1].src}
            srcSet={CTA_IMAGES[1].srcSet}
            alt="Illustration décorative de la ressource"
          />
          <img
            className="ar-collage-image ar-collage-image-c"
            src={CTA_IMAGES[2].src}
            srcSet={CTA_IMAGES[2].srcSet}
            alt="Illustration décorative de la ressource"
          />
        </div>
      </div>
    </aside>
  );
}

export default function ArticlesRessource({
  tags = [],
  articles = [],
  initialTag,
  callHref = "#",
  getArticleHref,
  className = "",
  showFilters = true,
  showSidebar = true,
  variant = "resources",
  heading = "",
  locale,
}) {
  const english = (locale || useLocale()) === "en";
  callHref = localizeHref(callHref, english ? "en" : "fr") || "#";
  const [selectedTag, setSelectedTag] = useState(initialTag);

  const visibleArticles = useMemo(() => {
    const filtered = selectedTag
      ? articles.filter(
          (article) =>
            String(article.tagId ?? article.tag ?? "").toLowerCase() ===
            String(selectedTag).toLowerCase(),
        )
      : articles;
    return filtered.slice(0, 10);
  }, [articles, selectedTag]);

  return (
    <section
      className={`ar-root${variant === "tools" ? " ar-root--tools" : ""} ${className}`.trim()}
    >
      <div className="ar-layout">
        <div className={`ar-main${heading ? " ar-main--with-heading" : ""}`}>
          {showFilters ? (
            <div className="ar-filter-wrap">
              <div className="ar-filters">
                <FilterTab
                  active={!selectedTag}
                  onClick={() => setSelectedTag(undefined)}
                >
                  {english ? "All" : "Tout"}
                </FilterTab>
                {tags.map((tag) => {
                  const id = tag.id ?? tag.value ?? tag.label;
                  return (
                    <FilterTab
                      key={id}
                      active={
                        String(selectedTag ?? "").toLowerCase() ===
                        String(id).toLowerCase()
                      }
                      onClick={() => setSelectedTag(id)}
                    >
                      {tag.label ?? tag.title ?? id}
                    </FilterTab>
                  );
                })}
              </div>
            </div>
          ) : null}

          {heading ? <h2 className="ar-section-title">{heading}</h2> : null}
          <div className="ar-grid">
            {visibleArticles.map((article) => (
              <ArticleCard
                key={article.id ?? article.slug ?? article.title}
                article={article}
                getArticleHref={getArticleHref}
                variant={variant}
                english={english}
              />
            ))}
          </div>
        </div>

        {showSidebar ? (
          <SidebarCta callHref={callHref} english={english} />
        ) : null}
      </div>
    </section>
  );
}

export { CTA_PROFILE };
