# Audit — Hero Réalisations

## Fichiers originaux mesurés

| Fichier | Taille |
|---|---:|
| `HeroCotentPageR.js` | 3 109 707 octets |
| `_framer-runtime.js` | 1 976 925 octets |
| `_responsive-runtime.js` | 4 298 octets |
| `utils/FramerEffects.tsx` | 5 959 octets |
| `utils/LayoutIsland.tsx` | 2 780 octets |
| `utils/ResponsiveWrapper.tsx` | 2 642 octets |
| Total cœur JS/TSX local audité | **5 102 311 octets** |

`HeroCotentPageR.js` est exceptionnellement lourd parce que l'export embarque le lecteur DotLottie dans le fichier lui-même.

## Fichiers optimisés

Les tailles ci-dessous sont mesurées sur les fichiers finaux du pack :

- `HeroRealisations.jsx` : **14 683 octets**
- `HeroRealisations.css` : **14 599 octets**
- JSX + CSS : **29 282 octets**
- aucun runtime Framer local n'est importé.
- réduction du JS source par rapport aux 5 102 311 octets de JS/TSX local audité : **99,71 %**.

## Dépendances applicatives réelles

| Dépendance | Statut | Preuve dans le composant final |
|---|---|---|
| `react` | Requise | import direct, hooks + React.Fragment |
| `framer-motion` | Requise | `motion` + `AnimatePresence` pour les Springs/entrées/hover réellement animés |
| `lottie-web` | Requise | import dynamique pour lire le JSON Lottie original sans réembarquer le player DotLottie de plusieurs Mo |
| `react-dom` | Requise par l'application hôte | pas importée par le composant, utilisée par une app React/Next ou par la preview |
| Next.js | Non requis | composant React standard, simplement compatible Next.js |
| `_framer-runtime.js` | Supprimé | 0 référence finale |
| `_responsive-runtime.js` | Supprimé | 0 référence finale |
| `RichText` Framer | Supprimé | 0 référence finale |
| `useVariantState` | Supprimé | 0 référence finale |
| `LayoutGroup` Framer | Supprimé | 0 référence finale |
| `data-framer-*` | Supprimé | 0 référence finale |
| `tokens.css` | Non requis | aucune variable token utilisée par le composant final |

## Références Framer supprimées — comptage de l'original

Dans `HeroCotentPageR.js` :

- `RichText` : 13 occurrences
- `useVariantState` : 14 occurrences
- `data-framer-` : 48 occurrences
- `LayoutGroup` : 14 occurrences

Dans `HeroRealisations.jsx` : 0 occurrence de chacune de ces références.

## Assets réseau volontairement conservés

Le composant est indépendant du runtime Framer, mais pas offline. Il conserve volontairement les assets source :

- capture réalisation gauche — `framerusercontent.com`
- capture réalisation droite — `framerusercontent.com`
- vidéo MP4 centrale — `framerusercontent.com`
- 6 avatars clients — `framerusercontent.com`
- avatar CTA — `framerusercontent.com`
- JSON Lottie de disponibilité — `framerusercontent.com`
- Inter 500 — WOFF2 original
- Plus Jakarta Sans 700 — WOFF2 original servi via l'URL Fontshare/Framer de l'export

C'est volontaire : remplacer ou recompiler ces fichiers sans les originaux pourrait modifier le rendu.

## Responsive

Le composant source expose trois variantes :

- Desktop — `zxyWVOw1p`
- Tablet — `pAlaKLU0v`
- Phone — `KDtq0un6E`

Les règles typographiques/visuelles embarquées dans le composant source utilisent les plages 0–809, 810–1399 et ≥1400. Le mode autonome `auto` reprend ces plages.

Le ZIP contient aussi des helpers responsive génériques avec d'autres seuils. Ils ne sont pas importés ni reliés automatiquement à `HeroCotentPageR`; ils ont donc été supprimés plutôt que de laisser un deuxième système de breakpoints concurrent.

## Éléments visuels repris depuis la source

- fond `rgb(249, 251, 255)`
- max-width principal 1324 px
- titre 80 / 56 / 32 px
- Plus Jakarta Sans 700, tracking -0.04em, line-height 1.1
- sous-titre Inter 500 18 px, line-height 1.6
- avatars clients, chevauchements, ombres et tooltips
- bouton blanc « Voir nos offres »
- bouton bleu « Réserver un appel », gradient, bordure, longue box-shadow et avatar
- disponibilité dynamique + JSON Lottie original
- deux SVG décoratifs avec paths/strokes originaux
- capture gauche et capture droite avec `srcSet` source et `object-fit: fill`
- vidéo centrale avec le vrai MP4 `srcFile` utilisé par l'export, autoplay/loop/muted/playsInline et `object-fit: cover`
- bordures, radius et ombres des trois médias
- tablette : largeurs 469.9061 / 635 / 466.1188 px
- phone : suppression réelle des deux captures latérales, vidéo seule à 345 px
- animation du titre tokenisée par mot comme la source
- animation du sous-titre tokenisée selon les lignes réellement formées : caractères mesurés par ligne, startDelay 0,6 s puis stagger 0,15 s par ligne, comme le runtime Framer
- animations d'entrée/hover importantes conservées avec Framer Motion au lieu d'une approximation CSS des Springs

## Liens

L'export donne seulement des identifiants internes Framer pour les CTA :

- Voir nos offres : page interne `augiA20Il` + fragment interne `E4FrpMXiu`
- Réserver un appel : `XvvJHap2q`

Aucune URL publique n'a été inventée. Utiliser `offersHref` et `callHref` dans l'intégration finale.

## Validation de la preview

Le JSX du composant, `App.jsx` et `main.jsx` passe le parseur TypeScript en mode syntaxique, et `package.json` est un JSON valide. Une tentative de `npm install && npm run build` a été lancée dans le sandbox, mais l'installation des dépendances a expiré avant la création de `node_modules`; aucun succès de build n'est donc revendiqué dans cet audit.
