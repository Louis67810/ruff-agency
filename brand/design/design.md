# Design — Ruff Agency (v0.1)

> Toutes les règles ci-dessous sont **à valider** tant que tu ne les as pas confirmées.
> Statuts : **CONSTANT** = appliqué partout (règle) · **VARIABLE** = appliqué de façon incohérente (signalé, pas tranché) · **UNIQUE** = une seule occurrence (candidat zone designer / *manual work pick*).
> Confiance : haut / moyen / bas.

## Règles validées par Louis (26/10/2026)

Les règles R1 à R12 de [feedback.md](feedback.md) remplacent ce document là où ils divergent. En résumé :
- toutes les cartes teintées ou aucune, chacune d'une teinte HSL différente (C7, C12) ;
- pas de bloc sombre dans une section claire (C13 ne doit pas se combiner avec des cartes claires) ;
- cadre de sélection en `#0147FF` exact ;
- ombres exactes du site, et pas d'ombre sur un élément imbriqué ;
- curseur du site ;
- fondu sous le texte ;
- pas de ronds à ondulations ;
- un seul style de bouton dans les maquettes ;
- illustrations conceptuelles ;
- versions conservées (`versions/`, `sections/*-vN.html`).

## Méthode

- Analyse des 39 feuilles CSS du site public : `components/sections/*`, `components/navigation`, `components/footer`, `components/ui`, `components/exact-process-cards.module.css`, `app/saas-redesign/*.css`. Les outils internes (`app/behavioral-intelligence`, analytics, éditeurs) sont exclus.
- Comptage des valeurs (couleurs, rayons, tailles…) par fichier : « 36/39 » veut dire « présent dans 36 des 39 fichiers ».
- Contrôle visuel sur les captures `public/behavioral-previews/*.png` (1440×900, datées du 20/09/2026) et sur le site en ligne `https://ruff.agency` (lu le 25/10/2026).
- Les dossiers `*-preview-ready/` et `*-COMPLETE/` à la racine sont des copies d'export des sections : ignorés pour éviter les doublons.

---

## 1. Couleurs

| # | Valeur | Usage observé | Statut | Confiance | Source | Validation |
|---|---|---|---|---|---|---|
| C1 | `#121A2E` / `rgb(18,26,46)` — bleu nuit | Couleur du texte principal et des titres ; fond de la page `/services` (thème sombre) | CONSTANT (36/39 fichiers) | haut | `components/ui/Cta.css`, `components/navigation/NavBar.css`, `app/services/page.tsx:25` | à valider |
| C2 | `rgba(18,26,46,.7)` | Texte secondaire (sous-titres, paragraphes) | CONSTANT (22/39), mais l'opacité varie : `.7` / `.71` | moyen | `components/sections/ArticleQuiz/ArticleQuiz.css`, sections hero | à valider |
| C3 | `#0147FF` / `rgb(1,71,255)` — bleu électrique | Couleur d'accent : fin du dégradé du bouton principal, petits libellés au-dessus des titres (*eyebrows*), barres de progression | CONSTANT (26/39) | haut | `components/ui/Cta.css`, `ArticleQuiz.css` | à valider |
| C4 | `rgb(78,125,250)` → `#0147FF` | Dégradé du bouton principal (90°) | CONSTANT sur les boutons principaux | haut | `components/ui/Cta.css`, `NavBar.css` | à valider |
| C5 | Angle et sens du dégradé bleu | 90° (bouton), 161° (survol), 110°, 96.83°, 65° inversé `#0145F8 → #4F7EFB` | VARIABLE | moyen | 110° : `FreeToolDetail/RedesignRoiTool.css` · 65° : `ArticleQuiz.css`, `CtaAuditRealisationsSlug.css` | à valider |
| C6 | `rgb(14,65,199)` / `rgb(46,77,156)` | Bord intérieur bas et bordure du bouton principal (effet « bouton physique ») | CONSTANT (18/39) | haut | `components/ui/Cta.css` | à valider |
| C7 | Fond de page | `#FBFBFB` (body), `rgb(249,251,255)` (héros À propos, Réalisations, étude de cas, 404), `#FFF` (cartes) | VARIABLE | haut | `app/globals.css:9`, `Hero2Optimized.css`, `HeroRealisations.css`, `HeroCaseStudy.css` | à valider |
| C8 | `#0D152A` — bleu nuit plus foncé | Ressources, outils gratuits, landing SaaS | VARIABLE (6/39, coexiste avec C1) | moyen | `RessourceArticle.css`, `RedesignRoiTool.css`, `SaasRedesignPricing.css` | à valider |
| C9 | Ombres en `rgba(0,0,0,.01→.15)` et `rgba(107,107,107,.01→.05)` | Toutes les élévations : noir ou gris très transparent, jamais coloré (sauf le bouton bleu) | CONSTANT | haut | voir §5 | à valider |
| C10 | Pastille de disponibilité orange | « X places restantes pour [mois] » | CONSTANT sur les héros | moyen | animation Lottie dans `HeroOptimized.tsx` — **valeur exacte non déterminée** | à valider |
| C11 | Vert WhatsApp | Bouton rond WhatsApp dans la navigation (point rouge de notification) | CONSTANT dans la navigation | haut | `NavBar.jsx`, captures | à valider |
| C12 | Dégradés pastel `#FFFCF1`, `#FFF1F1`, `#F1F7FF` → blanc | Encadrés d'article | UNIQUE (un seul fichier) | moyen | `RessourceArticle/RessourceArticle.css` | à valider |
| C13 | Thème sombre complet | Seule la page `/services` passe la navigation et le héros en fond `#121A2E` | UNIQUE | haut | `app/services/page.tsx:25`, capture `services.png` | à valider |

Aucune couleur de marque secondaire (jaune, vert, violet…) n'est utilisée dans l'interface. Les couleurs vives viennent des captures de projets clients. **Confiance : moyen.**

## 2. Typographies

| # | Règle | Statut | Confiance | Source | Validation |
|---|---|---|---|---|---|
| T1 | **Plus Jakarta Sans** pour les titres (47 règles de titre sur 64 l'utilisent) | CONSTANT | haut | `app/fonts.css`, sections | à valider |
| T2 | **Inter** pour le texte courant, les boutons et la navigation | CONSTANT | haut | `components/ui/Cta.css` (`.cta-label`), `app/layout.tsx` (préchargement Inter) | à valider |
| T3 | Titres en graisse 700, approche serrée `-0.04em` à `-0.05em` | CONSTANT | moyen | `ArticleQuiz.css` (`font:700 32px … -0.05em`), captures | à valider |
| T4 | Texte courant en graisse 500 (et non 400), approche `-0.03em` | CONSTANT (500 = 148 occurrences ; 400 = 22) | haut | décompte CSS | à valider |
| T5 | Échelle de tailles la plus utilisée : 14 · 16 · 18 · 20 · 24 · 32 · 48 · 56 · 64 · 80 px | CONSTANT pour 16/18/32 ; échelle globale VARIABLE (13, 15, 17, 19, 22, 25, 26, 28 px aussi présents) | moyen | décompte CSS | à valider |
| T6 | 17 règles de titre utilisent Inter au lieu de Plus Jakarta Sans | VARIABLE | moyen | décompte CSS | à valider |
| T7 | Écriture de `font-family` hétérogène (`'Inter'`, `Inter, sans-serif`, `"Inter Placeholder"`…) | VARIABLE (technique, sans effet visible) | haut | décompte CSS | à valider |
| T8 | Polices chargées depuis `framerusercontent.com` | CONSTANT | haut | `app/fonts.css`, `app/layout.tsx:27` | à valider |

## 3. Espacements et grille

| # | Règle | Statut | Confiance | Source | Validation |
|---|---|---|---|---|---|
| E1 | Écarts les plus fréquents : 8 · 10 · 12 · 16 · 24 · 32 · 48 · 64 px | CONSTANT | moyen | décompte `gap` | à valider |
| E2 | Valeurs isolées hors échelle (4, 5, 6, 7, 9, 20 px) | VARIABLE | moyen | décompte `gap` | à valider |
| E3 | Points de rupture : ≤809 px (mobile), 810–1399 px (tablette), ≥1400 px (desktop) — hérités de Framer | CONSTANT (97 requêtes à 809 px) | haut | décompte `@media` | à valider |
| E4 | Autres points de rupture : 520, 600, 900, 1100 px | VARIABLE | haut | décompte `@media` | à valider |
| E5 | Largeurs de contenu 1324 px et 1054 px | CONSTANT (27 occurrences chacune) | moyen | décompte `max-width` | à valider |

## 4. Rayons

| # | Règle | Statut | Confiance | Source | Validation |
|---|---|---|---|---|---|
| R1 | Bouton : 10 px à l'intérieur, 15 px pour le cadre extérieur | CONSTANT | haut | `components/ui/Cta.css` | à valider |
| R2 | Grandes cartes et blocs d'aperçu : 32 px | CONSTANT (14 fichiers) | haut | `RealisationsOptimized.css`, `HomepageReviewCard.css`, `ServicePageTop.css`… | à valider |
| R3 | Blocs « outil » (quiz, simulateur, héros d'article) : 52 px | VARIABLE (3 fichiers) | haut | `ArticleQuiz.css`, `RedesignRoiTool.css`, `HeroSectionSlugRessource.css` | à valider |
| R4 | Plus de 20 rayons différents (6, 8, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 40 px…) | VARIABLE | haut | décompte `border-radius` | à valider |
| R5 | Avatars et pastilles : 50 % / 999 px | CONSTANT | haut | décompte | à valider |

## 5. Ombres

| # | Règle | Statut | Confiance | Source | Validation |
|---|---|---|---|---|---|
| O1 | Ombres en plusieurs couches très diffuses (3 ou 4 couches de 0,01 à 0,1 d'opacité), typiques d'un export Framer | CONSTANT | haut | `ArticleQuiz.css`, `SectionAvis`, `HomepageReviewCard.css` | à valider |
| O2 | Bouton principal « en relief » : reflet blanc en haut, bord bleu foncé en bas, ombre portée bleutée | CONSTANT | haut | `components/ui/Cta.css` | à valider |
| O3 | Cadre gris clair `rgb(225,228,237)` autour du bouton principal (effet « socle ») | CONSTANT sur le bouton principal | haut | `components/ui/Cta.css` (`.cta-primary`) | à valider |
| O4 | Bordures épaisses blanches (6–7 px) autour de certaines cartes | VARIABLE | moyen | décompte `border` | à valider |
| O5 | Effet de flou d'arrière-plan (*backdrop-filter*) | VARIABLE (navigation, CTA audit, simulateur, landing SaaS) | moyen | `NavBar.css`, `CtaAuditRealisationsSlug.css`, `RedesignRoiTool.css` | à valider |

## 6. Composants

### 6.1 Boutons — `components/ui/Cta.jsx`

| # | Règle | Statut | Confiance | Validation |
|---|---|---|---|---|
| B1 | **Bouton principal** : dégradé bleu, texte blanc Inter 500 16 px, hauteur 48 px, **photo du fondateur (28 px) à droite du libellé** | CONSTANT (héros, navigation, tarifs, FAQ) | haut | à valider |
| B2 | Survol du bouton principal : dégradé plus sombre (161°), ombre plus longue, la photo pivote de 10° | CONSTANT | haut | à valider |
| B3 | **Bouton secondaire** : fond blanc, bordure `rgba(0,0,0,.15)`, rayon 10 px, texte `#121A2E` ; survol fond `#F0F0F0` | CONSTANT | haut | à valider |
| B4 | Paire systématique « secondaire à gauche, principal à droite » dans les héros (« Voir nos réalisations » + « Réserver un appel ») | CONSTANT (accueil, À propos, Réalisations, Services, landing SaaS) | haut | à valider |
| B5 | Variante avec flèche (`showArrow`) | VARIABLE (landing SaaS) | moyen | à valider |
| B6 | Libellés d'action différents pour la même destination `/30-min` : « Réserver un appel », « Commencer mon projet », « Je lance mon projet maintenant », « Book a Call » | VARIABLE | haut | à valider |
| B7 | État clavier `:focus-visible` présent dans 9 fichiers sur 39 ; absent du bouton principal | VARIABLE | haut | à valider |
| B8 | État `:disabled` : seulement dans les formulaires et outils (4 fichiers) | VARIABLE | moyen | à valider |

### 6.2 Navigation — `components/navigation/NavBar.jsx` / `NavBar.css`

| # | Règle | Statut | Confiance | Validation |
|---|---|---|---|---|
| N1 | Logo « RUFF » (bloc noir incliné) + « .agency » à gauche · liens Accueil / Réalisations / Services ▾ / Ressources ▾ au centre · WhatsApp + langue + bouton principal à droite | CONSTANT (toutes les pages vitrine) | haut | à valider |
| N2 | Survol des liens : fond `rgba(0,0,0,.03)` ; survol WhatsApp : agrandissement ×1,05 | CONSTANT | haut | à valider |
| N3 | Couleur de fond de la navigation réglée page par page (`fill`) : transparent, `#FBFBFB`, `rgb(249,251,255)`, `#121A2E` | VARIABLE | haut | à valider |
| N4 | Navigation réduite (logo + langue + bouton) sur la landing SaaS | UNIQUE | haut | à valider |

### 6.3 Cartes

| # | Règle | Statut | Confiance | Source | Validation |
|---|---|---|---|---|---|
| K1 | Carte témoignage : citation, nom, rôle, photo ; souvent un badge résultat (« 2x plus de conversion », « Image de marque unique ») | CONSTANT | haut | `SectionAvis`, `HomepageReviewCard.tsx`, `AvisOptimized` | à valider |
| K2 | Carte projet : capture du site client + nom + catégorie (SaaS, Agence, PME, Indépendant) + description | CONSTANT | haut | `RealisationsOptimized.tsx`, `lib/data/projects.ts` | à valider |
| K3 | Carte tarif unique (« Landing Page — 1 765 € ») avec options payantes, liste d'inclusions et garantie | UNIQUE (une seule offre chiffrée) | haut | `PrixOptimized.tsx` | à valider |
| K4 | Tableau comparatif en 3 colonnes : Ruff agency / Agence traditionnelle / Faire soi-même | CONSTANT (accueil, toutes les pages service, pages ville) | haut | `ComparatifOptimized.tsx` | à valider |
| K5 | Cartes d'étapes de processus (Étape 1, 2, 3) avec animations Lottie | CONSTANT | haut | `ProcessusOptimized.tsx`, `public/assets/process-lottie/` | à valider |

### 6.4 Formulaires

| # | Règle | Statut | Confiance | Source | Validation |
|---|---|---|---|---|---|
| F1 | Prise de rendez-vous par calendrier intégré (« Appel de découverte · +Audit de votre site offert · 30 min ») | UNIQUE (page `/30-min`) | haut | `CallBooking.tsx`, capture `30-min.png` | à valider |
| F2 | Formulaire d'audit en plusieurs étapes (site, e-mail, « Tranche de CA »), en fin d'étude de cas | UNIQUE | moyen | `CtaAuditRealisationsSlug.jsx` | à valider |
| F3 | Formulaire de brief (landing SaaS) | UNIQUE | moyen | `app/saas-redesign/brief/` | à valider |
| F4 | Style des champs : pas de règle commune (chaque formulaire a son propre CSS) | VARIABLE | moyen | — | à valider |
| F5 | États des champs (focus, erreur, succès) | **non déterminé** (pas analysé champ par champ) | bas | — | à valider |

## 7. Patterns de mise en page récurrents

| # | Pattern | Statut | Confiance | Source | Validation |
|---|---|---|---|---|---|
| P1 | Héros centré : preuve sociale (6 avatars + « +30 clients satisfaits ») → grand titre en 2 lignes → sous-titre gris → paire de boutons → « X places restantes pour [mois] » | CONSTANT (À propos, Services, Réalisations, 30-min) | haut | captures `agence.png`, `services.png`, `realisations.png`, `30-min.png` | à valider |
| P2 | Héros de l'accueil aligné à gauche, avec une mosaïque inclinée de captures de projets à droite | UNIQUE | haut | `home.png`, `HeroOptimized.tsx` | à valider |
| P3 | Suite de sections commune à l'accueil et aux pages service : Bénéfices → Processus → Avis → Comparatif → Réalisations → Prix → Avis (bandeau) → FAQ + appel → Pied de page | CONSTANT | haut | `app/page.tsx`, `app/services/*/page.tsx`, `app/ville/[slug]/page.tsx` | à valider |
| P4 | Carrousels défilants (*tickers*) de captures de projets | CONSTANT | moyen | `HeroContent.jsx`, `PrixOptimized.tsx` | à valider |
| P5 | Grandes formes vectorielles décoratives pâles en arrière-plan des héros (apparition en fondu après 1 s) | CONSTANT | haut | `app/globals.css:14-25`, captures | à valider |
| P6 | Avant / après sur les études de cas | VARIABLE (selon le projet : `visibiliteAvantApres`) | haut | `lib/data/projects.ts` | à valider |
| P7 | Vidéo / lecteur dans le haut des pages service | CONSTANT sur les pages service | moyen | `ServicePageTop.tsx` | à valider |
| P8 | Animations désactivées si l'utilisateur le demande (`prefers-reduced-motion`) | VARIABLE (19/39 fichiers) | haut | décompte CSS | à valider |
| P9 | Aucun mode sombre automatique (`prefers-color-scheme` : 0 fichier) | CONSTANT | haut | décompte CSS | à valider |

## 8. Images

| # | Règle | Statut | Confiance | Source | Validation |
|---|---|---|---|---|---|
| I1 | Le visuel principal, ce sont les **captures des sites clients** (héros, cartes, tickers, avant/après) | CONSTANT | haut | `public/landing-assets/*`, `lib/data/projects.ts` | à valider |
| I2 | La **photo du fondateur** apparaît dans chaque bouton principal, dans la FAQ et dans la section « mission » | CONSTANT | haut | `components/ui/Cta.jsx` (`PROFILE_IMAGE`) | à valider |
| I3 | Photos réelles des clients dans les témoignages | CONSTANT | haut | `SectionAvis`, `projects.ts` | à valider |
| I4 | Illustrations 3D / pictogrammes de bénéfices | VARIABLE | bas | `public/landing-assets/saas-redesign/benefits/` — provenance **non déterminée** | à valider |
| I5 | Banque d'images | **non déterminé** : aucune photo de banque d'images identifiée dans les pages lues, mais je n'ai pas vérifié la provenance de chaque image | bas | — | à valider |

## 9. Zones candidates pour un designer (UNIQUE)

- Héros de l'accueil avec mosaïque inclinée (P2)
- Thème sombre de `/services` (C13)
- Carte tarif unique et options (K3)
- Calendrier de réservation `/30-min` (F1)
- Formulaire d'audit en étapes (F2)
- Encadrés pastel des articles (C12)
- Navigation réduite de la landing SaaS (N4)
