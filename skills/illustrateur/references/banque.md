# Banque de composants · DA du site de base

Figma : page **« Banque · composants (15/11) »** (6110:17). Images de la page : `references/banque/*.jpg` (6110-834 = mode d'emploi, 6110-18 à 6110-22 = les 5 sections).
Toutes les pièces viennent des vraies illustrations de la Section 1 (page Design, 6002:4), détachées une par une. Ce sont des **matériaux**, pas des illustrations.

## Règle d'usage
- On compose une illustration **nouvelle** avec ces pièces, d'après un brief (`brief-illustration`). Jamais une pièce seule, jamais une illustration de la Section 1 reconstruite.
- Poser une pièce = `create_instance` du composant (id ci-dessous), puis la placer, la redimensionner et réécrire ses textes.
- Ce qui n'est pas dans la banque se fabrique avec les **styles DA/…** (ci-dessous), jamais avec des valeurs inventées.

## Composants (33)
| Id | Composant | Taille | Vient de | Usage |
|---|---|---|---|---|
| 6110:754 | DA / Contenant / Cadre double | 307 × 356 | 6002:360 | Fenêtre d'interface posée dans un cadre beige. Contenu à poser dans « Intérieur blanc » (remplit le cadre quand on l'agrandit). |
| 6110:755 | DA / Contenant / Socle (patte) | 238 × 51 | 6002:360 | Sous un cadre double ou un objet, centré, chevauche le bas de 10 à 20 px. |
| 6110:756 | DA / Contenant / Fond d'appli flouté | 569 × 597 | 6002:360 | Contexte estompé : vraie appli floutée + fondu vers le sable. Mettre tout au fond. |
| 6110:757 | DA / Contenant / Rangée carte blanche | 258 × 58 | 6002:4968 | Rangée de liste en relief (logo + 2 lignes squelette + bouton). La rangée mise en avant : plus grande, décalée ; les autres à 60–80 % d'opacité. |
| 6110:758 | DA / Contenant / Rangée active (creux sable) | 219 × 46 | 6018:98 | Rangée sélectionnée, en creux sable. |
| 6110:759 | DA / Contenant / Rangée bordée | 177 × 32 | 6018:98 | Petite rangée secondaire autour d'une rangée active. |
| 6110:760 | DA / Lien / Lignes fines en éventail | 803 × 122 | 6002:360 | 8 lignes pâles qui partent sous un socle ou un objet. Décor d'ancrage, pas un lien (R23 : pas à chaque fois). |
| 6110:761 | DA / Lien / Jointure | 8 × 8 | 6002:4539 | Rond blanc au bout d'un lien. Jamais de pointe de flèche (R15). |
| 6110:762 | DA / Lien / Contour en écho | 129 × 271 | 6002:669 | 2–3 contours pâles autour d'un objet symbolique (R23). |
| 6110:763 | DA / Lien / Orbites | 428 × 206 | 6002:4968 | Deux ellipses fines autour d'une pastille / d'un objet central. |
| 6110:764 | DA / Lien / Câble droit | 220 × 60 | nouveau, d'après 6002:360 | Trait #CECBCA 1 px + reflet blanc 1 px dessous, jointure à chaque bout. Étirer l'instance : le trait suit, les jointures restent aux bouts. |
| 6110:765 | DA / Lien / Câble coudé | 220 × 180 | idem | Câble à deux coudes arrondis (rayon 20). Retourner (flip) si besoin. |
| 6110:766 | DA / Lien / Câble courbe | 220 × 180 | idem | Câble en S. |
| 6110:767 | DA / Objet / Pastille de marque | 64 × 86 | 6002:4968 | Le produit. Seul objet qui peut garder le très léger halo bleu dessous. |
| 6110:768 | DA / Objet / Bouclier en relief | 254 × 271 | 6002:669 | Sécurité. À intégrer dans un mécanisme, pas seul tel quel. |
| 6110:769 | DA / Objet / Nuage en relief | 449 × 351 | 6018:354 | Objet contenant (tuiles de logos dans sa cuvette). |
| 6110:770 | DA / Objet / Plateau d'avatars | 208 × 58 | 6002:669 | Ancre en bas : des humains concernés (R23). |
| 6110:771 | DA / Objet / Tuile de logo | 65 × 65 | 6018:98 | Logo d'outil dans une tuile bombée ; secondaires à 30 %. |
| 6110:778 | DA / Objet / Tuile d'icône | 45 × 45 | 6019:186 | Toute icône dans une tuile blanche, jamais nue (R21). |
| 6110:772 | DA / Objet / Avatar d'agent | 56 × 56 | conventions da.md | Un agent = pastille ronde pastel + marque bleue. Fond : DA/Pastel · … |
| 6110:773 | DA / Interface / Pilule de statut IA | 286 × 42 | 6018:264 | « L'agent prépare… » : marque + texte + chargement. |
| 6110:774 | DA / Interface / Étiquette d'état | 114 × 29 | 6002:4539 | Petite étiquette avec icône (« Problème »). Pas de majuscules par réflexe. |
| 6110:775 | DA / Interface / Infobulle sombre | 144 × 231 | 6002:4539 | Pilule sombre à 2 zones + tige + point. Toujours accrochée à un point (R16). Textes d'exemple en anglais : à réécrire. |
| 6110:776 | DA / Interface / Poignées de sélection | 274 × 42 | 6019:186 | Cadre fin à 4 poignées : « cet élément est choisi ». |
| 6110:777 | DA / Interface / Bouton bleu à menu | 220 × 38 | 6019:186 | Action principale ; le curseur se pose sur son coin bas-droit (R17). |
| 6110:779 | DA / Interface / Anneau de pourcentage | 28 × 28 | 6019:6 | Anneau fin + chiffre précis à côté. |
| 6110:780 | DA / Interface / Courbe et zone | 570 × 200 | 6002:4539 | Courbe fine + aplat dégradé + infobulle sur un point. Couleur de la courbe à adapter. |
| 6110:781 | DA / Interface / Rangée squelette | 240 × 32 | nouveau | Rond + ligne forte + ligne grise. |
| 6110:782 | DA / Interface / Ligne forte | 120 × 8 | nouveau | Remplace un titre secondaire. |
| 6110:783 | DA / Interface / Ligne grise | 176 × 6 | nouveau | Remplace un texte secondaire. |
| 6110:784 | DA / Appareil / Téléphone | 569 × 442 | 4001:52083 | Téléphone vide (barre d'état, encoche, écran blanc). Contenu idéalisé dedans. |
| 6110:785 | DA / Appareil / Fenêtre de navigateur | 520 × 360 | nouveau | 3 points + 1 onglet ; contenu dans « Contenu ». |
| 6110:786 | DA / Curseur / Curseur nommé | 81 × 46 | 6019:186, corrigé | Flèche + étiquette **rectangle à coins arrondis (rayon 8)**, pas une pilule. Couleur : DA/Vert curseur, un pastel, DA/Bleu. |

## Styles (panneau de droite de Figma)
- **Ombres** : DA/Ombre · carte flottante, · rangée, · pilule, · pastille de marque, · jointure, · curseur, · étiquette ; DA/Relief · socle, · creux.
- **Couleurs** : DA/Sable · fond (#F7F5F3), · creux (#F3F0ED), · foncé (#EFEBE7) ; DA/Trait (#D6D0C8) ; DA/Câble (#CECBCA) ; DA/Squelette (#ECE7E1) ; DA/Encre (#1A1A1A) ; DA/Texte (#595959) ; DA/Texte secondaire (#707070) ; DA/Bleu (#3745F1) ; DA/Vert curseur (#22B45E) ; DA/Pastel · orange, bleu, violet, rose ; DA/Rouge pâle.
- **Textes** : DA/Texte · titre de ligne (Inter Semi Bold 14), · secondaire (Inter Medium 11), · micro (9,5), · chiffre clé (Inter Semi Bold 34), · étiquette mono (DM Mono Medium 10).

## Pièges Figma connus
- Les textes clonés de la base sont souvent en « Inter Tight » : ils ne se modifient pas. Recréer le texte en Inter (même place), supprimer l'ancien.
- Les pièces clonées ont souvent des contraintes « Scale » : passer les enfants en Min avant d'agrandir un parent.
- Faire les modifications en petits lots (5 à 10 opérations) et vérifier par capture : un lot qui « expire » peut quand même avoir été appliqué.

## Pas encore dans la banque
Carte de données, interrupteur, pile de notifications, document de notes avec surlignage, calendrier en semaine, graphique en barres, carte du monde en points, tuiles de logos d'outils séparées. À détacher quand un brief en a besoin.
