# Banque d'illustrations (tri façon Tinder)

App en ligne : https://claude.ai/artifact/JG98tyNgWMHBcassVQsgiy

- `index.html` : l'app (onglets Trier / Banque / Partage).
- `bank.json` : les images (id, file, src = lien public d'origine, page = source, title, query, batch).
- `img/` : copies des images servies par l'app.
- Les choix sont dans la base de l'artefact, collection `decisions` (un doc par id : status = `project` | `like` | `reject`).
- `comparaison-reference.jpg` : référence vs rendu (repos / glissé).

## Ajouter un lot d'images

1. Ajouter les fichiers dans `img/` et les entrées à la fin de `bank.json` (nouveau `batch`).
2. Ne jamais réutiliser un `src` déjà présent ; vérifier aussi le doublon visuel (dhash).
3. Republier `index.html` avec les nouveaux fichiers dans `files` (même URL). Les choix déjà faits ne bougent pas.
