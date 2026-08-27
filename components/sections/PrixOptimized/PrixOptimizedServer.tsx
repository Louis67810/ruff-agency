import { headers } from "next/headers";
import PrixOptimized from "./PrixOptimized";

export default async function PrixOptimizedServer(
  props: Record<string, unknown>,
) {
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "fr";
  return <PrixOptimized {...(props as any)} locale={locale} />;
}
