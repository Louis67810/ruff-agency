# Le style des rendus

Ce document décrit ce qui fait qu'un rendu ressemble à la maison solaire de référence, en version claire et bleue. Lis-le avant de dessiner une nouvelle scène.

## 1. Palette

Toutes les couleurs sont des variables CSS posées sur `.rendu` (voir `RENDU_CSS` dans `kit/rendu.mjs`). Ne mets jamais de couleur en dur dans une scène : utilise une variable ou une classe.

| Rôle | Variable | Valeur |
|---|---|---|
| Fond de carte | `--r-bg-0` → `--r-bg-1` | #ffffff → #eef1f6, dégradé radial centré sur la scène |
| Remplissage des solides | `--anatomy-paper`, `--anatomy-top` | blanc |
| Faces ombrées (4 tons par orientation) | `--anatomy-shade-0..3` | #d3d9e3, #e0e5ec, #eaedf2, #f3f5f8 (gris froids, légèrement bleutés) |
| Traits | `--anatomy-hi / mid / lo / faint` | #283040, #7e8899, #adb5c2, #d2d8e0 |
| Ombres portées | `--anatomy-halo` | #4a5a78 à 24 % |
| Accent (bleu) | `--r-a900 … --r-a50` | #0a2f8f, #1546d6, **#2f6bff**, #5a8cff, #a9c4ff, #d7e4ff, #eef4ff |
| Vitrage | `--r-glass-0/1` | #f4f8ff → #dfe8f6 |
| Intérieur d'une pièce | `--r-room` | #eef1f6 |

Choix des tons de trait :
- les volumes d'architecture (murs, toit, socle) sont en `mid`, pour que la maison reste douce ;
- les équipements (boîtiers, borne, voiture, appareillage) sont en `hi` avec arête `lo` : ce sont eux qu'on regarde ;
- joints, bandeaux, carrelage, lames : `faint` ;
- les lignes qui figurent du texte imprimé (étiquettes, schéma) sont `lo` et marquées `free: true`.

Changer de couleur de marque : `renderHtml({ palette: "vert" })` ou un objet `{ a900, a700, a500, a400, a200, a100, a50 }` (du plus foncé au plus clair, `a500` est la couleur principale). Garde la luminosité de `a500` proche de #2f6bff pour que le néon reste lisible sur blanc.

## 2. Le néon (câbles sous tension)

Une ligne d'énergie est faite de six couches, du fond vers l'avant :

1. `nrg-bed-o` : bord du fourreau, gris #c3ccd9, 2,5 × la largeur ;
2. `nrg-bed-i` : intérieur du fourreau, blanc, 1,5 × ;
3. `nrg-aura` : halo large et très flou (`-soft`), accent clair à 20 %, 12 × ;
4. `nrg-halo` : halo serré (`-glow`), accent à 70 %, 5,5 × ;
5. `nrg-body` : le trait bleu, 1,9 × ;
6. `nrg-core` : le cœur pâle (#d7e4ff), 0,7 ×.

Puis `nrg-pulse` : des tirets blancs qui avancent dans le sens du courant, et les pastilles d'extrémité qui passent au bleu à l'arrivée du front.

Règles :
- **Le sens compte.** Le premier point est la source, le dernier l'usage. Le front de lumière part de la source.
- **Un câble longe toujours quelque chose** : mur, sol, toit, acrotère, plinthe. Décolle-le de 1 à 1,5 unité de la surface pour qu'il ne disparaisse pas dedans (`[MX + 1.4, y, z]` sur une face x). Les coudes ont un rayon (`radius: 3` à `5`).
- **Plusieurs circuits côte à côte** : écartés de 3 à 3,5 unités (des « couloirs »), qui tournent ensemble aux angles. C'est ce qui fait la nappe de câbles au-dessus du tableau.
- **Pas plus de 3 largeurs** dans une scène : alimentation (1,5 à 1,8), circuit (1,1 à 1,2), flux d'air ou signal (0,6, `bed: false`).
- **Enchaîner** : la ligne suivante démarre quand la précédente arrive (`delay` = `delay + dur` de la précédente, à 0,1 s près). Un appareil s'allume 0,1 à 0,3 s après l'arrivée de son câble.

## 3. Les lumières

- **LED** (`ledSvg`) : point gris qui passe au bleu, avec un petit halo radial. Taille 0,35 à 0,9 unité. Une par appareil actif, pas plus.
- **Écran** (`wallBox` avec `screen`) : fond `--r-a100` qui apparaît, plus une courbe ou des chiffres en `tone: "blue"`.
- **Flaque de lumière au sol** (`poolSvg`) : ellipse à dégradé radial accent. Sous une suspension, devant une applique, sous une borne.
- **Lueur sur un mur** (`wallGlowSvg`) : cercle déformé dans le plan du mur. Applique, éclairage extérieur.
- **Abat-jour allumé** : `litSvg` avec le dégradé `-warm` (blanc au centre, bleu très pâle au bord) sur la forme de l'abat-jour.
- **Panneaux solaires** : le remplissage passe de #d5e0f2 à #b8cdf6, les cellules deviennent bleues, et un reflet blanc balaie chaque panneau en boucle (`r-sweep`), décalé panneau par panneau.
- **Barres de charge** (`r-bar`) : se remplissent une par une avec `--r-delay` croissant.

Jamais de lumière « plein écran », jamais de glow sur un objet qui n'est pas actif.

## 4. Architecture

- **Murs** : un seul `slabOf` par volume, `tone: "mid"`, biseau 0,5. Les fenêtres sont dessinées *sur* les faces (`windowSvg`), pas découpées.
- **`windowSvg(face, at, a0, a1, z0, z1, P, opts)`** dessine : le fond de pièce, l'intérieur (`inside`, découpé par l'ouverture), le vitrage translucide et son reflet, le tableau (embrasure) de côté et de tête, les montants (`mullions`) et traverses, le cadre, l'appui. Profondeur d'embrasure 3 à 4.
- **Toit plat** : dalle au niveau du toit, puis quatre acrotères (4 d'épaisseur, 6 de haut) dessinés en deux temps (fond avant le contenu du toit, devant après). Ligne de couvertine en `mid`.
- **Détails qui font « vrai »** : bandeau d'étage (deux lignes `faint`), descente d'eau avec colliers, appuis de fenêtre, auvent au-dessus d'une baie, poteau fin, lames de terrasse, joints d'allée, arbustes (`sphereOf`), trappe et ventilations en toiture.
- **Coupe (local technique)** : sol + deux murs du fond seulement, dessus des murs coupés à plat avec hachures `faint`, plinthes. Les objets sont sur les faces x = min et y = min qui regardent vers le spectateur.

## 5. Intérieurs vus à travers une baie

Ils donnent la vie à la scène et c'est là que se voient les lumières de l'étape « Utiliser ».
- Un point (x, y) vu à travers une face y = Y apparaît au droit de x0 = x − y + Y : décale le mobilier vers la gauche de la profondeur.
- Pièce peu profonde (30 à 45 unités), mur de fond `--anatomy-face`, mur latéral `shade-2`, sol `shade-3` avec lames `faint`.
- Mobilier simple en `mid` : table, chaises, buffet, cadre au mur, lampadaire (`floorLamp`), suspension. Garde le haut de l'ouverture dégagé si un auvent la recouvre.
- Le vitrage est translucide (38 %) : on voit l'intérieur, on sent le verre.

## 6. Véhicules et objets courants

- **Voiture** (`car`) : prismes convexes le long de x (caisse, habitacle), vitrages, lignes de portes, passages de roues, roues avec jantes et moyeu, rétroviseur, trappe de recharge avec LED, bandeau de phare qui s'allume. Longueur 98, largeur 36.
- **Borne** (`evCharger`) : socle vissé, fût, tête vitrée avec 4 barres de charge, LED, support de pistolet.
- **Onduleur / compteur / coffret** (`wallBox`) : boîtier biseauté, vis aux coins, couvercle, écran, LED, ouïes.
- **Tableau** (`breakerRow` dans une coque) : rail DIN, modules de 3,6 avec manette qui bascule (`moveSvg`), voyant d'état bleu, interrupteur différentiel de 2 modules avec bouton test, peigne, plastron entre les rangées avec étiquettes.
- **PAC intérieure** (`splitUnit`), **ballon** (`waterHeater`, profil lisse avec dôme), **applique** (`wallLamp`), **prise** (`socket`), **interrupteur** (`lightSwitch`).
- **Au sol, pour habiter une coupe** : touret de câble, caisse à outils, escabeau, bobines.

Une pièce qui n'existe pas encore : construis-la dans `kit/elec.mjs` avec la même signature (`(…position, P, { step, delay })` → markup ou `{ svg, ports }`) pour qu'elle serve aux prochains rendus.

## 7. Rythme

| Moment | Durée |
|---|---|
| Tracé d'une alimentation principale | 1,4 à 2 s |
| Tracé d'un circuit court | 0,4 à 0,8 s |
| Fondu d'une lumière | 0,9 à 1,2 s |
| Décalage entre éléments d'une même famille (panneaux, disjoncteurs) | 0,05 à 0,15 s |
| Tenue d'une étape | 3 à 3,8 s, la dernière 4,5 à 5,5 s |
| Repos (tout éteint) avant la reprise | 1,3 s |

L'étape finale doit être la plus riche : c'est l'image que retient le visiteur.

## 8. Défauts déjà rencontrés

- **Intérieur invisible** : mobilier placé au droit de la baie au lieu d'être décalé de la profondeur (voir section 5). Il sortait du cadre de l'ouverture.
- **Câble de toit par-dessus les panneaux** : le câble posé sur la dalle était dessiné après tous les panneaux. Il faut le dessiner entre la rangée du fond et celle de devant, et couper la partie qui franchit l'acrotère de devant.
- **Lampes cachées par l'auvent** : lampadaire et suspension trop hauts derrière une baie couverte. Garde-les dans les deux tiers bas de l'ouverture.
- **Porte de tableau qui masque la scène** : une porte ouverte vers le spectateur cache ce qui est derrière. Ne la dessine que si rien d'important n'est derrière, sinon laisse le tableau ouvert sans porte.
- **Sol vide dans une coupe** : réduis la profondeur de la pièce et pose un ou deux objets du métier au sol (touret, caisse à outils).
- **Câble qui sort de l'intérieur d'une coque** : fais partir le câble du côté ou du dessus du boîtier, jamais de l'intérieur visible.
- **Glow trop lourd** : sur une scène très câblée, baisse `nrg-aura` plutôt que d'épaissir les traits.
