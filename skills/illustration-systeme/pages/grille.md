# Système de grille, couleurs, typo et ressources (relevé sur les corrections de Louis, 14/11/2026)

Source : page Figma « Test · landing vierge (11/11) », cadre corrigé par Louis **6058:801** (à comparer avec ma version fautive 6038:5), palette **6083:5**.

## 1. Grille (à respecter partout)
- Page 1440. **12 colonnes**, marge gauche 150, gouttière 20, largeur de contenu 1140 (150 → 1290). Colonne = 76,67 px. C'est la `layoutGrid` du hero de Louis (COLUMNS 12, gutter 20, offset 150) : **mettre cette grille sur chaque cadre de section** pour aligner.
- Rails verticaux 1 px `#D6D0C8` à x 150 et x 1290 sur toute la page.
- Chaque section est fermée par un **trait horizontal pleine largeur** (0 → 1440) ; dans le hero : trait à y 713, `#000` 10 %.
- **Structures autorisées** : pleine largeur centrée (hero, en-têtes, FAQ) et **grilles de cases** à 2 colonnes (570 + 570) — c'est le cas par défaut des sections à contenu (« row sections », blog, avantages) — ou 4 colonnes de 285 (étapes). Les cases sont dessinées par des traits fins `#D6D0C8` aux limites des colonnes.
- **Jointures = ronds**, jamais des carrés : rond blanc 8 × 8 (rayon 100) centré sur chaque croisement de traits, avec l'ombre « jointure » (5 couches `#8F8F8F` : 10 % 0/0 r1 ; 9 % 0/1 r1 ; 5 % 0/3 r2 ; 1 % 0/5 r2 ; 0 % 0/7 r2). Nœud à cloner : **6077:11**.
- **Interdit** : mise en page « texte à gauche / illustration à droite » (hero ou section). Le hero est **centré** : badge, titre, texte, paire de boutons, puis l'illustration **en dessous**, qui passe par-dessus le trait de fin de hero.
- Outil : `pages/grille.py` donne les x des colonnes, des cases et des jointures.

## 2. Couleurs de la marque (palette 6083:5, n'utiliser que celles-ci)
- Absolu : `#FFFFFF`, `#000000`.
- Bleu : 48 `#1021E4`, 54 `#2434EF`, 58 `#3745F1` (accent principal), 63 `#4F5CF2` (motif de tuiles).
- Clair : 81 `#D6D0C8` (traits, rails), 83 `#DAD5CD`, 85 `#DEDAD3` (fils), 88 `#E5E1DC`, 90 `#EBE5E0` (contours de champs), 92 `#EFEBE7` (bouton secondaire), 94 `#F3F0ED`, 96 `#F7F5F3` (fond de page), 98 `#FBFAF9`.
- Sombre : 10 `#1A1A1A` (encre, bouton noir, fond du pied de page), 15 `#262626`, 20 `#333333` (traits sur sombre), 25 `#404040`, 28 `#474747`, 35 `#595959` (texte courant), 40 `#666666`, 44 `#707070` (texte secondaire).
- Hors palette tolérés seulement s'ils sont dans le site d'origine (vert de connexion `#27E891`/`#6FFABB`, couleurs des pilules de curseur).

## 3. Typographie (Inter dans le Figma de Louis ; DM Mono pour les sur-titres)
| Rôle | Style |
|---|---|
| Titre de hero | Inter Semi Bold 48 / 110 % / **−4 %**, `#1A1A1A`, centré |
| Titre de section | Inter Semi Bold 48 / 110 % / −2 % à −3 % |
| Titre de carte / formulaire | Inter Semi Bold 28 / 120 % / −3 % |
| Chiffre | Inter Semi Bold 34 / 110 % / −3 % |
| Sur-titre | DM Mono Medium 14 / 150 % / +1 %, MAJUSCULES, `#3745F1` (gris `#767676` en preuve) |
| Texte d'intro | Inter Medium 17 / 150 % / −2 %, `#595959` |
| Texte, libellé | Inter Medium 16 / 150 % / −2 %, `#262626` (libellés) ou `#595959` |
| Petit texte, bouton | Inter Medium 15 / 150 % / −2 %, `#707070` (secondaire) |
| Badge | Inter Regular 16, `#707070`, pilule blanche h40, padding 8/18, ombre 2 couches noires 15 % (0/1 r1) et 5 % (0/3 r3) |
Ne jamais inventer une taille : prendre celle du rôle. Les tailles du site d'origine (Switzer 48/54) se traduisent ainsi en Inter.

## 4. Ressources à réutiliser (cloner, ne jamais refaire)
| Ressource | Nœud | Règle |
|---|---|---|
| Motif de tuiles (hero, sections à contenu) | 6053:404 ; montage hero de Louis : groupes 6073:253 (droite) et 6073:254 (gauche, tourné 180°) | dans les colonnes extérieures du hero, avec fondus vers le centre ; version répétée : 6066:15 |
| Lumière (ombre de store) | image `shadow-overlay` 6073:185 (hero, opacité 66 %, normal) et 6052:2 (démo) | **toujours l'image de l'outil**, deux fois en miroir dans le hero ; jamais redessinée |
| Halo indigo | 6058:1691 / 6058:1692 (opacité 39 %, flou 200) | **sous** un bloc, débordant par le bas (effet de relief), jamais derrière un élément blanc ni au milieu |
| Grain | rectangle image TILE, OVERLAY 30 % (6072:147) | sur bandes et fonds pleins |
| Guillemets officiels | **6070:7** (deux virgules indigo `#3745F1`, 18 × 13) | pour toute citation |
| Fenêtre de site (onglet ouvert) | 6075:389 | cadre de démonstration du hero : y mettre une **illustration de démo** (le produit qui travaille seul) |
| Curseurs | 6075:415 (vert `#2BB673`), 6075:414 (orange `#F08A3C`) | deux curseurs = deux agents/personnes différents qui agissent dans la démo ; noms différents |
| Jointure ronde | 6077:11 | à chaque croisement de traits |
| Bouton noir / secondaire | 6072:24 / 6072:22 | h47, rayon 100 |

## 5. Lumière : règles
1. Discrète. Jamais un halo au centre de l'écran ni derrière une carte blanche.
2. Placement : juste **sous** l'élément (bas de carte, bas de section) pour donner du relief.
3. Toujours via les systèmes (image d'ombre de l'outil, halos clonés, grain) — jamais d'ombres recréées à la main.
4. Les sections à contenu ont toujours : grille 2 colonnes + motif + lumière.
