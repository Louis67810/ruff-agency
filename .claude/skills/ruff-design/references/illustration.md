# Illustrations Ruff : de l'idée à la scène

À lire avant de dessiner une carte. Les valeurs exactes des briques sont dans `brand/design/ruff-tokens.css`, les exemples visuels dans `brand/design/banque.html` et `brand/design/figma/`.

## 1. L'idée en une phrase (R10)
Écrire : « Objet central : X. On voit : Y. Ça veut dire : Z. » Ne pas dessiner la phrase du titre.
- Bien : « Réservez sans écrire » → une boîte de réception calme où n'arrive qu'un rendez-vous déjà réservé (v5).
- Bien, **validé par Louis** : « Un lien qui vend » → un seul lien au centre ; derrière, des pages fantômes qui lui sont reliées (v4 et v5).
- Mal : un calendrier avec un créneau cliqué (littéral), ou deux avatars reliés par un trait (pauvre).

Mécaniques possibles :
- un objet qui en contient d'autres ;
- calme ↔ bruit ;
- désordre → ordre ;
- fantôme → net ;
- traînée de mouvement ;
- section sélectionnée qui ressort.

## 2. La liste des éléments (R18)
Avant de coder, lister **au moins 12 éléments** de l'objet central, groupés par rôle :
- **structure** : panneau, colonnes, barre de navigation ;
- **contenu** : barres, zones image, rangées ;
- **signal** : sélection, puce, curseur ;
- **contexte** : fantômes, liens.

S'il en manque, l'objet n'est pas assez concret.

## 3. Choisir le pattern (sobriété R16)

| Pattern | Quand | Briques |
|---|---|---|
| F1 Objet sélectionné | Personnaliser, mettre en avant, construire | `.rf-wire` + `.rf-select` + puces sur le cadre (`.rf-chip--type` « Aa », `.rf-chip` palette ou événement, `.rf-chip--flat` alignements) + `.rf-ghost` coupés par la carte |
| F2 Transformation | Un avant / après net | Bande, ligne centrale, gris → couleur. **Ne pas recopier « visiteurs → clients ».** |
| F3 Grande maquette | Carte haute | Une page haute sélectionnée, barre d'outils en bas, fondu |
| F4 Processus | Étapes, action de l'utilisateur | `.rf-stage`, objet incliné, curseur `.rf-pointer` « Vous » (R57) |
| F5 Cartes blanches | Section colorée | Illustration, titre, filet, texte |

Les éléments flottants indépendants sont l'exception, jamais la base.

## 4. Placer la scène
- **Une scène = un `.bn-scene`** de taille fixe, centré, réduit par `--s` selon l'écran ; `.bn-scene--wide` pour les scènes de plus de 600 px.
- **Décider pour chaque objet :** il **descend** sous le texte (alors `.rf-bento__fade`, réglé avec `--rf-fade-h`), ou il **flotte**, entier, avant le texte. Vérifier les deux sur mobile.
- **Rotations :** de -3° à -6° pour un objet incliné, de 2° à 5° pour une puce.

## 5. Ombres
- Panneau : `--rf-shadow-wire`.
- Puce : `--rf-shadow-tool`.
- Pastille : `--rf-shadow-dot`.
- Cercle ou avatar : `--rf-shadow-dir`, en diagonale.
- Élément imbriqué : aucune ombre.
