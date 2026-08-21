import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PrixOptimized from './PrixOptimized';
import './preview.css';

type View = 'desktop' | 'tablet' | 'mobile';

const dimensions: Record<View, { width: number; label: string }> = {
  desktop: { width: 1400, label: 'Desktop · 1400px' },
  tablet: { width: 1024, label: 'Tablet · 1024px' },
  mobile: { width: 390, label: 'Mobile · 390px' },
};

function App() {
  const [view, setView] = useState<View>('desktop');
  const [version, setVersion] = useState(0);

  return (
    <main className="previewApp">
      <header className="previewToolbar">
        <div>
          <strong>Section Prix</strong>
          <span>Preview isolée — le slider, les options, CTA et ticker sont interactifs</span>
        </div>
        <nav className="previewControls" aria-label="Taille de preview">
          {(Object.keys(dimensions) as View[]).map((item) => (
            <button
              key={item}
              className={view === item ? 'active' : ''}
              onClick={() => setView(item)}
            >
              {dimensions[item].label}
            </button>
          ))}
          <button onClick={() => setVersion((value) => value + 1)}>↻ Réinitialiser</button>
        </nav>
      </header>

      <div className="stage">
        <div className="viewport" style={{ width: dimensions[view].width }}>
          <PrixOptimized key={version} bookingHref="#" secondaryHref="#" />
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
