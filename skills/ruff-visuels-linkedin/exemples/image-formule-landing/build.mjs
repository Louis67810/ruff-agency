// Image unique « La formule d'une landing page qui convertit » : reproduction de la référence envoyée
// par Louis (contenu.json), dans son style. Coordonnées de la référence (1280 × 1855) transposées.
import fs from 'node:fs';
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, info, sourceCTA, tag, badge, cloneScaled } from '../../outils/kit.mjs';

const D = JSON.parse(fs.readFileSync(new URL('./contenu.json', import.meta.url), 'utf8'));
const W = 1150, H = 1840, m = 0.84;
const X = (x) => 80 + (x - 50) * m;
const Y = (y) => 392 + (y - 177) * m;
const INK = C.ink, GREY = C.greyText, LINE = { r: 0.88, g: 0.88, b: 0.89 };
const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');

// ---------- cadre
const { nodeId: SEC } = await fw('create_section', { name: 'TEST Claude — Image unique « Formule landing page » (v1)', x: 59000, y: -93000, width: W + 200, height: H + 200 });
const F = await frame(SEC, { x: 100, y: 100, w: W, h: H, fill: C.bg, name: 'Post image unique — formule landing page' });
const stripFill = { type: 'GRADIENT_LINEAR', gradientStops: [{ position: 0, color: { r: 0.83, g: 0.83, b: 0.83, a: 0 } }, { position: 0.06, color: { r: 0.83, g: 0.83, b: 0.83, a: 1 } }, { position: 0.92, color: { r: 0.83, g: 0.83, b: 0.83, a: 1 } }, { position: 1, color: { r: 0.83, g: 0.83, b: 0.83, a: 0 } }], gradientTransform: [[0, 1, 0], [-1, 0, 1]] };
const lineFill = { type: 'GRADIENT_LINEAR', gradientStops: [{ position: 0, color: { r: 0, g: 0, b: 0, a: 0 } }, { position: 0.09, color: { r: 0, g: 0, b: 0, a: 1 } }, { position: 0.91, color: { r: 0, g: 0, b: 0, a: 1 } }, { position: 1, color: { r: 0, g: 0, b: 0, a: 0 } }], gradientTransform: [[0, 1, 0], [-1, 0, 1]] };
await rect(F, { x: 0, y: 0, w: 40, h: H, fill: stripFill, name: 'Bandelette' });
await rect(F, { x: W - 40, y: 0, w: 40, h: H, fill: stripFill, name: 'Bandelette' });
await rect(F, { x: 40, y: 0, w: 1, h: H - 70, fill: lineFill, name: 'Filet' });
await rect(F, { x: W - 41, y: 0, w: 1, h: H - 70, fill: lineFill, name: 'Filet' });

// ---------- en-tête : logo + titre sur deux rangées (composants sources mis à l'échelle)
const K = 1.35;
const logo = await cloneScaled('5406:2466', F, K);
const li = await info(logo);
await fw('set_position', { nodeId: logo, x: (W - li.width) / 2, y: 34 });
async function cart(src, label, px, py) {
  const id = await cloneScaled(src, F, K);
  const t = (await fw('get_node', { nodeId: id })).node.children[0];
  await fw('set_text', { nodeId: t.id, characters: label });
  await fw('set_text_properties', { nodeId: t.id, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await fw('set_auto_layout', { nodeId: id, layoutMode: 'HORIZONTAL', paddingLeft: px * K, paddingRight: px * K, paddingTop: py * K, paddingBottom: py * K, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId: id, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  return [id, await info(id)];
}
const [b1, i1] = await cart('5406:1590', D.titre[0], 24, 23);
const [w1, j1] = await cart('5406:1577', D.titre[1], 24, 23);
const [w2, j2] = await cart('5406:1588', D.titre[2], 21, 19.5);
const gap = 11, r1 = i1.width + gap + j1.width, t0 = 112;
await fw('set_position', { nodeId: b1, x: (W - r1) / 2, y: t0 });
await fw('set_position', { nodeId: w1, x: (W - r1) / 2 + i1.width + gap, y: t0 + (i1.height - j1.height) / 2 });
await fw('set_position', { nodeId: w2, x: (W - j2.width) / 2, y: t0 + Math.max(i1.height, j1.height) + 13 });

// ---------- page centrale (archétype générique, textes de la référence traduits)
const PX = X(457), PY = Y(177);
const P = await frame(F, { x: PX, y: PY, w: 381 * m, h: 1591 * m, r: 16, fill: { r: 0.968, g: 0.97, b: 0.975 }, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.08 }, effects: SHADOW_CARD, name: 'Landing page' });
const px = (x) => (x - 457) * m, py = (y) => (y - 177) * m;
const T = (p, s, x, y, size, o = {}) => text(p, s, { x, y, size: size * m, family: o.f || 'Inter', style: o.st || 'Medium', color: o.c || INK, ls: o.ls ?? 0, w: o.w ? o.w * m : undefined, lh: o.lh });
async function TC(p, s, cx, y, size, o = {}) { // texte centré sur cx
  const id = await T(p, s, 0, y, size, o);
  const n = await info(id);
  await fw('set_position', { nodeId: id, x: cx - n.width / 2, y });
  return id;
}
const CX = px(652);
const bar = (p, x, y, w, h = 2.6, c = LINE) => rect(p, { x, y, w, h, r: h / 2, fill: c });
const card = (p, x, y, w, h, o = {}) => frame(p, { x, y, w, h, r: (o.r ?? 6) * m, fill: C.white, stroke: { color: o.sc || { r: 0, g: 0, b: 0 }, a: o.sa ?? 0.08 }, strokeW: o.sw || 0.8, effects: SHADOW_CARD, name: o.name });
async function cta(p, label, cx, y, s) { const id = await sourceCTA(p, label, { x: 0, y, s }); const n = await info(id); await fw('set_position', { nodeId: id, x: cx - n.width / 2, y }); return id; }

// navigation
const nav = await card(P, px(515), py(198), 270 * m, 17 * m, { r: 5, name: 'Navigation' });
await rect(nav, { x: 6 * m, y: 5 * m, w: 7 * m, h: 7 * m, r: 1.5, fill: INK });
await TC(nav, 'Fonctionnalités     Bénéfices     Tarifs', 135 * m, 5.5 * m, 4.6);
await sourceCTA(nav, 'Commencer', { x: 236 * m, y: 2.4 * m, s: 0.115 });
// hero
const eb = await frame(P, { x: px(600), y: py(239), w: 100, h: 13 * m, r: 7 * m, fill: C.blueSoft, name: 'Sur-titre' });
await T(eb, 'Pour les équipes à distance', 0, 0, 4.6, { c: C.blue, st: 'Semi Bold' });
await fw('set_auto_layout', { nodeId: eb, layoutMode: 'HORIZONTAL', paddingLeft: 6 * m, paddingRight: 6 * m, paddingTop: 3 * m, paddingBottom: 3 * m, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
await fw('set_layout_props', { nodeId: eb, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
const ebi = await info(eb); await fw('set_position', { nodeId: eb, x: CX - ebi.width / 2, y: py(239) });
await TC(P, 'Organise tes échanges, fichiers', CX, py(263), 16, { f: 'Plus Jakarta Sans', st: 'Bold', ls: -2 });
await TC(P, 'et outils au même endroit', CX, py(282), 16, { f: 'Plus Jakarta Sans', st: 'Bold', ls: -2 });
await TC(P, 'Slack est gratuit aussi longtemps que tu veux', CX, py(306), 4.4, { c: GREY });
await cta(P, 'Essayer gratuitement', CX, py(326), 0.16);
await TC(P, 'Sans carte bancaire', CX, py(352), 5, { st: 'Semi Bold' });
const vid = await card(P, px(547), py(376), 171 * m, 106 * m, { r: 7, name: 'Vidéo / capture produit' });
const play = await frame(vid, { x: (85.5 - 7) * m, y: (53 - 7) * m, w: 14 * m, h: 14 * m, r: 7 * m, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.15 }, effects: SHADOW_CARD });
await fw('import_svg', { parentId: play, x: 4.6 * m, y: 3.8 * m, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${5.6 * m}" height="${6.4 * m}" viewBox="0 0 7 8"><path d="M0 0 L7 4 L0 8 Z" fill="${hex(INK)}"/></svg>` });
await TC(P, 'Rejoint par +4 000 entreprises en croissance', CX, py(493), 3.8, { c: GREY });
for (let i = 0; i < 6; i++) { await rect(P, { x: px(520 + i * 43), y: py(506), w: 4.5 * m, h: 4.5 * m, r: 2.25 * m, fill: { r: 0.8, g: 0.8, b: 0.82 } }); await bar(P, px(526 + i * 43), py(507), 28 * m, 2.6 * m, { r: 0.82, g: 0.82, b: 0.84 }); }
// bénéfices
await TC(P, 'Pourquoi les équipes adorent l’utiliser', CX, py(533), 10.5, { f: 'Plus Jakarta Sans', st: 'Bold', ls: -2 });
const feats = ['Aller plus vite', 'Rester organisé', 'Garder le contrôle'];
for (const [i, f] of feats.entries()) {
  const c = await card(P, px(502 + i * 99), py(567), 93 * m, 67 * m, { r: 6, name: 'Bénéfice' });
  await rect(c, { x: (46.5 - 6) * m, y: 9 * m, w: 12 * m, h: 12 * m, r: 3.5 * m, fill: C.blueSoft });
  await rect(c, { x: (46.5 - 2.5) * m, y: 12.5 * m, w: 5 * m, h: 5 * m, r: 1 * m, fill: C.blue });
  await TC(c, f, 46.5 * m, 28 * m, 4.8, { st: 'Semi Bold' });
  await bar(c, (46.5 - 30) * m, 39 * m, 60 * m); await bar(c, (46.5 - 22) * m, 45 * m, 44 * m);
}
await TC(P, '“', CX, py(645), 12, { f: 'Plus Jakarta Sans', st: 'Bold' });
await TC(P, 'Notre onboarding est passé', CX, py(661), 4.8);
await TC(P, 'de 1 semaine à 2 jours.', CX, py(668), 4.8);
await TC(P, '— Sophie, AXA', CX, py(684), 4, { c: GREY });
await cta(P, 'Essai gratuit', CX, py(703), 0.14);
// tarifs
await TC(P, 'Des offres pour chaque étape', CX, py(762), 10.5, { f: 'Plus Jakarta Sans', st: 'Bold', ls: -2 });
const tg = await frame(P, { x: px(608), y: py(787), w: 82 * m, h: 13 * m, r: 6.5 * m, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.1 }, strokeW: 0.6, name: 'Sélecteur mensuel / annuel' });
await T(tg, 'Mensuel', 9 * m, 3.4 * m, 4.4, { c: GREY });
await rect(tg, { x: 37 * m, y: 3.5 * m, w: 11 * m, h: 6 * m, r: 3 * m, fill: C.grey });
await rect(tg, { x: 42 * m, y: 4.3 * m, w: 4.4 * m, h: 4.4 * m, r: 2.2 * m, fill: C.white });
await T(tg, 'Annuel', 53 * m, 3.4 * m, 4.4);
await tag(P, '-10 %', { x: px(700), y: py(799), s: 0.42 });
const plans = [['Solo', 'Pour les solopreneurs qui démarrent', '12 €', [1, 1, 0, 0]], ['Équipe startup', 'Pour les équipes qui grandissent vite', '48 €', [1, 1, 1, 0]], ['Entreprise', 'Pour les grandes équipes aux besoins avancés', '168 €', [1, 1, 1, 1]]];
let midCard;
for (const [i, [name, who, price, okk]] of plans.entries()) {
  const c = await card(P, px(483 + i * 112), py(822), 106 * m, 156 * m, { r: 6, sc: i === 1 ? C.blue : undefined, sa: i === 1 ? 0.9 : 0.08, sw: i === 1 ? 1.2 : 0.8, name: 'Offre ' + name });
  if (i === 1) midCard = c;
  await T(c, name, 7 * m, 7 * m, 5.4, { st: 'Semi Bold' });
  await T(c, who, 7 * m, 15 * m, 3.6, { c: GREY, w: 80, lh: 125 });
  await T(c, price, 7 * m, 33 * m, 12, { f: 'Plus Jakarta Sans', st: 'Bold', ls: -2 });
  await T(c, '/mois', 33 * m, 39 * m, 4, { c: GREY });
  for (let r = 0; r < 4; r++) {
    await rect(c, { x: 7 * m, y: (64 + r * 10) * m, w: 4.4 * m, h: 4.4 * m, r: 2.2 * m, fill: okk[r] ? { r: 0.157, g: 0.718, b: 0.22 } : { r: 0.94, g: 0.2, b: 0.2 } });
    await bar(c, 14 * m, (65.2 + r * 10) * m, (r % 2 ? 50 : 62) * m, 2.2 * m);
  }
  if (i === 2) {
    const tip = await frame(c, { x: 33 * m, y: 76 * m, w: 74 * m, h: 36 * m, r: 3 * m, fill: INK, name: 'Infobulle' });
    for (let r = 0; r < 4; r++) await bar(tip, 5 * m, (6 + r * 7) * m, (r === 3 ? 40 : 62) * m, 2.2 * m, { r: 0.75, g: 0.75, b: 0.78 });
    const ic = await frame(c, { x: 74 * m, y: 63.5 * m, w: 5.4 * m, h: 5.4 * m, r: 2.7 * m, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.35 }, strokeW: 0.6, name: 'Icône info' });
    await T(ic, 'i', 2 * m, 0.4 * m, 3.8, { st: 'Bold' });
  }
  const b = await sourceCTA(c, 'Choisir ' + name, { x: 0, y: 124 * m, s: 0.105 });
  const bi = await info(b); await fw('set_position', { nodeId: b, x: (106 * m - bi.width) / 2, y: 123 * m });
  await TC(c, 'Change d’offre ou résilie quand tu veux', 53 * m, 143 * m, 3.1, { c: GREY });
}
const pop = await tag(P, 'Le plus populaire', { x: 0, y: 0, s: 0.4 });
const popi = await info(pop);
await fw('set_position', { nodeId: pop, x: px(701) - popi.width + 4, y: py(822) - popi.height / 2 });
await TC(P, 'Rejoint par +1 300 équipes avec notre produit', CX, py(1000), 4.2, { st: 'Semi Bold' });
for (let i = 0; i < 4; i++) { await rect(P, { x: px(543 + i * 44), y: py(1014), w: 5 * m, h: 5 * m, r: 2.5 * m, fill: { r: 0.8, g: 0.8, b: 0.82 } }); await bar(P, px(550 + i * 44), py(1015.3), 30 * m, 2.6 * m, { r: 0.82, g: 0.82, b: 0.84 }); }
// témoignages
await TC(P, 'Adoré par les startups du monde entier', CX, py(1065), 10.5, { f: 'Plus Jakarta Sans', st: 'Bold', ls: -2 });
const people = [['Sophie Anwar', 'Product manager, AXA'], ['Leo Martinez', 'CEO, BrightDesk'], ['Adam Petrova', 'Ops lead, Northwave']];
for (const [i, [nm, role]] of people.entries()) {
  const c = await card(P, px(487 + i * 109), py(1098), 103 * m, 84 * m, { r: 6, name: 'Témoignage' });
  for (let r = 0; r < 6; r++) await bar(c, 7 * m, (8 + r * 7) * m, (r === 3 ? 82 : r === 5 ? 50 : 88) * m, 2.4 * m, r === 3 ? INK : LINE);
  await rect(c, { x: 7 * m, y: 66 * m, w: 9 * m, h: 9 * m, r: 4.5 * m, fill: { r: 0.78, g: 0.8, b: 0.86 } });
  await T(c, nm, 19 * m, 65.5 * m, 3.8, { st: 'Semi Bold' });
  await T(c, role, 19 * m, 71 * m, 3.1, { c: GREY });
  await T(c, 'Il y a 3 jours', 76 * m, 70 * m, 3, { c: GREY });
}
await TC(P, 'Utilisé par +1 000 startups', CX, py(1198), 4.2, { st: 'Semi Bold' });
await cta(P, 'Prêt à nous rejoindre ?', CX, py(1212), 0.14);
// FAQ
await TC(P, 'Encore des questions ? On a les réponses', CX, py(1258), 10.5, { f: 'Plus Jakarta Sans', st: 'Bold', ls: -2 });
const tabs = await frame(P, { x: px(578), y: py(1286), w: 148 * m, h: 15 * m, r: 7.5 * m, fill: { r: 0.93, g: 0.93, b: 0.94 }, name: 'Catégories' });
await rect(tabs, { x: 2 * m, y: 2 * m, w: 34 * m, h: 11 * m, r: 5.5 * m, fill: C.white, effects: SHADOW_CARD });
for (const [i, l] of ['Général', 'Tarifs', 'Technique', 'Légal'].entries()) await T(tabs, l, (8 + i * 36) * m, 4.3 * m, 4, { c: i ? GREY : INK });
const q1 = await card(P, px(537), py(1320), 223 * m, 66 * m, { r: 5, name: 'Question ouverte' });
await T(q1, '1. Combien coûte ta landing page ?', 8 * m, 7 * m, 4.8, { st: 'Semi Bold' });
await T(q1, '–', 212 * m, 5 * m, 6, { c: GREY });
await T(q1, 'Notre landing page (design + développement) démarre à 1 800 $.', 8 * m, 23 * m, 4, { c: GREY });
await T(q1, 'Le design seul démarre à 1 000 $.', 8 * m, 30 * m, 4, { c: GREY });
await T(q1, 'Besoin d’un devis sur mesure ? Réserve un appel rapide', 8 * m, 47 * m, 4, { st: 'Semi Bold' });
for (const [i, q] of ['2. Combien de temps dure un projet ?', '3. Que se passe-t-il une fois la facture payée ?'].entries()) {
  const c = await card(P, px(537), py(1393 + i * 25), 223 * m, 20 * m, { r: 5, name: 'Question' });
  await T(c, q, 8 * m, 6.5 * m, 4.6, { st: 'Semi Bold' });
  await T(c, '+', 212 * m, 3.6 * m, 6, { c: GREY });
}
await TC(P, 'Tu ne trouves pas ta réponse ?', CX, py(1455), 4.2, { c: GREY });
await cta(P, 'Réserver un appel', CX, py(1466), 0.13);
// CTA final
const fin = await card(P, px(520), py(1505), 256 * m, 120 * m, { r: 7, name: 'CTA final' });
await T(fin, 'Prêt à simplifier', 14 * m, 11 * m, 8.6, { f: 'Plus Jakarta Sans', st: 'Bold', ls: -2 });
await T(fin, 'ton organisation ?', 14 * m, 22 * m, 8.6, { f: 'Plus Jakarta Sans', st: 'Bold', ls: -2 });
await T(fin, 'Pour les équipes de toute taille.', 14 * m, 40 * m, 4, { c: GREY });
await T(fin, 'Mise en place en moins de 2 minutes.', 14 * m, 46 * m, 4, { c: GREY });
await sourceCTA(fin, 'Démarrer l’essai gratuit', { x: 13 * m, y: 70 * m, s: 0.14 });
await T(fin, '★ 4,6/5 sur G2', 14 * m, 102 * m, 4, { st: 'Semi Bold' });
await rect(fin, { x: 132 * m, y: 20 * m, w: 110 * m, h: 90 * m, r: 5 * m, fill: { r: 0.945, g: 0.95, b: 0.96 }, name: 'Image produit' });
// footer
const ft = await card(P, px(482), py(1650), 333 * m, 100 * m, { r: 7, name: 'Footer' });
await rect(ft, { x: 14 * m, y: 13 * m, w: 8 * m, h: 8 * m, r: 2, fill: INK });
await T(ft, '« Aider les équipes à lancer plus vite,', 14 * m, 29 * m, 3.8, { c: GREY });
await T(ft, 'chaque semaine. »', 14 * m, 35 * m, 3.8, { c: GREY });
await sourceCTA(ft, 'Démarrer l’essai', { x: 13 * m, y: 55 * m, s: 0.1 });
const cols = [[127, 'Pages', ['Accueil', 'Fonctionnalités', 'Tarifs', 'Contact', 'FAQ']], [163, 'Légal', ['Confidentialité', 'CGU', 'Cookies', 'Mentions légales']], [220, 'Réseaux', ['Instagram', 'Twitter/X', 'LinkedIn']], [262, 'Contact', ['contact@entreprise.com', '19 rue de la Paix', 'Paris']]];
for (const [x, h, items] of cols) { await T(ft, h, x * m, 11 * m, 4, { st: 'Semi Bold' }); for (const [i, it] of items.entries()) await T(ft, it, x * m, (20 + i * 7) * m, 3.4, { c: GREY }); }
await TC(ft, '2025 Entreprise. Tous droits réservés.', 166.5 * m, 89 * m, 3, { c: GREY });

// ---------- annotations
const check = await badge(F, 'check', { x: -100, y: -100, rot: -25, size: 13 });
const SHADOW_TAG = [0.05, 0.04, 0.03, 0.01].map((a, i) => ({ type: 'DROP_SHADOW', visible: true, color: { r: 0.36, g: 0.36, b: 0.36, a }, offset: { x: 0, y: [0.8, 2.4, 5.5, 9.5][i] }, radius: [1.6, 2.4, 3.2, 4][i], spread: 0 }));
const box = async (name) => {
  const b = await frame(F, { x: 0, y: 0, w: 100, h: 30, r: 8, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.14 }, strokeW: 0.8, effects: SHADOW_TAG, name });
  return b;
};
const layout = async (id, mode, o = {}) => {
  await fw('set_auto_layout', { nodeId: id, layoutMode: mode, paddingLeft: o.pl ?? 9, paddingRight: o.pr ?? 10, paddingTop: o.pt ?? 6.5, paddingBottom: o.pb ?? 6.5, itemSpacing: o.gap ?? 6, primaryAxisAlignItems: 'MIN', counterAxisAlignItems: o.ca || 'CENTER' });
  await fw('set_layout_props', { nodeId: id, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
};
const addCheck = async (parent) => { const { nodeId } = await fw('clone_node', { nodeId: check }); await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: parent }); return nodeId; };
const FS = 9.6;
const connector = async (pts) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - 4, y0 = Math.min(...ys) - 4, w = Math.max(...xs) - x0 + 4, h = Math.max(...ys) - y0 + 4;
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${(p[0] - x0).toFixed(1)} ${(p[1] - y0).toFixed(1)}`).join(' ');
  const e = pts[pts.length - 1];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(1)}" height="${h.toFixed(1)}" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}"><path d="${d}" fill="none" stroke="${hex(INK)}" stroke-width="1"/><circle cx="${(e[0] - x0).toFixed(1)}" cy="${(e[1] - y0).toFixed(1)}" r="2.6" fill="${hex(INK)}"/></svg>`;
  await fw('import_svg', { parentId: F, svg, x: x0, y: y0, name: 'Liaison' });
};
async function place(id, side, x1, y1, x2, y2, route) {
  const n = await info(id);
  const cy = Y((y1 + y2) / 2);
  const x = side === 'R' ? X(x1) : X(x2) - n.width;
  await fw('set_position', { nodeId: id, x, y: cy - n.height / 2 });
  if (route && route.length) {
    const start = side === 'R' ? [x, cy] : [x + n.width, cy];
    const pts = [start, ...route.map(([rx, ry], i) => [X(rx), i === 0 && route.length > 1 && Math.abs(Y(ry) - cy) < 14 ? cy : Y(ry)])];
    if (route.length === 1) pts[1][1] = cy; // liaison droite : même hauteur que l'annotation
    await connector(pts);
  }
}
for (const [side, x1, y1, x2, y2, s, route] of D.annotations) {
  const b = await box('Annotation');
  await addCheck(b);
  const w = Math.max((x2 - x1) * m * 1.12 - 34, 60);
  await text(b, s, { x: 0, y: 0, size: FS, family: 'Plus Jakarta Sans', style: 'Bold', w, lh: 128, ls: -1 });
  await layout(b, 'HORIZONTAL', { ca: 'MIN' });
  await place(b, side, x1, y1, x2, y2, route);
}
for (const [side, x1, y1, x2, y2, title, kind, items, route, foot, arrowFrom] of D.encadres) {
  const b = await box('Encadré');
  const bw = (x2 - x1) * m * 1.12 - 20;
  await text(b, title, { x: 0, y: 0, size: FS + 0.4, family: 'Plus Jakarta Sans', style: 'Bold', ls: -1 });
  for (const [h, d] of items) {
    const row = await frame(b, { x: 0, y: 0, w: 10, h: 10, fill: null, name: 'Ligne' });
    if (kind === 'check') await addCheck(row);
    else await text(row, '↳', { x: 0, y: 0, size: FS, family: 'Inter', style: 'Medium', color: GREY, ls: 0 });
    const tid = await text(row, d ? `${h} → ${d}` : h, { x: 0, y: 0, size: FS - 0.6, family: 'Plus Jakarta Sans', style: d ? 'Bold' : 'Bold', color: INK, w: bw - 26, lh: 128, ls: -1 });
    if (d) await fw('set_text_properties', { nodeId: tid, fontSize: FS - 0.6 });
    await layout(row, 'HORIZONTAL', { pl: 0, pr: 0, pt: 0, pb: 0, gap: 5, ca: 'MIN' });
  }
  if (foot) await text(b, foot, { x: 0, y: 0, size: FS - 0.4, family: 'Plus Jakarta Sans', style: 'Bold', w: bw, lh: 128, ls: -1 });
  await layout(b, 'VERTICAL', { pl: 11, pr: 11, pt: 9, pb: 9, gap: 6, ca: 'MIN' });
  await place(b, side, x1, y1, x2, y2, route);
  if (arrowFrom) {
    const [ax, ay] = arrowFrom; const n = await info(b);
    const x = X(ax), y0 = Y(ay), y1b = n.y - 3;
    await fw('import_svg', { parentId: F, x: x - 5, y: y0, name: 'Flèche', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="${(y1b - y0).toFixed(1)}" viewBox="0 0 10 ${(y1b - y0).toFixed(1)}"><path d="M5 0 L5 ${(y1b - y0 - 1).toFixed(1)} M1 ${(y1b - y0 - 5).toFixed(1)} L5 ${(y1b - y0 - 1).toFixed(1)} L9 ${(y1b - y0 - 5).toFixed(1)}" fill="none" stroke="${hex(INK)}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>` });
  }
}
await fw('delete_nodes', { nodeIds: [check] });

// ---------- signature (PP + nom + promesse, composants sources)
const S = 1.55;
const pp = await cloneScaled('5406:2493', F, S);
const nm = await cloneScaled('5406:2486', F, S);
const pr = await cloneScaled('5406:2492', F, S);
const ppi = await info(pp);
await fw('set_position', { nodeId: pp, x: 70, y: H - 92 });
await fw('set_position', { nodeId: nm, x: 70 + ppi.width + 14, y: H - 90 });
await fw('set_position', { nodeId: pr, x: 70 + ppi.width + 14, y: H - 64 });
console.log('section', SEC, 'frame', F);
close();
