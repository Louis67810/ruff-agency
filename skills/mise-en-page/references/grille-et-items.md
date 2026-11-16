# Grille et items : la banque de pièces de la phase B

Tout ce qui sert à **reproduire une section à l'identique** : la grille, les traits, les jointures, les bandes, puis chaque item (en-tête, bouton, carte, chiffre…) avec ses mesures exactes et le nœud Figma à cloner.

Les mesures viennent des snapshots Figwright pleine précision du template « Botwise — AI-First SaaS Template (Copy) », page Design (1:8), relevés le 16/11/2026. Le détail section par section est dans `anatomie/<type>.md`. La page corrigée par Louis (« Landing Escale », 6058:801, page « Test · landing vierge ») fait foi quand elle diffère du template.

## 1. La grille (identique sur toute la page)

- **Page** : 1440 de large, fond `#F7F5F3`.
- **12 colonnes**, marge 150, gouttière 20, contenu 1140 (x 150 → 1290). Colonne ≈ 76,67. Mettre cette `layoutGrid` sur chaque cadre de section.
- **Rails** : deux traits verticaux 1 px `#D6D0C8` à x 150 et x 1289/1290, sur toute la hauteur de la page (6058:803, 6058:804).
- **Cases** : le contenu se range en cases dessinées par des traits fins `#D6D0C8` :
  - 2 cases de 569/570 (séparées par un trait vertical 1 px) : le cas le plus fréquent ;
  - 3 cases de 378/380 (bento 3, cartes 380 × 528) ;
  - 4 cases de 285 (onglets d'étapes, chiffres, garanties) ;
  - 1 case pleine 1140 (démo, tableau, FAQ 946 centrée).
- **Trait de section** : chaque grille de cases a un trait haut et un trait bas. Le trait horizontal qui ferme une section part de x −150 et fait 1440 (il traverse les rails jusqu'au bord de la page) : ex. 6001:681, 6001:1226.
- **Jointures** : un rond blanc 8 × 8 centré sur **chaque croisement** de traits (rails × traits de section, traits de cases × traits de section). Jamais un carré. Nœud : **6077:11** (ou 6001:669). Ombre « jointure » 5 couches `#8F8F8F`.
- **Bande hachurée** : bande de 1440 × 15 posée à cheval sur le trait de section (y −14 au-dessus ou y = hauteur en dessous), qui sépare deux sections : cloner **6001:661** (bas) / **6001:665** (haut), ou 6001:14044. Elle déborde de x −150.
- **Espacements verticaux** (auto-layout du cadre de section) :
  - en-tête → grille de cases : **60** (40 pour les étapes à onglets) ;
  - surtitre → titre : **8** ;
  - bloc titre → texte d'intro : **16** ;
  - entre deux sections : **≈ 110 à 150** de vide (y cumulé), bande hachurée entre les deux.
- **Interdit** (règle de Louis, 14/11) : texte à gauche / illustration à droite en **hero**. Le hero est centré, l'illustration en dessous. Gauche/droite reste permis **dans une case** (plateforme-liste, étapes-onglets, témoignage).

## 2. Typographie (rôles)

Dans le Figma de Louis, Switzer et Inter Tight ne se chargent pas : on écrit en **Inter** (Semi Bold pour Switzer Semibold, Medium pour Inter Tight Medium), interlettrage −2 à −3 %. DM Mono fonctionne.

| Rôle | Template (mesuré) | À écrire chez nous | Longueur relevée |
|---|---|---|---|
| Surtitre de section | DM Mono Medium 14, `#3745F1`, MAJUSCULES, +1 % | idem | 5 à 18 caractères (médiane 8) |
| Surtitre de carte | DM Mono Medium 13, `#1A1A1A`, icône 16 à gauche, écart 4 | idem | 1 mot |
| Titre de hero | Switzer 54 | Inter Semi Bold 48, 110 %, −4 %, centré | 2 lignes |
| Titre de section | Switzer Semibold 48, `#1A1A1A`, 110 %, −2 % | Inter Semi Bold 48, 110 %, −2/−3 % | 4 à 39 car. (médiane 29), **2 lignes** (retour à la ligne voulu) |
| Titre de carte (grande) | Switzer Semibold 28 `#333` / Inter Tight 32–33 | Inter Semi Bold 28, 120 %, −3 % | 2 à 6 mots |
| Titre de case (bento, colonne) | Switzer Semibold 18–20, `#262626` | Inter Semi Bold 18–20 | 2 à 4 mots |
| Chiffre | Inter Tight SemiBold 32–34, `#1A1A1A` | Inter Semi Bold 34, 110 %, −3 % | « 3M+ », « 90% » |
| Texte d'intro | Inter Tight Medium 17, `#595959`, 150 % | Inter Medium 17 | 1 à 2 phrases, ≤ 2 lignes |
| Texte de case | Inter Tight Medium 16, `#595959` | Inter Medium 16 | 1 phrase, 2 lignes (≈ 90 car.) |
| Libellé, lien de menu | Inter Tight Medium 15, `#1A1A1A` / `#707070` | Inter Medium 15 | 1 à 3 mots |
| Citation | Switzer Medium 20, `#262626` | Inter Medium 20 | 2 à 4 lignes |

## 3. Boutons (mesurés)

| Bouton | Fond | Hauteur | Rayon | Texte | Où |
|---|---|---|---|---|---|
| Principal | `#1A1A1A` (ou `#161616`) | 47 | 100 | Inter Medium 15 blanc, icône flèche | 6001:905, 6072:24 |
| Secondaire sable | `#EFEBE7` / `#EAE9E6` | 47 à 51 | 100 | Inter Medium 15 `#262626` | 6001:916, 6072:22 |
| Blanc (sur fond foncé ou carte sable) | `#FFFFFF` | 40 / 47 | 100 | Inter Medium 15 | cta-final, banniere-cta |
| Petit (« Read more », filtres) | `#FFFFFF` | 31 | 100 | 14 | blog-grille |
| Badge (au-dessus d'un titre de hero) | blanc, ombre 2 couches | 40 | 100 | Inter Regular 16 `#707070`, padding 8/18 | hero |

Paire de boutons : principal + secondaire, **écart 14**. Un bouton est en auto-layout « hug ».

## 4. Les items (à composer)

Chaque item a son nœud d'origine dans le template ; on le **clone** (`clone_node` + `reparent_nodes`) puis on réécrit les textes (texte Inter recréé si la police d'origine est Switzer / Inter Tight).

| Item | Composition exacte | Nœud d'origine |
|---|---|---|
| **En-tête centré** | ↓ écart 8 : surtitre + titre (centré, largeur 500 à 1139) ; puis écart 16 : texte d'intro centré (≤ 606) ; boutons éventuels (écart 24) | 6001:6162, 6001:1073 |
| **En-tête scindé** | → écart 150, padding 0/97 : à gauche surtitre + titre (largeur 398) ; à droite texte d'intro (398), aligné en bas | 6001:13776 |
| **En-tête dans une case** | ↓ écart 24, padding gauche 50 : surtitre + titre + texte + bouton(s) | 6001:899 |
| **Case de carte (bento)** | ↓ écart 0 : emplacement d'illustration (568 × 398) puis bloc texte ↓ écart 12, padding 10/40/40/40 : ligne icône 16 + surtitre mono 13 ; titre de case 18 ; texte 16 | 6001:6167 |
| **Carte 380 × 528** | illustration 380 × 372 + bloc texte padding 0/40/50/40 | 6001:13784 |
| **Liste d'avantages à traits** | rangées de 64 de haut, padding 20/50, icône 20 + texte 16 `#595959`, trait `#D6D0C8` entre chaque rangée | 6001:918 |
| **Rangée de chiffres** | 4 cases de 283–285 × 133, padding 30/50, chiffre 32–34 + libellé 15 `#595959`, traits verticaux entre les cases, fond blanc, trait bas | 6001:1041 |
| **Barre d'onglets** | 4 onglets de 285 × 75, padding 24, icône 18 + libellé 18 ; actif : texte `#1A1A1A` Semi Bold + fond `#3745F1` à 5 % ; inactif `#707070` ; traits entre les onglets | 6001:1079 |
| **Carte coupée en 2** | case gauche 569 (padding 60/50, ↓ écart 60 : étiquette « STEP 01 » + titre 28 + texte + bouton) ; trait ; case droite 569 = illustration | 6001:1117 |
| **Témoignage en deux moitiés** | case gauche 570, padding 80/100/40/100, citation 20 + (avatar 50 + nom 16 + fonction 15) ; trait ; case droite = logo client sur carreaux | 6001:572 |
| **Cartes témoignages** | bande `#F3F0ED`, 4 cartes blanches 353 × 327, rayon 20 : guillemets 6070:7, texte 17, étoiles, trait, avatar + nom | 6027:2444 |
| **Tableau comparatif** | 5 colonnes, notre colonne en accent, rangées à icône, pastilles check/croix ; chiffres dessous | 6001:5652 |
| **Tuile d'intégration** | grille 4 × 2 : logo, nom, flèche ou « Coming soon » | 6001:1587 |
| **Carte d'offre** | 3 cartes, celle du milieu « Most popular », bouton noir, liste à coches | 6001:10682 |
| **Ligne de FAQ** | colonne 946 entre deux traits verticaux ; question ouverte sur fond blanc ; chevrons indigo ; pied : avatars + 2 boutons | 6027:1120 |
| **Carte d'appel final** | carte sable `#EFEBE6` 1139 × 547, rubans flous ; centré : surtitre gris, titre 54, texte, 2 boutons | 6027:8953 + 6027:10187 |
| **Bannière indigo** | carte indigo 1140 × 295 avec motif ; titre blanc à gauche, bouton blanc à droite | 4001:23965 |
| **Formulaire** | champs pilule (prénom / nom par paire, e-mail, message), bouton noir pleine largeur ; preuve à côté (logos, citation) | 4001:15087 |
| **Frise** | titre collant à gauche ; frise verticale à points, années + textes à droite | 4001:50134 |
| **Démo vidéo** | case pleine 1139 × 486, fond `#161616`, fenêtre à contour blanc 40 %, bouton lecture rond 80 (indigo) + 56 (blanc) | 6001:14055 |

## 5. Emplacements d'illustration (à faire séparément)

Une section **ne dessine jamais son illustration** pendant la phase B. On pose un **emplacement** : un cadre de la taille exacte, fond `#F7F5F3`, nommé :

`Illustration · <largeur> × <hauteur> · <n° de section>-<lettre> · <bénéfice en 4 mots>`

Tailles qui reviennent dans le template :

| Emplacement | Taille | Section |
|---|---|---|
| Moitié de case | 569 × 597 | plateforme-liste (le format des briefs actuels) |
| Moitié de carte coupée | 569 × 442 | étapes-onglets |
| Case de bento 2 × 2 | 568 × 398 | bento-2x2 |
| Haut de carte 380 | 380 × 372 | fonctionnalités |
| Témoignage | 570 × 410 | temoignage-client |
| Problème / solution | 570 × 395 | probleme-solution |
| Démo / hero | 1140 × 486, fenêtre 948 × 441 | hero, démo |
| Téléphone | 243 × 500 | trois-ecrans |

Chaque emplacement est listé dans `emplacements.md` (voir `gabarits/emplacements.md`) : c'est l'entrée du skill `brief-illustration`.

## 6. Décors (motifs, lumières) : à ne pas confondre avec les illustrations

`anatomie/` les marque « ✦ décor » : bandes hachurées, motifs pixel aux angles (488 × 466 hors cadre), rubans de l'appel final, lueurs. Ils se **clonent** (voir `illustration-systeme/motifs/` et `pages/grille.md` §4 pour les nœuds : motif de tuiles 6053:404, ombre de store 6073:185, halo 6058:1691, grain 6072:147). Ils ne passent pas par le brief d'illustration.

## 7. Pièges Figwright (rappel)
- Textes clonés en Switzer / Inter Tight : non modifiables → `create_text` en Inter au même endroit, styler, supprimer l'ancien, `reorder_nodes` si auto-layout.
- Enfants importés en contrainte SCALE : passer en MIN/MIN avant d'agrandir.
- `batch` de 5 à 25 opérations, un à la fois, vérifier par capture.
