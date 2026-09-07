import type { CSSProperties, MouseEvent } from "react";

export interface StackSection3Props {
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Exact Framer-export default: "196px 48px 300px 48px" */
  padding?: string;
  /** Framer export only contained internal page id XvvJHap2q, so provide the real URL here. */
  ctaHref?: string;
  locale?: "fr" | "en";
  showDescription?: boolean;
  showCta?: boolean;
  showSectionDivider?: boolean;
  faqs?: ReadonlyArray<{
    question: string;
    answer: string;
  }>;
  onCtaClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export declare function StackSection3(props: StackSection3Props): JSX.Element;
export default StackSection3;
