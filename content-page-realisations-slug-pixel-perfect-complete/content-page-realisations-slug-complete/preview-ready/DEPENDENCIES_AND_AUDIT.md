# Dépendances et audit — Content page réalisations slug

## Source réellement auditée

| Fichier | Octets |
|---|---:|
| `ContentPageRAlisationsSlug.js` | 3,140,489 |
| `_framer-runtime.js` | 1,976,925 |
| `_responsive-runtime.js` | 4,298 |
| `utils/LayoutIsland.tsx` | 2,780 |
| `utils/FramerEffects.tsx` | 5,959 |
| `utils/ResponsiveWrapper.tsx` | 2,642 |
| **Total JS/TSX local audité** | **5,133,093** |

## Sortie optimisée

| Fichier | Octets |
|---|---:|
| `ContentPageRealisationsSlug.jsx` | 15,013 |
| `ContentPageRealisationsSlug.css` | 11,177 |

Réduction du JS source local par rapport aux fichiers audités : **99.71%**. Ce chiffre ne représente pas le bundle navigateur final : React, `framer-motion` et `lottie-web` sont des dépendances npm séparées.

## Dépendances finales vérifiées dans le composant

| Dépendance | Statut | Raison |
|---|---|---|
| `react` | requis | hooks + rendu |
| `react-dom` | requis par l'application | montage React |
| `framer-motion` | requis | Spring source de la carte auteur + animation de disponibilité + animation line-by-line |
| `lottie-web` 5.12.2 | requis | lecture du JSON Lottie source sans embarquer le lecteur DotLottie exporté |
| Next.js | non requis | composant React standard, compatible Next avec `use client` |
| `_framer-runtime.js` | supprimé | 0 import restant |
| `_responsive-runtime.js` | supprimé | responsive CSS + matchMedia local |
| Framer `RichText` / `Image` / `SVG` | supprimés | HTML/SVG natifs |
| `useVariantState` / `LayoutGroup` | supprimés | états Framer non nécessaires |
| `data-framer-*` | supprimés | 0 dans le JSX final |
| Vite | preview seulement | aucun impact dans le composant final |

## Assets et limites réelles du ZIP

Le fichier Framer est un **composant à props**. Les valeurs exactes d'instance suivantes ne sont pas contenues dans le ZIP : logo, photo de profil, lien public du site, avis réel et photos 1 à 8. Elles sont exposées comme props dans la version optimisée ; aucune fausse image n'est intégrée au composant final.

Les deux mini-captures décoratives du CTA bleu et le JSON Lottie, eux, sont réellement codés en dur dans la source Framer et leurs URLs/srcSet source sont conservés. Les polices utilisent les URLs WOFF2 de la source ; elles ne sont pas copiées dans le ZIP.

Le lien “Réserver un appel” était uniquement l'ID de page Framer `XvvJHap2q`. Il est exposé via `callHref` au lieu d'inventer une URL.

## Responsive source
- Phone: 0–809 px
- Tablet: 810–1399 px
- Desktop: >= 1400 px

## Validation technique

- JSX `ContentPageRealisationsSlug.jsx`, `App.jsx` et `main.jsx` : parsing TypeScript/JSX réussi, 0 erreur de syntaxe.
- `package.json` : JSON valide.
- Tentative réelle de `npm install && npm run build` : l'environnement de génération n'a pas pu résoudre `registry.npmjs.org` (`EAI_AGAIN`) et la commande a expiré avant création de `node_modules`; le build Vite n'est donc **pas présenté comme exécuté avec succès**.
