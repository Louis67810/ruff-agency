# Intégrer un rendu dans un site

Chaque build écrit deux fichiers :

- `<id>.embed.html` : **un seul bloc** `<div class="iso rendu" id="<id>">` qui contient son `<style>`, le SVG, la barre d'étapes et son `<script>`. Aucune dépendance. Les styles sont tous préfixés (`.rendu`, `.iso-*`, `.nrg*`, `.r-*`) et les identifiants SVG par l'`id` du rendu : il ne casse pas le site qui l'accueille.
- `<id>.html` : le même bloc dans une page autonome (fond #f7f8fa, police Jost). Pour l'aperçu, une iframe ou une capture.

## Où coller le bloc

| Outil | Comment |
|---|---|
| Webflow | Composant **Embed** (Code Embed), coller le contenu de `.embed.html`. Au-delà de 50 000 caractères, héberge `.html` et utilise une iframe, ou découpe : `<style>` dans les réglages de page (Custom code, head), le reste dans l'Embed. |
| Framer | Composant **Embed** en mode HTML, coller le bloc. Ou un code component qui injecte le HTML. Hauteur : laisser « auto » ou fixer selon le ratio (1200 × 760 + légende ≈ 0,8). |
| WordPress | Bloc **HTML personnalisé**. Avec Elementor : widget HTML. |
| Shopify | Section « Liquide personnalisé » ou « HTML personnalisé ». |
| Site codé à la main | Coller le bloc là où le rendu doit apparaître. |
| React / Next.js | `<div dangerouslySetInnerHTML={{ __html: html }} />` n'exécute pas les `<script>` : sépare le script (regex sur `<script>…</script>`) et lance-le dans un `useEffect` après le rendu, ou utilise l'iframe. |
| Partout | `<iframe src="maison-solaire.html" style="width:100%;aspect-ratio:1100/870;border:0" loading="lazy" title="…"></iframe>` |

## Réglages courants

Dans le `build.mjs` de la scène, sur l'appel à `renderHtml` :

- **Sans titre ni étapes** (illustration seule) : `caption: false`.
- **Fond transparent** (le site a déjà sa section) : `bg: "none"`.
- **Autre couleur de marque** : `palette: "cyan" | "vert" | "ambre"` ou `{ a900, a700, a500, a400, a200, a100, a50 }`.
- **Textes des étapes** : `steps: [{ label, text, hold }]`. `hold` en millisecondes.
- **Titre** : `title`.
- **Format** : `WIDTH` et `HEIGHT` en tête du build (1200 × 760 par défaut). Pour une bannière plus large, 1400 × 700 ; pour une carte carrée, 900 × 900. Recadrer ensuite avec `fitProjection`.

La police suit celle du site (`font-family: inherit`). Pour forcer celle de l'aperçu, ajoute `font-family: Jost, sans-serif` sur `.rendu`.

## Comportement

- La boucle démarre quand le rendu entre à l'écran (25 % visible) et se met en pause quand il en sort.
- `prefers-reduced-motion` : le rendu affiche directement l'état final, sans animation.
- Un clic (ou Entrée) sur une étape s'y place ; la boucle reprend seule après 9 s.
- Le SVG porte un `aria-label` qui décrit la scène : écris-le dans la langue du site.

## Poids et performance

- 190 à 260 Ko non compressé, 30 à 40 Ko en gzip. Le SVG est statique : seuls des attributs et des transitions CSS changent, il n'y a pas de calcul par image.
- Les flous (`feGaussianBlur`) sont le seul coût GPU. Si une page affiche plus de trois rendus en même temps, baisse le nombre de câbles allumés à la fois.

## Exporter en vidéo ou en image

- Image fixe par étape : `node scripts/capture.mjs <page>.html --select .rendu --scale 2 --wait 600 --times 2500,6000,11000`.
- Vidéo (réseaux sociaux) : enregistrer l'écran sur une boucle complète, ou capturer une image toutes les 40 ms avec `scripts/drive.mjs` et assembler avec ffmpeg.
