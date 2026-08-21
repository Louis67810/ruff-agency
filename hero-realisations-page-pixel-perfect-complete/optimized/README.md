# Hero Réalisations — React optimisé

Version allégée du composant Framer `HeroCotentPageR`.

## Installation

```bash
npm install react react-dom framer-motion lottie-web
```

## Utilisation

```jsx
import HeroRealisations from "./HeroRealisations";

export default function Page() {
  return (
    <HeroRealisations
      offersHref="/services"
      callHref="/contact"
    />
  );
}
```

Le composant accepte `variant="auto" | "Desktop" | "Tablet" | "Phone"` ainsi que les IDs Framer originaux.

En mode `auto`, les plages retenues sont celles des règles visuelles du composant exporté :
- Phone : 0–809 px
- Tablet : 810–1399 px
- Desktop : 1400 px et plus

## Important

Les deux destinations CTA n'étaient pas exportées sous forme d'URLs publiques : elles étaient des IDs internes Framer. Elles sont donc exposées via `offersHref` et `callHref` au lieu d'inventer une URL.

Les images, la vidéo, les polices et le JSON Lottie restent servis depuis leurs URLs originales Framer afin de ne pas modifier les assets visuels.

### Animation de texte
Le titre reprend la tokenisation par mot. Le sous-titre reprend aussi le comportement `tokenization: "line"` du runtime Framer : les caractères sont mesurés selon leur ligne réelle après wrapping, puis chaque ligne reçoit le délai source (0,6 s + 0,15 s par ligne).
