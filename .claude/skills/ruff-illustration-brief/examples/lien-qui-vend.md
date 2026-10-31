# Brief de référence (validé par Louis le 26/10/2026) — « Un lien qui vend à votre place »

**Page / section** : Bénéfices (v4 et v5) · **Format** : carte étroite · **Fond** : jaune `--rf-tint-yellow`

## 1. Le bénéfice
- Le client obtient une page qui reprend ses arguments, ses preuves et ses prix quand il l'envoie après un appel.
- Tension : il doit tout réexpliquer à chaque prospect → un seul lien suffit.

## 2. Les idées cherchées (reconstitution)

| # | Idée | Mécanique | Note | Pourquoi |
|---|---|---|---|---|
| 1 | Objet central : un lien. On voit : des pages fantômes reliées derrière lui. Ça veut dire : tout ton argumentaire tient dans ce lien. | Contenant | 15 | Une idée, un objet, la connexion visible |
| 2 | Une bulle de messagerie avec un aperçu de lien | (littéral) | 8 | ✱ illustre la phrase |
| 3 | Un lien d'où se déplient trois sections empilées | Contenant | 11 | Trop d'éléments flottants (version v3) |

**Choix** : n°1.

## 3. Éléments
- **Structure** : la pilule du lien, l'icône de chaîne, la barre d'URL.
- **Contexte** : 3 pages fantômes (barres, bouton `#333`, zone image) à 48 %, dont deux coupées par la carte ; 3 lignes fines `rgba(0,0,0,.16)` qui relient le lien à chaque page.
- **Signal** : le lien, seul élément à 100 % d'opacité, avec une ombre.

## 4. Composition
```
 [fantôme]     [fantôme]     [fantôme]
      \            |            /
       \           |           /
        ( 🔗  ————————————— )        ← lien central, au tiers bas
  Titre + texte de la carte
```
Le lien flotte entier au-dessus du texte. Aucun cadre de sélection, aucune pastille.

## 5. Test des 3 secondes
On comprend qu'un seul lien donne accès à plusieurs pages de contenu.
