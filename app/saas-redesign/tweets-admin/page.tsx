import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  analyticsCookieName,
  analyticsTokenIsValid,
  localPreviewPassword,
} from "@/lib/saas-analytics/auth";
import { TweetManager } from "./tweet-manager";
import "../content-editor/content-editor.css";
import "./tweets-admin.css";

export const metadata: Metadata = {
  title: "SaaS tweets manager | Ruff Agency",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function TweetsAdminPage() {
  const authenticated = analyticsTokenIsValid(
    cookies().get(analyticsCookieName)?.value,
  );
  return (
    <TweetManager
      initiallyAuthenticated={authenticated}
      localPassword={localPreviewPassword()}
    />
  );
}
