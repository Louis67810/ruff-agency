const excludedPaths = [
  "/behavioral-intelligence",
  "/saas-redesign/analytics",
  "/saas-redesign/tweets-admin",
  "/saas-redesign/content-editor",
];

export function isExcludedAnalyticsPath(path: string) {
  return excludedPaths.some((excluded) => path === excluded || path.startsWith(`${excluded}/`));
}
