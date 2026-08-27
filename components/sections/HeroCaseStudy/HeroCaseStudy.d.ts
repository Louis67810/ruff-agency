import * as React from "react";
export type ResponsiveImageValue =
  string | { src: string; srcSet?: string; srcset?: string; alt?: string };
export interface HeroCaseStudyProps {
  slug?: string;
  title?: string;
  photoDuSite?: ResponsiveImageValue;
  videoSrc?: string;
  imageSlides?: ResponsiveImageValue[];
  realisationsHref?: string;
  offersHref?: string;
  callHref?: string;
  className?: string;
  locale?: "fr" | "en";
}
declare const HeroCaseStudy: React.FC<HeroCaseStudyProps>;
export default HeroCaseStudy;
