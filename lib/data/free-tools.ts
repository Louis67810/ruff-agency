export type FreeTool = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  href: string;
  kind: FreeToolKind;
};

export type FreeToolKind = "static" | "value-proposition" | "conversion-rate" | "landing-checklist";

/**
 * Source de données des outils. Elle est volontairement vide : les anciens
 * outils et leurs URLs ont été retirés, mais le template dynamique reste prêt
 * à générer une nouvelle page dès qu’un outil est ajouté ici ou via le CMS.
 */
export const freeTools: FreeTool[] = [
  {
    id: "landing-page-tool-template-test",
    slug: "test-outil-landing-page",
    title: "Test outil Landing Page",
    description: "Une page outil statique pour vérifier le template avant d’ajouter vos vrais outils.",
    image: "/images/services-menu/landing-page.png",
    href: "/outils-gratuits/test-outil-landing-page",
    kind: "static",
  },
];

export function getFreeTool(slug: string) {
  return freeTools.find((tool) => tool.slug === slug);
}
