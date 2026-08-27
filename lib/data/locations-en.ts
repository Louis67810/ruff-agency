import type { Location } from "./locations";

export function englishLocationTitle(location: Location) {
  return `The web design agency in ${location.cityName} that helps businesses grow`;
}

export function englishLocationSubtitle(location: Location) {
  return `We help businesses in ${location.cityName} turn visitors into customers and build credibility with a premium landing page designed for conversion.`;
}
