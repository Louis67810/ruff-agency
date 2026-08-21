import React from "react";
import { createRoot } from "react-dom/client";
import ArticlesRessource, { CTA_PROFILE } from "./ArticlesRessource.jsx";

const sourceImages = [
  "https://framerusercontent.com/images/w6ciCcNESabQAAUEF0ypoFjelbY.png?width=1441&height=939",
  "https://framerusercontent.com/images/89SDpeYm9KEXxaHH1EeT0lZHneo.png?width=1339&height=1069",
  "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854",
];

const tags = [
  { id: "actualités", label: "Actualités" },
  { id: "guide", label: "Guide" },
  { id: "conseils", label: "Conseils" },
  { id: "outils", label: "Outils" },
  { id: "acquisition", label: "Acquisition" },
];

const titles = [
  "Titre d’article de démonstration pour vérifier la mise en page",
  "Comment améliorer une landing page sans perdre en clarté",
  "Guide pratique pour structurer une page qui convertit",
  "Les éléments à vérifier avant de publier un nouveau site",
  "Outils utiles pour concevoir plus vite et plus proprement",
  "Acquisition : construire une page adaptée à votre trafic",
  "Une méthode simple pour hiérarchiser le contenu d’une page",
  "Ce qu’il faut mesurer après la mise en ligne d’une landing page",
  "Conseils de design pour garder une interface lisible",
  "Les bases d’une expérience web cohérente",
];

const articles = titles.map((title, index) => {
  const tag = tags[index % tags.length];
  return {
    id: String(index + 1),
    slug: `demo-${index + 1}`,
    tagId: tag.id,
    tag: tag.label,
    title,
    image: { src: sourceImages[index % sourceImages.length], alt: "" },
    author: "Louis Staub",
    authorPhoto: { src: CTA_PROFILE },
  };
});

createRoot(document.getElementById("root")).render(
  <ArticlesRessource
    tags={tags}
    articles={articles}
    callHref="#"
    getArticleHref={() => "#"}
  />
);
