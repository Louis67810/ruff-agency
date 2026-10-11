# Plan d'automatisation contenu, SEO/GEO et preuves clients — Ruff Agency

Date de l'audit : 13 septembre 2026

Priorité commerciale confirmée : création de sites internet et de landing pages.

## 1. Décision recommandée

Ne pas installer le pack Claude tel quel dans le projet. Réutiliser sa méthode et ses scripts utiles, mais les adapter à Codex et au format réel de Ruff Agency.

Le système cible doit fonctionner en cinq boucles :

1. collecter les données en lecture seule ;
2. décider des sujets à partir des recherches, sessions, conversions, concurrents et avis ;
3. produire un brouillon bilingue dans le format TypeScript du site ;
4. contrôler les sources, le rendu, le SEO et la traduction ;
5. mesurer après publication et réallouer l'effort vers les contenus qui produisent des demandes qualifiées.

La publication doit rester en pull request ou en branche de brouillon pendant les quatre premières semaines. L'automatisation complète ne doit être autorisée qu'après plusieurs cycles sans erreur.

## 2. Ce qui existe déjà dans le site

### Contenu et SEO

- Next.js 14 avec App Router.
- Site public : `https://ruff.agency`.
- Pages françaises et anglaises, avec URLs canoniques et `hreflang`.
- Articles stockés dans `lib/data/articles.ts` et traductions dans `lib/data/articles-en.ts`.
- 10 articles visibles et une page de démonstration `noIndex` au moment de l'audit.
- Types éditoriaux déjà riches : paragraphes, tableaux, graphiques, FAQ, citations, CTA, listes, images, vidéos et avant/après.
- JSON-LD `Article` et `BreadcrumbList` sur les articles.
- Sitemap dynamique et `robots.txt` ouvert.
- Auteur identifiable : Louis Staub, avec bio et page agence.

### Données de sessions et conversion

- Collecte interne des vues, sessions, visiteurs, temps par section, CTA, conversions, sources, campagnes, appareils et sorties.
- Stockage Supabase en production, avec repli local JSONL en développement.
- Tableau de bord protégé.
- La conversion principale détectée correspond au clic vers Cal.com ou vers `#book`.
- Le chemin de page est déjà attaché aux événements : les performances peuvent donc être agrégées par article.

### Avis et réalisations

- Des avis existent dans `app/saas-redesign/content.json`.
- Un éditeur local permet d'ajouter, modifier et ordonner les avis et réalisations.
- Plusieurs composants du site contiennent encore leurs propres listes d'avis : il n'existe pas encore de source unique avec provenance, accord de diffusion et statut.

### Déploiement

- Build OpenNext et déploiement Cloudflare déjà prévus.
- Git est présent, mais le plan ne suppose pas que la branche de production ou la CI soient validées avant vérification.

## 3. Écart principal avec le pack

Le moteur GEO du pack prévoit surtout des contenus Markdown/MDX dans un dossier `content`. Ruff Agency utilise des objets TypeScript structurés et deux fichiers FR/EN. Il faut donc un adaptateur `ruff-next-typescript` qui :

- génère un objet `Article` valide en français ;
- génère sa version anglaise liée au même slug ;
- utilise uniquement les blocs supportés par `ArticleBlock` ;
- refuse un graphique public sans données réelles ;
- ajoute les sources dans le champ `sources` ;
- met à jour l'inventaire et vérifie l'apparition dans le sitemap ;
- lance TypeScript, le build et une vérification visuelle ciblée avant livraison.

Sans cet adaptateur, le pack pourrait produire un bon article dans un format que le site ne rend pas.

## 4. Architecture proposée

```text
.agents/skills/
├── ruff-marketing-context/       mémoire, offre, cible, voix et décisions
├── ruff-data-reader/             lectures Search Console + Supabase + dépôt
├── ruff-content-strategy/        backlog et priorisation SEO/GEO
├── ruff-article-writer/          brouillon FR + EN dans le format Ruff
├── ruff-editorial-review/        sources, claims, traduction, SEO et rendu
├── ruff-internal-linking/        liens entrants/sortants et pages orphelines
├── ruff-competitor-watch/        pages et avis publics des concurrents
└── ruff-client-proof/            collecte, extraction et droits des témoignages

.marketing/
├── context/
│   ├── project.md
│   ├── audience.md
│   ├── offer.md
│   ├── voice.md
│   └── decisions.md
├── sources.json
├── queries/
│   ├── seo-page-performance.sql
│   ├── conversion-by-entry-page.sql
│   └── review-candidates.sql
├── content/
│   ├── inventory.md
│   ├── keywords.md
│   ├── backlog.md
│   ├── briefs/
│   └── reports/
├── competitors/
├── reviews/
└── runs/
```

Les noms `.marketing` et `.agents/skills` évitent de mélanger le contexte Ruff avec les fichiers `.claude` du pack. Les scripts réutilisés doivent être copiés et adaptés dans le dépôt, avec leur origine et leur version documentées.

## 5. Contrat de chaque skill

### `ruff-marketing-context`

Responsabilité : source de vérité courte et relisible par tous les autres skills.

Entrées : code du site, pages d'offre, contenus existants, décisions confirmées.

Sorties : offre, cible, objections, différenciation, voix, refus éditoriaux et décisions datées.

Règle : une automatisation écrit seulement dans le journal des exécutions ; elle ne modifie jamais seule l'offre, la cible ou le positionnement.

### `ruff-data-reader`

Responsabilité : produire un relevé normalisé, sourcé et daté.

Sources prioritaires :

1. Google Search Console : requêtes, pages, clics, impressions, CTR et position ;
2. Supabase analytics : sessions, engagement, CTA et conversions par chemin ;
3. dépôt Git : contenu publié, date, langue, maillage et changements ;
4. données de rendez-vous ou CRM, seulement si une source en lecture seule est disponible ;
5. avis et retours clients avec provenance.

Règle : une source est marquée `connectée` seulement après une lecture réelle. Aucun secret dans le dépôt. Supabase doit utiliser un rôle de lecture dédié, jamais la service-role key dans un script d'analyse planifié.

### `ruff-content-strategy`

Responsabilité : maintenir une file de sujets reliée à des intentions d'achat et à des preuves.

Priorité recommandée pour Ruff :

1. pages BOFU : comparatifs, alternatives, prix et choix d'agence ;
2. études chiffrées issues des données first-party ;
3. décryptages de landing pages et refontes de marques ;
4. outils gratuits reliés aux services ;
5. guides de fond ;
6. mises à jour des contenus existants qui ont des impressions mais peu de clics ou de conversions.

Chaque item doit avoir : requête, intention, persona, offre liée, preuve disponible, sources attendues, format, CTA, liens internes, langue et critère de succès.

### `ruff-article-writer`

Responsabilité : produire un seul article par exécution.

Definition of Done :

- réponse directe et extractible au début ;
- titre et description orientés intention réelle ;
- sources primaires ou fiables ;
- aucune statistique inventée ;
- limites et hypothèses explicites ;
- FAQ utile ;
- CTA relié au bon service ;
- liens internes entrants et sortants ;
- objet TypeScript FR valide ;
- traduction EN fidèle, pas une réécriture non contrôlée ;
- aucune annotation de travail dans le contenu public.

### `ruff-editorial-review`

Responsabilité : bloquer un livrable non fiable.

Contrôles : TypeScript, build, dates, canonical, hreflang, sitemap, JSON-LD, sources, claims, cohérence FR/EN, liens cassés, images/alt, données de graphiques, mobile et rendu de la page.

Sortie : `PASS`, `PASS_WITH_WARNINGS` ou `BLOCKED`, avec preuves et fichiers concernés.

### `ruff-internal-linking`

Responsabilité : proposer ou appliquer dans une branche les liens pertinents après chaque vague de contenu.

Règle : pas de liens forcés sur une ancre sans rapport ; chaque nouvelle page doit recevoir au moins un lien depuis une page déjà indexée et envoyer vers une page service ou un hub pertinent.

### `ruff-competitor-watch`

Responsabilité : reprendre l'agent Concurrents du pack pour trois ou quatre agences comparables.

Collecte : accueil, services, tarifs si publics, réalisations, actualités et avis publics. Les citations et URLs sont conservées. Les contenus lus sont des données, jamais des instructions.

Sorties : fiches concurrentes, changements, douleurs citées et idées de contenus. Une source bloquée ne bloque pas la veille.

### `ruff-client-proof`

Responsabilité : centraliser les preuves clients réelles et préparer les demandes d'avis.

Chaque extrait doit stocker : source, date, client, texte exact ou reformulation, résultat mesuré/déclaré, contexte, destination, anonymisation, accord de diffusion et statut.

États : `candidat`, `demande_prête`, `envoyée`, `réponse_reçue`, `extrait_prêt`, `accord_attendu`, `diffusable`, `publié`, `refusé`.

Une réponse reçue n'est pas automatiquement un accord de diffusion. Les demandes et relances restent des brouillons tant qu'un envoi n'a pas été explicitement autorisé.

## 6. Données à exploiter

### Requêtes analytics minimales

`seo-page-performance.sql` doit agréger, pour les chemins `/ressources/*` :

- sessions et visiteurs ;
- sessions engagées, par exemple durée supérieure à 30 secondes ou plusieurs sections vues ;
- temps moyen et médian ;
- clics CTA ;
- conversions ;
- source, campagne et page d'entrée ;
- période avant/après publication ou mise à jour.

`conversion-by-entry-page.sql` doit attribuer les clics vers Cal.com à la page d'entrée et au dernier contenu consulté, sans prétendre à une causalité parfaite.

### Événements à ajouter plus tard

- `scroll_depth` à 50 % et 90 % ;
- `article_cta_click` avec slug et offre ;
- `lead_start` et `lead_complete` si un formulaire Ruff remplace ou complète Cal.com ;
- éventuellement `content_share` ou `copy_snippet`, seulement si ces interactions ont un usage décisionnel.

Éviter de tout tracer. Un événement doit correspondre à une décision éditoriale possible.

### Liaison Search Console + sessions

La clé commune est l'URL canonique. Le rapport hebdomadaire doit distinguer :

- visibilité : impressions, position et requêtes ;
- acquisition : clics Search Console et sessions organiques ;
- engagement : lecture et navigation ;
- conversion : CTA et rendez-vous ;
- autorité : liens et citations IA, si une source fiable est disponible.

## 7. Boucle automatique recommandée

```text
Search Console + sessions + conversions + concurrents + avis
                           ↓
                  relevé hebdomadaire
                           ↓
             backlog priorisé et brief sourcé
                           ↓
                 article FR + version EN
                           ↓
             revue automatique + rendu local
                           ↓
                  branche / PR de brouillon
                           ↓
                    validation humaine
                           ↓
                      publication
                           ↓
             mesure J+7, J+14 et J+28
                           ↺
```

## 8. Cadence d'automatisation

### Phase pilote

- Lundi 06:45 : relevé Search Console + analytics + rapport des contenus.
- Lundi 07:15 : mise à jour du backlog et choix des deux meilleurs sujets.
- Mardi 07:00 : premier brouillon FR/EN.
- Jeudi 07:00 : second brouillon FR/EN.
- Chaque nuit 02:15 : veille concurrentielle silencieuse ; notification seulement en cas de changement significatif.
- Vendredi 08:00 : contrôle des articles publiés à J+7/J+14/J+28 et recommandations de mise à jour.
- Une fois par mois : audit des avis, permissions de diffusion et preuves manquantes.

Deux articles par semaine sont recommandés au départ. Le rythme quotidien du pack est trop agressif pour une agence dont les contenus doivent montrer du jugement, des sources et des exemples visuels.

### Conditions avant augmentation de cadence

- quatre semaines de cycles sans article invalide ;
- zéro chiffre non sourcé ;
- aucune casse FR/EN ou sitemap ;
- temps de relecture moyen acceptable ;
- premiers signaux de visibilité ou de conversion ;
- réserve d'au moins deux semaines de sujets validés.

## 9. Roadmap de mise en place sur quatre semaines

### Semaine 1 — Socle et sécurité

Objectif : obtenir un diagnostic fiable sans publication.

- créer `.marketing/` et les gabarits de contexte ;
- créer l'inventaire des pages et articles ;
- documenter la branche réellement déployée ;
- créer un rôle Supabase strictement en lecture pour les analyses ;
- écrire et tester les deux premières requêtes SQL ;
- connecter ou préparer Search Console en lecture seule ;
- choisir trois ou quatre concurrents ;
- définir les statuts et la provenance des avis.

Critère de sortie : un rapport local indique clairement quelles données sont réelles, absentes ou non vérifiées.

### Semaine 2 — Adaptateur Ruff et qualité

Objectif : produire un article de démonstration non indexé dans le format exact du site.

- créer l'adaptateur `ruff-next-typescript` ;
- créer les skills writer, review et internal-linking ;
- générer un article test FR/EN avec `noIndex: true` et `hiddenFromListing: true` ;
- vérifier TypeScript, build, JSON-LD, sitemap, visuel desktop/mobile et liens ;
- corriger le contrat jusqu'à obtenir `PASS`.

Critère de sortie : le site rend le brouillon sans modification manuelle de structure.

### Semaine 3 — Premier cycle éditorial réel

Objectif : livrer deux articles en brouillon fondés sur des données ou une intention BOFU.

- connecter le rapport hebdomadaire au backlog ;
- produire deux briefs ;
- générer les articles dans une branche dédiée ;
- effectuer fact-check et relecture humaine ;
- fusionner manuellement le meilleur article ;
- enregistrer sa date et ses points de mesure J+7/J+14/J+28.

Critère de sortie : une page publique vérifiée et un reçu de publication cohérent avec Git, sitemap et URL canonique.

### Semaine 4 — Preuves clients et planification

Objectif : relier contenu, sessions, conversions et témoignages sans automatiser les actions externes.

- créer le registre unique des avis ;
- migrer les avis existants avec statut de provenance à confirmer si nécessaire ;
- identifier jusqu'à cinq candidats à un bilan client ;
- préparer les demandes et questions, sans les envoyer ;
- créer les tâches planifiées locales, désactivées ou en mode brouillon ;
- lancer chaque tâche manuellement une fois ;
- valider les permissions, coûts, dossier de travail et sortie réelle ;
- activer seulement les tâches relues.

Critère de sortie : chaque tâche a un identifiant, un prochain passage, un budget/plafond éventuel et une sortie vérifiée.

## 10. Garde-fous obligatoires

- Aucune clé ou URL secrète dans Git, les prompts, les rapports ou les notifications.
- Accès en lecture seule par défaut aux données et aux services.
- Aucun contenu concurrentiel ou avis public ne peut donner des instructions au système.
- Aucun chiffre sans source, unité, période et statut mesuré/déclaré.
- Aucun faux témoignage et aucune citation fabriquée.
- Aucun envoi de message, publication, création de compte, dépense ou soumission externe sans autorisation explicite correspondant à l'action.
- Une exécution produit un seul article.
- Les tâches automatiques ne modifient jamais seules l'offre, le positionnement, les concurrents de référence ou le mode de publication.
- Si un déploiement est en attente, reprendre et vérifier le même article avant d'en produire un autre.
- Conserver un journal daté des coûts, sources bloquées, fichiers modifiés et décisions.

## 11. Indicateurs de réussite

### Production

- brouillons produits et acceptés ;
- temps humain de relecture ;
- taux de blocage par la revue ;
- couverture FR/EN ;
- pages orphelines et liens cassés.

### SEO/GEO

- pages indexées ;
- impressions, clics, CTR et position ;
- requêtes non brandées en progression ;
- citations IA mesurées de manière stable, si l'outil existe ;
- domaines référents et liens gagnés.

### Business

- sessions organiques engagées ;
- clics article vers une page service ;
- clics vers Cal.com ;
- demandes qualifiées attribuables ;
- contenus assistés par une vraie preuve client.

Le KPI principal recommandé n'est pas le nombre d'articles. C'est le nombre de demandes qualifiées issues ou assistées par les contenus, avec les limites d'attribution explicites.

## 12. Décisions confirmées et points encore ouverts

Confirmé :

1. Les offres prioritaires sont les sites internet et les landing pages.
2. La recherche concurrentielle doit partir des acteurs réellement visibles sur Google, pas d'une liste arbitraire.
3. Le membre est prêt à connecter Google Analytics ou les autres sources utiles si le mode d'accès est expliqué et limité.

Encore à confirmer :

1. L'accès disponible à Google Search Console.
2. Le statut réel de Supabase en production et la possibilité de créer un rôle de lecture dédié.
3. La branche qui déclenche le déploiement public.
4. Le mode souhaité pour les articles : fichiers locaux, branche Git ou pull request de brouillon.
5. Le temps hebdomadaire réaliste pour relire deux articles.
6. Pour chaque avis existant : source, verbatim ou reformulation, et accord de diffusion connu.

## 13. Ordre d'implémentation recommandé

Commencer par `ruff-marketing-context`, `ruff-data-reader` et l'adaptateur `ruff-next-typescript`. Ensuite seulement créer la génération d'articles. Ajouter la veille concurrentielle et les avis après que le format, la mesure et la revue fonctionnent. Activer les tâches planifiées en dernier.

Cet ordre permet d'obtenir rapidement une boucle vérifiable sans automatiser trop tôt la publication ni multiplier des contenus impossibles à mesurer.

## 14. Première cohorte concurrentielle issue de Google

Relevé effectué le 13 septembre 2026 sur les requêtes françaises `agence landing page France`, `agence création site internet France`, `agence webdesign SaaS France` et `agence landing page SaaS France`. Les deux requêtes SaaS ont été consultées sans personnalisation. Les positions sont des instantanés, pas des rangs universels : Google varie selon la localisation, l'appareil et l'historique.

### Cohorte principale recommandée

1. **Rainboow — rainboow.fr** : résultat organique majeur et présence dans l'aperçu IA sur les requêtes landing page et landing page SaaS. Positionnement proche : Webflow, SaaS, IA, design premium et conversion.
2. **SHFT — shft.design** : cité dans l'aperçu IA et visible organiquement sur `agence webdesign SaaS France`. Positionnement très proche de Ruff : sites et landing pages pour SaaS/startups, avec promesse de conversion.
3. **Clickway — clickway.fr** : visible sur la requête générale landing page. Positionnement Framer, pages de vente et sites orientés conversion.
4. **Beyonds — beyonds.fr** : premier acteur-agence visible après l'annuaire sur la requête générale de création de site internet. Offre plus large utile pour comparer l'architecture, les preuves et le maillage des pages service.

### Liste secondaire à observer

- **Trend Design — trend-design.fr** : landing pages orientées conversion et SEO, tarif fixe, délai annoncé et forte preuve d'avis visible dans Google.
- **Palmsquare — palmsquare.fr** : page dédiée bien positionnée, promesse tarifaire explicite.
- **Digidream — digidream-communication.com** : bien visible sur création de site internet et dispose d'un blog actif.
- **OOEO — ooeo.fr** : page sectorielle SaaS très directement alignée sur la requête `agence landing page SaaS France`.

Le premier cycle de l'agent Concurrents doit suivre les quatre membres de la cohorte principale. La liste secondaire sert à détecter les nouveaux formats, pages BOFU et sujets qui gagnent des positions.

## 15. Ordre de connexion des données Google

1. **Google Search Console d'abord** : c'est la source qui relie chaque page aux requêtes, impressions, clics, CTR et positions. Pour l'automatisation, privilégier une connexion OAuth locale en lecture seule ; le membre se connecte lui-même dans le navigateur et ne partage ni mot de passe ni jeton dans la conversation.
2. **Analytics Ruff/Supabase ensuite** : cette source existe déjà et mesure sessions, engagement, CTA et conversions par chemin. Créer un rôle SQL dédié en lecture seule avant de l'exposer aux tâches.
3. **Google Analytics 4 en complément** : utile pour comparer les canaux et les parcours, mais non bloquant puisque le site collecte déjà ses propres événements. Commencer par un export de rapport ou un accès `Lecteur` au niveau de la propriété ; ne jamais donner un rôle Éditeur ou Administrateur à un processus d'analyse.
4. **Cal.com ou CRM en dernier** : seulement si l'on veut mesurer les demandes réellement qualifiées après le clic. Utiliser un export minimal ou une lecture limitée, sans importer les notes privées inutiles.

Le premier rapport peut fonctionner avec Search Console et Supabase. GA4 ne doit pas retarder la mise en place du socle.
