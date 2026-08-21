import * as React from "react";
export type NavBarProps = React.HTMLAttributes<HTMLElement> & {
  variant?: "auto" | string; fill?: string; fill2?: string; color?: string;
  homeHref?: string; projectsHref?: string; servicesHref?: string; resourcesHref?: string; aboutHref?: string; ctaHref?: string;
  landingHref?: string; websiteHref?: string; developmentHref?: string; allServicesHref?: string; whatsappHref?: string;
};
declare const NavBar: React.FC<NavBarProps>;
export default NavBar;
