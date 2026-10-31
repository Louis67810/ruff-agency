# Vérifier comme un critique

« L'essentiel de la qualité vient du second regard. » On ne livre pas sans avoir fait les trois étapes.

## 1. Audit automatique
```
node .claude/skills/ruff-design/scripts/audit.mjs brand/design/sections/<section>-vN.html
```
- Il doit afficher **`audit passed`**. Chaque `FAIL` se corrige dans la maquette, jamais en contournant le script.
- Les `WARN R6` (ombre écrite à la main) se justifient ou se remplacent par une variable `--rf-shadow-*`.
- Ce que l'audit contrôle : R1, R3, R7, R9, R11, R13, R15, R17, R18 et R19. Ce qu'il ne voit pas se vérifie à l'œil (étape 3).

## 2. Rendus
```
node .claude/skills/ruff-design/scripts/render.mjs brand/design/sections/<section>-vN.html
```
- Le script produit `-desktop.png` (1440 px), `-mobile.png` (375 px) et `-close.png` (densité ×2).
- **Lire chaque image produite.** Pour le gros plan, recadrer chaque carte (curseur, poignées, puces, jonctions).

## 3. Checklist à l'œil (cocher chaque ligne)

**Idée**
- [ ] Chaque carte traduit le bénéfice en idée visuelle ; le concept est écrit en commentaire au-dessus de la scène.
- [ ] Il y a un objet central détaillé (≥ 12 éléments), pas deux éléments reliés.
- [ ] Rien ne recopie l'objet d'une référence Figma.

**Couleur et forme**
- [ ] Les cartes sont toutes teintées, chacune d'une teinte différente, ou aucune ne l'est. Aucune n'est sombre.
- [ ] Il n'y a qu'un seul point de bleu par scène.
- [ ] Les ombres viennent du site, et aucun élément imbriqué n'en a.
- [ ] Les cercles ont une ombre en diagonale ; les maquettes, une ombre vers le bas.

**Maquettes**
- [ ] Logos gris, boutons `#333`, poignées arrondies, curseur du site.
- [ ] Les petits ronds sont des pastilles `.rf-dot`.

**Bas des cartes**
- [ ] Chaque élément qui descend finit en fondu ; chaque élément flottant est entier. Vérifier sur desktop **et** sur mobile.
- [ ] Le texte de la carte reste lisible, rien ne le touche.

**Structure de page** (`structure.md`)
- [ ] Le footer et la FAQ sont ceux du site, avec leurs CSS d'origine.
- [ ] Les fonds alternent (page / blanc / gris / bleu en dégradé) ; il n'y a aucun aplat bleu.
- [ ] Il y a au plus un titre bicolore ; les H2 font 64 px d'une seule couleur.
- [ ] La réassurance utilise des Heroicons et des séparateurs, pas de points.
- [ ] Aucun libellé en MAJUSCULES dans le contenu ; aucune boîte dans une boîte ; aucune étiquette décorative ; aucun schéma posé au milieu d'une section.
- [ ] Chaque titre est dans sa colonne ; les éléments d'une même rangée sont alignés (textes de hauteur égale avant les visuels).
- [ ] Pastilles et cadres de sélection n'apparaissent que dans des illustrations de création, sur l'objet entier.
- [ ] La section qui précède le footer laisse environ 300 px pour son bandeau d'appel.

**En-tête**
- [ ] Les titres sont en Plus Jakarta Sans (pas en Arial) et le H2 est bicolore.
- [ ] Le bouton fait 60 px, avec la photo de Louis.

## Défauts fréquents et corrections

| On voit… | Correction |
|---|---|
| Des titres en Arial | Une règle CSS précède l'`@import` des polices : la déplacer après |
| Un bouton trop haut | `box-sizing: border-box` absent, ou bouton étiré par le flex (`flex: none`) |
| Un objet coupé net au-dessus du texte | Le prolonger sous le texte et ajouter `.rf-bento__fade`, ou le raccourcir pour qu'il flotte entier |
| Un objet à moitié fondu sur mobile | Allonger l'objet, ou réduire `--s` pour cette scène (`.bn-scene--wide`) |
| Une scène qui déborde sur mobile | `--s` plus petit pour cette scène seulement |
| Une puce qui cache une poignée | Déplacer la puce au coin du cadre, sans recouvrir les poignées |
| Une scène vide, deux éléments reliés | Repartir d'un objet central détaillé (interface, page, panneau) |
| Des pointillés en vague | Supprimer : R17 |
| Des ronds pastel minuscules | `.rf-dot` |
| Un rendu headless bloqué | Un profil verrouillé : `render.mjs` crée un profil neuf à chaque fois |

## Gros chantiers (optionnel)

Pour une page entière, faire comme Anatomy :
- un rôle **constructeur** ;
- un ou plusieurs **relecteurs**, chacun avec un seul angle (couleur, composition, maquettes, mobile) ;
- un **correcteur**.

Les relecteurs refont l'audit et leurs propres captures ; ils ne se contentent pas du rapport du constructeur. Tourner jusqu'à ce qu'un tour ne trouve plus rien. Garder un `BRIEF.md` (les mots de Louis, mot pour mot) et un `PROGRESS.md` (fait / suivant / décisions ouvertes).
