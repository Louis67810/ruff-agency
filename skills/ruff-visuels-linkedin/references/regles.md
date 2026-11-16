# Règles et préférences — visuels LinkedIn de Louis

Statuts : **Règle** = Louis l'a demandé, elle prime sur les anciens posts. **Préférence** = goût fréquent, à appliquer par défaut sans en faire une obligation. **Observation** = vu dans le corpus, à confirmer. **Ambigu** = ne pas trancher seul.

## Identité

- Règle : marque **Ruff Agency**. Signature : PP photo ronde + « Louis Staub » + « J'optimise le taux de conversion de ta landing page ». L'ancien avatar illustré « Louis @Ruff agency » n'est plus la signature par défaut.
- Observation : logo RUFF + « Agency » en haut au centre ; bouton « Swipe » en bas à droite.

## Texte

- Règle : jamais de texte éditorial tout en majuscules (« ÉTAPE N°1 », « VRAIMENT » du corpus → casse normale). Exceptions : démonstration, erreur ou exclamation à l'intérieur d'une illustration.
- Règle : un cartouche blanc de titre ou de label tient sur une seule ligne.
- Règle : couverture limitée à deux rangées de cartouches ; complément éventuel en texte noir centré, sans boîte, juste dessous.
- Règle typographique (technique) : espace insécable avant « ? », « ! », « : » et à l'intérieur des guillemets « », pour qu'aucune ponctuation ne se retrouve seule en début de ligne.
- Un bloc d'étape bleu peut passer sur deux lignes (corpus : « Noter tous les problèmes du site précédent ») ; il ne doit jamais sortir de la zone entre les bandelettes.
- Observation : Plus Jakarta Sans Bold pour l'éditorial ; Inter pour chiffres, boutons et nom ; Eudoxus Sans pour « Agency ».

## Couleurs et thèmes

- Règle : rouge pour un problème / une erreur / un angle négatif ; bleu pour des astuces / un angle positif ; cohérence sur tous les points.
- Règle : « Pourquoi ? » est toujours un cartouche blanc, texte sombre (le corpus ancien le montre en bleu : obsolète).
- Observation : thème or pour les « règles d'or ». Dans une étude de cas ou un comparatif, la couleur suit la section (problèmes rouges, solutions bleues).

## Composants

- Règle : **tous les boutons** d'une illustration (Continuer, Envoyer, Réserver…) reprennent le CTA source `5406:2442`, cloné et mis à l'échelle — jamais reconstruit. Exception : montrer volontairement un mauvais CTA.
- Règle : les **pilules noires** avec capsule flèche (CTA de couverture, « Voici comment… ») sont toujours ajustées à leur texte et centrées, jamais sur toute la largeur.
- Règle : **checks et croix** sources uniquement, proportionnés à l'objet jugé (≈ 30 px pour une carte de 200-300 px ; la taille source est trop grande), accrochés à son coin en léger débordement, ratio préservé.
- Règle : dans une illustration, **pas de pastille bleue en dégradé**. Les annotations utilisent le **tag blanc** source `5406:6679`.
- Règle : ce tag reste **petit** (texte ≈ 10 px, `kit.tag` avec s ≈ 1) et se place **au coin supérieur droit** de l'élément qu'il qualifie, en léger débordement sur les deux bords, comme un badge. Pas au milieu de l'élément.
- Règle : le **cadre de sélection** bleu s'emploie presque uniquement en couverture, pour évoquer l'édition d'une page. Jamais au milieu d'une explication où il n'a pas de sens.
- Règle : touches numérotées sources, numéro centré géométriquement.

## Illustration

- Règle : chaque illustration rend visible le message de sa slide ; ne pas répéter automatiquement la même scène.
- Règle : la **main** reste opaque, au premier plan, **bien visible** (environ 4/5 de la silhouette) et plutôt vers le centre ; jamais juste un bout qui dépasse du bord.
- Préférence : pour un **empilement**, trois éléments plutôt que deux, avec des écarts serrés ; le premier couvre davantage, on voit moins l'empilement.
- Règle : une **flèche** relie un point A précis à un point B précis ; sa courbure et son sens se décident pour le trajet (vérifier au rendu).
- Règle : **fondu** de la couleur du fond, seulement quand l'illustration touche le bas ; sous les bandelettes latérales.
- Règle : site générique → archétype de landing page ; cas nommé → capture réelle.
- Règle : l'archétype de landing page suit la **template de site de Louis** (`5424:3826`, voir banque) : carte blanche, titres en vrai texte Plus Jakarta Bold #0D1E26, texte en barres grises #E8E8E8, boutons en pilules #383838 **sans libellé**, images #F3F3F3, bandeaux #FBFBFB, pas de fond bleu. Dans ce squelette, les boutons restent des pilules sombres (la règle « CTA source » vaut pour un bouton avec libellé montré pour lui-même). On ne garde en vrai texte ou en composant que ce qu'une annotation désigne.
- Observation : un tag est secondaire ; souvent tenu par la main ou accroché au bord de l'élément qu'il nomme.

## Étude de cas sur un site réel

- Règle : l'étape « structure / architecture » tient en **une slide** : la page dessinée avec la template de site, chaque section nommée et expliquée dans un tag blanc relié à sa zone. Pas une slide par section.
- Règle : les points de « Pourquoi ça marche » sont numérotés et illustrés chacun par une **capture réelle** du site.
- Règle : les captures viennent du vrai site (outils `capture-sections.mjs`), sans contenu provisoire (Lorem ipsum) ni chiffres du client présentés comme des résultats de Louis.

## Transformation progressive (avant → après)

- Règle : captures au format du corpus (≈ 426 × 256), assez grandes pour lire le site ; jamais de bande basse et large.
- Règle : slide de transition = modèle 5406:5609 (deux captures empilées, étiquette bleue en bas à droite, flèche bleue source à gauche).
- Règle : chaque état intermédiaire ne change que ce que l'étape annonce ; le reste (polices, couleurs, style) reste celui de la version précédente.
- Règle : les tags d'annotation vont sous le texte, pas sur la capture.

## Structure de rétention (carrousels « X stratégies »)

- Préférence forte (R23) : hook, puis interruption (ex. « Attends une seconde » + ce que le lecteur croit savoir), enjeu (liste courte de cartouches), deuxième hook avec teasing, une slide par stratégie, offre. Sommaire numéroté et slide « Merci d'avoir lu » : facultatifs, Louis les a retirés sur « IA sur ton site ».
- Préférence forte : une idée par slide, peu de texte (une phrase sous l'illustration), un exemple visuel partout.
- Préférence forte : la meilleure stratégie arrive en dernier et elle est annoncée à l'avance (teasing dans le deuxième hook).

## Reproduire une référence externe

- Règle : quand Louis envoie une image (infographie, post d'un autre créateur) comme référence, on en reproduit la structure et **tout** le contenu, traduits en français, avec ses composants et son style. On ne la transforme pas en résumé ni en mémo inventé. Les chiffres de la référence restent ceux de la référence (jamais présentés comme des résultats de Louis).

## Ambiguïtés ouvertes

- Arrondi des cartouches : ratio « Le déclic » (≈ 0,33 × hauteur) demandé autrefois, mais le corpus mesure ≈ 0,18-0,27. Les clones gardent les rayons sources en attendant Louis.
- Check bleu (série « règles d'or ») ou check vert récent pour un thème or ?
- Slide Offre (prix 1240 €, « +25 clients satisfaits ») : à faire confirmer par Louis avant publication.
