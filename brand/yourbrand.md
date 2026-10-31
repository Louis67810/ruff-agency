# Ruff Agency — système de marque (v0.1)

> Première version construite **uniquement** à partir du site (code dans ce dépôt + site en ligne `https://ruff.agency`, lu le 25/10/2026).
> **Statut global : à valider.** Aucune règle n'est confirmée tant que tu ne l'as pas validée.

| Dossier | Contenu |
|---|---|
| [design/design.md](design/design.md) | Couleurs, typographies, espacements, rayons, ombres, composants et leurs états, mises en page |
| [design/banque.html](design/banque.html) · [design/ruff-tokens.css](design/ruff-tokens.css) | Banque visuelle : tous les composants et briques d'illustration, réutilisables |
| [design/feedback.md](design/feedback.md) · [design/sections/](design/sections/) | Journal des retours et maquettes de sections (bénéfices v1) |
| `.claude/skills/ruff-design/SKILL.md` | Skill pour recréer des designs dans le style Ruff |
| [voix/voix.md](voix/voix.md) | Ton, vocabulaire, tournures, mots absents, emojis, façon de s'adresser au lecteur, coquilles |
| [positionnement/positionnement.md](positionnement/positionnement.md) | Problème, cible, promesse, offre, preuves — seulement ce qui est écrit |
| [differenciateurs/differenciateurs.md](differenciateurs/differenciateurs.md) | Ce que le site présente comme différent |

---

## Étape 1 — Inventaire des pages

Source : `app/` (routes Next.js), `app/sitemap.ts`, `lib/site.ts`, `lib/data/*`.

| Type de page | Routes | Nombre | Gabarit | Indexée |
|---|---|---|---|---|
| Accueil | `/` | 1 | `app/page.tsx` | oui |
| Hub services (thème sombre) | `/services` | 1 | `HeroContent` + `Benefices2Optimized` | oui |
| Page service | `/services/landing-page`, `website` (= `site-internet`), `branding`, `product-design`, `copywriting`, `seo-geo`, `optimisation-conversion`, `developpement-framer`, `developpement-web` | 9 (+1 alias) | `ServicePageTop` + sections de l'accueil | oui |
| Liste des réalisations | `/realisations` | 1 | `HeroRealisations` | oui |
| Étude de cas | `/realisations/[slug]` : spreak, keyframe-agency, rentala, zorgniotti, clovarex, scall | 6 | `HeroCaseStudy` + `ContentPageRealisationsSlug` | oui |
| Liste des ressources (blog) | `/ressources` | 1 | `ArticlesRessource` | oui |
| Article | `/ressources/[slug]` | 13 (12 listés, 1 masqué : `bibliotheque-composants-article`) | `RessourceArticle` | oui |
| Liste des outils gratuits | `/outils-gratuits` | 1 | `ArticlesRessource` | oui |
| Outil gratuit | `simulateur-roi-refonte`, `comparateur-prix-plateformes` | 2 | `FreeToolDetail` | oui |
| À propos | `/agence` | 1 | `Hero2Optimized` + `SectionAgenceEnQuelquesMots` | oui |
| Contact / réservation | `/30-min` | 1 | `CallBooking` (calendrier) | oui |
| Pages ville | `/ville/[slug]` (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Lille) | 9 | copie de l'accueil | **non** (`noindex`) |
| Landing SaaS (anglais) | `/saas-redesign` + `/saas-redesign/brief` | 2 | gabarit propre | **non** (`noindex`) |
| Erreur 404 | — | 1 | `Hero2Optimized` | — |
| Versions anglaises | `/en/...` pour toutes les pages ci-dessus | ×2 | mêmes gabarits, traduction | oui |
| Outils internes (exclus) | `/behavioral-intelligence`, `/saas-redesign/analytics`, `content-editor`, `tweets-admin`, `/linkedin`, `/api/*` | — | back-office | — |

Les dossiers `*-preview-ready/`, `*-COMPLETE/`, `*-complete/` à la racine sont des exports de sections, pas des pages : exclus.

### Pages retenues comme représentatives

| Page | Pourquoi |
|---|---|
| **Accueil** `/` | Elle assemble 9 sections réutilisées partout (bénéfices, processus, avis, comparatif, réalisations, prix, FAQ). C'est la page qui contient le plus de règles. |
| **Service landing page** `/services/landing-page` | Un seul gabarit (`ServicePageTop`) sert aux 9 pages service ; c'est aussi l'offre chiffrée du site. |
| **Étude de cas** `/realisations/spreak` | Gabarit des 6 études de cas, et c'est là que sont les preuves (défi, solution, résultats, avis). |
| **Article** `/ressources/guide-copywriting-page-qui-convertit` | Gabarit des 13 articles, texte long signé par le fondateur : c'est là que la voix est la plus libre. |
| **À propos** `/agence` | Seule page qui parle de l'agence elle-même. |
| **Réservation** `/30-min` | Destination de presque tous les boutons. |
| **Hub services** `/services` | Seule page en thème sombre : sert à repérer ce qui varie. |
| **Simulateur ROI** `/outils-gratuits/simulateur-roi-refonte` | Ton différent (prudent, explicatif) : sert à repérer ce qui varie. |

Non retenues : les pages ville (copies de l'accueil, non indexées), les 8 autres pages service (même gabarit), la landing SaaS (anglaise, non indexée ; lue seulement pour les signaux de différenciation, et marquée comme telle).

---

## Résumé

### Design → [détail](design/design.md)
- **Couleurs** : bleu nuit `#121A2E` pour le texte, bleu électrique `#0147FF` en accent, fonds quasi blancs. Pas de couleur secondaire. *(CONSTANT, haut)*
- **Typo** : Plus Jakarta Sans 700 serré pour les titres, Inter 500 pour le reste. *(CONSTANT, haut)*
- **Signature** : bouton bleu « en relief » avec la **photo du fondateur** dedans. *(CONSTANT, haut)*
- **Mise en page** : héros centré (avatars clients → titre → 2 boutons → « places restantes »), puis la même suite de sections sur l'accueil et les pages service. *(CONSTANT, haut)*
- **À trancher** : plus de 20 rayons différents, 3 fonds de page, 5 angles de dégradé, états clavier présents dans seulement 9 fichiers sur 39. *(VARIABLE)*

### Voix → [détail](voix/voix.md)
- Vouvoiement, phrases courtes souvent sans verbe, constructions en contraste, vocabulaire « conversion / clair / image / premium / World-class ». *(CONSTANT)*
- Aucun emoji sur les pages de vente ; « 👉 » dans les articles. *(VARIABLE selon le type de page)*
- **À trancher** : « on » / « nous » / « je » mélangés ; tutoiement dans un article ; boutons tantôt « Réserver un appel », tantôt « Je lance mon projet ». *(VARIABLE)*
- 12 coquilles ou textes cassés relevés.

### Positionnement → [détail](positionnement/positionnement.md)
- **Problème** : des entreprises « qui ne génèrent presque aucune demande qualifiée ».
- **Pour qui** : « une entreprise qui prend son image au sérieux » ; SaaS, agences, PME, indépendants.
- **Promesse** : « Transformez vos visiteurs en clients et renforcez votre crédibilité » ; « Le mélange parfait entre conversion et design ».
- **Preuves** : témoignages nominatifs, 6 études de cas, « +30 clients », « 5/5 », garantie remboursé.
- **À trancher** : délai 10 ou 14 jours ; Framer ou React ; « trois offres » mais 9 services et 1 prix ; rôles des témoins incohérents.

### Différenciateurs → [détail](differenciateurs/differenciateurs.md)
Prix public (1 765 € contre +5 000 €), délai court, garantie satisfait ou remboursé, modifications illimitées, suivi WhatsApp quotidien, audit offert, client autonome, fondateur visible partout.

---

## Étape 5 — Audit anti AI slop

**En attente.** Tu m'as indiqué que le filtre n'est pas encore dans le dépôt : l'audit sera fait quand tu me l'auras donné, avec ses propres critères (je n'applique pas de filtre par défaut).

---

## Étape 6 — Lacunes : ce que je ne peux pas savoir

| # | Sujet | Pourquoi je ne peux pas le savoir |
|---|---|---|
| L1 | **Ton client idéal** (secteur, taille, budget, rôle du décideur) | Le site cite 4 catégories (SaaS, agence, PME, indépendant) sans en mettre une en avant. |
| L2 | Ton offre principale aujourd'hui | Le menu liste 9 services, `/services` parle de « trois offres », un seul prix est affiché. |
| L3 | Le délai réel | 10 jours et 14 jours coexistent. |
| L4 | L'outil de production | La FAQ dit Framer ; la page landing page affiche React / Next.js ; deux pages service séparées existent. |
| L5 | Qui parle : toi seul, ou une équipe | « on », « nous », « je », « toute l'équipe », « un responsable de projet ». |
| L6 | Le tutoiement dans les articles : voulu ou non | Une seule occurrence, au milieu d'un article vouvoyé. |
| L7 | Le compteur « places restantes » : reflète-t-il une capacité réelle ? | Il est calculé à partir de la date ; un autre affiche « Juin » en octobre. |
| L8 | La source des chiffres « +30 clients », « 5/5 », « 1.43x », « 2x » | Aucune source affichée ; badges non rattachés clairement à un client. |
| L9 | Les vrais rôles des témoins (Julie Zagula, Antoine Troovy, Dominique Zenglein) | Rôles différents selon les pages. |
| L10 | Les couleurs officielles (dont l'orange de la pastille) et un éventuel logo source | Couleurs tirées du CSS exporté de Framer ; aucun fichier de charte dans le dépôt. |
| L11 | Ce que « World-class » veut dire pour toi | Le mot est partout, jamais défini. |
| L12 | Les mots ou sujets interdits | Je constate des absences, pas des interdits. |
| L13 | Ta position sur l'IA | Seule la landing SaaS (non indexée) en parle, contre les sites générés par IA. |
| L14 | La place de la landing SaaS anglaise dans ta stratégie | Non indexée, positionnement plus tranché que le site français. |
| L15 | Le marché visé (France, international) | Site bilingue, pages ville en `noindex`. |

Les questions te sont posées **une par une**, dans cet ordre, en commençant par L1.

### Réponses

*(vide — à remplir au fil des réponses)*
