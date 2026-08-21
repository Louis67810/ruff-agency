# Preview Section Réalisations

## Windows

1. Décompresse le ZIP.
2. Double-clique sur `START-PREVIEW.bat`.
3. Au premier lancement, npm installe les dépendances dans ce dossier uniquement.
4. La preview s'ouvre sur `http://127.0.0.1:4173`.

Tu peux basculer entre Desktop / Tablet / Mobile et relancer les animations.

### Important sur les données
Le ZIP Framer de cette section embarque la structure du CMS et ses requêtes, mais pas les enregistrements CMS eux-mêmes. La preview utilise donc des visuels déjà présents dans l'export précédent du même site uniquement pour rendre le composant testable. Le composant final reçoit `projects` en props et ne dépend d'aucun CMS Framer.
