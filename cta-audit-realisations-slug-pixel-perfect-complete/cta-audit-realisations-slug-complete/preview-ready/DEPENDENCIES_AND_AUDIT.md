# Audit des dépendances — CTA audit réalisations slug

## Source originale mesurée
| Fichier | Taille |
|---|---:|
| CtaAuditRAlisationsSlug.js | 65096 octets |
| _framer-runtime.js | 1976925 octets |
| _responsive-runtime.js | 4298 octets |
| utils/LayoutIsland.tsx | 2780 octets |
| utils/ResponsiveWrapper.tsx | 2642 octets |
| Total JS/TSX audité | 2051741 octets |

## Version optimisée
| Fichier | Taille |
|---|---:|
| CtaAuditRealisationsSlug.jsx | 11268 octets |
| CtaAuditRealisationsSlug.css | 10137 octets |
| Réduction du JS source local | 99.45% |

## Dépendances finales réelles
- `react`: requis.
- `react-dom`: requis par l'application / la preview.
- `framer-motion`: supprimé. Le source n'utilise aucun hover/tap/animation visible qui exige Motion; Motion servait aux variantes Framer.
- `_framer-runtime.js`: supprimé.
- `_responsive-runtime.js`: supprimé.
- `RichText`, `Image`, `SVG`, `useVariantState`, `LayoutGroup`, metadata et `data-framer-*`: supprimés/remplacés par React/HTML/CSS natifs.
- Vite: preview seulement.

## Dépendances réseau conservées volontairement
- `framerusercontent.com`: 7 icônes/images du formulaire et 4 visuels décoratifs originaux, plus Inter 500 et Plus Jakarta Sans 700. Ces URL sont présentes dans l'export et sont gardées pour le rendu.
- `https://agenceflow.vercel.app/api/audits/webhook`: webhook réel présent dans l'export. Il reste la valeur par défaut du prop `webhookUrl`; passer `webhookUrl=""` le désactive.

## Responsive extrait du source
- Phone: 0–809px.
- Tablet: 810–1399px.
- Desktop: >=1400px.

## Indépendance
Le composant ne dépend plus de Framer ni de son runtime. Il reste dépendant de React et, si le formulaire doit envoyer les données comme dans l'original, du webhook externe ci-dessus. Les assets sont encore servis depuis les URL source pour ne pas altérer le rendu.
