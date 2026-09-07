import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import { FOOTER_LINKS, NAV_PROPS } from "@/lib/site";
import SaasRedesignLanding from "./saas-redesign-landing";
import { readTweets } from "@/lib/saas-tweets/store";

export const metadata: Metadata = {
  title: "SaaS website redesign | Ruff Agency",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function SaasRedesignPage() {
  const tweets = await readTweets().catch(() => []);
  return (
    <>
      <SiteNav
        {...NAV_PROPS}
        locale="en"
        homeHref="#top"
        ctaHref="#book"
        ctaLabel="Book a Strategic Call"
        landingMode
        landingLinks={[
          { label: "Problems", href: "#problems" },
          { label: "Vote", href: "#vote" },
          { label: "Solution", href: "#solution" },
          { label: "Our work", href: "#from-this" },
          { label: "Results", href: "#results" },
          { label: "Reviews", href: "#reviews" },
          { label: "FAQ", href: "#faq" },
        ]}
        className="saas-redesign-nav"
      />
      <SaasRedesignLanding managedTweets={tweets} />
      <Footer links={FOOTER_LINKS} bookingHref="#book" locale="en" />
    </>
  );
}
