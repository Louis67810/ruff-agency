import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export const analyticsCookieName = "saas_analytics_session";

function configuredPassword() {
  if (process.env.SAAS_ANALYTICS_PASSWORD)
    return process.env.SAAS_ANALYTICS_PASSWORD;
  return process.env.NODE_ENV === "production" ? null : "preview-only";
}

function secret() {
  return process.env.SAAS_ANALYTICS_COOKIE_SECRET ?? configuredPassword();
}

export function analyticsIsConfigured() {
  return Boolean(configuredPassword());
}

export function localPreviewPassword() {
  return process.env.NODE_ENV === "production" ? null : "preview-only";
}

export function passwordIsValid(candidate: string) {
  const expected = configuredPassword();
  if (!expected || !candidate) return false;
  const actualBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function createAnalyticsToken() {
  const value = secret();
  if (!value) return null;
  return createHmac("sha256", value).update("saas-analytics:v1").digest("hex");
}

export function analyticsTokenIsValid(candidate?: string) {
  const expected = createAnalyticsToken();
  if (!candidate || !expected) return false;
  const actualBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
