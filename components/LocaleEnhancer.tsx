"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const translations: Array<[string, string]> = [
  ["Commencer mon projet", "Start my project"], ["R\u00e9server un appel", "Book a call"], ["Voir nos r\u00e9alisations", "View our work"], ["Nos r\u00e9alisations", "Our work"], ["Nos services", "Our services"], ["Nos ressources", "Resources"], ["Nos articles", "Our articles"], ["Nos outils gratuits", "Free tools"], ["\u00c0 propos", "About us"], ["Agence", "Agency"], ["Accueil", "Home"], ["D\u00e9veloppement Web", "Web development"], ["D\u00e9veloppement Framer", "Framer development"], ["Optimisation conversion", "Conversion optimization"], ["D\u00e9couvrez", "Discover"], ["Lire l'article", "Read article"], ["En savoir plus", "Learn more"], ["Suivant", "Next"], ["Pr\u00e9c\u00e9dent", "Previous"], ["Fermer le menu", "Close menu"], ["Ouvrir le menu", "Open menu"],
  ["Tout ce dont vous avez besoin pour faire cro\u00eetre votre business", "Everything you need to grow your business"], ["Transformez vos visiteurs en clients", "Turn visitors into customers"], ["Chaque section de votre landing page est pens\u00e9e pour guider le regard vers l\u2019action, sans friction.", "Every section of your landing page is designed to guide attention towards action, without friction."], ["Inspirez confiance", "Build trust"], ["Structurer votre offre", "Structure your offer"], ["Pourquoi nous choisir ?", "Why choose us?"], ["Moins de flou, plus de clart\u00e9 : prix, d\u00e9lai et r\u00e9sultat au centre.", "Less guesswork, more clarity: price, timing and results at the centre."], ["Ce qui est inclus :", "What's included:"], ["Satisfait ou 100% Garantit", "100% satisfaction guaranteed"], ["Je lance mon projet maintenant", "Start my project now"], ["Ce qui fait la diff\u00e9rence", "What makes the difference"], ["Une identit\u00e9 claire, coh\u00e9rente et m\u00e9morable, pens\u00e9e pour renforcer votre positionnement.", "A clear, consistent and memorable identity designed to strengthen your positioning."], ["Un processus de branding clair et efficace", "A clear, efficient branding process"], ["On cr\u00e9e des landing pages et des sites World-class", "We create world-class landing pages and websites"], ["On cr\u00e9e des identit\u00e9s de marque World-class", "We create world-class brand identities"], ["On \u00e9crit des textes qui vendent", "We write copy that sells"], ["On cr\u00e9e des sites Framer World-class", "We create world-class Framer websites"], ["On d\u00e9veloppe des sites World-class en code React", "We build world-class websites with React"], ["On cr\u00e9e des produits digitaux World-class", "We create world-class digital products"], ["On rend votre marque visible dans les bons r\u00e9sultats", "We make your brand visible in the right results"], ["On transforme vos visiteurs en clients", "We turn your visitors into customers"], ["On r\u00e9invente le design Web", "We reinvent web design"], ["D\u00e9couvrez tous nos outils gratuits", "Discover all our free tools"], ["Le challenge", "The challenge"], ["La solution", "The solution"], ["Les r\u00e9sultats", "The results"], ["Points cl\u00e9s", "Key points"], ["Outil gratuit", "Free tool"], ["Source :", "Source:"], ["Donn\u00e9es de d\u00e9monstration.", "Demo data."], ["R\u00e9alisations", "Our work"], ["L'agence en quelques mots", "The agency in a few words"], ["Oups, cette page n\u2019existe pas", "Oops, this page does not exist"], ["Des tarifs clairs, sans surprise", "Clear pricing, no surprises"], ["Options suppl\u00e9mentaires :", "Additional options:"], ["Pendant ces 30 minutes nous allons analyser votre situation actuelle pour comprendre vos besoins.", "During these 30 minutes, we will analyse your current situation to understand your needs."], ["Des questions ? On y r\u00e9pond", "Have questions? We answer them"], ["Tous nos services", "All our services"], ["Trois offres claires, pens\u00e9es pour \u00e9lever votre image et g\u00e9n\u00e9rer des demandes", "Three clear offers designed to elevate your brand and generate enquiries"], ["\u00c9tudes de cas", "Case studies"], ["Qui sommes nous", "Who we are"], ["Mes r\u00e9seaux", "My social networks"], ["Nos lieux :", "Our locations:"], ["tous droits r\u00e9serv\u00e9s", "all rights reserved"],
];

const extraTranslations: Array<[string, string]> = [
  ["places restantes pour", "places remaining for"], ["\u00c9crit par :", "Written by:"], ["R\u00e9dig\u00e9 par :", "Written by:"], ["R\u00e9sumer cette ressource avec :", "Summarize this resource with:"], ["Partagez cette ressource avec :", "Share this resource with:"], ["Commence \u00e0", "Starts at"], ["Optimis\u00e9 conversion", "Conversion-optimized"], ["Design esth\u00e9tique seul", "Aesthetic design only"], ["R\u00e9sultats variables", "Variable results"], ["Faire soi-m\u00eame", "Do it yourself"], ["Design g\u00e9n\u00e9rique", "Generic design"], ["Non optimis\u00e9", "Not optimized"], ["D\u00e9pend de vous", "Depends on you"], ["N\u00e9cessite de vous former au logiciel", "Requires software training"], ["Cr\u00e9ation compl\u00e8te de votre identit\u00e9 visuelle", "Complete visual identity creation"], ["Int\u00e9gration CMS", "CMS integration"], ["G\u00e9rez votre contenu de mani\u00e8re autonome", "Manage your content independently"], ["Illustrations sur-mesure", "Custom illustrations"], ["Modifications illimit\u00e9es", "Unlimited revisions"], ["Analyse strat\u00e9gique", "Strategic analysis"], ["Copywriting optimis\u00e9", "Optimized copywriting"], ["Suivi projet temps r\u00e9el", "Real-time project tracking"], ["Meilleure valeur per\u00e7ue", "Higher perceived value"], ["Design unique et m\u00e9morable", "Unique and memorable design"], ["Associ\u00e9 chez Zorgniotti", "Partner at Zorgniotti"], ["Ind\u00e9pendant", "Independent"], ["R\u00e9server un appel de 30 minutes", "Book a 30-minute call"], ["Cr\u00e9ation de la landing page", "Landing page creation"], ["R\u00e9server un appel", "Book a call"], ["Le challenge", "The challenge"], ["La solution", "The solution"], ["Les r\u00e9sultats", "The results"], ["Ruff agency tous droits r\u00e9serv\u00e9s", "Ruff agency all rights reserved"], ["Un vrai professionnel, malgr\u00e9 son jeune \u00e2ge.", "A true professional, despite his young age."], ["Louis m’a livr\u00e9 un site soign\u00e9, fluide et parfaitement conforme \u00e0 mes attentes.", "Louis delivered a polished, smooth website that perfectly met my expectations."], ["Il \u00e9coute, il ajuste, il vise juste.", "He listens, adapts and gets it right."], ["La structure de la page, les titres et les contenus sont pens\u00e9s pour am\u00e9liorer la lisibilit\u00e9 de votre offre par les moteurs de recherche.", "The page structure, headings and content are designed to make your offer easier for search engines to understand."], ["Votre proposition devient lisible, hi\u00e9rarchis\u00e9e et facile \u00e0 choisir.", "Your proposition becomes clear, structured and easy to choose."], ["R\u00e9server un appel de 30 minutes", "Book a 30-minute call"], ["Apr\u00e8s avoir pay\u00e9, vous recevrez un formulaire", "After payment, you will receive a form"], ["Cr\u00e9ation de la landing page", "Landing page creation"], ["Commence \u00e0 1 490€", "Starts at €1,490"], ["Commence \u00e0 +5 000€", "Starts at €5,000+"], ["G\u00e9rez votre contenu de mani\u00e8re autonome", "Manage your content independently"], ["Notre mission est simple : faire du design un v\u00e9ritable levier de performance.", "Our mission is simple: make design a genuine performance lever."],
];

function repairEncoding(value: string) {
  try { return /[ÃÂâ]/.test(value) ? decodeURIComponent(escape(value)) : value; } catch { return value; }
}
const contentTranslations: Array<[string, string]> = [
  ["Fondateur de Spreak", "Founder of Spreak"],
  ["Fondateur de Keyframe", "Founder of Keyframe"],
  ["Fondateur de Rentala", "Founder of Rentala"],
  ["Fondatrice de Clovarex", "Founder of Clovarex"],
  ["Fondateur de Gourdy", "Founder of Gourdy"],
  ["Je recommande vivement Louis pour son travail remarquable sur Spreak. Toute entreprise souhaitant collaborer avec un designer à la fois rigoureux, créatif et fiable fera un excellent choix en travaillant avec lui.", "I highly recommend Louis for his outstanding work on Spreak. Any company looking for a rigorous, creative and reliable designer would make an excellent choice working with him."],
  ["Je le recommande sans réserve.", "I recommend him without reservation."],
  ["Meilleure de conversion", "Higher conversion"],
  ["1.43x plus de conversion", "1.43x more conversions"],
  ["2x plus de conversion", "2x more conversions"],
  ["Image de marque unique", "Unique brand image"],
  ["Meilleure structure de son offre", "Better offer structure"],
  ["Une collaboration efficace et un résultat au-delà de nos attentes.", "An efficient collaboration and a result beyond our expectations."],
  ["Note moyenne 5/5", "Average rating 5/5"],
  ["Note moyenne : 5/5", "Average rating: 5/5"],
  ["+30 fondateurs satisfaits", "+30 satisfied founders"],
  ["Nous avons commandé un site multi-page et l’expérience a été excellente du début à la fin. Le site a été livré rapidement, avec un design clair et professionnel. ", "We ordered a multi-page website and the experience was excellent from start to finish. The website was delivered quickly, with a clear and professional design. "],
  ["J’ai fait appel à Ruff Agency pour le redesign de Rentala et je suis ravi du résultat. Le design est moderne et clair. Mention spéciale pour le copywriting : les textes sont percutants et mettent parfaitement en valeur notre proposition.", "I hired Ruff Agency to redesign Rentala and I am delighted with the result. The design is modern and clear. Special mention for the copywriting: the wording is impactful and perfectly highlights our value proposition."],
  ["Le site est non seulement beau, mais il a aussi boosté notre taux de conversion. Chaque détail a été pensé pour maximiser notre efficacité. Merci Ruff Agency !", "The website is not only beautiful, it also boosted our conversion rate. Every detail was designed to maximise our efficiency. Thank you, Ruff Agency!"],
  ["Je vois chaque semaine des entreprises qui ne génèrent presque aucune demande qualifiée.", "Every week, I see businesses generating almost no qualified enquiries."],
  ["Si vous êtes une entreprise qui prend son image au sérieux, vous méritez mieux qu’un “site simple” : vous méritez une page qui travaille vraiment pour vous.", "If you are a business that takes its image seriously, you deserve more than a “simple website”: you deserve a page that genuinely works for you."],
  ["Fondateur de Ruff agency", "Founder of Ruff Agency"],
  ["+2k abonnés", "+2k followers"],
  ["Nous nous sommes donné une mission", "We gave ourselves a mission"],
  ["Toute entreprise souhaitant collaborer avec un designer à la fois rigoureux, créatif et fiable fera un excellent choix en travaillant avec lui.", "Any company looking for a rigorous, creative and reliable designer would make an excellent choice working with him."],
  ["Une très belle rigueur, et surtout une vraie volonté de bien faire.", "Remarkable rigour, and above all a genuine desire to do things well."],
  ["Nous perfectionnons votre site jusqu’à ce qu’il corresponde exactement à vos attentes.", "We refine your website until it perfectly meets your expectations."],
  ["Et si malgré tout vous n’êtes pas satisfait, nous prenons le temps de corriger ce qui doit l’être.", "And if you are still not satisfied, we take the time to fix what needs fixing."],
  ["Sur quel logiciel réalisez vous vos landings pages ?", "Which software do you use to build landing pages?"],
  ["Nous utilisons Figma pour la phase de design, puis Framer pour le développement.", "We use Figma for the design phase, then Framer for development."],
  ["Oui. Vous pourrez suivre la progression de votre projet directement via WhatsApp.", "Yes. You can follow your project's progress directly via WhatsApp."],
  ["Nous vous partageons chaque jour l’avancement, et vous pourrez demander facilement des modifications.", "We share progress with you every day, and you can easily request changes."],
  ["Est-ce que le développement est intégré ?", "Is development included?"],
  ["Oui. Le développement est intégré directement sur Framer, ce qui vous permet de lancer votre site rapidement sans passer par une étape technique supplémentaire.", "Yes. Development is handled directly in Framer, allowing you to launch your website quickly without an additional technical step."],
  ["Le règlement se fait en deux étapes", "Payment is made in two stages"],
  ["Une landing page est pensée pour un seul objectif", "A landing page is designed around one goal"],
  ["Elle est idéale pour des campagnes payantes, des lancements, des webinaires ou encore des pages de vente.", "It is ideal for paid campaigns, launches, webinars and sales pages."],
  ["Un site multi-pages convient davantage aux SaaS, services, agences et marques", "A multi-page website is better suited to SaaS products, services, agencies and brands"],
  ["Votre satisfaction est garantie à 100 %.", "Your satisfaction is 100% guaranteed."],
  ["Nous perfectionnons votre site jusqu’à ce qu’il corresponde exactement à vos attentes.", "We refine your website until it perfectly meets your expectations."],
  ["Des sites rapides, élégants et faciles à faire évoluer", "Fast, elegant websites that are easy to evolve"],
  ["Des parcours plus simples, plus rassurants et plus efficaces", "Simpler, more reassuring and more effective journeys"],
  ["Nous construisons des identités fortes, cohérentes et mémorables", "We build strong, consistent and memorable identities"],
  ["Des mots précis, humains et convaincants", "Precise, human and compelling words"],
  ["Nous concevons des expériences digitales claires, utiles et désirables", "We design clear, useful and desirable digital experiences"],
  ["Une stratégie SEO et GEO structurée pour attirer les bonnes recherches", "A structured SEO and GEO strategy to attract the right searches"],
  ["Des parcours plus simples, plus rassurants et plus efficaces pour faire progresser vos conversions.", "Simpler, more reassuring and more effective journeys to improve your conversions."],
  ["Les éléments suivants sont volontairement fictifs", "The following elements are intentionally fictional"],
  ["Une page outil statique pour vérifier le template avant d’ajouter vos vrais outils.", "A static tool page for validating the template before adding your real tools."],
];

function translate(value: string) { return [...translations, ...extraTranslations, ...contentTranslations].reduce((result, [from, to]) => result.split(from).join(to), repairEncoding(value)); }
function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    root.nodeValue = translate(root.nodeValue || "");
    return;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current: Node | null;
  while ((current = walker.nextNode())) current.nodeValue = translate(current.nodeValue || "");
  if (root instanceof Element) ["aria-label", "alt", "placeholder", "title"].forEach((attribute) => { const value = root.getAttribute(attribute); if (value) root.setAttribute(attribute, translate(value)); });
}

export default function LocaleEnhancer() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname?.startsWith("/en") && document.body.dataset.siteLocale !== "en") return;
    document.documentElement.lang = "en";
    translateTree(document.body);
    const prefixLinks = (root: ParentNode = document.body) => root.querySelectorAll<HTMLAnchorElement>('a[href^="/"]:not([href^="/en"])').forEach((link) => { const href = link.getAttribute("href"); if (href && !href.startsWith("//") && !href.startsWith("/api")) link.setAttribute("href", `/en${href}`); });
    prefixLinks();
    const observer = new MutationObserver((records) => { records.forEach((record) => record.addedNodes.forEach((node) => { translateTree(node); if (node instanceof Element) prefixLinks(node); else if (node.parentElement) prefixLinks(node.parentElement); })); });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => { observer.disconnect(); };
  }, [pathname]);
  return null;
}
