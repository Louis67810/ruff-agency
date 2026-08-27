"use client";

import React from "react";
import "./AvisOptimized.css";
import { useLocale } from "@/components/LocaleProvider";

export type AvisOptimizedProps = {
  className?: string;
  avatarSrc?: string;
  locale?: "fr" | "en";
};

const DEFAULT_AVATAR =
  "https://framerusercontent.com/images/OyAwqa9YP58MVuHUk2Wbjbb2Ijo.jpg?width=200&height=200";

export default function AvisOptimized({
  className = "",
  avatarSrc = DEFAULT_AVATAR,
  locale,
}: AvisOptimizedProps) {
  const english = (locale ?? useLocale()) === "en";
  return (
    <section className={`avis-section ${className}`.trim()}>
      <div className="avis-vectors" aria-hidden="true">
        <svg
          className="avis-vector avis-vector-right"
          width="441"
          height="706"
          viewBox="-39 -39 441 706"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M231.5 0L105.863 191.033C37.453 295.052 7.60782 419.734 21.504 543.455C25.7617 581.362 69.1947 600.729 100.239 578.563L131.22 556.442C231.224 485.04 308.183 385.971 352.637 271.417L362.5 246"
            stroke="white"
            strokeOpacity="0.03"
            strokeWidth="77"
          />
        </svg>

        <svg
          className="avis-vector avis-vector-left"
          width="669"
          height="641"
          viewBox="-37 -37 669 641"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M595 496.5L148.937 128.938C105.305 92.9839 117.762 23.1464 171.135 4.49572C179.637 1.52457 188.619 0.16309 197.62 0.480926L231.859 1.68994C367.975 6.49631 447.887 156.805 375.745 272.331L326.617 351.005C311.568 375.103 290.939 395.225 266.474 409.67L0 567"
            stroke="white"
            strokeOpacity="0.03"
            strokeWidth="74"
          />
        </svg>
      </div>

      <div className="avis-content">
        <div className="avis-avatar-wrap">
          <div className="avis-avatar">
            <img
              src={avatarSrc}
              alt={
                english
                  ? "Profile photo of Antoine, founder of Keyframe Agency"
                  : "Photo de profil de Antoine fondateur de Keyframe agency"
              }
              width={200}
              height={200}
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>

        <div className="avis-copy">
          <p className="avis-quote">
            {english
              ? '"10/10. Ruff agency delivered my website very quickly and was incredibly responsive. The assets and animations are beautiful."'
              : '"10/10 Ruff agency m\'a délivré mon site très rapidement et ont été très réactifs. Les assets et les animations sont magnifiques."'}
          </p>

          <div className="avis-author">
            <p className="avis-author-name">Antoine Troovy</p>
            <p className="avis-author-role">
              {english
                ? "Founder of Keyframe Agency"
                : "Fondateur de Keyframe agency"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
