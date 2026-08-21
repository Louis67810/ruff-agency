# Preview — Section Avis

## Windows

1. Décompresse complètement le ZIP.
2. Double-clique sur `START-PREVIEW.bat`.
3. Au premier lancement, `npm install` s'exécute uniquement dans ce dossier.
4. La preview s'ouvre sur `http://127.0.0.1:4173`.

Les boutons Desktop / Tablet / Mobile redimensionnent une vraie iframe : les media queries du composant sont donc réellement déclenchées.

La preview est indépendante de ton projet actuel.

## Remarque asset

La photo d'Antoine n'était pas incluse physiquement dans l'export Framer ; l'URL originale est donc utilisée pour garantir la même photo. Tu peux la remplacer par un fichier local via la prop `avatarSrc` dans la version finale.
