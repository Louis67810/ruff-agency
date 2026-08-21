import { useState } from "react";
import RealisationsOptimized from "./RealisationsOptimized";
import { previewProjects } from "./previewData";
import "./preview.css";

type Mode = "desktop" | "tablet" | "mobile";

const widths: Record<Mode, number> = {
  desktop: 1440,
  tablet: 1024,
  mobile: 390,
};

export default function Preview() {
  const [mode, setMode] = useState<Mode>("desktop");
  const [key, setKey] = useState(0);

  return (
    <main className="preview-shell">
      <header className="preview-toolbar">
        <div className="preview-title">Section Réalisations — Preview</div>
        <div className="preview-actions">
          {(["desktop", "tablet", "mobile"] as Mode[]).map((item) => (
            <button
              key={item}
              className={mode === item ? "active" : ""}
              onClick={() => setMode(item)}
            >
              {item === "desktop" ? "Desktop" : item === "tablet" ? "Tablet" : "Mobile"}
            </button>
          ))}
          <button onClick={() => setKey((value) => value + 1)}>↻ Rejouer les animations</button>
        </div>
      </header>

      <div className="preview-stage">
        <div className="preview-frame" style={{ width: widths[mode] }}>
          <RealisationsOptimized key={key} projects={previewProjects} />
        </div>
      </div>
    </main>
  );
}
