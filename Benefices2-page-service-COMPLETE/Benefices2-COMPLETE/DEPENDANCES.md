# Tableau des dépendances — Section Bénéfices 2

| Élément | Version Next.js | Preview | Dépend de Framer ? | État |
|---|---:|---:|---:|---|
| React | ✅ | ✅ 18.3.1 | ❌ | Nécessaire |
| React DOM | via Next | ✅ 18.3.1 | ❌ | Preview uniquement |
| TypeScript | dev | ✅ 5.6.3 | ❌ | Dev uniquement |
| Vite | ❌ | ✅ 5.4.10 | ❌ | Preview uniquement |
| HTML/CSS natif | ✅ | ✅ | ❌ | Principal moteur du rendu |
| `framer-motion` | ❌ | ❌ | ❌ | **Supprimé** |
| `_framer-runtime.js` | ❌ | ❌ | ❌ | **Supprimé** |
| `_responsive-runtime.js` | ❌ | ❌ | ❌ | **Supprimé** |
| `RichText` Framer | ❌ | ❌ | ❌ | Remplacé par JSX |
| `useVariantState` | ❌ | ❌ | ❌ | Remplacé par media queries |
| `ResolveLinks` / router Framer | ❌ | ❌ | ❌ | Remplacé par props `href` |
| composant `Video` Framer | ❌ | ❌ | ❌ | Remplacé par `<video>` natif |
| CTA Framer | ❌ | ❌ | ❌ | Recréé en HTML/CSS à partir des valeurs exportées |
| Services Framer | ❌ | ❌ | ❌ | JSX + CSS |
| Image avatar du CTA | ✅ | ✅ | ⚠️ URL CDN Framer | Asset seulement |
| Vidéo principale | ✅ | ✅ | ⚠️ URL CDN Framer | Asset seulement |

## Dépendance Framer restante

Le fonctionnement de la section est indépendant de Framer. Il reste uniquement 2 fichiers média chargés depuis `framerusercontent.com` par défaut :

1. Avatar du CTA : `2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg`
2. Vidéo : `DGCBKS0bAT9vQ3hBqQNayQ1oOxE.mp4`

Pour arriver à **zéro requête Framer**, place les mêmes fichiers dans `/public`, par exemple :

```tsx
<Benefices2Optimized
  avatarSrc="/benefices2/louis.jpg"
  videoSrc="/benefices2/services.mp4"
/>
```

À partir de là, Framer n'intervient plus du tout, même pour les médias.
