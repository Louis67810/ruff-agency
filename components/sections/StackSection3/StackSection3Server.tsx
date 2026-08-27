import { headers } from "next/headers";
import StackSection3 from "./StackSection3.jsx";
import { localizeHref } from "@/lib/i18n";

export default async function StackSection3Server(
  props: Record<string, unknown>,
) {
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "fr";
  return (
    <StackSection3
      {...(props as any)}
      ctaHref={localizeHref(props.ctaHref as string | undefined, locale)}
      locale={locale}
    />
  );
}
