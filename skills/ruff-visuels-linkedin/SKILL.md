---
name: ruff-visuels-linkedin
description: Crée les carrousels LinkedIn et les posts à image unique de Louis Staub (Ruff Agency) dans son style, directement dans Figma via Figwright, en clonant ses vrais composants. À utiliser dès que Louis demande un carrousel, une slide, une couverture, un post image, ou veut ajouter des références / retours au système.
---

# Visuels LinkedIn Ruff Agency

Louis veut des visuels qu'on reconnaît comme les siens : mêmes composants, mêmes typos, mêmes effets, mais des illustrations inventées pour chaque message. Le système s'enrichit avec de nouvelles références et de nouveaux retours ; ce n'est pas une liste fermée de layouts.

## À lire avant de produire

1. `references/regles.md` : règles générales (priment sur tout ancien post), préférences fréquentes, ambiguïtés.
2. `references/journal-retours.md` : d'où vient chaque règle et ce qui n'était qu'une correction locale.
3. `banque/index.html` (ouvrir via `python -m http.server` dans `banque/`) ou `banque/banque.json` : familles de carrousels, types de slides, composants avec leurs IDs Figma, posts à image unique, tests précédents.

## Méthode

**Produire dans Figma, pas en HTML.** Figwright doit être connecté (`ping`). Le corpus est dans la « Section 1 » (`5406:10804`) du fichier de Louis.

1. **Choisir l'ossature selon le type de contenu**, pas le dernier carrousel fait :
   - liste d'astuces / d'erreurs : couverture → (contexte) → points numérotés → merci → offre ;
   - guide : étapes (cartouche blanc + bloc bleu) et numérotation qui repart à chaque étape ;
   - étude de cas : étapes ; problèmes de l'ancien site en rouge ; avant/après empilé ; « Pourquoi ce design fonctionne mieux ? » ; solutions en bleu ;
   - comparatif VS : blocs d'étape bleus pour les forces, rouges pour les faiblesses ; résultat + appel au commentaire ;
   - quiz : deux visuels presque identiques → réponse → « Pourquoi ? » blanc ;
   - stratégie unique : bloc d'annonce + étapes d'application + « Pourquoi ça marche ? ».
   - post à image unique : voir la section dédiée de la banque (7 familles observées).
2. **Créer une section de test** à côté du corpus, cloner les slides gabarits voisines (`clone_node` + `reparent_nodes`), puis remplacer les textes. Mettre chaque cartouche en auto-layout « hug » (`kit.hug`) : une ligne, padding symétrique.
3. **Illustrer chaque slide pour son message** avec `outils/kit.mjs` : cartes UI, champs, options, `sourceCTA` (vrai CTA cloné et mis à l'échelle), `tag` (tag blanc source), `badge` (check / croix mis à l'échelle calque par calque), `arrow` (flèche construite de A vers B), `hand` (main source). Ne jamais redessiner un composant qui existe dans la banque.
4. **Exporter et regarder** : `node outils/export.mjs <sectionId> <dossier>` puis `python outils/pdf.py <dossier> <nom>`. Regarder chaque slide rendue (fit, couches, sens des flèches, taille des badges, main visible) avant de livrer.
5. **Après les retours de Louis** : classer chaque retour en *règle générale* ou *correction locale*, l'écrire dans `references/journal-retours.md` et `references/regles.md`, mettre à jour `banque/banque.json` (+ `banque/tests/vN.json`), relancer `python outils/build_banque.py`. Garder la version précédente (dupliquer la section avant de corriger).

## Outils

- `outils/fw.mjs` : client stdio du serveur Figwright (`node fw.mjs <outil> '<json>'` ou import). Utile car l'outil `batch` refuse beaucoup d'écritures.
- `outils/kit.mjs` : briques d'illustration et constantes de style relevées sur le corpus.
- `outils/capture-sections.mjs` : captures écran par écran d'un vrai site (Chrome headless + DevTools), y compris les sites Framer dont les sections n'apparaissent qu'au défilement. `capture-site.mjs` donne en plus les positions des titres de section. Recadrer sans le badge « Made in Framer » ni les contenus à exclure (Lorem ipsum, chiffres du client lus comme des preuves).
- `outils/catalogue.mjs` : exporte un corpus (vignettes par groupe + composants) vers `banque/`.
- `outils/build_banque.py` : régénère `banque/index.html` à partir des JSON.
- `exemples/strategie-secrete/` : scripts du premier carrousel (v1) et de ses corrections (v2), à lire comme exemples, pas comme gabarits.

## Ajouter de nouvelles références

Louis sélectionne un groupe dans Figma → `get_selection` → l'ajouter à la liste de `catalogue.mjs` (ou exporter seulement les nouveaux groupes) → décrire la famille dans `banque.json` avec des notes statutées (`observation` par défaut ; `regle` seulement si Louis l'a dit). Un groupe n'est pas forcément un carrousel : vérifier l'ordre et le sujet des slides.

## Contenu

Ne jamais inventer d'expérience personnelle, de client ou de chiffre. Un chiffre vu dans un ancien post (« 4x plus de conversion ») est un exemple de forme, pas une preuve. Tutoiement, phrases courtes et concrètes. Les modules de voix éventuels sont séparés de ce skill.
