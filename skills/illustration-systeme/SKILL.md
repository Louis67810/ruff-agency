---
name: illustration-systeme
description: Moteur d'illustration de Louis pour faire des illustrations et des sections de site de haute qualité (ombres en couches, cadres doubles, câbles, orbites, métal, curseurs, courbes, cartes sur patte), avec ou sans style de marque. À utiliser pour TOUTE demande d'illustration, de scène, de carte illustrée ou de section avec illustrations (« fais-moi une illustration », « refais cette section dans mon style », « illustre ces 4 fonctionnalités », « refais cette capture »), même quand aucun style n'est précisé. Pour le site Ruff Agency, le skill ruff-design prime.
---

# Moteur d'illustration

v1.0 (06/11/2026). Ce skill contient **le système** : la mécanique qui fait la qualité, séparée du style.
- **Moteur** (`moteur/`) : ombres en couches, cadres, décors, briques et compositions validées. Aucune couleur en dur.
- **Styles** (`styles/*.css`) : uniquement des réglages (couleurs, teintes d'ombre, polices, rayons). `neutre` par défaut, `nouveau-style` (fond chaud, indigo).
- **Catalogue** (`catalogue/`) : chaque composition rendue dans chaque style, plus une section exemple.
- **L'œil** (`oeil/`) : les références, les paires « référence | rendu » et la liste des erreurs déjà corrigées.

Chemin du skill : `C:/Users/louis/.claude/skills/illustration-systeme/`.

## Pages et landing pages (`pages/`)
Pour toute page complète (landing, accueil, tarifs, contact, blog, à propos, légal, 404) : lire **`pages/grammaire.md`** (grille, typo exacte, boutons, en-têtes, séparateurs, ordre des sections, règles, méthode Figma) et **`pages/sections.json`** (32 types de sections, chacun avec son nœud Figma à cloner, sa structure et ses illustrations). Aperçus : `pages/sections/<type>.png`. Une illustration ne doit jamais apparaître deux fois sur une page.

## Grille, couleurs, typo, ressources (`pages/grille.md`) — À LIRE EN PREMIER pour toute page
12 colonnes (marge 150, gouttière 20), jointures rondes, hero centré, palette et tailles de texte exactes, et la liste des nœuds à cloner (guillemets, lumière, motif, fenêtre de site, curseurs). Outil : `pages/grille.py`.

## Nouvelle page : copie → structure → illustrations (`pages/inspiration.md`)
Ordre imposé par Louis (14/11) : 1) écrire toute la copie ; 2) poser la structure en fil de fer sur la grille en choisissant les layouts de sa banque « Bon Layout » ; 3) seulement ensuite les illustrations, d'après sa banque « Structure des illustrations » (idée et structure, jamais le style). Exemple complet : `pages/exemples/pointe/` (copie.md, structure.py, page.py).

## Illustrations d'une page : RECOMPOSER les vraies illustrations du site (retour du 14/11 soir)
Jamais de cartes simples redessinées (« ultra simples, n'ajoutent rien »). Pour chaque illustration : cloner le panneau du site le plus proche (Figma page Design, Section 1 `6002:4` : `6002:360` tri en liste + éventail de câbles + socle, `6002:669` bouclier métal, `6002:4968` marque lumineuse + liste à boutons + curseur, `6018:354` nuage, `6019:186` fichiers → formats → bouton → partage, `6019:357` réunion + notes), puis le RECOMPOSER : nouveau contenu, nouvelles pièces dans la même DA (pilule sombre à 2 zones, pièce qui sort de la liste avec ombre flottante, permissions autorisée/barrée…), une info clé. La banque d'inspiration ne donne que l'idée. Exemples : landing Pointé, nœuds `6089:1099`, `6089:1407`, `6089:1496`, `6089:1620`.
Pièges Figwright : (1) les textes clonés en « Inter Tight » ne se modifient pas (police non chargée) → créer un nouveau texte Inter au même parent/position (`create_text`), le styler, supprimer l'ancien, puis `reorder_nodes` si le parent est en auto-layout ; (2) les calques importés ont des contraintes SCALE : avant d'agrandir une section ou une carte, passer ses enfants en `set_constraints MIN/MIN` (sinon tout est étiré) ; (3) un batch qui « expire » peut être annulé plus tard : toujours vérifier par capture, batchs de 5 à 15 ops.

## Construire en VRAIES FRAMES dans Figma (`pages/construit.py`)
`F` (frame), `T` (texte à rôle typographique de grille.md), `V` (vecteurs) → `Section.ecrire()` sort un SVG où chaque conteneur est un `<svg>` imbriqué : `import_svg` en fait des FRAMES (textes éditables, style via le nom PostScript « Inter-SemiBold »). Puis `design_diff(nodeId, rootDir=…/sortie)` écrit l'arbre réel sur disque → `python construit.py ops x.post.json .figwright/snapshots/<id>.json --lot=25` → `batch` (fonds, rayons, contours, ombres, interlettrage, retour à la ligne). Batchs de 25 ops max, **un à la fois** (en parallèle ils expirent ; un « timeout » applique souvent quand même : vérifier par capture). Réutiliser tel quel les sections déjà validées (nav, hero, FAQ, pied de page) par `clone_node` + `reparent_nodes` + `set_text`.

## Retours de Louis = contraintes (`retours/`)
Avant toute page : lire `retours/README.md` puis les fichiers de `retours/` ; après : se vérifier ligne par ligne. Chaque retour de Louis y devient une règle vérifiable + son contre-exemple (nœud Figma fautif).

## Outils de Louis : ombre de store et motif de tuiles (`motifs/outils-louis/`, `motifs/outils_louis.py`)
- **Ombre de store : toujours cet outil, jamais à la main.** `ombre_png(recette, 'ombre.png', echelle=.2)` fabrique le calque fidèle (fond transparent) ; l'envoyer avec `import_image` (petit PNG palette, ~5 ko en base64, voir `motifs/images/ombre-store-figma-p.png`), puis `set_blend_mode MULTIPLY` et `set_opacity 0.3`. Une fois dans Figma, cloner ce nœud et le redimensionner au lieu de réimporter. Réglages : nombre de lames, angle, espacement, épaisseur, flou, densité, ombre large.
- **Motif de tuiles** : l'outil d'origine est reproduit en vrai calques par `motifs.tuiles_repetables()` (même grille pour tout, donc il se répète sans raccord visible). `motif_svg()` appelle l'original (copie dans `outils-louis/`, jamais modifié) si l'on veut sa version exacte, non répétée.

## Lumières, ombres et motifs de page (`motifs/`)
Pour toute section ou page : lire **`motifs/README.md`**. Outils (pas des gabarits) qui recréent les motifs récurrents des pages : halo indigo, ombre de store, chute sombre des sections noires, reflet, grain, grille et formes pixel, rubans, escalier de tuiles, épingle, formulaires exacts, FAQ exacte, pied de page sombre. `motifs/effets.json` = préréglages d'effets Figma exacts (ombres en couches) utilisables sur n'importe quel calque. `motifs/motifs.py` sort du SVG à calques nommés + les ops Figwright (effets, fusion, opacité, polices). Les valeurs par défaut viennent du Figma ; changer couleur, angle, densité, motif est permis et attendu.

## La bibliothèque : la base exacte (`bibliotheque/`)
Ce sont les illustrations de référence **exportées de Figma** et vérifiées au pixel, pas des recréations. Voir `bibliotheque/index.html` (12 scènes, 16 éléments) et `index.json` (nom, nœud Figma, méthode, écart mesuré).
- **Scènes** (`scenes/<nom>.svg` + `<nom>.png` = vérité Figma) : la référence à imiter et à comparer. Leurs textes sont vectorisés : on ne les modifie pas, on s'en inspire.
- **Éléments** (`elements/`) : logos, pastilles de logos, bouclier, cartes du monde en points, curseur, plateau d'avatars, marque lumineuse. Dans une composition : `il.exact('pastille-slack', 46)`. **Ne jamais inventer un logo ou redessiner un élément qui existe ici.**
- Les compositions du moteur (`il.pile()`, `il.bouclier()`…) restent pour les contenus à changer (textes, lignes, courbes) ; elles doivent ressembler à leur scène de bibliothèque.

### Ajouter des illustrations à la bibliothèque (depuis la sélection Figwright de Louis)
1. `get_selection` puis `get_design_context` (détail `compact`, profondeur 3) pour trouver **chaque** illustration, y compris celles nichées dans des écrans (« Desktop ») et chaque case d'un bento.
2. `save_screenshots` de chaque illustration en **PNG scale 2** (la vérité) dans `bibliotheque/_brut/png`, et en **SVG** dans `_brut/svg`.
3. `python outils/nettoie_svg.py` sur chaque SVG (répare les ombres de curseur, élargit les zones de filtre), puis `python outils/verifie_export.py png propre verif` : écart ≤ 1,5 % = propre.
4. Au-delà, ouvrir la planche (Figma | SVG | écarts en rouge) et faire le **mixte** :
   - pièce à effets qui casse (marque à halo, rayons masqués) : la masquer dans Figma (`set_visible false`), exporter SVG + PNG de la scène, **la réafficher aussitôt** (`set_visible true`), puis `python outils/mixte.py complet.png sans.png sans.svg sortie.svg` ;
   - textures en mosaïque (hachures noires) : `nettoie_svg.py … --sans-mosaique`, rendre ce SVG, puis `mixte.py` avec ce rendu comme « sans ».
   Le calque reprend le rendu Figma uniquement là où il diffère, et masque le SVG dessous (pas de double couleur).
5. Éléments : même chose nœud par nœud ; si un élément ne passe pas en SVG (halo d'un calque tourné), le garder en PNG scale 3.
6. Inscrire scènes et éléments dans `bibliotheque/range.py`, lancer `python bibliotheque/range.py`, regarder `index.html`.

## Mettre une illustration dans Figma en vrais calques (modifiables)
Louis veut pouvoir retoucher dans Figma : jamais d'image collée, toujours des calques natifs.
1. Page d'une seule scène (`il.page(style, il.scene(...))`, `body{margin:0}`), puis `python outils/vers_figma.py scene.html sortie` → `sortie.svg` (calques nommés, textes éditables, groupes) + `sortie.json` (ombres et polices à reposer).
2. Relire le SVG : renommer les calques clairement (« Feuille », « Bouton copier le lien »…), redessiner en `path` ce que le convertisseur perd (coins pliés via `clip-path`, boutons en deux parties coupés par `overflow:hidden`), supprimer les logos raster.
3. `import_svg` dans le cadre de la planche. Figma **supprime les ombres et les motifs** et remplace les polices :
   - ombres : `batch` de `set_effects` (valeurs du `.json`, via `outils/ops_figma.py`) ; les anneaux `0 0 0 Npx` deviennent `set_strokes` OUTSIDE (le spread ne marche pas sur les vecteurs) ;
   - trame de points : `import_image` d'une tuile 28 px (4×4 points) en `scaleMode: TILE`, puis `reparent_nodes` index 1 et `set_position` 0,0 ;
   - polices : Inter Tight, Switzer et DM Mono ne se chargent pas dans le Figma de Louis → **Inter** (Medium / Semi Bold), interlettrage −3 % sur les textes courants pour garder la largeur ;
   - arcs de progression : jamais `stroke-dasharray` (Figma en fait des pointillés), toujours un `path` d'arc.
4. Logos : **dupliquer les nœuds d'origine du fichier Figma** (`clone_node` + `reparent_nodes` + `set_position`), ne pas les renvoyer en image.
5. Variantes : `clone_node` de la 01, puis petites modifications (masquer la trame, importer des orbites, changer un contour…). `set_position` et `set_visible` hors `batch` si refusés.
6. Toujours `get_screenshot` du résultat et comparer au rendu HTML avant de dire que c'est fini.

## Règle d'or
Ne jamais écrire une illustration « à la main » depuis zéro. On part du moteur :
```python
import sys; sys.path.insert(0, r'C:/Users/louis/.claude/skills/illustration-systeme/moteur')
import illus as il
html = il.page('neutre', il.scene(il.carte_patte(), 569, 597, 'Une carte de messages triés'))
```
`il.page()` produit une page autonome (style + moteur intégrés). Les compositions acceptent leur contenu en paramètres (titres, lignes, points de courbe, personnes, outils, icônes…) : lire la docstring de chaque fonction.

## Où écrire quoi
- **Le travail d'un projet** (page, script `make.py`, style d'une marque cliente, compositions nouvelles) va **dans le dossier du projet**, jamais dans ce skill. Le script importe le moteur avec `sys.path.insert` (voir ci-dessus).
- **Style d'une marque** : copier `styles/neutre.css` dans le projet (ex. `projet/style-marque.css`), changer les valeurs, puis `il.page('projet/style-marque.css', …)` : `page()` accepte un nom de style du skill ou un chemin.
- **Vrai logo** : `il.page(…, logo=('0 0 32 24', '<path … fill="currentColor"/>'))`. Il remplace l'emplacement `#il-marque` partout (marque lumineuse, gravure du bouclier, arc). Sans logo fourni, garder l'emplacement et le signaler.
- **Icônes du secteur** : `il.page(…, symboles='<symbol id="x-cal" viewBox="0 0 16 16">…</symbol>')`, puis `icone='x-cal'` dans `demande()` ou `securite()`, ou `<use href="#x-cal"/>` dans une cellule. Les icônes du moteur (`il-file`, `il-lock`…) sont génériques.
- **Composition nouvelle** : l'écrire comme fonction dans le `make.py` du projet, sur le modèle des fonctions de `illus.py` (mêmes classes, mêmes décors). Si `editeur()` convient sauf le contenu, passer `corps=` (HTML libre) plutôt que tout recopier. Une composition n'entre dans le skill (`illus.py` + `CATALOGUE`) que quand **Louis l'a validée** ; alors la copier, relancer `catalogue/build.py` et noter sa référence.
- **Étiquettes** : DM Mono pour un produit tech. Pour un autre secteur (restaurant, santé, commerce…), mettre `--s-font-label: var(--s-font-text);` dans le style du projet.
- **Placement** : tout est en pixels dans une zone fixe (scène 569×597 ou 569×442, case de section 520×300). Garder une marge de 16 px avec les bords de la carte ; vérifier qu'aucun curseur ou prénom ne cache un texte. Prévoir 2 à 3 rendus.

## Méthode (à suivre dans l'ordre)
1. **Choisir le style** : celui que Louis nomme, sinon `neutre`. Pour une nouvelle marque, copier `styles/neutre.css` et ne changer que les valeurs.
2. **Lire** `oeil/corrections.md` (2 minutes : ce sont les erreurs déjà faites).
3. **Ouvrir le catalogue** (`catalogue/catalogue-<style>.png`) et choisir la composition la plus proche de l'idée. Il y en a 8 : `pile`, `carte_patte`, `bouclier`, `courbe`, `demande`, `editeur`, `arc_outils`, `securite`. Pour une section : `section_grille()` (en-tête + grille 2×2), voir `catalogue/section-exemple-*.png`.
4. **Si une capture est fournie** : en reprendre uniquement la **structure** (disposition, nombre de cases, sujet de chaque illustration). Couleurs, matières et ombres viennent toujours du moteur et du style.
5. **Écrire le vrai contenu**, court. Une seule action visible (bouton sombre ou d'accent + curseur). Un seul accent par scène.
6. **Si rien dans le catalogue ne convient** : écrire une fonction dans le `make.py` du projet (voir « Où écrire quoi ») en réutilisant les briques (`il-frame`/`il-card`, `il-row`, `il-tip`, `il-label`, `il-tray`, `cursor()`, `marque()`, `orbits()`, `fan_wires()`, `drop_wires()`, `inner_filter()`, `smooth()`).
7. **Rendre à 2x** : `python outils/rendu.py page.html rendu.png 1300 <hauteur> 2`, puis **lire l'image**. Hauteur : 1600 pour une section 2×2, sinon hauteur estimée de la page + 200 (le rendu rogne le vide ; si le bas manque, augmenter).
8. **Comparer** avec `python outils/compare.py ref.png rendu.png paire.png` :
   - une **scène** → la référence la plus proche de `oeil/references/` ;
   - une **section refaite d'après une capture** → la capture (pour la structure) ET `catalogue/section-exemple-<style>.png` (pour la matière) ;
   puis repasser la liste de `oeil/corrections.md` point par point (à l'œil : il n'y a pas de contrôle automatique).
9. **Corriger, recommencer** jusqu'à ce que la paire tienne. Seulement ensuite, livrer.

## Retours de Louis sur la façon de travailler
- **07/11/2026** : dans une série d'alternatives, ce sont **les premières (les plus proches des références) qui sont les meilleures**, sauf pour le curseur. Les variantes doivent rester proches de la base : petits changements, pas des directions éloignées.
- **07/11/2026** : on ne fait plus de banques d'éléments isolés (un élément est meilleur ou moins bon selon le contexte). On fait des **illustrations complètes, chacune en 7 variantes** avec de petits changements ; Louis choisit. Avatar et cadran par défaut = alternative 01 du pilote (`banque-pilote`).
- Quand Louis envoie des illustrations de référence : garder leur **structure** (objets, liens, disposition, contenu), refaire tout le rendu dans **sa DA** (le style qu'il nomme ; par défaut `nouveau-style`), traduire les textes en français.

## Méthode VALIDÉE par Louis (08/11/2026) : « beaucoup mieux »
Les cartes 02–04 corrigées directement dans Figma sont la référence de qualité. Pour toute nouvelle illustration, faire d'emblée comme ça :
construire **dans Figma**, en calques natifs, en **clonant ses composants** (pastilles en verre, photos du plateau d'avatars, marque lumineuse, câbles en éventail, connecteur vert, bouclier, curseur Hugo, cadre double) ; liens = connecteur en relief (gris 1 px #CECBCA 80 % + reflet blanc 1,5 px décalé de 1 px) ; cartes en cadre double (contour #D6D0C8 + carte blanche rayon 14, ombre panneau brune 3 couches) ; icônes ≥ 18 px dans des pastilles en verre ; pas de trame, pas de coin plié, pas de traits noirs. Toujours `get_screenshot` à la fin.

## Retours du 07/11/2026 sur les illustrations « notes » (à appliquer partout)
- **Copier la structure, jamais le rendu de la référence.** Ne pas reprendre sa trame de points, ses coins pliés, son fond : on intègre la structure (objets, liens, disposition) dans NOS pièces. La trame de points est interdite comme fond.
- **Liens : jamais de traits noirs.** Utiliser :
  - *câbles fins* : traits 1 px dégradés `#DEDAD3` → transparent, en éventail sous l'objet (`fan_wires`, élément `cables-eventail` de la bibliothèque, réf. 6002:592) ;
  - *connecteur en relief* : deux traits accolés, 1 px `#CECBCA` (80 %) + 1,5 px blanc décalé de 1 px (réf. 6018:157) ;
  - *connexion active* : même connecteur en vert `#26E891` → transparent, avec une lueur verte floue (arcs flous 22–30 px) autour du nœud (réf. 6018:166 / 6018:192, scène `hub-messages`).
- **Icônes trop petites = effet IA.** Icône ≥ 18 px dans un objet, logos dans des **pastilles en verre** (réf. 6018:172 : plaque sable `#EFEBE7` avec ombres intérieures, pastille 32–46 px dégradé `#F6F4F2`→`#FEFEFE`, contour blanc). Pas de petites étoiles dans de petites pastilles colorées.
- **Curseur** : uniquement le curseur validé (`bibliotheque/elements/curseur-hugo.png`, alternative 01 du pilote) : flèche noire à contour blanc + pilule colorée à contour blanc.
- **Personnes** : de vraies photos (élément `plateau-avatars`), pas des initiales dans des ronds.
- **Réutiliser les composants** de la bibliothèque (pastilles verre, marque lumineuse, nuage, plateau, cadre double) au lieu de redessiner.
- Scène validée de référence pour ce type : `bibliotheque/scenes/resume-notes-valide` (carte 1 corrigée par Louis : marque plus grande, câbles fins sous la fenêtre, plus de trame).

## Les 7 règles de qualité
1. Un seul objet net au centre ; le reste recule (pâle, flouté, fondu, fantôme à 80 %).
2. Fond du style (jamais blanc pur) ; blanc pur réservé aux objets.
3. Ombres du moteur uniquement (couches teintées) ; jamais une ombre grise unique.
4. Décor en traits fins qui partent de l'objet ; une seule mécanique par scène.
5. Un seul accent, à un seul endroit ; rouge/vert seulement pour des états. Les couleurs de personnes (curseurs, prénoms) ne sont jamais l'accent.
6. Une seule action visible, curseur sur le coin de l'élément.
7. Vrai contenu court ; le reste en barres grises ; jamais le logo ou le nom d'une référence.

## Quand Louis fait un retour
- Un retour sur la **mécanique** (forme d'ombre, patte, câbles, placement) → corriger `moteur/`, ajouter une ligne dans `oeil/corrections.md`, relancer `catalogue/build.py` et `oeil/build_paires.py`, vérifier que les paires ne se dégradent pas.
- Un retour sur le **style** (couleur, police, teinte) → corriger seulement `styles/<style>.css`.
- Un retour sur une **composition** → corriger sa fonction dans `illus.py` et sa docstring.
- Ne jamais redemander un retour déjà donné : il doit être dans un de ces fichiers.

## Ajouter une référence
1. Lire ses valeurs avec Figwright (`get_design_context` sur le nœud), exporter l'image dans `oeil/references/<noeud>.png`.
2. La reconstruire comme composition, l'inscrire dans `CATALOGUE` avec le nom de la référence.
3. `python oeil/build_paires.py` et comparer jusqu'à ce que la paire tienne. Noter chaque correction dans `oeil/corrections.md`.
