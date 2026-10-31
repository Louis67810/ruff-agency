---
name: ruff-illustration-brief
description: Trouve l'idée et écrit le brief créatif d'une illustration Ruff Agency avant qu'elle soit dessinée. Part du bénéfice, cherche le moment qui le prouve et le contraste visible, compare plusieurs concepts avec une grille, planifie la série pour que les cartes ne se ressemblent pas, puis rédige une fiche de construction précise que ruff-design transcrit. À utiliser dès qu'il faut illustrer un bénéfice, une étape, une offre, un service ou une carte sur le site ou une page Ruff (« illustre ce bénéfice », « trouve une idée d'illustration », « les illustrations se ressemblent », « refais l'illustration de la carte X », « fais les illustrations de la page »), et avant toute illustration produite avec ruff-design.
metadata:
  version: "0.2.2"
  updated: "2026-10-27"
---

# Ruff Illustration Brief

**Une illustration Ruff prouve un bénéfice ; elle ne montre pas un mot-clé.** On ne pose pas « une interface » sous un titre. On cherche l'instant où le bénéfice se produit, le contraste qui le rend visible, et on le fige. Ce skill fait ce travail de réflexion et produit un brief ; `ruff-design` construit ensuite l'illustration à partir de sa fiche de construction.

Défaut d'origine de la v0.2 (Louis, 27/10/2026) : des illustrations qui se ressemblent, chacune étant une interface qui montre le mot du titre.

## Fichiers

| Où | Rôle | Quand l'ouvrir |
|---|---|---|
| `references/du-benefice-au-concept.md` | **La méthode** : l'échelle en 6 marches (changement, piège du mot-clé, moment-preuve, contraste, mécanique, phrase-concept) | **Toujours, en premier** |
| `references/analyse-references.md` | Les 12 références de Louis décortiquées (`references/refs/` : r01 à r09, et r10 à r12 de heysimon.fr pour le flou, les ombres et la composition) : ce que montre chaque carte et pourquoi c'est mieux qu'une interface | Toujours, avant de chercher |
| `references/mecaniques.md` | Catalogue des mécaniques (29), rangées en 5 familles, avec la façon de les dessiner chez Ruff, et les pièges refusés | Pendant la recherche d'idées |
| `references/inspirations.md` | Les illustrations de Louis lui-même (site, Figma, page SaaS) | Pour la finition |
| `references/grille.md` | Grille de notation sur 22 (dont 6 critères éliminatoires) | Pour choisir |
| `templates/plan-serie.md` | Le plan d'une série de cartes : mécaniques et familles toutes différentes | **Dès que la section a plusieurs illustrations** |
| `templates/brief.md` | Le brief d'une illustration, avec sa fiche de construction | Pour écrire |
| `examples/` | Briefs de référence (validés ou d'exemple) et contre-exemples | Avant de commencer |
| `brand/design/feedback.md` | Les règles validées par Louis (R1 et suivantes) | Toujours : un brief n'en enfreint aucune |
| `evals/evals.json` | Résultats attendus (mot-clé, série, pas d’illustration, référence sombre) | Pour tester le skill après une modification |

## Déroulé

0. **Faut-il une illustration ?** (R41, R42) Par défaut, non :
   - une section de texte (problème, argument, conclusion) n'en a pas ;
   - pour des **exemples ou des résultats**, on prévoit un emplacement média (vidéo ou capture réelle).

   On n'illustre que des cartes de bénéfice, des visuels d'étapes et des cartes d'offre, de service ou de contenu. Si la réponse est non, l'écrire, et s'arrêter.
1. **Plusieurs illustrations dans la section ? Faire d'abord le plan de série** (`templates/plan-serie.md`) : la structure de la grille, puis une ligne par carte (moment-preuve, contraste, mécanique, famille, objet central). On l'écrit **avant** les briefs : c'est là qu'on évite les cartes qui se ressemblent.
2. **Monter l'échelle en 6 marches** pour chaque carte (`du-benefice-au-concept.md`) :
   1. le changement (avant → après) ;
   2. le piège du mot-clé, écrit puis interdit ;
   3. le moment-preuve ;
   4. le contraste ;
   5. la mécanique ;
   6. la phrase-concept.

   Si le changement ne s'écrit pas, demander à Louis ce qui change concrètement pour le client.
3. **Chercher 5 idées**, chacune avec une mécanique différente, en s'appuyant sur `analyse-references.md` et `mecaniques.md`.
4. **Noter** chaque idée avec `grille.md` (sur 22, seuil 17). Écarter toute idée qui a un 0 sur un critère ✱.
5. **Choisir** la meilleure, garder la deuxième en réserve, expliquer en une phrase.
6. **Écrire le brief** (`templates/brief.md`), et surtout **la fiche de construction** : une ligne par élément, du fond vers l'avant, avec contenu exact, position, taille, opacité et classe `rf-*`. C'est ce qui permet de transcrire l'idée en design sans la perdre.
7. **Revérifier la série** une fois tous les briefs écrits (cases du plan de série).
8. **Passer la main** à `ruff-design`. La phrase-concept va dans le commentaire HTML au-dessus de la scène ; la fiche de construction se suit ligne par ligne.

## Règles du brief
- **Un moment, pas un écran.** L'interface est le décor ; le sujet est l'instant (un clic, un tri, un agenda rempli, une option choisie).
- **Un contraste visible** : beaucoup → un, désordre → ordre, gris → couleur, vide → plein, caché → mis en avant, seul → ensemble.
- **Jamais l'image du mot-clé** : pas de bouclier pour « sécurité », de tableau de bord pour « efficace », de calendrier coché pour « réserver ».
- **On illustre l'idée, pas la phrase (R10).**
- **Un objet central concret et riche (R18)**, au moins 12 éléments. Jamais deux petits éléments reliés.
- **Contenu spécifique** : les vrais libellés du métier du client et des curseurs nommés. **Rien d'inventé comme preuve** : ni chiffre, ni logo client, ni résultat.
- **Un seul accent** (bleu `#0147FF`, cadre de sélection, curseur « Vous » `.rf-pointer` ou une couleur sur du gris). Le reste est estompé, coupé ou en fondu.
- **Une seule couleur d'accent (R60)** : gris, blanc et un accent ; titres de maquette en barres grises. **Visiteurs = icône grise (R61)**, memoji coloré seulement pour des clients.
- **Sobriété (R16).** Cadre de sélection et pastilles rares (R30, R35). Ni schéma (R29), ni pointillés (R17, R27), ni ronds à ondulations (R9), ni sombre dans du clair (R3).
- **Prendre la pensée des références, pas leur style.** Les références sombres ou néon donnent la mécanique, jamais le rendu.

## Boucle de retours
- Retour de Louis sur une illustration : l'ajouter, avec ses mots, dans `brand/design/feedback.md` (règle numérotée).
- Si le défaut vient de l'idée (et non du dessin) : l'ajouter aussi dans `mecaniques.md` (« Pièges ») et dans `examples/contre-exemples.md`.
- Nouvelles références envoyées par Louis : les copier dans `references/refs/`, les décortiquer dans `analyse-references.md` et ajouter les mécaniques nouvelles à `mecaniques.md`.
- Une illustration validée par Louis devient un brief de référence dans `examples/`.
- Incrémenter la version de ce skill.
