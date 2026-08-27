import type { Metadata } from "next";
import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import CallBooking from "@/components/sections/CallBooking/CallBooking";
import { FOOTER_LINKS, NAV_PROPS, SITE_URL } from "@/lib/site";
import { headers } from "next/headers";
import { localizedMetadata } from "@/lib/seo";

const legacyMetadata: Metadata = {
  title: "Réserver un appel de 30 minutes — Ruff Agency",
  description: "Réservez un appel de 30 minutes pour analyser votre situation et discuter de votre projet web.",
  alternates: { canonical: `${SITE_URL}/30-min` },
  openGraph: { url: `${SITE_URL}/30-min`, type: "website" },
};

export function generateMetadata(): Promise<Metadata> { return localizedMetadata({ path: "/30-min", frTitle: "Réserver un appel de 30 minutes — Ruff Agency", frDescription: "Réservez un appel de 30 minutes pour analyser votre situation et discuter de votre projet web.", enTitle: "Book a 30-minute call — Ruff Agency", enDescription: "Book a 30-minute call to review your situation and discuss your website project." }); }

export default function BookingPage() {
  const locale = headers().get("x-site-locale") === "en" ? "en" : "fr";
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(251, 251, 251)" fill2="rgb(251, 251, 251)" />
      <CallBooking locale={locale} />
      <Footer links={FOOTER_LINKS} visible={false} padding="96px 48px 64px 48px" />
    </>
  );
}
