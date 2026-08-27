"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  InformationCircleIcon,
  LinkIcon as HeroLinkIcon,
} from "@heroicons/react/24/outline";
import {
  AcademicCapIcon,
  CheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
import "./RessourceArticle.css";
import ArticleConfetti from "./ArticleConfetti";
import ArticleBeforeAfter from "./ArticleBeforeAfter";
import {
  ArticleBulletList,
  ArticleDivider,
  ArticleHighlightList,
} from "./ArticleContentBlocks";
import ArticleQuiz, { QuizRecommendation } from "../ArticleQuiz/ArticleQuiz";
import CtaAuditRealisationsSlug from "../CtaAuditRealisationsSlug/CtaAuditRealisationsSlug";

const ArticleChart = dynamic(() => import("./ArticleChart"), {
  loading: () => <div className="ra-chart-loading" aria-hidden="true" />,
});

const AI_SERVICES = [
  {
    name: "ChatGPT",
    icon: "/images/resource-article/2ea1d61b00aa9f2ead6b84e55dd2d2aea320829a.png",
    url: (q) => `https://chatgpt.com/?q=${q}`,
  },
  {
    name: "Claude",
    icon: "/images/resource-article/0733810129aa66243f42ea545a4c88ad31a0b6b5.png",
    url: (q) => `https://claude.ai/new?q=${q}`,
  },
  {
    name: "Grok",
    icon: "/images/resource-article/79bc7868f1f76c981dfdb1da7affbe3f4c094684.png",
    url: (q) => `https://grok.com/?q=${q}`,
  },
  {
    name: "Perplexity",
    icon: "/images/resource-article/204bc07afd64d4b43951f8f7b885e0059d2a91d5.png",
    url: (q) => `https://www.perplexity.ai/search/new?q=${q}`,
  },
];

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.38 4.28 5.47v6.28ZM5.32 7.41a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.04H3.54V8.98H7.1v11.47Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.49 0-1.956.931-1.956 1.887v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  );
}

const ARTICLE_BLOCK_ICONS = {
  info: ExclamationTriangleIcon,
  education: LightBulbIcon,
  warning: ExclamationTriangleIcon,
  academic: AcademicCapIcon,
  summary: ListBulletIcon,
  sources: DocumentTextIcon,
};

function ArticleBlockIcon({ name = "info" }) {
  const Icon = ARTICLE_BLOCK_ICONS[name] || ExclamationTriangleIcon;
  return (
    <span className="ra-block-icon" aria-hidden="true">
      <Icon />
    </span>
  );
}

function InlineInfoTrigger({ term, explanation, embedded = false }) {
  return (
    <span
      className={`ra-inline-info__trigger${embedded ? " ra-inline-info__trigger--embedded" : ""}`}
      tabIndex={0}
      role="button"
      aria-label={`En savoir plus sur ${term}`}
    >
      <InformationCircleIcon />
      <span className="ra-inline-info__popover" role="tooltip">
        {explanation}
      </span>
    </span>
  );
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatParagraph(value, inlineInfo = []) {
  const definitions = new Map(
    inlineInfo.map((item) => [item.term, item.explanation]),
  );
  const terms = [...definitions.keys()].sort((a, b) => b.length - a.length);
  const termPattern = terms.length
    ? new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "g")
    : null;
  return String(value)
    .split(/(\*\*[^*]+\*\*)/g)
    .flatMap((part, index) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
      if (!termPattern) return part;
      return part.split(termPattern).map((fragment, fragmentIndex) =>
        definitions.has(fragment) ? (
          <span className="ra-inline-term" key={`${index}-${fragmentIndex}`}>
            {fragment}
            <InlineInfoTrigger
              term={fragment}
              explanation={definitions.get(fragment)}
              embedded
            />
          </span>
        ) : (
          fragment
        ),
      );
    });
}

function SocialButton({ href, label, children, onClick }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      className="ra-share-button ra-fill-hover"
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noreferrer" : undefined}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </Tag>
  );
}

function ArticleFaqChevron({ open }) {
  return (
    <svg
      className={`ra-faq-chevron${open ? " is-open" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M 12 6 L 6 0 L 0 6" transform="translate(6 9)" />
    </svg>
  );
}

function ArticleFaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={`ra-faq-item${open ? " is-open" : ""}`}>
      <button
        className="ra-faq-header"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="ra-faq-question">{question}</span>
        <span className="ra-faq-chevron-wrap">
          <ArticleFaqChevron open={open} />
        </span>
      </button>
      <div className="ra-faq-answer-clip" aria-hidden={!open}>
        <div className="ra-faq-answer-inner">
          <p>{answer}</p>
        </div>
      </div>
      <div className="ra-faq-line" />
    </li>
  );
}

function ArticleFaq({ title = "Questions fréquentes", items }) {
  return (
    <section className="ra-faq" aria-labelledby="ra-faq-title">
      <h2 id="ra-faq-title">{title}</h2>
      <ul className="ra-faq-list">
        {items.map((item, index) => (
          <ArticleFaqItem key={`${item.question}-${index}`} {...item} />
        ))}
      </ul>
    </section>
  );
}

function ArticleCta({ block, locale = "fr" }) {
  const english = locale === "en";
  if (block.variant === "audit")
    return (
      <CtaAuditRealisationsSlug
        locale={locale}
        compact
        eyebrow={block.eyebrow}
        title={block.title}
        availability={block.availability}
      />
    );
  return (
    <QuizRecommendation
      english={english}
      cta={{
        badge: block.eyebrow,
        title: block.title,
        description: block.description,
        label: block.label,
        href: block.href,
      }}
    />
  );
}

function TableOfContents({ items, activeIndex }) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <aside
      className={`ra-toc${isOpen ? " is-open" : ""}`}
      aria-label="Sommaire de l’article"
      onPointerLeave={() => setIsOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsOpen(false);
      }}
    >
      <div className="ra-toc-panel">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => scrollTo(item.id)}
            aria-current={index === activeIndex ? "location" : undefined}
          >
            <span className="ra-toc-label">
              <span className="ra-toc-marquee">
                <span>{item.text}</span>
                <span aria-hidden="true">{item.text}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <button
        className="ra-toc-rail"
        type="button"
        aria-label="Ouvrir le sommaire"
        aria-expanded={isOpen}
        onPointerEnter={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen((open) => !open)}
      >
        {items.map((item, index) => {
          const distance = Math.abs(index - activeIndex);
          const width = distance === 0 ? 61 : distance === 1 ? 50 : 40;
          return (
            <span
              key={item.id}
              className={index === activeIndex ? "is-active" : ""}
              style={{ width }}
            />
          );
        })}
      </button>
    </aside>
  );
}

export default function RessourceArticle({
  articleTitle = "",
  articleUrl = "",
  quiz,
  articleLinks = [],
  authorPhoto,
  authorName = "Louis Staub",
  authorRole = "Expert web designer",
  authorBio = "J’aide les entreprises à transformer leur site en un outil clair, crédible et pensé pour convertir grâce au web design, à la stratégie et à l’expérience utilisateur.",
  contentBlocks = [],
  sources = [],
  className = "",
  locale = "fr",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const articleEndRef = useRef(null);
  const copiedTimeoutRef = useRef(null);
  const profileSrc =
    typeof authorPhoto === "string" ? authorPhoto : authorPhoto?.src;
  const headings = useMemo(() => {
    const seen = new Map();
    const result = [];
    if (contentBlocks[0]?.type === "paragraph")
      result.push({
        id: "introduction",
        text: "Introduction",
        level: 2,
        blockIndex: 0,
      });
    contentBlocks.forEach((block, blockIndex) => {
      if (block.type !== "heading") return;
      const base = slugify(block.text) || `section-${blockIndex + 1}`;
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      result.push({
        id: count ? `${base}-${count + 1}` : base,
        text: block.text,
        level: block.level || 2,
        blockIndex,
      });
    });
    return result;
  }, [contentBlocks]);

  useEffect(() => {
    if (!headings.length) return undefined;
    const update = () => {
      const marker = Math.min(window.innerHeight * 0.32, 260);
      let current = 0;
      headings.forEach((heading, index) => {
        const node = document.getElementById(heading.id);
        if (node && node.getBoundingClientRect().top <= marker) current = index;
      });
      setActiveIndex(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings]);

  useEffect(() => () => window.clearTimeout(copiedTimeoutRef.current), []);

  const encodedUrl = encodeURIComponent(articleUrl);
  const summaryPrompt = encodeURIComponent(
    `Résume cette ressource en français. Dégage les idées essentielles, les conseils actionnables et une conclusion courte : ${articleUrl}`,
  );
  const xShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(articleTitle)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
    } catch {
      window.prompt("Copiez le lien de cette ressource :", articleUrl);
    }
    window.clearTimeout(copiedTimeoutRef.current);
    setCopied(true);
    copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const headingByBlock = new Map(
    headings.map((heading) => [heading.blockIndex, heading]),
  );
  const lastHeadingBlockIndex = headings[headings.length - 1]?.blockIndex;
  const scrollToHeading = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section
      className={`ra-resource${quiz ? " ra-resource--with-inline-quiz" : ""} ${className}`.trim()}
    >
      <div className="ra-resource-layout">
        <main className="ra-resource-main">
          <section className="ra-summary" aria-labelledby="ra-summary-title">
            <h2 id="ra-summary-title">Résumer cette ressource avec :</h2>
            <div className="ra-summary-grid">
              {AI_SERVICES.map((service) => (
                <a
                  className="ra-ai-button ra-fill-hover"
                  href={service.url(summaryPrompt)}
                  target="_blank"
                  rel="noreferrer"
                  key={service.name}
                >
                  <Image src={service.icon} width={28} height={28} alt={`Icône du service ${service.title}`} />
                  <span>{service.name}</span>
                </a>
              ))}
            </div>
          </section>

          {quiz ? (
            <div className="ra-inline-quiz">
              <ArticleQuiz locale={locale} quiz={quiz} />
            </div>
          ) : null}

          <article className="ra-prose">
            {contentBlocks.map((block, index) => {
              const heading = headingByBlock.get(index);
              if (block.type === "heading") {
                const Tag = block.level === 3 ? "h3" : "h2";
                return (
                  <React.Fragment key={`${heading?.id}-${index}`}>
                    {index > 0 && index !== lastHeadingBlockIndex ? (
                      <ArticleDivider />
                    ) : null}
                    <Tag id={heading?.id}>{block.text}</Tag>
                  </React.Fragment>
                );
              }
              if (block.type === "image")
                return (
                  <Image
                    key={`${block.src}-${index}`}
                    className="ra-content-image"
                    src={block.src}
                    alt={block.alt || block.title || "Illustration de l’article"}
                    width={1640}
                    height={990}
                    sizes="(max-width: 809px) calc(100vw - 48px), 1054px"
                    unoptimized={/\.gif(?:$|\?)/i.test(block.src)}
                  />
                );
              if (block.type === "before-after")
                return (
                  <ArticleBeforeAfter
                    key={`before-after-${index}`}
                    before={block.before}
                    after={block.after}
                    beforeLabel={block.beforeLabel}
                    afterLabel={block.afterLabel}
                  />
                );
              if (block.type === "video")
                return (
                  <video
                    className="ra-content-video"
                    key={`${block.src}-${index}`}
                    controls
                    playsInline
                    preload="metadata"
                    poster={block.poster}
                    aria-label={block.title || "Vidéo de l’article"}
                  >
                    <source src={block.src} type="video/mp4" />
                  </video>
                );
              if (block.type === "table")
                return (
                  <div
                    className="ra-table-wrap"
                    key={`table-${index}`}
                    tabIndex={0}
                  >
                    <table
                      className={`ra-table${block.highlightFirstColumn ? " ra-table--highlight-first" : ""}`}
                    >
                      <thead>
                        <tr>
                          {block.columns.map((column) => (
                            <th key={column} scope="col">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, rowIndex) => (
                          <tr key={`row-${rowIndex}`}>
                            {row.map((cell, cellIndex) =>
                              cellIndex === 0 && block.highlightFirstColumn ? (
                                <th
                                  scope="row"
                                  key={`${rowIndex}-${cellIndex}`}
                                >
                                  {cell}
                                </th>
                              ) : (
                                <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              if (block.type === "inline-info")
                return (
                  <div className="ra-inline-info" key={`inline-info-${index}`}>
                    <span>{block.text}</span>
                    <InlineInfoTrigger
                      term={block.text}
                      explanation={block.explanation}
                    />
                  </div>
                );
              if (block.type === "article-link") {
                const linked = articleLinks.find(
                  (item) => item.slug === block.slug,
                );
                return (
                  <Link
                    className="ra-article-link"
                    href={linked?.href || `/ressources/${block.slug}`}
                    key={`article-link-${index}`}
                  >
                    {block.label || linked?.title || block.slug}
                  </Link>
                );
              }
              if (block.type === "chart")
                return (
                  <ArticleChart
                    key={`chart-${block.variant}-${index}`}
                    variant={block.variant}
                    title={block.title}
                    description={block.description}
                    data={block.data}
                    valueLabel={block.valueLabel}
                    unit={block.unit}
                    source={block.source}
                  />
                );
              if (block.type === "callout")
                return (
                  <aside
                    className={`ra-callout ra-callout--${block.variant}`}
                    key={`callout-${index}`}
                  >
                    <div className="ra-callout-title">
                      <ArticleBlockIcon name={block.icon || block.variant} />
                      <h3>{block.title}</h3>
                    </div>
                    <p>{block.text}</p>
                  </aside>
                );
              if (block.type === "quote")
                return (
                  <figure className="ra-quote" key={`quote-${index}`}>
                    <img
                      src="/images/resource-article/quote/1902-986.svg"
                      alt="Illustration décorative de l’article"
                      aria-hidden="true"
                    />
                    <blockquote>{block.text}</blockquote>
                    <img
                      src="/images/resource-article/quote/1902-990.svg"
                      alt="Illustration décorative de l’article"
                      aria-hidden="true"
                    />
                  </figure>
                );
              if (block.type === "point-cards")
                return (
                  <section
                    className="ra-point-cards"
                    aria-label="Points clés"
                    key={`points-${index}`}
                  >
                    {block.items.map((item, itemIndex) => (
                      <article
                        className="ra-point-card"
                        key={`${item.title}-${itemIndex}`}
                      >
                        <ArticleBlockIcon name={item.icon} />
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.text}</p>
                        </div>
                      </article>
                    ))}
                  </section>
                );
              if (block.type === "content-list")
                return (
                  <section
                    className={`ra-content-list ra-content-list--${block.variant}`}
                    aria-label={block.title}
                    key={`${block.variant}-${index}`}
                  >
                    <div className="ra-content-list-title">
                      <ArticleBlockIcon
                        name={
                          block.variant === "summary" ? "education" : "info"
                        }
                      />
                      <h3>{block.title}</h3>
                    </div>
                    <ul>
                      {block.items.map((item, itemIndex) => (
                        <li key={`${item.label}-${itemIndex}`}>
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {item.label}
                            </a>
                          ) : (
                            item.label
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              if (block.type === "faq")
                return (
                  <ArticleFaq
                    key={`faq-${index}`}
                    title={block.title}
                    items={block.items}
                  />
                );
              if (block.type === "cta")
                return (
                  <ArticleCta
                    key={`cta-${index}`}
                    block={block}
                    locale={locale}
                  />
                );
              if (block.type === "highlight-list")
                return (
                  <ArticleHighlightList
                    items={block.items}
                    key={`highlight-list-${index}`}
                  />
                );
              if (block.type === "bullet-list")
                return (
                  <ArticleBulletList
                    items={block.items}
                    key={`bullet-list-${index}`}
                  />
                );
              if (block.type === "divider")
                return index === contentBlocks.length - 1 ? null : (
                  <ArticleDivider key={`divider-${index}`} />
                );
              return (
                <p
                  id={
                    index === 0 && headings[0]?.id === "introduction"
                      ? "introduction"
                      : undefined
                  }
                  key={index}
                >
                  {formatParagraph(block.text, block.inlineInfo)}
                </p>
              );
            })}
          </article>

          <div
            className="ra-article-end"
            ref={articleEndRef}
            aria-hidden="true"
          />
          <ArticleConfetti triggerRef={articleEndRef} />
          <section
            className="ra-content-list ra-content-list--summary ra-end-toc"
            aria-label="Sommaire de l’article"
          >
            <div className="ra-content-list-title">
              <ArticleBlockIcon name="summary" />
              <h3>Sommaire</h3>
            </div>
            <ul>
              {headings.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          {sources.length ? (
            <section
              className="ra-content-list ra-content-list--sources ra-end-sources"
              aria-label="Sources de l’article"
            >
              <div className="ra-content-list-title">
                <ArticleBlockIcon name="sources" />
                <h3>Sources</h3>
              </div>
              <ul>
                {sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <section className="ra-share" aria-labelledby="ra-share-title">
            <h2 id="ra-share-title">Partagez cette ressource avec :</h2>
            <div className="ra-share-grid">
              <SocialButton href={xShare} label="Partager sur X">
                <XIcon />
              </SocialButton>
              <SocialButton href={linkedinShare} label="Partager sur LinkedIn">
                <LinkedInIcon />
              </SocialButton>
              <SocialButton href={facebookShare} label="Partager sur Facebook">
                <FacebookIcon />
              </SocialButton>
              <SocialButton
                label={copied ? "Lien copié" : "Copier le lien"}
                onClick={copyLink}
              >
                <span
                  className={`ra-copy-icon${copied ? " is-copied" : ""}`}
                  aria-hidden="true"
                >
                  <HeroLinkIcon className="ra-copy-icon__link" />
                  <CheckIcon className="ra-copy-icon__check" />
                </span>
                <span className="ra-sr-only" aria-live="polite">
                  {copied ? "Lien copié" : ""}
                </span>
              </SocialButton>
            </div>
          </section>

          <section
            className="ra-author-card"
            aria-label={`À propos de ${authorName}`}
          >
            <div className="ra-author-top">
              <div className="ra-author-identity">
                {profileSrc ? (
                  <Image
                    src={profileSrc}
                    width={160}
                    height={160}
                    sizes="80px"
                    alt={`Portrait de ${authorName}`}
                  />
                ) : null}
                <div className="ra-author-copy">
                  <h2>{authorName}</h2>
                  <p>{authorRole || "Expert web designer"}</p>
                </div>
              </div>
              <div className="ra-author-socials">
                <a
                  href="https://www.linkedin.com/in/louis-staub-a49062332/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`LinkedIn de ${authorName}`}
                >
                  <Image
                    src="/images/resource-article/author-socials/1840-566.svg"
                    width={57}
                    height={38}
                    alt="Icône de partage"
                  />
                </a>
                <a
                  href="https://x.com/Louis67810"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Compte X de ${authorName}`}
                >
                  <Image
                    src="/images/resource-article/author-socials/1840-569.svg"
                    width={38}
                    height={38}
                    alt="Icône de partage"
                  />
                </a>
              </div>
            </div>
            <p>
              {authorBio ||
                "J’aide les entreprises à transformer leur site en un outil clair, crédible et pensé pour convertir grâce au web design, à la stratégie et à l’expérience utilisateur."}
            </p>
          </section>
        </main>
        <TableOfContents items={headings} activeIndex={activeIndex} />
      </div>
    </section>
  );
}
