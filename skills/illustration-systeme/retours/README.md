# Retours de Louis = contraintes + contre-exemples

À lire AVANT de construire une page ou une section, et à relire APRÈS pour se vérifier (comme une liste de contrôle).
Chaque retour de Louis devient une ligne dans un fichier `retours/<page-ou-theme>.md` avec ce format :

| Date | Où | Ce qui était faux (contre-exemple : nœud Figma ou capture) | Règle à appliquer | Vérification rapide |
|---|---|---|---|---|

Règles d'usage
1. Une règle doit être vérifiable (chiffre, outil à utiliser, test visuel), pas un vœu. Si elle est vague, la réécrire.
2. Toujours garder le **contre-exemple** (id de nœud Figma de la page fautive) : il montre à quoi ressemble l'erreur.
3. Quand une règle devient générale, la remonter dans `pages/grammaire.md` ou `motifs/README.md` et la barrer ici.
4. Une règle qui vient d'un outil de Louis (ombre, motif) se traduit par : « utiliser l'outil, ne pas refaire à la main ».
5. Fin de construction : parcourir ce dossier et cocher chaque règle applicable avant de rendre le travail.
