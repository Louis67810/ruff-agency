# Preview autonome — Hero Réalisations

## Windows

1. Décompresser complètement le ZIP.
2. Double-cliquer sur `START.bat`.
3. Au premier lancement, npm installe React, React DOM, Framer Motion, lottie-web et Vite.
4. Vite ouvre automatiquement le navigateur sur le port disponible.
5. Garder la fenêtre noire ouverte pendant la preview.

Le pack n'utilise pas `@vitejs/plugin-react`, ce qui évite le conflit de peer dependencies rencontré sur les anciennes previews.

Les assets visuels (images, vidéo, polices, Lottie) sont chargés depuis leurs URLs originales : une connexion Internet est nécessaire pour voir le rendu complet.
