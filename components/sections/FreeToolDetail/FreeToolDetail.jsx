"use client";

import { useMemo, useState } from "react";
import HeroSectionSlugRessource from "@/components/sections/HeroSectionSlugRessource/HeroSectionSlugRessource";
import RedesignRoiTool from "./RedesignRoiTool";
import SitePlatformComparator from "./SitePlatformComparator";
import "./FreeToolDetail.css";

function ValuePropositionTool({ english = false }) {
  const [audience, setAudience] = useState("");
  const [problem, setProblem] = useState("");
  const [benefit, setBenefit] = useState("");
  const proposition = useMemo(() => {
    if (!audience || !problem || !benefit)
      return english
        ? "Fill in all three fields to generate your value proposition."
        : "Renseignez les trois champs pour générer votre proposition de valeur.";
    return english
      ? `We help ${audience} achieve ${benefit}, without ${problem}.`
      : `Nous aidons ${audience} à ${benefit}, sans ${problem}.`;
  }, [audience, problem, benefit, english]);

  return (
    <div className="ftd-tool">
      <label>
        {english ? "Your audience" : "Votre cible"}
        <input
          value={audience}
          onChange={(event) => setAudience(event.target.value)}
          placeholder={english ? "E.g. B2B agencies" : "Ex. les agences B2B"}
        />
      </label>
      <label>
        {english ? "Problem avoided" : "Le problème évité"}
        <input
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
          placeholder={
            english ? "E.g. losing prospects" : "Ex. perdre des prospects"
          }
        />
      </label>
      <label>
        {english ? "Main benefit" : "Le bénéfice principal"}
        <input
          value={benefit}
          onChange={(event) => setBenefit(event.target.value)}
          placeholder={
            english
              ? "E.g. convert more visitors"
              : "Ex. convertir plus de visiteurs"
          }
        />
      </label>
      <output>{proposition}</output>
    </div>
  );
}

function ConversionRateTool({ english = false }) {
  const [visitors, setVisitors] = useState(1000);
  const [conversions, setConversions] = useState(20);
  const rate = visitors > 0 ? ((conversions / visitors) * 100).toFixed(2) : "0";
  return (
    <div className="ftd-tool">
      <label>
        {english ? "Visitors" : "Visiteurs"}
        <input
          type="number"
          min="0"
          value={visitors}
          onChange={(event) => setVisitors(Number(event.target.value))}
        />
      </label>
      <label>
        {english ? "Conversions" : "Conversions"}
        <input
          type="number"
          min="0"
          value={conversions}
          onChange={(event) => setConversions(Number(event.target.value))}
        />
      </label>
      <output>
        <strong>{rate} %</strong>{" "}
        {english ? "conversion rate" : "de taux de conversion"}
      </output>
    </div>
  );
}

function LandingChecklistTool({ english = false }) {
  const items = english
    ? [
        "A clear promise from the hero",
        "A visible call to action",
        "Social proof",
        "A responsive page",
        "Fast loading speed",
      ]
    : [
        "Une promesse claire dès le hero",
        "Un appel à l’action visible",
        "Des preuves sociales",
        "Une page responsive",
        "Une vitesse de chargement soignée",
      ];
  const [checked, setChecked] = useState([]);
  return (
    <div className="ftd-tool ftd-tool--checklist">
      {items.map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={checked.includes(item)}
            onChange={() =>
              setChecked((values) =>
                values.includes(item)
                  ? values.filter((value) => value !== item)
                  : [...values, item],
              )
            }
          />
          {item}
        </label>
      ))}
      <output>
        {checked.length}/{items.length}{" "}
        {english ? "items checked" : "éléments vérifiés"}
      </output>
    </div>
  );
}

const TOOLS = {
  "value-proposition": ValuePropositionTool,
  "conversion-rate": ConversionRateTool,
  "landing-checklist": LandingChecklistTool,
};

export default function FreeToolDetail({
  tool,
  homeHref = "/",
  toolsHref = "/outils-gratuits",
  locale = "fr",
}) {
  const english = locale === "en";
  const Tool = TOOLS[tool.kind];
  if (tool.kind === "site-platform-comparator") return <SitePlatformComparator locale={locale} homeHref={homeHref} toolsHref={toolsHref} title={tool.title} description={tool.description} />;
  if (tool.kind === "redesign-roi") return (
    <main className="ftd ftd--roi">
      <HeroSectionSlugRessource
        locale={locale}
        className="hsr-root--roi"
        breadcrumbTitle={english ? "Redesign ROI estimator" : "Simulateur ROI de refonte"}
        title={tool.title}
        subtitle={english ? "Enter your numbers and discover what a better converting website could mean for your business." : "Renseignez vos chiffres et découvrez ce qu’un site plus performant pourrait changer pour votre activité."}
        homeHref={homeHref}
        resourcesHref={toolsHref}
        resourcesLabel={english ? "Free tools" : "Outils gratuits"}
        articleHref={tool.href}
        hideMeta
        centered
      ><RedesignRoiTool locale={locale} /></HeroSectionSlugRessource>
      <section className="ftd-roi-article">
        <nav className="ftd-roi-toc" aria-label={english ? "Contents" : "Sommaire"}>
          <strong>{english ? "Contents" : "Sommaire"}</strong>
          <a href="#methode">{english ? "How the estimate works" : "Comment fonctionne l’estimation"}</a>
          <a href="#qualification">{english ? "Lead quality" : "Qualification des visiteurs"}</a>
          <a href="#roi">{english ? "Understand the ROI" : "Comprendre le ROI"}</a>
          <a href="#limites">{english ? "Limits of the model" : "Limites du simulateur"}</a>
        </nav>
        <article className="ftd-roi-prose">
          <h2 id="methode">{english ? "How this estimate works" : "Comment fonctionne cette estimation"}</h2>
          <p>{english ? "The calculator starts from your current monthly sales and conversion rate to estimate monthly visits. It then applies a cautious conversion target linked to your sector and lead quality. Your average sale value turns the additional sales into potential revenue." : "Le simulateur part de vos ventes mensuelles et de votre taux de conversion actuel pour reconstituer une estimation des visites mensuelles. Il applique ensuite un objectif de conversion prudent, lié à votre activité et à la qualité des visiteurs. Le prix moyen d’une vente transforme les ventes supplémentaires en chiffre d’affaires potentiel."}</p>
          <div className="ftd-roi-note"><strong>{english ? "The formula" : "La formule"}</strong><p>{english ? "Estimated visits = current sales ÷ current conversion rate. Additional monthly revenue = (sales after redesign − current sales) × average sale value." : "Visites estimées = ventes actuelles ÷ taux de conversion actuel. CA mensuel supplémentaire = (ventes estimées après refonte − ventes actuelles) × prix moyen d’une vente."}</p></div>
          <hr className="ra-article-divider" aria-hidden="true" />
          <h2 id="qualification">{english ? "Why lead quality matters" : "Pourquoi la qualification des visiteurs compte"}</h2>
          <p>{english ? "A visitor already looking for your specific offer is more likely to buy than someone who is merely browsing. The qualification selector adjusts both the suggested starting rate and the achievable target. You can always replace the starting rate with your own observed figure." : "Une personne qui recherche déjà votre offre précise a davantage de chances d’acheter qu’un visiteur en simple découverte. Le sélecteur de qualification ajuste le taux proposé par défaut et l’objectif atteignable. Vous pouvez toujours remplacer le taux proposé par votre chiffre observé."}</p>
          <hr className="ra-article-divider" aria-hidden="true" />
          <h2 id="roi">{english ? "Reading the 12-month ROI" : "Lire le ROI sur 12 mois"}</h2>
          <p>{english ? "ROI compares 12 months of projected additional revenue with an illustrative €1,650 redesign service. The payback period estimates how many months of projected additional revenue would cover this assumption." : "Le ROI compare douze mois de chiffre d’affaires supplémentaire estimé à une hypothèse de prestation de refonte de 1 650 €. Le délai de retour estime combien de mois de chiffre d’affaires supplémentaire seraient nécessaires pour couvrir ce montant."}</p>
          <hr className="ra-article-divider" aria-hidden="true" />
          <h2 id="limites">{english ? "What the model cannot predict" : "Ce que le modèle ne peut pas prédire"}</h2>
          <p>{english ? "Sector rates are modelling assumptions, not measured benchmarks. Traffic quality, seasonality, margins, sales cycle and the quality of the new site can change the outcome. If your current rate is already above the target scenario, the tool shows no automatic uplift." : "Les taux par domaine sont des hypothèses de simulation, pas des moyennes mesurées du marché. La qualité du trafic, la saisonnalité, les marges, le cycle de vente et la qualité du nouveau site peuvent changer le résultat. Si votre taux actuel dépasse déjà l’objectif du scénario, l’outil n’ajoute pas de gain automatique."}</p>
        </article>
      </section>
    </main>
  );
  return (
    <main className="ftd">
      <HeroSectionSlugRessource
        locale={locale}
        className="hsr-root--tool"
        breadcrumbTitle={tool.title}
        title={tool.title}
        homeHref={homeHref}
        resourcesHref={toolsHref}
        resourcesLabel={english ? "Free tools" : "Outils gratuits"}
        articleHref={toolsHref}
        hideMeta
        centered
      >
        <div className="ftd-tool-frame">
          <div className="ftd-tool-heading">
            <span>{english ? "Free tool" : "Outil gratuit"}</span>
            <p>{tool.description}</p>
          </div>
          {Tool ? (
            <Tool english={english} />
          ) : (
            <div className="ftd-static">
              {english
                ? "Static preview of the tool template. The functional content will be added when this tool is ready."
                : "Aperçu statique du template outil. Le contenu fonctionnel sera ajouté lorsque cet outil sera prêt."}
            </div>
          )}
        </div>
      </HeroSectionSlugRessource>
    </main>
  );
}
