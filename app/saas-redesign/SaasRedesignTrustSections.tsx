import type { ComponentType, SVGProps } from "react";
import {
  ArrowTrendingUpIcon,
  BeakerIcon,
  BoltIcon,
  ComputerDesktopIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SparklesIcon,
  Squares2X2Icon,
  TagIcon,
} from "@heroicons/react/24/solid";
import SaasRedesignProcess from "./SaasRedesignProcess";
import "./SaasRedesignTrustSections.css";

const assetRoot = "/landing-assets/saas-redesign/social-proof";

type Reason = {
  text: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const outgrownReasons: Reason[] = [
  { text: "Your product grew. Your website didn’t.", Icon: ArrowTrendingUpIcon },
  { text: "Your SaaS looks like dozens of competitors.", Icon: Squares2X2Icon },
  { text: "You struggle to show why you’re different.", Icon: SparklesIcon },
  { text: "You’re sending real traffic to a site built just to launch.", Icon: CursorArrowRaysIcon },
  { text: "You need people to remember your brand", Icon: TagIcon },
];

const aiIsEnoughReasons: Reason[] = [
  { text: "Just need something online quickly.", Icon: BoltIcon },
  { text: "Don’t mind using the same patterns as everyone else.", Icon: Squares2X2Icon },
  { text: "Need a working website, not a distinctive brand.", Icon: ComputerDesktopIcon },
  { text: "Are still validating and speed matters most", Icon: BeakerIcon },
  { text: "Don’t mind if your site could belong to any SaaS.", Icon: FingerPrintIcon },
];

function AiReasonsCard({
  title,
  reasons,
  tone,
}: {
  title: string;
  reasons: Reason[];
  tone: "outgrown" | "enough";
}) {
  return (
    <article className={`sr-ai-reasons-card sr-ai-reasons-card--${tone}`}>
      <h3>{title}</h3>
      <ul>
        {reasons.map(({ text, Icon }) => (
          <li key={text}>
            <span className="sr-ai-reasons-icon" aria-hidden="true">
              <Icon />
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function SaasRedesignGuarantee({ id = "guarantee" }: { id?: string }) {
  return (
    <section id={id} className="sr-trust-section sr-trust-section--pricing" aria-labelledby={`${id}-title`}>
        <div className="sr-trust-card">
          <div className="sr-trust-art">
            <img
              src={`${assetRoot}/guarantee-seal.png`}
              alt="100% satisfaction guarantee"
              width="226"
              height="226"
            />
          </div>
          <div className="sr-trust-copy">
            <h2 id={`${id}-title`}>The 100% Satisfaction Guarantee</h2>
            <p className="sr-trust-lead">
              We’re confident in the quality of our work, because we don’t stop until you’re fully satisfied with the result.
            </p>
            <p>
              We’ll keep refining your website until it meets your expectations. If we can’t get it there, you’ll receive a full refund.
            </p>
            <p>No compromise. No unfinished work. Just a website you’re proud to launch.</p>
            <div className="sr-trust-cta sr-prx-primaryFrame">
              <a className="sr-prx-primaryButton" href="/en/saas-redesign/brief">
                Get Started With Zero Risk
              </a>
            </div>
            <div className="sr-trust-reassurance">
              <span>
                <img src={`${assetRoot}/no-sales-call.svg`} alt="" aria-hidden="true" />
                No sales call required
              </span>
              <i aria-hidden="true" />
              <span>
                <img src={`${assetRoot}/no-commitment.svg`} alt="" aria-hidden="true" />
                No commitment
              </span>
            </div>
          </div>
        </div>
      </section>
  );
}

export function SaasRedesignWhyAI() {
  return (
      <section id="why-ai" className="sr-ai-reasons" aria-labelledby="sr-ai-reasons-title">
        <div className="sr-ai-reasons-shapes" aria-hidden="true">
          <img className="sr-ai-reasons-shape" src="/landing-assets/saas-redesign/pricing-comparison-shapes.svg" alt="" />
        </div>
        <div className="sr-ai-reasons-inner">
          <header className="sr-ai-reasons-heading">
            <h2 id="sr-ai-reasons-title">Why not just use AI?</h2>
            <p>
              AI can build a good-looking website in minutes.<br />
              <strong>That’s exactly why so many SaaS websites now look the same.</strong>
            </p>
            <div className="sr-ai-reasons-rule" aria-hidden="true" />
          </header>
          <div className="sr-ai-reasons-grid">
            <AiReasonsCard title="You’ve Outgrown AI If You..." reasons={outgrownReasons} tone="outgrown" />
            <AiReasonsCard title="AI Is Enough If You..." reasons={aiIsEnoughReasons} tone="enough" />
          </div>
        </div>
      </section>
  );
}

export default function SaasRedesignTrustSections() {
  return <><SaasRedesignGuarantee /><SaasRedesignProcess /><SaasRedesignWhyAI /></>;
}
