// Audit statique d'une maquette Ruff : vérifie les règles validées de
// brand/design/feedback.md qui peuvent se contrôler dans le code.
// Usage : node audit.mjs <section.html>
// Sortie : « audit passed » (code 0) ou la liste des échecs (code 1).
// Ce que l'audit ne voit pas (fondu R5, sobriété R16, concept R10) se vérifie
// à l'œil avec references/verify.md.
import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
if (!file) { console.error("usage: node audit.mjs <section.html>"); process.exit(2); }
const html = fs.readFileSync(file, "utf8");
const fails = [];
const warns = [];
const fail = (rule, msg) => fails.push(`FAIL ${rule} : ${msg}`);
const warn = (rule, msg) => warns.push(`WARN ${rule} : ${msg}`);

// Feuille de styles : doit être la feuille courante ou une version figée.
const css = html.match(/<link[^>]+href="([^"]*ruff-tokens[^"]*)"/);
if (!css) fail("tokens", "aucune feuille ruff-tokens*.css liée");
else {
  const cssPath = path.resolve(path.dirname(file), css[1]);
  if (!fs.existsSync(cssPath)) fail("tokens", `feuille introuvable : ${css[1]}`);
  else {
    const t = fs.readFileSync(cssPath, "utf8");
    const imp = t.indexOf("@import");
    if (imp > -1 && t.slice(0, imp).includes("{")) fail("R15", "une règle précède l'@import des polices (les polices ne chargeraient pas)");
    if (!t.includes("box-sizing: border-box")) fail("R15", "box-sizing: border-box absent (le bouton grandit)");
  }
}

// R1 / R2 : toutes les cartes teintées ou aucune, teintes toutes différentes.
const cards = [...html.matchAll(/class="rf-bento rf-bento--([a-z]+)/g)].map((m) => m[1]);
const tints = ["blue", "yellow", "green", "violet", "red", "cyan", "cream"];
const tinted = cards.filter((c) => tints.includes(c));
if (tinted.length && tinted.length !== cards.length) fail("R1", `cartes mélangées teintées / non teintées : ${cards.join(", ")}`);
if (new Set(tinted).size !== tinted.length) fail("R1", `teinte répétée : ${tinted.join(", ")}`);

// R3 : pas de carte sombre dans une section claire.
if (cards.includes("dark") && !/class="[^"]*rf-section[^"]*rf-section--dark/.test(html)) fail("R3", "carte .rf-bento--dark dans une section claire");

// R7 : curseur = assets/cursor.svg, pas un curseur redessiné en ligne.
if (/<symbol id="rf-cursor"/.test(html)) fail("R7", "curseur redessiné en ligne : utiliser <img class=\"rf-cursor\" src=\"…/assets/cursor.svg\">");

// R57 : le curseur est .rf-pointer (curseur de Louis symétrisé), plus l'ancien triangle noir ni l'ancien « Vous ».
if (/class="rf-cursor"|class="rf-you"/.test(html)) fail("R57", "ancien curseur (.rf-cursor / .rf-you) : utiliser .rf-pointer");
if (/class="rf-pointer[^"]*"/.test(html) && !/rf-pointer__arrow/.test(html)) fail("R57", ".rf-pointer sans sa flèche (svg.rf-pointer__arrow)");

// R58 : une loupe est la loupe officielle .rf-loupe (ombre commune au verre et au manche), jamais redessinée.
if (/class="[^"]*\b[\w]+-lens\b/.test(html) && !/class="rf-loupe"/.test(html)) fail("R58", "loupe redessinée : utiliser .rf-loupe (verre + manche, ombre commune)");

// R59 : flou d'arrière-plan sur une illustration sur cinq au plus ; une loupe par page au plus.
{
  const artsAll = html.split('class="rf-bento__art"').slice(1).map((c) => c.split('class="rf-bento__copy"')[0]);
  const blurred = artsAll.filter((c) => /class="[^"]*\brf-blur\b/.test(c)).length;
  if (artsAll.length && blurred > Math.max(1, Math.floor(artsAll.length / 5))) fail("R59", `${blurred} illustrations floutées sur ${artsAll.length} (une sur cinq au plus)`);
  const loupes = (html.match(/class="rf-loupe"/g) || []).length;
  if (loupes > 1) fail("R59", `${loupes} loupes dans la page (une au plus)`);
}

// R60 / R61 : une seule couleur d'accent par illustration (hors fond de carte et pastilles .rf-dot de palette).
{
  const artsAll = html.split('class="rf-bento__art"').slice(1).map((c) => c.split('class="rf-bento__copy"')[0]);
  artsAll.forEach((c, i) => {
    const colors = new Set([...c.matchAll(/rf-(?:avatar|pointer)--(green|pink|yellow|purple|violet|blue)\b|--rf-pastel-(\w+)/g)].map((m) => m[1] || m[2]));
    if (/var\(--rf-blue\)|#0147ff|rf-pin--on|au-pin--on|au-num--on|au-scan/i.test(c)) colors.add("accent-bleu");
    if (colors.size > 2) fail("R60", `illustration ${i + 1} : ${colors.size} couleurs (${[...colors].join(", ")}) ; gris + un accent`);
    const pastelAvatars = (c.match(/rf-avatar--(green|pink|yellow|purple)/g) || []).length;
    if (pastelAvatars > 3) fail("R61", `illustration ${i + 1} : ${pastelAvatars} avatars colorés ; un visiteur = icône grise`);
  });
}

// R62 : un repère numéroté (rond « 1 » + remarque) par page ou section au plus, pas de repères gris en décor.
{
  const pins = (html.match(/class="[^"]*\b[\w]+-pin\b/g) || []).length;
  if (pins > 1) fail("R62", `${pins} repères numérotés (un seul par page ou section)`);
}

// R9 : pas de ronds à ondulations (anneaux 0 0 0 Npx répétés).
if (/box-shadow:\s*0 0 0 \d+px[^;]*,\s*0 0 0 \d+px/.test(html)) fail("R9", "cercles concentriques (box-shadow en anneaux)");

// R11 : pas de bouton bleu dans une maquette.
if (/rf-pill--blue/.test(html)) fail("R11", "bouton de maquette bleu (.rf-pill--blue)");

// R13 : petits ronds de couleur = .rf-dot, pas des avatars pastel minuscules.
for (const m of html.matchAll(/class="rf-avatar rf-avatar--(green|pink|yellow|purple)"[^>]*style="[^"]*width:\s*(\d+)px/g)) {
  if (+m[2] < 40) fail("R13", `rond pastel de ${m[2]} px : utiliser .rf-dot`);
}
if (/\.bn-faces span \{[^}]*position: relative !important/.test(html)) fail("R13", "ronds pastel détournés (.bn-faces span)");

// R17 : jamais de pointillés qui ondulent.
for (const m of html.matchAll(/<path[^>]*>/g)) {
  const tag = m[0];
  if (/stroke-dasharray/.test(tag) && /d="[^"]*[CSQcsq]/.test(tag)) fail("R17", "tracé courbe en pointillés");
}

// R18 : assez de contenu dans chaque illustration (≥ 12 éléments).
const arts = html.split('class="rf-bento__art"').slice(1);
arts.forEach((chunk, i) => {
  const body = chunk.split('class="rf-bento__copy"')[0];
  const n = (body.match(/<(div|span|img|svg|i)\b/g) || []).length;
  if (n < 12) fail("R18", `illustration ${i + 1} : ${n} éléments (minimum 12)`);
});

// R19 : logo des maquettes en gris, jamais en encre.
if (/nav span:first-child \{[^}]*background:\s*var\(--rf-ink\)/.test(html)) fail("R19", "logo de maquette en --rf-ink (noir) : utiliser --rf-wire-bar");

// ---- Règles de structure de page (R21 à R37) ----------------------------
const isPage = /\/pages\/|\\pages\\/.test(path.resolve(file)) && !/merci/.test(file);
const styleAll = (html.match(/<style>([\s\S]*?)<\/style>/g) || []).join("\n");

// R21 : footer réel du site.
if (isPage && !/footer-reset framer-M7Fsn/.test(html)) fail("R21", "le footer du site (components/site-footer.html) est absent");
if (/footer-reset framer-M7Fsn/.test(html) && !/components\/footer\/Footer\.css/.test(html)) fail("R21", "footer présent mais Footer.css non relié");

// R40 : pas de bandeau d'appel dans le footer quand la page a déjà son appel final.
if (/footer--with-cta/.test(html) && (/id="formulaire"|<form\b|rf-btn--primary[\s\S]*<\/main>/.test(html))) fail("R40", "footer avec bandeau d'appel alors que la page a déjà son appel final : utiliser site-footer-sans-cta.html");

// R43 : H1 de 64 px au plus.
for (const m of styleAll.matchAll(/h1[^{]*\{[^}]*font:\s*\d+\s+(\d+)px/g)) { if (+m[1] > 64) fail("R43", `H1 de ${m[1]} px (64 px au plus)`); }

// R53 / R48 : héros teinté avec les formes du site (pages complètes).
if (isPage && /<section class="bp-hero/.test(html) && !/<section class="bp-hero[^"]*"[^>]*>\s*<div class="rf-shapes/.test(html)) fail("R48", "héros sans les formes SVG du site (components/shapes.html)");
if (isPage && /\.bp-hero \{[^}]*background: #fbfbfb/.test(styleAll) && !/\.bp-hero--tint \{[^}]*background: rgb\(249, 251, 255\)/.test(styleAll)) fail("R53", "héros sur fond blanc : utiliser rgb(249,251,255)");

// R51 : un ticker ne se met pas en pause au survol.
if (/ticker:hover [^{]*\{[^}]*animation-play-state:\s*paused/.test(styleAll) && !/ticker:hover [^{]*\{[^}]*animation-play-state:\s*running/.test(styleAll)) fail("R51", "ticker mis en pause au survol (un vrai ticker défile en continu)");

// R55 : un appel « réserver un appel » se termine par l’agenda Cal.com intégré, pas par un bouton.
if (isPage && /Réserver un appel/.test(html)) {
  if (!/id="my-cal-inline-discovery-call"/.test(html) || !/ruffagency\/discovery-call/.test(html)) fail("R55", "page « réserver un appel » sans l’agenda Cal.com intégré dans la dernière section");
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [""])[0];
  if (/href="https:\/\/ruff\.agency\/30-min"/.test(main)) fail("R55", "bouton vers ruff.agency/30-min : pointer vers #reserver (l’agenda de la page)");
}

// R45 : un avis client a toujours la photo de son auteur.
for (const m of html.matchAll(/<blockquote\b[\s\S]*?<\/blockquote>/g)) { if (!/<img\b/.test(m[0])) { fail("R45", "avis client sans photo"); break; } }

// R36 : FAQ réelle du site.
if (/<details[\s>]/.test(html) && /FAQ|questions/i.test(html)) fail("R36", "FAQ faite maison (<details>) : utiliser components/site-faq.html");
if (/stack-section-3/.test(html) && !/StackSection3\.css/.test(html)) fail("R36", "FAQ présente mais StackSection3.css non relié");

// R22 : pas d'aplat bleu en fond de section.
for (const m of styleAll.matchAll(/([^{}]+)\{[^}]*background(?:-color)?:\s*(#0147ff|#0a67e2|#075bb8|rgb\(1,\s*71,\s*255\))\s*;?[^}]*\}/gi)) {
  if (/sec|section|blue|band/i.test(m[1])) fail("R22", `aplat bleu sur ${m[1].trim().slice(0, 40)} : utiliser le dégradé du site`);
}
if (/112deg,\s*#075bb8/.test(styleAll)) fail("R22", "ancien dégradé bleu (112deg) : utiliser le dégradé vertical du site");

// R25 / R35 : pas de points de couleur dans le contenu.
if (/::before\s*\{[^}]*border-radius:\s*50%[^}]*background:\s*var\(--rf-dot/.test(styleAll)) fail("R25", "points de couleur sous un bouton : utiliser des Heroicons");
for (const m of html.matchAll(/<li(?:\s[^>]*)?>((?:(?!<\/li>)[\s\S])*)<\/li>/g)) {
  if (/rf-dot/.test(m[1])) { fail("R35", "pastille .rf-dot dans une liste de contenu"); break; }
}

// R26 : bicolore une fois par page au plus.
const bicolor = (html.match(/<h[12][^>]*class="rf-h[12]"[^>]*>\s*<span>/g) || []).length;
if (bicolor > 1) fail("R26", `${bicolor} titres bicolores (maximum 1)`);

// R27 : pas de pointillés autour d'un visuel.
if (/border:\s*[\d.]+px\s+dashed/.test(styleAll)) fail("R27", "bordure en pointillés");

// R34 : pas de libellés en majuscules dans le contenu.
if (/text-transform:\s*uppercase/.test(styleAll)) fail("R34", "text-transform: uppercase dans la page");

// R37 : fonds de section variés.
const bgs = [...styleAll.matchAll(/\.([\w-]*(?:sec|section)[\w-]*)[^{]*\{[^}]*background(?:-color)?:\s*([^;}]+)/g)].map((m) => m[2].trim());
if (isPage && new Set(bgs).size < 2) warn("R37", "fonds de section peu variés");

// R6 : ombres = variables du site. Une ombre écrite à la main est suspecte.
const style = (html.match(/<style>([\s\S]*?)<\/style>/) || [, ""])[1];
for (const m of style.matchAll(/box-shadow:\s*([^;}]+)/g)) {
  if (!/var\(--rf-shadow|none/.test(m[1])) warn("R6", `ombre écrite à la main : ${m[1].trim().slice(0, 60)}`);
}

// R12 : le fichier est versionné.
if (!/-v\d+\.html$/.test(file)) warn("R12", "nom de fichier sans numéro de version (-vN.html)");

for (const w of warns) console.log(w);
if (fails.length) { for (const f of fails) console.log(f); console.log(`audit failed (${fails.length})`); process.exit(1); }
console.log("audit passed");
