# Journal de l'illustrateur

## 15/11/2026 · Premier test : 1A, 2A, 3A (agents IA)
Page Figma « Illustrations · agents IA (15/11) » (6115:3). Cadres 6115:4 (1A), 6115:5 (2A), 6115:6 (3A).

### Pièces qui manquent dans la banque
- **Couleurs des curseurs Robert et Alisa** : pas de style. Relevées sur 6019:263 : orange #DA7D36, rose #E5689E. À créer : « DA/Curseur · orange », « DA/Curseur · rose ».
- **Vert pâle de coche** (« traité ») : pas de style. Fabriqué avec DA/Vert curseur à 16 %.
- **Coche / case à cocher / bouton icône actif** : rien dans la banque. Faits en SVG à la main (coche verte dans un rond, case noire cochée, bouton « archiver » noir).
- **Boutons simples** (blanc bordé « Modifier », bleu plein « Valider ») : le seul bouton de la banque a un menu (chevron). Il faut un « Bouton bleu » et un « Bouton blanc » sans menu.
- **Étiquette pastel sans icône** (« En attente ») : l'étiquette d'état a une icône et une ombre rouge. Faite à la main.
- **Courbe montante + zone hachurée** : la « Courbe et zone » de la banque est une courbe rouge qui descend, avec aplat dégradé, sans hachures. J'ai généré la courbe et les hachures en SVG (script Python). À ajouter : une zone hachurée bleue réutilisable.
- **Infobulle à une seule zone** : la banque n'a que la version à deux zones (textes anglais en Inter Tight). Détachée, zone droite supprimée, texte recréé en Inter.
- **Point de courbe** (pastille blanche 26 px avec coche) : fabriqué (rond blanc + style DA/Ombre · pastille de marque).
- **Logo Gmail seul** (petit, pour un onglet) : la tuile de logo fait 65 px avec des anneaux. Importé en SVG.
- **Grille en pointillés** : faite avec un rectangle 1 px, trait du haut seulement, tirets 4/4.

### Pièges Figma rencontrés
- **`batch` refuse** apply_style_to_node, set_position, reorder_nodes, reparent_nodes. Les faire un par un. `move_nodes` (déplacement relatif) passe en batch.
- **Enfant d'instance** : on ne peut pas le déplacer (relative-transform) ; le redimensionner est accepté mais ne change rien à l'écran. Pour l'étiquette du curseur (« Réponse », « Archive » trop longs pour 60 px), il a fallu **détacher** l'instance.
- **Curseur nommé** : l'étiquette a une largeur fixe de 60 px. À refaire en auto-layout (largeur qui suit le texte) dans la banque.
- **Contraintes SCALE** : agrandir un cadre détaché étire la flèche du curseur ; il faut la remettre à 23,69 × 25,85. Dans la fenêtre de navigateur, les points de la barre deviennent ovales quand on change la hauteur.
- **Avatar d'agent** : le logo intérieur est en contrainte MIN, il ne suit pas quand on réduit l'avatar (56 → 28). Détacher, puis redimensionner et recentrer le logo à la main. À corriger dans la banque (logo en SCALE ou centré).
- **Onglet de la fenêtre** : son texte ne peut pas bouger, donc pas de place pour un logo. J'ai masqué le texte et posé logo + texte par-dessus. Prévoir un onglet en auto-layout avec un emplacement de logo.
- **Ajouter du contenu dans une instance** est impossible (« Intérieur blanc », « Contenu ») : le contenu est posé par-dessus, dans le cadre de l'illustration.
- Aucun lot n'a expiré cette fois.

### Écarts au brief (choix faits)
- 1A : la barre latérale floue dépasse à gauche de la fenêtre (x –14 à 62) au lieu de x 40–110, puisque la fenêtre commence à x 40. Ajout d'un petit bouton « archiver » actif sous le curseur Archive (R17 : le curseur doit viser une cible).
- 2A : ligne sortie de 132 px de haut (260–388) au lieu de 100, pour garder trois lignes lisibles. Boutons alignés à gauche, sinon l'étiquette « Alisa » sortait du cadre.
- 3A : tout le graphique est remonté de 40 px (courbe de y 430 à 150) et la carte « 37 » est posée à y 306–430, sinon elle cachait le repère « 07 h ». « 37 » en 40 px comme le brief (au-dessus du repère de 36 px de R18).
