"use client";

import { ExactProcessCardGrid } from "@/components/exact-process-cards";
import "./SaasRedesignProcess.css";

export default function SaasRedesignProcess() {
  return (
    <section className="sr-process" aria-labelledby="sr-process-title">
      <img className="sr-process__shape sr-process__shape--left" src="/landing-assets/saas-redesign/process/2455-1056.svg" alt="" aria-hidden="true" />
      <img className="sr-process__shape sr-process__shape--right" src="/landing-assets/saas-redesign/process/2456-962.svg" alt="" aria-hidden="true" />
      <div className="sr-process__inner">
        <header className="sr-process__heading">
          <h2 id="sr-process-title">From SaaS to standout brand.</h2>
          <p>A complete website, built and launched in 14 days.</p>
        </header>
        <div className="sr-process__rule" aria-hidden="true" />
        <ExactProcessCardGrid locale="en" variant="saas" />
      </div>
    </section>
  );
}
