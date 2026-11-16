---
name: posts-x
description: Transforme les sites, maquettes Figma, sections et illustrations de Louis Staub (Ruff Agency) en posts X/Twitter de design à fort potentiel viral, à partir d'une bibliothèque de concepts relevés sur des posts qui ont réellement surperformé. À utiliser dès que Louis demande un post X / Twitter, des idées de posts à partir de ses travaux, d'analyser un post viral, ou d'ajouter des références de posts X.
---

# Posts X — Ruff Agency

Objectif : des posts « design Twitter » de haute qualité, faciles à produire. Un post = **un visuel fort + une légende très courte**. Le visuel fait 90 % du travail ; la légende donne l'angle.

## À lire avant de produire

1. `references/concepts.md` : les concepts (A à I), pourquoi ils marchent, leur recette, leurs légendes types. C'est la source principale.
2. `references/benchmark.md` : les posts analysés, leurs chiffres et leur « lift » (likes du post ÷ like médian de l'auteur). Sert à justifier un choix de concept.
3. `references/idees-ruff.md` : idées déjà proposées à partir des travaux de Louis (ne pas les reproposer comme neuves ; cocher celles qu'il a publiées).
4. `refs/` : vignettes des posts de référence (une par post) pour comparer le niveau visuel.

## Méthode : d'un travail de Louis à un post

1. **Récupérer la matière.**
   - Site en ligne (ruff.agency, une réalisation, un site client) : captures par section avec `~/.claude/skills/ruff-visuels-linkedin/outils/capture-sections.mjs` (gère Framer et le défilement). Pour une vidéo de défilement, enregistrer l'écran ou exporter une animation.
   - Figma : Figwright (`ping`, puis `get_selection` / `get_screenshot` / `save_screenshots`) — voir le skill `ruff-visuels-linkedin` pour l'outillage.
   - Sections HTML du dépôt `Louis67810/ia` (`ruff-agency/brand/design/sections/*-vN.html`) : les versions successives sont de la matière pour le concept « itérations ».
2. **Choisir 1 à 3 concepts** dans `concepts.md` selon la matière (tableau « quelle matière → quel concept »). Toujours dire pourquoi, en citant le lift de la référence.
3. **Produire le livrable**, pour chaque proposition :
   - le **concept** et la référence qui l'inspire ;
   - le **visuel** : format (carré 1:1 ou 16:10, 1 à 4 images, ou vidéo ≤ 20 s), fond, cadrage, ce qui bouge si c'est une vidéo, ce qui est montré en premier (la première image / frame est la vignette) ;
   - la **légende** en anglais (audience design/tech de X), 2 à 8 mots, minuscules acceptées, pas de hashtag, pas de lien, 0 ou 1 emoji ; donner 3 variantes ;
   - si utile, une **réponse à épingler** sous le post (process, outil, offre) — c'est là que va le lien, jamais dans le post.
4. **Fabriquer le visuel** quand Louis le demande : dans Figma via Figwright (préféré, cohérent avec son système) ou en HTML/vidéo. Respecter les règles du skill `illustration-systeme` / `ruff-design` pour tout ce qui est illustration Ruff.
5. **Regarder le rendu** comme sur le fil X (vignette petite, mobile) avant de livrer : le sujet doit se lire en 1 seconde.

## Règles transverses (tirées du benchmark)

- **Une tension** dans chaque post : avant/après, question, affirmation d'autorité, défi technique, ou référence culturelle. Un simple « voici un projet » sans tension reste dans la moyenne (Nick Pattison 1,1×, Swaraj 1,3×, Alex Barashkov 0,35×).
- **Sujet que les devs/fondateurs comprennent** (dashboard, app vibecodée, landing SaaS, bouton) > sujet de designer pur (concepts de branding abstraits).
- **Montrer la transformation ou le geste**, pas seulement le résultat. Les plus gros lifts sont des vidéos de transformation ou d'objet animé.
- **Sauvegardable** : un post qu'on garde comme référence (valeurs exactes, avant/après, UI très propre) a autant de signets que de likes — c'est le signal le plus fiable de la qualité perçue.
- **Légende courte et parlée** : « Did I cook? », « deslop any vibecoded app. », « footers designed by me ». Jamais de pitch commercial dans le post.
- **Ne rien inventer** : pas de faux client, pas de chiffre de résultat non fourni par Louis. Les noms de clients réels (Rentala, Spreak, Keyframe…) seulement si Louis confirme qu'il peut les montrer.

## Ajouter de nouvelles références

Quand Louis envoie des liens de posts X :
1. Données du post : `curl -s https://api.fxtwitter.com/<user>/status/<id>` (texte, médias, likes, vues, signets, réponses, abonnés de l'auteur). Lire en Python avec `-X utf8`.
2. Moyenne de l'auteur : ouvrir `https://x.com/<user>` dans le navigateur intégré (Louis y est connecté) et lire les compteurs des articles visibles (`aria-label` du `[role=group]` : « N aimer », « N vues »). Prendre le **médian** des posts récents hors post analysé et hors post épinglé viral. Si le panneau est masqué, X ne charge pas plus de ~5-8 posts : le dire.
3. Calculer le lift (likes ÷ médian) et classer : méga-viral > 50×, viral 10-50×, bon 5-10×, normal 0,7-5×, sous la moyenne < 0,7×.
4. Regarder le visuel (télécharger la vignette en `name=small`), le rattacher à un concept existant ou créer un nouveau concept dans `concepts.md`, ajouter la ligne dans `benchmark.md` et la vignette dans `refs/`.
