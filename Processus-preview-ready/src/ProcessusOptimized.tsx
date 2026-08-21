import React from "react";
import "./ProcessusOptimized.css";

export type ProcessusOptimizedProps = {
  /** Destination du CTA. L'export Framer utilisait un webPageId interne non portable. */
  projectHref?: string;
  className?: string;
};

function TopLeftLine() {
  return (
    <svg
      className="processus__topLeftLine"
      viewBox="-37 -37 1257 1311"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M688 1134.5C633.292 971.038 602.676 800.48 597.118 628.196L589.693 398.067C588.189 351.447 611.614 307.551 651.18 282.848C730.606 233.26 834.892 280.705 849.693 373.162L855.251 407.879C866.304 476.925 829.506 544.765 765.601 573.152L416.446 728.253C402.205 734.579 387.191 738.997 371.793 741.391L0 799.219"
        stroke="black"
        strokeOpacity="0.02"
        strokeWidth="74"
      />
    </svg>
  );
}

function BottomLine() {
  return (
    <svg
      className="processus__bottomLine"
      viewBox="-37 -37 2413 1055"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M1546.31 862.065L1703.31 644.065L1724.78 619.294C1790.71 543.218 1881.2 492.628 1980.54 476.305C1995.57 473.837 2010.94 474.444 2025.72 478.09L2029.32 478.977C2138.5 505.904 2164.84 649.055 2072.4 713.081L2062.11 720.202C2036.03 738.269 2004.45 746.661 1972.84 743.931L712.434 635.075C645.051 629.256 586.874 585.545 562.529 522.444L559.416 514.375C482.856 315.938 215.489 284.009 94.3549 458.839L0.314225 594.565"
        stroke="black"
        strokeOpacity="0.025"
        strokeWidth="74"
      />
    </svg>
  );
}

function RightLine() {
  return (
    <svg
      className="processus__rightLine"
      viewBox="-37 -37 1032 1046"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M664.831 796.346C447.819 784.503 264.864 630.423 216.28 418.588L200.325 349.022C195.751 329.079 203.112 308.288 219.217 295.667L285.809 243.477C389.4 162.29 542.214 218.543 568.442 347.519L575.742 383.416C595.729 481.704 530.134 576.944 431.18 593.314L207.331 630.346L101.831 660.346"
        stroke="black"
        strokeOpacity="0.02"
        strokeWidth="74"
      />
    </svg>
  );
}

function ProjectCta({ href }: { href: string }) {
  return (
    <a className="processus__cta" href={href}>
      <span className="processus__ctaInner">
        <span className="processus__ctaText">Je lance mon projet maintenant</span>
      </span>
    </a>
  );
}

export default function ProcessusOptimized({
  projectHref = "#",
  className = "",
}: ProcessusOptimizedProps) {
  return (
    <section className={`processus ${className}`.trim()}>
      <TopLeftLine />
      <BottomLine />

      <div className="processus__content">
        <div className="processus__heading">
          <h2 className="processus__title">
            <span className="processus__titleDesktop">
              {"Un processus de  création  simple et efficace pour des projets uniques"}
            </span>
            <span className="processus__titlePhone">
              {"Un processus de  création  simple et efficace"}
            </span>
          </h2>

          <ProjectCta href={projectHref} />
        </div>

        <svg
          className="processus__separator"
          viewBox="-1 -1 1326 3"
          fill="none"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <line
            x1="-4.37114e-08"
            y1="0.5"
            x2="1324"
            y2="0.499884"
            stroke="black"
            strokeOpacity="0.09"
          />
        </svg>

        <div className="processus__panel" aria-hidden="true" />
      </div>

      <RightLine />
      <div className="processus__fade" aria-hidden="true" />
    </section>
  );
}
