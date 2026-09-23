"use client";

import type { AnalyticsVisitor } from "@/lib/saas-analytics/types";
import type { HistoryPeriod } from "./visitor-history";
import { ArrowLeft, Clock3, FileText, MousePointer2 } from "lucide-react";

export function visitorHistoryName(id: string) {
  return `Visiteur ${id.slice(0, 8)}`;
}

function relativeTime(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - Date.parse(value)) / 60_000));
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (minutes < 1440) return `Il y a ${Math.floor(minutes / 60)} h`;
  return `Il y a ${Math.floor(minutes / 1440)} j`;
}

export function TrackedVisitorHistory({ visitors, period, page, onOpen }: {
  visitors: AnalyticsVisitor[]; period: HistoryPeriod; page: string; onOpen: (id: string) => void;
}) {
  const days = period === "Last 24 hours" ? 1 : period === "Last 7 days" ? 7 : 30;
  const visible = visitors.filter((visitor) => Date.parse(visitor.lastSeen) >= Date.now() - days * 86_400_000 && (!page || visitor.pages.includes(page)));
  return <div className="vh-history">
    <section className="vh-list-section" aria-label="Visites suivies">
      <div className="vh-table-scroll">
        <table className="vh-table"><thead><tr><th>Visiteur</th><th>Dernière activité</th><th>Temps suivi</th><th>Sessions</th><th>Dernière page</th></tr></thead>
          <tbody>{visible.map((visitor) => <tr key={visitor.id} className="vh-clickable-row" tabIndex={0} onClick={() => onOpen(visitor.id)} onKeyDown={(event) => { if (event.key === "Enter") onOpen(visitor.id); }}>
            <td><button className="vh-name-button" onClick={(event) => { event.stopPropagation(); onOpen(visitor.id); }}><span className="vh-avatar" aria-hidden="true"><span /></span><strong>{visitorHistoryName(visitor.id)}</strong></button></td>
            <td><span className="vh-connection">{relativeTime(visitor.lastSeen)}{visitor.online ? " · en ligne" : ""}</span></td>
            <td>{Math.round(visitor.durationSeconds / 60)} min</td><td>{visitor.visits}</td><td>{visitor.currentPage ?? "—"}</td>
          </tr>)}</tbody>
        </table>
        {!visible.length && <div className="vh-empty">Aucun visiteur suivi pour ces filtres.</div>}
      </div>
    </section>
  </div>;
}

export function TrackedVisitorDetail({ visitor, onBack }: { visitor?: AnalyticsVisitor; onBack: () => void }) {
  if (!visitor) return <div className="vh-empty">Visiteur introuvable. <button onClick={onBack}>Retour à l’historique</button></div>;
  return <div className="vh-detail">
    <div className="vh-detail-intro"><button className="vh-back" onClick={onBack}><ArrowLeft size={17} /> Retour à l’historique</button>
      <div className="vh-detail-title"><span className="vh-avatar" aria-hidden="true"><span /></span><div><h2>{visitorHistoryName(visitor.id)}</h2><p>{relativeTime(visitor.lastSeen)} · {visitor.visits} session{visitor.visits > 1 ? "s" : ""}</p></div></div>
    </div>
    <div className="vh-detail-stats">
      <article><span>Statut</span><strong>{visitor.online ? "En ligne" : "Hors ligne"}</strong><small>Dernière activité : {relativeTime(visitor.lastSeen)}</small></article>
      <article><span>Temps suivi</span><strong><Clock3 size={20} />{Math.round(visitor.durationSeconds / 60)} min</strong><small>Durée enregistrée des pages visitées</small></article>
      <article><span>Conversions</span><strong>{visitor.conversions}</strong><small>Événements de conversion observés</small></article>
    </div>
    <div className="vh-detail-grid">
      <section className="vh-detail-card"><h3>Parcours sur le site</h3><p>Pages et sections réellement observées.</p>
        <div className="vh-journey">{visitor.pages.map((path, index) => <div key={path} className="vh-journey-item"><span className="vh-journey-icon"><FileText size={18} /></span><div><strong>{path}</strong><small>{index === 0 ? "Première page observée" : "Page visitée"}</small></div></div>)}</div>
        <div className="vh-section-tags"><span>Sections vues</span><div>{visitor.sections.length ? visitor.sections.map((section) => <b key={section}>{section}</b>) : <span>Aucune section enregistrée</span>}</div></div>
      </section>
      <section className="vh-detail-card"><h3>Activité</h3><p>Données enregistrées par le tracker.</p>
        <div className="vh-signal"><MousePointer2 size={19} /><div><strong>Dernière action</strong><span>{visitor.lastAction.replaceAll("_", " ")}</span></div></div>
        <div className="vh-signal"><MousePointer2 size={19} /><div><strong>Provenance</strong><span>{visitor.source}</span></div></div>
        <div className="vh-signal"><MousePointer2 size={19} /><div><strong>Appareil et pays</strong><span>{visitor.device} · {visitor.countryCode}{visitor.city ? ` · ${visitor.city}` : ""}</span></div></div>
      </section>
    </div>
  </div>;
}
