# Skills des agents de Louis (branche `skills-agents-ia`)

Cette branche ne contient **que les skills** (les « agents ») et leurs références. Elle est indépendante de `main` (branche orpheline, sans historique commun) : elle ne contient pas le code du site et ne le modifie pas.

Mise à jour : 16/11/2026.

## Installer sur un ordinateur
Copier chaque dossier de `skills/` dans `~/.claude/skills/` (Windows : `C:\Users\<vous>\.claude\skills\`). Les dossiers `_brut` (exports bruts régénérables) ne sont pas versionnés.

## La chaîne de production d'une page
```
① mise-en-page        phase A : demande → contenu (plan, une idée par section, layouts, textes)   ⏸ Louis valide
                      phase B : contenu → sections Figma (grille, traits, jointures, emplacements) ⏸ Louis valide
② brief-illustration  un brief par emplacement d'illustration                                    ⏸ Louis choisit
③ illustrateur        dessine chaque brief dans Figma (banque de composants de la DA)
④ contrôle DA         relecture de la page entière (pour l'instant dans mise-en-page)
```

| Skill | Rôle | Fichiers clés |
|---|---|---|
| `mise-en-page` | contenu + structure de page, banque de layouts (pour / contre), anatomie de chaque section du template | `references/layouts.md`, `references/contenu.md`, `references/grille-et-items.md`, `references/anatomie/` |
| `brief-illustration` | directeur artistique : briefs d'illustration (règles R1 à R23) | `references/regles.md`, `references/exemples.md`, `sorties/agents-ia/briefs.md` |
| `illustrateur` | dessine les briefs dans Figma | `references/banque.md`, `journal.md` |
| `illustration-systeme` | moteur d'illustration HTML, grille et grammaire des pages, motifs, bibliothèque | `pages/grille.md`, `pages/grammaire.md`, `motifs/README.md` |
| `ruff-visuels-linkedin` | carrousels et posts LinkedIn Ruff dans Figma | `SKILL.md`, `banque/` |
| `posts-x` | posts X à partir des travaux de Louis | `SKILL.md` |
| `rendu-iso` | rendus web isométriques animés | `SKILL.md` |

Figma : fichier « Botwise — AI-First SaaS Template (Copy) » (template page Design 1:8, banque Bon Layout 6086:185, banque de composants 6110:17). Le plugin Figwright doit être ouvert dans ce fichier.

---

# Relancer une conversation avec chaque agent

Copier-coller le texte sous le titre dans une nouvelle conversation Claude Code. Remplacer les `<…>`.

## # Mise en page · phase A (contenu)
```
Utilise le skill mise-en-page, phase A seulement. Voici la demande : <brief du client / description du produit>.
Fais le plan de page (une idée par section), choisis chaque layout dans references/layouts.md en comparant les pour et les contre, écris les textes exacts aux longueurs de references/contenu.md, et marque les emplacements d'illustration. Écris sorties/<projet>/contenu.md et arrête-toi pour que je valide.
```

## # Mise en page · phase B (structure dans Figma)
```
Utilise le skill mise-en-page, phase B. Le contenu validé est dans sorties/<projet>/contenu.md. Figwright est ouvert dans le fichier Botwise.
Construis la page en fil de fer : grille 12 colonnes, rails, traits, jointures, bandes hachurées, items clonés d'après references/anatomie/, emplacements d'illustration nommés à la bonne taille. Puis écris sorties/<projet>/emplacements.md et montre-moi une capture.
```

## # Refaire une section
```
Utilise le skill mise-en-page, méthode « Refaire une section ». La section est <nœud Figma / capture jointe>.
Découpe-la en items, dis-moi son idée, associe-la à un layout de la banque (ou propose une nouvelle fiche avec pour / contre), et reconstruis-la dans notre grille avec les illustrations en emplacements.
```

## # Ajouter des layouts à la banque
```
Utilise le skill mise-en-page. J'ai ajouté des références dans <page Figma / nœud>. Découpe chacune (outils/anatomie.py), ajoute son aperçu et une fiche dans references/layouts.md avec pour / contre et ma note s'il y en a une.
```

## # Brief d'illustration
```
Utilise le skill brief-illustration. Les emplacements sont dans sorties/<projet>/emplacements.md (ou : voici la copie : <bénéfices>).
Pour chaque emplacement, 2 ou 3 pistes selon le gabarit, la grille de contrôle et une recommandation. Écris sorties/<projet>/briefs.md et donne-moi le tableau récapitulatif.
```

## # Retours sur les briefs
```
Utilise le skill brief-illustration. Voici mes retours : <retours>.
Transforme-les en règles avec leur nuance (references/regles.md), ajoute les exemples à éviter / à faire, note-les dans le journal, puis refais seulement les briefs concernés.
```

## # Illustrateur
```
Utilise le skill illustrateur. Dessine la piste <n° + lettre> de sorties/<projet>/briefs.md dans Figma (Figwright ouvert dans Botwise), dans l'emplacement <nœud> si la page existe. Montre-moi la capture à côté de 3 illustrations de la DA.
```

## # Visuels LinkedIn
```
Utilise le skill ruff-visuels-linkedin. Fais-moi un <carrousel / post image> sur : <sujet>.
```

## # Posts X
```
Utilise le skill posts-x. Propose-moi des posts X à partir de : <travail, maquette, section>.
```

## # Rendu iso
```
Utilise le skill rendu-iso. Fais un rendu iso animé pour <métier du client>, étapes : <étape 1 / 2 / 3>.
```
