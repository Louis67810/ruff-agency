# Règles de fabrication (forme courte)

Chaque règle : **ce qu'il faut faire**, puis le défaut qui l'a fait naître. Une règle accompagnée de sa faute d'origine est mieux suivie qu'une règle nue (méthode Anatomy). La source complète, avec les mots de Louis, est dans `brand/design/feedback.md`.

## Couleur
- **Toutes teintées ou aucune (R1, R2).** Dans un groupe de cartes, si l'une a un fond de couleur, toutes en ont un, chacune d'une teinte différente (`--rf-tint-*`, `hsl(teinte 100% 93%)`). *Défaut : v1, une cyan et une crème au milieu de cartes blanches.*
- **Jamais de sombre dans du clair (R3).** *Défaut : v1, carte bleu nuit au milieu d'une section claire.*
- **Un seul accent bleu (#0147FF).** Le cadre de sélection ou le curseur « Vous » suffit.

## Limite de couleurs (R60, R61)
- **Dans une illustration : gris, blanc et une seule couleur d'accent** (le bleu `#0147FF` ou une seule teinte), en plus du fond de la carte. Pas de sections roses, vertes et jaunes dans la même maquette. *Défaut : audit de site v2, cartes crème et rouge.*
- **Titres de maquette = barres grises** (`.rf-bar`), jamais noires. *Défaut : audit de site v2.*
- **Peu d'éléments (R16)** : un objet central, pas une foule de petits objets. *Défaut : audit de site v2, carte rouge (vingt avatars).*
- **Repère numéroté (R62)** : le rond bleu « 1 » et sa remarque accrochée, **une fois par page ou par section au plus**, là où il porte l'idée. Pas de repères gris « 2 », « 3 » en décor. *Défaut : audit de site v1 à v3, bénéfices v6 à v8.*
- **Prospects et visiteurs = icône utilisateur grise** (`#rf-user` sur `.rf-avatar--ghost`). Memoji Apple sur fond coloré : seulement pour des **clients**, rarement.

## Formes et ombres
- **Ombres du site uniquement (R6).** `--rf-shadow-wire`, `--rf-shadow-tool`, `--rf-shadow-dot`, `--rf-shadow-dir` (cercles, en diagonale). *Défaut : v1, ombres inventées.*
- **Pas d'ombre sur un élément imbriqué (R8).** Seules les pastilles `.rf-dot` gardent la leur. *Défaut : v1, le « + » ombré dans une zone.*
- **Cadre de sélection exact (R4, R14).** #0147FF, trait 1,17 px, poignées de 14 px au rayon de 3 px. *Défauts : v1, mauvais bleu ; v3, angles vifs.*
- **Ombre en couches, centrée (inspiration heysimon.fr)** : `--rf-shadow-soft` (6 couches à 4 %, sans décalage latéral) pour un objet posé à plat, net et léger. Option, pas obligation : `--rf-shadow-wire` reste l'ombre par défaut.
- **Profondeur par le flou (inspiration heysimon.fr)** : l'objet d'arrière-plan reçoit `.rf-blur` (flou 4 px, opacité 45 %) au lieu d'être seulement estompé avec `.rf-ghost`. À utiliser quand l'arrière-plan est du décor (une page, une liste) et que l'objet net devant porte l'idée. **Rare (R59) : une illustration sur cinq au plus**, sinon `.rf-ghost` ou un objet coupé par la carte.
- **Petits ronds = pastilles du site (R13).** Rouge, jaune, vert, bleu, bord blanc de 1 px. *Défaut : v2, ronds pastel sans bord.*

## Maquettes
- **Un seul style de bouton dessiné (R11)** : pilule `#333`. *Défaut : v1, bouton bleu dans le téléphone.*
- **Logo de maquette gris (R19)** : `--rf-wire-bar`. *Défaut : v4, carrés noirs en haut à gauche.*
- **Curseur (R57)** : `.rf-pointer` (`ruff-tokens.css` v0.4), le curseur de Louis symétrisé : pointe en haut à gauche, étiquette pastel en dessous à droite, 5 couleurs (`--blue`, `--green`, `--yellow`, `--pink`, `--violet`). Placer la pointe : elle est à 6 px à gauche et 4 px en haut du coin de `.rf-pointer`. Sans `<span>` : flèche seule. Une seule étiquette par illustration, sauf mécanique « présence » (une couleur par personne). Copier le balisage du commentaire de `ruff-tokens.css`. *Remplace `.rf-cursor` et `.rf-you` (R7), qui restent pour les anciennes versions.*
- **Loupe (R58, R59)** : seulement si l'idée est vraiment « regarder de près », une fois par page au plus. `.rf-loupe` (`ruff-tokens.css` v0.5), jamais redessinée. Verre à bord blanc, reflet léger, **une seule ombre centrée portée par le verre et le manche** (pas de décalage visible sous le verre), manche foncé `--rf-loupe-handle` avec une ombre intérieure sombre en bas et un reflet clair en haut. Taille par `--rf-loupe-size` ; le contenu agrandi va dans `.rf-loupe__glass`. *Défaut : bénéfices v6 et v7, ombre décalée sous le verre et manche gris sans ombre.*

## Composition
- **Une illustration prouve un bénéfice, elle ne montre pas un mot-clé (R56).** Moment-preuve + contraste visible, mécaniques différentes dans une série. Méthode : `ruff-illustration-brief` v0.2. *Défaut : illustrations qui se ressemblent, chacune une interface qui reprend le mot du titre.*
- **Une idée, un objet central (R10, R16).** Traduire le bénéfice en image ; ne pas illustrer la phrase. *Défauts : v1, calendrier littéral ; v3, nuage d'éléments flottants.*
- **Assez de contenu (R18).** L'objet central est un vrai objet détaillé (interface, page, panneau), au moins 12 éléments visibles. *Défaut : v4, deux avatars reliés par un trait.*
- **Fondu ou flottant, jamais entre les deux (R5).** Ce qui descend sous le texte finit en fondu ; ce qui s'arrête avant reste entier. *Défauts : v1, coupures nettes ; v2, téléphone à moitié fondu sur mobile.*

### Interdits
- les pointillés qui ondulent (R17) ;
- les ronds à ondulations et les effets « pulse » (R9) ;
- les icônes 3D et les personnages dessinés ;
- les photos de banque d'images ;
- les dégradés arc-en-ciel ;
- une carte sombre dans une section claire.

## Bouton principal
- **Hauteur fit-content, 60 px socle compris (R15).** `box-sizing: border-box`, placé après l'`@import`. *Défaut : v3, bouton de 80 px ; v4, polices perdues.*

## Structure de page (R21 à R39, détail dans `structure.md`)
- **Footer et FAQ réels (R21, R36).** `brand/design/components/site-footer.html` et `site-faq.html`, avec leurs CSS d'origine. *Défaut : Blueprint v1, footer et FAQ refaits maison.*
- **Bleu = dégradé du site (R22).** Le bleu part du haut et s'efface dans `#FBFBFB`. *Défaut : Blueprint v1, aplat bleu.*
- **Varier les fonds (R37)** : `#FBFBFB`, `#FFFFFF`, `#F5F5F5`, bleu dégradé. *Défaut : Blueprint v1, toutes les sections sur le même fond.*
- **Hero = place pour un média (R23)** quand une vidéo est prévue. *Défaut : Blueprint v1, illustration à la place de la vidéo.*
- **Tag du héros = celui de la page SaaS (R24).**
- **Réassurance sous un bouton (R25)** : Heroicons contour 24 px, séparateurs verticaux. *Défaut : Blueprint v1, points verts.*
- **Une seule couleur pour les H2 (R26)** ; le bicolore une fois par page au plus. *Défaut : Blueprint v1, bicolore partout.*
- **Conclusion de section (R31)** : Inter 600 28 px centrée avec un filet, pas de grand titre bicolore.
- **Pas de contenu dans un contenu (R32), titre dans sa colonne.** *Défaut : Blueprint v1, bloc OpenAI encadré ; titre qui passe au-dessus du tableau.*
- **Encadré de note (R33)** : le contour des visuels d'étapes. *Défaut : Blueprint v1, contour bleuté d'une autre couleur.*
- **Pas de MAJUSCULES en libellé dans un contenu (R34).** *Défaut : Blueprint v1, « COMMENT C'EST CONSTRUIT ».*
- **Pas d'étiquette-pastille décorative (R28)** du type « Partie 2 · Le design ».
- **Pas de schéma posé au milieu d'une section (R29).** *Défaut : Blueprint v1, flèche de boucle sous les étapes.*
- **Pastilles de couleur : uniquement dans les illustrations, avec parcimonie (R35).** Les listes utilisent des Heroicons. *Défaut : Blueprint v1, liste de l'équipe avec pastilles.*
- **Avant / après (R27)** : le visuel nu, avec les étiquettes SaaS ; ni pointillés ni conteneur. *Défaut : Blueprint v1, cases en pointillés dans un cadre gris ou bleu.*
- **Cadre de sélection rare, sur l'objet entier (R30).** *Défaut : Blueprint v1, sélections partout, dont une sur une ligne de texte.*
- **Un retour s'applique partout où il a du sens (R39).**
- **Footer sans bandeau d'appel si la page a déjà son appel final (R40).** Sinon, le footer fait la promotion d'une autre offre. *Défaut : Blueprint v2, « Réserver un appel » juste sous le formulaire.*
- **Peu d'illustrations, à des endroits précis (R41).** Une section de texte n'en a pas. *Défaut : Blueprint v2, grille de pages illustrée dans la section problème.*
- **Exemples et résultats = emplacement média (R42)**, vidéo ou capture réelle à la même taille, jamais une illustration. *Défaut : Blueprint v2, trois maquettes dessinées pour comparer les niveaux.*
- **H1 de 64 px au plus (R43)**, sur deux lignes environ. *Défaut : Blueprint v2, 80 px sur trois lignes.*
- **Flèche de défilement dans un tag avec ombre (R44).** *Défaut : Blueprint v2, flèche posée sans conteneur.*
- **Avis = photo réelle de l'auteur (R45)** ; un groupe d'avis défile en ticker. *Défaut : Blueprint v2, avis sans photo.*
- **Formes SVG du site (R48)** dans le héros (sauf héros très chargé) et dans environ 2 sections sur 10. Toujours sur les bords, jamais derrière le contenu. *Défaut : Système sur mesure v2 (premier rendu), formes passant derrière le titre et les visuels.*
- **Pas de section « titre + contenu empilé » (R49)** : deux colonnes, grille ou élément latéral. *Défaut : Système sur mesure v1, « Ce que tu reçois » en liste verticale.*
- **Photos de profil avec contour (R50)** : bordure blanche de 3 px et ombre directionnelle.
- **Un vrai ticker (R51)** : pleine largeur, continu, sans pause. *Défaut : Système sur mesure v1, rangée de cartes contenue qui ressemblait à un carrousel.*
- **Une offre = un logo à côté de son nom (R52)**, jamais un bloc bleu avec une icône ; icônes de liste en encre.
- **Héros jamais blanc (R53)** : `rgb(249,251,255)` et formes du site.
- **Appel final sans dégradé obligatoire (R54).**
- **Appel « réserver un appel » = agenda Cal.com intégré, pas un bouton (R55)** ; les autres boutons descendent vers `#reserver`. *Défaut : Système sur mesure v2, un bouton de plus au moment où le visiteur est prêt.*

## Ton
- **Tutoiement pour le lead magnet Blueprint (R20)**, vouvoiement ailleurs.

## Références
- **Prendre la finition, pas l'objet.** Les patterns Figma (F1 à F5) donnent la manière de faire. On ne recopie pas l'objet : F2 (visiteurs → clients) appartient à sa carte.
