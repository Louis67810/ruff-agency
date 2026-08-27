export type Locale = "fr" | "en";

const ENGLISH: Record<string, string> = {
  "Voir nos r\u00e9alisations": "View our work",
  "R\u00e9server un appel": "Book a call",
  "Commencer mon projet": "Start my project",
  "Nos services": "Our services",
  "Nos ressources": "Resources",
  "Nos articles": "Our articles",
  "Nos outils gratuits": "Free tools",
  Accueil: "Home",
  "\u00c0 propos": "About us",
  "Tout ce dont vous avez besoin pour faire cro\u00eetre votre business":
    "Everything you need to grow your business",
  "Transformez vos visiteurs en clients": "Turn visitors into customers",
  "Inspirez confiance": "Build trust",
  "Structurer votre offre": "Structure your offer",
  "Devenez le r\u00e9sultat num\u00e9ro 1 dans les recherches":
    "Reach the top of search results",
  "Pourquoi nous choisir ?": "Why choose us?",
  "Ce qui fait la diff\u00e9rence": "What makes the difference",
  "Ce qui est inclus :": "What's included:",
  "Satisfait ou 100% Garantit": "100% satisfaction guaranteed",
  "Je lance mon projet maintenant": "Start my project now",
  "Un processus de cr\u00e9ation simple et efficace pour des projets uniques":
    "A simple, efficient process for unique projects",
  "L'agence en quelques mots": "The agency in a few words",
  "Toutes nos r\u00e9alisations": "All our work",
  "Le challenge": "The challenge",
  "La solution": "The solution",
  "Les r\u00e9sultats": "The results",
  "Points cl\u00e9s": "Key points",
  "Outil gratuit": "Free tool",
  "Lire l'article": "Read article",
  "En savoir plus": "Learn more",
  Suivant: "Next",
  "Pr\u00e9c\u00e9dent": "Previous",
  "On cr\u00e9e des sites web World-class": "We create world-class websites",
  "Nous cr\u00e9ons des sites web con\u00e7us pour que vos clients ne partent plus sans convertir et pour \u00e9lever votre image de marque.":
    "We create websites designed to turn more visitors into customers while elevating your brand.",
  "On cr\u00e9e des landing pages World-class":
    "We create world-class landing pages",
  "La page qui transforme l\u2019attention en demandes qualifi\u00e9es.":
    "The page that turns attention into qualified leads.",
  "On cr\u00e9e des identit\u00e9s de marque World-class":
    "We create world-class brand identities",
  "On \u00e9crit des textes qui vendent": "We write copy that sells",
  "On cr\u00e9e des produits digitaux World-class":
    "We create world-class digital products",
  "On transforme vos visiteurs en clients":
    "We turn your visitors into customers",
  "On rend votre marque visible dans les bons r\u00e9sultats":
    "We make your brand visible in the right results",
  "On r\u00e9invente le design Web": "We reinvent web design",
  "D\u00e9couvrez tous nos outils gratuits": "Discover all our free tools",
  "Des sites rapides, \u00e9l\u00e9gants et faciles \u00e0 faire \u00e9voluer, int\u00e9gr\u00e9s avec pr\u00e9cision dans Framer.":
    "Fast, elegant websites that are easy to evolve, crafted with precision in Framer.",
  "L'agence qui r\u00e9invente le design Web":
    "The agency that is reinventing web design",
  "D\u00e9couvrez notre histoire, nos valeurs et notre fa\u00e7on de travailler.":
    "Discover our story, our values and the way we work.",
  "Des mots pr\u00e9cis, humains et convaincants pour faire comprendre votre offre et donner envie d'avancer.":
    "Precise, human and compelling words that make your offer clear and move people forward.",
  "Nous construisons des identit\u00e9s fortes, coh\u00e9rentes et m\u00e9morables pour clarifier votre positionnement et renforcer votre cr\u00e9dibilit\u00e9.":
    "We build strong, consistent and memorable identities to clarify your positioning and strengthen your credibility.",
  "Une exp\u00e9rience claire et premium, pens\u00e9e pour pr\u00e9senter votre activit\u00e9, rassurer vos prospects et les faire passer \u00e0 l\u2019action.":
    "A clear, premium experience designed to present your business, reassure prospects and move them to action.",
  "Nous concevons des exp\u00e9riences digitales claires, utiles et d\u00e9sirables, de la premi\u00e8re id\u00e9e jusqu'au prototype.":
    "We design clear, useful and desirable digital experiences, from the first idea to the prototype.",
  "Une strat\u00e9gie SEO et GEO structur\u00e9e pour attirer les bonnes recherches et transformer la visibilit\u00e9 en opportunit\u00e9s.":
    "A structured SEO and GEO strategy to attract the right searches and turn visibility into opportunities.",
  "Des parcours plus simples, plus rassurants et plus efficaces pour faire progresser vos conversions.":
    "Simpler, more reassuring and more effective journeys to improve your conversions.",
  "Une identité claire, cohérente et mémorable, pensée pour renforcer votre positionnement.":
    "A clear, consistent and memorable identity designed to strengthen your positioning.",
  "Un processus de branding clair et efficace":
    "A clear and effective branding process",
  "Une méthode structurée pour construire une marque distinctive et prête à grandir.":
    "A structured method for building a distinctive brand ready to grow.",
  "Un site qui rend votre valeur évidente":
    "A website that makes your value obvious",
  "Chaque écran est construit pour être facile à comprendre, agréable à utiliser et cohérent avec votre image.":
    "Every screen is designed to be easy to understand, enjoyable to use and consistent with your brand.",
  "Image de marque forte": "Strong brand image",
  "Offre mieux organisée": "Better-structured offer",
  "Visibilité Google": "Google visibility",
  Différenciation: "Differentiation",
  "Évolutif et durable": "Scalable and built to last",
  "Message clair": "Clear message",
  "Cadrage": "Framing",
  "Strat\u00e9gie": "Strategy",
  "Design": "Design",
  "D\u00e9veloppement": "Development",
  "Mise en ligne": "Launch",
  "Un site qui donne une impression s\u00e9rieuse et premium, et qui installe votre cr\u00e9dibilit\u00e9 durablement.": "A website that feels serious and premium, building lasting credibility.",
  "Vos services deviennent faciles \u00e0 comprendre et \u00e0 comparer, ce qui r\u00e9duit les abandons et les questions inutiles.": "Your services become easy to understand and compare, reducing drop-offs and unnecessary questions.",
  "Un contenu organis\u00e9 et pertinent aide votre page \u00e0 gagner des opportunit\u00e9s de visibilit\u00e9 sur vos requ\u00eates cl\u00e9s.": "Organized, relevant content helps your page gain visibility for your key searches.",
  "Un design qui refl\u00e8te votre niveau et votre positionnement, sans effet \u00ab site g\u00e9n\u00e9rique \u00bb.": "A design that reflects your level and positioning, without looking generic.",
  "Un site pens\u00e9 pour grandir : ajouter des pages, clarifier une offre, lancer une campagne, sans repartir de z\u00e9ro.": "A website built to grow: add pages, clarify an offer or launch a campaign without starting over.",
  "Votre offre est pr\u00e9sent\u00e9e de fa\u00e7on simple et \u00e9vidente : ce que vous faites, pour qui, et pourquoi vous choisir.": "Your offer is presented simply and clearly: what you do, who it is for and why people should choose you.",
  "Un contenu structur\u00e9 pour \u00eatre mieux compris par les moteurs de recherche et les assistants IA.": "Structured content that search engines and AI assistants can understand more easily.",
  "Une architecture lisible pour les moteurs comme pour vos visiteurs.": "A clear architecture for both search engines and visitors.",
  "Une pr\u00e9sence qui continue de travailler pour vous au fil des recherches.": "A presence that keeps working for you as people search.",
  "Des pages pens\u00e9es pour r\u00e9pondre clairement aux questions et gagner la confiance.": "Pages designed to answer questions clearly and build trust.",
  "Chaque \u00e9tape est pens\u00e9e pour supprimer les h\u00e9sitations et guider vers l'action.": "Every step is designed to remove hesitation and guide visitors towards action.",
  "Une proposition de valeur visible imm\u00e9diatement, sans effort pour vos visiteurs.": "A value proposition that is immediately visible and effortless to understand.",
  "Nous identifions ce qui bloque vos prospects et simplifions l'exp\u00e9rience.": "We identify what holds prospects back and simplify the experience.",
  "Les bons signaux au bon moment pour rassurer avant la d\u00e9cision.": "The right signals at the right time to reassure people before they decide.",
  "Des am\u00e9liorations prioris\u00e9es selon leur potentiel r\u00e9el sur vos r\u00e9sultats.": "Improvements prioritized according to their real potential impact on your results.",
  "Un parcours con\u00e7u pour suivre les clics, demandes et conversions.": "A journey designed to track clicks, enquiries and conversions.",
  "Positionnement clair": "Clear positioning",
  "Identit\u00e9 m\u00e9morable": "Memorable identity",
  "Cr\u00e9dibilit\u00e9 renforc\u00e9e": "Stronger credibility",
  "Syst\u00e8me coh\u00e9rent": "Consistent system",
  "Marque \u00e9volutive": "Scalable brand",
  "Pr\u00eate \u00e0 d\u00e9ployer": "Ready to deploy",
  "Plateforme de marque": "Brand platform",
  "Direction artistique": "Art direction",
  "Syst\u00e8me visuel": "Visual system",
  "Livraison": "Delivery",
  "Message limpide": "Crystal-clear message",
  "Voix de marque": "Brand voice",
  "Arguments solides": "Strong arguments",
  "Parcours convaincant": "Convincing journey",
  "Contenu durable": "Evergreen content",
  "Actions plus fortes": "Stronger calls to action",
  "Brief & immersion": "Brief and immersion",
  "Positionnement": "Positioning",
  "Structure des messages": "Message structure",
  "R\u00e9daction": "Copywriting",
  "Optimisation finale": "Final optimization",
  "Code sur mesure": "Custom code",
  "Rapidit\u00e9 d'ex\u00e9cution": "Fast execution",
  "Architecture solide": "Solid architecture",
  "SEO technique": "Technical SEO",
  "\u00c9volutif par nature": "Scalable by nature",
  "Mise en ligne ma\u00eetris\u00e9e": "Controlled launch",
  "Cadrage technique": "Technical framing",
  "Architecture": "Architecture",
  "D\u00e9veloppement React": "React development",
  "Int\u00e9grations": "Integrations",
  "Mise en production": "Production launch",
  "Exp\u00e9rience intuitive": "Intuitive experience",
  "Interface sur mesure": "Custom interface",
  "D\u00e9cisions \u00e9clair\u00e9es": "Informed decisions",
  "Produit \u00e9volutif": "Scalable product",
  "Impact mesurable": "Measurable impact",
  "Cadrage produit": "Product framing",
  "Recherche utilisateur": "User research",
  "Architecture UX": "UX architecture",
  "UI design": "UI design",
  "Prototype livr\u00e9": "Delivered prototype",
  "Visibilit\u00e9 durable": "Long-term visibility",
  "Requ\u00eates strat\u00e9giques": "Strategic queries",
  "Contenu utile": "Useful content",
  "Structure saine": "Healthy structure",
  "Pr\u00eat pour l'IA": "AI-ready",
  "Mesure continue": "Continuous measurement",
  "Audit & cadrage": "Audit and framing",
  "Strat\u00e9gie de mots-cl\u00e9s": "Keyword strategy",
  "Structure \u00e9ditoriale": "Editorial structure",
  "Analyse des donn\u00e9es": "Data analysis",
  "Identification des freins": "Friction analysis",
  "Hypoth\u00e8ses": "Hypotheses",
  "Optimisations": "Optimizations",
  "Mesure & suivi": "Measurement and monitoring",
  "Parcours plus clair": "Clearer journey",
  "Offre mieux comprise": "Better-understood offer",
  "Friction r\u00e9duite": "Reduced friction",
  "Confiance renforc\u00e9e": "Stronger trust",
  "Tests orient\u00e9s impact": "Impact-focused testing",
  "R\u00e9sultats mesurables": "Measurable results",
  "Structure Framer": "Framer structure",
  "Int\u00e9gration": "Integration",
  "Responsive": "Responsive",
  "Publication": "Publishing",
  "Ils parlent mieux que nous": "They say it better than we do",
  "Nous nous sommes donné une mission": "We gave ourselves a mission",
  "Des questions ? On y répond": "Questions? We answer them",
  "On crée des landing pages et des sites World-class":
    "We create world-class landing pages and websites",
  "Notre méthode": "Our method",
  "Nos expertises": "Our expertise",
  "Un accompagnement de A à Z": "End-to-end support",
  "Parlons de votre projet": "Let's talk about your project",
  "Prêt à faire passer votre site au niveau supérieur ?":
    "Ready to take your website to the next level?",
  "On développe des sites": "We build websites",
  "World-class en code React.": "world-class React websites.",
};

function repairEncoding(value: string) {
  try {
    return /[ÃÂâ]/.test(value) ? decodeURIComponent(escape(value)) : value;
  } catch {
    return value;
  }
}
export function translateText(value: unknown, locale: Locale) {
  const text = repairEncoding(String(value ?? ""));
  return locale === "en" ? (ENGLISH[text] ?? text) : text;
}

export function localizeHref(value: string | undefined, locale: Locale) {
  if (
    !value ||
    locale !== "en" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/en")
  )
    return value;
  return `/en${value}`;
}
