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

export const briefMrrOptions = ["<5k", "5–10k", "10–30k", "30k+"] as const;
export const briefChangeOptions = ["Looks generic", "Low conversion", "Outgrown the brand", "Other"] as const;

export type BriefAnswers = { website: string; email: string; mrr: string; changes: string[]; details: string };

export function normalizeWorkEmail(value: string): string | null {
  const email = value.trim();
  if (!email || email.length > 254) return null;
  const parts = email.split("@");
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (local.length > 64 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)
    || local.startsWith(".") || local.endsWith(".") || local.includes("..") || !isPublicDomain(domain)) return null;
  return email;
}

export function validateBriefStep(answers: BriefAnswers, step: number): string | null {
  if (step === 0) {
    const website = normalizeSaasWebsite(answers.website);
    if (!website) return "Enter a valid website address, such as saas.com.";
    if (website.length > 500) return "Enter a website address with fewer than 500 characters.";
  }
  if (step === 1 && !normalizeWorkEmail(answers.email)) return answers.email.trim()
    ? "Enter a valid work email address, such as you@company.com."
    : "Enter your work email to continue.";
  if (step === 2 && !briefMrrOptions.some((option) => option === answers.mrr)) return "Select your current MRR to continue.";
  if (step === 3 && (!answers.changes.length || answers.changes.length > 4
    || !answers.changes.every((change) => briefChangeOptions.some((option) => option === change)))) return "Select at least one option to continue.";
  if (step === 4 && answers.details.length > 800) return "Keep your additional details to 800 characters or fewer.";
  return null;
}

export function validateCompletedBrief(answers: BriefAnswers) {
  for (let step = 0; step < 5; step++) {
    const error = validateBriefStep(answers, step);
    if (error) return { step, error };
  }
  return null;
}
