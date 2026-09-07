import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  analyticsCookieName,
  analyticsTokenIsValid,
  localPreviewPassword,
} from "@/lib/saas-analytics/auth";
import { ContentEditor } from "./content-editor";
import "./content-editor.css";

export const metadata: Metadata = {
  title: "SaaS content editor | Ruff Agency",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function ContentEditorPage() {
  const authenticated = analyticsTokenIsValid(
    cookies().get(analyticsCookieName)?.value,
  );
  return (
    <ContentEditor
      initiallyAuthenticated={authenticated}
      localPassword={localPreviewPassword()}
    />
  );
}
