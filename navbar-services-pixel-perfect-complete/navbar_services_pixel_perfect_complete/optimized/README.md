# NavBar optimisée — Services pixel-perfect V2

Cette version remplace uniquement la partie **Services desktop** de la navbar précédente par une implémentation basée directement sur :

- `NavBar.js` exporté depuis Framer ;
- le nouveau `TextHover.js` fourni séparément.

## Dépendances d'intégration

```bash
npm install framer-motion
```

Puis importe :

```jsx
import NavBar from "./NavBar.jsx";
import "./tokens.css";
import "./NavBar.css";
```

Le composant ne dépend plus du runtime JavaScript Framer. `framer-motion` est volontairement conservé uniquement pour les animations Spring du mega-menu Services et des miniatures, parce que l'export source utilise réellement cette dépendance pour ces comportements.

Les URLs internes Framer restent exposées en props (`servicesHref`, `landingHref`, `websiteHref`, `developmentHref`, `allServicesHref`, etc.) afin de ne pas inventer de routes.
