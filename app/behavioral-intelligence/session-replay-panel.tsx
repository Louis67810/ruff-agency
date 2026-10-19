"use client";

import { useEffect, useRef, useState } from "react";
import type { Replayer } from "@rrweb/replay";
import type { ReplayEvent, ReplaySession } from "@/lib/session-replay/types";
import { Film, Pause, Play, Radio } from "lucide-react";
import "@rrweb/replay/dist/style.css";
import "./session-replay.css";

function time(ms: number) { const seconds = Math.max(0, Math.floor(ms / 1000)); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; }

function ReplayViewer({ id }: { id: string }) {
  const surface = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const player = useRef<Replayer | null>(null);
  const events = useRef<ReplayEvent[]>([]);
  const [live, setLive] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let cursor = -1, timer: ReturnType<typeof setTimeout> | undefined;
    let observer: ResizeObserver | undefined;
    events.current = []; setReady(false); setError(""); setPosition(0); setDuration(0); setPlaying(true);
    const load = async () => {
      try {
        const response = await fetch(`/api/session-replay?id=${encodeURIComponent(id)}&after=${cursor}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("La session ne peut pas être chargée. Nouvelle tentative dans quelques secondes.");
        const data = await response.json() as { chunks: Array<{ sequence: number; events: ReplayEvent[] }>; cursor: number; more: boolean };
        if (controller.signal.aborted) return;
        const additions = data.chunks.flatMap((chunk) => chunk.events);
        cursor = data.cursor;
        if (additions.length) {
          events.current.push(...additions);
          const all = events.current;
          setDuration(Math.max(0, all[all.length - 1].timestamp - all[0].timestamp));
          if (!player.current && all.some((event) => event.type === 2) && all.length >= 2) {
            const { Replayer } = await import("@rrweb/replay");
            if (controller.signal.aborted || !mount.current) return;
            const replayer = new Replayer(all, { root: mount.current, liveMode: live, showWarning: false, showDebug: false, mouseTail: true, insertStyleRules: ["iframe { pointer-events: none; }"], UNSAFE_replayCanvas: false });
            player.current = replayer;
            const resize = () => {
              if (!surface.current || !mount.current) return;
              const width = Number(replayer.iframe.getAttribute("width")) || replayer.iframe.clientWidth || 1280;
              const height = Number(replayer.iframe.getAttribute("height")) || replayer.iframe.clientHeight || 720;
              const scale = Math.min(1, surface.current.clientWidth / width);
              mount.current.style.transform = `scale(${scale})`;
              surface.current.style.height = `${height * scale}px`;
            };
            observer = new ResizeObserver(resize);
            if (surface.current) observer.observe(surface.current);
            replayer.on("resize", resize);
            replayer.on("finish", () => { if (!live) setPlaying(false); });
            replayer.play(live ? Math.max(0, Date.now() - all[0].timestamp - 6000) : 0);
            resize(); setReady(true);
          } else if (player.current) additions.forEach((event) => player.current?.addEvent(event));
        }
        setError("");
        if (!controller.signal.aborted) timer = setTimeout(load, data.more ? 0 : 3000);
      } catch (cause) {
        if (!controller.signal.aborted) { setError(cause instanceof Error ? cause.message : "Lecture indisponible"); timer = setTimeout(load, 5000); }
      }
    };
    void load();
    const clock = setInterval(() => { if (player.current) setPosition(player.current.getCurrentTime()); }, 250);
    return () => { controller.abort(); clearTimeout(timer); clearInterval(clock); observer?.disconnect(); player.current?.destroy(); player.current = null; mount.current?.replaceChildren(); };
  }, [id, live]);
  useEffect(() => { player.current?.setConfig({ speed }); }, [speed, ready]);
  function togglePlay() {
    if (!player.current) return;
    if (playing) player.current.pause();
    else player.current.play(position >= duration ? 0 : position);
    setPlaying(!playing);
  }
  function seek(value: number) {
    if (!player.current) return;
    if (playing) player.current.play(value); else player.current.pause(value);
    setPosition(value);
  }
  return <div className="replay-viewer">
    <div className="replay-mode"><span><Radio size={15} />{live ? "Quasi direct · environ 6 à 10 s de décalage" : "Relecture depuis le début"}</span><label><input type="checkbox" checked={live} onChange={(event) => setLive(event.target.checked)} /> Suivre le direct</label></div>
    {error && <p role="alert" className="replay-error">{error}</p>}
    {!ready && <p role="status">Chargement de l’enregistrement…</p>}
    <div ref={surface} className="replay-surface"><div ref={mount} className="replay-mount" /></div>
    {!live && <div className="replay-controls">
      <button type="button" disabled={!ready} onClick={togglePlay} aria-label={playing ? "Pause" : "Lire"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
      <span>{time(Math.min(position, duration))} / {time(duration)}</span>
      <input type="range" aria-label="Position dans l’enregistrement" min={0} max={Math.max(duration, 1)} value={Math.min(position, duration)} onChange={(event) => seek(Number(event.target.value))} disabled={!ready} />
      <select aria-label="Vitesse de lecture" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option></select>
    </div>}
  </div>;
}

export function SessionReplayPanel({ visitorId }: { visitorId: string }) {
  const [sessions, setSessions] = useState<ReplaySession[]>([]);
  const [selected, setSelected] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setSessions([]); setSelected(""); setLoaded(false);
    const load = async () => {
      try {
        const response = await fetch(`/api/session-replay?visitor=${encodeURIComponent(visitorId)}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Enregistrements indisponibles. Vérifiez votre connexion au tableau de bord.");
        const data = await response.json() as { sessions: ReplaySession[] };
        if (controller.signal.aborted) return;
        setSessions(data.sessions); setSelected((current) => data.sessions.some((session) => session.id === current) ? current : data.sessions[0]?.id ?? ""); setError("");
      } catch (cause) { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Enregistrements indisponibles"); }
      finally { if (!controller.signal.aborted) setLoaded(true); }
    };
    void load(); const timer = setInterval(load, 5000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [visitorId]);
  return <section className="replay-panel" aria-label="Enregistrements du visiteur">
    <header><div><h3><Film size={20} /> Revoir la visite</h3><p>Mouvements, clics et défilement. Formulaires et espaces privés exclus.</p></div>{sessions.length > 0 && <select aria-label="Choisir un enregistrement" value={selected} onChange={(event) => setSelected(event.target.value)}>{sessions.map((session) => <option key={session.id} value={session.id}>{new Date(session.started_at).toLocaleString("fr-FR")} · {session.path}</option>)}</select>}</header>
    {error && <p role="alert" className="replay-error">{error}</p>}
    {!loaded ? <p role="status">Recherche d’enregistrements…</p> : selected ? <ReplayViewer key={selected} id={selected} /> : !error && <p className="replay-empty">Aucun enregistrement disponible. Seules les nouvelles visites ayant accepté l’enregistrement peuvent être revues, pendant 7 jours. Les anciennes visites ne peuvent pas être reconstituées.</p>}
  </section>;
}
