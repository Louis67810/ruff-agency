# Section Bénéfices 2 — React / Next.js

## Fichiers
- `Benefices2Optimized.tsx`
- `Benefices2Optimized.css`

## Exemple
```tsx
import Benefices2Optimized from "@/components/Benefices2Optimized";

export default function Page() {
  return (
    <Benefices2Optimized
      bookingHref="/contact"
      landingPageHref="/landing-page"
      siteInternetHref="/site-internet"
      developpementWebHref="/developpement-web"
    />
  );
}
```

Le composant ne dépend pas du runtime Framer ni de framer-motion.
Les props `avatarSrc` et `videoSrc` permettent de remplacer facilement les deux assets Framer par des fichiers dans `/public`.
