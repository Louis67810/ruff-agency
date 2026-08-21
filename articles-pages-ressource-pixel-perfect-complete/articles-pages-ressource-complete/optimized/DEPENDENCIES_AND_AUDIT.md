# Audit — Articles page Ressources

## Poids source audité

| Fichier | Taille |
|---|---:|
| Articles.js | 3 274 599 octets |
| _framer-runtime.js | 1 976 925 octets |
| _responsive-runtime.js | 4 298 octets |
| LayoutIsland.tsx | 2 780 octets |
| FramerEffects.tsx | 5 959 octets |
| ResponsiveWrapper.tsx | 2 642 octets |
| **Total JS/TSX audité** | **5 267 203 octets** |

## Pourquoi `Articles.js` faisait 3,27 Mo

Le fichier embarque directement `@dotlottie/player-component`, Lottie Web et plusieurs morceaux de runtime/CMS. La version optimisée garde la vraie animation Lottie mais la lit avec `lottie-web` comme dépendance normale.

## Dépendances finales

| Dépendance | État | Utilisation |
|---|---|---|
| react | requis | état des filtres + composant |
| react-dom | requis par l’application | montage React |
| framer-motion | requis | animation Spring originale du bloc disponibilités |
| lottie-web | requis | lecture du JSON Lottie original |
| Next.js | non requis | composant React standard |
| _framer-runtime.js | supprimé | 0 import |
| _responsive-runtime.js | supprimé | responsive CSS |
| RichText Framer | supprimé | JSX natif |
| Image Framer | supprimé | img natif |
| SVG Framer | supprimé | SVG natifs |
| useVariantState | supprimé | React + CSS |
| LayoutGroup | supprimé | inutile |
| QueryEngine/CMS runtime | supprimé | données reçues en props |
| data-framer-* | supprimés | aucun nécessaire |
| Vite | preview seulement | non requis dans le site final |

## Données CMS manquantes dans l’export

Le début de `Articles.js` contient un stub vide :

```js
const __FRAMER_CMS_DATA__ = {};
```

Les vraies entrées des Collections Framer ne peuvent donc pas être récupérées depuis ce ZIP. La structure visuelle et les comportements sont reproduits à partir du code source ; les données sont passées via les props `tags` et `articles`.

## Liens internes Framer

- article : page interne `Deza1U9Kq`, hash `:rhewxKQZZ`
- CTA Réserver un appel : page interne `XvvJHap2q`

La version indépendante n’invente pas les URLs publiques. Utiliser `getArticleHref` et `callHref`.

## Validation automatique

- 70/70 contrôles visuels et structurels source → sortie.
- 6/6 contrôles de suppression du runtime Framer.
- JSX parsé avec succès par TypeScript (`tsc`, exit code 0 avec stubs de modules pour la validation syntaxique).
- Taille finale `ArticlesRessource.jsx` : 10 635 octets.
- Taille finale `ArticlesRessource.css` : 12 174 octets.
- Réduction du JS source local audité : environ **99,80 %** (5 267 203 → 10 635 octets, hors poids bundlé de React/framer-motion/lottie-web).
