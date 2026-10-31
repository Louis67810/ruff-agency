# Différenciateurs — Ruff Agency (v0.1)

> Ce que le site **présente lui-même** comme différent de la concurrence, ou ce qu'il affiche et qui sort de l'ordinaire.
> Rien n'est déduit. Je n'ai pas comparé avec de vraies agences concurrentes. Toutes les lignes sont **à valider**.

## 1. Différenciateurs revendiqués (écrits sur le site)

| # | Différenciateur | Texte exact | Source | Statut | Confiance | Validation |
|---|---|---|---|---|---|---|
| D1 | Prix | « À partir de 1 765 € » contre « Commence à +5 000€ » pour l'agence traditionnelle | `ComparatifOptimized.tsx`, `PrixOptimized.tsx` | CONSTANT | haut | à valider |
| D2 | Délai | « 14 jours de livraison » contre « 2-3 mois de livraison en moyenne » | Comparatif | CONSTANT, mais le chiffre varie entre 10 et 14 jours (voir positionnement §4) | haut | à valider |
| D3 | Autonomie du client | « Site facile à prendre en main, vous pouvez le gérez seul » contre « vous êtes dépendant de l'agence » | Comparatif | CONSTANT | haut | à valider |
| D4 | Design pensé pour convertir, pas seulement esthétique | « Design conversion-first » / « Optimisé conversion » contre « Design esthétique seul » | Comparatif | CONSTANT | haut | à valider |
| D5 | Garantie | « Satisfait ou 100% Garantit — Nous perfectionnons votre site jusqu'à ce qu'il vous convienne entièrement, ou nous vous remboursons intégralement. » | Tarifs, FAQ | CONSTANT | haut | à valider |
| D6 | Modifications illimitées | « Modifications illimitées » | Tarifs | CONSTANT | haut | à valider |
| D7 | Suivi en direct par WhatsApp | « Vous pourrez suivre la progression de votre projet directement via WhatsApp. Nous vous partageons chaque jour l'avancement » | FAQ, bouton WhatsApp dans la navigation | CONSTANT | haut | à valider |
| D8 | Audit offert à l'appel | « Appel de découverte · +Audit de votre site offert » / « nous pourrons vous présenter l'audit de votre site » | `/30-min`, FAQ | CONSTANT | haut | à valider |
| D9 | Contre le « générique » et les sites faits par IA | « sans effet « site générique » » (FR) · « not another recycled AI website » (EN, landing SaaS non indexée) | `/services/landing-page`, `app/saas-redesign` | VARIABLE (fort sur la landing SaaS, discret sur le site FR) | moyen | à valider |
| D10 | Copywriting inclus | « Copywriting optimisé » (inclus) — et un client le remarque : « Mention spéciale pour le copywriting » | Tarifs, témoignage Rentala | CONSTANT | haut | à valider |

## 2. Signes distinctifs affichés (non présentés comme « différence » mais visibles)

| # | Signe | Source | Statut | Confiance | Validation |
|---|---|---|---|---|---|
| S1 | Le fondateur est visible partout : sa photo dans chaque bouton principal, sa signature sur la mission et les articles (« Écrit par : Louis Staub ») | `components/ui/Cta.jsx`, `SectionAvis`, `RessourceArticle` | CONSTANT | haut | à valider |
| S2 | Les clients citent le fondateur par son prénom (« Louis m'a livré un site soigné… ») | Témoignages | CONSTANT | haut | à valider |
| S3 | Prix affiché publiquement | `PrixOptimized.tsx` | CONSTANT | haut | à valider |
| S4 | Outils gratuits (simulateur ROI, comparateur de prix de plateformes) | `/outils-gratuits` | UNIQUE (type de contenu) | haut | à valider |
| S5 | Articles sur l'actualité des marques (Bonduelle, KFC) en plus des guides | `lib/data/articles.ts` | VARIABLE | haut | à valider |
| S6 | Boutons « Résumer cette ressource avec : ChatGPT / Claude / Grok / Perplexity » sur les articles | `/ressources/guide-copywriting-page-qui-convertit` | CONSTANT sur les articles | haut | à valider |

## 3. Ce que je ne peux pas affirmer

- Que ces différenciateurs sont réellement uniques sur le marché : **non déterminé** (aucune comparaison externe faite ; il existe un fichier `data/agences-web-france-pricing.csv` non suivi par git, que je n'ai pas utilisé).
- Lequel de ces points compte le plus pour tes clients : **non déterminé**.
- Si l'équipe compte plusieurs personnes (« toute l'équipe » dans un témoignage, « un responsable de projet » dans l'offre) ou si tu travailles seul : **non déterminé**.
