const domainLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

function isPublicDomain(hostname: string) {
  const labels = hostname.split(".");
  return labels.length >= 2 && labels.every((label) => domainLabel.test(label)) &&
    labels.at(-1)!.length >= 2 && !/^\d+$/.test(labels.at(-1)!);
}

export function stripWebsiteProtocol(value: string) {
  return value.trim().replace(/^https?:\/\//i, "").replace(/^\/\//, "");
}

export function normalizeSaasWebsite(value: string): string | null {
  const address = stripWebsiteProtocol(value);
  if (!address || /\s/.test(address)) return null;
  try {
    const url = new URL(`https://${address}`);
    if (url.username || url.password || url.port || !isPublicDomain(url.hostname)) return null;
    return url.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function briefReference(id: string) {
  return `RA-${id.slice(0, 8).toUpperCase()}`;
}
