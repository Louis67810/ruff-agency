# Preview — Section Processus

## Windows

Double-clique sur :

`START-PREVIEW.bat`

Au premier lancement, le script exécute `npm install` dans ce dossier uniquement, puis ouvre la preview sur :

`http://127.0.0.1:4173`

Ton projet actuel n'est jamais modifié.

## Manuel

```bash
npm install
npm run dev
```

La barre en haut permet de tester :
- Desktop : 1400 × 1287
- Tablet : 1024 × 1287
- Mobile : 390 × 1028

Le rendu de la section est chargé dans une iframe à la vraie largeur pour déclencher réellement les media queries.
