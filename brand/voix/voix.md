# Voix — Ruff Agency (v0.1)

> Toutes les règles sont **à valider**. Chaque règle a 3 exemples réels copiés du site.
> Statuts : CONSTANT / VARIABLE / UNIQUE · Confiance : haut / moyen / bas.

## Sources

Texte affiché sur `https://ruff.agency`, lu le 25/10/2026 : accueil, `/services`, `/services/landing-page`, `/services/website`, `/services/branding`, `/agence`, `/30-min`, `/realisations`, `/realisations/spreak`, `/ressources`, `/ressources/guide-copywriting-page-qui-convertit`, `/outils-gratuits`, `/outils-gratuits/simulateur-roi-refonte` (13 pages). Les nombres d'occurrences comptent toutes ces pages ; un même bloc répété sur plusieurs pages est donc compté plusieurs fois.
Fichiers sources des textes : `components/sections/*`, `lib/data/projects.ts`, `lib/data/articles.ts`, `app/saas-redesign/*`.

---

## V1 — On vouvoie le lecteur

**CONSTANT sur les pages commerciales · confiance haut · à valider**

1. « Transformez vos visiteurs en clients et renforcez votre crédibilité grâce à une landing page ou un site premium, optimisée pour la conversion. » — `components/sections/HeroOptimized/HeroOptimized.tsx:31`
2. « Votre proposition devient lisible, hiérarchisée et facile à choisir. » — bénéfices de l'accueil, `BenefitsOptimized.tsx`
3. « Vous avez encore des questions ? Réservez un appel ou envoyez-nous un message ici » — `StackSection3.jsx`

**Exception validée (26/10/2026)** : la landing du lead magnet « Ruff Agency Blueprint », sa page de remerciement et ses emails sont tutoyés (règle R20 de `brand/design/feedback.md`).

**Écart (VARIABLE)** : l'article « Copywriting de landing page » passe au tutoiement en cours de texte (`lib/data/articles.ts`) :
- « Paradoxalement, plus tu montres que tu n'as pas besoin de vendre, plus tu deviens crédible. »
- « Préfère toujours des termes rassurants comme "commande" plutôt que "paiement". »
- alors que les exemples du même article vouvoient : « Vous êtes libre de quitter cette page. »

## V2 — Qui parle : « on », « nous » ou « je »

**VARIABLE · confiance haut · à valider** (signalé, pas tranché)

- « On » : « On crée des landing pages et des sites World-class » — titre de l'accueil
- « Nous » : « Nous perfectionnons votre site jusqu'à ce qu'il vous convienne entièrement, ou nous vous remboursons intégralement. » — `PrixOptimized.tsx`
- « Je » (le fondateur) : « Je vois chaque semaine des entreprises qui ne génèrent presque aucune demande qualifiée. » — section mission, signée Louis Staub

Les trois formes coexistent sur la même page d'accueil. Les témoignages parlent de « Louis » et de « Ruff Agency » de façon interchangeable.

## V3 — Le bouton parle à la place du lecteur (« je », « mon »)

**VARIABLE · confiance moyen · à valider**

1. « Commencer mon projet » — bouton de la navigation
2. « Je lance mon projet maintenant » — section processus
3. « Estimer mon potentiel » — simulateur ROI

À côté, d'autres boutons sont à l'infinitif neutre : « Réserver un appel », « Voir nos réalisations », « Voir en détail ».

## V4 — Les titres de bénéfice sont des impératifs

**CONSTANT dans les blocs de bénéfices · confiance moyen · à valider**

1. « Transformez vos visiteurs en clients »
2. « Inspirez confiance »
3. « Démarquez vous de la concurrence »

(accueil, `BenefitsOptimized.tsx`)

## V5 — Phrases courtes, souvent sans verbe, en rafale

**CONSTANT · confiance haut · à valider**

1. « Clarté, crédibilité et action : sans bruit inutile. » — `/agence`
2. « Image, message et promesse alignés. » — `/agence`
3. « Parcours plus simple, message plus tranchant » — étude de cas Spreak, `lib/data/projects.ts`

## V6 — Construction en contraste (« moins X, plus Y », « X, pas Y »)

**CONSTANT · confiance moyen · à valider**

1. « Moins de flou, plus de clarté : prix, délai et résultat au centre. » — comparatif de l'accueil
2. « Une landing page conçue pour convertir, pas juste pour être en ligne. » — `lib/data/articles.ts`
3. « Un design qui reflète votre niveau et votre positionnement, sans effet « site générique ». » — `/services/landing-page`

## V7 — Vocabulaire récurrent

**CONSTANT · confiance haut · à valider**

| Mot | Occurrences (13 pages) | Exemple réel |
|---|---|---|
| conversion | 80 | « Le mélange parfait entre conversion et design. » (pied de page) |
| clair / clarté | 41 | « Des tarifs clairs, sans surprise » (tarifs) |
| image | 36 | « Faire grandir l'image au rythme du produit » (Spreak) |
| simple | 24 | « Notre mission est simple : faire du design un véritable levier de performance. » |
| unique | 19 | « Image de marque unique » (badge de témoignage) |
| World-class | 17 | « On crée des identités de marque World-class » (`/services/branding`) |
| crédibilité | 12 | « Crédibilité renforcée » (`/services/branding`) |
| mémorable | 12 | « Une image forte, mémorable, à vous. » (`/agence`) |
| premium | 11 | « Avec un design premium qui reflète réellement votre positionnement. » |
| positionnement | 10 | « Fidélité à votre positionnement » (`/agence`) |
| levier | 10 | « faire du design un véritable levier de performance » |

## V8 — Anglicismes métier assumés

**CONSTANT · confiance haut · à valider**

1. « World-class » (titre de presque toutes les pages)
2. « Full Brand Identity » et « Post-launch CRO Sprint » (options de la grille tarifaire, `PrixOptimized.tsx`)
3. « Design conversion-first » (comparatif)

Le mot « landing page » n'est jamais traduit.

## V9 — Mots absents

**CONSTANT · confiance moyen · à valider** (0 occurrence dans les 13 pages lues)

« révolution », « innovant / innovation », « passion », « synergie », « disruptif », « écosystème » (côté Ruff), « pas cher », « low-cost », « IA » / « intelligence artificielle » (sur les pages françaises).

À noter : la landing SaaS anglaise (`/saas-redesign`, non indexée) parle d'IA, mais **contre** elle : « Stop selling a real product with an AI-generated landing page. » / « not another recycled AI website ».

Je ne peux pas prouver qu'un mot est banni : je constate seulement qu'il n'apparaît pas.

## V10 — Emojis

**VARIABLE selon le type de page · confiance haut · à valider**

- Pages commerciales (accueil, services, À propos, réalisations, 30-min) : **aucun emoji**.
- Articles : « 👉 » utilisé 13 fois dans `lib/data/articles.ts`, toujours pour introduire une explication :
  1. « 👉 Ce levier crée responsabilité et urgence, sans pression agressive. »
  2. « 👉 La liberté redonne du contrôle… et augmente paradoxalement l'engagement. »
  3. « 👉 La projection rend la décision urgente et personnelle. »

## V11 — Rareté et urgence

**VARIABLE · confiance haut · à valider**

1. « 6 places restantes pour [mois] » — héros de l'accueil. Le chiffre est **calculé à partir de la date du jour** (il passe de 6 à 1 au fil du mois) : `HeroOptimized.tsx:302`.
2. « 3 places disponibles pour Juin » — fin de l'étude de cas Spreak, texte fixe (lu en octobre).
3. « Je lance mon projet maintenant » — section processus.

## V12 — Les clients parlent à la place de l'agence

**CONSTANT · confiance haut · à valider**

1. Titre de la section avis : « Ils parlent mieux que nous »
2. « Il écoute, il ajuste, il vise juste. » — Julie Zagula
3. « Mention spéciale pour le copywriting : les textes sont percutants et mettent parfaitement en valeur notre proposition. » — Martin Riedweg, Rentala

## V13 — Ton des outils gratuits : prudent et explicatif

**UNIQUE (outils gratuits) · confiance moyen · à valider**

1. « Cette simulation est une estimation, sans garantie de conversions ni de chiffre d'affaires. »
2. « Les taux par domaine sont des hypothèses de simulation, pas des moyennes mesurées du marché. »
3. « Si votre taux actuel dépasse déjà l'objectif du scénario, l'outil n'ajoute pas de gain automatique. »

Ce ton tranche avec les pages de vente (« Devenez le résultat numéro 1 dans les recherches »).

---

## Coquilles et textes cassés relevés (faits, à corriger ou non)

| Texte affiché | Page |
|---|---|
| « Site facile à prendre en main, vous pouvez le **gérez** seul » | accueil (comparatif) |
| « Agence **traditionelle** » | accueil |
| « Satisfait ou 100% **Garantit** » | accueil (tarifs) |
| « **Quellles** sont vos conditions de paiements ? » | FAQ |
| « suivre l'avancement de mon **project** » | FAQ |
| « **Démarquez vous** » (sans trait d'union) | accueil |
| « Sur quel logiciel réalisez vous vos **landings pages** ? » | FAQ |
| « Meilleure de conversion » (mot manquant) | badge d'avis |
| « On **créé** des World-class **Landings** pages et Sites » | `/realisations/spreak` |
| « Transformez vos visiteurs en clients et **.** » (phrase coupée) | `/agence` |
| « …pourquoi vous.**avoir payer, vous receverez** un formulaire » | `/agence` |
| « Un processus de **branding** clair et efficace » sur la page **landing page** | `/services/landing-page` |
