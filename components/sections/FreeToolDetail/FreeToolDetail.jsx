"use client";

import { useMemo, useState } from "react";
import HeroSectionSlugRessource from "@/components/sections/HeroSectionSlugRessource/HeroSectionSlugRessource";
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
