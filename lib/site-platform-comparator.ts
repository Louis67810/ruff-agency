export type SiteProjectType = "landing" | "showcase" | "blog" | "ecommerce" | "webapp";
export type SitePageBand = "one" | "ten" | "fifty" | "150" | "150plus";
export type SiteTrafficBand = "unknown" | "under1k" | "1to10k" | "10to50k" | "50to200k" | "200plus";
export type SiteCmsNeed = "none" | "light" | "heavy";
export type SiteFeature = "forms" | "payments" | "members" | "multilingual" | "backend" | "abtest";
export type SiteTeamBand = "one" | "three" | "ten" | "more";
export type SiteBilling = "monthly" | "yearly";

export type SiteProject = {
  siteType: SiteProjectType;
  pages: SitePageBand;
  traffic: SiteTrafficBand;
  cms: SiteCmsNeed;
  features: SiteFeature[];
  team: SiteTeamBand;
  billing: SiteBilling;
};

export type PlatformEstimate = {
  id: string;
  name: string;
  logo: string;
  category: "Créateur de site" | "Hébergement / code";
  plan: string;
  monthlyPrice: number;
  annualPrice: number;
  priceIsQuote?: boolean;
  compatible: boolean;
  reasons: string[];
  included: string[];
  limits: string[];
  note: string;
  pricingUrl: string;
};

// Public prices are shown in USD on several vendor sites. Converted to EUR using the
// ECB reference rate for 25 Sep 2026 (1 EUR = 1.1403 USD); taxes and regional pricing vary.
const USD_TO_EUR = 1 / 1.1403;
const eur = (usd: number) => Math.ceil(usd * USD_TO_EUR);
const pagesCount: Record<SitePageBand, number> = { one: 1, ten: 10, fifty: 50, "150": 150, "150plus": 250 };
const visitorsCount: Record<SiteTrafficBand, number> = { unknown: 5000, under1k: 500, "1to10k": 5000, "10to50k": 30000, "50to200k": 125000, "200plus": 250000 };
const seatsCount: Record<SiteTeamBand, number> = { one: 1, three: 3, ten: 7, more: 12 };
const has = (project: SiteProject, feature: SiteFeature) => project.features.includes(feature);
const isEcommerce = (project: SiteProject) => project.siteType === "ecommerce" || has(project, "payments");
const needsCode = (project: SiteProject) => project.siteType === "webapp" || has(project, "backend");
const traffic = (project: SiteProject) => visitorsCount[project.traffic];
const pages = (project: SiteProject) => pagesCount[project.pages];
const people = (project: SiteProject) => seatsCount[project.team];
const selectedUsd = (project: SiteProject, annualUsd: number, monthlyUsd: number) => project.billing === "yearly" ? annualUsd : monthlyUsd;

function estimate(project: SiteProject, platform: Omit<PlatformEstimate, "plan" | "monthlyPrice" | "annualPrice" | "compatible" | "reasons" | "included" | "limits" | "note">, plan: string, usd: number, reasons: string[], included: string[], limits: string[], note: string, incompatible = false, priceIsQuote = false): PlatformEstimate {
  const monthlyPrice = Math.max(0, usd);
  return { ...platform, plan, monthlyPrice: eur(monthlyPrice), annualPrice: eur(monthlyPrice * 12), priceIsQuote, compatible: !incompatible, reasons, included, limits, note };
}

const base = {
  builder: { category: "Créateur de site" as const },
  hosting: { category: "Hébergement / code" as const },
};

export function estimatePlatforms(project: SiteProject): PlatformEstimate[] {
  const needsCms = project.cms !== "none" || project.siteType === "blog";
  const needsCommerce = isEcommerce(project);
  const code = needsCode(project);
  const trafficCount = traffic(project);
  const pageCount = pages(project);
  const seats = people(project);
  const usageSentence = project.traffic === "unknown" ? "Trafic inconnu : le classement part d’une hypothèse de 5 000 visites mensuelles." : `${new Intl.NumberFormat("fr-FR").format(trafficCount)} visites mensuelles estimées.`;
  const results: PlatformEstimate[] = [];

  const framerPro = pageCount > 30 || project.cms === "heavy" || trafficCount > 50000 || needsCommerce || has(project, "abtest") || has(project, "members");
  const framerPlan = seats > 10 ? "Enterprise (sur devis)" : framerPro ? "Pro" : "Basic";
  const framerBaseUsd = framerPro ? (project.billing === "yearly" ? 30 : 40) : (project.billing === "yearly" ? 10 : 15);
  const framerEditorsUsd = Math.max(0, seats - 1) * 20;
  const framerLocaleUsd = has(project, "multilingual") ? 20 : 0;
  const framerAbTestUsd = has(project, "abtest") ? 50 : 0;
  const framerBandwidthGb = trafficCount / 1000;
  const framerIncludedGb = framerPro ? 100 : 50;
  const framerBandwidthUsd = Math.max(0, Math.ceil((framerBandwidthGb - framerIncludedGb) / 100)) * 40;
  const framerUsd = seats > 10 ? 0 : framerBaseUsd + framerEditorsUsd + framerLocaleUsd + framerAbTestUsd + framerBandwidthUsd;
  results.push(estimate(project, { id: "framer", name: "Framer", logo: "framer", ...base.builder, pricingUrl: "https://www.framer.com/pricing" }, framerPlan, framerUsd, [
    pageCount > 30 ? `${pageCount} pages : le plan Basic est limité à 30 pages, Pro en inclut 150.` : `${pageCount} pages : Basic couvre ce volume dans cette simulation.`,
    needsCms ? `CMS ${project.cms === "light" ? "léger (2 collections incluses sur Basic)" : "volumineux (Pro retenu)"}.` : "Pas de CMS requis dans ce scénario.",
    `${usageSentence} Le trafic est converti en environ ${Math.round(framerBandwidthGb)} Go/mois (hypothèse : 1 Go pour 1 000 visites).`,
    `${seats} éditeur(s) estimés ; les éditeurs additionnels sont inclus au calcul à 20 $/mois chacun après le premier.`,
  ], ["Domaine personnalisé", "Hébergement managé", "Éditeur visuel"], ["A/B testing, traductions, éditeurs supplémentaires et dépassements de bande passante peuvent être facturés en add-on."], `${framerLocaleUsd ? "Une langue supplémentaire (20 $/mois) et " : ""}${framerAbTestUsd ? "l’option A/B test (50 $/mois) et " : ""}les seats additionnels et le palier de bande passante sont ajoutés selon les tarifs publics.`, false, seats > 10));

  const webflowTrafficGb = trafficCount / 1000;
  const webflowCms = needsCms || needsCommerce || has(project, "multilingual") || has(project, "abtest") || pageCount > 150 || webflowTrafficGb > 10;
  const webflowExtraBandwidth = webflowCms ? Math.max(0, Math.ceil((webflowTrafficGb - 50) / 50)) : 0;
  const webflowSeatUsd = Math.max(0, seats - 1) * 39;
  const webflowUsd = (project.billing === "yearly" ? (webflowCms ? 25 : 15) : (webflowCms ? 39 : 18)) + webflowExtraBandwidth * (project.billing === "yearly" ? 20 : 30) + webflowSeatUsd;
  results.push(estimate(project, { id: "webflow", name: "Webflow", logo: "webflow", ...base.builder, pricingUrl: "https://webflow.com/pricing" }, webflowCms ? "Premium CMS" : "Basic", webflowUsd, [
    needsCms ? "Le CMS demandé nécessite le plan Premium dans ce comparatif." : "Le site ne demande pas de CMS, le plan Basic est retenu.",
    `${usageSentence} Environ ${Math.round(webflowTrafficGb)} Go/mois de bande passante estimée.`,
    `${pageCount} pages prévues, dans la limite modélisée du plan retenu.`,
    webflowExtraBandwidth ? `${webflowExtraBandwidth} palier(s) additionnel(s) de 50 Go.` : "Aucun palier de bande passante additionnel estimé.",
    `${seats} éditeur(s) ; ${Math.max(0, seats - 1)} siège(s) Full supplémentaire(s) estimés à 39 $/mois chacun.`,
  ], ["Domaine personnalisé", "Hébergement managé", "Formulaires"], ["La bande passante et certains outils sont en option ou soumis à usage."], "Le calcul estime 1 Go pour 1 000 visites, puis ajoute des blocs de 50 Go quand le plan le permet."));

  const wixCommerce = needsCommerce;
  const wixBusiness = project.cms === "heavy" || trafficCount > 125000 || seats >= 10;
  const wixCore = wixCommerce || project.cms === "light" || has(project, "members");
  const wixPlan = wixBusiness ? "Business" : wixCore ? "Core" : "Light";
  results.push(estimate(project, { id: "wix", name: "Wix", logo: "wix", ...base.builder, pricingUrl: "https://www.wix.com/plans" }, wixPlan, selectedUsd(project, wixBusiness ? 36 : wixCore ? 29 : 17, wixBusiness ? 43 : wixCore ? 36 : 24), [
    wixCommerce ? "Le scénario comprend des paiements en ligne : un plan e-commerce est retenu." : "Domaine personnalisé activé : le plan gratuit Wix n’est pas retenu.",
    project.cms === "heavy" ? "Le volume de contenu pousse vers l’offre Business." : `${pageCount} pages prévues.`,
    usageSentence,
  ], ["Domaine personnalisé", "Hébergement managé", "Éditeur visuel"], ["Tarifs et fonctionnalités Wix varient selon le pays ; applications et e-commerce peuvent ajouter des frais."], "Le tarif Wix affiché est une référence publique américaine convertie en euros ; vérifiez le prix local avant achat."));

  const squarespacePro = needsCommerce || project.cms === "heavy" || has(project, "members") || has(project, "abtest");
  results.push(estimate(project, { id: "squarespace", name: "Squarespace", logo: "squarespace", ...base.builder, pricingUrl: "https://www.squarespace.com/pricing" }, squarespacePro ? "Core" : "Basic", selectedUsd(project, squarespacePro ? 23 : 16, squarespacePro ? 36 : 25), [
    needsCommerce ? "Un plan adapté au paiement en ligne est requis." : "Le plan Basic couvre le site sans fonctionnalité commerciale avancée.",
    has(project, "members") ? "Les membres peuvent nécessiter des fonctions ou frais supplémentaires." : usageSentence,
    `${pageCount} pages prévues ; le plan n’est pas facturé à la page dans ce modèle.`,
  ], ["Domaine personnalisé (première année sur annuel)", "Hébergement managé", "Formulaires"], ["Le prix local et les frais de transaction dépendent du plan et du pays."], "Le niveau de plan est choisi d’après le besoin e-commerce, CMS et membres."));

  const wpPlan = needsCommerce || code || has(project, "members") || project.cms === "heavy" ? "Business / Commerce" : needsCms || has(project, "multilingual") ? "Premium" : "Personal";
  const wpUsd = wpPlan === "Business / Commerce" ? selectedUsd(project, 25, 40) : wpPlan === "Premium" ? selectedUsd(project, 8, 18) : selectedUsd(project, 4, 9);
  results.push(estimate(project, { id: "wordpress", name: "WordPress.com", logo: "wordpress", ...base.builder, pricingUrl: "https://wordpress.com/pricing/" }, wpPlan, wpUsd, [
    wpPlan === "Personal" ? "Le plan Personal suffit pour un site simple." : `Le CMS ou les fonctions demandées font retenir ${wpPlan}.`,
    code ? "Les extensions et fonctions avancées sont accessibles dans le plan retenu." : usageSentence,
    `${pageCount} pages prévues, extensibles via pages et extensions.`,
  ], ["Domaine personnalisé (première année sur annuel)", "CMS", "Thèmes et extensions selon le plan"], ["Le prix promo à l’inscription peut différer du prix de renouvellement ; extensions et hébergement additionnel non inclus."], "Prix indicatifs d’après les tarifs publics WordPress.com, hors extensions tierces."));

  results.push(estimate(project, { id: "vercel", name: "Vercel", logo: "vercel", ...base.hosting, pricingUrl: "https://vercel.com/pricing" }, "Pro (usage professionnel)", 20, ["Option d’hébergement pour un projet développé en code (Next.js, React, etc.).", "Le plan Hobby gratuit est destiné aux projets personnels ; le comparatif retient Pro pour un site professionnel.", usageSentence], ["Domaine personnalisé", "CDN et déploiement"], ["Le calcul inclut le forfait Pro et non un dépassement éventuel de consommation."], "Nécessite une équipe de développement et le coût de conception n’est pas inclus."));

  const cfWorker = code || has(project, "members");
  results.push(estimate(project, { id: "cloudflare", name: "Cloudflare Pages + Workers", logo: "cloudflare", ...base.hosting, pricingUrl: "https://developers.cloudflare.com/workers/platform/pricing/" }, cfWorker ? "Workers Paid" : "Pages statique", cfWorker ? 5 : 0, [
    code ? "Le backend sélectionné implique un Worker." : "Un site statique peut rester sur Pages sans forfait mensuel.",
    cfWorker ? "Le forfait Workers commence à 5 $/mois, usage inclus selon quotas." : "Hébergement statique, adapté aux pages vitrines codées.",
    usageSentence,
  ], ["Domaine personnalisé", "CDN mondial", "Pages statiques"], ["Un développeur doit construire et maintenir le site ; usage Worker au-delà des quotas facturé à part."], "Le montant est le minimum de forfait ; consommation additionnelle non incluse."));

  const netlifyCredits = seats > 1 ? 20 : trafficCount <= 10000 ? 0 : trafficCount <= 50000 ? 9 : 20;
  const netlifyPlan = netlifyCredits === 0 ? "Free" : netlifyCredits === 9 ? "Personal" : "Pro";
  results.push(estimate(project, { id: "netlify", name: "Netlify", logo: "netlify", ...base.hosting, pricingUrl: "https://www.netlify.com/pricing/" }, netlifyPlan, netlifyCredits, ["Les crédits mensuels sont estimés à partir du trafic demandé.", netlifyPlan === "Free" ? "Hypothèse d’usage dans le quota gratuit." : `${netlifyPlan} est retenu pour augmenter le quota de crédits.`, seats > 1 ? "Pro est retenu pour votre équipe multi-membres." : usageSentence], ["Domaine personnalisé", "Déploiement Git", "CDN"], ["Compute, bande passante et requêtes consomment des crédits ; dépasser le quota peut coûter plus cher."], "Coût estimé à partir du forfait de crédits ; l’usage réel peut modifier le montant."));

  const githubCompatible = !needsCommerce && !code && !needsCms && !has(project, "members") && !has(project, "abtest");
  results.push(estimate(project, { id: "github-pages", name: "GitHub Pages", logo: "github", ...base.hosting, pricingUrl: "https://pages.github.com/" }, "Gratuit", 0, ["Hébergement adapté aux sites statiques versionnés avec Git.", "Le CMS, le paiement ou un backend demandé n’est pas fourni nativement.", usageSentence], ["Hébergement statique", "Domaine personnalisé", "HTTPS"], ["Pas de constructeur visuel, base de données, CMS intégré ou commerce natif."], "Le prix d’hébergement est nul ; prévoir le temps ou le coût de développement.", !githubCompatible));

  const carrdCompatible = project.siteType === "landing" && pageCount === 1 && !needsCms && !needsCommerce && !code && !has(project, "members") && !has(project, "multilingual") && !has(project, "abtest") && seats === 1 && project.billing === "yearly";
  results.push(estimate(project, { id: "carrd", name: "Carrd", logo: "carrd", ...base.builder, pricingUrl: "https://carrd.co/docs/pro/plans" }, "Pro Standard (facturation annuelle)", 19 / 12, ["Carrd est conçu pour les sites d’une seule page.", "Pro Standard inclut le domaine personnalisé et les formulaires.", "Le forfait est payé annuellement, même si son coût est ramené au mois pour la comparaison."], ["Une page", "Domaine personnalisé", "Formulaires"], ["CMS, commerce natif, backend et collaboration avancée ne sont pas inclus dans ce forfait."], "Tarif public de 19 $/an ; coût mensuel équivalent affiché pour comparer les plateformes.", !carrdCompatible));

  const dorikBusiness = pageCount > 25 || seats > 1 || project.cms === "heavy";
  const dorikCompatible = !needsCommerce && !code && seats <= 10;
  results.push(estimate(project, { id: "dorik", name: "Dorik", logo: "dorik", ...base.builder, pricingUrl: "https://dorik.com/pricing" }, dorikBusiness ? "Business" : "Personal", selectedUsd(project, dorikBusiness ? 41.5 : 20.75, dorikBusiness ? 59 : 29), [dorikBusiness ? "Le plan Business couvre davantage de pages et plusieurs collaborateurs." : "Le plan Personal couvre au plus 25 pages et un éditeur.", `${pageCount} pages et ${seats} éditeur(s) estimés.`, "Le prix retenu dépend de la facturation annuelle ou mensuelle choisie."], ["Domaine personnalisé", "CMS et blog", "Hébergement managé"], ["Un parcours e-commerce complet ou un backend sur mesure nécessite une solution supplémentaire."], "Tarifs publics Dorik hors remise promotionnelle et hors taxes.", !dorikCompatible));

  const dudaPlan = seats > 3 ? "Agency" : seats > 1 ? "Team" : "Basic";
  const dudaAnnualUsd = seats > 3 ? 52 : seats > 1 ? 29 : 19;
  const dudaMonthlyUsd = seats > 3 ? 69 : seats > 1 ? 39 : 25;
  results.push(estimate(project, { id: "duda", name: "Duda", logo: "duda", ...base.builder, pricingUrl: "https://www.duda.co/pricing" }, dudaPlan, selectedUsd(project, dudaAnnualUsd, dudaMonthlyUsd), [`${seats} éditeur(s) : le plan ${dudaPlan} est retenu.`, "Le forfait comprend au moins un site publié.", `${pageCount} pages prévues dans cette simulation.`], ["Éditeur visuel", "Hébergement et CDN", "Site publié inclus"], ["E-commerce et réservations peuvent nécessiter un achat supplémentaire ; les très grandes équipes doivent demander un devis."], "Tarif par compte pour un site publié ; les sites supplémentaires et options ne sont pas chiffrés.", needsCommerce || code || seats > 6));

  const ghostPublisher = seats > 1 || needsCommerce || has(project, "members") || project.cms === "heavy";
  const ghostCompatible = (project.siteType === "blog" || project.cms !== "none") && !code && seats <= 3 && project.billing === "yearly";
  results.push(estimate(project, { id: "ghost", name: "Ghost(Pro)", logo: "ghost", ...base.builder, pricingUrl: "https://ghost.org/pricing" }, ghostPublisher ? "Publisher (facturation annuelle)" : "Starter (facturation annuelle)", ghostPublisher ? 29 : 18, ["Ghost est principalement adapté aux blogs, publications et newsletters.", ghostPublisher ? "Publisher permet plusieurs membres d’équipe et les abonnements payants." : "Starter couvre une publication simple avec un éditeur.", "Le tarif public affiché correspond à une facturation annuelle."], ["Site et CMS", "Newsletter", "Domaine personnalisé"], ["Le tarif mensuel et les besoins de commerce hors abonnements ne sont pas estimés ici."], "Prix public Ghost(Pro) en dollars, facturé annuellement ; options et taxes non incluses.", !ghostCompatible));

  if (project.siteType === "ecommerce") {
    results.push(estimate(project, { id: "shopify", name: "Shopify", logo: "shopify", ...base.builder, pricingUrl: "https://www.shopify.com/pricing" }, "Basic", selectedUsd(project, 29, 39), ["Le besoin e-commerce fait apparaître Shopify dans la comparaison.", "Le plan Basic comprend la boutique, le catalogue et le checkout.", usageSentence], ["Boutique en ligne", "Produits et commandes", "Paiement intégré"], ["Frais de paiement, applications, domaine et éventuels frais de transaction ne sont pas inclus."], "Tarif de base en USD converti ; les tarifs localisés et frais de paiement varient."));
  }

  if (project.siteType === "webapp" || has(project, "backend")) {
    const firebaseUsd = trafficCount > 50000 ? 12 : 0;
    results.push(estimate(project, { id: "firebase", name: "Firebase Hosting", logo: "firebase", ...base.hosting, pricingUrl: "https://firebase.google.com/pricing" }, firebaseUsd ? "Blaze (usage estimé)" : "Spark / Blaze", firebaseUsd, ["Hébergement et services backend adaptés à une web app.", `${usageSentence} Un budget d’usage indicatif est ajouté au-delà de 50 000 visites.`, "Le trafic n’est pas un forfait fixe : stockage, requêtes et transferts déterminent le coût."], ["Hébergement statique", "Services backend optionnels", "CDN"], ["Tarification à l’usage ; le montant affiché est une enveloppe illustrative, pas une facture garantie."], "Le coût réel dépend du stockage, des requêtes et du transfert de données."));
    const renderUsd = project.siteType === "webapp" || code ? 7 : 0;
    results.push(estimate(project, { id: "render", name: "Render", logo: "render", ...base.hosting, pricingUrl: "https://render.com/pricing" }, renderUsd ? "Starter Web Service" : "Static site", renderUsd, ["Déploiement depuis Git, avec service web si un backend est nécessaire.", `${usageSentence} Les instances ou bases de données peuvent augmenter le coût.`], ["Hébergement statique", "Déploiement Git", "Services web"], ["Un site web-service en veille ou une base de données persistante peut exiger un plan payant."], "Le plan Starter est le minimum pour un service dynamique ; base de données non incluse."));
    const railwayUsd = 5 + (trafficCount > 50000 ? 5 : 0);
    results.push(estimate(project, { id: "railway", name: "Railway", logo: "railway", ...base.hosting, pricingUrl: "https://railway.com/pricing" }, "Developer / usage minimum", railwayUsd, ["Hébergement applicatif avec backend et services déployés depuis Git.", `${usageSentence} Le tarif est fondé sur un minimum mensuel puis la consommation.`], ["Déploiement applicatif", "Variables et services backend", "Usage flexible"], ["La consommation CPU, mémoire et réseau peut faire varier la facture."], "Minimum estimé ; montant réel calculé à l’usage."));
  }

  return results.sort((a, b) => Number(b.compatible) - Number(a.compatible) || Number(a.priceIsQuote) - Number(b.priceIsQuote) || a.monthlyPrice - b.monthlyPrice);
}

export const PLATFORM_LOGO_CDN = "https://cdn.simpleicons.org";
