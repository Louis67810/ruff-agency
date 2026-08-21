import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import PointsFocusOptimized from "./PointsFocusOptimized";
import "./preview.css";

const PRESETS = {
  Desktop: { width: 1400, height: 1250 },
  Tablet: { width: 1024, height: 1800 },
  Mobile: { width: 390, height: 3000 },
} as const;

type Preset = keyof typeof PRESETS;

function EmbeddedPreview() {
  return <PointsFocusOptimized />;
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
          <strong>Section Points de focus</strong>
          <span>Preview optimisée indépendante du runtime Framer</span>
        </div>
        <div className="controls">
          {(Object.keys(PRESETS) as Preset[]).map((name) => (
            <button key={name} className={preset === name ? "active" : ""} onClick={() => setPreset(name)}>
              {name}
            </button>
          ))}
          <button onClick={() => setReloadKey((v) => v + 1)}>↻ Rejouer</button>
        </div>
      </header>
      <div className="meta">{viewport.width} × {viewport.height}px</div>
      <div className="stage">
        <iframe
          key={`${preset}-${reloadKey}`}
          title={`Preview ${preset}`}
          src={src}
          style={{ width: viewport.width, height: viewport.height }}
        />
      </div>
    </main>
  );
}

const embed = new URLSearchParams(window.location.search).get("embed") === "1";
createRoot(document.getElementById("root")!).render(embed ? <EmbeddedPreview /> : <PreviewShell />);
