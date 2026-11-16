# Journal des retours de Louis

Chaque retour est classé : **général** (devient une règle du système) ou **local** (correction d'une composition précise, à ne pas généraliser). L'historique antérieur (R01-R14, ancien système HTML) est résumé dans la transmission du 2026-10-20 ; ses règles encore valables sont reprises dans `regles.md`.

## R15 — 2026-10-20 — retours sur le carrousel test v1 « La stratégie secrète qui booste ta conversion »

Avis global : « Tu as vraiment bien saisi le style. » La méthode (construction dans Figma en clonant les vrais composants) est validée.

| Retour | Portée | Application |
|---|---|---|
| La pilule noire de couverture ne doit pas faire toute la largeur : toujours ajustée au texte. | Général | Règle « pilules noires en hug, centrées ». |
| Tous les boutons (Continuer, Envoyer…) doivent reprendre le CTA de la banque ; le « Réserver mon appel » reconstruit n'était pas le bon. Référence sélectionnée : `5406:2442`. Exception : montrer un mauvais CTA. | Général | `kit.sourceCTA` clone le vrai composant et le met à l'échelle. |
| Les checks / croix sont parfois trop grands par rapport aux illustrations. | Général | `kit.badge(size)` ≈ 30 px, mise à l'échelle calque par calque. |
| Jamais de carré / pastille bleue en dégradé dans une illustration (« Presque fini ») ; utiliser les tags (référence `5406:6679`). | Général | `kit.tag` ; pastille bleue retirée. |
| Le cadre de sélection n'a pas de sens au milieu d'une étape ; il s'utilise presque uniquement en couverture, pour montrer l'édition. | Général | Règle cadre de sélection. |
| Point 1 : la flèche doit être courbée dans l'autre sens. | Local | Courbure inversée sur cette slide. Leçon générale prudente : vérifier le sens de courbure au rendu. |
| La main doit être plus visible et plus au centre ; jamais juste un bout qui dépasse. | Général | Règle main. |
| Pour un empilement, souvent trois éléments, moins d'espace entre eux, le premier couvre davantage. | Préférence (« souvent ») | Couverture v2 à trois cartes serrées. |

Résultat : v2 dans la section Figma `5411:11358`, la v1 est conservée (`5406:10807`).

## R16 — 2026-10-20 — retour sur la v2, slide 2

« Ce genre de tag » doit être plus petit et se mettre dans le coin en haut à droite. Portée : **générale** (Louis parle du type de tag, pas seulement de celui-ci). Appliqué : tag « Presque fini » à s = 1,05, accroché au coin supérieur droit de la carte ; champs remontés pour combler l'ancien emplacement (ajustement local). Script : `exemples/strategie-secrete/v2b-tag.mjs`, `v2c-resserrer.mjs`.

## R17 — 2026-10-22 — image unique à partir d'une référence externe

Louis envoie une infographie (« Formula for High converting landing page ») et demande un visuel d'une seule page. Première lecture de Claude (créer un mémo résumé) rejetée : « je ne veux pas une image de pure information… utilise l'image comme information pour reproduire le truc dans mon style et en français ». Portée : **générale** — une image envoyée comme référence se reproduit fidèlement (structure et contenu complets, traduits), avec les composants de Louis ; on n'invente ni ne condense l'information. Résultat : `banque/tests/image-1.json`.

## R18 — 2026-10-22 — le site montré doit suivre la template de Louis

« C'est bien ce que tu as fait », mais le site au centre doit reprendre le design de site qu'il utilise souvent dans ses carrousels (sélection `5424:3826`). Portée : **générale** pour toute page générique. Appliqué : page redessinée (barres grises, pilules sombres sans libellé, blocs gris clair, titres bleu nuit), aux mêmes emplacements ; tags, prix et infobulle gardés car annotés. Tranche l'ambiguïté des faux CTA de squelette : pilules sombres #383838. Script : `exemples/image-formule-landing/page-template.mjs`.

Correction technique au passage : les liaisons se coudent vers la hauteur exacte de leur cible quand l'annotation a dû être décalée, avec des coudes décalés pour ne pas se superposer.

## R19 — 2026-10-22 — carrousel Artan (étude de cas), retours sur la v1

- « Repenser l'architecture » ne doit pas devenir une slide par section (le hero, la preuve sociale, l'avant/après…) : c'est trop. **Une seule slide montre la structure de la page**, dessinée avec la template de site (R18), et chaque section y est nommée et expliquée dans un **petit tag** relié à sa zone. Portée : **générale** pour toute étape « structure / architecture » d'une étude de cas.
- « Pourquoi cette structure fonctionne ? » s'illustre en **points numérotés**, chacun avec **une capture** du vrai site. Portée : **générale** pour les slides « pourquoi ça marche » d'une étude de cas sur un site réel : toujours des captures.
- Étape 3 validée telle quelle.
Résultat : section Figma « Claude — Carrousel Artan (v2) » (5434:7947), 15 slides. Script : `exemples/artan/build-v2.mjs`.

## R20 — 2026-10-23 — carrousel « site fait par IA → pro », retours sur la v1

- Captures trop basses et trop petites : les sites doivent se voir. Format des captures des études de cas du corpus (≈ 426 × 256, ratio 1,66), le plus grand possible. **Général.**
- Transition avant → après : reprendre le modèle du corpus (5406:5609) — deux captures empilées, étiquette bleue en bas à droite (5406:5640), flèche bleue source à gauche (5406:5644). **Général.**
- États intermédiaires : chaque étape ne change que ce qu'elle annonce. L'étape « structure » garde les polices, couleurs et le style de la version d'origine ; seule la structure change. Puis light mode, puis direction artistique. **Général** pour toute transformation progressive.
- Tags d'annotation : ne pas les poser sur la capture au point de cacher le site ; les mettre **sous le texte**. **Général.**
- Slide « Pourquoi ? » pas obligatoire ici ; « À retenir » retiré. **Local** (pas une interdiction générale du « Pourquoi ? »).
Résultat : section « Claude — Carrousel site IA → pro (v2) », états de travail dans « Claude — États site agence v2 (travail) ». Scripts : `exemples/agence-ia/etats-v2.mjs`, `build-v2.mjs`.

## R21 — 2026-10-31 — carrousel « slop design », retours sur la v1

- Slide Contexte seulement quand elle apporte vraiment de la valeur ; ici retirée. **Général** (pas automatique).
- Ne jamais répéter le même numéro sur plusieurs slides : une catégorie = une slide (3 exemples environ). **Général.**
- Retirer une illustration ne retire pas le point du prompt : le prompt garde tout. **Général.**
- Prompt final : pas de phrase de rôle (« Tu es directeur artistique… ») ; le faire tenir en 2 slides. **Général** pour ce type de prompt.
- Quand plusieurs détails vont ensemble, les réunir dans une seule scène (ici une section pricing : halos, gros contour, lumière au survol, flèches devant les points, initiales, carreaux), tags sous l'illustration. **Général.**
- Icônes : chercher dans Heroicons (ex. « sparkles ») plutôt que dessiner. Les « carrés violets » reproduisent la référence envoyée par Louis (dégradé violet, reflet, icône blanche), trois d'un coup. **Général / local.**
Résultat : section « Claude — Carrousel slop design (v2) », 10 slides.

## R22 — 2026-10-31 — disposition des slides « catégorie » (modèle retouché par Louis : 5481:4287)

Panneaux d'exemple collés (écart 6 px, départ juste sous le titre), tag blanc + croix accroché au bas droit de chaque panneau, puis un **texte d'explication** du point sous les panneaux (Plus Jakarta Sans Bold 19, interligne 130 %). **Général** pour les slides qui listent des exemples par catégorie. Script : `exemples/slop-design/disposition-v3.mjs`.

Note technique (pas une préférence de Louis) : redimensionner le groupe d'un badge source casse son pictogramme (traits non mis à l'échelle) ; il faut redimensionner chaque calque.

## R23 — 2026-11-03 — structure de rétention, d'après un tuto externe envoyé par Louis

Louis envoie un carrousel d'une autre agence (« Comment retenir ton audience jusqu'à la fin d'un carrousel ? ») et demande d'en reprendre la structure et les stratégies sur « IA sur ton site » pour maximiser la rétention. Il réduit à 3 stratégies (résumé IA retiré) et met la meilleure, l'agent, en dernier. Portée : **préférence forte** pour les carrousels de type « X stratégies » ; **local** pour le choix des 3 stratégies. Application : `regles.md`, section « Structure de rétention ». Le texte et les images de la référence ne sont pas repris, seulement la mécanique, dans le style de Louis. Résultat : section « Claude — Carrousel IA sur ton site (v2) » (5495:1803). Scripts : `exemples/ia-sur-site/build-v2.mjs`, `fix-v2.mjs`.

Suite de R23 (même jour) : sommaire et slide « Merci d'avoir lu » retirés, interruption reformulée en « Attends une seconde », deuxième hook centré sur « tout le monde utilise Claude, très peu pour la conversion de leur site ». Portée : **local** pour les textes ; sommaire et merci deviennent facultatifs dans la structure de rétention. Script : `exemples/ia-sur-site/fix-v3.mjs`.

Correction de fond (R23) : ne jamais affirmer que les gens utilisent Claude pour créer leur site. Le constat de Louis : beaucoup l'utilisent dans le chat, très peu pour aider leurs visiteurs à décider. Portée : **générale** pour tout contenu sur ce sujet. Script : `exemples/ia-sur-site/fix-v4.mjs`.
