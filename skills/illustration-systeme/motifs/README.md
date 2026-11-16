# Motifs : lumières, ombres, formes pixel, formulaires, FAQ

Relevés le 11/11/2026 sur les pages **hors accueil** du Figma de Louis (contact, tarifs, liste d'attente, à propos, blog) + FAQ, appel final et pied de page. Valeurs lues avec Figwright.
Ce sont des **outils, pas des gabarits** : chaque fonction prend couleur, taille, densité, direction, graine. On s'en sert pour garder la cohérence, puis on compose librement. Rien n'oblige à tout utiliser ; rien n'interdit d'inventer une variante (nouveau motif pixel, autre angle de store, halo d'une autre couleur).

## Fichiers
- `effets.json` : préréglages d'effets Figma exacts (ombres en couches, chute sombre, reflets, flous). Utilisables seuls sur n'importe quel calque : `python motifs.py effets ombre-flottante` -> tableau pour `set_effects`.
- `motifs.py` : générateurs -> SVG à calques nommés + JSON de ce que l'import perd. Voir l'en-tête du fichier.
- `planche.py` : démonstration de tous les motifs (`planche/planche.png`, `planche/faq.png`).
- `images/` : images d'origine (ombre de store, bruit, grain) pour référence.

## Méthode Figma (natif, éditable)
1. Composer une `Scene(largeur, hauteur)` avec les motifs, `scene.ecrire('…/nom')`.
2. `import_svg` du `nom.svg` dans le cadre de la section ; sortir les groupes du cadre d'import si des ombres doivent déborder (`reparent_nodes`), supprimer le cadre d'import.
3. `get_design_context` (detail minimal) du résultat, sauvé dans un fichier -> `python motifs.py carte fichier.json > carte.json`.
4. `python motifs.py ops nom.json carte.json` -> ops `set_effects`, `set_blend_mode`, `set_opacity`, `set_text_properties` à passer à `batch` (si `set_blend_mode` est refusé dans batch, l'appeler seul).
5. Pour une lueur ou une ombre seule, plus simple : `create_ellipse` / `create_rectangle` + `set_fills` + `set_effects` avec un préréglage.
6. Le grain : `grain_png()` fabrique une petite tuile -> `import_image` (base64, `scaleMode: TILE`) sur toute la section, puis `set_blend_mode OVERLAY` et `set_opacity 0.3`.

## Lumières et ombres (ce qui donne la profondeur)
| Motif | Où dans les pages | Recette exacte |
|---|---|---|
| **Halo** (`halo`, `lueur`) | derrière les cartes d'avis des bords, derrière une carte mise en avant | ellipses `#3745F1` pleines 477 × 251 et 326 × 171, flou de calque 200 ; cœur blanc 203 × 251 flou 120. Toujours derrière, à moitié caché. |
| **Ombre de store** (`store`) | hero contact, côtés de sections claires | bandes grises en perspective (4 fines + 1 dalle), dégradé vers transparent, fusion MULTIPLY, flou ~9, tournées ~15°. Lumière de fenêtre qui traverse la section : peut déborder sur plusieurs blocs. |
| **Chute sombre** (`chute_sombre`) | haut du pied de page, toute section sombre | bande 15 px `#1B1B1B` + 4 ombres noires géantes (y 51 → 823, flou 113 → 250). Le haut devient noir, le bas reste `#1A1A1A` : la lumière semble monter du bas. |
| **Reflet haut** (`reflet-haut`) | logotype géant du pied de page, formes pleines sur fond sombre | 2 ombres intérieures blanches (y 6 flou 4, y 3 flou 1). |
| **Grain** (`grain_png`) | bannière indigo, pied de page, hero indigo | tuile de bruit, OVERLAY 30 %. Sur les fonds pleins (indigo, noir), jamais sur le sable. |
| **Ombre flottante** | pastille, photo, puce en l'air | 7 couches noires vers le bas-gauche (lumière en haut à droite), jusqu'à x −77 y 75 flou 65. |
| **Ombre carte d'avis** | carte blanche rayon 20 | 4 couches `#A6A6A6` (y 6 → 98) + 2 couches `#7D7D7D` serrées. |
| **Ombre indigo** | élément accent posé sur sable | 4 couches `#828CF7`. |

## Formes
| Motif | Où | Recette |
|---|---|---|
| **Grille pixel** (`grille_pixel`) | fond de l'appel final, 404 | carrés pleins 28,45 px jointifs, 78 % `#F4F3F0` / 22 % blanc, qui s'effacent (masque en dégradé). Sens au choix. |
| **Formes pixel** (`forme_pixel` + `CROIX`, `MARCHE`, `FLECHE`…) | appel final, hero | union de carrés 28 px, blanc en OVERLAY, parfois floutée 39,7. Dessiner son propre motif texte. |
| **Rubans** (`rubans`) | bannière indigo `#303CE2` (blanc 9 %, 608 × 52), appel final (blanc 20 %, 168 × 31, flous) | barres décalées en escalier. |
| **Barre pixel** (`barre_pixel`) | bord de hero indigo, séparateur | pixels indigo qui se raréfient. |
| **Escalier de tuiles** (`escalier_tuiles`) | côtés du hero contact | tuiles indigo 10 % + contour 20 %, joints `#DAD5CD`, voile sable qui efface le haut. |
| **Épingle** (`epingle`) | photos épinglées (culture), coins de carte | socle dégradé `#EFEFEF`→`#FDFDFD`, ombre noire 50 % floue 32, tête blanche. |

## Interface
- **Formulaire** (`formulaire`, `champ`, `zone_texte`, `bouton`) : libellé Inter 16 Medium `#262626`, 8 px, pilule h48 rayon 100 contour 1 px `#EBE5E0` fond blanc, indication 15 `#707070` ; message rayon 12 h109 ; bouton noir pleine largeur h51. Champs par paires (prénom / nom) puis seuls. Contact : formulaire à gauche (570), preuve à droite (logos, citation). Liste d'attente : un seul champ e-mail + bouton noir dans un cadre de fenêtre de navigateur, preuve « Loved by 20K+ » avec lauriers.
- **FAQ** (`faq`) : colonne 946 centrée (marges 97) entre deux traits verticaux `#D6D0C8` ; trait horizontal pleine largeur en haut et en bas ; question ouverte fond blanc (padding 24, titre 18 Semi Bold, trait interne `#EBE5E0`, réponse 16 `#595959`) ; fermées h75, chevron indigo 1,5 px ; pied de FAQ : pile d'avatars + « Talk to our team » + boutons (cadre 946 × 95, contours sauf bas).
- **Pied de page sombre** : fond `#1A1A1A`, rails et traits `#333333`, colonnes séparées par des pointillés 5/5 `#333333`, logo + accroche `#EBE5E0` 16 + bouton blanc, bas : liens légaux (bande h92, padding 30/60) ; dessous **logotype géant** (Semi Bold 265, rempli à 1 %, contour, `reflet-haut`) coupé en bas + grain OVERLAY 30 % ; `chute_sombre` en haut.

## Rythme clair / sombre (à respecter dans une page)
Les pages hors accueil alternent : sable clair → **un bloc saturé** (bannière indigo à rubans ou carte culture indigo) → sable → appel final sable à grille pixel → **pied de page noir**. Une landing doit avoir **au moins un bloc sombre ou indigo au milieu** (pas seulement le pied de page) et **au moins deux sources de lumière visibles** (halo, store, chute sombre, reflet). La lumière vient d'un côté cohérent sur toute la page (haut droite par défaut : ombres flottantes vers le bas-gauche, store qui descend vers la droite).

## Outils de Louis (13/11/2026)
- `outils-louis/shadow-overlay.html` : ombre de store calibrée sur son Figma. **À utiliser à la place de `store()`** (qui reste un générateur libre pour inventer d'autres ombres, mais n'est pas fidèle). Pont Python : `outils_louis.ombre_png / ombre_svg`. Calque déjà prêt à importer : `images/ombre-store-figma-p.png` (palette, 228 × 169, à étirer à la taille voulue ; MULTIPLY, opacité 0,3). Testé dans Figma (page « Motifs · outils de Louis », 6057:5).
- **Motif de tuiles = MÉTHODE EXACTE (13/11, remplace `tuiles_repetables`, qui ne ressemblait pas à l'original)** : cloner les vrais vecteurs de la sélection Figma de Louis (cadre `6053:404` : bande haute `6053:405` = gris `406` + halo `407` + remplissage `408` ; bande basse `6053:409` = `410` + `411` + `412` ; fondus `413`-`415`) et les répéter par décalage horizontal. Périodes mesurées dans les tracés : gris haut 4 × 205,364 = 821,456 ; indigo (halo et remplissage, haut et bas) 4 × 219,43 = 877,708 ; gris bas 4 × 211,68 = 846,72. Procédure : créer un cadre, y reparenter des clones des deux cadres de bande, mettre leurs enfants en contraintes MIN/MIN (`set_constraints`), redimensionner les cadres à la largeur voulue (haut : x = largeur, y = 179, rotation 180 conservée ; bas : x = −72,24, y = 222), cloner chaque vecteur et le décaler de sa période. Résultat de référence : page « Motifs · outils de Louis », cadre `6066:15` (1140 × 402). Ne pas redimensionner en hauteur après coup (contraintes SCALE des cadres de bande).
- `outils-louis/motif-figma.html` : motif de tuiles indigo. Son mode « répéter » a des rangées de périodes différentes (205, 211, 219 px) : raccords imparfaits. `motifs.tuiles_repetables(` (APPROXIMATION, ne pas l'utiliser pour reproduire le motif de Louis : voir la méthode exacte ci-dessus) ; `(nom, x, y, largeur, hauteur, pas=110, h=42, periode=6, fondu='droite')` le refait sur UNE grille (période 220 × 6 rangées) : on peut juxtaposer des blocs ou agrandir sans raccord. Vérifié au rendu Chrome ; pas encore importé dans Figma.

## Interdits (retour du 14/11)
- `epingle()` : NE PAS UTILISER (épingles, punaises, puces refusées dans cette DA).
- `lueur()` / `halo()` au milieu d'une section ou derrière une carte blanche : interdit. Lumière juste sous l'élément, discrète (voir pages/grille.md §5).
- `store()` : remplacé par l'image de l'outil de Louis.
- `grille_pixel` / `forme_pixel` / `barre_pixel` pour le pied de page : interdit (« ce truc de pixel n'existe pas ») ; utiliser textures + lumières.
