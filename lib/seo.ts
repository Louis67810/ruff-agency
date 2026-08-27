import type { Metadata } from "next";
import { headers } from "next/headers";
import { SITE_URL } from "@/lib/site";

type LocalizedMetadataInput = {
  path: string;
  frTitle: string;
  frDescription: string;
  enTitle: string;
  enDescription: string;
  type?: "website" | "article";
};

export async function localizedMetadata({
  path,
  frTitle,
  frDescription,
  enTitle,
  enDescription,
  type = "website",
}: LocalizedMetadataInput): Promise<Metadata> {
  const english = (await headers()).get("x-site-locale") === "en";
  const title = english ? enTitle : frTitle;
  const description = english ? enDescription : frDescription;
  const normalizedPath = path === "/" ? "" : path;
  const frenchUrl = `${SITE_URL}${normalizedPath || "/"}`;
  const englishUrl = `${SITE_URL}/en${normalizedPath}`;
  const canonical = english ? englishUrl : frenchUrl;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { fr: frenchUrl, en: englishUrl },
    },
    openGraph: { title, description, url: canonical, type },
    twitter: { card: "summary_large_image", title, description },
  };
}
