# Dépendances — Section Points de focus

| Élément | Version optimisée | Dépendance Framer ? | Remarque |
|---|---|---|---|
| React | Oui | Non | React standard |
| React DOM | Preview uniquement | Non | Rendu Vite de test |
| Vite | Preview uniquement | Non | Aucun impact dans Next.js |
| TypeScript | Dev / preview | Non | Aucun runtime |
| CSS natif | Oui | Non | Layout, responsive, animations |
| `framer-motion` | Non | **Non** | Supprimé |
| `_framer-runtime.js` | Non | **Non** | Supprimé |
| `_responsive-runtime.js` | Non | **Non** | Supprimé |
| `RichText` | Non | **Non** | Remplacé par JSX |
| `Instance` Framer | Non | **Non** | Icône remplacée par SVG natif |
| `useVariantState` | Non | **Non** | Remplacé par media queries |
| `MotionDivWithFX` | Non | **Non** | IntersectionObserver + CSS |
| SVG décoratifs | Inline dans le TSX | Non | Aucun fichier externe |
| Smartphone icon | Inline dans le TSX | Non | Aucun module Framer |
| Inter 500 | Oui | **CDN Framer par défaut** | URL exacte de l'export, avec `local()` prioritaire |
| Plus Jakarta Sans 700 | Oui | **CDN Framer par défaut** | URL exacte de l'export, avec `local()` prioritaire |

## Bilan

### Fonctionnement
La section est **100 % indépendante du runtime Framer** : layout, grille, responsive, animations, icônes et SVG fonctionnent sans Framer.

### Seule dépendance Framer restante
Les deux fichiers de police exacts de l'export sont encore référencés sur `framerusercontent.com` afin de préserver la typographie au plus proche de l'original.

Pour arriver à **zéro requête Framer absolue**, copie ces deux WOFF2 dans ton `/public` puis remplace simplement les deux URLs dans les `@font-face` du CSS. Aucun autre changement n'est nécessaire.
