# Hero 2 — React / Next.js optimisé

## Installation
Copie `Hero2Optimized.tsx` et `Hero2Optimized.css` dans ton projet.

```tsx
import Hero2Optimized from "@/components/Hero2Optimized";

export default function Page() {
  return (
    <Hero2Optimized
      realisationsHref="/realisations"
      bookingHref="/contact"
    />
  );
}
```

Le composant est un Client Component uniquement parce qu'il calcule le mois / nombre de places et charge le petit player Lottie. Tout le layout, responsive, ticker et les animations sont en CSS natif.
