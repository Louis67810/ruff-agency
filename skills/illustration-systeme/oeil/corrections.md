# L'œil : ce qu'on a dû corriger, et comment le voir

Chaque ligne est une erreur réellement commise en reconstruisant les références, repérée en comparant côte à côte. Avant de livrer, relire cette liste et vérifier chaque point sur sa propre paire (`outils/compare.py`).

Les paires à jour sont dans `paires/` (référence à gauche, rendu du moteur à droite). Les références d'origine sont dans `references/`.

## Matière et ombres
| Erreur | Ce qu'on voit | Correction |
|---|---|---|
| Une seule ombre grise | L'objet a l'air collé, « plat » | Toujours les ombres du moteur : 4–5 couches de la même teinte, opacité qui baisse, flou qui monte |
| Ombre de la même couleur que l'objet | Effet « bouton IA » | Teinte d'ombre = teinte du fond assombrie (`--s-tint-*`), jamais la couleur de l'objet |
| Bouclier plat | Pas de métal | Les 5 couches : rebord en dégradés radiaux, filet sombre 10 %, filet blanc 20 %, plaque claire, face avec ombres intérieures |
| Marque posée sur le métal | Autocollant | La graver : remplissage noir 8 % + ombre intérieure + reflet blanc dessous |

## Formes
| Erreur | Ce qu'on voit | Correction |
|---|---|---|
| Patte rectangulaire sous la carte | Une boîte sous une boîte | Trapèze aux épaules arrondies (`#il-plinth`), plus étroit que la carte |
| Patte cachée sous la carte quand le texte passe sur 2 lignes | La carte flotte | La patte est attachée à la carte (même conteneur), jamais à une position fixe |
| Haut du bouclier plat, coins carrés | Écusson générique | Coins pointus un peu plus bas que la pointe, avec un creux entre les deux |
| Cadres fantômes empilés au-dessus d'une carte | Boîtes vides bizarres | Pas de pile de cadres : la profondeur vient des ombres et du décor |

## Décor
| Erreur | Ce qu'on voit | Correction |
|---|---|---|
| Câbles qui s'effacent avant de tourner | Des traits droits sous l'objet | Le dégradé reste visible jusqu'à ~75 % de la hauteur, puis descend à 10 % |
| Dégradé des câbles défini mais pas ajouté aux `defs` | Plus de câbles du tout | Regarder la paire : un décor absent se voit tout de suite |
| Arrière-plan flouté trop pâle (opacité .55) | On ne comprend pas que la carte sort d'une app | Opacité .7–.8, flou 5 px, des formes reconnaissables (titre, chiffres, barre latérale) |
| Plus d'une mécanique de décor | Scène chargée | Une seule : orbites OU câbles OU contours OU fantômes OU flou |

## Placement
| Erreur | Ce qu'on voit | Correction |
|---|---|---|
| Marque collée à la première ligne | Tout est tassé | ~45 px entre la marque et l'objet dessous |
| Pointe du curseur au milieu du bouton | Le geste n'est pas lisible | Pointe sur le coin bas droit de l'élément cliqué |
| Info-bulle posée sur la courbe | Elle cache la donnée | Au-dessus du point épinglé, en débordant de la carte |
| Lignes de grille à 50 % décalées des bordures | Doubles traits | Rangées de même hauteur (`grid-auto-rows: 1fr`) |

## Contenu
| Erreur | Ce qu'on voit | Correction |
|---|---|---|
| Titres longs qui passent sur 2 lignes dans un autre style | La composition se décale | Contenu court (≤ 24 caractères pour un titre de ligne) ; tester dans les deux styles |
| Faux texte (lorem) | Maquette pas finie | Vrai contenu court, le reste en barres grises |
| Logo ou nom d'une référence | Copie | Emplacement `#il-marque` tant que le client n'a pas donné son logo |

## Technique
| Erreur | Ce qu'on voit | Correction |
|---|---|---|
| `fill`/`stroke` mis sur `path` pour un `<use>` | Curseur noir sans contour, patte noire | Les mettre sur le `<svg>` (hérités), ou dans le symbole |
| Mesurer sur une capture | Valeurs approximatives | Lire les valeurs avec Figwright (`get_design_context`) ; la capture sert à vérifier |
| Trait pointillé central à 50 % décalé de la bordure entre colonnes (cellules plus larges que la moitié) | Double trait vertical | Colonnes `minmax(0, 1fr)` et marge de cellule 20 px : l'illustration (520) tient dans la moitié |
| Couleur d'accent donnée à une personne (curseur, prénom) | Deux accents dès qu'un élément est actif | Couleurs de personnes : orange, vert, rose ; jamais l'accent |
| Icône de fichier sur une date ou un nombre de couverts | Sens absurde hors produit tech | Icônes du secteur via `symboles=` et `icone=` |

## Exports Figma (bibliothèque)
| Erreur | Ce qu'on voit | Correction |
|---|---|---|
| Ombre de curseur exportée telle quelle | Grosse tache noire sous le curseur | `nettoie_svg.py` remplace le filtre par l'ombre réelle du curseur |
| Halo d'un calque tourné (marque) | Colonne violette trop grande, ou halo coupé en rectangle | Mixte : calque Figma pour cette pièce, ou PNG 3x pour l'élément seul |
| Textures en mosaïque (images TILE) | Hachures noires épaisses | `--sans-mosaique` puis mixte |
| Calque d'effets posé PAR-DESSUS le SVG | Couleurs doublées dans les zones semi-transparentes | Le mixte masque le SVG sous le calque |
| Comparer un PNG transparent sans fond | Faux écarts énormes (transparent lu comme noir) | Poser les deux sur le même fond avant de comparer |
| Exporter seulement la section entière | Illustrations des écrans et du bento oubliées | Descendre dans chaque Desktop et chaque case de bento |
| Trait SVG sans fill="none" importé dans Figma | Remplissage noir caché, ou grandes diagonales | Toujours fill="none" sur les traits ; ne pas mélanger « m » relatif puis « M x y a b » (les paires suivantes deviennent des lignes absolues) |
