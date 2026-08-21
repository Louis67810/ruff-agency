# Hero Case Study — React optimisé

Cette version est dérivée directement de `Hero.js` fourni dans l’export Framer.

## Utilisation
```jsx
import HeroCaseStudy from "./HeroCaseStudy";
import "./HeroCaseStudy.css";

<HeroCaseStudy
  slug="rentala"
  title="Refonte du design d’un SaaS pour maximiser la crédibilité et la conversion"
  photoDeProfil={{ src: "/auteur.jpg" }}
  nomDeLaPersonne="Louis"
  fonctionDeLaPersonne="Web designer"
  photoDuSite={{ src: "/capture-site.webp" }}
  realisationsHref="/realisations"
  offersHref="/offres"
  callHref="/contact"
/>
```

## Important
`photoDeProfil` et `photoDuSite` sont des **props dans le React Framer original**. Le ZIP ne contient donc pas leurs fichiers/URLs d’instance. La version finale n’invente aucun asset : si une image n’est pas fournie, son cadre reste présent avec un fond neutre de diagnostic.

## Dépendances applicatives
- `react`
- `framer-motion`

Aucun runtime Framer n’est requis.
