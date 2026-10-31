# Page « Audit de site offert » — v3 : les 2 cartes refaites

Retour de Louis sur la v2 (28/10/2026) : trop de couleurs dans les 2 nouvelles cartes, titres de maquette en noir, trop de petits éléments sur la carte rouge ; un visiteur se dessine avec l'icône, le memoji coloré est pour les clients ; pour la carte rouge, un bon concept aurait été l'entonnoir (funnel). Règles R60 et R61.

Cartes 1 à 4 : inchangées (elles passent R60 et R61).

## Plan de série (mise à jour des cartes 5 et 6)

| Carte | Bénéfice | Moment-preuve | Contraste | Mécanique | Famille | Objet central | Accent (un seul) | Couleurs |
|---|---|---|---|---|---|---|---|---|
| 5 (rouge, large) | Voir où les visiteurs décrochent | L'entonnoir du parcours se resserre d'un coup à « Tarifs » | large → étroit, une chute brutale | Point qui ressort | Choisir | L'entonnoir des étapes Accueil → Offre → Tarifs → Contact | Repère « 1 » bleu sur la chute | gris + bleu |
| 6 (crème, étroite) | Sa page revue section par section | La ligne de l'audit à mi-page | net et corrigé au-dessus → pâle en dessous | Transformation (balayage) | Transformer | La page haute, traversée par la ligne | Ligne bleue + puce « Audit » | gris + bleu |

Vérifications R60 / R61 : une seule couleur d'accent par carte, titres en barres grises, visiteurs en icône grise, moins de 20 éléments par carte.

## Carte 5 — « Vous voyez où vos visiteurs décrochent »
1. **Changement** : on ne sait pas à quelle étape les visiteurs abandonnent → on voit l'étape.
2. **Piège** : un cône d'entonnoir décoratif, seul, sans contenu. L'entonnoir est ici l'outil lui-même : les étapes réelles du site, empilées.
3. **Moment-preuve** : la marche entre « Offre » et « Tarifs », où l'entonnoir se resserre d'un coup.
4. **Contraste** : large → étroit, avec une seule chute brutale.
5. **Mécanique** : le point qui ressort.
6. **Phrase-concept** : Objet central : l'entonnoir du parcours (Accueil, Offre, Tarifs, Contact). On voit : quatre étapes empilées qui rétrécissent, une chute nette avant « Tarifs », un repère bleu et la remarque « Les prix arrivent sans explication ». Ça prouve : l'audit montre l'étape où l'on perd ses visiteurs.

| # | Idée | Mécanique | Note /22 | Pourquoi |
|---|---|---|---|---|
| 1 | Entonnoir des étapes réelles, chute nette à « Tarifs » | Point qui ressort | 19 | Demandé par Louis ; un seul objet, lisible, sans chiffre |
| 2 | Parcours de 4 pages et foule d'avatars (v2) | Point qui ressort | 9 | Refusé : trop de couleurs et de petits éléments (R60, R61) |
| 3 | Cône d'entonnoir décoratif | (mot-clé) | 6 | ✱ image du mot, sans contenu |

**Fiche de construction** (scène 600 × 420)
| Plan | Élément | Contenu | Position | Taille | Opacité | Classe |
|---|---|---|---|---|---|---|
| objet central | panneau | fond blanc | 20, 0 | 560 × 430 | 100 % | `.rf-wire` |
| objet central | en-tête | Heroicon `funnel` + « Parcours des visiteurs » + barre grise | haut | Inter 600 14 px | 100 % | — |
| objet central | étape 1 | icône utilisateur grise + « Accueil » | largeur 100 % | 48 px de haut | 100 % | fond `#f1f1f3` |
| objet central | raccord 1 | trapèze 100 → 82 % | — | 16 px | 100 % | `clip-path`, `#f7f7f8` |
| objet central | étape 2 | icône + « Offre » | 82 % | 48 px | 100 % | idem |
| objet central | raccord 2 (la chute) | trapèze 82 → 38 % | — | 34 px | 100 % | idem |
| objet central | étape 3 | icône + « Tarifs » | 38 % | 48 px | 100 % | idem |
| objet central | raccord 3 | trapèze 38 → 28 % | — | 16 px | 100 % | idem |
| objet central | étape 4 | icône + « Contact » | 28 % | 48 px | 100 % | idem |
| avant | repère | « 1 » | à droite de la chute | 28 px | 100 % | bleu, accent unique |
| avant | remarque | « Les prix arrivent sans explication » | accrochée au repère | puce | 100 % | `.rf-chip` |

## Carte 6 — « Votre page, revue section par section »
Même concept qu'en v2 (gardé par Louis), couleurs réduites :
- au-dessus de la ligne, les sections sont **nettes** (blanches, barres grises, bord fin) avec leur correction (« Titre clarifié », « Avis remontés ») ;
- en dessous, elles sont **pâles** (opacité 35 %) : pas encore revues ;
- **un seul accent** : la ligne bleue et l'icône bleue de la puce « Audit » ;
- les titres sont des barres grises (R60) ; les avis sont des icônes grises (R61).

**Phrase-concept** : Objet central : la page du client. On voit : la ligne bleue de l'audit à mi-page ; au-dessus, les sections nettes avec leur correction ; en dessous, encore pâles. Le contraste : pâle → net. Ça prouve : l'audit reprend la page section par section.
