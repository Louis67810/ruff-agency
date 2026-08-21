import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import AvisOptimized from "./AvisOptimized";
import "./preview.css";

const PRESETS = {
  Desktop: { width: 1440, height: 700 },
  Tablet: { width: 1024, height: 760 },
  Mobile: { width: 390, height: 760 },
} as const;

type Preset = keyof typeof PRESETS;

function EmbeddedPreview() {
  return (
    <main className="embedded-page">
      <AvisOptimized />
    </main>
  );
}

function PreviewShell() {
  const [preset, setPreset] = useState<Preset>("Desktop");
  const [reloadKey, setReloadKey] = useState(0);
  const viewport = PRESETS[preset];
  const src = useMemo(() => `/?embed=1&r=${reloadKey}`, [reloadKey]);

  return (
    <div className="preview-shell">
      <header className="toolbar">
        <div>
          <strong>Section Avis</strong>
          <span className="subtitle">Preview React / Next.js optimisée</span>
        </div>

        <div className="controls">
          {(Object.keys(PRESETS) as Preset[]).map((name) => (
            <button
              type="button"
              key={name}
              className={preset === name ? "active" : ""}
              onClick={() => setPreset(name)}
            >
              {name}
            </button>
          ))}
          <button type="button" onClick={() => setReloadKey((n) => n + 1)}>
            ↻ Recharger
          </button>
        </div>
      </header>

      <div className="viewport-meta">
        {viewport.width} × {viewport.height}px
      </div>

      <div className="stage">
        <iframe
          key={`${preset}-${reloadKey}`}
          title={`Preview ${preset}`}
          src={src}
          style={{ width: viewport.width, height: viewport.height }}
        />
      </div>
    </div>
  );
}

const isEmbed = new URLSearchParams(window.location.search).get("embed") === "1";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{isEmbed ? <EmbeddedPreview /> : <PreviewShell />}</React.StrictMode>,
);
