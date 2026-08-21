# Tableau des dépendances — Hero 2

| Élément | React/Next.js | Preview | Dépend de Framer ? | Détail |
|---|---:|---:|---:|---|
| React | ✅ | ✅ | ❌ | React 18+ |
| React DOM | via Next | ✅ | ❌ | Preview uniquement en direct |
| CSS natif | ✅ | ✅ | ❌ | Layout, responsive, hover, animations |
| TypeScript | dev | ✅ | ❌ | Compilation uniquement |
| Vite | ❌ | ✅ | ❌ | Preview uniquement |
| `framer-motion` | ❌ | ❌ | ❌ | Supprimé |
| `_framer-runtime.js` | ❌ | ❌ | ❌ | Supprimé |
| `_responsive-runtime.js` | ❌ | ❌ | ❌ | Supprimé |
| `RichText` | ❌ | ❌ | ❌ | Remplacé par JSX |
| `useVariantState` | ❌ | ❌ | ❌ | Remplacé par media queries CSS |
| `TickerItem` / ticker Framer | ❌ | ❌ | ❌ | CSS `transform` + `linear infinite` à 50 px/s |
| CTA Framer / Link Framer | ❌ | ❌ | ❌ | Liens `<a>` natifs |
| Tooltips avatars Framer | ❌ | ❌ | ❌ | CSS natif |
| SVG Framer | ❌ | ❌ | ❌ | SVG React natifs |
| Player Lottie Framer embarqué | ❌ | ❌ | ❌ | Retiré (~grosse partie du JS original) |
| DotLottie web component | ✅ | ✅ | ❌ | Chargé paresseusement depuis unpkg |
| Lottie disponibilité | ✅ | ✅ | ⚠️ asset CDN Framer | Le JSON visuel est encore hébergé sur `framerusercontent.com` |
| 12 images réalisations | ✅ | ✅ | ⚠️ asset CDN Framer | Le fonctionnement du ticker ne dépend pas de Framer |
| 6 avatars clients | ✅ | ✅ | ⚠️ asset CDN Framer | Images uniquement |
| Avatar CTA | ✅ | ✅ | ⚠️ asset CDN Framer | Image uniquement |
| Inter | ✅ | ✅ | ❌ | Google Fonts dans ce pack |
| Plus Jakarta Sans | ✅ | ✅ | ❌ | Google Fonts dans ce pack |

## Conclusion
Le **fonctionnement** du Hero est indépendant de Framer : aucun runtime, Motion, variant system, ticker Framer ou composant Framer n'est nécessaire.

Il reste uniquement des **assets visuels hébergés sur le CDN Framer** (images + JSON Lottie). Ils peuvent être copiés ensuite dans `/public/hero2/` sans changer la logique ni le design.
