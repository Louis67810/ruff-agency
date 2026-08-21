"use client";

import React, { useEffect, useMemo, useRef } from "react";
import "./PointsFocusOptimized.css";

export type FocusPoint = {
  title: string;
  text: string;
  icon?: React.ReactNode;
};

export type PointsFocusOptimizedProps = {
  heading?: string;
  points?: Partial<FocusPoint>[];
  className?: string;
};

const DEFAULT_TEXT =
  "Nous créons des landing pages en 10 jours conçues pour que vos clients ne partent plus sans convertir et pour élever votre image de marque.";

const DEFAULT_POINTS: FocusPoint[] = Array.from({ length: 6 }, () => ({
  title: "On créé des World-",
  text: DEFAULT_TEXT,
}));

const THEMES = [
  { box: "rgb(202, 230, 240)", icon: "rgb(34, 123, 157)" },
  { box: "rgb(192, 210, 255)", icon: "rgb(110, 142, 225)" },
  { box: "rgb(255, 235, 192)", icon: "rgb(210, 135, 71)" },
  { box: "rgb(215, 192, 255)", icon: "rgb(129, 101, 176)" },
  { box: "rgb(255, 206, 206)", icon: "rgb(210, 71, 71)" },
  { box: "rgb(221, 255, 221)", icon: "rgb(78, 136, 78)" },
] as const;

function SmartphoneIcon({ color }: { color: string }) {
  return (
    <svg className="pf-icon-svg" viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <path
        d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 18h.01" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DecorativeStroke({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg className="pf-decor pf-decor-1" viewBox="-19 -19 672 502" fill="none" aria-hidden="true">
        <path d="M0 147.986L44.4205 156.315C71.5307 161.398 94.1101 180.089 104.168 205.772C111.756 225.148 126.595 240.805 145.536 249.421L338.77 337.314C361.515 347.659 360.056 380.446 336.482 388.73C311.286 397.584 289.36 369.208 304.284 347.061L392.944 215.496C395.484 211.728 398.339 208.181 401.478 204.896L559.528 39.4873" stroke="black" strokeOpacity="0.02" strokeWidth="37.2374" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg className="pf-decor pf-decor-2" viewBox="-19 -19 501 394" fill="none" aria-hidden="true">
        <path d="M431 133.5L366.455 174.883C340.563 191.484 309.866 198.959 279.24 196.121L252.742 193.666C209.385 189.649 179.965 147.723 190.935 105.584L192.81 98.3807C198.166 77.8051 214.34 61.8021 234.971 56.6635C293.762 42.0205 332.876 115.904 287.715 156.293L207.358 228.16C203.461 231.645 199.25 234.762 194.779 237.471L0 355.5" stroke="black" strokeOpacity="0.02" strokeWidth="37.2374" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg className="pf-decor pf-decor-4" viewBox="-19 -19 399 364" fill="none" aria-hidden="true">
        <path d="M361 221.399L166.41 186.242C145.876 182.533 127.46 171.308 114.751 154.758L74.8017 102.73C56.9291 79.4543 68.7268 45.4872 97.1797 38.3012C137.941 28.0065 165.764 78.6183 135.229 107.517L50.3666 187.832C22.3261 214.37 20.5008 258.405 46.2486 287.173L81 326" stroke="black" strokeOpacity="0.02" strokeWidth="37.2374" />
      </svg>
    );
  }
  if (index === 4) {
    return (
      <svg className="pf-decor pf-decor-5" viewBox="-19 -19 653 445" fill="none" aria-hidden="true">
        <path d="M589.453 160.128L369.73 188.131C324.3 193.921 299.353 136.893 334.441 107.46L335.875 106.257C337.65 104.768 339.593 103.49 341.665 102.45C372.72 86.8544 400.868 127.909 375.127 151.255L304.967 214.888L49.1171 406.893" stroke="black" strokeOpacity="0.02" strokeWidth="37.2374" />
      </svg>
    );
  }
  if (index === 5) {
    return (
      <svg className="pf-decor pf-decor-6" viewBox="-19 -19 551 550" fill="none" aria-hidden="true">
        <path d="M283.746 89.269L324.84 138.165C346.289 163.687 344.674 201.37 321.119 224.963L283.083 263.061C271.758 274.405 274.515 293.449 288.592 301.115C312.3 314.025 299.958 350.189 273.305 345.912L103.735 318.707C72.3297 313.668 52.2455 282.488 60.6453 251.81L77.6934 189.546C94.283 128.958 166.695 104.119 216.981 141.769L383.189 266.21C389.379 270.844 394.938 276.265 399.728 282.334L512.912 425.768" stroke="black" strokeOpacity="0.02" strokeWidth="37.2374" />
      </svg>
    );
  }
  return null;
}

export default function PointsFocusOptimized({
  heading = "Nos points de focus",
  points,
  className = "",
}: PointsFocusOptimizedProps) {
  const rootRef = useRef<HTMLElement>(null);
  const resolvedPoints = useMemo(
    () =>
      DEFAULT_POINTS.map((fallback, index) => ({
        ...fallback,
        ...(points?.[index] ?? {}),
      })),
    [points],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-focus-card]"));
    const media = window.matchMedia("(max-width: 809px)");

    if (media.matches || !("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("pf-card-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("pf-card-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rootRef} className={`pf-section ${className}`.trim()}>
      <div className="pf-heading-wrap">
        <h2 className="pf-heading">{heading}</h2>
      </div>

      <div className="pf-grid">
        {resolvedPoints.map((point, index) => {
          const theme = THEMES[index];
          return (
            <article
              data-focus-card
              key={index}
              className="pf-card"
              style={{ "--pf-delay": `${index === 0 ? 0 : index * 0.1}s` } as React.CSSProperties}
            >
              <div className="pf-icon-box" style={{ backgroundColor: theme.box }}>
                {point.icon ?? <SmartphoneIcon color={theme.icon} />}
              </div>
              <h3 className="pf-card-title">{point.title}</h3>
              <p className="pf-card-text">{point.text}</p>
              <DecorativeStroke index={index} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
