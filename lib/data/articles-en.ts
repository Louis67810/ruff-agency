import type { Article } from "./articles";
import { translateData } from "./translation-map";

const titles: Record<string, string> = {
  "nouveau-logo-bonduelle": "Bonduelle's new logo: an analysis of a risky visual identity redesign",
  "nouveau-logo-kfc-rebranding-bucketverse-jkr": "KFC's new logo: analysing the Bucketverse rebrand by JKR",
  "developper-site-efficacement": "How to develop your website efficiently without compromising quality",
  "sous-cta-booster-conversions": "Micro-CTAs: how to boost your conversions",
  "questions-sections-landing-page": "The questions every landing page section must answer",
  "sourcils-de-texte-conversions": "Eyebrow copy: how to increase conversions",
  "illustrations-hero-section-business": "Which illustrations should you choose for your website hero?",
  "guide-copywriting-page-qui-convertit": "Copywriting guide: how to write a page that moves people to action",
  "capter-attention-visiteur-landing-page": "How to capture a visitor's attention on a landing page",
  "trouver-avatar-client-guide": "How to find your customer avatar: the ultimate guide",
  "bibliotheque-composants-article": "Editorial component library",
};

export function getEnglishArticle(article: Article): Article {
  const translated = translateData(article);
  return { ...translated, title: titles[article.slug] ?? translated.title, breadcrumbTitle: "Resources", tag: translated.tag === "Outils" ? "Tools" : "Resources", updatedAt: translated.updatedAt.replace("Dernière mise à jour le", "Last updated on"), href: `/ressources/${article.slug}` };
}

export function getEnglishArticles(list: Article[]) { return list.map(getEnglishArticle); }
