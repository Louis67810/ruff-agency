import type { FreeTool } from "./free-tools";
import { translateData } from "./translation-map";

export function getEnglishFreeTool(tool: FreeTool): FreeTool {
  const translated = translateData(tool);
  return {
    ...translated,
    title: translated.title === "Test outil Landing Page" ? "Landing Page Tool Test" : translated.title,
    description: translated.description === "Une page outil statique pour vérifier le template avant d’ajouter vos vrais outils." ? "A static tool page for validating the template before adding your real tools." : translated.description,
    href: `/outils-gratuits/${tool.slug}`,
  };
}

export function getEnglishFreeTools(list: FreeTool[]) { return list.map(getEnglishFreeTool); }
