# Structure de page : la grammaire de la page SaaS (R38)

Source : styles calculés de https://ruff.agency/saas-redesign, relevés le 26/10/2026. Avant d'illustrer quoi que ce soit, la page doit être **propre ici** : typographie, fonds, cartes, alignements.

## Fonds de section (R22, R37) : alterner pour le rythme

| Fond | Valeur | Usage |
|---|---|---|
| Page | `#FBFBFB` | Défaut |
| Blanc | `#FFFFFF` | Section qui doit ressortir (preuves, comparaison, avis) |
| Gris marqué | `#F5F5F5` | Section « offre / tarif / détail », pour casser le rythme |
| **Bleu dégradé** | `background: #FBFBFB linear-gradient(180deg, rgb(12,90,192) 0%, rgba(10,96,209,.918) 15.17%, rgba(10,103,226,0) 100%)` | Section forte (solution, appel final). **Jamais d'aplat bleu.** Le haut de la section est bleu, titres en blanc ; le contenu (cartes blanches) descend dans le fondu |

Deux sections consécutives n'ont jamais le même fond, sauf le défaut `#FBFBFB` séparé par un filet `1px rgba(0,0,0,.1)`. Padding vertical : 142 px desktop (SaaS : 140 à 152), 96 px tablette, 72 à 88 px mobile.

## Typographie

| Élément | Style |
|---|---|
| Tag au-dessus du H1 (R24) | Inter 500 16 px / 29,76, approche -0.03em, `rgba(18,26,46,.7)`, fond blanc, bordure 0,8 px `rgba(0,0,0,.11)`, rayon 46, padding 10 × 24, hauteur 52 px |
| H1 | Plus Jakarta Sans 700 80 px / 1.04, approche -0.05em, `#121A2E`, largeur max ≈ 680 à 900 px |
| Sous-titre du héros | Inter 500 20 px / 1.86, approche -0.03em, `rgba(18,26,46,.7)` ; `<strong>` en encre |
| H2 de section | Plus Jakarta Sans 700 64 px / 1.06, approche -0.03em (ou -0.06em pour les gros titres sur deux lignes), **une seule couleur** (R26) |
| Texte d'intro de section | Inter 500 20 px / 1.86, `rgba(18,26,46,.7)`, largeur max 720 à 916 px |
| H2 sur fond bleu | Blanc, 58 à 80 px ; texte `rgba(255,255,255,.72)` |
| Sous-titre de bloc (« The result? ») | Plus Jakarta Sans 700 48 px / 1.06 |
| **Phrase de conclusion** (R31) | Inter 600 28 px / 1.86, centrée, `#121A2E`, précédée d'un filet `0.8px rgba(0,0,0,.11)`, et d'un texte Inter 500 18 px / 2.7 en `--rf-ink-70` si besoin |

Jamais de petits libellés en MAJUSCULES au milieu d'un contenu (R34). Pas de titre bicolore, sauf une fois par page au plus (R26).

## Cartes

| Élément | Style |
|---|---|
| Carte | Fond blanc, bordure 0,8 px `rgba(0,0,0,.133)` (ou `.15`), rayon 32, padding 32, ombre `--rf-shadow-card` (5 couches, la dernière `0 38px 11px rgba(0,0,0,0)`) |
| En-tête de carte | Tuile d'icône 40 × 40, rayon 12, fond coloré (rouge problème `rgb(255,96,101)`, bleu `#0147FF`, etc.), Heroicon **plein** 24 px blanc. À côté, titre Plus Jakarta Sans 700 24 px / 1.88 |
| Filet de carte | 1 px `rgba(0,0,0,.11)` |
| Texte de carte | Inter 400 ou 500, 18 px / 2.7, `rgba(18,26,46,.7)` |
| Carte d'illustration (F5) | Illustration en haut, titre Inter 600 22 px / 1.86, filet, texte Inter 500 18 px / 2.7 |
| Mini-liste de résultats | Tuile 28 × 28, rayon 8, Heroicon blanc + Inter 500 24 px / 1.86 `--rf-ink-70` |
| Citation mise en avant | Bloc blanc, rayon 64, padding 64, ombre de carte ; titre Inter 600 28 px centré, filet, texte 18 px, avatar 80 px |

## Étapes de processus (F4)
- **Étiquette d'étape** : fond `rgb(234,239,255)` (une teinte par étape possible), rayon 12, padding 12 × 16, Inter 500 14 px, `rgba(0,0,0,.8)`.
- **Titre** : Inter 600 20 px / 1.46.
- **Texte** : Inter 500 18 px / 2.08, `--rf-ink-70`.
- **Visuel** : fond `rgba(186,190,199,.08)`, bordure 0,8 px `rgba(1,71,255,.12)`, rayon 28.
- **Le même contour sert pour les encadrés de note (R33).**
- Aucun schéma (flèche de boucle…) posé entre les cartes (R29).

## Avant / après (R27)
- Le visuel lui-même : image arrondie (rayon 32), ombre de carte. **Ni conteneur gris ou bleu, ni pointillés, ni boîte dans une boîte.**
- **Étiquettes « Avant » / « Après »** : fond blanc, rayon 15, Plus Jakarta Sans 700 20 px / 1.07, approche -0.03em, padding 16 × 18, bordure 0,8 px `rgba(0,0,0,.15)`, ombre de carte, posées en haut à gauche du visuel.

## Réassurance sous un bouton (R25)
Ligne flexible, gap 20 px. Chaque élément contient un Heroicon **contour** 24 px (trait 1,5 px, `#141B34`), un gap de 12 px et le texte en Inter 500 16 px `#121A2E`. Entre deux éléments : un trait vertical de 1 × 14 px, `rgba(20,27,52,.15)`. **Jamais de points de couleur.**

## Listes
Une puce = un Heroicon (plein 20 ou 24 px, encre ou bleu), jamais une pastille `.rf-dot` (R35).

## Héros
- **H1** : Plus Jakarta Sans 700, 64 px / 1.06, deux lignes environ (largeur max ≈ 1040 px). 40 px sur mobile (R43).
- **Indication de défilement** (flèche + texte) : dans un tag avec ombre (R44). Fond blanc, bordure 0,8 px `rgba(0,0,0,.15)`, rayon 15, padding 12 × 18, ombre de carte.
- **Média** : si une vidéo est prévue, un cadre média 16:9 (fond `#E2E2E2`, bordure blanche de 8 px, rayon 62, bouton lecture blanc).

- **Fond du héros (R53)** : `rgb(249,251,255)`, jamais blanc, avec les formes SVG du site.

## Formes SVG du site (R48)
- **Bloc** : `brand/design/components/shapes.html`. Marqueurs de gabarit : `<!--@SHAPES-->` (bleu `#0147FF` à 4 %), ou `<!--@SHAPES-LIGHT-->` (blanc à 8 %) sur une section bleue. Ils se placent comme premier enfant d'une section en `position: relative; overflow: hidden`.
- **Où** :
  - dans le héros, sauf s'il est très chargé ;
  - dans environ 2 autres sections sur 10, pour le rythme.
- **Placement** : toujours **sur les bords**, sans passer derrière le contenu. Hors héros, les repousser (`left: calc(-6% - 560px)` et `left: calc(100% - 260px)`), et les masquer sur mobile.

## Mise en page d'une section (R49)
Jamais un titre suivi d'un contenu empilé verticalement. Toujours une mise en page :
- deux colonnes (titre et texte à gauche, contenu à droite) ;
- une grille de cartes ;
- ou un élément latéral.

Une liste de livrables devient une grille de cartes : icône encre, titre, une phrase.

## Offre (R52)
- Une offre se représente par **un logo à côté de son nom** : tuile de 56 px, rayon 16, dégradé du bouton principal, icône blanche, puis le nom en Plus Jakarta Sans 700 24 px et « par Ruff Agency ».
- Jamais un bloc bleu avec une icône comme contenu.
- Les icônes de liste sont en encre (`#141B34`).

## Appel final (R54, R55)
- **Fond** : le dégradé bleu est possible, pas obligatoire (R54). Blanc, `#FBFBFB` ou le bleuté du héros conviennent aussi.
- **Si l’appel est « réserver un appel »** : pas de bouton. La section intègre directement l’agenda Cal.com du site (R55) :
  - `<section id="reserver">` : H2 centré, une phrase, la ligne de réassurance, puis `<div class="bp-cal"><div id="my-cal-inline-discovery-call"></div></div>` ;
  - le script d’intégration et les réglages de taille sont ceux de `components/sections/CallBooking/` (largeur 1054, hauteur 665, `margin-top: -95px` sur `cal-inline`) ; modèle prêt : `brand/design/pages/src/make-ssm-v3.mjs` ;
  - tous les autres boutons « Réserver un appel » de la page pointent vers `#reserver` ;
  - pas de formes SVG dans cette section : l’agenda prend la largeur (R48).
- Le rendu headless (`render.mjs`) bloque sur l’iframe Cal.com : rendre une copie sans le script, et vérifier l’agenda dans un vrai navigateur.

## Grilles de cartes illustrées (d’après les références du 27/10/2026)
Choisir la grille **avant** les illustrations ; elle fait partie du plan de série (`ruff-illustration-brief/templates/plan-serie.md`).

| Grille | Quand | Détails |
|---|---|---|
| **2 × 2 à filets** | 4 bénéfices de même poids | Filets fins `rgba(0,0,0,.08)` qui dépassent de la grille, petites croix aux intersections ; titre en haut, une phrase, visuel qui sort par le bas de la carte (réf. r05) ou visuel centré en haut (r01) |
| **Bento à tailles mixtes** | 4 à 6 bénéfices dont un principal | Une carte large + une étroite, puis trois moyennes, éventuellement une pleine largeur ; le visuel occupe la carte, icône + titre + une ligne posés en bas à gauche sur un fondu (r02, r03) |
| **3 × 2 teintée** | 6 fonctions courtes | Chaque carte a sa teinte (R1), visuel en haut, titre et phrase dessous (r04) |
| **Carrousel de cas d’usage** | Services, exemples d’usage | Titre de section à gauche, flèches à droite ; légende de carte = la tâche ; le visuel = son résultat (r06, r08) |
| **Carte centrale et voisines** | Mettre en avant un élément parmi d’autres | Carte nette au centre, voisines plus petites, coupées et estompées, **sans pointillés** (r07, R27) |

Dans une grille : silhouettes de visuels différentes d’une carte à l’autre, et jamais deux fois la même mécanique (R56).

## Où mettre des illustrations (R41, R42)
Peu, et à des endroits précis :
- les cartes de bénéfices ;
- les visuels d'étapes ;
- les cartes d'offre / de contenu.

Jamais :
- dans une section de texte (problème, argument, conclusion) ;
- quand il s'agit d'exemples ou de résultats : là, un **emplacement média** (vidéo ou capture réelle), à la même taille.

## Avis clients (R45)
- Toujours avec la **photo réelle** de l'auteur (`brand/design/assets/avis/`, tirées de `lib/data/projects.ts`), son nom et son rôle.
- **Contour de la photo (R50)** : bordure blanche de 3 px, ombre `--rf-shadow-dir`, 56 px.
- Un groupe d'avis défile en **vrai ticker** (R51), comme le marquee du site :
  - pleine largeur d'écran (marges négatives égales au padding de la section) ;
  - piste doublée, gap de 32 px, `translate3d(calc(-50% - 16px),0,0)`, environ 70 s ;
  - **jamais en pause au survol** ;
  - arrêt seulement si le mouvement est réduit.
- Ne jamais inventer un avis : uniquement ceux publiés sur le site.

## Blocs réels
- Footer : `brand/design/components/site-footer.html` (R21). **Si la page a déjà son propre appel final** (landing, lead magnet, remerciement), prendre `site-footer-sans-cta.html` : marqueur `<!--@FOOTER-SANS-CTA-->` dans le gabarit (R40).
- FAQ : `brand/design/components/site-faq.html` (R36).

## Colonnes (R32)
- Dans une mise en page à deux colonnes, chaque titre appartient à sa colonne.
- Un titre de section ne passe au-dessus des deux colonnes que s'il introduit les deux.
- Jamais de boîte à contour gris à l'intérieur d'une carte ou d'une colonne déjà délimitée.
