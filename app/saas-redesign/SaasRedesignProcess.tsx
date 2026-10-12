"use client";

import { ExactProcessCardGrid } from "@/components/exact-process-cards";
import "./SaasRedesignProcess.css";

export default function SaasRedesignProcess() {
  return (
    <section className="sr-process" aria-labelledby="sr-process-title">
      <div className="sr-process__inner">
        <header className="sr-process__heading">
          <h2 id="sr-process-title">From SaaS to standout brand.</h2>
          <p>A complete website, built and launched in 10 days.</p>
        </header>
        <div className="sr-process__rule" aria-hidden="true" />
        <ExactProcessCardGrid locale="en" variant="saas" />
      </div>
    </section>
  );
}
