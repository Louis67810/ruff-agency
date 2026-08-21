"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./RealisationsOptimized.css";

export type RealisationCategory = "Agence" | "SaaS" | "PME" | "Indépendant";

export type RealisationProject = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  category: RealisationCategory;
  href?: string;
};

export type RealisationsOptimizedProps = {
  projects: RealisationProject[];
  className?: string;
  title?: string;
  background?: string;
  showDecorations?: boolean;
};

const categoryClass: Record<RealisationCategory, string> = {
  Agence: "realisations-category-agence",
  SaaS: "realisations-category-saas",
  PME: "realisations-category-pme",
  Indépendant: "realisations-category-independant",
};

function ProjectCard({ project, index }: { project: RealisationProject; index: number }) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={ref}
      href={project.href || "#"}
      className={`realisations-card${visible ? " is-visible" : ""}`}
      onClick={(event) => {
        if (!project.href || project.href === "#") event.preventDefault();
      }}
    >
      <div className="realisations-image-frame">
        <img
          className="realisations-image"
          src={project.image}
          alt={project.imageAlt || ""}
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="realisations-card-content">
        <div className="realisations-title-row">
          <h3 className="realisations-project-title">{project.title}</h3>
          <span className={`realisations-category ${categoryClass[project.category]}`}>
            {project.category}
          </span>
        </div>
        <p className="realisations-description">{project.description}</p>
      </div>
    </a>
  );
}

function DecorativeLeft() {
  return (
    <svg
      className="realisations-decoration realisations-decoration-left"
      width="1264"
      height="1327"
      viewBox="-37 -37 1264 1327"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M393.085 1073.26L425.315 662.19C429.346 610.77 455.606 563.666 497.225 533.2L710.192 377.309C773.735 330.795 862.058 339.329 915.52 397.148C993.832 481.841 955.48 619.348 844.638 651.283L764.185 674.464C653.078 706.476 541.613 625.099 538.256 509.521L532.528 312.309C531.738 285.111 527.46 258.126 519.8 232.017L451.729 0"
        stroke="#0147FF"
        strokeOpacity="0.02"
        strokeWidth="74"
      />
    </svg>
  );
}

function DecorativeRight() {
  return (
    <svg
      className="realisations-decoration realisations-decoration-right"
      width="1392"
      height="1389"
      viewBox="-37 -37 1392 1389"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1002.61 986.439L650.069 772.593C605.97 745.843 575.732 701.188 567.266 650.309L523.947 389.963C511.022 312.283 558.406 237.26 634.103 215.552C744.985 183.756 850.501 279.909 829.115 393.259L813.595 475.514C792.157 589.142 669.3 652.034 564.585 602.985L408.32 529.79C343.661 499.503 270.69 491.858 201.157 508.086L0 555.034"
        stroke="#0147FF"
        strokeOpacity="0.02"
        strokeWidth="74"
      />
    </svg>
  );
}

export default function RealisationsOptimized({
  projects,
  className = "",
  title = "Nos dernières réalisations",
  background = "rgb(246, 248, 255)",
  showDecorations = true,
}: RealisationsOptimizedProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleProjects = useMemo(
    () => (expanded ? projects : projects.slice(0, 4)),
    [expanded, projects]
  );
  const words = title.split(/\s+/);

  useEffect(() => {
    setExpanded(false);
  }, [projects]);

  return (
    <section className={`realisations-section ${className}`.trim()}>
      <div className="realisations-panel" style={{ backgroundColor: background }}>
        {showDecorations && <DecorativeLeft />}

        <div className="realisations-content">
          <div className="realisations-heading-wrap">
            <h2 className="realisations-heading" aria-label={title}>
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="realisations-heading-word"
                  aria-hidden="true"
                >
                  {word}
                  {index < words.length - 1 ? "\u00a0" : ""}
                </span>
              ))}
            </h2>
          </div>

          <div className="realisations-list">
            <div className="realisations-grid">
              {visibleProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {!expanded && projects.length > 4 && (
              <button
                type="button"
                className="realisations-more"
                onClick={() => setExpanded(true)}
              >
                Afficher plus de réalisations
              </button>
            )}
          </div>
        </div>

        {showDecorations && <DecorativeRight />}
      </div>
    </section>
  );
}
