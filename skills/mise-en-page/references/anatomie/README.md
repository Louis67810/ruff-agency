# Anatomie des sections du template

Une fiche par section du template Botwise (page Design 1:8), relevée le 16/11/2026 depuis un snapshot Figwright pleine précision (`design_diff`), découpée par `outils/anatomie.py`.

Légende :
- ▣ bloc (frame / groupe) : taille, position, auto-layout (sens, écart, padding, alignement), traits, fond, rayon
- **rôle** « texte » : texte rangé par rôle (surtitre, titre de section, titre de carte, intro, libellé…), police, couleur, alignement, taille
- 🔘 bouton · ─ trait · ● jointure · ◆ icône / logo · ▭ fond / forme · 🖼 image / photo
- ✦ décor / motif (bandes hachurées, motifs pixel, lumières) : à cloner, ne passe pas par le brief
- 🖼 **EMPLACEMENT D'ILLUSTRATION** : à faire séparément (brief-illustration → illustrateur)

Le découpage est automatique : il peut se tromper (une carte prise pour une illustration, ou l'inverse). En cas de doute, regarder l'aperçu `../apercus/template/<type>.png` et vérifier le nœud dans Figma. Au-delà de 7 niveaux, la fiche renvoie au snapshot.
`hero-corrige-louis.md` = la landing « Escale » corrigée par Louis (6058:801) : elle fait foi.
