# Blocs réels du site, à réutiliser tels quels

Ces fichiers contiennent le **HTML rendu des vrais composants** de ruff.agency, extrait de la page d'accueil le 26/10/2026. On ne les redessine jamais (R21, R36) : on les colle dans la page et on relie leurs feuilles de styles d'origine.

| Bloc | Fichier | Styles à relier (depuis `brand/design/pages/`) | Règle |
|---|---|---|---|
| Footer du site (bandeau d'appel + navigation + réseaux + villes) | `site-footer.html` | `../../../components/footer/Footer.css` | R21 |
| Footer du site **sans bandeau d'appel**, pour une page qui a déjà son propre appel final (landing, lead magnet) | `site-footer-sans-cta.html` (généré par `pages/src/footer-sans-cta.mjs`) | `../../../components/footer/Footer.css` | R40 |
| Photos des avis clients (réelles) | `../assets/avis/*` | — | R45 |
| Formes SVG du site (tracés derrière les héros) | `shapes.html` (marqueurs `<!--@SHAPES-->` et `<!--@SHAPES-LIGHT-->` dans `build.mjs`) | classes `.rf-shapes` dans `ruff-tokens.css` | R48 |
| FAQ du site (titre et bouton à gauche, accordéon à droite) | `site-faq.html` | `../../../components/sections/StackSection3/StackSection3.css` | R36 |
| Icônes Heroicons (contour 24 px, plein 24 px) | `heroicons-outline.svg.txt`, `heroicons-solid.svg.txt` | — (des `<symbol>` à coller dans un `<svg>` caché) | R25, R35 |

Ajouter aussi `../../../app/fonts.css` : ces composants utilisent les polices Framer du site.

## Adapter sans redessiner
- **FAQ**
  - Remplacer les questions et réponses à l'intérieur des `<li class="s3-faq-item">`. Garder la structure.
  - Ajouter `is-visible` aux classes `s3-reveal-*` : sinon les éléments restent invisibles hors du site.
  - L'ouverture se fait en ajoutant `is-open` sur le `li` et sur le chevron. Prévoir un petit script, comme dans `pages/blueprint-v2.html`.
- **Footer**
  - Le compteur « places restantes » est rempli par un script sur le site. Dans une maquette, compléter le mois (voir `blueprint-v2.html`).
  - Les liens pointent vers le site : ne pas les modifier.
- **Heroicons**
  - Tracés extraits du paquet `@heroicons/react` du projet par `.claude/skills/ruff-design/scripts/heroicons.mjs`.
  - Pour en ajouter : `node heroicons.mjs <projet> outline Nom1 Nom2` (noms Heroicons sans le suffixe `Icon`).
