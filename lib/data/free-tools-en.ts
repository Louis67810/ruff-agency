import type { FreeTool } from "./free-tools";
import { translateData } from "./translation-map";

export function getEnglishFreeTool(tool: FreeTool): FreeTool {
  const translated = translateData(tool);
  return {
    ...translated,
    title: translated.title === "Test outil Landing Page" ? "Landing Page Tool Test" : translated.title,
    description: translated.description === "Une page outil statique pour vérifier le template avant d’ajouter vos vrais outils." ? "A static tool page for validating the template before adding your real tools." : translated.description,
    ...(tool.kind === "redesign-roi" ? { title: "Estimate your website redesign ROI", description: "Estimate your website redesign ROI by comparing your current conversion rate, monthly sales and potential revenue after a redesign.", imageAlt: "Website redesign ROI calculator comparing current sales with estimated results after a redesign" } : {}),
    ...(tool.kind === "site-platform-comparator" ? { title: "Which platform should you choose for your website?", description: "Compare indicative prices for Framer, Webflow, Wix, WordPress and other website platforms based on your project needs.", imageAlt: "Website platform price comparison showing ranked solutions and estimated monthly costs" } : {}),
    href: `/outils-gratuits/${tool.slug}`,
  };
}

export function getEnglishFreeTools(list: FreeTool[]) { return list.map(getEnglishFreeTool); }
