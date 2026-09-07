"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  StarIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";
import Script from "next/script";
import { Availability } from "@/components/sections/Hero2Optimized/Hero2Optimized";
import CallBooking from "@/components/sections/CallBooking/CallBooking";
import { VideoReviewCard } from "@/components/sections/SectionAvis/SectionAvis";
import { HomepageReviewCard } from "@/components/sections/SectionAvis/HomepageReviewCard";
import { StackSection3 } from "@/components/sections/StackSection3/StackSection3";
import ExistingCta from "@/components/ui/Cta";
import { ConversionMetricsSection } from "./conversion-metrics-section";
import { SaasAnalyticsTracker, trackSaasEvent } from "./saas-analytics-tracker";
import { defaultTweets, type SaasTweet } from "./tweets";
import customContent from "./content.json";
import "@/components/sections/RessourceArticle/RessourceArticle.css";
import "@/components/sections/SectionAvis/SectionAvis.css";
import "./saas-redesign.css";

const profile =
  "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693";
const defaultBeforeAfterSlides = [
  {
    id: "redesign-overview",
    title: "Clearer positioning",
    copy: "A clearer website that makes the offer immediately understandable.",
    before:
      "/landing-assets/figma-originals/cd8183233d601dbb9b254d49e8f139c6d3b1c9cf.png",
    after:
      "/landing-assets/figma-originals/1ea3cd73547832c802473e1dde87b9e90562c34a.png",
  },
  {
    id: "redesign-detail",
    title: "A stronger first impression",
    copy: "A more credible visual direction built to earn trust at first glance.",
    before: "/landing-assets/1998-6039.png",
    after: "/landing-assets/1998-5944.png",
  },
  {
    id: "redesign-page",
    title: "A page built to convert",
    copy: "A focused experience that guides visitors towards the next step.",
    before: "/landing-assets/2007-851.png",
    after: "/landing-assets/2005-6313.png",
  },
] as const;
const beforeAfterSlides = [
  ...(customContent.realizations.length
    ? customContent.realizations
    : defaultBeforeAfterSlides),
];
type BeforeAfterSlide = (typeof beforeAfterSlides)[number];
type RealizationProject = {
  id: string;
  title: string;
  copy: string;
  slides: BeforeAfterSlide[];
};

const projectDetails: Record<string, Pick<RealizationProject, "title" | "copy">> = {
  zorgniotti: {
    title: "Zorgniotti",
    copy: "A complete five-page website redesign for an established accounting firm.",
  },
  spreak: {
    title: "Spreak",
    copy: "A complete eight-section redesign for a customer intelligence platform.",
  },
  artan: {
    title: "Artan",
    copy: "A complete seven-section redesign for a YouTube thumbnail studio.",
  },
  rentala: {
    title: "Rentala",
    copy: "A complete seven-section redesign for a rental management platform.",
  },
  keyframe: {
    title: "Keyframe",
    copy: "A complete eight-section redesign for a motion design agency.",
  },
  zagula: {
    title: "Julie Zagula",
    copy: "A complete five-section redesign for an independent accounting firm.",
  },
  scall: {
    title: "Scall",
    copy: "A complete six-section redesign for an independent art director.",
  },
};

const realizationProjects = beforeAfterSlides.reduce<RealizationProject[]>(
  (projects, slide) => {
    const projectId = slide.id.split("-")[0];
    const existingProject = projects.find(
      (project) => project.id === projectId,
    );
    if (existingProject) {
      existingProject.slides.push(slide);
      return projects;
    }
    const details = projectDetails[projectId];
    projects.push({
      id: projectId,
      title: details?.title ?? slide.title,
      copy: details?.copy ?? slide.copy,
      slides: [slide],
    });
    return projects;
  },
  [],
);
const resultsProjectPriority = ["spreak", "rentala"];
const orderedRealizationProjects = [...realizationProjects].sort(
  (projectA, projectB) => {
    const rank = (projectId: string) => {
      const index = resultsProjectPriority.indexOf(projectId);
      return index === -1 ? resultsProjectPriority.length : index;
    };
    return rank(projectA.id) - rank(projectB.id);
  },
);
const solutionCards = [
  [
    "2005-6442",
    "Clearer positioning",
    "Make it immediately obvious what your product does, who it’s for and why it matters.",
  ],
  [
    "2005-6450",
    "A stronger first impression",
    "Make it immediately obvious what your product does, who it’s for and why it matters.",
  ],
  [
    "2005-6458",
    "A page built to convert",
    "Make it immediately obvious what your product does, who it’s for and why it matters.",
  ],
  [
    "2005-6409",
    "A website that grows",
    "Create a flexible foundation that can evolve as your SaaS gains traction, expands its offer and reaches new customers.",
  ],
] as const;
const defaultReviews = [
  [
    "Sacha Tassart",
    "Founder of Spreak",
    "I highly recommend Louis for his remarkable work on Spreak. Any company looking to work with a rigorous, creative and reliable designer will make an excellent choice.",
    "https://framerusercontent.com/images/DqobaWrM96jw0NYRqTutldOZM.jpg?width=200&height=200",
  ],
  [
    "Antoine Troovy",
    "Founder of Keyframe Agency",
    "Ruff Agency delivered my website quickly and was incredibly responsive. The assets and animations are beautiful.",
    "https://framerusercontent.com/images/OyAwqa9YP58MVuHUk2Wbjbb2Ijo.jpg?width=200&height=200",
  ],
  [
    "Noé E.",
    "CEO of Myminia",
    "I am delighted with my landing page. The service was fast and reliable, and they had an answer to every challenge I brought them. I highly recommend them.",
    "https://framerusercontent.com/images/WLy8MmakiTBDk8q7dyr11OTsaJk.webp?width=512&height=512",
  ],
  [
    "Dominique Zenglein",
    "Partner at Zorgniotti",
    "We ordered a multi-page website and the experience was excellent from start to finish. It was delivered quickly with a clear, professional design and a result beyond our expectations.",
    "https://framerusercontent.com/images/nDeWJMtJPkakkMFDMXaoNWTTAMw.webp?width=167&height=167",
  ],
  [
    "Martin Riedweg",
    "Founder of Rentala",
    "I hired Ruff Agency to redesign Rentala and I am delighted with the result. The design is modern and clear, and the copy perfectly highlights our value proposition.",
    "https://framerusercontent.com/images/1An8qbppTr2JICZ6YfDZZ7BWY.jpg?width=640&height=640",
  ],
  [
    "Julie Zagula",
    "Founder of Clovarex",
    "A true professional. Louis delivered a polished, smooth website that perfectly met my expectations. He listens, adapts and gets it right.",
    "https://framerusercontent.com/images/AH1BhliY7qwLdbhFi1HqZoEyBs.webp?width=344&height=333",
  ],
  [
    "Nicolas H.",
    "Founder of Gourdy",
    "The website is not only beautiful, it also boosted our conversion rate. Every detail was designed to maximise our efficiency.",
    "https://framerusercontent.com/images/kYFWB25gUuDFLeJ4G2sMsKyBd0.webp?width=472&height=472",
  ],
  [
    "Elena Morris",
    "Founder of Northstack",
    "The new website finally reflects the quality of our product. The positioning is clearer, the experience feels premium and prospects understand our value much faster.",
    "https://framerusercontent.com/images/DqobaWrM96jw0NYRqTutldOZM.jpg?width=200&height=200",
  ],
  [
    "Tom Walker",
    "Co-founder of Orbitly",
    "A fast, structured and genuinely collaborative process. Every screen feels intentional and the finished website gave our team much more confidence when launching.",
    "https://framerusercontent.com/images/OyAwqa9YP58MVuHUk2Wbjbb2Ijo.jpg?width=200&height=200",
  ],
  [
    "Sarah Kim",
    "CEO of Metricflow",
    "They turned a complicated product into a simple and convincing story. The final design is polished, distinctive and much easier for our sales team to use.",
    "https://framerusercontent.com/images/WLy8MmakiTBDk8q7dyr11OTsaJk.webp?width=512&height=512",
  ],
  [
    "Michael Reed",
    "Founder of ClarityOS",
    "The redesign immediately improved the way customers perceived us. Communication was excellent and every piece of feedback was handled quickly and thoughtfully.",
    "https://framerusercontent.com/images/nDeWJMtJPkakkMFDMXaoNWTTAMw.webp?width=167&height=167",
  ],
  [
    "Emma Laurent",
    "Head of Growth at Pilote",
    "The page is clearer, faster and far more persuasive than what we had before. We now have a website that supports both acquisition and sales conversations.",
    "https://framerusercontent.com/images/1An8qbppTr2JICZ6YfDZZ7BWY.jpg?width=640&height=640",
  ],
  [
    "Liam Carter",
    "Co-founder of Relaybase",
    "From the first concepts to the final build, the work was precise and reliable. The result feels like a real brand rather than another generic SaaS template.",
    "https://framerusercontent.com/images/AH1BhliY7qwLdbhFi1HqZoEyBs.webp?width=344&height=333",
  ],
] as const;
const reviews = [
  ...(customContent.reviews.length
    ? customContent.reviews.map(
        (review) =>
          [review.name, review.role, review.quote, review.avatar] as const,
      )
    : defaultReviews),
];
const issues = [
  [
    'You\'ve outgrown the "quick MVP site"',
    "Your product may already have paying customers, but an MVP-looking website makes the company feel less established.",
  ],
  [
    "It looks like everyone else's",
    "When every SaaS makes similar promises, design and positioning become part of how people decide who feels trustworthy.",
  ],
  [
    "Your first website wasn’t built for this",
    "The site that helped you launch isn’t necessarily the site that should help you scale.",
  ],
  [
    "You don't have time to fix it yourself",
    "You're not going to spend 3 weeks in a page builder tweaking spacing. You have a product to run.",
  ],
] as const;
const problemIcons = [
  ArrowTrendingUpIcon,
  DocumentDuplicateIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
] as const;
const comparisonProjects = [
  {
    project: "Zorgniotti",
    before: "/landing-assets/zorgniotti/before-home.png",
    after: "/landing-assets/zorgniotti/after-home.png",
    afterSide: "b",
    afterPercent: 98,
  },
  {
    project: "Spreak",
    before: "/landing-assets/spreak/before-01-home.png",
    after: "/landing-assets/spreak/after-01-home.png",
    afterSide: "a",
    afterPercent: 93,
  },
  {
    project: "Artan",
    before: "/landing-assets/artan/before-01-home.png",
    after: "/landing-assets/artan/after-01-home.png",
    afterSide: "b",
    afterPercent: 96,
  },
  {
    project: "Rentala",
    before: "/landing-assets/rentala/before-01-home.png",
    after: "/landing-assets/rentala/after-01-home.png",
    afterSide: "a",
    afterPercent: 89,
  },
  {
    project: "Keyframe",
    before: "/landing-assets/keyframe/before-01-home.png",
    after: "/landing-assets/keyframe/after-01-home.png",
    afterSide: "b",
    afterPercent: 97,
  },
  {
    project: "Julie Zagula",
    before: "/landing-assets/julie-zagula/before-01-home.png",
    after: "/landing-assets/julie-zagula/after-01-home.png",
    afterSide: "a",
    afterPercent: 91,
  },
  {
    project: "Scall",
    before: "/landing-assets/scall/before-01-home.png",
    after: "/landing-assets/scall/after-01-home.png",
    afterSide: "b",
    afterPercent: 95,
  },
] as const satisfies ReadonlyArray<{
  project: string;
  before: string;
  after: string;
  afterSide: "a" | "b";
  afterPercent: number;
}>;

const comparisonRounds = comparisonProjects.map((comparison) => ({
  project: comparison.project,
  a: comparison.afterSide === "a" ? comparison.after : comparison.before,
  b: comparison.afterSide === "b" ? comparison.after : comparison.before,
  aPercent:
    comparison.afterSide === "a"
      ? comparison.afterPercent
      : 100 - comparison.afterPercent,
  bPercent:
    comparison.afterSide === "b"
      ? comparison.afterPercent
      : 100 - comparison.afterPercent,
  afterSide: comparison.afterSide,
}));

const saasFaqs = [
  {
    question: "How long does it take?",
    answer:
      '10 business days from kickoff to delivery. You get a clear timeline upfront, not a vague "a few weeks."',
  },
  {
    question: "How much does it cost?",
    answer:
      "Projects start at $2,000. You receive a fixed-price quote before we start — no hourly rate, scope creep or surprise invoice.",
  },
  {
    question: "Is this a subscription?",
    answer:
      "No. One project, one payment, and you own the result. There is no retainer or monthly fee.",
  },
  {
    question: "What do you need from me to start?",
    answer:
      "Your current site (if you have one), a rough idea of what you sell and who buys it, and any brand assets you already have, such as your logo and colors. That's it.",
  },
  {
    question: "Will you touch my product, or just the marketing site?",
    answer:
      "Just the marketing site — the pages that sell your product, not the app itself. I won't touch your codebase or product features.",
  },
  {
    question: "What if I need changes after delivery?",
    answer:
      "You get unlimited revisions throughout the project. At handoff, I also provide short, personalized tutorials that walk you through everything so you can manage the site easily. Once the project is complete, new pages and larger changes, including major illustration updates, are not included and are quoted separately.",
  },
  {
    question: "Do you work with SaaS outside this niche or stage?",
    answer:
      "This offer is built specifically for early-stage SaaS founders around $1–3K MRR who've outgrown their AI-built site. If that's not you, we can still talk, but the process is optimized for that stage.",
  },
] as const;

const SparklesIcon = () => null;

function Cta() {
  return (
    <ExistingCta kind="primary" href="#book" label="Book a Strategic Call">
      Book a Strategic Call
    </ExistingCta>
  );
}

function MarqueeCard({
  item,
  slides = beforeAfterSlides,
  compact = false,
  onSlideChange,
}: {
  item: string;
  slides?: ReadonlyArray<BeforeAfterSlide>;
  compact?: boolean;
  onSlideChange?: (slide: BeforeAfterSlide) => void;
}) {
  const slideSet = slides.length ? slides : beforeAfterSlides;
  const [position, setPosition] = useState(50);
  const [activeSlide, setActiveSlide] = useState(() => {
    const slideIndex = slideSet.findIndex((slide) => slide.id === item);
    return slideIndex >= 0 ? slideIndex : 0;
  });
  const slide = slideSet[activeSlide];

  useEffect(() => setPosition(50), [activeSlide]);
  const updatePositionFromPointer = (
    event: ReactPointerEvent<HTMLInputElement>,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextPosition = ((event.clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, nextPosition)));
  };

  return (
    <article
      className={`sr-marquee-card${compact ? " sr-marquee-card--compact" : ""}`}
      aria-label="Website redesign example"
    >
      <div className="sr-marquee-card__image" data-example={item}>
        <img
          className="sr-marquee-card__after"
          src={slide.after}
          alt="Website after redesign"
          key={`after-${slide.id}`}
        />
        <div
          className="sr-marquee-card__before-mask"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            className="sr-marquee-card__before"
            src={slide.before}
            alt="Website before redesign"
            key={`before-${slide.id}`}
          />
        </div>
        <span
          className="sr-marquee-card__divider"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        />
        <span
          className="sr-marquee-card__handle"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <svg
            className="sr-marquee-card__handle-icon"
            width="34"
            height="21"
            viewBox="0 0 34 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.47027 9.61751C6.3525 9.73542 6.28636 9.89525 6.28636 10.0619C6.28636 10.2285 6.3525 10.3884 6.47027 10.5063L12.7588 16.7949C12.8781 16.906 13.0357 16.9664 13.1986 16.9635C13.3616 16.9607 13.517 16.8947 13.6322 16.7795C13.7474 16.6642 13.8134 16.5088 13.8163 16.3459C13.8192 16.183 13.7587 16.0253 13.6476 15.9061L7.80345 10.0619L13.6476 4.21772C13.7587 4.09851 13.8192 3.94084 13.8163 3.77792C13.8134 3.615 13.7474 3.45956 13.6322 3.34434C13.517 3.22913 13.3616 3.16313 13.1986 3.16025C13.0357 3.15738 12.8781 3.21785 12.7588 3.32893L6.47027 9.61751Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M27.4243 9.61751C27.542 9.73542 27.6082 9.89525 27.6082 10.0619C27.6082 10.2285 27.542 10.3884 27.4243 10.5063L21.1357 16.7949C21.0165 16.906 20.8588 16.9664 20.6959 16.9635C20.533 16.9607 20.3775 16.8947 20.2623 16.7795C20.1471 16.6642 20.0811 16.5088 20.0782 16.3459C20.0753 16.183 20.1358 16.0253 20.2469 15.9061L26.0911 10.0619L20.2469 4.21772C20.1358 4.09851 20.0753 3.94084 20.0782 3.77792C20.0811 3.615 20.1471 3.45956 20.2623 3.34434C20.3775 3.22913 20.533 3.16313 20.6959 3.16025C20.8588 3.15738 21.0165 3.21785 21.1357 3.32893L27.4243 9.61751Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <input
          className="sr-marquee-card__range"
          aria-label="Compare before and after"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            updatePositionFromPointer(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              updatePositionFromPointer(event);
          }}
          onPointerUp={(event) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            trackSaasEvent({
              eventType: "before_after_interaction",
              sectionId: compact ? "results" : "hero",
              value: position,
              metadata: { slide: slide.id, method: "slider" },
            });
          }}
        />
      </div>
      <div className="sr-before-after-dots" aria-label="Choose a redesign">
        {slideSet.map((candidate, index) => (
          <button
            type="button"
            key={candidate.id}
            className={index === activeSlide ? "is-active" : ""}
            aria-label={`Show redesign ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
            onClick={() => {
              setActiveSlide(index);
              onSlideChange?.(candidate);
              trackSaasEvent({
                eventType: "before_after_interaction",
                sectionId: compact ? "results" : "hero",
                metadata: { slide: candidate.id, method: "dot" },
              });
            }}
          />
        ))}
      </div>
      <span className="sr-marquee-card__label sr-marquee-card__label--before">
        Before
      </span>
      <span className="sr-marquee-card__label sr-marquee-card__label--after">
        After
      </span>
    </article>
  );
}

function Marquee({
  projects,
  className = "",
}: {
  projects: ReadonlyArray<RealizationProject>;
  className?: string;
}) {
  const repeated = [...projects, ...projects];
  const trackRef = useRef<HTMLDivElement>(null);
  const rateFrame = useRef<number | null>(null);

  const tweenPlaybackRate = (targetRate: number) => {
    const animation = trackRef.current?.getAnimations()[0];
    if (!animation) return;
    if (rateFrame.current !== null) cancelAnimationFrame(rateFrame.current);

    const initialRate = animation.playbackRate;
    const startedAt = performance.now();
    const duration = 700;
    const updateRate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      animation.updatePlaybackRate(
        initialRate + (targetRate - initialRate) * eased,
      );
      if (progress < 1) rateFrame.current = requestAnimationFrame(updateRate);
      else rateFrame.current = null;
    };

    rateFrame.current = requestAnimationFrame(updateRate);
  };

  useEffect(
    () => () => {
      if (rateFrame.current !== null) cancelAnimationFrame(rateFrame.current);
    },
    [],
  );

  return (
    <div
      className={`sr-marquee ${className}`}
      onMouseEnter={() => tweenPlaybackRate(0.08)}
      onMouseLeave={() => tweenPlaybackRate(1)}
    >
      <div className="sr-marquee__track" ref={trackRef}>
        {repeated.map((project, index) => (
          <MarqueeCard
            key={`${project.id}-${index}`}
            item={project.slides[0].id}
            slides={project.slides}
          />
        ))}
      </div>
    </div>
  );
}

function Choice() {
  const [slide, setSlide] = useState(0);
  const [choice, setChoice] = useState<"a" | "b" | null>(null);
  const comparisons = useMemo(
    () => [["2005-6325", "2005-6313"], null, null, null, null] as const,
    [],
  );
  const current = comparisons[slide];
  useEffect(() => setChoice(null), [slide]);
  return (
    <section className="sr-choice" aria-labelledby="choice-title">
      <h2 id="choice-title">
        Exact same product. Which one would you trust with your money?
      </h2>
      <div className="sr-rule" />
      <div className="sr-choice-grid">
        {(["a", "b"] as const).map((side) => (
          <button
            key={side}
            className={`sr-choice-card sr-choice-card--${side}`}
            onClick={() => setChoice(side)}
            aria-label={`Vote for ${side.toUpperCase()}`}
          >
            <span className="sr-choice-letter">{side.toUpperCase()}</span>
            <span className="sr-choice-art" aria-hidden="true">
              {current ? (
                <img
                  src={`/landing-assets/${current[side === "a" ? 0 : 1]}.png`}
                  alt=""
                />
              ) : (
                <span className="sr-choice-placeholder">
                  Comparison image coming soon
                </span>
              )}
            </span>
            <span className="sr-choice-vote">
              Vote for {side.toUpperCase()}
            </span>
            {choice === side && (
              <span
                className={`sr-vote-overlay ${side === "b" ? "sr-vote-overlay--positive" : ""}`}
              >
                <strong>
                  {side === "b"
                    ? "A lot of people chose the same option."
                    : "Your choice is different."}
                </strong>
                <small>
                  {side === "b"
                    ? "You’re with the majority."
                    : "This option belongs to the minority."}
                </small>
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="sr-pager">
        <button
          onClick={() => setSlide((slide + 4) % 5)}
          aria-label="Previous comparison"
        >
          <ArrowLeftIcon />
        </button>
        <span>{slide + 1}/5</span>
        <button
          onClick={() => setSlide((slide + 1) % 5)}
          aria-label="Next comparison"
        >
          <ArrowRightIcon />
        </button>
      </div>
      <h3>And you’re not the only one who thinks that</h3>
      <p className="sr-muted">
        Only tweets from the last 24 hours · that tells that an ai website is
        hindering conversion and does not encourage people to buy anything from
        it.
      </p>
      <div className="sr-tweet-window">
        <div className="sr-tweet-placeholder-row">
          {[1, 2, 3, 4].map((item) => (
            <blockquote
              className="twitter-tweet sr-tweet-placeholder"
              key={item}
            >
              <p>Twitter/X embed placeholder</p>
              <a href="#" onClick={(event) => event.preventDefault()}>
                Replace with the final post URL
              </a>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function TweetWall({ tweets }: { tweets: ReadonlyArray<SaasTweet> }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rateFrame = useRef<number | null>(null);
  const loop = [...tweets, ...tweets];

  const tweenPlaybackRate = (targetRate: number) => {
    const animation = trackRef.current?.getAnimations()[0];
    if (!animation) return;
    if (rateFrame.current !== null) cancelAnimationFrame(rateFrame.current);
    const initialRate = animation.playbackRate;
    const startedAt = performance.now();
    const duration = 700;
    const updateRate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      animation.updatePlaybackRate(
        initialRate + (targetRate - initialRate) * eased,
      );
      if (progress < 1) rateFrame.current = requestAnimationFrame(updateRate);
      else rateFrame.current = null;
    };
    rateFrame.current = requestAnimationFrame(updateRate);
  };

  useEffect(
    () => () => {
      if (rateFrame.current !== null) cancelAnimationFrame(rateFrame.current);
    },
    [],
  );

  return (
    <div
      className="sr-social-proof"
      aria-label="Posts from X"
      data-sr-reveal="up"
    >
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
      <h3>And you’re not the only one who thinks that</h3>
      <p className="sr-muted">
        <strong>Only tweets from the last 24 hours</strong> : that tells that an
        AI website is hindering conversion and does not encourage people to buy
        anything from it.
      </p>
      <div
        className="sr-embed-ticker"
        onMouseEnter={() => tweenPlaybackRate(0.28)}
        onMouseLeave={() => tweenPlaybackRate(1)}
      >
        <div className="sr-embed-track" ref={trackRef}>
          {loop.map((tweet, index) => (
            <div className="sr-embed" key={`${tweet.href}-${index}`}>
              <blockquote
                className="twitter-tweet"
                data-dnt="true"
                data-theme="light"
              >
                <a href={tweet.href}>View this post on X</a>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RatingStars() {
  return (
    <span className="sr-rating-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} />
      ))}
    </span>
  );
}

function useSaasScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sr-reveal]"),
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.dataset.srVisible = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.srVisible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function TrustChoice({ tweets }: { tweets: ReadonlyArray<SaasTweet> }) {
  const [slide, setSlide] = useState(0);
  const [choice, setChoice] = useState<"a" | "b" | null>(null);
  const [locked, setLocked] = useState(false);
  const current = comparisonRounds[slide];

  const changeSlide = (direction: -1 | 1) => {
    if (locked) return;
    setChoice(null);
    setSlide(
      (currentSlide) =>
        (currentSlide + direction + comparisonRounds.length) %
        comparisonRounds.length,
    );
  };

  const submitVote = (side: "a" | "b") => {
    if (locked) return;
    setChoice(side);
    setLocked(true);
    trackSaasEvent({
      eventType: "vote",
      sectionId: "vote",
      value: current[`${side}Percent`],
      metadata: {
        choice: side.toUpperCase(),
        comparison: slide + 1,
        project: current.project,
      },
    });
  };

  useEffect(() => {
    if (!locked || !choice) return;
    const timer = window.setTimeout(() => {
      setChoice(null);
      setSlide((currentSlide) => (currentSlide + 1) % comparisonRounds.length);
      setLocked(false);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [choice, locked]);

  return (
    <section
      className="sr-choice sr-trust-choice"
      id="vote"
      aria-labelledby="trust-choice-title"
    >
      <h2 id="trust-choice-title" data-sr-reveal="title">
        Exact same product. Which one would you trust with your money?
      </h2>
      <div className="sr-rule" data-sr-reveal="fade" />
      <div className={`sr-trust-grid${locked ? " is-locked" : ""}`} key={slide}>
        {(["a", "b"] as const).map((side) => {
          const label = side.toUpperCase();
          const percentage = current[`${side}Percent`];
          const selected = choice === side;
          const tone = percentage >= 50 ? "positive" : "negative";
          return (
            <article
              className={`sr-trust-option ${selected ? "is-selected" : ""}`}
              key={side}
              data-sr-reveal="up"
              style={{ transitionDelay: side === "a" ? "0ms" : "90ms" }}
            >
              <span className="sr-trust-letter" aria-hidden="true">
                {label}
              </span>
              <button
                className={`sr-trust-visual ${selected ? `is-${tone}` : ""}`}
                type="button"
                aria-label={`Vote for ${label}`}
                aria-pressed={selected}
                disabled={locked}
                onClick={() => submitVote(side)}
              >
                <span className="sr-trust-screenshot">
                  <img
                    src={current[side]}
                    alt={`${current.project} hero section, option ${label}`}
                  />
                </span>
                {selected && (
                  <span
                    className={`sr-trust-result sr-trust-result--${tone}`}
                    key={`${slide}-${side}-${choice}`}
                  >
                    <strong>{percentage}%</strong>
                    <span className="sr-trust-result__copy">
                      of people chose this
                    </span>
                  </span>
                )}
              </button>
            </article>
          );
        })}
      </div>
      <div className="sr-trust-actions" data-sr-reveal="up">
        {(["a", "b"] as const).map((side) => (
          <button
            className="cta cta-secondary sr-trust-vote"
            type="button"
            disabled={locked}
            onClick={() => submitVote(side)}
            key={side}
          >
            <span className="cta-inner">
              <span className="cta-label">Vote for {side.toUpperCase()}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="sr-trust-pagination" data-sr-reveal="up">
        <div className="sr-trust-pagination__rule" />
        <div className="sr-pager">
          <button
            onClick={() => changeSlide(-1)}
            aria-label="Previous comparison"
            disabled={locked}
          >
            <ArrowLeftIcon />
          </button>
          <span>
            {slide + 1}/{comparisonRounds.length}
          </span>
          <button
            onClick={() => changeSlide(1)}
            aria-label="Next comparison"
            disabled={locked}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
      <TweetWall tweets={tweets} />
    </section>
  );
}

function Results() {
  return (
    <section className="sr-results" id="from-this" data-sr-reveal="section">
      <h2>From this → to this</h2>
      <p>
        Real redesigns, shown side by side so you can compare every detail.
      </p>
      <div className="sr-case-grid">
        {orderedRealizationProjects.map((project) => (
          <ResultCase project={project} key={project.id} />
        ))}
      </div>
    </section>
  );
}

function ResultCase({ project }: { project: RealizationProject }) {
  return (
    <article>
      <MarqueeCard
        item={project.slides[0].id}
        slides={project.slides}
        compact
      />
      <div className="sr-result-caption">
        <h3>{project.title}</h3>
        <p>{project.copy}</p>
      </div>
    </article>
  );
}

function Reviews() {
  const [open, setOpen] = useState(false);
  return (
    <section className="sr-reviews">
      <div className="sr-review-rating">
        <span aria-hidden="true">★★★★★</span> Rated 5/5 based on over 30 reviews
      </div>
      <h2>What they think of it</h2>
      <div className={`sr-review-grid ${open ? "sr-review-grid--open" : ""}`}>
        <VideoReviewCard
          RceipbT2y="https://framerusercontent.com/assets/edTM2GQjvjlTaWLPl9LWzwa6qw.mp4"
          style={{ height: 487 }}
        />
        {reviews.map(([name, role, quote], index) => (
          <article key={name} className={index > 1 ? "sr-review--extra" : ""}>
            <p>“{quote}”</p>
            <b>{name}</b>
            <span>{role}</span>
          </article>
        ))}
      </div>
      <button className="sr-more" onClick={() => setOpen((value) => !value)}>
        {open ? "Show less" : "Show more"}
      </button>
    </section>
  );
}

function FaqPlaceholder() {
  return (
    <section className="sr-faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Questions you probably have</h2>
      <p className="sr-faq-price">Projects typically start at $2,000</p>
      <div className="sr-faq-list">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="sr-faq-item" key={index}>
            <button
              type="button"
              disabled
              aria-label="FAQ question placeholder"
            >
              <span aria-hidden="true" />
              <PlusIcon />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProofReviews() {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="sr-reviews sr-proof-reviews"
      id="reviews"
      data-sr-reveal="section"
    >
      <div className="sr-review-rating">
        <RatingStars /> Rated 5/5 based on over 30 reviews
      </div>
      <h2>What they think of it</h2>
      <div className={`sr-review-grid ${open ? "sr-review-grid--open" : ""}`}>
        <VideoReviewCard
          RceipbT2y="https://framerusercontent.com/assets/edTM2GQjvjlTaWLPl9LWzwa6qw.mp4"
          style={{ height: 487 }}
        />
        {reviews.map(([name, role, quote, avatar], index) => (
          <HomepageReviewCard
            key={name}
            avatar={avatar}
            name={name}
            role={role}
            quote={quote}
            className={`sr-review-card ${index > 5 ? "sr-review--extra" : ""}`}
          />
        ))}
      </div>
      {!open && (
        <ExistingCta
          className="sr-more-cta"
          href="#reviews"
          kind="secondary"
          onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          Show more
        </ExistingCta>
      )}
    </section>
  );
}

function Faq() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="sr-faq sr-live-faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Questions you probably have</h2>
      <p className="sr-faq-price">Projects typically start at $2,000</p>
      <div className="sr-faq-list">
        {saasFaqs.map(({ question, answer }, index) => {
          const open = active === index;
          return (
            <article
              className={`sr-faq-item ${open ? "is-open" : ""}`}
              key={question}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setActive(open ? null : index)}
              >
                <span>{question}</span>
                <PlusIcon />
              </button>
              <div className="sr-faq-answer" aria-hidden={!open}>
                <p>{answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function SaasRedesignLanding({
  managedTweets = defaultTweets,
}: {
  managedTweets?: ReadonlyArray<SaasTweet>;
}) {
  useSaasScrollReveal();

  return (
    <main className="sr">
      <SaasAnalyticsTracker />
      <section className="sr-hero" id="top">
        <div className="sr-eyebrow sr-intro sr-intro--eyebrow">
          <SparklesIcon /> FOR SAAS OWNERS
        </div>
        <h1 className="sr-intro sr-intro--title">
          Stop selling a real product with an
          <br className="sr-title-break" /> AI-generated landing page.
        </h1>
        <p className="sr-intro sr-intro--copy">
          Custom-designed, conversion-focused website. We redesign SaaS websites
          to match the product you’ve built, delivered in 10 days not months.
        </p>
        <div className="sr-hero-ctas sr-intro sr-intro--actions">
          <ExistingCta
            href="#from-this"
            kind="secondary"
            className="sr-see-examples"
          >
            See examples
          </ExistingCta>
          <Cta />
        </div>
      </section>
      <Marquee
        projects={realizationProjects}
        className="sr-intro sr-intro--ticker"
      />
      <section className="sr-problems" id="problems" data-sr-reveal="section">
        <div className="sr-problems-heading">
          <h2>
            You built something real.
            <br />
            But your site doesn’t show it…
          </h2>
          <p>
            You shipped a product people actually pay for. But your landing page
            gives the impression that your product was made in one prompt. And
            you lose your customers’ trust in your product.
          </p>
        </div>
        <div className="sr-rule" />
        <div className="sr-problem-grid">
          {issues.map(([title, copy], index) => {
            const ProblemIcon = problemIcons[index];
            return (
              <article key={title}>
                <div className="sr-problem-title">
                  <span className="sr-problem-icon">
                    <ProblemIcon />
                  </span>
                  <h3>{title}</h3>
                </div>
                <div className="sr-card-rule" />
                <p>{copy}</p>
              </article>
            );
          })}
        </div>
      </section>
      <TrustChoice tweets={managedTweets.length ? managedTweets : defaultTweets} />
      <section className="sr-solution" id="solution" data-sr-reveal="section">
        <img
          className="sr-solution-shape sr-solution-shape--left"
          src="/landing-assets/figma-originals/2005-6398.svg"
          alt=""
          aria-hidden="true"
        />
        <img
          className="sr-solution-shape sr-solution-shape--right"
          src="/landing-assets/figma-originals/2005-6399.svg"
          alt=""
          aria-hidden="true"
        />
        <h2>Make your site look like it belongs to a real company.</h2>
        <p>
          You’ve already done the hard part: building the product, getting users
          and proving people are willing to pay for it.
          <br />
          <br />
          Now your website needs to catch up.
        </p>
        <div className="sr-solution-grid">
          {solutionCards.map(([image, title, copy]) => (
            <article className="sr-solution-card" key={title}>
              <div className="sr-solution-illustration">
                <img
                  src={`/landing-assets/solution-figma/${image}.png`}
                  alt=""
                  aria-hidden="true"
                />
              </div>
              <div className="sr-solution-card__copy">
                <h3>{title}</h3>
                <div className="sr-solution-card__rule" aria-hidden="true" />
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Results />
      <ConversionMetricsSection />
      <ProofReviews />
      <div
        className="sr-reviews-book-divider"
        aria-hidden="true"
        data-sr-reveal="fade"
      />
      <section className="sr-book" id="book" data-sr-reveal="section">
        <Availability english />
        <h2>Get a conversion-focused SaaS site in 10 days.</h2>
        <p>Projects typically start at $2,000</p>
        <div className="sr-calendar">
          <CallBooking locale="en" />
        </div>
        <div className="sr-guarantee">
          <h3>100% risk-free satisfaction guarantee</h3>
          <p>
            We’re committed to your success. If you’re not completely thrilled
            with your logo, we’ll keep working until you are, or provide a
            refund.
          </p>
        </div>
      </section>
      <StackSection3
        id="faq"
        className="sr-final-faq"
        locale="en"
        faqs={saasFaqs}
        ctaHref="#book"
        showDescription={false}
        showCta={false}
      />
    </main>
  );
}
