# Footer — audit d'optimisation et dépendances réelles

## Mesures locales

| Fichier / runtime | Export Framer | Version optimisée |
|---|---:|---:|
| `Footer.js` | 3 173 758 octets | — |
| `_framer-runtime.js` | 1 976 925 octets | 0 |
| `_responsive-runtime.js` | 4 298 octets | 0 |
| `Footer.jsx` | — | 29 371 octets |
| `Footer.css` | — | 24 046 octets |
| JS local export + runtimes | 5 154 981 octets | 29 371 octets |
| Réduction du JS local mesuré | — | **99,43 %** |
| Réduction JSX + CSS vs JS local exporté | — | **98,96 %** |

Le total Framer ci-dessus ne comprend pas le poids installé de `framer-motion` ni de `@motionone/dom`, qui sont des dépendances externes de l'export.

## Dépendances réellement présentes dans le résultat

| Élément | Statut final | Vérification |
|---|---|---|
| `react` | **Requis** | Seul import npm du composant final. |
| `react-dom` | Requis par l'application React | Utilisé par la preview ; déjà présent dans une app Next.js/React. |
| Next.js | **Non requis** | Aucun import `next/*`; le composant peut être intégré dans Next.js. |
| `framer-motion` | **Supprimé** | Aucun import / aucune référence finale. |
| `@motionone/dom` | **Supprimé** | Importé par l'export original, absent du résultat. |
| `_framer-runtime.js` | **Supprimé** | Aucun import / aucune copie dans la version optimisée. |
| `_responsive-runtime.js` | **Supprimé** | Les trois variantes de styles sont converties en media queries CSS. |
| `RichText`, `Image`, `SVG`, `Link` Framer | **Supprimés** | Remplacés par JSX/HTML natif, `img`, `a` et SVG inline. |
| Ticker Framer | **Supprimé** | Remplacé par animation CSS linéaire à partir des valeurs exportées. |
| Runtime DotLottie embarqué | **Supprimé** | Le runtime de plusieurs Mo n'est plus embarqué. |
| Vite | **Preview uniquement** | N'est pas une dépendance du composant final. |
| `@vitejs/plugin-react` | **Non utilisé** | La preview fonctionne avec Vite seul afin d'éviter le conflit de peer dependencies rencontré auparavant. |

## Dépendances réseau encore présentes

Le footer est indépendant du runtime JavaScript Framer, mais il n'est pas 100 % offline :

- les images originales restent servies par `framerusercontent.com` ;
- les `srcSet` exacts présents dans l'export Framer sont conservés afin que le navigateur choisisse les tailles 512/1024/2048/4096 quand elles existent ;
- Inter 400/500 est chargé depuis les fichiers Framer exacts utilisés pour le latin ;
- le titre charge le fichier Google Fonts Plus Jakarta Sans 700 présent dans l'export ;
- le `.agency` charge séparément le fichier Fontshare Plus Jakarta Sans 700 réellement référencé par l'export ;
- X, WhatsApp et LinkedIn restent des liens externes.

## Ce qui vient directement du code exporté

- variantes : `Desktop = S8BrxAi6G`, `Tablet = UDVRfxDYr`, `Phone = tIoNgbJQ8` ;
- fond `rgb(35, 38, 48)` ;
- padding par défaut `500px 48px 64px 48px` ;
- carte CTA bleue : gradient, positionnement, dimensions, radius `64px`, border et ombres ;
- titre Plus Jakarta Sans 700 : `48px`, puis `32px` sur Phone, tracking `-0.03em`, line-height `114%` ;
- bouton « Réserver un appel » : style `TW_GcszgP` et hover `KZxI1kDT0`, valeurs de border/background/shadow reprises ;
- ticker desktop/tablet : deux colonnes, cartes `382×248px`, radius `16.36px`, gap `10px`, vitesse Framer `50px/s`, fade width `51`, fade inset `16`, rotation `16°` Desktop et `13°` Tablet ;
- ticker Phone : cartes ~`296–297px`, ratio `1.4987654321`, border blanche `7px`, radius `24px`, gap `16px`, vitesse `50px/s` ;
- 10 visuels par colonne desktop/tablet dans le même ordre que l'export ;
- 11 visuels du ticker Phone dans le même ordre que l'export ;
- logo Ruff, décor, X, WhatsApp et LinkedIn extraits comme SVG depuis le fichier ;
- textes Navigation / Services / réseaux / villes / copyright conservés, y compris l'orthographe originale « Whatsaap » ;
- villes : Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Lille, avec les slugs publics présents dans les path variables du code exporté.

## Points où le ZIP ne permet pas de garantir une équivalence bit-for-bit

1. **Association des variantes aux largeurs du site** : l'export donne les trois variantes et leurs styles, mais le composant lui-même ne contient pas la règle du site disant à quelle largeur basculer entre elles. Pour une preview autonome cohérente avec les sections précédentes, le pack utilise Phone `<810px`, Tablet `810–1399px`, Desktop `>=1400px`. Ce mapping est une règle d'intégration ; les styles de chaque variante viennent bien du fichier exporté.
2. **Liens internes Framer** : Accueil, Services, Réalisations, Ressources, réservation, etc. sont stockés comme IDs internes (`augiA20Il`, `XvvJHap2q`, etc.), sans URL publique. Le composant accepte donc `links` et `bookingHref` au lieu d'inventer des URLs.
3. **Animation Lottie des places disponibles** : l'export contient l'URL `7Us0KKzHO2n8Jsf36VlImXFCQQ.json`, mais le JSON lui-même n'est pas dans le ZIP. Pour retirer le runtime DotLottie massivement embarqué, la version légère garde l'emprise `33×33`, le texte dynamique et un pulse CSS, mais cette micro-animation n'est pas image-par-image identique à la Lottie d'origine.
4. **Courbes Spring Framer Motion** : les valeurs finales, positions et états sont conservés, mais les courbes physiques internes de Framer Motion ne sont pas bit-for-bit reproduites par CSS.

## Vérifications effectuées sur les fichiers finaux

- parsing JSX/TS : **0 erreur** sur `Footer.jsx` et la preview ;
- parsing CSS PostCSS : **OK** ;
- recherche de `framer-motion`, `_framer-runtime`, `_responsive-runtime`, `RichText`, `useVariantState`, `motion.` et `data-framer-*` : **aucune référence restante** ;
- `@vitejs/plugin-react` : absent de la preview ;
- les `srcSet` images ont été extraits du `Footer.js` original et réinjectés dans le JSX final.
