import * as React from "react";
export type ResponsiveImage = { src: string; srcSet?: string; sizes?: string; alt?: string };
export interface HeroSectionSlugRessourceProps {
  breadcrumbTitle?: string;
  title?: string;
  profilePhoto?: string | ResponsiveImage;
  author?: string;
  mainImage?: string | ResponsiveImage;
  updatedAt?: string;
  homeHref?: string;
  resourcesHref?: string;
  articleHref?: string;
  className?: string;
  style?: React.CSSProperties;
}
declare const HeroSectionSlugRessource: React.FC<HeroSectionSlugRessourceProps>;
export default HeroSectionSlugRessource;
