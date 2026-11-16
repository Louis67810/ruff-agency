---
name: rendu-iso
description: Génère des rendus web animés en isométrie, version claire (light mode) avec des lumières bleues, pour illustrer le métier d'un client sur son site (électricien, bureau d'études électricité, solaire, borne de recharge, pompe à chaleur, domotique, ou tout autre domaine). Le rendu est une scène 3D isométrique en SVG, blanche et détaillée, où l'énergie circule en néon bleu le long de câbles, où les appareils s'allument étape par étape, avec une barre d'étapes (ex. Produire / Convertir / Utiliser) et une boucle d'animation. Livre une page HTML autonome et un bloc à coller dans n'importe quel site (Webflow, Framer, WordPress, iframe). À utiliser dès que Louis demande un « rendu iso », une « illustration animée isométrique », « comme le rendu de la maison solaire », « une scène qui montre le métier du client », ou veut transformer une image isométrique de référence en rendu web animé, même s'il ne dit pas « isométrique ».
license: MIT (moteur dérivé du skill Anatomy de wheresryan22, voir LICENSE)
---

# Rendu iso

Ce skill fabrique des **rendus web animés** : une scène isométrique blanche, très détaillée, dans laquelle de l'électricité bleue circule et allume les choses, étape après étape. Exemple de référence : une maison avec panneaux solaires sur le toit, un onduleur au mur et une voiture qui charge à la borne.

Ce n'est pas un outil pédagogique (pas de « Fig 1 », de légende ou de valeur à mesurer) : c'est une **illustration de site** qui montre le métier du client et donne envie. Le moteur de dessin vient du skill Anatomy (solides ombrés, ordre de peinture, détails précis), sa rigueur de dessin reste la règle.

Deux exemples complets à ouvrir avant de commencer :

- `examples/maison-solaire/build.mjs` : maison, panneaux, onduleur, borne, voiture, intérieur visible à travers les baies. Trois étapes : Produire, Convertir, Utiliser.
- `examples/tableau-electrique/build.mjs` : local technique en coupe, compteur, disjoncteur de branchement, tableau dont les disjoncteurs basculent un à un, puis prises, applique, unité de PAC et ballon d'eau chaude. Trois étapes : Raccorder, Protéger, Distribuer.

Construire : `node examples/<nom>/build.mjs --out <dossier>` écrit `<nom>.html` (page d'aperçu) et `<nom>.embed.html` (bloc à intégrer).

## L'idée qui compte

**La scène raconte le métier par le trajet de l'énergie.** Un rendu réussi se lit en trois secondes : d'où vient l'énergie, par où elle passe, ce qu'elle fait au bout. Choisis un lieu réel du client (une maison, un local technique, un parking, un bâtiment tertiaire, une usine, un toit) et fais-y passer un ou plusieurs circuits bleus qui s'allument dans l'ordre.

| Domaine du client | Scène | Étapes |
|---|---|---|
| Photovoltaïque | Maison, panneaux, onduleur, batterie, borne | Produire, Convertir, Utiliser |
| Électricien généraliste, rénovation | Local technique en coupe, compteur, tableau | Raccorder, Protéger, Distribuer |
| Bornes de recharge (IRVE) | Parking ou garage, tableau, bornes, voitures | Alimenter, Piloter, Recharger |
| Pompe à chaleur, CVC | Maison en coupe, unité extérieure, unité intérieure, ballon | Capter, Chauffer, Diffuser |
| Domotique, courant faible | Pièce de vie, box, interrupteurs, éclairage, volets | Connecter, Programmer, Piloter |
| Bureau d'études, tertiaire | Bâtiment en coupe, TGBT, tableaux d'étage, éclairage | Concevoir, Distribuer, Superviser |
| Industrie | Atelier, transformateur, armoire, machines | Alimenter, Protéger, Produire |

Tout autre métier marche de la même façon : trouve l'objet ou le lieu qui fait le travail, puis ce qui « circule » (électricité, eau, données, air) et teins-le en accent bleu.

Deux pièges vus en pratique :
- **Trop vide** : un bâtiment lisse avec une ligne bleue. Ajoute les vraies pièces : appuis de fenêtre, acrotères, joints, vis, grilles, poignées, mobilier visible à travers le vitrage.
- **Trop chargé** : des lignes bleues partout. Il y a **un** trajet principal par étape, et le reste de la scène reste blanc.

## Le style (ne pas dévier)

Détails et raisons dans `references/rendu.md`. En bref :

- **Clair.** Fond blanc cassé en dégradé radial, volumes blancs, ombres froides gris-bleu (`--anatomy-shade-*`), traits fins gris. Jamais de mode sombre, sauf demande explicite.
- **Un seul accent : le bleu** (`palette: "bleu"`). Il ne sert qu'à ce qui est sous tension ou allumé : câbles actifs, LED, écrans, faisceaux de lumière, panneaux qui produisent. Autres palettes disponibles si le client a une autre couleur de marque : `cyan`, `vert`, `ambre`, ou un objet `{ a900 … a50 }`.
- **Néon dans un fourreau.** Un câble au repos est un fourreau blanc (`nrg-bed`). Sous tension, un trait bleu se dessine de la source vers l'usage (`stroke-dashoffset`), avec un halo diffus, un cœur pâle et des impulsions blanches qui avancent dans le sens du courant.
- **Isométrie 45° / 30°**, caméra par défaut. Les murs visibles sont x = max (en bas à droite) et y = max (en bas à gauche). Une coupe (pièce ouverte) montre au contraire les murs du fond x = min et y = min.
- **Volume et détail** comme Anatomy : solides remplis, quatre tons par orientation, halos doux sous les objets, chaque ligne se termine sur quelque chose.
- **Mouvement calme.** Fondus de 0,9 à 1,2 s, tracés de câbles de 0,5 à 2 s, légers décalages entre éléments (cascade). Rien ne clignote ni ne saute.

## Méthode

1. **Le brief en une phrase** : « On voit [lieu], l'énergie part de [source], passe par [équipements] et alimente [usages]. » Écris ensuite les 2 à 4 étapes (titre de 1 à 2 mots, sous-titre de 3 à 7 mots), dans la langue du site.
2. **La liste des pièces** (au moins 40), groupées : sol et socle, bâtiment ou coque, équipements (onduleur, tableau, borne, compteur…), usages (voiture, lampes, prises, chauffage), mobilier et détails (fenêtres, acrotères, joints, vis, plantes, outils). Repars de `kit/elec.mjs` : beaucoup existent déjà.
3. **Le plan du monde** : unités ≈ 1 cm (pièce) ou ≈ 6 cm (maison), x et y au sol, z vers le haut. Place tout en rectangles `{x, y, w, d, r}`. Cadre avec `fitProjection(points, 1200, 760, { pad: 40 })`.
4. **Le trajet de l'énergie** : pour chaque étape, des polylignes 3D qui longent la structure (murs, sol, toit), jamais en diagonale dans le vide. Chaque trajet commence et finit sur un appareil (le point d'arrivée est sur sa face ou son dessus).
5. **Construire** en copiant l'exemple le plus proche : `R.scope(id)`, `R.defsSvg()` en premier dans le corps, puis peindre **du fond vers l'avant** (voir « Ordre de peinture »). Les objets qui s'allument reçoivent `step` et `delay`.
6. **Vérifier en regardant** (`references/verify.md` pour les scripts) :
   - `node scripts/capture.mjs <page>.html --select .rendu --out shots/r.png --scale 1 --wait 600 --times 2500,6000,11000` : une image par étape. Lis chaque PNG.
   - Zooms à 2× sur chaque zone dense (`--zoom x,y,w,h --zoom-scale 2`), et une capture téléphone (`--width 390`).
   - Questions à se poser : la scène se lit-elle tout de suite comme un lieu réel ? Chaque étape allume-t-elle clairement autre chose ? Un câble passe-t-il devant un objet qui devrait le cacher ? Une zone est-elle vide ou plate à 2× ? Le bleu est-il réservé à ce qui est actif ?
   - Corrige et recommence jusqu'à ce que tout soit oui.
7. **Livrer** : la page `.html` pour l'aperçu, le `.embed.html` pour le site, et dis où coller le bloc (`references/integration.md`).

## Ordre de peinture

Le SVG peint dans l'ordre d'écriture, donc l'ordre est la profondeur :

1. halo du sol, sol, allée, socle ;
2. volumes du fond (annexes côté x min / y min), puis le volume principal ;
3. ce qui est sur les faces visibles (fenêtres avec l'intérieur découpé dedans, bandeaux, descentes d'eau) ;
4. toit : acrotères du fond, objets du toit, panneaux (rangée du fond, câbles entre les rangées, rangée de devant), acrotères de devant ;
5. câbles posés sur les murs, puis les boîtiers qu'ils rejoignent (le câble arrive sur le dessus du boîtier) ;
6. objets au sol du fond vers l'avant, triés avec `k.depthOf` ;
7. câbles qui partent d'un objet vers un objet plus proche (cordon de recharge), flux d'air, rayons.

Un câble qui passe derrière un objet est dessiné **avant** cet objet. S'il passe derrière puis devant, coupe-le en deux `energySvg` qui s'enchaînent (le `delay` du second = `delay + dur` du premier).

**Vu à travers une baie** (face y = Y), un point intérieur (x, y) s'aligne sur le point de façade x0 = x − y + Y. Place donc le mobilier à gauche de l'ouverture et garde la pièce peu profonde (mur du fond 30 à 45 unités derrière). Même logique sur une face x : y0 = y − x + X.

## Le kit

| Fichier | Rôle |
|---|---|
| `kit/iso-kit.mjs` | Moteur Anatomy : caméra, solides (`slabOf`, `cylinder`, `extrude`), lignes sur faces, `solidSvg`, `lineSvg`, `dotsSvg`, `figureSvg`. API complète : `references/kit.md`. |
| `kit/lathe.mjs` | Pièces de révolution sur n'importe quel axe (`disc`, `lathe`, `sphereOf`, `prismOf`, `arcOf`, `fillet`). |
| `kit/tube.mjs` | Tuyaux et gaines en volume (`tubePieces`, `tubeSvg`) quand un conduit doit avoir de l'épaisseur. |
| `kit/rendu.mjs` | **La couche rendu web.** Palette et CSS clair (`RENDU_CSS`, `PALETTES`), `scope(id)`, `defsSvg()`, `energySvg(points3, P, opts)`, `litSvg`, `moveSvg`, `ledSvg`, `poolSvg`, `wallGlowSvg`, `windowSvg`, `quad`, `wallPt`, `poly3`, le runtime de la timeline et les sorties `renderHtml` / `pageHtml`. |
| `kit/elec.mjs` | **Pièces du métier**, prêtes à poser : `solarPanel`, `wallBox` (onduleur, compteur, coffret, sur face x ou y), `evCharger`, `car`, `breakerRow`, `socket`, `lightSwitch`, `wallLamp`, `splitUnit`, `waterHeater`, `floorLamp`, `table`, `chair`, `sideboard`, `faceRect`, `faceLines`. |
| `kit/audit.mjs`, `kit/gl.mjs` | Optionnels, hérités d'Anatomy : audit géométrique des tuyaux, couche WebGL (lumière réaliste, eau). Rarement utiles ici. |
| `scripts/capture.mjs`, `scripts/drive.mjs`, `scripts/lines.mjs` | Captures headless Chrome, séquences, contrôle des fins de lignes. |

### `energySvg` en détail

```js
R.energySvg(points3, P, {
  step: 0,        // étape qui l'allume
  delay: 0.7,     // secondes après le début de l'étape
  dur: 1.4,       // durée du tracé de la source à l'usage
  width: 1.5,     // 0.6 flux d'air, 1 à 1.2 circuit, 1.5 à 1.8 alimentation principale
  radius: 4,      // rayon des coudes (unités monde), 0 pour des angles vifs
  ends: "to",     // pastilles aux extrémités : "both" | "from" | "to" | "none"
  bed: true,      // fourreau blanc visible au repos (false pour un flux d'air)
  speed: 1.1,     // période des impulsions (s)
  only: false,    // true : allumé seulement pendant son étape
})
```

L'ordre des points est le sens du courant. Les longueurs sont mesurées à la construction, tout est en CSS : pas de JavaScript par image.

### La timeline

Tout élément avec `data-step="n"` reçoit `data-on` à partir de l'étape n (ou seulement pendant n avec `data-only`). Le runtime enchaîne : étape 0 → 1 → … → dernière (tenue) → repos (tout s'éteint) → reprise. Il se met en pause hors écran, s'arrête sur l'état final avec `prefers-reduced-motion`, et un clic sur une étape s'y place puis relance la boucle après 9 s. Réglages : `hold` (ms) par étape dans `steps`, `rest` et `resume` dans `renderHtml`.

Classes animées disponibles : `.nrg` (câble), `.r-lit` (apparaît), `.r-dim` (disparaît), `.r-led`, `.r-bar`, `.r-panel`, `.r-panel-cells`, `.r-sweep` (reflet qui balaie un panneau), `.r-move` (glisse d'un vecteur monde via `moveSvg` : levier de disjoncteur, prise, porte).

## Livrables

- `renderHtml({ id, svg, steps, title, bg: "card" | "none", palette, caption })` produit **un seul bloc** `<div class="rendu">` avec son `<style>` et son `<script>` : à coller tel quel dans un embed HTML. `caption: false` retire titre et étapes (illustration seule). `bg: "none"` donne un fond transparent pour un site qui a déjà son fond.
- `pageHtml({ title, render })` l'enveloppe dans une page autonome (police Jost) : aperçu, iframe, capture.
- Plusieurs rendus sur une même page : donne à chacun un `id` différent (tous les identifiants SVG sont préfixés par `scope(id)`).
- Poids typique : 190 à 260 Ko non compressé, environ 30 à 40 Ko en gzip. Aucune dépendance externe hormis la police de la page d'aperçu.

## Références

- `references/rendu.md` : le style en détail (palette, tons, néon, lumières, vitrages, intérieurs, voitures, rythme), les recettes de scènes par métier et les défauts déjà rencontrés.
- `references/integration.md` : coller le rendu dans Webflow, Framer, WordPress, Shopify, en iframe ou en React, et l'adapter (couleur, taille, sans légende).
- `references/craft.md`, `references/kit.md`, `references/motion.md`, `references/verify.md`, `references/webgl.md` : les références d'origine d'Anatomy pour le moteur (pièces, ordre de peinture, API, vérification). Les parties sur la carte « Fig n », la légende et la valeur mesurée ne s'appliquent pas ici : le cadre est remplacé par `renderHtml`.
