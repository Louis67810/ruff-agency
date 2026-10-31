---
name: ruff-design
description: Crée et corrige des sections, cartes, illustrations, composants et maquettes dans le style visuel de Ruff Agency (ruff.agency), et intègre les retours de Louis sur le design. À utiliser pour toute demande visuelle sur le site ou la marque Ruff, même formulée simplement (« fais-moi une section », « illustre ce bénéfice », « refais cette carte », « j'ai des retours sur la v3 », « récupère ma sélection Figma »), même sans dire « style », « design system » ou « Ruff ».
metadata:
  version: "0.14"
  updated: "2026-10-27"
---

# Ruff Design

**Le dessin doit expliquer le bénéfice.** Une illustration Ruff, c'est un objet d'interface central, détaillé et sobre, qui traduit une idée. Ce n'est ni un nuage d'éléments flottants, ni la phrase du titre mise en image.

Version 0.14 (30/10/2026). Les règles R1 à R62 sont validées par Louis (`brand/design/feedback.md`). Leur forme courte, avec le défaut qui les a fait naître, est dans `references/craft.md`.

## Fichiers

| Où | Rôle | Quand l'ouvrir |
|---|---|---|
| `brand/design/feedback.md` | Les règles validées et les mots de Louis, mot pour mot | **Toujours, en premier** |
| `references/craft.md` | Les règles en forme courte, chacune avec son défaut d'origine | Toujours |
| `references/structure.md` | Grammaire de page de la page SaaS : fonds, typographie, cartes, étapes, avant / après, réassurance, colonnes | **Avant toute page ou section**, avant d'illustrer |
| `brand/design/components/` | HTML réel du footer et de la FAQ du site, Heroicons | Pour toute page (R21, R36) |
| `references/illustration.md` | Méthode : concept → liste d'éléments → pattern → scène | Avant de dessiner |
| Skill `ruff-illustration-brief` (v0.2) | Trouver l'idée (moment-preuve, contraste, mécanique), planifier la série, écrire le brief et sa fiche de construction | Pour chaque illustration nouvelle, et pour toute section qui en a plusieurs (plan de série) |
| `references/verify.md` | Audit, rendus, checklist, défauts fréquents | Avant de livrer |
| `references/figwright.md` | Lire Figma (lecture seule) | Quand Louis parle de Figma |
| `examples/README.md` | Exemples de référence et contre-exemples | Avant de commencer : ouvrir le plus proche |
| `evals/evals.json` | Grilles de résultat attendu | Pour tester le skill après une modification |
| `scripts/audit.mjs` | Audit des règles : doit afficher `audit passed` | Avant de livrer |
| `scripts/render.mjs` | Rendus desktop, mobile 375 px et gros plan ×2 | Avant de livrer |
| `scripts/fwdaemon.mjs`, `scripts/summarize.mjs` | Serveur Figwright permanent, résumé d'arbre Figma | Avec `figwright.md` |
| `brand/design/ruff-tokens.css` | Variables et classes `rf-*` (le kit) | Toujours : ne pas inventer de valeurs |
| `brand/design/banque.html` | Vitrine de chaque composant | Pour trouver une brique |
| `brand/design/figma/` | Captures et analyse des designs de Louis (F1 à F5) | Pour la finition |
| `brand/voix/voix.md` | La voix | Pour écrire les textes |

## Déroulé (dans cet ordre)

**Une page se fait en deux temps (R46).**
- **Temps 1** : structure, copy et design de toutes les sections, **sans illustrations**. À leur place, un emplacement neutre marqué `[Illustration à venir : <idée en une ligne>]`. On livre, Louis commente, on itère jusqu'à ce que la structure soit validée.
- **Temps 2** : les illustrations, une par une, avec le skill `ruff-illustration-brief`, puis les étapes 4 à 6 ci-dessous.

1. **Lire** `feedback.md` puis `references/craft.md`.
2. **Ouvrir l'exemple le plus proche** (`examples/README.md`). S'il s'agit de retours sur une version : partir de cette version, sans jamais la modifier.
3. **Poser la structure d'abord** (`references/structure.md`) :
   - alterner les fonds ;
   - utiliser la typographie et les cartes de la page SaaS ;
   - prendre le footer et la FAQ réels.

   Une page n'est jamais illustrée avant d'être propre sans ses illustrations.
4. **Pour chaque illustration, écrire le brief** avec le skill `ruff-illustration-brief` (plan de série d'abord si la section en a plusieurs). Mettre sa phrase-concept (« Objet central : X. On voit : Y. Le contraste : Z. Ça prouve : W. ») dans un commentaire HTML au-dessus de la scène, puis **suivre sa fiche de construction ligne par ligne** (R56).
5. **Lister au moins 12 éléments** de l'objet central, par rôle (structure, contenu, signal, contexte).
6. **Choisir le pattern** (F1 à F5, `references/illustration.md`), et pour chaque objet décider s'il **descend** (fondu) ou s'il **flotte** (entier).
7. **Construire** avec les classes `rf-*` uniquement, dans un nouveau fichier qui importe `../ruff-tokens.css` :
   - `brand/design/sections/<section>-vN.html` pour une section ;
   - `brand/design/pages/<page>-vN.html` pour une page complète, comme la landing du Blueprint.

   Pour une page longue, passer une hauteur suffisante à `render.mjs` (troisième argument), sinon le bas de page n'est pas rendu.

   **Nouvelle page** : ne pas repartir de zéro.
   1. Écrire uniquement son `<main>` (`pages/src/<page>-v1.main.html`) et ses styles propres (`<page>-v1.css`).
   2. Créer le gabarit avec `node pages/src/make-page.mjs <gabarit validé> <main> <sortie.src.html> <titre> <bouton nav> <lien> <commentaire> <css>`.
   3. Assembler avec `pages/src/build.mjs <src> <sortie.html> [faq.json] [reviews.json]`.

   Les styles, la navigation, le footer, la FAQ et les avis restent ainsi identiques d'une page à l'autre.
8. **Auditer** : `node .claude/skills/ruff-design/scripts/audit.mjs <fichier>`, jusqu'à `audit passed`.
9. **Rendre et regarder** : `node .claude/skills/ruff-design/scripts/render.mjs <fichier>`. **Lire chaque PNG**, recadrer chaque carte du gros plan, puis passer la checklist de `references/verify.md`. Recommencer jusqu'à ce que tout soit coché.
10. **Livrer** : la capture desktop, et ce qui a changé par rapport à la version précédente.
11. **Boucle de retours** : quand Louis commente, suivre la section ci-dessous. **Appliquer chaque retour partout où il a du sens (R39).**

## Règles express (détail et défauts dans `references/craft.md`)

**Structure de page** (`references/structure.md`)
- Footer et FAQ réels du site.
- Fonds alternés (`#FBFBFB` / `#FFF` / `#F5F5F5` / bleu en **dégradé**, jamais en aplat).
- H2 d'une seule couleur (bicolore une fois par page au plus).
- Cartes et étapes de la page SaaS.
- Réassurance en Heroicons, jamais en points.
- Pas de MAJUSCULES en libellé, pas de contenu dans un contenu, pas d'étiquette décorative, pas de schéma posé au milieu d'une section.
- Pastilles et cadres de sélection uniquement dans les illustrations, rarement, et sur l'objet entier.
- Footer sans bandeau d'appel si la page a déjà son appel final.
- Peu d'illustrations, et des emplacements média pour les exemples.
- H1 de 64 px au plus.
- Flèche de défilement dans un tag avec ombre.
- Avis avec photo à contour, en vrai ticker pleine largeur.
- Héros sur gb(249,251,255) avec les formes SVG du site (et environ 2 sections sur 10), toujours sur les bords.
- Jamais une section « titre + contenu empilé » ; une offre = un logo à côté de son nom.
- Appel final : dégradé facultatif (R54). Si l'appel est « réserver un appel », l'agenda Cal.com intégré remplace le bouton, et les autres boutons pointent vers `#reserver` (R55).
- Grilles de cartes illustrées : 2 × 2 à filets, bento mixte, 3 × 2 teintée, carrousel, carte centrale (`structure.md`).

**Couleur**
- Cartes toutes teintées (`--rf-tint-*`, une teinte différente chacune) ou aucune.
- Jamais de sombre dans une section claire.
- Un seul accent bleu `#0147FF`.

**Formes**
- Ombres du site uniquement.
- Aucune ombre sur un élément imbriqué (sauf les `.rf-dot`).
- Cercles : ombre en diagonale `--rf-shadow-dir`.

**Maquettes**
- Logo gris.
- Boutons `#333`.
- Petits ronds = `.rf-dot`.
- Cadre de sélection #0147FF aux poignées arrondies.
- Curseur `.rf-pointer` (R57) : pointe en haut à gauche, étiquette pastel « Vous », 5 couleurs.
- Loupe `.rf-loupe` (R58) : ombre commune au verre et au manche, manche foncé. Arrière-plan flouté `.rf-blur` et ombre `--rf-shadow-soft` possibles (inspiration heysimon).

**Composition**
- Une illustration prouve un bénéfice (moment + contraste), jamais l'image du mot-clé (R56).
- Un objet central détaillé (≥ 12 éléments).
- Un objet qui descend finit en fondu ; un objet qui flotte reste entier.

**Interdits**
- pointillés ondulés ;
- ronds à ondulations ;
- icônes 3D ;
- personnages dessinés ;
- banque d'images ;
- deux éléments reliés pour toute illustration.

**Bouton principal**
- Socle gris, dégradé bleu, photo de Louis, 60 px de haut. Secondaire blanc à gauche.

**Typo**
- Titres en Plus Jakarta Sans 700 serré, H2 bicolore.
- Titres de carte en Inter 600 24 px, textes en Inter 500.

**Références**
- Prendre la finition, pas l'objet.

**Textes**
- Vouvoiement, pas d'emoji, aucun chiffre inventé.
- Exception (R20) : la landing « Ruff Agency Blueprint » et tout ce qui touche au lead magnet (remerciement, emails) sont **tutoyés**.

## Boucle de retours

1. Copier le retour **mot pour mot** dans le journal de `feedback.md`, avec la date et la version.
2. Le traduire en règle numérotée (R20 et suivantes), **avec le défaut d'origine**. L'ajouter à `references/craft.md`. Si elle se vérifie dans le code, l'ajouter aussi à `scripts/audit.mjs`, et vérifier que l'audit échoue sur l'ancienne version.
3. Si les tokens changent :
   1. figer l'ancienne feuille dans `brand/design/versions/ruff-tokens-vX.css` ;
   2. y faire pointer les anciennes sections ;
   3. figer aussi `banque.html`.
4. Créer la version suivante de la section (R12 : ne jamais écraser une version).
5. Une carte validée par Louis va dans `examples/README.md`.
6. Incrémenter la version de ce skill.
