# Brief d'exemple (méthode v0.2, à valider par Louis) — « Une utilisation plus efficace »

Cas cité par Louis le 27/10/2026 : « ne mets pas juste une interface ». Exemple de raisonnement complet, à suivre pour tout bénéfice.

**Page / section** : grille de bénéfices · **Format** : carte étroite · **Fond** : `--rf-tint-green` · **Plan de série** : exemple seul

## 1. Du bénéfice au concept
1. **Changement** : avant, pour obtenir un rendez-vous, le visiteur écrit un email, attend, propose des dates, confirme ; après, il choisit un créneau et c'est fait.
2. **Piège du mot-clé** : un tableau de bord, un compteur, un éclair ; ou un calendrier avec un créneau coché (refusé en v1).
3. **Moment-preuve** : juste après le seul clic, la confirmation qui apparaît.
4. **Contraste** : beaucoup → un (quatre gestes gris → un résultat bleu).
5. **Mécanique** : la compression (famille Transformer).
6. **Phrase-concept** : Objet central : une carte « Appel réservé ». On voit : quatre étapes fantômes empilées derrière, de plus en plus estompées. Le contraste : quatre gestes gris → un seul net. Ça prouve : ce qui prenait quatre étapes en prend une.

## 2. Les idées cherchées

| # | Phrase-concept | Mécanique | Note /22 | Pourquoi |
|---|---|---|---|---|
| 1 | Carte « Appel réservé » nette ; quatre étapes fantômes compressées derrière | Compression | 19 | Le contraste se voit sans lire ; contenu spécifique |
| 2 | Un tableau de bord avec un indicateur « efficacité » | (mot-clé) | 6 | ✱ piège du mot-clé, ✱ pas de contraste |
| 3 | Deux colonnes : un fil d'emails de 6 messages / un seul message « Réservé » | Comparaison côte à côte | 15 | Juste, mais plus lent à lire et deux objets au lieu d'un |
| 4 | Un bouton « Réserver » cliqué par le curseur « Vous », l'agenda qui se remplit derrière | Clic décisif | 15 | Proche du calendrier refusé en v1 |
| 5 | Une liste de tâches où quatre lignes se barrent et une seule reste | Désordre → ordre | 14 | Lisible, mais la liste barrée est banale |

**Choix** : n°1, le seul où le « moins d'étapes » se voit en un regard. **Réserve** : n°3.

## 3. La composition
```
┌──────────────────────────────┐
│      ░ Confirmer ░            │  ← fantôme 4, 20 %
│     ▒ Proposer des dates ▒    │  ← fantôme 3, 32 %
│    ▓ Attendre la réponse ▓    │  ← fantôme 2, 48 %
│   ▓ Écrire un email ▓         │  ← fantôme 1, 64 %
│ ┌──────────────────────────┐ │
│ │ ✓ Appel réservé          │ │  ← objet central net, ombre wire
│ │ Mardi · 10 h 30 · 30 min │ │
│ │ [Ajouter à l'agenda]     │ │
│ └──────────────────────────┘ │
│ Titre de la carte             │
│ Texte                         │
└──────────────────────────────┘
```
- Pattern : nouveau (« pile compressée »), proche de la cascade mais inversée : on montre ce qui disparaît.
- **Point focal** : la coche bleue (x 22 %, y 62 %).
- Les fantômes sont **coupés à droite** par la carte ; la carte de confirmation **flotte** entière.
- **Accent unique** : la coche bleue `#0147FF`.

## 4. Fiche de construction

| Plan | Élément | Contenu exact | Position (x, y) | Taille | Opacité | Classe / style |
|---|---|---|---|---|---|---|
| fond | teinte de carte | — | — | — | — | `--rf-tint-green` |
| arrière | fantôme 4 (pilule d'étape) | icône coche + « Confirmer » | 30 %, 8 % | 70 % de large | 20 % | `.rf-wire` + `.rf-ghost` |
| arrière | fantôme 3 | icône agenda + « Proposer des dates » | 24 %, 18 % | 74 % | 32 % | idem |
| arrière | fantôme 2 | icône horloge + « Attendre la réponse » | 18 %, 28 % | 78 % | 48 % | idem |
| arrière | fantôme 1 | icône enveloppe + « Écrire un email » | 12 %, 38 % | 82 % | 64 % | idem |
| objet central | carte de confirmation | fond blanc, rayon 16 | 6 %, 50 % | 88 % | 100 % | `--rf-shadow-wire` |
| objet central | tuile coche | Heroicon plein `check-circle` blanc sur `#0147FF` | dans la carte, à gauche | 28 px | 100 % | accent |
| objet central | titre | « Appel réservé » | à droite de la tuile | Inter 600 16 px | 100 % | — |
| objet central | détail | « Mardi · 10 h 30 · 30 min » | sous le titre | Inter 500 13 px, `--rf-ink-70` | 100 % | — |
| objet central | ligne d'invité | photo de Louis 20 px + « avec Louis Staub » | sous le détail | 13 px | 100 % | `.rf-avatar` |
| objet central | filet | — | — | 1 px | — | `rgba(0,0,0,.08)` |
| objet central | bouton | « Ajouter à l'agenda » | bas de la carte | pilule | 100 % | `#333` (R11) |
| objet central | lien secondaire | « Modifier » | à droite du bouton | 13 px | 70 % | — |

## 5. Test des 3 secondes
En regardant seulement l'image, on comprend que quatre étapes ont été remplacées par une seule confirmation.
