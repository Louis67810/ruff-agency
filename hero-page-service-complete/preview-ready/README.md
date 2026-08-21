# Hero Content — React optimisé

Version optimisée **directement à partir du React Framer fourni**, sans redessiner la section à partir d’une interprétation visuelle.

## Utilisation React / Next.js

```jsx
import HeroContent from "./HeroContent";

export default function Page() {
  return (
    <HeroContent
      servicesHref="/services"
      callHref="/contact"
    />
  );
}
```

`HeroContent.jsx` importe directement `HeroContent.css`.

## Dépendances npm applicatives

```bash
npm install react react-dom framer-motion lottie-web
```

- `react` : composant et états.
- `framer-motion` : uniquement les animations dynamiques dont les Springs/timings sont explicitement présents dans l’export.
- `lottie-web` : chargé dynamiquement pour lire le JSON Lottie original sans conserver le player DotLottie embarqué dans `Hero.js`.

## Liens

L’export ne donne pas les URLs publiques des deux CTA. Il donne seulement :

- Voir nos services → page Framer interne `Go1pQxwXE`, hash `:SNXdDhe0_`
- Réserver un appel → page Framer interne `XvvJHap2q`

Le composant les expose donc comme `servicesHref` et `callHref` sans inventer de destination.

## Responsive réellement présent dans l’export

- Phone : 0–809 px
- Tablet : 810–1399 px
- Desktop : ≥ 1400 px

Le mode par défaut est `variant="auto"`. Les trois variantes Framer peuvent aussi être forcées via leur nom ou leur ID original.
