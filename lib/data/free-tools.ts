export type FreeTool = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  kind: FreeToolKind;
};

export type FreeToolKind = "static" | "value-proposition" | "conversion-rate" | "landing-checklist" | "redesign-roi" | "site-platform-comparator";

export const freeTools: FreeTool[] = [
  {
    id: "comparateur-prix-plateformes",
    slug: "comparateur-prix-plateformes",
    title: "Quelle plateforme choisir pour son site ?",
    description: "Comparez les prix de Framer, Webflow, Wix, WordPress et d’autres plateformes selon les besoins de votre site. Découvrez les offres adaptées à votre projet.",
    image: "/outils-gratuits/comparateur-prix-plateformes-site.jpg",
    imageAlt: "Comparateur de prix des plateformes de création de site avec classement des solutions et coûts mensuels",
    href: "/outils-gratuits/comparateur-prix-plateformes",
    kind: "site-platform-comparator",
  },
  {
    id: "simulateur-roi-refonte",
    slug: "simulateur-roi-refonte",
    title: "Estimez le potentiel de votre site après refonte",
    description: "Estimez le ROI d’une refonte de site web : comparez votre taux de conversion actuel, vos ventes et le chiffre d’affaires potentiel après refonte.",
    image: "/outils-gratuits/simulateur-roi-refonte-site.jpg",
    imageAlt: "Simulateur de ROI d’une refonte de site comparant la situation actuelle et le potentiel après refonte",
    href: "/outils-gratuits/simulateur-roi-refonte",
    kind: "redesign-roi",
  },
];

export function getFreeTool(slug: string) {
  return freeTools.find((tool) => tool.slug === slug);
}
