// v2 du carrousel Artan (retour de Louis) :
// - les 7 slides « une section par slide » sont remplacées par UNE slide de structure de page,
//   dessinée avec la template de site de Louis (5424:3826), chaque section nommée et expliquée dans un tag ;
// - « Les raisons » devient trois points numérotés illustrés chacun par une capture.
// Usage : node build-v2.mjs <sectionV2Id> <dossier des captures recadrées>
import fs from 'node:fs';
import path from 'node:path';
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, info, hug, tag } from '../../outils/kit.mjs';

const [SEC, CAP] = process.argv.slice(2);
const kidsOf = async (id) => (await fw('get_design_context', { nodeId: id, detail: 'compact', depth: 1 })).nodes[0].children;
async function tree(id) {
  const r = await fw('get_design_context', { nodeId: id, detail: 'minimal', depth: 6 });
  const out = [];
  const walk = (n, d) => { out.push({ ...n, d }); (n.children || []).forEach((c) => walk(c, d + 1)); };
  r.nodes[0].children.forEach((c) => walk(c, 1));
  return out;
}
const firstText = async (id) => (await tree(id)).find((n) => n.type === 'TEXT');
async function setCart(frameId, label, px, py) {
  const t = await firstText(frameId);
  await fw('set_text', { nodeId: t.id, characters: label });
  await fw('set_text_properties', { nodeId: t.id, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await hug(frameId, { px, py });
  return info(frameId);
}
async function capture(parent, file, { x, y, w, r = 10 }) {
  const buf = fs.readFileSync(path.join(CAP, file));
  const meta = JSON.parse(fs.readFileSync(path.join(CAP, 'tailles.json'), 'utf8'))[file];
  const h = w * meta[1] / meta[0];
  const card = await frame(parent, { x, y, w, h, r, fill: { r: 0.04, g: 0.06, b: 0.13 }, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.12 }, effects: SHADOW_CARD, name: 'Capture ' + file });
  await fw('import_image', { parentId: card, data: buf.toString('base64'), x: 0, y: 0, width: w, height: h, name: 'Capture', scaleMode: 'FILL' });
  return card;
}
async function cloneInto(src, name) {
  const { nodeId } = await fw('clone_node', { nodeId: src });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: SEC });
  await fw('rename_node', { nodeId, name });
  return nodeId;
}
const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');

// ---------- 1. Slide « La structure de la page » (template de site de Louis, 5424:3826)
const T = { navy: { r: 0.051, g: 0.118, b: 0.149 }, bar: { r: 0.91, g: 0.91, b: 0.91 }, dark: { r: 0.22, g: 0.22, b: 0.22 }, img: { r: 0.953, g: 0.953, b: 0.953 }, band: { r: 0.984, g: 0.984, b: 0.984 }, mid: { r: 0.72, g: 0.72, b: 0.72 }, hero: { r: 0.851, g: 0.851, b: 0.851 } };
const SH = [[0.05, 2.4, 5.6], [0.04, 10.4, 10.4], [0.03, 23.2, 13.6], [0.01, 40.8, 16.8]].map(([a, y, r]) => ({ type: 'DROP_SHADOW', visible: true, color: { r: 0, g: 0, b: 0, a }, offset: { x: 0, y }, radius: r, spread: 0 }));
const S = await cloneInto('5406:3302', 'Structure de la page');
{
  const k = await kidsOf(S);
  const cart = k.find((c) => c.name === 'Frame 4260').id;
  const ci = await setCart(cart, 'La structure de la page', 21, 15);
  await fw('set_position', { nodeId: cart, x: (575 - ci.width) / 2, y: 92 });
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id, k.find((c) => c.name === 'Frame 4417').id] });
}
const PX = 62, PY = 196, PW = 196, PH = 400;
const P = await frame(S, { x: PX, y: PY, w: PW, h: PH, r: 12, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.19 }, strokeW: 0.9, effects: SH, name: 'Page Artan (structure)' });
const bar = (x, y, w, h = 3.2, c = T.bar, p = P) => rect(p, { x, y, w, h, r: h / 2, fill: c });
const pill = (x, y, w = 26, h = 6.2, p = P) => rect(p, { x, y, w, h, r: h / 2, fill: T.dark, name: 'Bouton' });
const blk = (x, y, w, h, c = T.img) => rect(P, { x, y, w, h, r: 3.5, fill: c, name: 'Image' });
const band = (x, y, w, h, name, strong) => frame(P, { x, y, w, h, r: 3.5, fill: T.band, stroke: { color: strong ? T.dark : { r: 0, g: 0, b: 0 }, a: strong ? 1 : 0.07 }, strokeW: strong ? 0.9 : 0.6, name });
const cx = PW / 2;
const anchors = [];
// Hero : navigation, titre, sous-titre, bouton, rangée de miniatures
await rect(P, { x: 10, y: 8, w: 6, h: 6, r: 1.6, fill: T.navy });
for (let i = 0; i < 3; i++) await bar(70 + i * 18, 10, 12, 2.2);
await pill(160, 7.5, 26, 6);
const h1 = await text(P, 'Personne ne clique sur tes vidéos', { x: 0, y: 22, size: 8.4, color: T.navy, ls: -3, lh: 105 });
const h1i = await info(h1); await fw('set_position', { nodeId: h1, x: cx - h1i.width / 2, y: 22 });
await bar(cx - 46, 35, 92, 3);
await pill(cx - 15, 42, 30, 6.4);
for (let i = 0; i < 4; i++) await blk(10 + i * 45, 54, 41, 20, T.hero);
anchors.push(['Hero', 'promesse claire + CTA direct', 40]);
// Preuve sociale : titre + portraits
await bar(10, 84, 72, 3.6, T.mid);
for (let i = 0; i < 3; i++) await blk(10 + i * 60, 93, 56, 34);
anchors.push(['Preuve sociale', 'les créateurs qui leur font confiance', 110]);
// Avant / après : courbe avec / sans
const aa = await frame(P, { x: 10, y: 137, w: 84, h: 44, r: 3.5, fill: T.img, name: 'Avant / après' });
await fw('import_svg', { parentId: aa, x: 6, y: 8, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="30" viewBox="0 0 72 30"><path d="M1 27 C 15 23, 24 10, 38 14 S 58 3, 71 2" fill="none" stroke="#383838" stroke-width="1.6" stroke-linecap="round"/><path d="M1 28 C 18 27, 30 21, 44 24 S 62 19, 71 18" fill="none" stroke="#B8B8B8" stroke-width="1.4" stroke-linecap="round"/></svg>' });
await bar(104, 147, 70, 3.6, T.mid); await bar(104, 156, 82, 3); await bar(104, 163, 60, 3);
anchors.push(['Avant / après', 'l’effet d’une miniature', 159]);
// Processus : titre, 3 étapes numérotées, visuel
await bar(cx - 40, 191, 80, 3.6, T.mid);
await blk(10, 200, 84, 32);
for (let i = 0; i < 3; i++) { await rect(P, { x: 104, y: 202 + i * 11, w: 7, h: 7, r: 3.5, fill: T.dark }); await bar(115, 204 + i * 11, 62, 3); }
anchors.push(['Processus', '3 étapes pour lever la peur', 216]);
// Offres : deux cartes, la populaire mise en avant
await bar(cx - 40, 242, 80, 3.6, T.mid);
const o1 = await band(18, 252, 76, 40, 'Offre');
const o2 = await band(102, 249, 76, 46, 'Offre populaire', true);
for (const [o, hh] of [[o1, 40], [o2, 46]]) {
  await bar(6, 6, 26, 2.8, T.mid, o); await rect(o, { x: 6, y: 12, w: 22, h: 6, r: 1.5, fill: T.navy });
  await bar(6, 22, 52, 2.4, T.bar, o); await pill(6, hh - 11, 40, 6, o);
}
anchors.push(['Offres', '2 choix clairs, la populaire en avant', 271]);
// Comparatif : tableau
await bar(cx - 40, 304, 80, 3.6, T.mid);
const tb = await band(18, 312, 160, 26, 'Tableau comparatif');
for (let r = 0; r < 3; r++) { await bar(6, 5 + r * 7.5, 40, 2.4, T.bar, tb); for (let c = 0; c < 3; c++) await rect(tb, { x: 78 + c * 28, y: 4.6 + r * 7.5, w: 3.2, h: 3.2, r: 1.6, fill: c === 0 ? T.dark : T.hero }); }
anchors.push(['Comparatif', 'pourquoi Artan et pas les autres', 325]);
// FAQ : questions en accordéon
await bar(cx - 40, 348, 80, 3.6, T.mid);
for (let i = 0; i < 3; i++) { const q = await band(18, 357 + i * 12, 160, 9.5, 'Question'); await bar(5, 3.4, 90 - i * 12, 2.6, T.mid, q); }
anchors.push(['FAQ', 'répondre aux vraies objections', 369]);
// Tags à droite, reliés à leur section
const TX = 286;
for (const [nom, role, ay] of anchors) {
  const t = await tag(S, `${nom} : ${role}`, { x: TX, y: 0, s: 1.02, name: 'Tag ' + nom });
  const ti = await info(t);
  const y = PY + ay;
  await fw('set_position', { nodeId: t, x: TX, y: y - ti.height / 2 });
  try { await fw('set_text_range', { nodeId: (await firstText(t)).id, start: 0, end: nom.length + 1, fontName: { family: 'Inter', style: 'Semi Bold' } }); } catch {}
  const x0 = PX + PW - 10, x1 = TX - 1, w = x1 - x0;
  await fw('import_svg', { parentId: S, x: x0 - 3, y: y - 3, name: 'Liaison', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w + 3}" height="6" viewBox="0 0 ${w + 3} 6"><path d="M3 3 L ${w + 3} 3" stroke="${hex(C.ink)}" stroke-width="1"/><circle cx="3" cy="3" r="2.4" fill="${hex(C.ink)}"/></svg>` });
}

// ---------- 2. Les trois raisons : points numérotés illustrés par une capture
const raisons = [
  ['La preuve dès le début', 'La preuve arrive dès le début, donc la confiance s’installe vite.', 'preuve.jpg'],
  ['Des offres simples', 'Les offres sont simples, donc le visiteur sait quoi choisir.', 'offres.jpg'],
  ['Les objections traitées', 'Les objections sont traitées avant la prise de décision.', 'faq.jpg'],
];
const raisonIds = [];
for (const [i, [titre, desc, file]] of raisons.entries()) {
  const R = await cloneInto('5406:2461', 'Raison ' + (i + 1));
  raisonIds.push(R);
  const all = await tree(R);
  const k = all.filter((n) => n.d === 1);
  await fw('set_text', { nodeId: all.find((n) => n.type === 'TEXT' && /^\d+$/.test(n.name)).id, characters: String(i + 1) });
  await setCart(k.find((n) => n.name === 'Frame 4650').id, titre, 18, 17.5);
  const d = k.find((n) => n.type === 'TEXT' && n.name.startsWith('Pour pousser')).id;
  await fw('set_text', { nodeId: d, characters: desc });
  await fw('resize_nodes', { nodeIds: [d], width: 430, height: 40 });
  await fw('set_text_properties', { nodeId: d, textAutoResize: 'HEIGHT', lineHeight: { unit: 'PERCENT', value: 140 } });
  await fw('delete_nodes', { nodeIds: k.filter((n) => ['Frame 4266', 'Frame 14', 'Frame 2147224256', 'Group 733', 'Vector 729'].includes(n.name)).map((n) => n.id) });
  const di = await info(d);
  await capture(R, file, { x: 62, y: di.y + di.height + 34, w: 452 });
}

// ---------- 3. Retirer les slides remplacées et remettre dans l'ordre
const frames = (await kidsOf(SEC)).filter((k) => k.type === 'FRAME');
const drop = frames.filter((f) => /^\d+ (Point \d|Les raisons)/.test(f.name)).map((f) => f.id);
await fw('delete_nodes', { nodeIds: drop });
const keep = (await kidsOf(SEC)).filter((k) => k.type === 'FRAME');
const find = (re) => keep.find((f) => re.test(f.name))?.id;
const order = [find(/Couverture/), find(/Contexte/), find(/Étape 1/), find(/L’objectif/), find(/Étape 2/), S, find(/Étape 3/), find(/Nouvelle version/), find(/Pourquoi$/), ...raisonIds, find(/Résultat/), find(/Merci/), find(/Offre$/)];
for (const [i, id] of order.entries()) {
  await fw('set_position', { nodeId: id, x: 100 + i * 625, y: 150 });
  const n = keep.find((f) => f.id === id)?.name.replace(/^\d+ /, '') || (id === S ? 'Structure de la page' : 'Raison ' + (raisonIds.indexOf(id) + 1));
  await fw('rename_node', { nodeId: id, name: String(i + 1).padStart(2, '0') + ' ' + n });
}
console.log('ordre', order.length, order.includes(undefined) ? 'MANQUANT' : 'ok');
close();
