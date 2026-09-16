import type { Article } from "./articles";
import { translateData } from "./translation-map";

const titles: Record<string, string> = {
  "nouveau-logo-bonduelle": "Bonduelle's new logo: rebrand analysis and shelf-recognition risks",
  "nouveau-logo-kfc-rebranding-bucketverse-jkr": "KFC's new logo and Bucketverse: analysing JKR's rebrand",
  "developper-site-efficacement": "Build a website efficiently: Figma, Framer and key priorities",
  "sous-cta-booster-conversions": "Micro-CTAs: seven trust signals to increase conversions",
  "questions-sections-landing-page": "Landing page structure: the questions every section must answer",
  "sourcils-de-texte-conversions": "Eyebrow copy: clarify a landing page and increase conversions",
  "illustrations-hero-section-business": "Hero visuals: which images should you choose for your business?",
  "guide-copywriting-page-qui-convertit": "Landing page copywriting: how to structure a page that converts",
  "capter-attention-visiteur-landing-page": "Capture attention on a landing page: six design and conversion principles",
  "trouver-avatar-client-guide": "How to define a customer avatar for a more convincing landing page",
  "bibliotheque-composants-article": "Editorial component library",
};

const metaDescriptions: Record<string, string> = {
  "nouveau-logo-bonduelle": "An analysis of Bonduelle's new logo: removed brand cues, alignment with its plant-based promise and shelf-recognition risks.",
  "nouveau-logo-kfc-rebranding-bucketverse-jkr": "An analysis of KFC's new logo and JKR's Bucketverse: the bucket, typography, packaging and a global brand system.",
  "developper-site-efficacement": "How to build a website efficiently with Figma and Framer: scope, design, publish and improve a high-performing site.",
  "sous-cta-booster-conversions": "Seven micro-CTAs and trust signals to reduce friction on a landing page, pricing page or free-trial signup.",
  "questions-sections-landing-page": "Structure a landing page that converts: questions to answer in the hero, benefits, proof, offer and CTA sections.",
  "sourcils-de-texte-conversions": "Learn how to use eyebrow copy to add context, strengthen proof and clarify a landing page message.",
  "illustrations-hero-section-business": "Choose the right hero visual for a SaaS, agency, local business, app or e-commerce brand and make your offer clearer.",
  "guide-copywriting-page-qui-convertit": "A landing page copywriting guide: structure the message, proof, objections and calls to action without artificial promises.",
  "capter-attention-visiteur-landing-page": "Six design and conversion principles to capture attention on a landing page, clarify the offer and guide visitors to the CTA.",
  "trouver-avatar-client-guide": "Define an actionable customer avatar for your landing page: needs, objections, language, data and interview questions.",
};

const introductions: Record<string, string> = {
  "nouveau-logo-bonduelle": "Bonduelle's new logo simplifies the brand's historic cues. This analysis examines what the rebrand can bring to digital channels — and what it may cost in visual recognition, especially on the shelf.",
  "nouveau-logo-kfc-rebranding-bucketverse-jkr": "KFC's new logo turns the bucket into a brand signature, graphic system and spatial landmark. Designed by JKR, the Bucketverse extends the chain's historic cues from packaging to interfaces and restaurants.",
  "developper-site-efficacement": "To build a website efficiently, first scope the message and experience, design them in Figma, then build and improve the site through iterations. This method limits costly rework without sacrificing quality.",
  "questions-sections-landing-page": "An effective landing page answers the questions visitors ask before they click. From the hero to the CTA, every section should remove a specific doubt: understand the offer, believe the promise and know what to do next.",
  "sourcils-de-texte-conversions": "Eyebrow copy is a short line above a title: it immediately adds a category, context or proof point. Used well, it clarifies a landing page without weighing down the main message.",
  "illustrations-hero-section-business": "A hero visual should confirm within seconds that visitors are in the right place, understand the offer and can trust it. The right choice depends on your business: a SaaS, agency or local business should not show the same proof.",
  "guide-copywriting-page-qui-convertit": "Landing page copywriting first makes an offer clear, credible and easy to choose. This guide covers the messaging levers to use thoughtfully: promise, proof, objection handling and calls to action.",
  "capter-attention-visiteur-landing-page": "To capture attention on a landing page, make the offer, hierarchy and CTA understandable at a glance. Visitors do not read everything: they scan for signals that help them decide whether to continue.",
  "trouver-avatar-client-guide": "A useful customer avatar is more than an age or job title. It brings together the needs, objections, words and situations that help you write a genuinely convincing landing page.",
};

export function getEnglishArticle(article: Article): Article {
  const translated = translateData(article);
  const content = [...translated.content];
  if (introductions[article.slug] && content[0]?.type === "paragraph") {
    content[0] = { ...content[0], text: introductions[article.slug] };
  }
  return { ...translated, content, title: titles[article.slug] ?? translated.title, metaDescription: metaDescriptions[article.slug] ?? translated.metaDescription, breadcrumbTitle: "Resources", tag: translated.tag === "Outils" ? "Tools" : "Resources", updatedAt: translated.updatedAt.replace("Dernière mise à jour le", "Last updated on"), href: `/ressources/${article.slug}` };
}

export function getEnglishArticles(list: Article[]) { return list.map(getEnglishArticle); }
