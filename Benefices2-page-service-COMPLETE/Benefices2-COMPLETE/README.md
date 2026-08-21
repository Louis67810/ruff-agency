# Section Bénéfices 2 — Pack complet

## Contenu
- `NEXTJS/` : composant optimisé pour React / Next.js
- `PREVIEW/` : preview autonome Windows
- `START-PREVIEW.bat` : lance directement la preview
- `DEPENDANCES.md` : tableau détaillé des dépendances

## Lancer la preview
1. Extraire entièrement le ZIP.
2. Double-cliquer sur `START-PREVIEW.bat`.
3. Au premier lancement, npm installe React/Vite dans le dossier Preview.
4. La preview s'ouvre sur `http://127.0.0.1:4173`.

## Principe de conversion
Le composant original Framer n'est pas reconstruit depuis une interprétation du design : les dimensions, breakpoints, espacements, typographies, bordures, ombres, CTA et comportements ont été repris depuis l'export puis transposés vers React/CSS natif.
