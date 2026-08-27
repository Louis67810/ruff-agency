import type { CSSProperties } from "react";
export type ResponsiveImage = string | { src:string; srcSet?:string; sizes?:string; alt?:string; pixelWidth?:number; pixelHeight?:number };
export interface ContentPageRealisationsSlugProps {
  locale?: "fr" | "en";
  logo?: ResponsiveImage; about?: string; siteHref?: string; review?: string; profilePhoto?: ResponsiveImage; personName?: string; personRole?: string;
  challengeSubtitle?:string; challenge1?:string; challenge2?:string; challenge3?:string; challenge4?:string;
  solutionSubtitle?:string; solution1?:string; solution2?:string; solution3?:string; solution4?:string;
  resultsSubtitle?:string; result1?:string; result2?:string; result3?:string; result4?:string;
  photos?: ResponsiveImage[];
  visibiliteAvantApres?: boolean; callHref?: string; className?:string;
}
export default function ContentPageRealisationsSlug(props:ContentPageRealisationsSlugProps): JSX.Element;
