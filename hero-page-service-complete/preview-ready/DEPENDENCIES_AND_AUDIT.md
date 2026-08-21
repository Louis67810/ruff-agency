# Dépendances et audit — Hero Content optimisé

## Mesures réelles des fichiers

| Élément | Octets | Statut |
|---|---:|---|
| `Hero.js` export Framer | 3 118 052 | remplacé |
| `_framer-runtime.js` | 1 976 925 | supprimé |
| `_responsive-runtime.js` | 4 298 | supprimé |
| `utils/FramerEffects.tsx` | 5 959 | non nécessaire |
| `utils/LayoutIsland.tsx` | 2 780 | non nécessaire |
| `utils/ResponsiveWrapper.tsx` | 2 642 | non nécessaire |
| Nouveau `HeroContent.jsx` | 20 727 | conservé |
| Nouveau `HeroContent.css` | 16 965 | conservé |

- `Hero.js + _framer-runtime.js` : **5 094 977 octets** de source locale avant les dépendances npm.
- Nouveau JSX : **20 727 octets**.
- Réduction de source JS locale sur ce cœur : **99.59 %**.
- En comptant aussi les helpers JS/TSX fournis : **5 110 656 → 20 727 octets (99.59 %)**.

Ces chiffres sont des tailles de fichiers source, pas la taille gzip/Brotli du bundle navigateur. `react`, `framer-motion` et `lottie-web` sont des dépendances npm séparées.

## Dépendances npm finales vérifiées dans le composant

| Dépendance | Requise ? | Usage réel |
|---|---|---|
| `react` | Oui | état, refs, effects et rendu |
| `react-dom` | Hôte/preview | montage React ; non importé par `HeroContent.jsx` |
| `framer-motion` | Oui | Springs des avatars/tooltips/CTA et animations d’entrée explicitement présentes dans l’export |
| `lottie-web` | Oui | import dynamique pour lire le JSON Lottie original des places disponibles |
| Next.js | Non | composant React standard compatible Next.js |
| `_framer-runtime.js` | Non | 0 référence finale |
| `_responsive-runtime.js` | Non | 0 référence finale |
| `RichText` Framer | Non | remplacé par JSX natif |
| `useVariantState` | Non | responsive par CSS + détection minimale Phone pour désactiver les effets qui le sont dans l’export |
| DotLottie player embarqué | Non | supprimé ; le JSON original est conservé |

## Fidélité source → résultat

Les valeurs suivantes sont reprises du React/CSS Framer fourni, et non déduites visuellement :

- variantes `RJSffQxK9` Desktop, `m3crwfXsz` Tablet, `BgL9HDX_p` Phone ;
- breakpoints Phone **0–809 px**, Tablet **810–1399 px**, Desktop **≥ 1400 px** ;
- padding racine desktop `128px 48px 48px`, max-width `1324px`, contenu max `984px` ;
- titre Plus Jakarta Sans 700 : **80 / 56 / 32 px**, tracking `-0.04em`, line-height `1.1`, OpenType `blwf/cv09/cv03/cv04/cv11` ;
- sous-titre Inter 500 : **18 / 18 / 16 px**, tracking `-0.04em`, line-height `1.6` ;
- CTA bleu : gradient, radius, bordure, ombres complètes et hover de l’export ;
- avatar CTA **28×28**, radius 6, ombre, **bordure blanche 1 px**, rotation hover 10° avec Spring ;
- six avatars clients, leurs assets, tooltip 174 px et Spring de hover ;
- animation Lottie : **même JSON Framer** `7Us0KKzHO2n8Jsf36VlImXFCQQ.json` ;
- ticker : gap 16, ordre des 12 réalisations et vitesse calculée à **50 px/s**, valeur de l’export ;
- cartes : desktop **607×405**, tablette 475 px, téléphone 365 px, radius 32, bordure 7 px et `object-fit: fill` comme Framer ;
- SVG décoratifs : paths source, stroke blanc opacity 0.04 et largeur 85.

Le titre conserve aussi la tokenisation **par mot** explicitement demandée par l’effet Framer. Le sous-titre conserve les mêmes états, transition et temporisation ; son moteur interne de tokenisation de lignes Framer n’est pas embarqué.

## Ressources réseau conservées exprès

Pour ne pas remplacer les pixels par des approximations :

- 12 images de réalisations : `framerusercontent.com` ;
- 6 avatars clients : `framerusercontent.com` ;
- avatar CTA : `framerusercontent.com` ;
- JSON Lottie original : `framerusercontent.com` ;
- Inter 500 Latin : WOFF2 original ;
- Plus Jakarta Sans 700 : WOFF2 présent dans l’export.

Le composant est donc indépendant du **runtime Framer**, mais pas 100 % offline.

## Liens internes non inventés

L’export fournit seulement :

- Services : page Framer `Go1pQxwXE`, hash `:SNXdDhe0_` ;
- Réserver un appel : page Framer `XvvJHap2q`.

Ils sont exposés en props `servicesHref` et `callHref`.

## Contrôles automatisés

**41/41 contrôles passent.** Voir `VALIDATION.txt` pour le détail.

Le parsing JSX a été validé avec le parseur TypeScript (`transpileModule`) sur `HeroContent.jsx`, `App.jsx` et `main.jsx`.

### Build Vite

Un vrai `npm install` a été tenté avant livraison. Il n’a pas pu atteindre `registry.npmjs.org` dans l’environnement de génération (`EAI_AGAIN`, échec DNS). Le build Vite n’est donc **pas présenté comme validé**. La preview contient le même `START.bat` robuste que les packs précédents : sur une machine ayant accès à npm, il installe les versions épinglées puis lance Vite avec `--open`.

## Remplacements techniques documentés

Le runtime ticker `withTickerFX` n’est pas conservé. Il est remplacé par un ticker CSS dont la distance réelle de la séquence est mesurée et dont la durée vaut `distance / 50`, afin de conserver les **50 px/s** et le gap 16 de l’export.

Le lecteur DotLottie de plusieurs mégaoctets qui était embarqué directement dans `Hero.js` est supprimé ; `lottie-web` charge le **même JSON Lottie** à la demande. Aucun fallback visuel inventé n’est affiché avant son chargement.
