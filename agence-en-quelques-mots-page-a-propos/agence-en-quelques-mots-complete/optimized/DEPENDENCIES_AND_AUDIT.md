# Dépendances et audit réel

## Source exportée
| Fichier | Octets |
|---|---:|
| `SectionLAgenceEnQuelqueMots.js` | 126,120 |
| `_framer-runtime.js` | 1,976,925 |
| `_responsive-runtime.js` | 4,298 |
| `utils/LayoutIsland.tsx` | 2,780 |
| `utils/ResponsiveWrapper.tsx` | 2,642 |
| **Total JS/TSX audité** | **2,112,765** |

## Version optimisée
| Fichier | Octets |
|---|---:|
| `SectionAgenceEnQuelquesMots.jsx` | 6,575 |
| `SectionAgenceEnQuelquesMots.css` | 7,566 |
| `svgs.js` (SVG source intégrés) | 11,163 |

Réduction du JS composant vs ensemble JS/TSX source audité : **99.69%** (ce chiffre compare le JSX final au code JS/TSX local exporté; React et framer-motion sont des dépendances bundlées séparément).

## Dépendances finales
- React : requis
- React DOM : requis par l’application / la preview
- framer-motion : requis pour les animations texte et hover CTA conservées
- Next.js : non requis
- `_framer-runtime.js` : supprimé
- `_responsive-runtime.js` : supprimé
- Framer RichText/Image/SVG/TickerItem/useVariantState/LayoutGroup : supprimés
- Vite : preview uniquement

## Dépendances réseau conservées
- image centrale Ruff Agency : URL `framerusercontent.com` présente dans le source
- avatar CTA : URL `framerusercontent.com` présente dans le source
- polices Inter / Plus Jakarta Sans : WOFF2 originaux

## Valeurs source reprises
- breakpoints visuels : Phone 0–809, Tablet 810–1399, Desktop ≥1400
- ticker : vitesse 50px/s, gap 10px, cards 342px
- composition Desktop : 1304×986, image 872px, grille 970×756
- cards : radius 26, border 1px rgba(0,0,0,.05), padding 32, gap 12
- CTA : gradient, bordure, ombres, avatar 28×28 et rotation hover 10°
