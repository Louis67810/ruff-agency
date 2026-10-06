import * as React from "react";
export type NavBarProps = React.HTMLAttributes<HTMLElement> & {
  locale?: "fr" | "en";
  variant?: "auto" | string; fill?: string; fill2?: string; color?: string;
  homeHref?: string; projectsHref?: string; resourcesHref?: string; aboutHref?: string; ctaHref?: string;
  landingMode?: boolean; landingLinks?: Array<{ label: string; href: string }>; ctaLabel?: string;
  landingHref?: string; websiteHref?: string; brandingHref?: string; productDesignHref?: string; copywritingHref?: string; seoGeoHref?: string; conversionOptimisationHref?: string; framerHref?: string; developmentHref?: string; whatsappHref?: string;
};
declare const NavBar: React.FC<NavBarProps>;
export default NavBar;
export type LogoProps = {
  href?: string;
  dark?: boolean;
  mobile?: boolean;
  mobileUnique?: boolean;
  className?: string;
};
export const Logo: React.FC<LogoProps>;
