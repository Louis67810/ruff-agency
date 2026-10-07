"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  ShoppingCartIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import Script from "next/script";
import { createPortal } from "react-dom";
import { VideoReviewCard } from "@/components/sections/SectionAvis/SectionAvis";
import { HomepageReviewCard } from "@/components/sections/SectionAvis/HomepageReviewCard";
import { StackSection3 } from "@/components/sections/StackSection3/StackSection3";
import ExistingCta from "@/components/ui/Cta";
import { projects as portfolioProjects } from "@/lib/data/projects";
import { ConversionMetricsSection } from "./conversion-metrics-section";
import SaasRedesignPricing from "./SaasRedesignPricing";
import { trackSaasEvent } from "./saas-analytics-tracker";
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
type BeforeAfterSlide = {
  id: string;
  title: string;
  copy: string;
  before: string;
  after: string;
  objectPosition?: string;
};
const beforeAfterSlides: BeforeAfterSlide[] = [
  ...(customContent.realizations.length
    ? customContent.realizations
    : defaultBeforeAfterSlides),
];
type RealizationProject = {
  id: string;
  title: string;
  copy: string;
  slides: BeforeAfterSlide[];
  branding?: boolean;
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
  hexora: {
    title: "Hexora",
    copy: "We redesigned Hexora's website to make database building feel visual, powerful, and accessible.",
  },
  zentra: {
    title: "Zentra",
    copy: "A compliance landing page bringing deadlines, documents, risk detection and audit-ready reporting into one dashboard.",
  },
  solara: {
    title: "Solara",
    copy: "We redesigned Solara's website to make advanced trading feel precise, fast and easy to navigate.",
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
const featuredProjectIds = ["hexora", "zentra", "solara"] as const;
const resultsProjectPriority = [...featuredProjectIds, "spreak", "rentala"];
const orderedRealizationProjects = [...realizationProjects].sort(
  (projectA, projectB) => {
    const rank = (projectId: string) => {
      const index = resultsProjectPriority.indexOf(projectId);
      return index === -1 ? resultsProjectPriority.length : index;
    };
    return rank(projectA.id) - rank(projectB.id);
  },
);
const brandingSlides = (
  projectId: string,
  title: string,
  copy: string,
  before: string,
  afterImages: readonly string[],
): BeforeAfterSlide[] => afterImages.map((after, index) => ({
  id: `${projectId}-brand-${index + 1}`,
  title,
  copy,
  before,
  after,
}));

const brandingProjects: RealizationProject[] = [
  {
    id: "synthara-branding",
    title: "Synthara",
    copy: "An AI assistant identity built to feel intelligent, focused and ready for what comes next.",
    branding: true,
    slides: brandingSlides(
      "synthara",
      "Synthara — AI assistant identity",
      "A distinctive red-and-charcoal identity for an AI assistant designed to help people think faster, stay organised and execute with confidence.",
      "/landing-assets/saas-redesign/branding/synthara.png",
      [1, 2, 3, 4, 5, 6].map((index) => `/landing-assets/saas-redesign/branding/synthara-${String(index).padStart(2, "0")}.png`),
    ),
  },
  {
    id: "zentra-branding",
    title: "Zentra",
    copy: "A calm, warm identity for a wellbeing product focused on rest, balance and everyday progress.",
    branding: true,
    slides: brandingSlides(
      "zentra",
      "Zentra — wellbeing identity",
      "A warm gold-and-earth palette and a simple emblem give Zentra’s focus and wellbeing tools a calmer, more human feel.",
      "/landing-assets/saas-redesign/branding/zentra.png",
      [1, 2, 3, 4, 5, 6, 7, 8].map((index) => `/landing-assets/saas-redesign/branding/zentra-${String(index).padStart(2, "0")}.png`),
    ),
  },
  {
    id: "kuantro-branding",
    title: "Kuantro",
    copy: "A crisp blue identity that turns complex information into a clearer, more confident experience.",
    branding: true,
    slides: brandingSlides(
      "kuantro",
      "Kuantro — data clarity identity",
      "The blue-and-cyan mark, restrained palette and interface concepts make Kuantro’s promise of data clarity and progress immediately visible.",
      "/landing-assets/saas-redesign/branding/kuantro.png",
      [1, 2, 3, 4, 5].map((index) => `/landing-assets/saas-redesign/branding/kuantro-${String(index).padStart(2, "0")}.png`),
    ),
  },
  {
    id: "naptivera-branding",
    title: "Naptivera",
    copy: "A warm, reassuring identity for technology that helps people rest better and wake to brighter days.",
    branding: true,
    slides: brandingSlides(
      "naptivera",
      "Naptivera — sleep and wellbeing identity",
      "A sunrise orange, soft neutrals and a connected N symbol give Naptivera’s sleep experience a reassuring, human point of view.",
      "/landing-assets/saas-redesign/branding/naptivera.png",
      [1, 2, 3, 4, 5].map((index) => `/landing-assets/saas-redesign/branding/naptivera-${String(index).padStart(2, "0")}.png`),
    ),
  },
];
type RealizationCategory = "website" | "branding";
const realizationCategories: readonly RealizationCategory[] = ["website", "branding"];
const projectsByCategory: Record<RealizationCategory, RealizationProject[]> = {
  website: orderedRealizationProjects,
  branding: brandingProjects,
};

type ProjectCaseStudy = {
  title: string;
  intro: string;
  challenge: string;
  solution: string;
  results: [string, string, string];
};

const projectCaseStudies: Record<string, ProjectCaseStudy> = {
  hexora: {
    title: "A clearer way to build with data",
    intro: "Making Hexora’s visual database builder easier to understand at first glance.",
    challenge: "The product’s flexibility was hard to grasp from a generic first impression. Visitors needed to see what they could build, how the pieces fit together, and why Hexora was different.",
    solution: "We gave the product story a clear visual direction, brought the database-building experience forward, and organised the page around the questions a prospective user needs answered before trying the platform.",
    results: ["Explain the product faster", "Make the interface feel approachable", "Guide more qualified visitors to try Hexora"],
  },
  zentra: {
    title: "Making compliance feel manageable",
    intro: "Turning a complex compliance workflow into a clear, reassuring product story.",
    challenge: "Deadlines, documents, risk detection and reporting are difficult to evaluate when they are scattered across a dense page. Visitors need confidence that every step is covered.",
    solution: "We structured Zentra around the compliance workflow, made its key tools easy to scan, and gave important proof and next steps a more visible place.",
    results: ["Clarify the end-to-end workflow", "Build confidence in the platform", "Make the next step easier to find"],
  },
  solara: {
    title: "A sharper view of the markets",
    intro: "Presenting Solara’s trading tools with the focus and precision its audience expects.",
    challenge: "Advanced trading products can overwhelm visitors with data and features before they understand the value. The previous experience needed a stronger hierarchy and a more confident first impression.",
    solution: "We brought the trading workspace and market insights into a more coherent narrative, pairing product detail with a calmer interface and clear paths through the offer.",
    results: ["Make complex tools easier to scan", "Show the value of the workspace sooner", "Support confident product evaluation"],
  },
  zorgniotti: {
    title: "A digital presence that reflects expertise",
    intro: "Giving Zorgniotti’s established accounting firm a polished, clear five-page experience.",
    challenge: "The firm’s expertise and people were not easy to discover in the old experience. Prospective clients needed a clearer sense of the team, services and best way to get in touch.",
    solution: "We redesigned the core pages around the firm’s expertise, brought its team and client proof into a clearer hierarchy, and simplified contact and FAQ content.",
    results: ["Make expertise easier to recognise", "Help visitors find relevant services", "Create a clearer route to an enquiry"],
  },
  spreak: {
    title: "Turning customer intelligence into action",
    intro: "Making Spreak’s customer intelligence platform easier to understand and explore.",
    challenge: "A broad platform can feel like a collection of features when the story is not ordered around a customer’s goals. Visitors needed to connect the problem, solution, modules and pricing.",
    solution: "We built a complete eight-section narrative from the homepage through pricing, giving the product’s benefits and modules a consistent visual system and a more direct flow.",
    results: ["Connect features to customer needs", "Make the offer easier to compare", "Give sales conversations a clearer starting point"],
  },
  artan: {
    title: "A stronger platform for creator growth",
    intro: "Helping Artan show its offer, creators and work in one distinctive experience.",
    challenge: "The value of a creator-focused studio can get lost when its work, process and offer live in separate visual stories. New visitors need to see both the quality of the work and how to get started.",
    solution: "We shaped the site around Artan’s work and audience, then clarified its benefits, process, pricing and comparisons so each page supports the next decision.",
    results: ["Let the portfolio demonstrate quality", "Make the offer easier to understand", "Create a more direct path from interest to click"],
  },
  rentala: {
    title: "A simpler way to manage rentals",
    intro: "Making Rentala’s rental management offer feel clear, modern and practical.",
    challenge: "Landlords compare many tools while juggling day-to-day work. A feature-heavy presentation can hide how the product saves time and which plan fits a portfolio.",
    solution: "We organised the story around the landlord’s workload, clarified the product journey and pricing, and placed proof and calls to action where visitors need reassurance.",
    results: ["Show how the product fits daily work", "Help visitors compare plans with confidence", "Make a qualified next step more obvious"],
  },
  keyframe: {
    title: "A motion studio with a clearer offer",
    intro: "Presenting Keyframe’s video formats and production process with stronger visual hierarchy.",
    challenge: "When a studio offers several video formats and production stages, prospects can struggle to compare what is included and how a project moves from brief to delivery.",
    solution: "We gave the work a more focused showcase, explained the formats and production steps in sequence, and made pricing and booking easier to navigate.",
    results: ["Help visitors find the right video format", "Set expectations for the production process", "Make booking a strategy call feel straightforward"],
  },
  zagula: {
    title: "A more personal accounting website",
    intro: "Making Julie Zagula’s expertise and client experience easier to discover.",
    challenge: "An independent accounting firm depends on trust, but dense pages and hard-to-find answers can make it difficult for a prospective client to understand the firm’s approach.",
    solution: "We built a five-section experience that introduces the firm clearly, presents its advantages and client proof with more structure, and makes contact and FAQs easier to navigate.",
    results: ["Bring the firm’s expertise forward", "Answer common questions earlier", "Make a first conversation easier to start"],
  },
  scall: {
    title: "A distinctive portfolio for an art director",
    intro: "Giving Scall’s work and point of view a more visual, memorable home.",
    challenge: "A portfolio has to make the work easy to browse while still telling visitors who is behind it. If project proof and personal positioning compete, neither gets enough attention.",
    solution: "We created a six-section structure that leads with selected work, then gives clients, approach, case studies and reviews a more deliberate place in the story.",
    results: ["Make selected work easier to explore", "Connect projects to the art director’s point of view", "Give prospective clients a clearer way to make contact"],
  },
  "synthara-branding": {
    title: "An AI identity built for forward momentum",
    intro: "Giving Synthara’s AI assistant a distinctive identity that feels capable and approachable.",
    challenge: "AI can feel abstract or intimidating. Synthara needed a visual identity that signals intelligence and ambition while keeping the product human and easy to approach.",
    solution: "We paired a bold, energetic mark with a dark charcoal and red palette, then carried the identity across the app icon, product interface and brand touchpoints.",
    results: ["Make the AI assistant easier to recognise", "Balance advanced technology with a human feel", "Carry one clear identity across product and marketing"],
  },
  "zentra-branding": {
    title: "A calmer way forward",
    intro: "Building a warm, reassuring identity for Zentra’s rest and wellbeing tools.",
    challenge: "Wellbeing products need to feel supportive rather than demanding. The identity had to make focus, balance and daily progress feel calm and welcoming.",
    solution: "We created a soft gold and earth-toned visual system with a simple, memorable mark, then applied it to the app and its everyday wellbeing experiences.",
    results: ["Communicate calm and balance at first glance", "Make the product feel approachable and human", "Create a consistent identity across app and brand materials"],
  },
  "kuantro-branding": {
    title: "Turning complexity into clarity",
    intro: "Giving Kuantro’s data platform a clear visual language for confident decisions.",
    challenge: "Complex information can slow teams down when it is difficult to interpret. Kuantro needed a visual identity that made clarity, progress and analytical confidence tangible.",
    solution: "We built a precise blue-and-cyan identity around a geometric K mark and extended it into the product interface, app icon and supporting brand elements.",
    results: ["Make a data-focused product easier to recognise", "Express clarity and progress through a consistent system", "Bring the identity into the product experience"],
  },
  "naptivera-branding": {
    title: "A brighter tomorrow starts with better rest",
    intro: "Creating a warm identity for Naptivera’s sleep and wellbeing experience.",
    challenge: "Sleep technology can feel clinical. Naptivera needed to make better rest feel personal, comforting and connected to brighter days.",
    solution: "We shaped an expressive orange symbol and a warm palette, then applied the identity to the app, sleep tools and supporting brand touchpoints.",
    results: ["Make the sleep experience feel warm and reassuring", "Build recognition around a simple, distinctive mark", "Keep the brand consistent across product and everyday use"],
  },
};
const solutionCards = [
  [
      "/landing-assets/saas-redesign/benefits/2486-1088.png",
    "Stand out from every other SaaS",
    "A distinct visual direction built around your product, not another recycled AI website.",
  ],
  [
      "/landing-assets/saas-redesign/benefits/2419-1387.png?v=3",
    "Turn more traffic into customers",
    "Send more paid traffic to a website built to support growth, not just validate an MVP.",
  ],
  [
      "/landing-assets/saas-redesign/benefits/2419-1366.png",
    "Build a brand people remember",
    "Create a recognizable identity instead of being another tab they forget five minutes later.",
  ],
  [
      "/landing-assets/saas-redesign/benefits/2419-1436.png?v=4",
    "Stop rebuilding it yourself",
    "No more weekends testing prompts, templates and endless variations that still feel ‘almost right.’",
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
    "Founder of Keyframe",
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
const featuredReview = reviews.find(([, , quote]) => {
  const firstSentence = quote.split(/(?<=\.)\s+/)[0] ?? "";
  return quote.includes(". ") && firstSentence.length >= 30 && firstSentence.length <= 45;
}) ?? reviews.find(([, , quote]) => quote.includes(". ")) ?? reviews[0];
const reviewAuthorByProjectId: Record<string, string> = {
  zorgniotti: "Dominique Zenglein",
  spreak: "Sacha Tassart",
  artan: "Artan",
  rentala: "Martin Riedweg",
  keyframe: "Antoine Troovy",
  zagula: "Julie Zagula",
};
const portfolioSlugByProjectId: Record<string, string> = {
  keyframe: "keyframe-agency",
  zagula: "clovarex",
};
const issues = [
  [
    "Your product disappears into the crowd.",
    "Your website looks like hundreds of other SaaS products, making it difficult for people to recognize or remember you.",
  ],
  [
    "Poor design lowers perceived quality.",
    "If your website feels generic or cheap, prospects naturally assume the product behind it is too.",
  ],
  [
    "You lose credibility and pricing power.",
    "When your brand doesn’t feel premium, charging premium prices becomes much harder.",
  ],
  [
    "You’re wasting qualified traffic",
    "You’re still sending prospects to the website you built to validate your idea, not one designed to turn them into customers.",
  ],
] as const;
const problemResults = [
  ["Lower conversion rates.", ArrowTrendingDownIcon],
  ["Lower perceived value.", StarIcon],
  ["Fewer sales.", ShoppingCartIcon],
] as const;
const problemIcons = [
  ArrowTrendingUpIcon,
  DocumentDuplicateIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
] as const;
const comparisonProjects: ReadonlyArray<{
  project: string;
  before: string;
  after: string;
  objectPosition?: string;
  afterSide: "a" | "b";
  afterPercent: number;
  illustrative?: boolean;
}> = [
  ...featuredProjectIds.map((id, index) => {
    const project = realizationProjects.find((item) => item.id === id)!;
    return {
      project: project.title,
      before: project.slides[0].before,
      after: project.slides[0].after,
      objectPosition: project.slides[0].objectPosition,
      afterSide: (index % 2 === 0 ? "a" : "b") as "a" | "b",
      afterPercent: id === "hexora" ? 96 : id === "zentra" ? 95 : 92,
      illustrative: true,
    };
  }),
  {
    project: "Zorgniotti",
    before: "/landing-assets/zorgniotti/after-home.png",
    after: "/landing-assets/zorgniotti/before-home.png",
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
];

const comparisonRounds = comparisonProjects.map((comparison) => ({
  project: comparison.project,
  a: comparison.afterSide === "a" ? comparison.after : comparison.before,
  b: comparison.afterSide === "b" ? comparison.after : comparison.before,
  objectPosition: comparison.objectPosition,
  illustrative: comparison.illustrative ?? false,
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
    <ExistingCta kind="primary" href="/en/saas-redesign/brief" label="Book a Call">
      Book a Call
    </ExistingCta>
  );
}

function MarqueeCard({
  item,
  slides = beforeAfterSlides,
  compact = false,
  initialPosition = 50,
  onSlideChange,
  branding = false,
}: {
  item: string;
  slides?: ReadonlyArray<BeforeAfterSlide>;
  compact?: boolean;
  initialPosition?: number;
  onSlideChange?: (slide: BeforeAfterSlide) => void;
  branding?: boolean;
}) {
  const slideSet = slides.length ? slides : beforeAfterSlides;
  const [position, setPosition] = useState(initialPosition);
  const [activeSlide, setActiveSlide] = useState(() => {
    const slideIndex = slideSet.findIndex((slide) => slide.id === item);
    return slideIndex >= 0 ? slideIndex : 0;
  });
  const slide = slideSet[activeSlide];

  useEffect(() => setPosition(initialPosition), [activeSlide, initialPosition]);
  const updatePositionFromPointer = (
    event: ReactPointerEvent<HTMLInputElement>,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextPosition = ((event.clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, nextPosition)));
  };

  return (
    <article
      className={`sr-marquee-card${compact ? " sr-marquee-card--compact" : ""}${branding ? " sr-marquee-card--branding" : ""}`}
      aria-label={branding ? "Brand identity project" : "Website redesign example"}
    >
      <div className="sr-marquee-card__image" data-example={item}>
        <img
          className="sr-marquee-card__after"
          src={slide.after}
          alt={branding ? slide.title : `${slide.title} after redesign`}
          style={{ objectPosition: slide.objectPosition ?? "center" }}
          key={`after-${slide.id}`}
        />
        <div
          className="sr-marquee-card__before-mask"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            className="sr-marquee-card__before"
            src={slide.before}
            alt={`${slide.title} before redesign`}
            style={{ objectPosition: slide.objectPosition ?? "center" }}
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
      {slideSet.length > 1 ? <div className="sr-before-after-dots" aria-label={branding ? "Choose a brand image" : "Choose a redesign"}>
        {slideSet.map((candidate, index) => (
          <button
            type="button"
            key={candidate.id}
            className={index === activeSlide ? "is-active" : ""}
            aria-label={`Show ${branding ? "brand image" : "redesign"} ${index + 1}`}
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
      </div> : null}
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
      onMouseEnter={() => tweenPlaybackRate(0)}
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
        Only tweets from the last 24 hours showing that AI-generated websites
        hurt conversions and discourage people from buying.
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
        <strong>Only tweets from the last 24 hours</strong> showing that
        AI-generated websites hurt conversions and discourage people from
        buying.
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
          const tone = current.afterSide === side ? "positive" : "negative";
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
                    style={{ objectPosition: current.objectPosition ?? "center" }}
                  />
                </span>
                {selected && (
                  <span
                    className={`sr-trust-result sr-trust-result--${tone}`}
                    key={`${slide}-${side}-${choice}`}
                  >
                    <strong>
                      {percentage}%
                    </strong>
                    <span className="sr-trust-result__copy">
                      {current.illustrative
                        ? "illustrative split"
                        : "of people chose this"}
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
  const [activeCategory, setActiveCategory] = useState<RealizationCategory>("website");
  const [openProject, setOpenProject] = useState<RealizationProject | null>(null);

  return (
    <section className="sr-results" id="from-this" data-sr-reveal="section">
      <h2>From this → to this</h2>
      <p>
        Real redesigns, shown side by side so you can compare every detail.
      </p>
      <div className="sr-results-divider" aria-hidden="true" />
      <div className="sr-results-filters" role="group" aria-label="Project category">
        {realizationCategories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            className={activeCategory === category ? "is-active" : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category === "website" ? "Website" : "Branding"}
          </button>
        ))}
      </div>
      <div className="sr-case-grid">
        {projectsByCategory[activeCategory].map((project) => (
          <ResultCase
            project={project}
            onOpen={() => setOpenProject(project)}
            key={`${activeCategory}-${project.id}`}
          />
        ))}
      </div>
      {openProject ? (
        <ProjectDetailOverlay
          project={openProject}
          onClose={() => setOpenProject(null)}
        />
      ) : null}
    </section>
  );
}

function ResultCase({
  project,
  onOpen,
}: {
  project: RealizationProject;
  onOpen: () => void;
}) {
  const [activeSlide, setActiveSlide] = useState(project.slides[0]);
  const isFeatured = featuredProjectIds.some((id) => id === project.id);

  return (
    <article>
      <MarqueeCard
        item={project.slides[0].id}
        slides={project.slides}
        compact
        onSlideChange={setActiveSlide}
        branding={project.branding}
      />
      <div className="sr-result-caption">
        <h3>{project.title}</h3>
        <p>
          {isFeatured && activeSlide.id !== project.slides[0].id
            ? activeSlide.copy
            : project.copy}
        </p>
        <button className="sr-see-details" type="button" onClick={onOpen}>
          See In Details
        </button>
      </div>
    </article>
  );
}

function ProjectCarousel({
  project,
  initialPosition,
  label,
}: {
  project: RealizationProject;
  initialPosition: number;
  label: string;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slides = project.slides;
  const displaySlides = slides.length > 1
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : slides;
  const scrollToSlide = (index: number, behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    const card = viewport?.querySelector<HTMLElement>(`[data-gallery-index="${index}"]`);
    if (!viewport || !card) return;
    viewport.scrollTo({
      left: card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2,
      behavior,
    });
  };
  useEffect(() => {
    scrollToSlide(slides.length > 1 ? 1 : 0, "instant");
    return () => {
      if (scrollResetRef.current) clearTimeout(scrollResetRef.current);
    };
  }, [project.id, slides.length]);
  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport || slides.length <= 1) return;
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>(".sr-project-gallery__slide"));
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    const nearest = cards.reduce(
      (best, card, index) => {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 1, distance: Number.POSITIVE_INFINITY },
    ).index;
    setActiveSlide((nearest - 1 + slides.length) % slides.length);
    if (scrollResetRef.current) clearTimeout(scrollResetRef.current);
    if (nearest === 0 || nearest === cards.length - 1) {
      scrollResetRef.current = setTimeout(
        () => scrollToSlide(nearest === 0 ? slides.length : 1, "instant"),
        150,
      );
    }
  };
  const changeSlide = (direction: number) => {
    const next = (activeSlide + direction + slides.length) % slides.length;
    const target = activeSlide + direction + 1;
    scrollToSlide(target);
    setActiveSlide(next);
    if (target === 0 || target === slides.length + 1) {
      window.setTimeout(() => scrollToSlide(next + 1, "instant"), 460);
    }
  };

  return (
    <div className="sr-project-gallery" aria-label={`${label} image carousel`}>
      <div className="sr-project-gallery__viewport" ref={viewportRef} onScroll={handleScroll}>
        <div className="sr-project-gallery__track">
          {displaySlides.map((slide, index) => (
            <div
              className="sr-project-gallery__slide"
              data-gallery-index={index}
              key={`${project.id}-${label}-${slide.id}-${index}`}
            >
              <MarqueeCard
                item={slide.id}
                slides={[slide]}
                compact
                initialPosition={initialPosition}
                branding={project.branding}
              />
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 ? (
        <div className="sr-project-gallery__controls" aria-label="Carousel controls">
          <button
            type="button"
            aria-label="Previous page image"
            onClick={() => changeSlide(-1)}
          >
            <ChevronLeftIcon aria-hidden="true" />
          </button>
          <span aria-live="polite">
            {activeSlide + 1}/{slides.length}
          </span>
          <button
            type="button"
            aria-label="Next page image"
            onClick={() => changeSlide(1)}
          >
            <ChevronRightIcon aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ProjectDetailOverlay({
  project,
  onClose,
}: {
  project: RealizationProject;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const study = projectCaseStudies[project.id];
  const reviewAuthor = reviewAuthorByProjectId[project.id];
  const review = reviewAuthor
    ? reviews.find(([name]) => name === reviewAuthor)
    : undefined;
  const portfolioSlug = portfolioSlugByProjectId[project.id] ?? project.id;
  const portfolioProject = portfolioProjects.find(({ slug }) => slug === portfolioSlug);
  const logoSrc = portfolioProject?.logo?.src;
  const clientAvatar = review?.[3];
  const challengeSentences = (study?.challenge.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [project.copy]).map((point) => point.trim());
  const solutionSentences = (study?.solution.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [project.copy]).map((point) => point.trim());
  const challengePoints = project.branding
    ? challengeSentences.slice(0, 5)
    : [...challengeSentences, "The strongest value was not clear at first glance.", "Visitors needed a more confident reason to keep exploring.", "The next step was too easy to miss."].slice(0, 5);
  const solutionPoints = project.branding
    ? solutionSentences.slice(0, 5)
    : [...solutionSentences, ...(study?.results ?? []), project.copy].slice(0, 5);
  const resultPoints = project.branding
    ? (study?.results ?? []).slice(0, 5)
    : [...(study?.results ?? []), `A clearer first impression for ${project.title}`, "A more direct path from interest to action"].slice(0, 5);
  const closeLabel = `Close ${project.title} project details`;

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      previousFocusRef.current?.focus();
    };
  }, []);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      className="sr-project-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        className="sr-project-overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`sr-project-title-${project.id}`}
        onKeyDown={handleKeyDown}
      >
        <header className="sr-project-overlay__header">
          <div className="sr-project-overlay__project-name">{project.title}</div>
          <button
            ref={closeButtonRef}
            className="sr-project-overlay__close"
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <span>Close</span><XMarkIcon aria-hidden="true" />
          </button>
        </header>

        <div className="sr-project-overlay__body">
          <div className="sr-project-overlay__ornaments" aria-hidden="true">
            <div className="sr-project-overlay__shape-left">
              <div><img src="/landing-assets/saas-redesign/case-study/project-shape-left.svg" alt="" /></div>
            </div>
            <div className="sr-project-overlay__shape-right">
              <div><img src="/landing-assets/saas-redesign/case-study/project-shape-right.svg" alt="" /></div>
            </div>
          </div>
          <section className="sr-project-intro">
            {review ? (
              <div className="sr-project-client-badge">
                <span>Client review</span>
                {clientAvatar ? <img src={clientAvatar} alt="" /> : null}
                <span className="sr-project-client-badge__divider" aria-hidden="true" />
                <span>{review[0]}</span>
                <span className="sr-project-client-badge__stars" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon key={index} />
                  ))}
                </span>
              </div>
            ) : (
              <div className="sr-project-client-badge" data-kind="average" aria-label="Average client rating: 5 out of 5, based on over 30 reviews">
                <span>Rated 5/5 based on over 30 reviews</span>
                <span className="sr-project-client-badge__stars" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon key={index} />
                  ))}
                </span>
              </div>
            )}
            <h2 id={`sr-project-title-${project.id}`}>{study?.title ?? project.title}</h2>
            <p className="sr-project-intro__copy">{study?.intro ?? project.copy}</p>
            <div className={`sr-project-intro__visual${project.branding ? " sr-project-intro__visual--branding" : ""}`}>
              {project.branding ? (
                <ProjectCarousel project={project} initialPosition={50} label="Before and after" />
              ) : (
                <MarqueeCard
                  item={project.slides[0].id}
                  slides={[project.slides[0]]}
                  compact
                  initialPosition={50}
                />
              )}
            </div>
            <ExistingCta kind="primary" href="/en/saas-redesign/brief" label="Book a Call">Send us your SaaS</ExistingCta>
          </section>

          {review ? <FeaturedSocialProof review={review} logoSrc={logoSrc} logoName={portfolioProject?.title} /> : null}

          <div className="sr-project-story">
            <ProjectArgumentList title="The Challenge" subtitle={study?.intro ?? project.copy} points={challengePoints} id={`sr-project-challenge-${project.id}`} tone="challenge" />
            <ProjectCarousel
              project={project}
              initialPosition={project.branding ? 50 : 100}
              label={project.branding ? "Before and after" : "Before"}
            />
            <ProjectArgumentList title="The Solution" subtitle={study?.title ?? project.title} points={solutionPoints} id={`sr-project-solution-${project.id}`} tone="solution" />
            <ProjectCarousel project={project} initialPosition={50} label="Before and after" />
            <ProjectArgumentList title="The Result" subtitle={study?.intro ?? project.copy} points={resultPoints} id={`sr-project-results-${project.id}`} tone="results" />
            <ProjectCarousel
              project={project}
              initialPosition={project.branding ? 50 : 0}
              label={project.branding ? "Before and after" : "After"}
            />
          </div>

        </div>
      </article>
    </div>,
    document.body,
  );
}

function ProjectArgumentList({ title, subtitle, points, id, tone }: { title: string; subtitle: string; points: string[]; id: string; tone: "challenge" | "solution" | "results" }) {
  return (
    <section className="sr-project-arguments" data-tone={tone} aria-labelledby={id}>
      <div className="sr-project-arguments__heading">
        <h3 id={id}>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <ul>
        {points.map((point, index) => (
          <li key={`${id}-${index}`}>
            <div className="sr-project-arguments__line-content">
              <span className="sr-project-arguments__icon" aria-hidden="true"><ExclamationTriangleIcon /></span>
              <span>{point}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeaturedSocialProof({ review, logoSrc, logoName }: { review?: (typeof reviews)[number]; logoSrc?: string; logoName?: string }) {
  if (!review) return null;

  const [name, role, quote, avatar] = review;
  const [headline, ...bodyParts] = quote.split(/(?<=\.)\s+/);
  const body = bodyParts.join(" ");

  return (
    <section className="sr-featured-review" aria-label="Client review" data-has-logo={logoSrc ? "true" : "false"}>
      <div className="sr-featured-review__content">
        <div className="sr-featured-review__main">
          {logoSrc ? <img className="sr-featured-review__logo-slot" src={logoSrc} alt={`${logoName ?? "Client"} logo`} /> : null}
          <div className="sr-featured-review__quote">
            <h2>{headline}</h2>
            <div className="sr-featured-review__divider" aria-hidden="true" />
            {body ? <p>{body}</p> : null}
          </div>
        </div>
        <div className="sr-featured-review__author">
          <span className="sr-featured-review__avatar" aria-hidden="true">{avatar ? <img src={avatar} alt="" /> : null}</span>
          <div>
            <strong>{name}</strong>
            <p>{role}</p>
          </div>
        </div>
      </div>
    </section>
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
  const [reviewStep, setReviewStep] = useState(0);

  return (
    <section
      className="sr-reviews sr-proof-reviews"
      id="reviews"
      data-sr-reveal="section"
      data-review-step={reviewStep}
    >
      <div className="sr-review-rating">
        <RatingStars /> Rated 5/5 based on over 30 reviews
      </div>
      <h2>What they think of it</h2>
      <div
        className={`sr-review-grid ${reviewStep > 0 ? "sr-review-grid--open" : ""} sr-review-grid--step-${reviewStep}`}
      >
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
            className={`sr-review-card sr-review-card--${index} ${index > 6 ? "sr-review--extra" : ""}`}
          />
        ))}
      </div>
      {reviewStep < 2 && (
        <ExistingCta
          className="sr-more-cta"
          href="#reviews"
          kind="secondary"
          onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            setReviewStep((currentStep) => Math.min(currentStep + 1, 2));
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
          to match the product you’ve built, delivered in 10 days, not months.
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
        projects={orderedRealizationProjects}
        className="sr-intro sr-intro--ticker"
      />
      <section className="sr-problems" id="problems" data-sr-reveal="section">
        <div className="sr-problems-heading">
          <h2>
            AI is good at a lot of things.
            <br />
            And that’s exactly the problem.
          </h2>
          <p>
            You’ve delegated the one thing AI still can’t do well: have taste.
            When your SaaS looks like everything else, you lose trust,
            memorability, and perceived value. Here's what that looks like:
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
        <div className="sr-problem-result-rule" />
        <div className="sr-problem-results">
          <h3>The result?</h3>
          <div className="sr-problem-result-list">
            {problemResults.map(([label, ResultIcon]) => (
              <div className="sr-problem-result-item" key={label}>
                <span className="sr-problem-result-icon" aria-hidden="true">
                  <ResultIcon />
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <TrustChoice tweets={managedTweets.length ? managedTweets : defaultTweets} />
      <section className="sr-solution" id="solution" data-sr-reveal="section">
        <div className="sr-solution-ticker" aria-label="Introducing Ruff Agency">
          <div className="sr-solution-ticker__track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <div className="sr-solution-ticker__set" key={copy}>
                {Array.from({ length: 14 }, (_, index) => (
                  <span className="sr-solution-ticker__tag" key={index}>INTRODUCING</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <img
          className="sr-solution-shape sr-solution-shape--left"
          src="/landing-assets/saas-redesign/benefits/2419-919.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="sr-solution-shape sr-solution-shape--right"
          src="/landing-assets/saas-redesign/benefits/2419-920.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="sr-solution-logo"
          src="/landing-assets/saas-redesign/benefits/2431-937.png"
          width="164"
          height="48"
          alt="Ruff Agency"
        />
        <h2>Make your site looks like it belongs to a real company</h2>
        <p className="sr-solution-intro">
          You’ve already done the hard part: building the product, getting users
          <strong> and proving people are willing to pay for it.</strong>
        </p>
        <div className="sr-solution-divider" aria-hidden="true" />
        <div className="sr-solution-grid">
          {solutionCards.map(([image, title, copy]) => (
            <article className="sr-solution-card" key={title}>
              <div className="sr-solution-illustration">
                <img
                  src={image}
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
        <div className="sr-ai-brand" aria-labelledby="sr-ai-brand-title">
          <h2 id="sr-ai-brand-title">Keep using AI : without losing your brand</h2>
          <p>
            We build reusable brand rules, components and AI-ready context around
            your new direction. So when you or your agents create new pages,
            sections or assets, <strong>they start from your brand, not from generic SaaS patterns.</strong>
          </p>
        </div>
      </section>
      <FeaturedSocialProof review={featuredReview} />
      <Results />
      <SaasRedesignPricing
        locale="en"
        bookingLabel="Book a call"
        bookingHref="/en/saas-redesign/brief"
      />
      <ConversionMetricsSection />
      <ProofReviews />
      <div
        className="sr-reviews-book-divider"
        aria-hidden="true"
        data-sr-reveal="fade"
      />
      <StackSection3
        id="faq"
        className="sr-final-faq"
        locale="en"
        faqs={saasFaqs}
        ctaHref="/en/saas-redesign/brief"
        showDescription={false}
        showCta={false}
      />
    </main>
  );
}
