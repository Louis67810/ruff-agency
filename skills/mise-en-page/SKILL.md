---
name: mise-en-page
description: Metteur en page de Louis. Transforme une demande ou un brief client en contenu de page (phase A : plan, une idée par section, layout choisi dans une grande banque avec pour / contre, textes exacts), puis en sections propres dans Figma via Figwright (phase B : grille 12 colonnes, traits, jointures, bandes, items clonés du template, emplacements d'illustration séparés). Sait aussi « refaire cette section » à partir d'une capture ou d'une référence. À utiliser quand Louis demande une page, une landing, une mise en page, une structure, un fil de fer, des sections, ou de refaire une section. Les illustrations ne sont jamais dessinées ici : elles passent par brief-illustration puis illustrateur.
---

# Mise en page (contenu → sections)

Premier maillon de la chaîne de Louis :

```
① mise-en-page   phase A : demande → contenu            ⏸ Louis valide
                 phase B : contenu → sections Figma      ⏸ Louis valide
                 sort : la page en fil de fer + emplacements.md
② brief-illustration   un brief par emplacement (format imposé, voisins connus)   ⏸ Louis choisit
③ illustrateur          dessine chaque brief dans son emplacement
④ contrôle DA           relit la page entière (pour l'instant : la grille §« Contrôle » ci-dessous)
```

Ce skill ne dessine **aucune illustration**. Il pose des emplacements nommés à la bonne taille.

## Fichiers
| Fichier | Contenu |
|---|---|
| `references/contenu.md` | phase A : méthode, forme de l'idée → layouts, rythme, longueurs mesurées, grille de relecture (Louis l'enrichira) |
| `references/layouts.md` | **la banque de layouts** : ~55 fiches (heros, bénéfices, fonctionnalités, preuves, intégrations, sécurité, offres, contenu) avec structure, contenu, illustrations, pour / contre, source |
| `references/grille-et-items.md` | phase B : grille, rails, traits, jointures, bandes hachurées, espacements, typo, boutons, **chaque item** avec ses mesures et son nœud Figma, emplacements d'illustration, décors |
| `references/anatomie/<type>.md` | chaque section du template **découpée en items** (blocs, textes par rôle, boutons, traits, jointures, icônes, décors, emplacements d'illustration), avec nœuds et mesures. `.json` = la même chose pour un script |
| `references/anatomie/hero-corrige-louis.md` | la landing « Escale » corrigée par Louis (6058:801) : **fait foi** quand elle diffère du template |
| `references/apercus/template/*.png` | aperçu de chaque type de section ; `_planche.png` = tout d'un coup |
| `references/apercus/bon-layout/*.jpg` | la banque « Bon Layout » de Louis (page Inspiration 6086:185) |
| `gabarits/contenu.md`, `gabarits/emplacements.md` | les formes exactes des sorties |
| `outils/anatomie.py` | refait le découpage à partir d'un snapshot Figwright (voir « Ajouter une section à la banque ») |
| `journal-des-retours.md` | chaque retour de Louis → règle → fichier |

Fichiers d'autres skills à connaître : `../illustration-systeme/pages/grille.md` (grille, palette, ressources à cloner), `../illustration-systeme/pages/grammaire.md` (ordre des sections par type de page), `../illustration-systeme/motifs/README.md` (lumières, ombre de store, motifs), `../illustration-systeme/retours/` (retours de Louis sur les landings).

## Figma
Fichier « Botwise — AI-First SaaS Template (Copy) ». Figwright doit être ouvert **dans ce fichier** (`get_metadata` : vérifier le nom ; sinon demander à Louis d'ouvrir le plugin dans le bon fichier). Template : page Design (1:8). Banque Bon Layout : page Inspiration, 6086:185. Banque de composants d'illustration : page 6110:17.

## Phase A : contenu
Suivre `references/contenu.md` §2. Sortie : `sorties/<projet>/contenu.md` selon `gabarits/contenu.md`. Points durs :
- une section = une idée, écrite (« Le lecteur retient : … ») ;
- le layout se **choisit** dans `layouts.md` en comparant 2 ou 3 fiches (pour / contre) ; écrire pourquoi ;
- les textes respectent les longueurs mesurées ; aucune preuve inventée présentée comme vraie ;
- la page n'est pas plate : au moins 6 layouts, alternance de densité et de forme.
Puis **s'arrêter** et montrer le plan à Louis.

## Phase B : structure dans Figma
1. Créer une page Figma « Test · <projet> (<date>) » et un cadre 1440 de fond `#F7F5F3`, avec la grille 12 colonnes (marge 150, gouttière 20) et les deux rails.
2. Pour chaque section, ouvrir `anatomie/<type>.md` du layout choisi et la reproduire **item par item** :
   - cloner les items du template (en-tête, cartes, rangée de chiffres, onglets…) par leurs nœuds (`clone_node` + `reparent_nodes`), jamais une section entière quand la landing doit être nouvelle (règle du 08/11) ;
   - poser les traits `#D6D0C8`, une **jointure ronde** (6077:11) à chaque croisement, la **bande hachurée** entre deux sections (6001:661 / 6001:665) ;
   - respecter les espacements (en-tête → grille 60, surtitre → titre 8, titre → intro 16) et les rôles typo de `grille-et-items.md` §2 ;
   - écrire les textes de `contenu.md` (Inter ; recréer les textes Switzer / Inter Tight) ;
   - à la place de chaque illustration : un **emplacement** gris nommé `Illustration · L × H · <n°>-<lettre> · <bénéfice>` à la taille exacte du layout.
3. Décors (motifs, lumière, bandes) : cloner les nœuds de `grille-et-items.md` §6. Pas de section sombre au milieu.
4. `get_screenshot` de la page entière ; vérifier avec le Contrôle ci-dessous ; corriger (2 tours au plus).
5. Écrire `sorties/<projet>/emplacements.md` (gabarit `gabarits/emplacements.md`) avec le nœud de chaque emplacement.
6. Montrer la capture et `emplacements.md` à Louis. La suite : `brief-illustration` (qui lit `emplacements.md`), puis `illustrateur`.

## Refaire une section (à partir d'une capture, d'une référence, d'une section existante)
1. **Découper** : lister chaque item (en-tête, cartes, chiffres, boutons, traits, illustrations) et leur ordre. Pour un nœud Figma : `design_diff(nodeId, rootDir=<dossier>)` écrit le snapshot complet sur le disque, puis `python outils/anatomie.py <dossier>/.figwright/snapshots <sortie>` (ajouter le type et l'id dans la liste `SECTIONS` du script).
2. **Trouver l'idée** : « cette section dit : … ». On garde l'idée et la structure, jamais le style de la référence.
3. **Associer** : chaque item → un item de `grille-et-items.md` ; la structure → une fiche de `layouts.md` (ou une nouvelle fiche « N » à faire valider).
4. **Réécrire** le contenu aux longueurs de `contenu.md` §5.
5. **Reconstruire** dans notre grille (phase B), illustrations en emplacements.

## Ajouter une section à la banque
Quand Louis ajoute une référence (page Inspiration, ses sites) : la découper (ci-dessus), ajouter son `anatomie/<type>.md`, son aperçu dans `apercus/`, et une fiche dans `layouts.md` avec **pour / contre** et la note de Louis s'il y en a une (les notes posées en texte sur les images se lisent avec `get_design_context` ; les commentaires Figma ne se lisent pas).

## Contrôle (page entière)
- [ ] Grille : contenu entre 150 et 1290, rails, traits `#D6D0C8`, jointures rondes à tous les croisements, bandes hachurées entre les sections.
- [ ] Hero centré, illustration en dessous ; aucun gauche/droite hors d'une case.
- [ ] Rythme : jamais deux layouts de même forme à la suite ; ≥ 6 layouts ; un bloc saturé ; seul le pied de page sombre.
- [ ] Typo : uniquement les rôles de `grille-et-items.md` §2 ; aucune taille inventée.
- [ ] Textes : ceux de `contenu.md`, aux bonnes longueurs ; pas de texte qui déborde.
- [ ] Chaque illustration est un emplacement nommé, à la bonne taille, listé dans `emplacements.md`.
- [ ] Pas de lueur gratuite, pas de texture de fond inventée.

## Quand Louis donne un retour
1. L'écrire en règle avec sa nuance dans le bon fichier (`contenu.md`, `layouts.md` pour un pour / contre, `grille-et-items.md` pour une mesure).
2. L'ajouter à `journal-des-retours.md`.
3. Ne l'appliquer qu'aux cas qui lui ressemblent.
