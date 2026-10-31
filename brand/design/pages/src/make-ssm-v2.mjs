// Système sur mesure v2 (27/10/2026) : v1 + R48 à R53.
import fs from "node:fs";
const [mainIn, mainOut, cssIn, cssOut] = process.argv.slice(2);
let s = fs.readFileSync(mainIn, "utf8");
const rep = (a, b) => { if (!s.includes(a)) throw new Error("introuvable : " + a.slice(0, 90)); s = s.replace(a, b); };

// R53 + R48 : héros teinté avec les formes du site
rep(`<section class="bp-hero" aria-labelledby="bp-h1">\n  <div class="bp-wrap">`, `<section class="bp-hero bp-hero--tint" aria-labelledby="bp-h1">\n  <!--@SHAPES-->\n  <div class="bp-wrap">`);
// R48 : formes sur 2 autres sections (déroulé, appel final)
rep(`<section class="bp-sec bp-sec--grey" aria-labelledby="bp-h2-how">\n  <div class="bp-wrap">`, `<section class="bp-sec bp-sec--grey bp-has-shapes" aria-labelledby="bp-h2-how">\n  <!--@SHAPES-->\n  <div class="bp-wrap">`);
rep(`<section class="bp-sec bp-sec--blue bp-final" aria-labelledby="bp-h2-final">\n  <div class="bp-wrap bp-center">`, `<section class="bp-sec bp-sec--blue bp-final bp-has-shapes" aria-labelledby="bp-h2-final">\n  <!--@SHAPES-LIGHT-->\n  <div class="bp-wrap bp-center">`);

// R49 : « Ce que tu reçois » en deux colonnes, livrables en grille (plus de liste verticale seule)
s = s.replace(/<!-- 5\. CE QUE TU REÇOIS[\s\S]*?<\/section>/, `<!-- 5. CE QUE TU REÇOIS : fond blanc, deux colonnes + grille de livrables (R49) -->
<section class="bp-sec bp-sec--white" aria-labelledby="bp-h2-get">
  <div class="bp-wrap bp-split">
    <div>
      <h2 class="bp-h2" id="bp-h2-get">Ce que tu reçois.</h2>
      <p class="bp-intro">Le système complet, construit pour ta marque et prêt à être utilisé par ton IA.</p>
      <p class="bp-small" style="margin-top:24px"><span class="bp-todo">[Format de livraison et accompagnement après livraison, à confirmer]</span></p>
    </div>
    <div class="bp-deliverables">
      <article class="bp-card bp-deliv"><svg class="ico"><use href="#hi-outline-swatch"/></svg><h3>Ton identité et tes assets</h3><p>Une identité et des assets propres à ta marque, que personne d'autre n'a.</p></article>
      <article class="bp-card bp-deliv"><svg class="ico"><use href="#hi-outline-finger-print"/></svg><h3>Tes critères de distinction</h3><p>Rédigés en règles précises : ce que ta marque fait, et ce qu'elle ne fait jamais.</p></article>
      <article class="bp-card bp-deliv"><svg class="ico"><use href="#hi-outline-cpu-chip"/></svg><h3>Le système entraîné</h3><p>Le système complet, avec toutes les règles d'affinage, entraîné sur ta marque.</p></article>
      <article class="bp-card bp-deliv"><svg class="ico"><use href="#hi-outline-light-bulb"/></svg><h3>Le guide designer</h3><p>Pour savoir quand une tâche doit revenir à un designer plutôt qu'à ton IA.</p></article>
    </div>
  </div>
</section>`);

// R52 : l'offre = un logo à côté de son nom, pas un bloc bleu avec icône
rep(`<div class="bp-card__head"><span class="bp-tile bp-tile--blue"><svg class="ico"><use href="#hi-solid-sparkles"/></svg></span><h3>Système sur mesure</h3></div>`,
    `<div class="bp-offer"><span class="bp-offer__logo" aria-hidden="true"><svg class="ico"><use href="#hi-solid-sparkles"/></svg></span><div><h3>Système sur mesure</h3><span class="bp-small">par Ruff Agency</span></div></div>`);

// Commentaires de version
s = s.replace("<!-- 8. PREUVES : fond blanc, chiffres + avis avec photo en ticker (R45) ===== -->", "<!-- 8. PREUVES : fond blanc, chiffres + avis avec photo (contour, R50) en vrai ticker pleine largeur (R51) -->");
fs.writeFileSync(mainOut, s);

let c = fs.readFileSync(cssIn, "utf8") + `
  /* ---------- v2 (R48 à R53) ---------- */
  .bp-hero--tint { position: relative; overflow: hidden; background: rgb(249, 251, 255); }
  .bp-has-shapes { position: relative; overflow: hidden; }
  /* R49 : livrables en grille */
  .bp-deliverables { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .bp-deliv { padding: 28px; display: flex; flex-direction: column; gap: 10px; }
  .bp-deliv .ico { width: 28px; height: 28px; color: #141b34; margin-bottom: 6px; }
  .bp-deliv h3 { font: 600 20px/1.4 var(--rf-font-text) !important; letter-spacing: -0.03em; }
  .bp-deliv p { font: 500 16px/1.7 var(--rf-font-text) !important; }
  /* R52 : icônes de liste en encre ; l'offre a un logo */
  .bp-list .ico { color: #141b34 !important; }
  .bp-offer { display: flex; align-items: center; gap: 16px; }
  .bp-offer__logo { flex: none; width: 56px; height: 56px; border-radius: 16px; display: grid; place-items: center; color: #fff; background: linear-gradient(90deg, var(--rf-blue-light), var(--rf-blue)); border: 1px solid var(--rf-blue-border); box-shadow: inset 0 3px 0 rgba(255, 255, 255, .5), inset 0 -3px 0 var(--rf-blue-edge); }
  .bp-offer__logo .ico { width: 28px; height: 28px; }
  .bp-offer h3 { margin: 0; font: 700 24px/1.3 var(--rf-font-title); letter-spacing: -0.03em; }
  /* R51 : vrai ticker, pleine largeur, continu, jamais en pause (comme le marquee du site) */
  .bp-ticker { margin: 72px -48px 0; -webkit-mask-image: none; mask-image: none; overflow: hidden; }
  .bp-ticker__track { gap: 32px; animation: bp-ticker-seamless 70s linear infinite; will-change: transform; }
  .bp-ticker:hover .bp-ticker__track { animation-play-state: running; }
  @keyframes bp-ticker-seamless { to { transform: translate3d(calc(-50% - 16px), 0, 0); } }
  .bp-review { width: 380px; }
  /* R50 : photos de profil avec contour */
  .bp-review__author img { border: 3px solid #fff; box-shadow: var(--rf-shadow-dir); box-sizing: border-box; width: 56px; height: 56px; }
  @media (max-width: 1100px) { .bp-deliverables { grid-template-columns: 1fr; } }
  @media (max-width: 809px) { .bp-ticker { margin: 56px -16px 0; } .bp-review { width: 300px; } }
`;
fs.writeFileSync(cssOut, c);
console.log("ok");
