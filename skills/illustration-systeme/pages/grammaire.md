# Grammaire des pages (landing pages et site complet)

Relevée le 08/11/2026 sur les 10 pages du Figma de Louis (« Botwise — AI-First SaaS Template (Copy) », page Design). Valeurs lues avec Figwright, pas sur des images.
- Fiche de chaque section : `sections.json` (rôle, nœud Figma, hauteur, structure, illustration).
- Aperçu de chaque section : `sections/<type>.png` (1x) et la planche `sections/_planche.png`.
- Pages complètes de référence : `_brut/pages1x/*.png`.

## 1. Grille
- Page 1440 px, fond `#F7F5F3`. Contenu 1140 px, de x = 150 à x = 1290.
- **Deux rails verticaux** 1 px `#D6D0C8` à x = 150 et x = 1290, sur toute la hauteur de la page. Les sections s'appuient dessus (navigation, FAQ, articles…).
- **Bande hachurée entre deux sections** : 15 px de haut sur toute la largeur, deux traits pointillés `#D6D0C8` (5/5) en haut et en bas, hachures en mosaïque entre les rails ; un **carré de 8 px** posé sur la bande au centre (x = 716).
- Espace vertical entre deux sections : **150 px** (de la fin d'un bloc au début du suivant), la bande hachurée est au milieu ou en bas du bloc.
- Grilles internes à traits fins `#D6D0C8`, colonnes 570 (×2) ou 380 (×3), points de 8 px aux croisements.

## 2. Typographie (exacte)
| Rôle | Police | Taille / interligne / interlettre | Couleur |
|---|---|---|---|
| Sur-titre de section | DM Mono Medium, MAJUSCULES | 14 / 150 % / +1 % | `#3745F1` (gris `#767676` dans l'appel final) |
| Titre de section | Switzer Semibold | 48 / 110 % / −2 % | `#1A1A1A` |
| Titre de hero / appel final | Switzer Semibold | 54 / 110 % / −2 % | blanc sur indigo, `#000` 88 % sur sable |
| Texte d'introduction | Inter Tight Medium | 17 / 150 % / −2 % | `#595959` (hero indigo : `#D6D0C8`) |
| Texte courant / carte | Inter Tight Medium | 16 / 150 % / −2 % | `#595959` |
| Question FAQ, nom | Inter Tight SemiBold | 18 et 17 / 150 % | `#1A1A1A` |
| Lien de navigation, bouton | Inter Tight Medium | 15 / 150 % / −2 % | `#1A1A1A`, actif `#3745F1` |
| Fonction (sous un nom) | Inter Tight Medium | 15 / 150 % / −1 % | `#707070` |
En-tête de section : sur-titre, 8 px, titre (souvent sur 2 lignes), 16 px, texte. Centré par défaut ; variante « titre à gauche + texte à droite » (même ligne de base).

## 3. Boutons
- Hauteur 47, rayon 100, padding 12 / 16, texte 15 Medium.
- **Principal** : fond `#1A1A1A`, texte blanc, contour haut 1 px blanc 15 %, ombre intérieure blanche 30 % (y 1), texte avec ombre légère ; souvent suivi d'une icône 22 px.
- **Secondaire** : fond `#EFEBE7` (ou blanc), contour `#EBE5E0`, texte `#262626`.
- Toujours par paire : secondaire à gauche, principal à droite, 14 px d'écart.

## 4. Pièces qui se répètent (ne pas les redessiner : cloner le nœud)
Navigation, témoignage client, témoignages, FAQ, appel final, pied de page, équipe, grille de blog, rangée de chiffres (valeur Switzer + libellé, séparés par des traits verticaux), liste d'avantages à icône (icône 16 dans un carré, séparés par des traits).

## 5. Ordre des sections par type de page
- **Landing produit (accueil)** : navigation → hero-produit (+ bande de logos) → fonctionnalites-video-chiffres → temoignage-client → probleme-solution → plateforme-liste → etapes-onglets → trois-ecrans → bento-2x2 → comparatif → temoignage-client → integrations → croissance → tarifs → international → blog-grille → temoignages → faq → cta-final → pied-de-page.
- **Contact** : navigation → hero-contact → temoignages → faq → cta-final → pied-de-page.
- **Tarifs** : navigation → tarifs → banniere-cta → temoignages → faq → cta-final → pied-de-page.
- **Blog** : navigation → hero-blog → blog-liste → equipe → cta-final → pied-de-page.
- **Article** : navigation → article → blog-grille → cta-final → pied-de-page.
- **Liste d'attente** : navigation → hero-liste-attente → temoignages → faq → cta-final → pied-de-page.
- **À propos** : navigation → hero-a-propos → histoire-frise → culture → temoignage-client → equipe → presence-mondiale → faq → cta-final → pied-de-page.
- **Légal** : navigation → texte-legal → cta-final → pied-de-page. **404** : navigation → page-404.
Une landing courte se compose avec : navigation, un hero, 3 à 5 sections de preuve (fonctionnalités, étapes, bento, comparatif, chiffres, témoignages), FAQ, appel final, pied de page.

## 6. Règles de composition
1. Alterner les mises en page : jamais deux sections de même forme à la suite (ex. bento puis bento). Alterner centré / gauche-droite.
2. **Une illustration n'apparaît qu'une fois par page.** Avant d'en mettre une, vérifier qu'elle n'est pas déjà dans une autre section de la page (`bibliotheque/index.json` + champ `illustration` de `sections.json`).
3. Chiffres : 3 ou 4 par rangée, jamais plus ; ils servent de transition sous une section.
4. Les témoignages et la FAQ vont toujours vers la fin, juste avant l'appel final.
5. L'accent indigo est rare : sur-titres, lien actif, une colonne de comparatif, une offre, un hero.
6. Les illustrations suivent toutes les règles du skill (méthode validée du 08/11/2026 : composants clonés, connecteurs en relief, pastilles en verre, pas de trame).

## 7. Générer une page dans Figma (méthode)
1. Choisir le type de page et son ordre de sections (§5), ou composer une landing (§5, dernière ligne).
2. Créer une page Figma vide, puis un cadre 1440 de fond `#F7F5F3` avec les deux rails.
3. Pour chaque section : `clone_node` du nœud de `sections.json`, `reparent_nodes` dans le cadre, `set_position` (x 0 ou 150, y cumulé avec 150 px d'écart), puis `search_nodes type TEXT` dans le clone et `set_text` pour le nouveau contenu.
4. Illustrations : réutiliser celles de la section si elles conviennent ; sinon en construire une nouvelle (méthode validée) — **jamais deux fois la même sur la page**.
5. Ajouter les bandes hachurées entre sections (cloner `6001:661`).
6. `get_screenshot` de la page entière, vérifier le rythme, les textes qui débordent, les doublons, puis corriger.

## 8. Landing NOUVELLE (retour de Louis, 08/11/2026)
Une landing de test ne doit pas recopier les blocs des pages : elle invente sa propre suite de sections et **de nouvelles illustrations**, en respectant seulement la grammaire (grille, typo, boutons, en-têtes, bandes, rythme) et la méthode d'illustration validée. On clone uniquement de petits composants (curseur, photos, câbles fins, pastilles), jamais une section entière.
Référence : page Figma « Test · landing Fil (nouvelle) » (produit inventé « Fil », facturation et relances) : hero en deux colonnes avec facture + paiement, rangée de chiffres, 3 étapes reliées, section texte/illustration, bento 3 cases, témoignage avec résultat chiffré, FAQ, appel final, pied de page.
Polices : Inter Tight et Switzer ne se chargent pas dans le Figma de Louis → textes créés en Inter (titres 600, −2 % à −3 %), DM Mono fonctionne pour les sur-titres.

## 9. Retour de Louis du 11/11/2026 : s'inspirer des AUTRES pages, pas de l'accueil
La landing « Fil » était trop calquée sur l'accueil et trop plate. Ce qui manquait, et qui doit être présent et **bien utilisé** :
1. **Lumière et ombre** : au moins un bloc sombre ou indigo au milieu de la page (bannière indigo à rubans + grain, carte indigo, section noire avec chute sombre), au moins deux sources de lumière visibles (halo derrière des cartes, ombre de store qui traverse une section claire, reflet haut sur une forme sombre). Lumière cohérente (haut droite). Outils : `motifs/`.
2. **Formulaires** comme sur contact et liste d'attente : champs pilule exacts, paires prénom / nom, message, bouton noir pleine largeur ; ou champ e-mail unique dans un cadre de fenêtre. Un formulaire a toujours une preuve à côté (logos, citation, chiffre, avatars).
3. **FAQ** exacte (colonne 946 entre traits, question ouverte sur blanc, chevrons indigo, pied avec avatars + boutons).
4. **Sections partagées retravaillées** : pied de page, appel final, FAQ peuvent être redessinés et enrichis (plus de texte, colonnes, accroche, newsletter…) tant que la grammaire tient.
5. **Illustrations à concept** : avant de dessiner, écrire en une phrase l'idée que l'image fait comprendre (une métaphore du produit, pas une capture d'interface). Chaque illustration a un concept différent ; elles suivent la méthode validée (composants clonés, connecteurs en relief, pastilles en verre, pas de trame).
6. Rythme de référence (pages hors accueil) : sable → bloc saturé (indigo ou noir) → sable → appel final sable à grille pixel → pied de page noir.
