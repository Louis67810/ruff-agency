# Audit — Hero section slug ressource

## Source originale mesurée

| Fichier | Taille |
|---|---:|
| `HeroSectionSlug.js` | 75106 octets |
| `_framer-runtime.js` | 1976925 octets |
| `_responsive-runtime.js` | 4298 octets |
| `LayoutIsland.tsx` | 2780 octets |
| `ResponsiveWrapper.tsx` | 2642 octets |
| **Total JS/TSX audité** | **2061751 octets** |

## Version optimisée

| Fichier | Taille |
|---|---:|
| `HeroSectionSlugRessource.jsx` | 4477 octets |
| `HeroSectionSlugRessource.css` | 7178 octets |
| Réduction du JS source local | **99.78%** |

## Dépendances finales vérifiées

- `react`: requis
- `react-dom`: requis par l'application / la preview
- `framer-motion`: supprimé ; aucune animation d'entrée importante n'était utilisée par le composant final, le hover du breadcrumb est reproduit en CSS
- `_framer-runtime.js`: supprimé
- `_responsive-runtime.js`: supprimé
- `RichText`: supprimé
- `Image` Framer: supprimé
- `SVG` Framer: supprimé
- `useVariantState`: supprimé
- `LayoutGroup`: supprimé
- metadata / property controls Framer: supprimés
- `data-framer-*`: supprimés

## Valeurs source conservées

- fond `rgb(255, 251, 239)`
- padding racine Desktop/Tablet `100px 64px 0`
- padding Phone `100px 24px 0`
- max-width du contenu `1054px`
- breadcrumb à trois niveaux, Inter 500, 18px, tracking `-0.03em`, line-height `146%`
- hover breadcrumb `rgba(0,0,0,0.03)`
- titre Plus Jakarta Sans 700 : 56px / 42px / 32px, tracking `-0.04em`, line-height `1.4em`
- tag Actualités : fond `rgb(255,237,214)`, texte `rgb(148,110,13)`, radius 11, padding `10px 18px`
- date : border 1px `rgba(0,0,0,.12)`, radius 56, padding `14px 20px`, ombre `0 5px 6px -3px rgba(0,0,0,.1)`
- bloc auteur : 238px, padding 16, gap 12, radius 32
- photo auteur : 48px, border 2px blanc, radius 79.76, cinq ombres exactes
- image principale : ratio `1.5080645161290323`, `object-fit: fill`, border 5.84px blanc, radius 32, cinq ombres exactes
- décor gauche : 600x490, left -203, top -189
- décor droit : width 558, right -245, top 88, bottom -14
- SVG décoratifs masqués sur Phone, comme dans le source
- tag et bloc auteur masqués sur Phone, comme dans le source

## Limite réelle de l'export

Les props `photoDeProfil` et `imagePrincipale` sont des images d'instance Framer et leurs fichiers/URLs exacts ne sont pas contenus dans ce ZIP. La version finale les accepte donc via `profilePhoto` et `mainImage` et n'invente aucun asset à leur place.

Les liens du breadcrumb étaient des IDs internes Framer (`augiA20Il`, `N3oetzVX3`, `Deza1U9Kq`) ; ils sont exposés comme `homeHref`, `resourcesHref` et `articleHref` au lieu d'inventer des URLs.
