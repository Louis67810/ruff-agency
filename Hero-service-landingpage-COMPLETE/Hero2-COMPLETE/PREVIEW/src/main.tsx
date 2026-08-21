import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import Hero2Optimized from "./Hero2Optimized";
import "./preview.css";

const PRESETS = {
  Desktop: { width: 1440, height: 1100 },
  Tablet: { width: 1024, height: 980 },
  Mobile: { width: 390, height: 820 },
} as const;

type Preset = keyof typeof PRESETS;

function EmbeddedPreview() {
  return <Hero2Optimized realisationsHref="#" bookingHref="#" />;
}

function PreviewShell() {
  const [preset, setPreset] = useState<Preset>("Desktop");
  const [reloadKey, setReloadKey] = useState(0);
  const viewport = PRESETS[preset];
  const src = useMemo(() => `/?embed=1&r=${reloadKey}`, [reloadKey]);

  return (
    <main className="preview-shell">
      <header className="toolbar">
        <div>
          <strong>Hero 2</strong>
          <span>Preview React / Next.js optimisée</span>
        </div>
        <div className="controls">
          {(Object.keys(PRESETS) as Preset[]).map((name) => (
            <button key={name} className={preset === name ? "active" : ""} onClick={() => setPreset(name)}>{name}</button>
          ))}
          <button onClick={() => setReloadKey((v) => v + 1)}>↻ Rejouer les animations</button>
        </div>
      </header>
      <div className="viewport-meta">{viewport.width} × {viewport.height}px</div>
      <div className="stage">
        <iframe key={`${preset}-${reloadKey}`} src={src} title={`Hero 2 ${preset}`} style={{ width: viewport.width, height: viewport.height }} />
      </div>
    </main>
  );
}

const isEmbed = new URLSearchParams(window.location.search).get("embed") === "1";
createRoot(document.getElementById("root")!).render(<React.StrictMode>{isEmbed ? <EmbeddedPreview /> : <PreviewShell />}</React.StrictMode>);
