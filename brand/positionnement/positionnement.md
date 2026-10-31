# Positionnement — Ruff Agency (v0.1)

> Uniquement ce qui est **écrit** sur le site. Aucune déduction. Toutes les lignes sont **à valider**.
> Confiance : haut = écrit tel quel et répété · moyen = écrit une fois ou de façon ambiguë · bas = fragmentaire.

## 1. Le problème résolu

| Ce que dit le site | Où | Confiance | Validation |
|---|---|---|---|
| « Je vois chaque semaine des entreprises qui ne génèrent presque aucune demande qualifiée. » | Section mission (accueil, `SectionAvis`) | haut | à valider |
| « vous méritez mieux qu'un "site simple" : vous méritez une page qui travaille vraiment pour vous. » | Section mission | haut | à valider |
| Agence traditionnelle : « Commence à +5 000 € », « Design esthétique seul », « Résultats variables », « 2-3 mois de livraison en moyenne », « vous êtes dépendant de l'agence » | Comparatif (`ComparatifOptimized.tsx`) | haut | à valider |
| Faire soi-même : « +70h de travail », « Design générique », « Non optimisé », « Nécessite de vous former au logiciel » | Comparatif | haut | à valider |
| « Stop selling a real product with an AI-generated landing page. » | Landing SaaS anglaise, **non indexée** (`app/saas-redesign`) | moyen (page hors site principal) | à valider |

## 2. Pour qui

| Ce que dit le site | Où | Confiance | Validation |
|---|---|---|---|
| « Si vous êtes une entreprise qui prend son image au sérieux » | Section mission | haut | à valider |
| Catégories de réalisations : **SaaS, Agence, PME, Indépendant** | `lib/data/projects.ts` (`RealisationCategory`) | haut | à valider |
| « Un site multi-pages convient davantage aux SaaS, services, agences et marques » | FAQ | haut | à valider |
| Landing page « idéale pour des campagnes payantes, des lancements, des webinaires ou encore des pages de vente » | FAQ | haut | à valider |
| « Découvrez nos réalisations : landing pages, sites internet et refontes pour SaaS, agences, cabinets et indépendants. » | Méta-description `/realisations` | haut | à valider |
| « FOR SAAS OWNERS » | Landing SaaS anglaise, non indexée | moyen | à valider |
| Témoignages : fondateurs (« +30 fondateurs satisfaits ») | Bandeau d'avis | moyen | à valider |

**Ce qui n'est pas écrit** : taille d'entreprise, chiffre d'affaires, secteur prioritaire, zone géographique de clientèle (les pages ville existent mais sont en `noindex`). Le formulaire d'audit demande une « Tranche de CA » mais aucune tranche cible n'est affichée comme critère.

## 3. La promesse

| Ce que dit le site | Où | Confiance | Validation |
|---|---|---|---|
| « On crée des landing pages et des sites World-class » | Titre de l'accueil, balise `title` | haut | à valider |
| « Transformez vos visiteurs en clients et renforcez votre crédibilité » | Sous-titre de l'accueil, `/services` | haut | à valider |
| « Le mélange parfait entre conversion et design. » | Pied de page | haut | à valider |
| « Notre mission est simple : faire du design un véritable levier de performance. » | Section mission | haut | à valider |
| « La page qui transforme l'attention en demandes qualifiées. » | `/services/landing-page` | moyen | à valider |
| « Nous perfectionnons votre site jusqu'à ce qu'il vous convienne entièrement, ou nous vous remboursons intégralement. » | Tarifs | haut | à valider |
| « Devenez le résultat numéro 1 dans les recherches » | Bénéfices de l'accueil | moyen | à valider |

## 4. L'offre telle qu'écrite

| Élément | Valeur affichée | Où | Confiance | Validation |
|---|---|---|---|---|
| Prix landing page | 1 765 € (1 page), +400 € par page supplémentaire | Tarifs | haut | à valider |
| Options | Full Brand Identity +620 € · Post-launch CRO Sprint +700 € | Tarifs | haut | à valider |
| Inclus | Développement Framer, illustrations sur-mesure, modifications illimitées, analyse stratégique, un responsable de projet, support 24h/7j, desktop et mobile, copywriting, SEO, animations, suivi en temps réel | Tarifs | haut | à valider |
| Délai | **VARIABLE** : « 14 jours » (tarifs, comparatif) / « livrée sous 10 jours » (processus) / « en 10 jours » (ressources) / « 10 days » (landing SaaS) | plusieurs | haut (l'écart est certain) | à valider |
| Paiement | 50 % au lancement, 50 % à la livraison | FAQ | haut | à valider |
| Processus | 1. Appel de 30 min · 2. Formulaire et onboarding · 3. Création | Processus | haut | à valider |
| Outil de réalisation | « Figma pour la phase de design, puis Framer pour le développement » (FAQ) / « Développement React / Next.js » (affiché sur `/services/landing-page`) | **VARIABLE** | haut | à valider |
| Services listés | Landing page, Site internet, Branding, Product design, Copywriting, SEO/GEO, Optimisation conversion, Développement Framer, Développement code (React) — **9 services** dans le menu, mais « Trois offres claires » sur `/services`, et **un seul prix** affiché | **VARIABLE** | haut | à valider |

## 5. Les preuves

| Preuve | Où | Confiance | Validation |
|---|---|---|---|
| Témoignages nominatifs avec photo : Sacha Tassart (Spreak), Martin Riedweg (Rentala), Dominique Zenglein (Cabinet Zorgniotti), Julie Zagula, Antoine Troovy (Keyframe), Noé E. (Myminia), Nicolas H. (Gourdy) | `SectionAvis`, `HeroOptimized.tsx`, `projects.ts` | haut | à valider |
| « +30 clients satisfaits » / « +30 fondateurs satisfaits » / « Note moyenne 5/5 » | Héros, bandeau d'avis | moyen (source du chiffre non affichée) | à valider |
| Badges chiffrés : « 1.43x plus de conversion », « 2x plus de conversion » | Cartes d'avis | bas — **attribution à un client non déterminée** depuis le texte | à valider |
| 6 études de cas publiées : Spreak, Keyframe agency, Rentala, Cabinet Zorgniotti, Clovarex, Scall | `lib/data/projects.ts` | haut | à valider |
| Résultats Spreak : « Taux de conversion nettement en hausse » (sans chiffre) | `/realisations/spreak` | moyen | à valider |
| « +2k abonnés » (fondateur) | Section mission | moyen (réseau non précisé sur cette ligne) | à valider |
| Garantie satisfait ou remboursé | Tarifs, FAQ | haut | à valider |

**Incohérences dans les preuves (signalées, pas tranchées)** :
- Julie Zagula est présentée comme « CEO of Keyframe agency » (héros de l'accueil), « Fondatrice de Clovarex » (bandeau) et « experte-comptable » (fiche Clovarex).
- Antoine Troovy : « Fondateur de Keyframe agency » / « CEO de Keyframe.agency ».
- Dominique Zenglein : « Expert-comptable » / « Associé chez Zorgniotti ».
- Un témoignage du carrousel de l'accueil est en anglais sur la version française (« I opted for their premium package… », Fondateur de SAG — `HeroOptimized.tsx:157`).
