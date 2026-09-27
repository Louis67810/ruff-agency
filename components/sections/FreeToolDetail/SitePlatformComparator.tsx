"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowUpDown, Check, ChevronDown, ExternalLink, Maximize, X } from "lucide-react";
import Image from "next/image";
import HeroSectionSlugRessource from "@/components/sections/HeroSectionSlugRessource/HeroSectionSlugRessource";
import ResourceShare from "@/components/sections/RessourceArticle/ResourceShare";
import { estimatePlatforms, PLATFORM_LOGO_CDN, type PlatformEstimate, type SiteBilling, type SiteCmsNeed, type SiteFeature, type SitePageBand, type SiteProjectType, type SiteTrafficBand, type SiteTeamBand } from "@/lib/site-platform-comparator";
import "./RedesignRoiTool.css";
import "./SitePlatformComparator.css";

type Locale = "fr" | "en";
type Props = { locale: Locale; homeHref: string; toolsHref: string; title: string; description: string };
type ChoiceField = "site" | "pages" | "traffic" | "cms" | "team" | "billing";
type OverlayField = ChoiceField | "features";

const USD_TO_EUR_REFERENCE = { fr: "1 € = 1,1403 $ (taux de référence BCE, 25/09/2026)", en: "€1 = $1.1403 (ECB reference rate, 25 Sep 2026)" };
const fields = {
  site: { fr: "Quel type de site voulez-vous créer ?", en: "What type of site do you want to create?" },
  pages: { fr: "Combien de pages ?", en: "How many pages?" },
  traffic: { fr: "Combien de visiteurs par mois ?", en: "How many monthly visitors?" },
  cms: { fr: "Avez-vous besoin d’un CMS ?", en: "Do you need a CMS?" },
  features: { fr: "De quelles fonctionnalités avez-vous besoin ?", en: "Which features do you need?" },
  team: { fr: "Combien de personnes modifieront le site ?", en: "How many people will edit the site?" },
  billing: { fr: "Paiement souhaité", en: "Preferred billing" },
} as const;

const choices = {
  site: [
    ["landing", "Landing page", "Landing page"], ["showcase", "Site vitrine", "Business site"], ["blog", "Blog", "Blog"], ["ecommerce", "E-commerce", "E-commerce"], ["webapp", "Web app", "Web app"],
  ] as [SiteProjectType, string, string][],
  pages: [["one", "1", "1"], ["ten", "2–10", "2–10"], ["fifty", "11–50", "11–50"], ["150", "50–150", "50–150"], ["150plus", "150+", "150+"]] as [SitePageBand, string, string][],
  traffic: [["under1k", "Moins de 1 000", "Under 1,000"], ["1to10k", "1 000–10 000", "1,000–10,000"], ["10to50k", "10 000–50 000", "10,000–50,000"], ["50to200k", "50 000–200 000", "50,000–200,000"], ["200plus", "200 000+", "200,000+"], ["unknown", "Je ne sais pas", "I’m not sure"]] as [SiteTrafficBand, string, string][],
  cms: [["none", "Non", "No"], ["light", "Petit blog", "Small blog"], ["heavy", "Beaucoup de contenu", "Lots of content"]] as [SiteCmsNeed, string, string][],
  team: [["one", "1 personne", "1 person"], ["three", "2–3", "2–3"], ["ten", "4–10", "4–10"], ["more", "10+", "10+"]] as [SiteTeamBand, string, string][],
};
const featureOptions: { id: SiteFeature; fr: string; en: string }[] = [
  { id: "forms", fr: "Formulaire", en: "Forms" }, { id: "payments", fr: "Paiement", en: "Payments" }, { id: "members", fr: "Membres", en: "Members" }, { id: "multilingual", fr: "Multilingue", en: "Multilingual" }, { id: "backend", fr: "Backend", en: "Backend" }, { id: "abtest", fr: "A/B test", en: "A/B testing" },
];
const billingOptions: [SiteBilling, string, string][] = [["yearly", "Annuel", "Yearly"], ["monthly", "Mensuel", "Monthly"]];

function fieldOptions(field: ChoiceField): [string, string, string][] {
  return field === "billing" ? billingOptions : choices[field];
}

function euro(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

export default function SitePlatformComparator({ locale, homeHref, toolsHref, title, description }: Props) {
  const english = locale === "en";
  const [siteType, setSiteType] = useState<SiteProjectType>("landing");
  const [pages, setPages] = useState<SitePageBand>("ten");
  const [traffic, setTraffic] = useState<SiteTrafficBand>("unknown");
  const [cms, setCms] = useState<SiteCmsNeed>("none");
  const [features, setFeatures] = useState<SiteFeature[]>([]);
  const [team, setTeam] = useState<SiteTeamBand>("one");
  const [billing, setBilling] = useState<SiteBilling>("yearly");
  const [activeField, setActiveField] = useState<OverlayField | null>(null);
  const [draftFeatures, setDraftFeatures] = useState<SiteFeature[]>([]);
  const [details, setDetails] = useState<PlatformEstimate | null>(null);
  const [sortDescending, setSortDescending] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => setPageUrl(window.location.href), []);
  useEffect(() => {
    if (!details) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setDetails(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [details]);
  useEffect(() => {
    if (!activeField) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setActiveField(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeField]);

  const project = useMemo(() => ({ siteType, pages, traffic, cms, features, team, billing }), [siteType, pages, traffic, cms, features, team, billing]);
  const platforms = useMemo(() => estimatePlatforms(project), [project]);
  const sortedPlatforms = useMemo(() => [...platforms].sort((a, b) => Number(b.compatible) - Number(a.compatible) || Number(a.priceIsQuote) - Number(b.priceIsQuote) || (sortDescending ? b.monthlyPrice - a.monthlyPrice : a.monthlyPrice - b.monthlyPrice)), [platforms, sortDescending]);
  const values: Record<ChoiceField, string> = { site: siteType, pages, traffic, cms, team, billing };
  const openField = (field: OverlayField) => { setDraftFeatures(features); setActiveField(field); };
  const chooseOption = (field: ChoiceField, value: string) => {
    if (field === "site") setSiteType(value as SiteProjectType);
    if (field === "pages") setPages(value as SitePageBand);
    if (field === "traffic") setTraffic(value as SiteTrafficBand);
    if (field === "cms") setCms(value as SiteCmsNeed);
    if (field === "team") setTeam(value as SiteTeamBand);
    if (field === "billing") setBilling(value as SiteBilling);
    setActiveField(null);
  };
  const toggleDraftFeature = (feature: SiteFeature) => setDraftFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);

  return <main className="ftd ftd--platform-comparator">
    <HeroSectionSlugRessource locale={locale} className="hsr-root--roi hsr-root--platform-comparator" breadcrumbTitle={title} title={title} subtitle={description} homeHref={homeHref} resourcesHref={toolsHref} resourcesLabel={english ? "Free tools" : "Outils gratuits"} articleHref="/outils-gratuits/comparateur-prix-plateformes" hideMeta centered>
      <>
        <div className="rrt-card spc-card">
          <form className="rrt-inputs spc-inputs" onSubmit={(event) => event.preventDefault()}>
            <span className="rrt-kicker">{english ? "Interactive tool" : "Outil interactif"}</span>
            <h2>{english ? "Describe your project" : "Décrivez votre projet"}</h2>
            <p className="rrt-subtitle">{english ? "A few details are enough to compare the plans that fit your site." : "Quelques informations suffisent pour comparer les offres adaptées à votre site."}</p>
            <div className="rrt-divider" />
            <div className="spc-form-scroll">
              {(["site", "pages", "traffic", "cms"] as ChoiceField[]).map((field) => <Question key={field} title={fields[field][locale]}><SelectField value={values[field]} options={fieldOptions(field)} english={english} onClick={() => openField(field)} /></Question>)}
              <Question title={fields.features[locale]}><button className="rrt-domain spc-select-trigger" type="button" aria-expanded={activeField === "features"} aria-haspopup="dialog" onClick={() => openField("features")}><span>{features.length ? featureOptions.filter((item) => features.includes(item.id)).map((item) => english ? item.en : item.fr).join(", ") : (english ? "Select features" : "Sélectionner les fonctionnalités")}</span><ChevronDown size={19} /></button></Question>
              {(["team", "billing"] as ChoiceField[]).map((field) => <Question key={field} title={fields[field][locale]}><SelectField value={values[field]} options={fieldOptions(field)} english={english} onClick={() => openField(field)} /></Question>)}
            </div>
            {activeField && <div className="spc-field-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveField(null); }}>
              <div className="spc-field-panel" role="dialog" aria-label={fields[activeField][locale]}>
                <header><strong>{fields[activeField][locale]}</strong><button type="button" aria-label={english ? "Close choices" : "Fermer les choix"} onClick={() => setActiveField(null)}><X size={19} /></button></header>
                <div className="spc-field-options">
                  {activeField === "features" ? featureOptions.map((feature) => <button className="spc-field-option" type="button" key={feature.id} aria-pressed={draftFeatures.includes(feature.id)} onClick={() => toggleDraftFeature(feature.id)}><span>{english ? feature.en : feature.fr}</span><i className={draftFeatures.includes(feature.id) ? "is-selected" : ""}>{draftFeatures.includes(feature.id) && <Check size={15} />}</i></button>) : fieldOptions(activeField).map(([value, fr, en]) => <button className="spc-field-option" type="button" key={value} aria-pressed={values[activeField] === value} onClick={() => chooseOption(activeField, value)}><span>{english ? en : fr}</span>{values[activeField] === value && <Check size={18} />}</button>)}
                </div>
                {activeField === "features" && <footer><button type="button" onClick={() => { setFeatures(draftFeatures); setActiveField(null); }}>{english ? "Confirm" : "Valider"}</button></footer>}
              </div>
            </div>}
          </form>

          <section className="rrt-results spc-results" aria-live="polite">
            <div className="rrt-result-scroll spc-result-scroll">
            <div className="spc-results-head"><h3>{english ? "Solutions for your project" : "Les solutions pour votre projet"}</h3><button className={`spc-sort${sortDescending ? " is-descending" : ""}`} type="button" onClick={() => setSortDescending((current) => !current)} aria-label={sortDescending ? (english ? "Sort from cheapest to most expensive" : "Trier du moins cher au plus cher") : (english ? "Sort from most expensive to cheapest" : "Trier du plus cher au moins cher")} title={sortDescending ? (english ? "Most expensive first" : "Du plus cher au moins cher") : (english ? "Cheapest first" : "Du moins cher au plus cher")}><ArrowUpDown size={18} /></button></div>
            <div className="spc-platform-list" key={sortDescending ? "descending" : "ascending"}>{sortedPlatforms.map((platform) => <PlatformRow key={platform.id} item={platform} english={english} onDetails={() => setDetails(platform)} />)}</div>
            </div>
            {details && <div className="spc-details-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetails(null); }}>
              <article className="spc-details-panel" role="dialog" aria-modal="true" aria-label={`${english ? "Details for" : "Détails de"} ${details.name}`}>
                <header><div className="spc-details-brand"><Logo item={details} /><div><h4>{details.name}</h4></div></div><button type="button" className="spc-close" aria-label={english ? "Close details" : "Fermer les détails"} onClick={() => setDetails(null)}><X size={18} /></button></header>
                <div className="spc-detail-price"><div><span>{details.plan}</span><strong>{details.priceIsQuote ? (english ? "Custom quote" : "Sur devis") : details.compatible ? `${euro(details.monthlyPrice, locale)} / ${english ? "month" : "mois"}` : (english ? "Not a match" : "Peu adapté")}</strong></div><span>{details.priceIsQuote ? (english ? "Price to confirm" : "Tarif à confirmer") : details.compatible ? `${euro(details.annualPrice, locale)} / ${english ? "year" : "an"}` : (english ? "See why below" : "Voir les limites ci-dessous")}</span></div>
                <DetailGroup title={english ? "Why this plan?" : "Pourquoi ce plan ?"} rows={details.reasons} />
                <DetailGroup title={english ? "Included in this estimate" : "Inclus dans cette estimation"} rows={details.included} />
                <DetailGroup title={english ? "Points to check" : "À vérifier"} rows={details.limits} />
                <div className="spc-detail-footnote">{details.note}<a href={details.pricingUrl} target="_blank" rel="noreferrer">{english ? "View official pricing" : "Consulter le tarif officiel"}<ExternalLink size={13} /></a></div>
              </article>
            </div>}
          </section>
        </div>
        <p className="rrt-disclaimer">{english ? `Public prices checked on 27 Sep 2026; USD converted at ${USD_TO_EUR_REFERENCE.en}. Estimates are not a guaranteed final price.` : `Tarifs publics consultés le 27/09/2026 ; conversion des prix en dollars au taux BCE du 25/09/2026. Estimations sans garantie de prix final.`}</p>
        <div className="rrt-share"><ResourceShare url={pageUrl} title={title} locale={locale} /></div>
      </>
    </HeroSectionSlugRessource>

    <section className="ftd-roi-article spc-article">
      <nav className="ftd-roi-toc" aria-label={english ? "Contents" : "Sommaire"}><strong>{english ? "Contents" : "Sommaire"}</strong><a href="#spc-methode">{english ? "How the comparison works" : "Comment fonctionne le comparateur"}</a><a href="#spc-prix">{english ? "What is included in the price" : "Ce qui est inclus dans le prix"}</a><a href="#spc-hebergement">{english ? "Builders and hosting compared" : "Créateurs de site et hébergement"}</a><a href="#spc-limites">{english ? "Limits of the estimate" : "Limites de l’estimation"}</a></nav>
      <article className="ftd-roi-prose"><h2 id="spc-methode">{english ? "How the comparison works" : "Comment fonctionne le comparateur"}</h2><p>{english ? "Your answers determine which minimum plan is likely to support your website. The estimate considers pages, visitor volume, content management, requested features, team size and billing frequency. When traffic is unknown, the calculation uses a standard scenario." : "Vos réponses servent à estimer le plan minimal qui pourrait convenir à votre site. Le calcul prend en compte le nombre de pages, le volume de visiteurs, le contenu, les fonctionnalités, la taille de l’équipe et la fréquence de facturation. Si le trafic est inconnu, le calcul utilise un scénario standard."}</p><hr className="ra-article-divider" aria-hidden="true" /><h2 id="spc-prix">{english ? "What is included in the displayed price?" : "Que comprend le prix affiché ?"}</h2><p>{english ? "The comparison focuses on the recurring platform or hosting plan needed for the selected scenario. It does not include custom development, paid themes or apps, domain renewal, payment processing fees, taxes, or usage above included limits." : "La comparaison porte sur le forfait récurrent de la plateforme ou de l’hébergement nécessaire au scénario choisi. Elle n’inclut pas le développement sur mesure, les thèmes ou applications payants, le renouvellement du domaine, les frais de paiement, les taxes ni les dépassements des quotas inclus."}</p><hr className="ra-article-divider" aria-hidden="true" /><h2 id="spc-hebergement">{english ? "Website builders and code hosting are different" : "Créateurs de site et hébergement : deux approches"}</h2><p>{english ? "Framer, Webflow, Wix, Squarespace, WordPress.com, Carrd, Dorik, Duda and Ghost(Pro) provide visual site-building or publishing tools. Vercel, Cloudflare, Netlify, GitHub Pages, Firebase, Render and Railway primarily host code or applications and usually require a developer. Their subscription price can be lower, but the cost of building and maintaining the site is separate." : "Framer, Webflow, Wix, Squarespace, WordPress.com, Carrd, Dorik, Duda et Ghost(Pro) proposent des outils visuels de création ou de publication. Vercel, Cloudflare, Netlify, GitHub Pages, Firebase, Render et Railway hébergent surtout du code ou des applications et nécessitent généralement un développeur. Leur abonnement peut être moins élevé, mais le coût de création et de maintenance du site reste séparé."}</p><hr className="ra-article-divider" aria-hidden="true" /><h2 id="spc-limites">{english ? "Limits of the estimate" : "Limites de l’estimation"}</h2><p>{english ? "Prices and plan limits can change, and some vendors adjust their rates by country. The results are estimates based on public starting prices and a simplified model; confirm the total on the provider’s checkout page before subscribing." : "Les prix et les limites des offres évoluent, et certains fournisseurs adaptent leurs tarifs selon le pays. Les résultats sont des estimations basées sur les tarifs publics de départ et un modèle simplifié ; vérifiez le montant final sur le site du fournisseur avant de souscrire."}</p></article>
    </section>
  </main>;
}

function Question({ title, children }: { title: string; children: ReactNode }) { return <fieldset className="rrt-field spc-question"><legend>{title}</legend>{children}</fieldset>; }
function SelectField({ value, options, english, onClick }: { value: string; options: [string, string, string][]; english: boolean; onClick: () => void }) { const selected = options.find(([id]) => id === value); return <button className="rrt-domain spc-select-trigger" type="button" aria-haspopup="dialog" onClick={onClick}><span>{selected?.[english ? 2 : 1] ?? "—"}</span><ChevronDown size={19} /></button>; }
function Logo({ item }: { item: PlatformEstimate }) { const faviconDomain = item.id === "dorik" ? "dorik.com" : item.id === "duda" ? "duda.co" : null; return <span className="spc-logo"><span aria-hidden="true">{item.name.slice(0, 1)}</span><Image src={faviconDomain ? `https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=64` : `${PLATFORM_LOGO_CDN}/${item.logo}`} alt="" width={23} height={23} loading="lazy" unoptimized onError={(event) => { event.currentTarget.style.display = "none"; }} /></span>; }
function PlatformRow({ item, english, onDetails }: { item: PlatformEstimate; english: boolean; onDetails: () => void }) {
  return <button className={`spc-platform-row${item.compatible ? "" : " is-limited"}`} type="button" onClick={onDetails} aria-label={`${english ? "View details for" : "Voir les détails de"} ${item.name}`}><Logo item={item} /><span className="spc-platform-name"><strong>{item.name}</strong><span>{item.category}{!item.compatible && ` · ${english ? "limited fit" : "compatibilité limitée"}`}</span></span><span className="spc-platform-price"><span className="spc-price-main"><strong>{item.priceIsQuote ? (english ? "Custom quote" : "Sur devis") : item.compatible ? euro(item.monthlyPrice, english ? "en" : "fr") : "—"}</strong><em>{item.priceIsQuote ? "" : english ? "/ month" : "/ mois"}</em></span><small>{item.priceIsQuote ? (english ? "price to confirm" : "prix à confirmer") : item.compatible ? `${euro(item.annualPrice, english ? "en" : "fr")} / ${english ? "year" : "an"}` : (english ? "not a match" : "non adapté")}</small></span><span className="spc-detail-icon" aria-hidden="true"><Maximize size={16} strokeWidth={1.8} /></span></button>;
}
function DetailGroup({ title, rows }: { title: string; rows: string[] }) { return <section className="spc-detail-group"><h5>{title}</h5><ul>{rows.map((row) => <li key={row}>{row}</li>)}</ul></section>; }
