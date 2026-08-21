import { useMemo, useState } from "react";
import ProcessusOptimized from "./ProcessusOptimized";
import "./preview.css";

type Device = "desktop" | "tablet" | "mobile";

const DEVICES: Record<Device, { label: string; width: number; height: number }> = {
  desktop: { label: "Desktop", width: 1400, height: 1287 },
  tablet: { label: "Tablet", width: 1024, height: 1287 },
  mobile: { label: "Mobile", width: 390, height: 1028 },
};

export default function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const isCanvas = params.get("canvas") === "1";
  const [device, setDevice] = useState<Device>("desktop");
  const [reloadKey, setReloadKey] = useState(0);

  if (isCanvas) {
    return <ProcessusOptimized projectHref="#" />;
  }

  const current = DEVICES[device];

  return (
    <main className="preview">
      <header className="toolbar">
        <div>
          <strong>Section Processus — preview indépendante</strong>
          <span>Framer runtime : 0 · framer-motion : 0</span>
        </div>

        <div className="actions">
          <div className="deviceGroup">
            {(Object.keys(DEVICES) as Device[]).map((key) => (
              <button
                key={key}
                className={device === key ? "active" : ""}
                onClick={() => setDevice(key)}
              >
                {DEVICES[key].label}
              </button>
            ))}
          </div>

          <button className="reload" onClick={() => setReloadKey((value) => value + 1)}>
            ↻ Recharger
          </button>
        </div>
      </header>

      <div className="info">
        Canvas réel : <b>{current.width} × {current.height}px</b>. Les media queries sont
        déclenchées dans une iframe à la vraie largeur.
      </div>

      <div className="stage">
        <iframe
          key={`${device}-${reloadKey}`}
          title={`Preview ${current.label}`}
          src="/?canvas=1"
          style={{ width: current.width, height: current.height }}
        />
      </div>
    </main>
  );
}
