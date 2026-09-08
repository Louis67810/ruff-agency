import type { Metadata } from "next";
import { headers } from "next/headers";
import "./fonts.css";
import "./globals.css";
import LocaleEnhancer from "@/components/LocaleEnhancer";
import { LocaleProvider } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { SaasAnalyticsTracker } from "@/app/saas-redesign/saas-analytics-tracker";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ruff Agency — Landing pages & sites World-class",
  description: "On crée des landing pages et des sites World-class.",
  icons: { icon: "/icon.png" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = headers().get("x-site-locale") === "en" ? "en" : "fr";
  return (
    <html lang={locale}>
      <head>
        {/**
         * The hero CTA enters one second after first paint.  Preloading its
         * exact Inter face prevents a late font swap from changing the CTA's
         * dimensions while that entrance animation is running.
         */}
        <link
          rel="preload"
          href="https://framerusercontent.com/assets/UjlFhCnUjxhNfep4oYBPqnEssyo.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body data-site-locale={locale}>
        <LocaleProvider locale={locale as Locale}>{children}</LocaleProvider>
        <SaasAnalyticsTracker />
        <LocaleEnhancer />
      </body>
    </html>
  );
}
