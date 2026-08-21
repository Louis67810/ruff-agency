# Hero 2 — Pack complet

Ce pack contient :

- `NEXTJS/` : composant React / Next.js optimisé
- `PREVIEW/` : projet Vite autonome
- `START-PREVIEW.bat` : lancement direct sous Windows
- `DEPENDANCES.md` : tableau complet des dépendances

## Preview
1. Extrais le ZIP.
2. Double-clique sur `START-PREVIEW.bat`.
3. Choisis Desktop / Tablet / Mobile dans la barre de preview.

## Origine de l'optimisation
L'export original fait environ 3,11 Mo pour `Hero.js` et embarque en plus `_framer-runtime.js` (~1,98 Mo). La version optimisée remplace les systèmes Framer par React + CSS natifs tout en conservant les valeurs de design et de responsive issues de l'export.
