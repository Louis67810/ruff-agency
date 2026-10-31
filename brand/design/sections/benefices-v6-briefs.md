# Bénéfices v6 — plan de série et briefs (méthode ruff-illustration-brief v0.2)

Demande de Louis (27/10/2026) : de nouvelles illustrations de bénéfices avec la nouvelle méthode, et des titres nouveaux, pour vérifier que la méthode marche.

Les 4 bénéfices viennent de `brand/differenciateurs/differenciateurs.md` (D3, D7, D10, D8), tous **à valider**. Aucun chiffre ni résultat client n'est affiché. Les contenus des illustrations (date d'atelier, phrases d'appel, remarque d'audit) sont des exemples de situation, pas des preuves.

## Plan de série

**Grille** : 2 × 2 à filets (réf. r05) — titre et phrase en haut, visuel qui sort par le bas de la carte, filets fins qui dépassent et croix aux intersections. Cartes sans teinte (R1 : toutes ou aucune).

| Carte | Bénéfice (avant → après) | Moment-preuve | Contraste | Mécanique | Famille | Objet central | Accent | Silhouette |
|---|---|---|---|---|---|---|---|---|
| 1 | Changer une date demandait d'écrire à l'agence → le client la change lui-même | La frappe : « 12 » barré, « 19 » en train d'être tapé | ancien gris barré → nouveau net | Action en cours | Agir | La carte « Prochain atelier » de son site | Curseur « Vous » | Carte centrée, curseur qui déborde à droite |
| 2 | On découvrait le site à la livraison → on le voit avancer chaque jour | Vendredi : le dernier message arrive, la version est en couleur | gris → couleur, au fil des jours | État final rempli | Montrer le résultat | Le fil de messages avec Louis | Vignette du vendredi (bloc bleu) | Colonne verticale qui sort par le bas |
| 3 | Des titres en jargon → des titres avec les mots des clients | La phrase surlignée dans la note devient le titre | brouillon gris → titre net | Surlignage → effet | Transformer | La note d'appel, et le titre posé dessus | Surlignage `--rf-tint-blue` (même teinte aux deux endroits) | Deux plans décalés, en diagonale |
| 4 | Un appel commercial classique → un appel qui commence par ce qui freine son site | La loupe posée sur le bouton qu'on ne voit pas | à peine visible → vu, agrandi, nommé | La loupe | Choisir | Son site actuel sous une loupe | Repère bleu « 1 » | Fenêtre large et un cercle |

### Vérifications de série
- [x] 4 mécaniques différentes.
- [x] 4 familles (Agir, Montrer le résultat, Transformer, Choisir).
- [x] Objets centraux tous différents : une carte d'événement, un fil de messages, une note, une fenêtre de site sous loupe.
- [x] Contrastes différents.
- [x] Aucun cadre de sélection ; un seul curseur nommé (carte 1).
- [x] Silhouettes différentes : centrée, verticale, diagonale, ronde.

---

## Carte 1 — « Une date change ? Vous la changez vous-même » (D3)

### Du bénéfice au concept
1. **Changement** : avant, pour décaler un atelier, il fallait écrire à l'agence et attendre ; après, on clique sur le texte et on tape.
2. **Piège du mot-clé** : un éditeur de site avec une barre d'outils, un panneau « CMS », une clé ou un cadenas ouvert.
3. **Moment-preuve** : l'instant de la frappe, l'ancienne date encore visible, barrée.
4. **Contraste** : ancien (gris, barré) → nouveau (noir, curseur de texte).
5. **Mécanique** : l'action en cours (Agir).
6. **Phrase-concept** : Objet central : la carte « Prochain atelier » de son site. On voit : « 12 » barré et « 19 » en train d'être tapé, le curseur « Vous » posé dessus. Le contraste : l'ancienne date grise → la nouvelle nette. Ça prouve : le client modifie son site lui-même, en direct.

### Idées
| # | Phrase-concept | Mécanique | Note /22 | Pourquoi |
|---|---|---|---|---|
| 1 | Date d'atelier en cours de frappe, ancienne barrée, curseur « Vous » | Action en cours | 19 | Un geste réel et banal, le contraste se lit sans texte |
| 2 | Un éditeur avec sa barre d'outils et un panneau de champs | (mot-clé) | 7 | ✱ piège du mot-clé |
| 3 | Un fil d'emails « Pouvez-vous changer… » barré, à côté un champ modifié | Comparaison | 14 | Deux objets, lecture lente |
| 4 | Un bouton « Publier » cliqué, la page à jour derrière | Clic décisif | 15 | Le changement lui-même ne se voit pas |
| 5 | Trois versions de la carte en cascade, la plus récente devant | Cascade | 13 | Dit « historique », pas « autonomie » |

**Choix** : n°1. **Réserve** : n°4.

### Fiche de construction (scène 460 × 420, haut 214 px)
| Plan | Élément | Contenu exact | Position | Taille | Opacité | Classe / style |
|---|---|---|---|---|---|---|
| arrière | page du client | barre de nav, 2 barres de titre, zone image | 0, 40 | 460 × 420 | 48 % | `.rf-wire.rf-ghost` |
| objet central | carte d'événement | fond blanc, rayon 20 | 40, 96 | 380 × 300 | 100 % | `.rf-wire` |
| objet central | étiquette | Heroicon `calendar` + « Prochain atelier » | haut gauche | Inter 500 13 px | 70 % | `--rf-ink-70` |
| objet central | champ en édition | fond `#f4f4f5`, rayon 10 | sous l'étiquette | pleine largeur | 100 % | — |
| objet central | date ancienne | « 12 » | dans le champ | Plus Jakarta 700 30 px | 100 % | gris `#b5b5b5`, barré |
| objet central | date nouvelle | « Jeudi 19 mars » + curseur de texte | dans le champ | Plus Jakarta 700 30 px | 100 % | `--rf-ink` |
| objet central | curseur de texte | trait vertical | après « 19 » | 2 × 30 px | 100 % | `--rf-ink` |
| objet central | détail | « 14 h – 17 h · Lyon » | sous le champ | Inter 500 15 px | 100 % | `--rf-ink-70` |
| objet central | barres de texte | 2 barres | dessous | 70 %, 52 % | 100 % | `.rf-bar--2`, `.rf-bar--3` |
| objet central | bouton | « S'inscrire » | bas gauche | pilule | 100 % | `#333` (R11) |
| objet central | places | 3 avatars fantômes + « places restantes » en barre | bas droite | 26 px | 100 % | `.rf-avatar--ghost` |
| avant | puce d'état | Heroicon `check` + « Enregistré » | accrochée en haut à droite de la carte | puce | 100 % | `.rf-chip` |
| avant | curseur nommé | « Vous » | bout du champ | — | 100 % | `.rf-you` (accent unique) |

**Test des 3 secondes** : on voit quelqu'un corriger une date sur un site, sans outil technique.

---

## Carte 2 — « Vous voyez votre site avancer chaque jour » (D7)

### Du bénéfice au concept
1. **Changement** : avant, on attend des semaines et on découvre tout à la livraison ; après, chaque jour un message montre où en est le site.
2. **Piège du mot-clé** : une barre de progression, un diagramme de Gantt, un logo WhatsApp.
3. **Moment-preuve** : le message du vendredi qui arrive, avec une version presque finie.
4. **Contraste** : gris → couleur ; les vignettes se remplissent d'un jour à l'autre.
5. **Mécanique** : l'état final rempli (Montrer le résultat).
6. **Phrase-concept** : Objet central : le fil de messages avec Louis. On voit : lundi une structure grise, mercredi une maquette, vendredi la version en couleur, et la réponse du client. Le contraste : chaque vignette est plus complète que la précédente. Ça prouve : on voit son site se construire, sans attendre la livraison.

### Idées
| # | Phrase-concept | Mécanique | Note /22 | Pourquoi |
|---|---|---|---|---|
| 1 | Fil de messages quotidiens dont les vignettes passent du gris à la couleur | État final rempli | 19 | Le temps qui passe et le progrès se voient ensemble |
| 2 | Une barre de progression à 80 % | (mot-clé) | 5 | ✱ piège du mot-clé, ✱ pas de contraste |
| 3 | Trois maquettes du site en escalier, de plus en plus finies | Cascade | 15 | Perd le « chaque jour » et la relation |
| 4 | Une notification « Nouveau message de Louis » sur un écran verrouillé | Le bon moment | 14 | Un seul jour, pas de progrès visible |
| 5 | Un calendrier avec une vignette dans chaque case | Abondance | 13 | Trop petit, rien ne ressort |

**Choix** : n°1. **Réserve** : n°3.

### Fiche de construction (scène 380 × 560, haut 206 px, coupée par le bas)
| Plan | Élément | Contenu exact | Position | Taille | Opacité | Classe / style |
|---|---|---|---|---|---|---|
| objet central | panneau de discussion | fond `#f6f6f7`, rayon 24 | 20, 0 | 340 × 600 | 100 % | `.rf-wire` |
| objet central | en-tête | photo de Louis 32 px + « Louis · Ruff » + barre grise | haut | — | 100 % | `.rf-avatar` |
| objet central | repère de jour | « Lundi » | centré | pilule 12 px | 100 % | blanc, `--rf-ink-70` |
| objet central | bulle 1 | vignette fil de fer (barres seules) + « Structure de l'accueil » | gauche | 240 px | 55 % | blanc |
| objet central | repère de jour | « Mercredi » | centré | — | 100 % | — |
| objet central | bulle 2 | vignette avec titre, zone image, pilule + « Textes et maquette » | gauche | 240 px | 80 % | blanc |
| objet central | repère de jour | « Vendredi » | centré | — | 100 % | — |
| objet central | bulle 3 | vignette complète, bloc de héros bleu `#0147FF` + « Version mobile en ligne » | gauche | 240 px | 100 % | blanc (accent unique) |
| objet central | réponse | « Parfait, on garde ce titre » | droite | bulle | 100 % | `--rf-pastel-green` |
| objet central | heures | « 18:02 », « 17:45 »… | coin de bulle | Inter 11 px | 50 % | — |

**Test des 3 secondes** : on voit des messages jour après jour, et un site qui se complète.

---

## Carte 3 — « Vos titres reprennent les mots de vos clients » (D10)

### Du bénéfice au concept
1. **Changement** : avant, des titres écrits en jargon d'agence ; après, des titres qui reprennent ce que les clients disent eux-mêmes.
2. **Piège du mot-clé** : un stylo plume, une page de texte, une bulle « Aa ».
3. **Moment-preuve** : la phrase entendue pendant l'appel, surlignée, et le titre du site qui la reprend.
4. **Contraste** : brouillon gris et désordonné → titre net et mis en page.
5. **Mécanique** : le surlignage → l'effet (Transformer).
6. **Phrase-concept** : Objet central : la note d'un appel client. On voit : une phrase surlignée, et posé dessus le haut de page qui la reprend mot pour mot. Le contraste : la note grise, inclinée → le titre net. Ça prouve : les textes partent des mots réels des clients.

### Idées
| # | Phrase-concept | Mécanique | Note /22 | Pourquoi |
|---|---|---|---|---|
| 1 | Note d'appel avec une phrase surlignée ; le titre de la page la reprend | Surlignage → effet | 20 | Lien de cause visible par la même teinte |
| 2 | Une page pleine de texte avec « Aa » | (mot-clé) | 6 | ✱ piège du mot-clé |
| 3 | Deux titres côte à côte : jargon barré / phrase client | Comparaison | 15 | Juste, mais sans l'origine (l'appel) |
| 4 | Une loupe sur une phrase du client | Loupe | 13 | Déjà utilisée carte 4 |
| 5 | Des bulles de citations triées, une seule passe dans la page | Tri | 15 | Plus lent à lire |

**Choix** : n°1. **Réserve** : n°3.

### Fiche de construction (scène 480 × 440, haut 210 px)
| Plan | Élément | Contenu exact | Position | Taille | Opacité | Classe / style |
|---|---|---|---|---|---|---|
| arrière | note d'appel | fond blanc, inclinée −4° | 0, 20 | 330 × 420 | 100 % | `.rf-wire` |
| arrière | en-tête de note | « Appel · Cabinet Morel » + barre | haut | Inter 600 14 px | 100 % | — |
| arrière | citation 1 | « On perd un temps fou à relancer. » | — | Inter 500 14 px | 100 % | `--rf-ink-70` |
| arrière | citation 2 (surlignée) | « Je veux arrêter de courir après les devis. » | — | Inter 600 14 px | 100 % | fond `--rf-tint-blue` (accent) |
| arrière | citation 3 | « Notre site, personne ne le lit. » | — | Inter 500 14 px | 100 % | `--rf-ink-70` |
| arrière | barres de notes | 4 barres | entre les citations | — | 100 % | `.rf-bar--2/3` |
| objet central | haut de page | fond blanc, rayon 20 | 150, 190 | 330 × 250 | 100 % | `.rf-wire` |
| objet central | nav | logo gris + pilule | haut | — | 100 % | R19 |
| objet central | titre | « Arrêtez de courir après vos devis. » | centre | Plus Jakarta 700 26 px | 100 % | `--rf-ink`, « courir après vos devis » surligné `--rf-tint-blue` |
| objet central | sous-titre | 2 barres | dessous | 80 %, 60 % | 100 % | `.rf-bar--2` |
| objet central | bouton | — | dessous | pilule | 100 % | `.rf-pill` |
| objet central | zone image | — | bas | — | 100 % | `.rf-ph` |

**Test des 3 secondes** : on voit la même phrase passer d'une note à un titre de site.

---

## Carte 4 — « L'appel commence par l'audit de votre site » (D8)

### Du bénéfice au concept
1. **Changement** : avant, un appel commercial où l'on parle de l'agence ; après, un appel qui commence par ce qui freine son propre site.
2. **Piège du mot-clé** : un tableau de bord de scores, une jauge, une liste à cocher « Audit ».
3. **Moment-preuve** : la loupe posée sur un détail qu'on ne voyait pas, et qui a désormais un nom.
4. **Contraste** : à peine visible (gris clair, petit) → agrandi, net, nommé.
5. **Mécanique** : la loupe (Choisir).
6. **Phrase-concept** : Objet central : son site actuel. On voit : une loupe sur le bouton principal, presque invisible, et une remarque accrochée. Le contraste : le détail flou et petit → agrandi et nommé. Ça prouve : on voit ce qui freine le site avant même de parler prix.

### Idées
| # | Phrase-concept | Mécanique | Note /22 | Pourquoi |
|---|---|---|---|---|
| 1 | Loupe sur le bouton invisible du site, remarque n° 1 accrochée | Loupe | 19 | Concret, rond, différent des autres cartes |
| 2 | Une jauge « Score 62/100 » | (mot-clé) | 5 | ✱ piège du mot-clé, ✱ chiffre inventé |
| 3 | Le site avec trois repères numérotés et une liste de remarques | Point qui ressort | 15 | Plus chargé, pas de point focal |
| 4 | Le site gris, une seule section mise en avant en couleur | Point qui ressort | 14 | Le « pourquoi » ne se lit pas |
| 5 | Avant / après du même bouton | Comparaison | 13 | Montre la refonte, pas l'audit |

**Choix** : n°1. **Réserve** : n°3.

### Fiche de construction (scène 500 × 420, haut 210 px)
| Plan | Élément | Contenu exact | Position | Taille | Opacité | Classe / style |
|---|---|---|---|---|---|---|
| arrière | son site actuel | nav, titre, 3 barres, bouton pâle, 2 zones image, 3 barres | 0, 20 | 470 × 440 | 100 % | `.rf-wire` |
| arrière | bouton pâle | « Demander un devis » | sous le titre, à gauche | 14 px | 100 % | texte `#c9c9c9` sur `#ededed` |
| arrière | repères 2 et 3 | « 2 », « 3 » | sur la zone image et le bas | 22 px | 40 % | ronds gris |
| objet central | loupe | cercle à bord blanc 7 px | centrée sur le bouton | 200 px | 100 % | `--rf-shadow-wire` |
| objet central | manche | barre arrondie, −45° | bas droite de la loupe | 22 × 90 px | 100 % | `#e3e3e3` |
| objet central | contenu agrandi | barres ×2, bouton « Demander un devis » ×2 | dans la loupe | — | 100 % | idem, agrandi |
| avant | repère 1 | « 1 » | bord de la loupe | 26 px | 100 % | rond `#0147FF` (accent unique) |
| avant | remarque | « Le bouton se confond avec le fond » | accrochée au repère 1 | puce | 100 % | `.rf-chip`, Inter 600 14 px |

**Test des 3 secondes** : on voit quelqu'un examiner un site existant et pointer un défaut précis.
