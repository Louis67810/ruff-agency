# Points de focus — React / Next.js optimisé

## Fichiers
- `PointsFocusOptimized.tsx`
- `PointsFocusOptimized.css`

## Utilisation
```tsx
import PointsFocusOptimized from "./PointsFocusOptimized";

export default function Page() {
  return <PointsFocusOptimized />;
}
```

### Contenu personnalisable
```tsx
<PointsFocusOptimized
  heading="Nos points de focus"
  points={[
    { title: "Titre 1", text: "Description 1" },
    { title: "Titre 2", text: "Description 2" },
  ]}
/>
```

Les valeurs non fournies restent celles de l'export Framer.
