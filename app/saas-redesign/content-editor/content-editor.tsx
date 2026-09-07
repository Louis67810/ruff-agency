"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Realization = {
  id: string;
  title: string;
  copy: string;
  before: string;
  after: string;
};
type Review = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
};
type Content = { realizations: Realization[]; reviews: Review[] };

const emptyRealization = { title: "", copy: "", before: "", after: "" };
const emptyReview = { name: "", role: "", quote: "", avatar: "" };

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function Login({ localPassword, onSuccess }: { localPassword: string | null; onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/saas-analytics/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("Incorrect password");
      return;
    }
    onSuccess();
  };
  return (
    <main className="sce sce-login"><form onSubmit={submit} className="sce-panel sce-login-card"><span className="sce-kicker">[ PRIVATE CONTENT TOOL ]</span><h1>Content editor</h1><p>Add projects and client reviews directly to the landing source.</p><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus /></label><button className="sce-primary">Open editor</button>{error && <div className="sce-error">{error}</div>}{localPassword && <small>Local password: <code>{localPassword}</code></small>}</form></main>
  );
}

export function ContentEditor({ initiallyAuthenticated, localPassword }: { initiallyAuthenticated: boolean; localPassword: string | null }) {
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [content, setContent] = useState<Content>({ realizations: [], reviews: [] });
  const [realization, setRealization] = useState(emptyRealization);
  const [review, setReview] = useState(emptyReview);
  const [tab, setTab] = useState<"realizations" | "reviews">("realizations");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/saas-content", { cache: "no-store" });
    if (response.status === 401) return setAuthenticated(false);
    if (!response.ok) return setStatus("Unable to load the hard-coded content.");
    setContent((await response.json()) as Content);
  }, []);
  useEffect(() => { if (authenticated) void load(); }, [authenticated, load]);

  const mutate = async (
    method: "POST" | "PATCH" | "DELETE",
    payload?: Record<string, unknown>,
    query = "",
  ) => {
    setBusy(true);
    setStatus("Saving to the project…");
    const response = await fetch(`/api/saas-content${query}`, {
      method,
      headers: { "content-type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const responseBody = (await response.json().catch(() => null)) as { error?: string; content?: Content } | null;
    setBusy(false);
    if (!response.ok) {
      setStatus(responseBody?.error ?? "Unable to save.");
      return false;
    }
    if (responseBody?.content) setContent(responseBody.content);
    setStatus("Saved in content.json — the landing has been updated.");
    return true;
  };

  const upload = async (file: File, apply: (path: string) => void) => {
    setBusy(true);
    setStatus(`Uploading ${file.name}…`);
    const form = new FormData();
    form.set("file", file);
    const response = await fetch("/api/saas-content/upload", { method: "POST", body: form });
    const body = (await response.json().catch(() => null)) as { path?: string; error?: string } | null;
    setBusy(false);
    if (!response.ok || !body?.path) return setStatus(body?.error ?? "Upload failed.");
    apply(body.path);
    setStatus("Image uploaded. Add the item to save it in the landing.");
  };

  if (!authenticated)
    return <Login localPassword={localPassword} onSuccess={() => setAuthenticated(true)} />;

  const addRealization = async (event: FormEvent) => {
    event.preventDefault();
    if (!realization.title || !realization.copy || !realization.before || !realization.after)
      return setStatus("Complete the title, description and both images.");
    const item = { id: `${slug(realization.title)}-${Date.now().toString(36)}`, ...realization };
    if (await mutate("POST", { kind: "realizations", item }))
      setRealization(emptyRealization);
  };
  const addReview = async (event: FormEvent) => {
    event.preventDefault();
    if (!review.name || !review.role || !review.quote || !review.avatar)
      return setStatus("Complete the name, role, review and profile image.");
    const item = { id: `${slug(review.name)}-${Date.now().toString(36)}`, ...review };
    if (await mutate("POST", { kind: "reviews", item }))
      setReview(emptyReview);
  };

  const reorder = <T extends { id: string }>(
    items: T[],
    sourceId: string,
    targetId: string,
  ) => {
    const sourceIndex = items.findIndex((item) => item.id === sourceId);
    const targetIndex = items.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex)
      return items;
    const next = [...items];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    return next;
  };

  return (
    <main className="sce">
      <header className="sce-header"><div><span className="sce-kicker">[ HARD-CODED CONTENT ]</span><h1>Landing content</h1><p>Uploads are copied to <code>public/landing-assets/uploads</code> and entries are written to <code>content.json</code>.</p></div><div className="sce-header-actions"><a href="/saas-redesign" target="_blank">Open landing ↗</a><div className="sce-tabs"><button className={tab === "realizations" ? "is-active" : ""} onClick={() => setTab("realizations")}>Realizations</button><button className={tab === "reviews" ? "is-active" : ""} onClick={() => setTab("reviews")}>Client reviews</button></div></div></header>
      {status && <div className="sce-status">{status}</div>}

      {tab === "realizations" ? <div className="sce-layout">
        <form className="sce-panel sce-form" onSubmit={addRealization}><div><span className="sce-kicker">[ NEW PROJECT ]</span><h2>Add a Before / After</h2></div><label>Project title<input value={realization.title} onChange={(event) => setRealization({ ...realization, title: event.target.value })} placeholder="e.g. Spreak redesign" /></label><label>Description<textarea value={realization.copy} onChange={(event) => setRealization({ ...realization, copy: event.target.value })} placeholder="Short result-focused subtitle" /></label><div className="sce-upload-grid"><ImageField label="Before image" value={realization.before} onChange={(before) => setRealization({ ...realization, before })} onUpload={upload} /><ImageField label="After image" value={realization.after} onChange={(after) => setRealization({ ...realization, after })} onUpload={upload} /></div><button className="sce-primary" disabled={busy}>Add realization</button></form>
        <ContentList title={`${content.realizations.length} realizations · drag to reorder`} empty="Add your first realization to create the carousel." items={content.realizations.map((item) => ({ id: item.id, image: item.after, title: item.title, subtitle: item.copy }))} onDelete={(id) => void mutate("DELETE", undefined, `?kind=realizations&id=${encodeURIComponent(id)}`)} onReorder={(sourceId, targetId) => { const next = reorder(content.realizations, sourceId, targetId); void mutate("PATCH", { kind: "realizations", order: next.map((item) => item.id) }); }} />
      </div> : <div className="sce-layout">
        <form className="sce-panel sce-form" onSubmit={addReview}><div><span className="sce-kicker">[ NEW TESTIMONIAL ]</span><h2>Add a client review</h2></div><div className="sce-two"><label>Client name<input value={review.name} onChange={(event) => setReview({ ...review, name: event.target.value })} placeholder="Client name" /></label><label>Role / company<input value={review.role} onChange={(event) => setReview({ ...review, role: event.target.value })} placeholder="Founder of…" /></label></div><label>Review<textarea value={review.quote} onChange={(event) => setReview({ ...review, quote: event.target.value })} placeholder="The full client review" /></label><ImageField label="Profile picture" value={review.avatar} onChange={(avatar) => setReview({ ...review, avatar })} onUpload={upload} square /><button className="sce-primary" disabled={busy}>Add client review</button></form>
        <ContentList title={`${content.reviews.length} client reviews · drag to reorder`} empty="Add the first client review." items={content.reviews.map((item) => ({ id: item.id, image: item.avatar, title: item.name, subtitle: item.role }))} onDelete={(id) => void mutate("DELETE", undefined, `?kind=reviews&id=${encodeURIComponent(id)}`)} onReorder={(sourceId, targetId) => { const next = reorder(content.reviews, sourceId, targetId); void mutate("PATCH", { kind: "reviews", order: next.map((item) => item.id) }); }} />
      </div>}
    </main>
  );
}

function ImageField({ label, value, onChange, onUpload, square = false }: { label: string; value: string; onChange: (value: string) => void; onUpload: (file: File, apply: (path: string) => void) => void; square?: boolean }) {
  return <div className="sce-image-field"><label>{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder="/image.png or https://…" /></label><label className="sce-drop"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onUpload(file, onChange); }} />{value ? <img className={square ? "is-square" : ""} src={value} alt="Preview" /> : <span>Choose an image<br /><small>PNG, JPG, WebP or SVG · 12 MB max</small></span>}</label></div>;
}

function ContentList({ title, empty, items, onDelete, onReorder }: { title: string; empty: string; items: Array<{ id: string; image: string; title: string; subtitle: string }>; onDelete: (id: string) => void; onReorder: (sourceId: string, targetId: string) => void }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  return <section className="sce-panel sce-list"><h2>{title}</h2>{!items.length ? <div className="sce-empty">{empty}</div> : items.map((item, index) => <article key={item.id} draggable onDragStart={() => setDraggedId(item.id)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedId) onReorder(draggedId, item.id); setDraggedId(null); }} className={draggedId === item.id ? "is-dragging" : ""}><span className="sce-grip" aria-hidden="true">⋮⋮</span><img src={item.image} alt="" /><div><strong>{index + 1}. {item.title}</strong><span>{item.subtitle}</span></div><div className="sce-order"><button disabled={index === 0} onClick={() => onReorder(item.id, items[index - 1]?.id)} aria-label={`Move ${item.title} up`}>↑</button><button disabled={index === items.length - 1} onClick={() => onReorder(item.id, items[index + 1]?.id)} aria-label={`Move ${item.title} down`}>↓</button></div><button className="sce-delete" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`}>Delete</button></article>)}</section>;
}
