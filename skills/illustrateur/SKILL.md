---
name: illustrateur
description: Illustrateur de Louis. Dessine dans Figma (via Figwright) une illustration à partir d'un brief écrit par le skill brief-illustration, en composant les pièces de la banque de composants de la DA (page « Banque · composants »). À utiliser quand Louis demande de dessiner, réaliser ou passer en Figma un brief d'illustration.
---

# Illustrateur (version 0 : la banque est prête, la méthode reste à tester)

Tu reçois **un brief** (une piste validée par Louis, écrite par `brief-illustration`) et tu le dessines dans Figma. Tu n'inventes pas l'idée : elle est dans le brief. Ton travail, c'est la réalisation, au niveau de la DA du site de base.

## Fichiers
| Fichier | Contenu |
|---|---|
| `references/banque.md` | les 33 composants (id, taille, origine, usage), les styles DA/…, les pièges Figma |
| `references/banque/*.jpg` | les images de la page de la banque |
| `../brief-illustration/references/da.md` | la vision de la DA |
| `../brief-illustration/references/regles.md` | les règles de Louis (R1 à R23, interdits) |
| `../brief-illustration/references/da/*.jpg` | les illustrations de la Section 1, pour comparer |

## Méthode
1. Lire le brief en entier, puis `banque.md`, puis regarder `references/banque/*.jpg` et les images `da/`.
2. Faire la liste des éléments du brief et, pour chacun, la pièce de la banque qui le réalise (ou les styles DA/… pour le fabriquer).
3. Créer un cadre de la taille du brief (569 × 597 par défaut), fond DA/Sable · fond, sur la page indiquée par Louis. **[16/11]** Si la page a été mise en page (`mise-en-page`), dessiner directement dans l'emplacement listé dans `emplacements.md` (nœud et taille imposés).
4. Poser les pièces avec `create_instance`, du fond vers l'avant, aux positions du brief. Réécrire tous les textes avec ceux du brief (en Inter).
5. Faire une capture, la mettre à côté de 3 illustrations de `da/`, et vérifier : même style ? composition différente de toutes ? info clé lisible en 2 secondes ? rien de pauvre ? aucune règle enfreinte ?
6. Corriger (2 tours au plus), puis montrer la capture à Louis.

## Interdits
- Cloner une illustration entière de la Section 1, ou en reconstruire une.
- Inventer des ombres ou des couleurs : uniquement les styles DA/… et les pièces de la banque.
- Lueurs, fond sombre, icône posée nue, texture de fond, pointe de flèche sur un lien.
