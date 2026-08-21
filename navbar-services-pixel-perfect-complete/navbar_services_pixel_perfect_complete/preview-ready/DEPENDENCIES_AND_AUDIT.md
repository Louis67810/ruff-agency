# Audit réel — Navbar Services Pixel Perfect V2

## Périmètre

La modification est limitée au bouton **Services** desktop et au mega-menu qu'il ouvre. Le reste de la navbar optimisée précédente est volontairement conservé.

Sources utilisées : `NavBar.js` original (216695 octets), `TextHover.js` fourni (15493 octets), `_framer-runtime.js` original (1976925 octets) et `_responsive-runtime.js` original (4298 octets).

## Corrections prouvées dans le code source Framer

| Élément | Valeur / comportement source conservé |
|---|---|
| Bouton Services | hauteur 40 px, gap 6 px, padding `20px 12px 20px 18px`, radius 8 px |
| Chevron | tracé exact `M 0 0 L 6 6 L 12 0`, rotation 180° à l'ouverture |
| Tween TextHover | 0,3 s ; état ouvert/chevron 0,5 s ; easing `[0.44,0,0.56,1]` |
| Position popup | bas, centré, offset vertical 40 px |
| Animation popup | `opacity 0 → 1`, `y -25 → 0`, Spring `bounce: 0.2`, `duration: 0.4` |
| Panneau | max-width 1054 px, hauteur 646 px, radius 47 px |
| Colonne droite | 51 %, padding 24 px, gap 10 px |
| Visuel gauche | wrapper `height:588px; left:-202px; right:-239px; bottom:-216px` |
| Fit visuel | `fill`, et non `cover` |
| Décorations | SVG haut + SVG bas + SVG supplémentaire de la variante sombre |
| CTA | vrai bouton bleu « Voir tous nos services », shell blanc à 9 %, gradient/ombres source |
| Groupe miniatures | 113 × 61 px |
| Miniatures | 43 × 43 px, radius 11,96 px, bordure blanche 2,111158609390259 px |
| Rotations repos | 0°, 13°, -6° |
| Rotations hover | -13°, -7°, 12° |
| Titre cartes | Inter 600, 20 px, tracking -0,03em, line-height 146 % |
| Ordre sombre | Landing Page → Site Internet → Développement Web |

## Dépendances finales

| Dépendance | Statut | Usage réel |
|---|---|---|
| `react` | ✅ Requise | composant et états |
| `react-dom` | ✅ App/preview | montage React |
| `framer-motion` | ✅ **Requise volontairement** | `AnimatePresence` + Springs du popup et des miniatures |
| Next.js | ❌ Non requis | React standard, compatible Next.js |
| `_framer-runtime.js` | ❌ Supprimé | 0 import |
| `_responsive-runtime.js` | ❌ Supprimé | 0 import |
| `RichText` Framer | ❌ Supprimé | 0 référence |
| `useVariantState` | ❌ Supprimé | 0 référence |
| `data-framer-*` JSX | ❌ Supprimé | 0 occurrence |
| Vite | ⚠️ Preview uniquement | serveur local |
| `@vitejs/plugin-react` | ❌ Non utilisé | pas nécessaire |

### Pourquoi `framer-motion` est réintroduit

La première optimisation l'avait supprimé. Cette version le réintroduit uniquement pour les comportements où le code source original utilise réellement des Springs. C'est volontaire : ici la priorité est la fidélité de l'animation du menu Services. Le runtime Framer de 1976925 octets reste supprimé.

Le ZIP de preview fixe `framer-motion` à `12.43.0`. L'export Framer fourni déclare lui-même `framer-motion >=10.0.0` comme peer dependency.

## Poids local mesuré

| Élément | Taille |
|---|---:|
| `NavBar.js` original + deux runtimes locaux | 2197918 octets |
| Nouveau `NavBar.jsx` | 26619 octets |
| Nouveau `NavBar.css` | 39480 octets |
| Réduction du JS **source local** | **98.79 %** |

Cette mesure ne présente pas le futur bundle navigateur comme faisant 26619 octets : React et Framer Motion restent des packages npm externes qui seront bundlés par le projet.

## Assets et liens

Les images et certaines polices gardent leurs URLs originales afin de ne pas substituer les assets. Le composant est indépendant du **runtime Framer**, mais pas 100 % offline. Les routes internes Framer restent exposées en props ; aucune URL publique n'est inventée.
