import SiteNavClient from "./SiteNavClient.jsx";
import { headers } from "next/headers";

export default async function SiteNav(props) {
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "fr";
  const localize = (value) => {
    if (typeof value === "string")
      return value.startsWith("/") && !value.startsWith("/en")
        ? `/en${value}`
        : value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, localize(item)]),
      );
    return value;
  };
  const localizedProps = locale === "en" ? localize(props) : props;
  return <SiteNavClient {...localizedProps} locale={props.locale ?? locale} />;
}
