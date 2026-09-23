"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Mail,
  MousePointer2,
  RefreshCw,
  Search,
  TextCursorInput,
  X,
} from "lucide-react";

type ProfileType = { name: string; image: string; imagePosition: string };
export type HistoryPeriod = "Last 24 hours" | "Last 7 days" | "Last 30 days";
type Visitor = {
  id: string;
  email?: string;
  hoursAgo: number;
  durationMinutes: number;
  qualification: number;
  profile: string;
  lastQuestion: string;
  pages: string[];
  sections: string[];
  selectedText?: string;
  calStatus:
    "non ouvert" | "ouvert" | "partiellement rempli" | "réservation terminée";
  visits: number;
  source: string;
};

// Données de démonstration : aucune de ces visites ne provient du suivi réel.
const visitors: Visitor[] = [
  {
    id: "V-1048",
    email: "user1048@example.test",
    hoursAgo: 0.6,
    durationMinutes: 11,
    qualification: 92,
    profile: "Décideurs rapides",
    lastQuestion: "Quel délai pour lancer une landing page ?",
    pages: ["/saas-redesign", "/services/landing-page"],
    sections: ["Hero", "Résultats", "Processus", "Tarifs", "Réservation"],
    selectedText: "Livraison en 3 à 4 semaines",
    calStatus: "partiellement rempli",
    visits: 3,
    source: "Recherche organique",
  },
  {
    id: "V-1047",
    hoursAgo: 1.4,
    durationMinutes: 8,
    qualification: 78,
    profile: "Chercheurs de preuves",
    lastQuestion: "Avez-vous des résultats sur des projets SaaS ?",
    pages: ["/saas-redesign", "/realisations"],
    sections: ["Hero", "Cas clients", "Résultats", "Avis"],
    selectedText: "+42 % de conversions",
    calStatus: "ouvert",
    visits: 2,
    source: "LinkedIn",
  },
  {
    id: "V-1046",
    email: "user1046@example.test",
    hoursAgo: 2.1,
    durationMinutes: 14,
    qualification: 86,
    profile: "Comparateurs",
    lastQuestion: "Quelle différence entre vos deux offres ?",
    pages: ["/services", "/services/website", "/saas-redesign"],
    sections: ["Solutions", "Comparatif", "Tarifs", "FAQ"],
    selectedText: "Audit de conversion inclus",
    calStatus: "partiellement rempli",
    visits: 4,
    source: "Accès direct",
  },
  {
    id: "V-1045",
    hoursAgo: 3.5,
    durationMinutes: 3,
    qualification: 32,
    profile: "Explorateurs",
    lastQuestion: "Quels services proposez-vous ?",
    pages: ["/", "/services"],
    sections: ["Hero", "Services", "Équipe"],
    calStatus: "non ouvert",
    visits: 1,
    source: "Recherche organique",
  },
  {
    id: "V-1044",
    hoursAgo: 4.8,
    durationMinutes: 7,
    qualification: 61,
    profile: "Sensibles au prix",
    lastQuestion: "Le tarif comprend-il le suivi ?",
    pages: ["/saas-redesign", "/services/landing-page"],
    sections: ["Offres", "Tarifs", "FAQ"],
    selectedText: "Accompagnement après lancement",
    calStatus: "ouvert",
    visits: 2,
    source: "Recherche organique",
  },
  {
    id: "V-1043",
    email: "user1043@example.test",
    hoursAgo: 6.2,
    durationMinutes: 18,
    qualification: 95,
    profile: "Visiteurs récurrents",
    lastQuestion: "Peut-on réserver un échange cette semaine ?",
    pages: ["/", "/realisations", "/30-min"],
    sections: ["Résultats", "Avis", "Processus", "Réservation"],
    calStatus: "réservation terminée",
    visits: 5,
    source: "Accès direct",
  },
  {
    id: "V-1042",
    hoursAgo: 8.5,
    durationMinutes: 5,
    qualification: 46,
    profile: "Explorateurs",
    lastQuestion: "Travaillez-vous aussi sur le SEO ?",
    pages: ["/services", "/services/seo-geo"],
    sections: ["Hero", "Services", "SEO"],
    calStatus: "non ouvert",
    visits: 1,
    source: "Google",
  },
  {
    id: "V-1041",
    hoursAgo: 11,
    durationMinutes: 2,
    qualification: 18,
    profile: "Explorateurs",
    lastQuestion: "Aucune question",
    pages: ["/saas-redesign"],
    sections: ["Hero", "Solutions"],
    calStatus: "non ouvert",
    visits: 1,
    source: "Publicité",
  },
  {
    id: "V-1040",
    hoursAgo: 14,
    durationMinutes: 10,
    qualification: 73,
    profile: "Comparateurs",
    lastQuestion: "Est-ce compatible avec notre site actuel ?",
    pages: ["/services/website", "/saas-redesign"],
    sections: ["Solutions", "Comparatif", "FAQ", "Processus"],
    selectedText: "Intégration à l’existant",
    calStatus: "ouvert",
    visits: 2,
    source: "LinkedIn",
  },
  {
    id: "V-1039",
    email: "user1039@example.test",
    hoursAgo: 20,
    durationMinutes: 9,
    qualification: 82,
    profile: "Décideurs rapides",
    lastQuestion: "Comment démarrer le projet ?",
    pages: ["/", "/30-min"],
    sections: ["Hero", "Processus", "Réservation"],
    calStatus: "partiellement rempli",
    visits: 2,
    source: "Recommandation",
  },
  {
    id: "V-1038",
    hoursAgo: 28,
    durationMinutes: 6,
    qualification: 57,
    profile: "Chercheurs de preuves",
    lastQuestion: "Où voir les cas clients ?",
    pages: ["/realisations", "/saas-redesign"],
    sections: ["Cas clients", "Résultats", "Avis"],
    calStatus: "non ouvert",
    visits: 2,
    source: "Recherche organique",
  },
  {
    id: "V-1037",
    hoursAgo: 43,
    durationMinutes: 4,
    qualification: 38,
    profile: "Sensibles au prix",
    lastQuestion: "Proposez-vous un paiement en plusieurs fois ?",
    pages: ["/services/landing-page"],
    sections: ["Offres", "Tarifs", "FAQ"],
    calStatus: "non ouvert",
    visits: 1,
    source: "Google",
  },
  {
    id: "V-1036",
    hoursAgo: 68,
    durationMinutes: 12,
    qualification: 69,
    profile: "Visiteurs récurrents",
    lastQuestion: "Peut-on avoir un audit avant de signer ?",
    pages: ["/saas-redesign", "/services/optimisation-conversion"],
    sections: ["Résultats", "Processus", "FAQ"],
    selectedText: "Audit initial",
    calStatus: "ouvert",
    visits: 4,
    source: "Accès direct",
  },
  {
    id: "V-1035",
    hoursAgo: 91,
    durationMinutes: 5,
    qualification: 44,
    profile: "Explorateurs",
    lastQuestion: "Quelle est votre méthode ?",
    pages: ["/agence", "/services"],
    sections: ["Équipe", "Méthode", "Services"],
    calStatus: "non ouvert",
    visits: 1,
    source: "Recherche organique",
  },
  {
    id: "V-1034",
    hoursAgo: 130,
    durationMinutes: 16,
    qualification: 88,
    profile: "Chercheurs de preuves",
    lastQuestion: "Quels taux de conversion obtenez-vous ?",
    pages: ["/realisations", "/saas-redesign"],
    sections: ["Cas clients", "Résultats", "Avis", "Réservation"],
    selectedText: "Étude de cas",
    calStatus: "partiellement rempli",
    visits: 3,
    source: "LinkedIn",
  },
  {
    id: "V-1033",
    hoursAgo: 180,
    durationMinutes: 3,
    qualification: 23,
    profile: "Sensibles au prix",
    lastQuestion: "Aucune question",
    pages: ["/services"],
    sections: ["Tarifs"],
    calStatus: "non ouvert",
    visits: 1,
    source: "Publicité",
  },
  {
    id: "V-1032",
    hoursAgo: 290,
    durationMinutes: 13,
    qualification: 76,
    profile: "Comparateurs",
    lastQuestion: "Quelle formule convient à une équipe de 10 ?",
    pages: ["/services", "/saas-redesign"],
    sections: ["Solutions", "Comparatif", "Tarifs", "FAQ"],
    calStatus: "ouvert",
    visits: 3,
    source: "Google",
  },
  {
    id: "V-1031",
    hoursAgo: 560,
    durationMinutes: 7,
    qualification: 54,
    profile: "Visiteurs récurrents",
    lastQuestion: "Pouvez-vous reprendre notre site existant ?",
    pages: ["/services/website", "/agence"],
    sections: ["Services", "Équipe", "Processus"],
    calStatus: "non ouvert",
    visits: 3,
    source: "Accès direct",
  },
];

export function visitorHistoryName(id: string) {
  return visitors.some((visitor) => visitor.id === id)
    ? `User ${id.replace(/^V-/, "")}`
    : "Fiche visiteur";
}

function scoreColor(score: number) {
  if (score < 20) return "#E16540";
  if (score < 40) return "#FA9C66";
  if (score < 60) return "#FAC666";
  if (score < 80) return "#DBEB73";
  return "#95EB73";
}

function relativeTime(hours: number) {
  if (hours < 1) return `Il y a ${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 24) return `Il y a ${Math.round(hours)} h`;
  const days = Math.round(hours / 24);
  return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
}

function Qualification({ score }: { score: number }) {
  return (
    <span
      className="vh-qualification"
      aria-label={`Niveau de qualification : ${score} %`}
    >
      <strong>{score}%</strong>
      <span className="vh-score-track">
        <span
          style={{ width: `${score}%`, backgroundColor: scoreColor(score) }}
        />
      </span>
    </span>
  );
}

export function VisitorHistoryControls({
  period,
  onPeriodChange,
  page,
  onPageChange,
  granularity,
  onGranularityChange,
  pageOptions,
  onRefresh,
}: {
  period: HistoryPeriod;
  onPeriodChange: (period: HistoryPeriod) => void;
  page: string;
  onPageChange: (page: string) => void;
  granularity: string;
  onGranularityChange: (granularity: string) => void;
  pageOptions: Array<{ name: string; path: string }>;
  onRefresh?: () => void;
}) {
  const [pageOpen, setPageOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [granularityOpen, setGranularityOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const periods: HistoryPeriod[] = [
    "Last 24 hours",
    "Last 7 days",
    "Last 30 days",
  ];
  const granularities = ["Hourly", "Daily", "Weekly"];
  const periodIndex = periods.indexOf(period);
  return (
    <div
      className="df-toolbar vh-toolbar"
      role="toolbar"
      aria-label="Filtres de l’historique"
    >
      <button className="df-domain-pill" type="button" aria-label="Domaine ruff.agency">
        <img className="df-domain-icon" src="/icon.png" alt="" />
        ruff.agency
      </button>
      <div className="df-control-anchor">
        <button className="df-page-select" type="button" onClick={() => setPageOpen((value) => !value)} aria-expanded={pageOpen} aria-label={`Page : ${pageOptions.find((option) => option.path === page)?.name ?? "All"}`}>
          {pageOptions.find((option) => option.path === page)?.name ?? "All"}
          {!page && <ChevronDown />}
        </button>
        {pageOpen && (
          <div className="df-picker vh-page-picker">
            {[{ name: "All", path: "" }, ...pageOptions].map((option) => (
              <button
                key={option.path}
                className={option.path === page ? "is-active" : ""}
                onClick={() => {
                  onPageChange(option.path);
                  setPageOpen(false);
                }}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="df-period-group">
        <button
          className="df-icon-btn"
          aria-label="Période précédente"
          disabled={periodIndex === 0}
          onClick={() => onPeriodChange(periods[periodIndex - 1])}
        >
          <ChevronLeft />
        </button>
        <div className="df-control-anchor">
          <button
            className="df-control"
            onClick={() => setPeriodOpen((value) => !value)}
            aria-expanded={periodOpen}
          >
            {period}
            <ChevronDown />
          </button>
          {periodOpen && (
            <div className="df-picker">
              {periods.map((option) => (
                <button
                  key={option}
                  className={option === period ? "is-active" : ""}
                  onClick={() => {
                    onPeriodChange(option);
                    setPeriodOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className="df-icon-btn"
          aria-label="Période suivante"
          disabled={periodIndex === periods.length - 1}
          onClick={() => onPeriodChange(periods[periodIndex + 1])}
        >
          <ChevronRight />
        </button>
      </div>
      <div className="df-control-anchor">
        <button
          className="df-control"
          onClick={() => setGranularityOpen((value) => !value)}
          aria-expanded={granularityOpen}
        >
          {granularity}
          <ChevronDown />
        </button>
        {granularityOpen && (
          <div className="df-picker">
            {granularities.map((option) => (
              <button
                key={option}
                className={option === granularity ? "is-active" : ""}
                onClick={() => {
                  onGranularityChange(option);
                  setGranularityOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        className={`df-icon-btn ${refreshing ? "is-refreshing" : ""}`}
        aria-label="Actualiser"
        onClick={() => {
          setRefreshing(true);
          onRefresh?.();
          setTimeout(() => setRefreshing(false), 650);
        }}
      >
        <RefreshCw />
      </button>
    </div>
  );
}

export function VisitorHistory({
  profiles,
  period,
  page,
  onOpen,
}: {
  profiles: ProfileType[];
  period: HistoryPeriod;
  page: string;
  onOpen: (id: string) => void;
}) {
  const [profileFilter, setProfileFilter] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; left: number; dragged: boolean } | null>(
    null,
  );
  const maxHours =
    period === "Last 24 hours"
      ? 24
      : period === "Last 7 days"
        ? 168
        : period === "Last 30 days"
          ? 720
          : Infinity;
  const periodVisitors = useMemo(
    () =>
      visitors.filter(
        (visitor) =>
          visitor.hoursAgo <= maxHours &&
          (!page || visitor.pages.includes(page)),
      ),
    [maxHours, page],
  );
  const visibleVisitors = periodVisitors.filter(
    (visitor) => !profileFilter || visitor.profile === profileFilter,
  );
  const scrollRail = (direction: -1 | 1) =>
    railRef.current?.scrollBy({ left: direction * 391, behavior: "smooth" });
  return (
    <div className="vh-history">
      <section
        className="vh-profile-section"
        aria-label="Répartition des profils types"
      >
        <div
          className="vh-profile-rail"
          ref={railRef}
          tabIndex={0}
          aria-label="Faire défiler les profils"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") scrollRail(-1);
            if (event.key === "ArrowRight") scrollRail(1);
          }}
          onPointerDown={(event) => {
            dragRef.current = {
              x: event.clientX,
              left: event.currentTarget.scrollLeft,
              dragged: false,
            };
          }}
          onPointerMove={(event) => {
            if (!dragRef.current || event.buttons !== 1) return;
            const delta = event.clientX - dragRef.current.x;
            if (Math.abs(delta) > 5) dragRef.current.dragged = true;
            event.currentTarget.scrollLeft = dragRef.current.left - delta;
          }}
          onPointerUp={() => {
            if (dragRef.current)
              setTimeout(() => {
                dragRef.current = null;
              }, 0);
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
        >
          {profiles.map((profile) => {
            const share = periodVisitors.length
              ? Math.round(
                  (periodVisitors.filter(
                    (visitor) => visitor.profile === profile.name,
                  ).length /
                    periodVisitors.length) *
                    100,
                )
              : 0;
            return (
              <button
                key={profile.name}
                className={`vh-profile-card ${profileFilter === profile.name ? "is-active" : ""}`}
                aria-label={`${profile.name} : ${share}% des visiteurs`}
                title={profile.name}
                onClick={() => {
                  if (!dragRef.current?.dragged)
                    setProfileFilter((current) =>
                      current === profile.name ? null : profile.name,
                    );
                }}
                aria-pressed={profileFilter === profile.name}
              >
                <span className="vh-profile-copy">
                  <span>{profile.name}</span>
                  <strong>{share.toLocaleString("fr-FR")}%</strong>
                </span>
                <span className="vh-profile-image">
                  <Image
                    src={profile.image}
                    alt=""
                    fill
                    sizes="144px"
                    draggable={false}
                    style={{ objectPosition: profile.imagePosition }}
                  />
                </span>
              </button>
            );
          })}
        </div>
        <div className="vh-profile-fade" aria-hidden="true" />
      </section>
      <section className="vh-list-section" aria-label="Visites">
        <div className="vh-table-scroll">
          <table className="vh-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Dernière connexion</th>
                <th>Temps passé sur le site</th>
                <th>Niveau de qualification</th>
                <th>Profil type</th>
              </tr>
            </thead>
            <tbody>
              {visibleVisitors.map((visitor) => (
                <tr
                  key={visitor.id}
                  className="vh-clickable-row"
                  title={`Dernière question : ${visitor.lastQuestion}`}
                  tabIndex={0}
                  onClick={() => onOpen(visitor.id)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpen(visitor.id);
                    }
                  }}
                >
                  <td>
                    <button
                      className="vh-name-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpen(visitor.id);
                      }}
                    >
                      <span className="vh-avatar" aria-hidden="true">
                        <span />
                      </span>
                      <strong>{visitorHistoryName(visitor.id)}</strong>
                    </button>
                  </td>
                  <td>
                    <span className="vh-connection">
                      {relativeTime(visitor.hoursAgo)}
                    </span>
                  </td>
                  <td>{visitor.durationMinutes} minutes</td>
                  <td>
                    <Qualification score={visitor.qualification} />
                  </td>
                  <td>
                    {visitor.profile} : {visitor.qualification}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleVisitors.length === 0 && (
            <div className="vh-empty">
              Aucun visiteur ne correspond à ces filtres.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function VisitorHistoryDetail({
  id,
  onBack,
}: {
  id: string;
  onBack: () => void;
}) {
  const visitor = visitors.find((item) => item.id === id);
  if (!visitor)
    return (
      <div className="vh-empty">
        Visiteur introuvable.{" "}
        <button onClick={onBack}>Retour à l’historique</button>
      </div>
    );
  return (
    <div className="vh-detail">
      <div className="vh-detail-intro">
        <button className="vh-back" onClick={onBack}>
          <ArrowLeft size={17} /> Retour à l’historique
        </button>
        <div className="vh-detail-title">
          <span className="vh-avatar" aria-hidden="true">
            <span />
          </span>
          <div>
            <h2>{visitorHistoryName(visitor.id)}</h2>
            <p>
              {visitor.id} · {relativeTime(visitor.hoursAgo)} ·{" "}
              {`${visitor.visits} visite${visitor.visits > 1 ? "s" : ""}`}
            </p>
          </div>
          <span className="vh-profile-pill">{visitor.profile}</span>
        </div>
      </div>
      <div className="vh-detail-stats">
        <article>
          <span>Qualification estimée</span>
          <Qualification score={visitor.qualification} />
          <small>Score fictif, en attente de l’analyse Jeff</small>
        </article>
        <article>
          <span>Temps passé sur le site</span>
          <strong>
            <Clock3 size={20} />
            {visitor.durationMinutes} minutes
          </strong>
          <small>Sur la dernière visite</small>
        </article>
        <article>
          <span>Contact</span>
          <strong>
            <Mail size={20} />
            {visitor.email ?? "Non renseigné"}
          </strong>
          <small>
            {visitor.email
              ? "Email saisi · lead potentiel"
              : "Visiteur anonyme"}
          </small>
        </article>
      </div>
      <div className="vh-detail-grid">
        <section className="vh-detail-card">
          <h3>Parcours sur le site</h3>
          <p>Pages et sections consultées pendant cette visite.</p>
          <div className="vh-journey">
            {visitor.pages.map((path, index) => (
              <div key={path} className="vh-journey-item">
                <span className="vh-journey-icon">
                  <FileText size={18} />
                </span>
                <div>
                  <strong>{path}</strong>
                  <small>
                    {index === 0 ? "Page d’entrée" : "Page visitée"}
                  </small>
                </div>
              </div>
            ))}
          </div>
          <div className="vh-section-tags">
            <span>Sections vues</span>
            <div>
              {visitor.sections.map((section) => (
                <b key={section}>{section}</b>
              ))}
            </div>
          </div>
        </section>
        <section className="vh-detail-card">
          <h3>Actions et signaux</h3>
          <p>Éléments utiles à la future qualification par Jeff.</p>
          <div className="vh-signal">
            <MousePointer2 size={19} />
            <div>
              <strong>Formulaire cal.com</strong>
              <span>
                {visitor.calStatus === "partiellement rempli"
                  ? "Ouvert et partiellement rempli"
                  : visitor.calStatus === "réservation terminée"
                    ? "Réservation terminée"
                    : visitor.calStatus === "ouvert"
                      ? "Ouvert, sans formulaire terminé"
                      : "Non ouvert"}
              </span>
            </div>
          </div>
          <div className="vh-signal">
            <TextCursorInput size={19} />
            <div>
              <strong>Sélection de texte</strong>
              <span>
                {visitor.selectedText
                  ? `« ${visitor.selectedText} »`
                  : "Aucune sélection observée dans cet exemple"}
              </span>
            </div>
          </div>
          <div className="vh-signal">
            <Mail size={19} />
            <div>
              <strong>Email</strong>
              <span>{visitor.email ?? "Aucun email saisi"}</span>
            </div>
          </div>
          <div className="vh-signal">
            <Search size={19} />
            <div>
              <strong>Provenance</strong>
              <span>{visitor.source}</span>
            </div>
          </div>
        </section>
      </div>
      <section className="vh-detail-card vh-question-card">
        <div>
          <h3>Dernière question</h3>
          <p>
            Question attribuée à cette visite dans les données de démonstration.
          </p>
        </div>
        <blockquote>{visitor.lastQuestion}</blockquote>
      </section>
    </div>
  );
}
