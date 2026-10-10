import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import { FOOTER_LINKS, NAV_PROPS } from "@/lib/site";
import SaasRedesignLanding from "./saas-redesign-landing";
import { defaultTweets } from "./tweets";

export const metadata: Metadata = {
  title: "SaaS website redesign | Ruff Agency",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function SaasRedesignPage() {
  return (
    <>
      <SiteNav
        {...NAV_PROPS}
        locale="en"
        homeHref="#top"
        ctaHref="/en/saas-redesign/brief"
        ctaLabel="Start your redesign"
        landingMode
        landingLinks={[
          { label: "Comparison", href: "#why-ai" },
          { label: "Solution", href: "#solution" },
          { label: "Case studies", href: "#from-this" },
          { label: "Reviews", href: "#reviews" },
          { label: "Start now", href: "#closing-cta" },
          { label: "FAQ", href: "#faq" },
        ]}
        className="saas-redesign-nav"
      />
      <SaasRedesignLanding managedTweets={defaultTweets} />
      <Footer
        visible={false}
        padding="96px 48px 64px 48px"
        links={{ ...FOOTER_LINKS, booking: "/en/saas-redesign/brief" }}
        bookingHref="/en/saas-redesign/brief"
        locale="en"
        hideInternalLinks
      />
    </>
  );
}
