"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { SaasTweet } from "../tweets";

const emptyTweet = {
  id: "",
  name: "",
  handle: "",
  copy: "",
  href: "",
  accent: "#d9f0ff",
  position: 0,
  published: true,
};

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function TweetManager({
  initiallyAuthenticated,
  localPassword,
}: {
  initiallyAuthenticated: boolean;
  localPassword: string | null;
}) {
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [password, setPassword] = useState("");
  const [tweets, setTweets] = useState<SaasTweet[]>([]);
  const [tweet, setTweet] = useState<SaasTweet>(emptyTweet);
  const [configured, setConfigured] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/saas-tweets", { cache: "no-store" });
    if (response.status === 401) return setAuthenticated(false);
    const body = (await response.json().catch(() => null)) as {
      configured?: boolean;
      tweets?: SaasTweet[];
      error?: string;
    } | null;
    if (!response.ok) return setStatus(body?.error ?? "Unable to load tweets.");
    setConfigured(Boolean(body?.configured));
    setTweets(body?.tweets ?? []);
  }, []);

  useEffect(() => {
    if (authenticated) void load();
  }, [authenticated, load]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/saas-analytics/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) return setStatus("Incorrect password");
    setAuthenticated(true);
    setStatus("");
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setStatus("Saving tweet…");
    const candidate = {
      ...tweet,
      id: tweet.id || `${slug(tweet.handle || tweet.name)}-${Date.now().toString(36)}`,
      position: tweet.id ? tweet.position : tweets.length,
    };
    const response = await fetch("/api/saas-tweets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(candidate),
    });
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    setBusy(false);
    if (!response.ok) return setStatus(body?.error ?? "Unable to save tweet.");
    setTweet(emptyTweet);
    setStatus("Tweet saved. The public site will use the new list immediately.");
    await load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this tweet from the managed list?")) return;
    setBusy(true);
    const response = await fetch(`/api/saas-tweets?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!response.ok) return setStatus("Unable to delete tweet.");
    setStatus("Tweet deleted.");
    await load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= tweets.length) return;
    const next = [...tweets];
    [next[index], next[target]] = [next[target], next[index]];
    setTweets(next);
    const response = await fetch("/api/saas-tweets", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ order: next.map((item) => item.id) }),
    });
    if (!response.ok) {
      setStatus("Unable to reorder tweets.");
      await load();
    }
  };

  if (!authenticated)
    return (
      <main className="sce sce-login">
        <form onSubmit={signIn} className="sce-panel sce-login-card">
          <span className="sce-kicker">[ PRIVATE TWEET TOOL ]</span>
          <h1>Tweet manager</h1>
          <p>Manage the X posts displayed on the SaaS landing page.</p>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
            />
          </label>
          <button className="sce-primary">Open manager</button>
          {status && <div className="sce-error">{status}</div>}
          {localPassword && (
            <small>
              Local password: <code>{localPassword}</code>
            </small>
          )}
        </form>
      </main>
    );

  return (
    <main className="sce">
      <header className="sce-header">
        <div>
          <span className="sce-kicker">[ SUPABASE / TWEETS ]</span>
          <h1>Landing tweets</h1>
          <p>
            {configured
              ? "Connected to Supabase. Changes are live without a site rebuild."
              : "Preview mode. Add Supabase credentials to enable remote changes."}
          </p>
        </div>
        <div className="sce-header-actions">
          <a href="/saas-redesign/analytics">Open analytics</a>
          <a
            href={process.env.NEXT_PUBLIC_SAAS_SITE_URL || "/saas-redesign"}
            target="_blank"
          >
            Open public site ↗
          </a>
        </div>
      </header>
      {status && <div className="sce-status">{status}</div>}
      <div className="sce-layout">
        <form className="sce-panel sce-form" onSubmit={save}>
          <div>
            <span className="sce-kicker">[ {tweet.id ? "EDIT" : "NEW"} TWEET ]</span>
            <h2>{tweet.id ? "Edit tweet" : "Add a tweet"}</h2>
          </div>
          <div className="sce-two">
            <label>
              Display name
              <input
                value={tweet.name}
                onChange={(event) => setTweet({ ...tweet, name: event.target.value })}
                required
              />
            </label>
            <label>
              Handle
              <input
                value={tweet.handle}
                onChange={(event) => setTweet({ ...tweet, handle: event.target.value })}
                placeholder="@handle"
                required
              />
            </label>
          </div>
          <label>
            X / Twitter URL
            <input
              type="url"
              value={tweet.href}
              onChange={(event) => setTweet({ ...tweet, href: event.target.value })}
              placeholder="https://x.com/user/status/…"
              required
            />
          </label>
          <label>
            Internal summary
            <textarea
              value={tweet.copy}
              onChange={(event) => setTweet({ ...tweet, copy: event.target.value })}
              required
            />
          </label>
          <div className="sce-two">
            <label>
              Accent color
              <input
                type="color"
                value={tweet.accent}
                onChange={(event) => setTweet({ ...tweet, accent: event.target.value })}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={tweet.published}
                onChange={(event) => setTweet({ ...tweet, published: event.target.checked })}
              />{" "}
              Published
            </label>
          </div>
          <button className="sce-primary" disabled={busy || !configured}>
            Save tweet
          </button>
        </form>

        <section className="sce-panel sce-list sce-tweet-list">
          <div>
            <span className="sce-kicker">[ DISPLAY ORDER ]</span>
            <h2>{tweets.length} tweets</h2>
          </div>
          {tweets.map((item, index) => (
            <article className="sce-list-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>
                  {item.handle} · {item.published ? "Published" : "Hidden"}
                </small>
              </div>
              <div className="sce-item-actions">
                <button type="button" onClick={() => void move(index, -1)} disabled={index === 0 || busy}>↑</button>
                <button type="button" onClick={() => void move(index, 1)} disabled={index === tweets.length - 1 || busy}>↓</button>
                <button type="button" onClick={() => setTweet(item)}>Edit</button>
                <button type="button" onClick={() => void remove(item.id)} disabled={busy}>Delete</button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
