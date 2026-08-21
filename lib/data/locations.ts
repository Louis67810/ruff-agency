export type Location = {
  /** Slug de la ville, ex. "paris" (utilisé dans l'URL agence-web-design-<ville>). */
  citySlug: string;
  /** Nom affiché de la ville, ex. "Paris". */
  cityName: string;
  /** Adjectif au féminin pluriel, ex. "parisiennes" (pour "les entreprises ..."). */
  adjective: string;
};

export const locations: Location[] = [
  { citySlug: "paris", cityName: "Paris", adjective: "parisiennes" },
  { citySlug: "marseille", cityName: "Marseille", adjective: "marseillaises" },
  { citySlug: "lyon", cityName: "Lyon", adjective: "lyonnaises" },
  { citySlug: "toulouse", cityName: "Toulouse", adjective: "toulousaines" },
  { citySlug: "nice", cityName: "Nice", adjective: "niçoises" },
  { citySlug: "nantes", cityName: "Nantes", adjective: "nantaises" },
  {
    citySlug: "montpellier",
    cityName: "Montpellier",
    adjective: "montpelliéraines",
  },
  {
    citySlug: "strasbourg",
    cityName: "Strasbourg",
    adjective: "strasbourgeoises",
  },
  { citySlug: "lille", cityName: "Lille", adjective: "lilloises" },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((location) => location.citySlug === slug);
}

export function locationTitle(location: Location): string {
  return `L'agence de web design à ${location.cityName} qui fait vendre`;
}

export function locationSubtitle(location: Location): string {
  return `Nous accompagnons les entreprises ${location.adjective} à transformer leurs visiteurs en clients et à renforcer leur crédibilité grâce à une landing page premium, optimisée pour la conversion.`;
}

export function locationRoute(location: Location): string {
  return `/ville/agence-web-design-${location.citySlug}`;
}
