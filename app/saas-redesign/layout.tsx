import type { ReactNode } from "react";
import SaasRedesignXPixel from "./x-pixel";

export default function SaasRedesignLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SaasRedesignXPixel />
    </>
  );
}
