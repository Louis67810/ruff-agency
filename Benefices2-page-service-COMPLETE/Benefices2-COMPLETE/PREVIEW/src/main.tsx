import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import Benefices2Optimized from "./Benefices2Optimized";
import "./preview.css";

const PRESETS = {
  Desktop: { width: 1440, height: 1250 },
  Tablet: { width: 1024, height: 1800 },
  Mobile: { width: 390, height: 1450 },
} as const;

type Preset = keyof typeof PRESETS;

function Embedded() {
  return (
    <main className="preview-page">
      <Benefices2Optimized />
    </main>
  );
}

function Shell() {
  const [preset, setPreset] = useState<Preset>("Desktop");
  const [key, setKey] = useState(0);
  const viewport = PRESETS[preset];
  const src = useMemo(() => `/?embed=1&r=${key}`, [key]);

  return (
    <div className="preview-shell">
      <header className="preview-toolbar">
        <div>
          <strong>Section Bénéfices 2</strong>
          <span>Preview React / Next.js optimisée</span>
        </div>
        <div className="preview-controls">
          {(Object.keys(PRESETS) as Preset[]).map((name) => (
            <button key={name} className={preset === name ? "active" : ""} onClick={() => setPreset(name)}>
              {name}
            </button>
          ))}
          <button onClick={() => setKey((n) => n + 1)}>↻ Rejouer les animations</button>
        </div>
      </header>
      <div className="preview-size">{viewport.width} × {viewport.height}px</div>
      <div className="preview-stage">
        <iframe title={`Preview ${preset}`} key={`${preset}-${key}`} src={src} style={viewport} />
      </div>
    </div>
  );
}

const embed = new URLSearchParams(window.location.search).get("embed") === "1";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{embed ? <Embedded /> : <Shell />}</React.StrictMode>,
);
