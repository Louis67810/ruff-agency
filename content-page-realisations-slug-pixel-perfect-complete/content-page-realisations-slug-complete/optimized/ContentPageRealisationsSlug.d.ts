import type { CSSProperties } from "react";
export type ResponsiveImage = string | { src:string; srcSet?:string; sizes?:string; alt?:string; pixelWidth?:number; pixelHeight?:number };
export interface ContentPageRealisationsSlugProps {
  logo?: ResponsiveImage; about?: string; siteHref?: string; review?: string; profilePhoto?: ResponsiveImage; personName?: string; personRole?: string;
  challengeSubtitle?:string; challenge1?:string; challenge2?:string; challenge3?:string; challenge4?:string;
  solutionSubtitle?:string; solution1?:string; solution2?:string; solution3?:string; solution4?:string;
  resultsSubtitle?:string; result1?:string; result2?:string; result3?:string; result4?:string;
  photo1?:ResponsiveImage; photo2?:ResponsiveImage; photo3?:ResponsiveImage; photo4?:ResponsiveImage; photo5?:ResponsiveImage; photo6?:ResponsiveImage; photo7?:ResponsiveImage; photo8?:ResponsiveImage;
  visibiliteAvantApres?: boolean; callHref?: string; className?:string;
}
export default function ContentPageRealisationsSlug(props:ContentPageRealisationsSlugProps): JSX.Element;
