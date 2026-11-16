# Catalogue de layouts (banque de sections)

But : avoir une **grande panoplie** de layouts, avec leurs pour et leurs contre, pour choisir à chaque section **le meilleur pour son idée**, et ne pas rendre des pages plates qui répètent toujours « en-tête centré + grille ».

Statut : version 1 (16/11/2026). Louis enrichira les « pour / contre » et les « quand l'utiliser ». **Chaque ajout de Louis passe avant mes notes.**

## Comment lire une fiche
- **Idée** : la forme d'idée que le layout sert le mieux (voir `contenu.md` §3).
- **Structure** : les items, dans l'ordre (voir `grille-et-items.md`).
- **Contenu** : ce qu'il faut écrire (nombre d'éléments, longueurs).
- **Illustrations** : nombre et format des emplacements.
- **Pour / Contre** : quand il brille, quand il fait plat.
- **Source** : `T` = section du template (nœud Figma + `apercus/template/<type>.png` + `anatomie/<type>.md`) ; `BL` = banque « Bon Layout » de Louis (page Inspiration, `apercus/bon-layout/<nœud>.jpg`) ; `N` = nouveau, proposé par moi, **pas encore de référence visuelle** (à trouver ou à valider par Louis).
- **Densité** : légère / moyenne / riche. Alterner sur une page.

## Règles de choix (rappel)
1. Partir de l'**idée** de la section, pas du layout précédent.
2. Jamais deux layouts de même forme à la suite (deux grilles de cartes, deux gauche/droite).
3. Alterner densité légère / riche, et centré / scindé.
4. Une page de 8 à 12 sections utilise au moins **6 layouts différents**.
5. Le hero est centré (règle du 14/11). Gauche/droite seulement dans une case.
6. Une illustration n'apparaît qu'une fois par page.

---

## A. Heros (ouvrir la page)

### L01 · Hero centré + démo dessous
- **Idée** : une promesse + une action, le produit en preuve.
- **Structure** : badge → titre 48 (2 lignes) → intro → paire de boutons → grande fenêtre de démo (1140 × 486) qui passe par-dessus le trait de fin de hero ; motif de tuiles dans les colonnes extérieures + ombre de store.
- **Contenu** : titre 5 à 9 mots, intro ≤ 2 lignes, 2 boutons (action + secondaire).
- **Illustrations** : 1 démo (le produit qui travaille seul).
- **Pour** : le modèle validé par Louis (Landing Escale 6058:801) ; immédiat.
- **Contre** : vu partout ; dépend entièrement de la qualité de la démo.
- **Source** : T `hero-produit` 6001:63, corrigé par Louis 6058:801. Densité riche.

### L02 · Hero centré + bandeau de preuve
- **Idée** : promesse + crédibilité tout de suite.
- **Structure** : L01 sans démo, ou démo plus basse ; dessous, bandeau « Trusted by » : chiffre + note + logos en rangée (fondus sur les bords).
- **Pour** : rassure dès le haut ; bon pour une offre B2B.
- **Contre** : logos fictifs = faux ; à éviter sans vrais clients.
- **Source** : BL 6086:208 (bandeau « 500+ Brands »), T hero-produit. Densité moyenne.

### L03 · Hero avec formulaire court
- **Idée** : une seule action (s'inscrire, liste d'attente).
- **Structure** : marque → titre → texte → champ e-mail + bouton dans un cadre → preuve « 2 000+ » avec avatars → 4 avantages à icône sous une bande hachurée.
- **Pour** : conversion directe.
- **Contre** : rien à montrer du produit.
- **Source** : T `hero-liste-attente` 4001:44873. Densité légère.

### L04 · Hero « page intérieure » avec grande photo cadrée
- **Idée** : présenter une équipe, une entreprise.
- **Structure** : titre + texte + bouton centrés ; grande photo dans un cadre ; 4 chiffres dessous.
- **Contre** : demande de vraies photos.
- **Source** : T `hero-a-propos` 4001:49008. Densité moyenne.

### L05 · Hero onglets par public (N)
- **Idée** : le même produit sert plusieurs publics.
- **Structure** : titre centré → onglets en pilule (Freelances / PME / Grands comptes) → une démo par onglet (on n'en dessine qu'une, les autres sont des onglets).
- **Pour** : chaque visiteur se reconnaît.
- **Contre** : plus long à produire ; une seule démo visible.
- **Source** : banque Structure des illustrations 6086:210 à 6086:228 (onglets par cible). Densité riche.

---

## B. Présenter des bénéfices (plusieurs idées de même poids)

### L10 · Bento 2 × 2 à traits
- **Idée** : une idée + 4 preuves de même poids.
- **Structure** : en-tête centré → grille 2 × 2 à traits fins, jointures aux croisements ; chaque case : illustration 568 × 398 + surtitre mono à icône + titre 18 + texte 16.
- **Contenu** : 4 cases de même longueur (titre 2 à 4 mots, texte 1 phrase ≈ 90 car.).
- **Illustrations** : 4 × 568 × 398, mécaniques toutes différentes.
- **Pour** : clair, très « produit » ; met les illustrations en valeur.
- **Contre** : long (1 300 de haut) ; plat si les 4 illustrations se ressemblent.
- **Source** : T `bento-2x2` 6001:6161. Densité riche.

### L11 · Bento 3 + 2 (cartes à illustration)
- **Idée** : 5 bénéfices, dont 2 plus importants.
- **Structure** : en-tête à gauche + boutons à droite ; rangée de 3 cartes ; rangée de 2 cartes plus larges ; chaque carte : illustration en haut, icône + titre + phrase en bas.
- **Pour** : hiérarchie visible (les 2 grandes) ; rythme.
- **Contre** : 5 illustrations à produire.
- **Source** : BL 6086:190. Densité riche.

### L12 · Trois cartes 380 × 528 + démo pleine largeur + chiffres
- **Idée** : 3 fonctionnalités, puis la preuve (vidéo, chiffres).
- **Structure** : en-tête scindé (titre à gauche, intro à droite) → 3 cartes (illustration 380 × 372 + texte) → démo vidéo 1140 × 486 → rangée de chiffres.
- **Pour** : section complète « fonctionnalités + preuve ».
- **Contre** : très haute (1 342) ; à ne mettre qu'une fois.
- **Source** : T `fonctionnalites-video-chiffres` 6001:13775. Densité riche.

### L13 · Trois écrans de téléphone coupés
- **Idée** : 3 moments d'usage sur mobile.
- **Structure** : en-tête scindé → 3 colonnes : téléphone coupé en bas + surtitre + titre + texte.
- **Pour** : montre le produit en situation.
- **Contre** : seulement si le produit a une app ; 3 écrans = 3 interfaces (R2 : pas trop d'interface).
- **Source** : T `trois-ecrans` 6001:1227. Densité moyenne.

### L14 · Grille de 4 cases à icône (sans illustration)
- **Idée** : 4 garanties ou avantages courts.
- **Structure** : trait à jointures → 4 cases de 285 : icône dans une tuile + titre 16 + texte 15.
- **Pour** : respiration entre deux sections riches ; aucun dessin.
- **Contre** : pauvre seule ; à utiliser sous une autre section.
- **Source** : T `hero-contact` (4 avantages), BL 6086:166 (bas). Densité légère.

### L15 · Liste d'avantages à gauche + illustration à droite (dans une case)
- **Idée** : une plateforme, ses 3 points forts.
- **Structure** : case gauche 569 : surtitre + titre + texte + bouton + liste à traits (icône + texte) ; case droite : illustration 569 × 597 ; dessous rangée de 4 chiffres.
- **Pour** : dense mais lisible ; le format des briefs actuels (569 × 597).
- **Contre** : gauche/droite : pas en hero.
- **Source** : T `plateforme-liste` 6001:896, BL 6086:193 (puces + boutons). Densité riche.

### L16 · Bénéfices en grande liste numérotée (N)
- **Idée** : 5 à 8 bénéfices courts, sans illustration chacun.
- **Structure** : en-tête à gauche (collant au défilement) ; à droite, liste de rangées à traits : numéro mono `01` + titre 20 + texte 16.
- **Pour** : beaucoup d'information sans 8 illustrations ; rythme éditorial.
- **Contre** : plat si mal dosé ; pas d'image.
- **Source** : N (structure proche de `histoire-frise`). Densité moyenne.

### L17 · Carrousel de cartes coupées par le bord (N)
- **Idée** : beaucoup d'exemples (modèles, cas d'usage), on en devine d'autres.
- **Structure** : en-tête + flèches → rangée de cartes 380 dont la dernière est coupée par le rail droit, fondue.
- **Pour** : suggère l'abondance ; casse la grille.
- **Contre** : sur une page statique, le contenu caché est perdu.
- **Source** : N (mécanique proche de `international`). Densité moyenne.

---

## C. Une fonctionnalité en détail

### L20 · Onglets d'étapes + carte coupée en 2
- **Idée** : un processus en 4 étapes, une à la fois.
- **Structure** : en-tête centré (500) → barre de 4 onglets (icône + libellé, actif en indigo pâle) → carte : à gauche « STEP 01 » + titre + texte + bouton, à droite illustration 569 × 442.
- **Pour** : très clair ; un seul dessin visible.
- **Contre** : les 3 autres étapes ne se voient pas en image fixe.
- **Source** : T `etapes-onglets` 6001:1072, BL 6086:199. Densité moyenne.

### L21 · Onglets en pilule + carte avec 2 chiffres + 3 garanties
- **Idée** : une fonctionnalité parmi plusieurs, avec sa preuve chiffrée.
- **Structure** : en-tête centré → onglets en pilule → carte coupée en 2 (texte + 2 chiffres à gauche / illustration à droite) → bandeau de 3 garanties.
- **Pour** : complet, la preuve est collée à la fonctionnalité.
- **Source** : BL 6086:199 (réutilisé dans Pointé, section 05). Densité riche.

### L22 · Illustration à gauche, texte + 3 mini-cartes + 3 chiffres à droite
- **Idée** : une fonctionnalité expliquée, chiffres à l'appui.
- **Structure** : case gauche illustration ; case droite surtitre + titre + texte + 3 mini-cartes + rangée de 3 chiffres séparés par des traits à jointures.
- **Pour** : la rangée de chiffres à traits est très bien.
- **Contre** : gauche/droite (seulement dans une case, avec l'accord de Louis).
- **Source** : BL 6086:196. Densité riche.

### L23 · Démo large + carte témoignage sombre
- **Idée** : le produit et la preuve sociale côte à côte.
- **Structure** : titre à gauche + 3 mini-cartes ; dessous démo large (2/3) + carte témoignage (1/3) ; onglets soulignés en bas.
- **Contre** : la carte sombre : un fond sombre au milieu est déconseillé (règle du 14/11) → la faire en sable foncé `#EFEBE7`.
- **Source** : BL 6086:202. Densité riche.

### L24 · Avant / après sur une même ligne
- **Idée** : le problème puis la solution.
- **Structure** : en-tête centré → 2 cases 570 séparées par un trait, la marque au centre ; chaque case : illustration 570 × 395 + titre 20 + texte 17 centrés ; étiquette d'état (« Problème » / « Solution »).
- **Pour** : le contraste explique tout seul.
- **Contre** : utiliser une seule fois ; l'« avant » ne doit pas être mis en valeur (R8 de brief-illustration).
- **Source** : T `probleme-solution` 6001:671. Densité moyenne.

### L25 · Une grande démo plein cadre + 3 fonctionnalités en cases
- **Idée** : « voici le produit » en entier.
- **Structure** : fenêtre d'appli plein cadre + bouton « Voir la démo » au centre → 3 cases de fonctionnalités → bandeau de preuve.
- **Source** : BL 6086:208. Densité riche.

### L26 · Zoom sur un détail (N)
- **Idée** : une fonctionnalité précise qui fait la différence.
- **Structure** : en-tête centré → grande illustration pleine largeur, avec 3 étiquettes reliées par des traits à jointures à des points de l'illustration (annotations) → pas de texte en bas.
- **Pour** : très « design » ; montre le soin.
- **Contre** : demande une illustration riche et précise.
- **Source** : N. Densité moyenne.

---

## D. Prouver (chiffres, comparaison, clients)

### L30 · Rangée de chiffres seule
- **Idée** : une preuve chiffrée, en transition.
- **Structure** : 3 ou 4 cases de 285, chiffre 34 + libellé 15, traits entre les cases, fond blanc, trait bas.
- **Pour** : respiration ; donne du crédit.
- **Contre** : jamais plus de 4 chiffres ; jamais seule en début de page.
- **Source** : T sous `plateforme-liste` 6001:1041. Densité légère.

### L31 · Croissance : courbe avec logos posés dessus
- **Idée** : des résultats qui montent.
- **Structure** : en-tête scindé → grande courbe montante, chiffres clés à gauche, logos des canaux posés sur la courbe, zone hachurée.
- **Source** : T `croissance` 6001:10497. Densité moyenne.

### L32 · Tableau comparatif
- **Idée** : nous contre les autres.
- **Structure** : en-tête centré → tableau 5 colonnes (notre colonne en accent), rangées à icône, pastilles check/croix → rangée de 3 chiffres.
- **Pour** : décisif pour un acheteur qui compare.
- **Contre** : texte serré ; rangées ≤ 8.
- **Source** : T `comparatif` 6001:5652. Densité riche.

### L33 · Témoignage en deux moitiés
- **Idée** : une voix client forte.
- **Structure** : case gauche : barre d'accent + citation 20 + avatar + nom + fonction ; case droite : logo client sur grille de carreaux en relief.
- **Pour** : sobre, crédible ; respiration.
- **Source** : T `temoignage-client` 6001:572. Densité légère.

### L34 · Bande de cartes témoignages
- **Idée** : plusieurs clients contents.
- **Structure** : en-tête centré → bande `#F3F0ED` avec 4 cartes blanches 353 × 327 (guillemets, texte, étoiles, avatar), fondues sur les bords.
- **Source** : T `temoignages` 6027:2444. Densité moyenne.

### L35 · Bandeau de logos clients (N)
- **Idée** : « ils nous font confiance ».
- **Structure** : une ligne : surtitre gris + 6 à 8 logos monochromes entre deux traits, fondus aux bords.
- **Contre** : logos fictifs interdits comme clients (seulement des outils).
- **Source** : T sous `hero-produit` (bande de logos). Densité légère.

### L36 · Étude de cas en chiffres (N)
- **Idée** : un client, son problème, son résultat.
- **Structure** : case gauche : logo + citation courte + nom ; case droite : 3 chiffres « avant → après » empilés à traits.
- **Pour** : plus concret que des témoignages.
- **Source** : N. Densité moyenne.

---

## E. Intégrations, connexions

### L40 · Grille de tuiles d'intégration
- **Idée** : « ça marche avec vos outils ».
- **Structure** : en-tête centré → grille 4 × 2 de tuiles (logo, nom, flèche ou « Bientôt »).
- **Source** : T `integrations` 6001:1587. Densité moyenne.

### L41 · Tuiles d'applis en perspective + barre d'appel
- **Idée** : « n'importe quel outil, partout ».
- **Structure** : titre dans un cadre à jointures → tuiles d'applis en perspective → barre d'appel → 3 garanties.
- **Note de Louis** : « Bon layout pour présenter des outils qui sont connectés. Juste le truc du bas, avec le truc noir, et les icônes en dessous, c'est non. » → garder le cadre + tuiles, **pas** la barre noire ni les 3 garanties à icône.
- **Source** : BL 6086:205. Densité moyenne.

### L42 · Bandeau d'icônes rondes + 3 cartes texte
- **Idée** : outils connectés + 3 bénéfices.
- **Note de Louis** : « Bon layout pour présenter des outils qui sont connectés. »
- **Structure** : bandeau de pastilles rondes de logos (certaines vides, fondues) → 3 cartes texte (icône + titre + texte).
- **Source** : BL 6086:183. Densité moyenne.

### L43 · Pays / langues qui défilent
- **Idée** : international, partout.
- **Structure** : carte du monde en points en fond, titre centré + bouton, 2 rangées de pastilles pays à drapeau qui défilent, fondues.
- **Source** : T `international` 6027:2625. Densité légère.

---

## F. Rassurer, sécurité

### L50 · Bloc texte + pile de cartes + 4 cases à icône
- **Idée** : sécurité, conformité.
- **Structure** : texte + pile de cartes (documents) → 4 cases à icône sous un trait à jointures.
- **Contre** : la version de référence est sombre : chez nous en sable foncé `#EFEBE7`.
- **Source** : BL 6086:166 (Pointé section 06). Densité moyenne.

### L51 · FAQ
- **Idée** : lever les doutes.
- **Structure** : en-tête centré → colonne 946 entre deux traits, 6 à 8 questions, une ouverte sur fond blanc, chevrons indigo → pied : avatars + 2 boutons.
- **Pour** : toujours vers la fin, avant l'appel final.
- **Source** : T `faq` 6027:1120. Densité moyenne.

### L52 · Garanties en bandeau (N)
- **Idée** : « sans risque » (essai, sans engagement, support).
- **Structure** : une ligne de 3 garanties (icône + titre + 1 ligne) entre deux traits à jointures, sous une offre ou un formulaire.
- **Source** : BL 6086:199 et 6086:205 (bas). Densité légère.

---

## G. Offres, conversion

### L60 · Tarifs à 3 cartes
- **Idée** : choisir une offre.
- **Structure** : en-tête centré + bascule Mensuel / Annuel → bande de 5 inclusions → 3 cartes d'offre (celle du milieu mise en avant) → chiffres → tableau de comparaison.
- **Source** : T `tarifs` 6001:10682. Densité riche.

### L61 · Bannière indigo
- **Idée** : relance au milieu de la page.
- **Structure** : carte indigo 1140 × 295 avec motif, titre blanc à gauche, bouton blanc à droite.
- **Pour** : le bloc saturé qui donne du rythme (retour du 11/11).
- **Source** : T `banniere-cta` 4001:23965. Densité légère.

### L62 · Appel final sur carte sable
- **Idée** : dernière poussée.
- **Structure** : carte sable `#EFEBE6` 1139 × 547 avec rubans flous ; centré : surtitre gris, titre 54, texte, 2 boutons ; grille pixel.
- **Source** : T `cta-final` 6027:8953 + 6027:10187. Densité légère.

### L63 · Formulaire + preuve à côté
- **Idée** : contact, démo.
- **Structure** : titre centré + 4 avantages → formulaire à gauche (prénom / nom, e-mail, message, bouton noir pleine largeur) + logos et citation à droite.
- **Source** : T `hero-contact` 4001:15087. Densité moyenne.

### L64 · Appel final avec aperçu produit (N)
- **Idée** : finir sur le produit, pas sur du texte.
- **Structure** : titre + 2 boutons centrés, puis le haut d'une fenêtre d'appli coupée par le bas de la section (fondue).
- **Source** : N. Densité moyenne.

---

## H. Histoire, équipe, contenu

### L70 · Frise verticale
- **Source** : T `histoire-frise` 4001:50134 — titre collant à gauche, frise à points, années + textes à droite.
### L71 · Culture : carte indigo + photos inclinées
- **Source** : T `culture` 4001:50364.
### L72 · Équipe : 3 cartes portrait
- **Source** : T `equipe` 6029:13168.
### L73 · Présence mondiale : 2 cartes plan + adresse
- **Source** : T `presence-mondiale` 4001:50324.
### L74 · Blog : 3 cartes article / liste d'articles
- **Source** : T `blog-grille` 6027:608, `blog-liste` 4001:30377, `hero-blog` 4001:30233.
### L75 · Article / texte légal en colonne 794
- **Source** : T `article` 4001:33395, `texte-legal` 4001:37167.

## I. Toujours présents
### L80 · Navigation — T `navigation` 6001:21 (logo + 5–6 liens, actif en indigo souligné ; bouton sable + bouton noir).
### L81 · Pied de page — T `pied-de-page` 6027:2763 (seule section sombre de la page).
### L82 · 404 — T `page-404` 4001:51299.

---

## À ajouter (pistes pour enrichir la banque)
Les « N » ci-dessus n'ont pas encore de référence visuelle. Prochaines sources à relever, quand Louis les fournit : ses propres sites (page Figma « ruff agency v2 », propositions d'accueil « Itérations » 3010:246), les sections du site Ruff (dépôt `ruff-agency`), et de nouvelles captures dans la page Inspiration. Pour chaque nouvelle référence : la découper en items (méthode « Refaire une section » de `SKILL.md`), puis ajouter une fiche ici.
