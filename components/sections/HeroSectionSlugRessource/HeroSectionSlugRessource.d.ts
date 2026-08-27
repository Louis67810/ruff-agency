import * as React from "react";
export type ResponsiveImage = {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
};
export interface HeroSectionSlugRessourceProps {
  locale?: "fr" | "en";
  breadcrumbTitle?: string;
  title?: string;
  profilePhoto?: string | ResponsiveImage;
  author?: string;
  mainImage?: string | ResponsiveImage;
  mainVideo?: { src: string; poster?: string; title?: string };
  updatedAt?: string;
  readingMinutes?: number;
  homeHref?: string;
  resourcesHref?: string;
  articleHref?: string;
  className?: string;
  style?: React.CSSProperties;
}
declare const HeroSectionSlugRessource: React.FC<HeroSectionSlugRessourceProps>;
export default HeroSectionSlugRessource;
