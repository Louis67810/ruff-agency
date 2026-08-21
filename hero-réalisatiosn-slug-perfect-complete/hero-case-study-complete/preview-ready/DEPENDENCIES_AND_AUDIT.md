# Audit réel des dépendances — Hero Case Study

## Taille de l’export source
| Fichier | Octets |
|---|---:|
| Hero.js | 83960 |
| _framer-runtime.js | 1976925 |
| _responsive-runtime.js | 4298 |
| utils/LayoutIsland.tsx | 2780 |
| utils/ResponsiveWrapper.tsx | 2642 |
| **Total JS/TSX audité** | **2070605** |

## Version optimisée
| Fichier | Octets |
|---|---:|
| HeroCaseStudy.jsx | 8536 |
| HeroCaseStudy.css | 10959 |

Réduction de source JS locale par rapport au total audité : **99.59%**.

## Dépendances finales vérifiées
| Dépendance | État | Rôle |
|---|---|---|
| React | requis | composant, props, media query |
| React DOM | app/preview | montage React |
| framer-motion | requis | Springs/tweens importants de la source |
| Next.js | non requis | composant React standard |
| `_framer-runtime.js` | supprimé | 0 import |
| `_responsive-runtime.js` | supprimé | 0 import |
| RichText Framer | supprimé | JSX natif |
| Image Framer | supprimé | img natif |
| useVariantState | supprimé | CSS + matchMedia |
| LayoutGroup Framer | supprimé | non nécessaire |
| metadata/property controls | supprimés | non nécessaires hors Framer |
| data-framer-* | supprimés | 0 dans le JSX final |
| Vite | preview seulement | lancement autonome |

## Assets externes réellement conservés
- Plus Jakarta Sans 700 : URL WOFF2 présente dans l’export
- Inter 500/600 : URLs WOFF2 présentes dans l’export
- Avatar fixe du CTA : URL + srcSet exacts présents dans `Hero.js`
- `photoDeProfil` et `photoDuSite` : **props externes dans le React Framer original** ; le ZIP n’embarque pas leurs fichiers d’instance

## Liens
Le code exporté contient seulement des IDs internes Framer pour Réalisations, Voir nos offres et Réserver un appel. Aucune URL publique n’a été inventée. La version optimisée expose `realisationsHref`, `offersHref` et `callHref`.
