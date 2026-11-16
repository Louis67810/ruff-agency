# Landing « Escale » (Figma, page 6038:4, cadre 6038:5), construite le 11/11/2026

Contre-exemple de départ : elle suit la grammaire mais Louis annonce « pas mal de trucs à changer ». Les lignes ci-dessous sont les défauts que j'ai constatés moi-même ; **les retours de Louis viennent s'ajouter en dessous**.

| Date | Où | Ce qui était faux | Règle | Vérification |
|---|---|---|---|---|
| 13/11 | ombres de store (hero 6040:150, formulaire 6040:658, appel final 6040:790) | refaites à la main avec `store()` : rendu non fidèle, côté foncé à l'envers | utiliser l'outil de Louis (`motifs/outils_louis.py` -> `ombre_png`, puis import_image + MULTIPLY + opacité 0,3) ; jamais `store()` pour une ombre « de référence » | comparer à `motifs/images/ombre-store-figma-p.png` |
| 13/11 | motif de tuiles indigo (hero, bannières) | le mode « répéter » de l'outil original a des périodes différentes par rangée : raccords visibles | cloner les vecteurs de 6053:404 et les décaler de leur période (voir motifs/README.md, cadre de référence 6066:15) ; `tuiles_repetables()` ne ressemblait pas à l'original, à proscrire | zoom sur un raccord : aucune ligne doublée ni trou |
| 13/11 | curseur du hero | pas le curseur « Hugo » validé (flèche clonée d'une autre page + pilule redessinée) | cloner `6020:936` ; si la page est introuvable, le dire, ne pas improviser | nœud cloné = 6020:936 |
| 13/11 | logotype du pied de page 6040:845 | contour en dégradé indigo sans la texture granuleuse de l'original | utiliser le motif de texture/grain, ne pas remplacer par un dégradé | comparer à 6027:2763 |
| 13/11 | grain du bloc sombre 6040:555 | possiblement trop présent | grain 30 % maximum sur fond sombre, vérifier à 100 % de zoom | pas de bande visible |
| 13/11 | entre l'appel final et le pied de page | la grille pixel s'arrête net, vide trop long avant le noir | l'appel final se termine par la chute sombre du pied de page, sans vide > 150 px | capture de la jonction |
| 13/11 | noms de clients du formulaire | mots-marques en texte, inventés | acceptable en test, mais l'écrire dans le rendu ; ne jamais les présenter comme de vrais logos | — |
| 13/11 | motif de tuiles (retour de Louis) | ma version recalculée « ne ressemble pas au truc de base » | pour tout motif de sa sélection : réutiliser les VRAIS vecteurs (clone_node), jamais une réinterprétation | superposer au nœud d'origine : mêmes tuiles, mêmes halos |

## Retours de Louis du 14/11/2026 (version corrigée : 6058:801 ; la mienne : 6038:5)
| Où | Ce qui était faux (contre-exemple) | Règle | Vérification |
|---|---|---|---|
| Hero 6040:150 | texte à gauche, illustration à droite | hero CENTRÉ, illustration dessous dans une fenêtre de site (6075:389) qui chevauche le trait de fin de hero ; motif de tuiles dans les colonnes extérieures ; lumière (image d'ombre) en miroir | comparer à 6072:8 |
| Hero, illustration | trousseau trop chargé, plein d'infos | UNE information clé par illustration ; montrer le produit qui travaille tout seul (curseurs qui agissent) | compter les infos : 1 |
| Partout | pastilles/points verts « tout est prêt », trop d'infos | retirer les points verts décoratifs et les états « prêt » ; moins d'informations, mieux utilisées | aucun point vert hors connexion active |
| Curseurs | deux fois « Inès » | deux curseurs = deux acteurs différents (noms différents) | noms distincts |
| Formes | épingles, punaises, puces (motifs.epingle) | INTERDIT dans cette DA, même si présent sur le site d'origine | aucune épingle |
| Jointures de grille | carrés aux croisements | ronds blancs 8 × 8 avec ombre « jointure » (6077:11) | aucun carré aux croisements |
| Bloc sombre 6040:475 | porte réaliste + « Bienvenue Camille » | jamais de réalisme ; illustrer le bénéfice (les agents travaillent, c'est sécurisé) avec les composants du style | style = pastilles en verre, câbles, cartes |
| Construction Figma | rectangles posés derrière le contenu | tout conteneur = FRAME (auto-layout si possible) avec son contenu dedans, pas un rectangle + des calques au-dessus | parent du texte = frame |
| Citation | guillemets refaits, buggés | guillemets officiels 6070:7 | nœud cloné |
| Lumière | halos au milieu, derrière des cartes blanches ; ombres refaites | lumière discrète, juste SOUS l'élément (6058:1691, débordant en bas) ; ombre de store = image de l'outil (6052:2), opacité 66 % | aucun halo derrière du blanc |
| Pied de page | pixels inventés, pas de contour ni jointures, mauvaise couleur | textures + lumières des systèmes, traits et jointures, couleurs de la palette (retour détaillé à venir) | — |
| Typo | tailles inventées | tailles du système (pages/grille.md §3) | chaque texte = un rôle |
| Couleurs | teintes hors marque | palette 6083:5 uniquement | pipette |
| Sections à contenu | mises en page variées | toujours : grille de 2 + motif + lumière | — |
| À garder | le parcours (6058:1011) | référence positive : réutiliser sa logique (ligne, stations, une carte d'état) | — |
| « Le parrain » | jointures | à corriger (retour détaillé à venir) | — |
