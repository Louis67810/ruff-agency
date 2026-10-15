import type { Metadata } from "next";
import SaasBriefForm from "./saas-brief-form";
import "./saas-brief.css";

export const metadata: Metadata = {
  title: "Tell us about your SaaS | Ruff Agency",
  robots: { index: false, follow: false },
};

export default function SaasBriefPage() {
  return <SaasBriefForm />;
}
