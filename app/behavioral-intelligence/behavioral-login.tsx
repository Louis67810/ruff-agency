"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function BehavioralIntelligenceLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/saas-analytics/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(response.status === 429 ? "Trop de tentatives. Réessayez dans quelques minutes." : "Mot de passe incorrect.");
        return;
      }
      router.refresh();
    } catch {
      setError("Connexion impossible pour le moment.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="fw-login-page">
    <form className="fw-login-card" onSubmit={signIn}>
      <span>RUFF / PRIVATE ANALYTICS</span>
      <h1>Behavioral Intelligence</h1>
      <p>Connectez-vous pour consulter les statistiques du site.</p>
      <label htmlFor="fw-analytics-password">Mot de passe</label>
      <input id="fw-analytics-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <button type="submit" disabled={busy}>{busy ? "Connexion…" : "Ouvrir le tableau de bord"}</button>
      {error && <small role="alert">{error}</small>}
    </form>
  </main>;
}
