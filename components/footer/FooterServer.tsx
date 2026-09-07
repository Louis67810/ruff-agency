import { headers } from "next/headers";
import Footer from "./Footer.jsx";

export default async function FooterServer(props: Record<string, unknown>) {
  const locale = props.locale === "en" || (await headers()).get("x-site-locale") === "en" ? "en" : "fr";
  const links = props.links && typeof props.links === "object"
    ? Object.fromEntries(Object.entries(props.links).map(([key, value]) => [key, typeof value === "string" && value.startsWith("/") && !value.startsWith("/en") && !value.startsWith("//") ? `/en${value}` : value]))
    : props.links;
  return <Footer {...(props as any)} links={links as Record<string, string> | undefined} locale={locale} />;
}
