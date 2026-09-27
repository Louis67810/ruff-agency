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
  subtitle?: string;
  children?: React.ReactNode;
  resourcesLabel?: string;
  hideMeta?: boolean;
  centered?: boolean;
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
