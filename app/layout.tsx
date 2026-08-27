import type { Metadata } from "next";
import { headers } from "next/headers";
import "./fonts.css";
import "./globals.css";
import LocaleEnhancer from "@/components/LocaleEnhancer";
import { LocaleProvider } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

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
      <body data-site-locale={locale}>
        <LocaleProvider locale={locale as Locale}>{children}</LocaleProvider>
        <LocaleEnhancer />
      </body>
    </html>
  );
}
