# Lire Figma avec Figwright

Figwright est un serveur MCP local :
`C:\Users\lostaub\Downloads\Figwright-v0.5.0\server\node_modules\@figwright\mcp\dist\index.mjs`

Le plugin Figwright, dans Figma, s'y connecte en WebSocket sur `127.0.0.1:3055`.

## Si les outils `figwright` ne sont pas chargés dans la session
1. Lancer **un seul** serveur permanent, avec une file de commandes : `scripts/fwdaemon.mjs <dossier>`, en arrière-plan.
2. Demander à Louis d'ouvrir ou de relancer le plugin, la sélection active. `<dossier>/status.txt` passe à `1` quand le plugin est connecté.
3. Déposer un lot `[{ "name", "args", "out" }]` dans `<dossier>/queue/<lot>.json`. Les réponses arrivent dans `<dossier>/results/`, et `<lot>.done` signale la fin du lot.
4. Ne pas redémarrer le serveur entre deux lots : le plugin ne se reconnecte pas tout seul.

## Outils de lecture utiles
- `get_selection` : les nœuds sélectionnés (ids, tailles, remplissages).
- `get_design_context` avec `nodeId` et `detail: "full"` : l'arbre et la table de styles (`globalVars.styles` : couleurs, ombres, typos). L'appel sans `nodeId` dépasse vite la taille maximale : procéder **nœud par nœud**.
- `save_screenshots` : **un nœud par appel**, sinon le délai est dépassé.

`scripts/summarize.mjs <résultat.json> fx` résume un arbre : indentation, couleurs, ombres, typos.

## Règles
- **Lecture seule**, sauf demande explicite de Louis.
- Ranger les captures dans `brand/design/figma/` et documenter ce qui a été appris dans `brand/design/figma/README.md` : pattern, valeurs exactes, ce qu'il ne faut pas recopier.
