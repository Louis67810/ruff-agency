# Références Figma — comment Louis construit ses illustrations

Source : fichier Figma « ruff agency v2 », Page 1. Sélection lue le 26/10/2026 via Figwright (lecture seule) : `get_selection`, `get_design_context`, `save_screenshots`. Les valeurs ci-dessous viennent des arbres de calques, pas d'une estimation à l'œil.

| Fichier | Nœud | Ce que c'est |
|---|---|---|
| `carte-visiteurs-clients_1340-467.png` | 1340:467 « case 1 » | Carte bento cyan « Transformez vos visiteurs en clients » |
| `carte-objet-selectionne_1330-830.png` | 1330:830 | Carte bleu lavande : maquette sélectionnée + puces |
| `carte-maquette-verticale_1330-801.png` | 1330:801 | Grande carte crème : maquette verticale sélectionnée |
| `carte-photo-enseigne_1330-900.png` | 1330:900 | Carte photo (enseigne RUFF) |
| `carte-photo-ordinateur_1330-899.png` | 1330:899 | Carte photo (personne à l'ordinateur) |
| `section-processus_957-2188.png` | 957:2188 | Section processus (étapes + illustrations) |
| `section-benefices-saas_2422-2049.png` | 2422:2049 | Section bénéfices de la landing SaaS |

## Ce qui ressort : la sobriété (règle R16)

Chaque illustration est construite autour d'**un seul objet central**. Le reste est très limité :
- des **puces accrochées aux bords** de cet objet ;
- des **fantômes** à 48 % d'opacité, coupés par le bord de la carte ;
- un **fondu**.

On n'y voit jamais un nuage d'éléments flottants indépendants.

## Patterns relevés

### F1 — L'objet sélectionné (1330:830)
- **Fond** de carte : `#E0E9FF`. **Rayon** 24, **bordure** `#00000008`.
- **Objet central** : une maquette blanche de 358 × 249, rayon 20,9, bordure `#0000001C`, ombre grise `#6B6B6B` en 5 couches vers le bas.
- **Cadre de sélection** : poignées 14 × 15, blanches, contour `#0147FF` de 2 px ; traits de 1 px.
- **Puces accrochées au cadre** (rayon 12,5 à 13,7, bordure `#0000001C`) :
  - « Aa » (Inter 600 ≈ 30 px) sur le coin haut gauche, à cheval sur le cadre ;
  - palette de 4 pastilles en haut à droite, à l'intérieur ;
  - barre d'alignements à cheval sur le bord gauche, **sans ombre**.
- **Fantômes** : la même maquette à gauche et à droite, à **48 % d'opacité**, coupée par la carte. Ils disent « il y a d'autres pages ».

### F2 — La transformation à travers une ligne (1340:467)
- **Fond** `#DCF6FF`. Une bande en forme de sablier (`#CAEBF6`, bordure `#00000012`) traverse la carte.
- **Ligne verticale** au centre : `#468CA7`, 10 px, bouts ronds. Son **ombre est colorée et part vers la droite** (`#347B93`, 5 couches) : on dirait une lumière.
- **À gauche** : des silhouettes grises `#D8D8D8` dans des cercles blancs (bordure `#00000029`).
- **À droite** : des memojis dans des cercles pastel, anneau blanc de 2 à 3 px.
  - Pastels : `#E0FFC4`, `#FFF1C4`, `#FFC4C4`, `#C4D7FF`, `#C4E6FF`, `#CDC4FF`.
- **Ombre des cercles** : **directionnelle**, vers le bas à droite, 5 couches `#0A0A0A` (alphas 0D / 0A / 08 / 03 / 00). Pour un cercle de 74 px, les décalages vont de (1, 1) à (31, 27) et le flou de 3,6 à 11,2.
- **Fondus** : sur les côtés (dégradés 90° et 270° vers le fond de carte), et en bas (rectangle de 156 px, du transparent au fond).

### F3 — La grande maquette verticale (1330:801)
- **Fond** `#FFEBC1`. Une seule maquette haute, prise dans un cadre de sélection qui descend jusqu'en bas.
- **Barre d'outils unique** : alignements + palette, en bas de la maquette.
- **Bande de fondu** crème qui commence assez haut : le texte se pose dessus.

### F4 — L'illustration de processus (957:2188)
- L'illustration est posée dans une **carte intérieure** gris très clair, rayon 24, bordure bleutée très légère. Au-dessus : badge d'étape (pastille pastel), titre, texte.
- **Un seul objet**, incliné en perspective : le calendrier, ou la page.
- **Curseur « Vous »** : flèche bleue `#0147FF` + étiquette pilule bleue « Vous » (texte blanc), façon curseur multijoueur Figma.
- Petite pilule d'action : coche dans un rond bleu + bouton « refaire » gris.

### F5 — Les cartes blanches sur fond bleu (2422:2049)
- Section bleue, cartes blanches de rayon 32 : illustration en haut, titre, filet, texte.
- Ces illustrations reprennent F1, F2 et F3 en miniature, plus une carte de marque inclinée avec le curseur noir.

## Texte des cartes (Figma)
- **Titre** : Inter Semi Bold 24, interligne 146 %, approche -3 %, `#000000`.
- **Corps** : Inter Medium 18, interligne 146 %, approche -3 %, `#00000099`.
