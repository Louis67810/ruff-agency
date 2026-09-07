import "server-only";

import { defaultTweets, type SaasTweet } from "@/app/saas-redesign/tweets";

function supabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

function supabaseHeaders(key: string) {
  return {
    apikey: key,
    ...(key.startsWith("sb_") ? {} : { authorization: `Bearer ${key}` }),
  };
}

async function request(path: string, init: RequestInit = {}) {
  const config = supabaseConfig();
  if (!config) return null;
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...supabaseHeaders(config.key),
      "content-type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(`Supabase tweets request failed (${response.status})`);
  return response;
}

export function tweetsAreConfigured() {
  return Boolean(supabaseConfig());
}

export async function readTweets(includeUnpublished = false) {
  const config = supabaseConfig();
  if (!config) return defaultTweets;
  const query = new URLSearchParams({
    select: "id,name,handle,copy,href,accent,position,published",
    order: "position.asc",
  });
  if (!includeUnpublished) query.set("published", "eq.true");
  const response = await request(`saas_tweets?${query}`);
  const tweets = (await response!.json()) as SaasTweet[];
  return tweets.length || includeUnpublished ? tweets : defaultTweets;
}

export async function saveTweet(tweet: SaasTweet) {
  if (!supabaseConfig())
    throw new Error("Supabase is required to manage tweets remotely");
  await request("saas_tweets?on_conflict=id", {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(tweet),
  });
}

export async function deleteTweet(id: string) {
  if (!supabaseConfig())
    throw new Error("Supabase is required to manage tweets remotely");
  await request(`saas_tweets?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function reorderTweets(ids: string[]) {
  if (!supabaseConfig())
    throw new Error("Supabase is required to manage tweets remotely");
  await Promise.all(
    ids.map((id, position) =>
      request(`saas_tweets?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ position }),
      }),
    ),
  );
}
