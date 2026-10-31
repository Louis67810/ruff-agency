# Page « Audit de site offert » — v2 : plan de série et briefs des 2 nouvelles cartes

Retour de Louis sur la v1 (27/10/2026) : le flou d'arrière-plan et la loupe partout, c'est trop (R59) ; ajouter 2 cartes de bénéfice plus originales, qui montrent une transformation comme la carte « visiteurs → clients » du site (F2), toujours en couleur.

Structure et copy des autres sections : inchangées (`audit-site-v1-structure.md`).

## Ce qui change sur les 4 cartes de la v1
- **Flou** : gardé sur une seule carte, la 2 (le vrac des remarques, où le flou dit « désordre »). Carte 1 : la page d'arrière-plan passe en fantôme (`.rf-ghost`). Carte 3 : le bloc « Avant » passe en fantôme.
- **Loupe** : gardée une fois (carte 1), parce que l'idée y est vraiment « regarder de près ».

## Plan de série (6 cartes)

**Grille** : bento à tailles mixtes, trois rangées : large + étroite, deux égales, puis étroite + large (le miroir de la première). **Teintes** (R1) : bleu, jaune, vert, violet, rouge, crème, toutes différentes.

| Carte | Bénéfice | Moment-preuve | Contraste | Mécanique | Famille | Objet central | Accent | Teinte / silhouette |
|---|---|---|---|---|---|---|---|---|
| 1 | Voir son site comme un visiteur | Loupe sur un titre vague | flou → net, nommé | Loupe | Choisir | Haut de page sous loupe | Repère « 1 » bleu | bleu · fenêtre + cercle |
| 2 | Savoir par quoi commencer | Le tri des remarques | vrac flou → liste | Tri | Transformer | Liste « À corriger en premier » | « 1 » bleu | jaune · vrac + colonne |
| 3 | Des exemples sur ses pages | Avant / après de sa section | bouton pâle → visible | Comparaison | Montrer le résultat | Bloc héros ×2 | Bouton `#333` | vert · deux blocs décalés |
| 4 | Un appel sur son site | Écran partagé, deux curseurs | Louis en vignette → son site en grand | Présence | Relier | Fenêtre d'appel | Curseurs `.rf-pointer` | violet · fenêtre + vignette |
| **5** | **Voir où les visiteurs s'arrêtent** | Les visiteurs avancent de page en page ; à « Tarifs », la plupart perdent leur couleur et tombent | **couleur → gris** (intéressés → perdus) | **Le point qui ressort** (sur un parcours) | Choisir | Le parcours Accueil → Offre → Tarifs → Contact, avec des visiteurs pastel | Repère « 1 » bleu sur « Tarifs » | rouge · rangée horizontale, visiteurs qui tombent |
| **6** | **Sa page revue section par section** | La ligne de l'audit passe sur la page : au-dessus, les sections sont en couleur et nommées ; en dessous, encore grises | **gris → couleur**, au passage d'une ligne | **Transformation** (balayage) | Transformer | Une page haute, coupée par une ligne bleue | La ligne bleue et sa puce « Audit » | crème · objet vertical |

### Vérifications de série
- [x] 6 mécaniques différentes, 4 familles.
- [x] Objets centraux tous différents.
- [x] Flou sur 1 carte sur 6 ; loupe 1 fois (R59).
- [x] Deux cartes de transformation en couleur (5 et 6), sans recopier F2 : ni bande en sablier, ni ligne verticale, ni memojis.
- [x] Curseurs nommés sur une seule carte (4) ; aucun cadre de sélection.

## Carte 5 — « Vous voyez à quelle page vos visiteurs décrochent »
1. **Changement** : on ne sait pas où les visiteurs abandonnent → on voit la page où ils partent.
2. **Piège du mot-clé** : un entonnoir, un graphique de taux de rebond, une flèche de sortie. Écartés.
3. **Moment-preuve** : la page « Tarifs », où la plupart des visiteurs perdent leur couleur et tombent.
4. **Contraste** : couleur (intéressés) → gris (perdus). Le seul visiteur encore en couleur arrive à « Contact ».
5. **Mécanique** : le point qui ressort, posé sur un parcours (famille Choisir).
6. **Phrase-concept** : Objet central : le parcours de quatre pages du client. On voit : des visiteurs pastel qui avancent de page en page ; à « Tarifs », la plupart deviennent gris et tombent ; un repère bleu et la remarque « Les prix arrivent sans explication ». Le contraste : couleur → gris. Ça prouve : l'audit montre l'endroit précis où l'on perd ses visiteurs.

| # | Idée | Mécanique | Note /22 | Pourquoi |
|---|---|---|---|---|
| 1 | Parcours de 4 pages, visiteurs pastel qui perdent leur couleur à « Tarifs » | Point qui ressort | 20 | Transformation en couleur, lisible sans texte, propre à l'audit |
| 2 | Un entonnoir qui se rétrécit | (mot-clé) | 5 | ✱ piège du mot-clé |
| 3 | Courbe de visites qui chute à une page | Point qui ressort | 13 | Graphique, ✱ risque de chiffre inventé |
| 4 | Des traces de pas qui s'arrêtent | Métaphore | 12 | Joli mais abstrait, loin du site |

**Fiche de construction** (scène 680 × 420)
| Plan | Élément | Contenu | Position | Taille | Opacité | Classe |
|---|---|---|---|---|---|---|
| arrière | trait de parcours | droit, plein | y 150, de 60 à 620 | 1,5 px | 100 % | `rgba(0,0,0,.12)` (R17 : jamais ondulé) |
| objet central | 4 mini-pages | nav, barres, zone image, pilule | x 0 / 175 / 350 / 525, y 90 | 150 × 190 | 100 % | `.rf-wire` |
| objet central | légendes | « Accueil », « Offre », « Tarifs », « Contact » | sous chaque page | Inter 600 13 px | 100 % | — |
| avant | visiteurs à l'accueil | 5 avatars pastel (vert, rose, jaune, violet, vert) | au-dessus de la page 1 | 40 px | 100 % | `.rf-avatar--*` (R13 : ≥ 40 px) |
| avant | visiteurs à l'offre | 4 avatars pastel | au-dessus de la page 2 | 40 px | 100 % | idem |
| avant | visiteurs à « Tarifs » | 1 pastel au-dessus, 3 gris qui tombent sous la page, de plus en plus pâles | page 3 | 40 px | 80 → 30 % | `.rf-avatar--ghost` |
| avant | visiteur au contact | 1 avatar pastel + puce « Demande envoyée » | page 4 | 40 px | 100 % | `.rf-chip` |
| avant | repère | « 1 » bleu sur le bord de « Tarifs » | page 3, haut droit | 28 px | 100 % | accent unique |
| avant | remarque | « Les prix arrivent sans explication » | accrochée au repère | puce | 100 % | `.rf-chip` |

## Carte 6 — « Votre page, revue section par section »
1. **Changement** : une page qu'on regarde en bloc → chaque section a sa correction.
2. **Piège du mot-clé** : une check-list, un document « Audit » avec un tampon. Écartés.
3. **Moment-preuve** : la ligne de l'audit à mi-page : au-dessus, c'est fait ; en dessous, pas encore.
4. **Contraste** : gris → couleur, au passage d'une ligne.
5. **Mécanique** : la transformation, en balayage (famille Transformer).
6. **Phrase-concept** : Objet central : la page du client, haute. On voit : une ligne bleue horizontale qui la traverse, avec la puce « Audit » ; au-dessus, les sections en couleur (jaune, vert), chacune avec sa correction (« Titre clarifié », « Avis remontés ») ; en dessous, les sections encore grises. Ça prouve : l'audit reprend la page de haut en bas, section par section.

| # | Idée | Mécanique | Note /22 | Pourquoi |
|---|---|---|---|---|
| 1 | La ligne d'audit qui balaie la page : couleur au-dessus, gris en dessous | Transformation | 20 | Gris → couleur, le « en cours » se voit, original |
| 2 | Une check-list cochée | (mot-clé) | 5 | ✱ piège du mot-clé |
| 3 | La page découpée en sections étiquetées | Désordre → ordre | 14 | Pas de transformation visible |
| 4 | Une page avec des post-its | Abondance | 12 | Brouillon, nuage d'éléments (refusé v3) |

**Fiche de construction** (scène 380 × 540, objet vertical qui sort par le bas)
| Plan | Élément | Contenu | Position | Taille | Opacité | Classe |
|---|---|---|---|---|---|---|
| objet central | page | fond blanc | x 40, y 0 | 300 × 620 | 100 % | `.rf-wire` |
| objet central | nav | logo gris, pilule | haut | — | 100 % | R19 |
| objet central | section 1 (héros) | fond `--rf-pastel-yellow`, titre en barres foncées, pilule | sous la nav | 100 × 110 | 100 % | — |
| objet central | correction 1 | « Titre clarifié » + Heroicon `check` | accrochée au bord droit | puce | 100 % | `.rf-chip` |
| objet central | section 2 (preuves) | fond `--rf-pastel-green`, 3 avatars, barres | dessous | 100 × 90 | 100 % | — |
| objet central | correction 2 | « Avis remontés » + `check` | bord droit | puce | 100 % | `.rf-chip` |
| avant | ligne d'audit | trait bleu `#0147FF` qui dépasse de la page des deux côtés | y 290 | 2 px | 100 % | accent unique |
| avant | puce « Audit » | Heroicon `magnifying-glass` + « Audit » | bout gauche de la ligne | puce | 100 % | `.rf-chip` |
| objet central | sections 3 et 4 | barres et zones grises, sans couleur | sous la ligne | — | 100 % | `.rf-bar`, `.rf-ph` |
