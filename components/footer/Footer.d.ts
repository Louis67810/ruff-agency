import * as React from "react";

export type FooterProps = {
  padding?: string;
  visible?: boolean;
  bookingHref?: string;
  links?: Record<string, string>;
  className?: string;
  style?: React.CSSProperties;
};

declare const Footer: React.FC<FooterProps>;
export { Footer };
export default Footer;
export const internalIds: Record<string, string>;
