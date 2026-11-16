// Carrousel « Comment j'ai créé le site d'un studio YouTube pour lancer des ads » (Artan).
// Étude de cas en 3 étapes, texte fourni par Louis, captures réelles de https://artan.framer.website/.
// Usage : node build.mjs <dossier des captures recadrées>
import fs from 'node:fs';
import path from 'node:path';
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, info, hug, badge, tag } from '../../outils/kit.mjs';

const CAP = process.argv[2];
const { nodeId: SEC } = await fw('create_section', { name: 'Claude — Carrousel Artan (v1)', x: 59000, y: -90500, width: 19 * 625 + 150, height: 1000 });
const slides = [];
async function slide(src, name) {
  const { nodeId } = await fw('clone_node', { nodeId: src });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: SEC });
  await fw('set_position', { nodeId, x: 100 + slides.length * 625, y: 150 });
  await fw('rename_node', { nodeId, name: String(slides.length + 1).padStart(2, '0') + ' ' + name });
  slides.push(nodeId);
  return nodeId;
}
async function tree(id) {
  const r = await fw('get_design_context', { nodeId: id, detail: 'minimal', depth: 6 });
  const out = [];
  const walk = (n, d) => { out.push({ ...n, d }); (n.children || []).forEach((c) => walk(c, d + 1)); };
  r.nodes[0].children.forEach((c) => walk(c, 1));
  return out;
}
const top = async (id) => (await tree(id)).filter((n) => n.d === 1);
const firstText = async (id) => (await tree(id)).find((n) => n.type === 'TEXT');
async function setCart(frameId, label, px, py) {
  const t = await firstText(frameId);
  await fw('set_text', { nodeId: t.id, characters: label });
  await fw('set_text_properties', { nodeId: t.id, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await hug(frameId, { px, py });
  return info(frameId);
}
async function pill(frameId, label) {
  const t = await firstText(frameId);
  await fw('set_text', { nodeId: t.id, characters: label });
  await fw('set_auto_layout', { nodeId: frameId, layoutMode: 'HORIZONTAL', paddingLeft: 25, paddingRight: 10, paddingTop: 9, paddingBottom: 9, itemSpacing: 26, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId: frameId, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  const p = await info(frameId);
  await fw('set_position', { nodeId: frameId, x: (575 - p.width) / 2, y: p.y });
}
// Capture réelle dans une carte : coins arrondis, contour léger, ombre du corpus.
async function capture(parent, file, { x, y, w, r = 10, rot, name }) {
  const p = path.join(CAP, file);
  const buf = fs.readFileSync(p);
  const meta = JSON.parse(fs.readFileSync(path.join(CAP, 'tailles.json'), 'utf8'))[file];
  const h = w * meta[1] / meta[0];
  const card = await frame(parent, { x, y, w, h, r, fill: { r: 0.04, g: 0.06, b: 0.13 }, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.12 }, effects: SHADOW_CARD, name: name || 'Capture ' + file });
  await fw('import_image', { parentId: card, data: buf.toString('base64'), x: 0, y: 0, width: w, height: h, name: 'Capture', scaleMode: 'FILL' });
  if (rot) await fw('rotate_nodes', { nodeIds: [card], rotation: rot });
  return card;
}

// ---------- 01 Couverture (gabarit étude de cas 5406:5354)
{
  const S = await slide('5406:5354', 'Couverture');
  const k = await top(S);
  const by = (n) => k.find((c) => c.name === n)?.id;
  await fw('delete_nodes', { nodeIds: [by('Group 861'), by('Group 860'), by('Frame 4651'), by('Frame 4409'), by('Arrow 9'), by('Group 793')].filter(Boolean) });
  const r1 = await setCart(by('Frame 4415'), 'Comment j’ai créé le site', 24, 18);
  await fw('set_position', { nodeId: by('Frame 4415'), x: (575 - r1.width) / 2, y: 92 });
  const r2 = await setCart(by('Frame 4650'), 'd’un studio YouTube', 22, 17);
  await fw('set_position', { nodeId: by('Frame 4650'), x: (575 - r2.width) / 2, y: 92 + r1.height + 10 });
  const sub = await text(S, 'pour lancer des ads', { x: 0, y: 0, size: 19 });
  const si = await info(sub);
  await fw('set_position', { nodeId: sub, x: (575 - si.width) / 2, y: 92 + r1.height + 10 + r2.height + 8 });
  // empilement de trois vraies captures, la première couvre le plus
  const c3 = await capture(S, 'offres.jpg', { x: 70, y: 352, w: 330, rot: 9, name: 'Capture offres' });
  const c2 = await capture(S, 'preuve.jpg', { x: 92, y: 330, w: 340, rot: 4.5, name: 'Capture preuve sociale' });
  const c1 = await capture(S, 'hero.jpg', { x: 118, y: 300, w: 380, name: 'Capture hero' });
  await fw('reorder_nodes', { nodeIds: [c3], index: 0 });
  await fw('reorder_nodes', { nodeIds: [c2], index: 1 });
  await fw('reorder_nodes', { nodeIds: [c1], index: 2 });
  // fondu sous la pilule : l'illustration atteint le bas
  const fade = await rect(S, { x: -1, y: 500, w: 577, h: 200, name: 'Fondu', fill: { type: 'GRADIENT_LINEAR', gradientStops: [{ position: 0, color: { ...C.bg, a: 0 } }, { position: 0.42, color: { ...C.bg, a: 1 } }], gradientTransform: [[0, 1, 0], [-1, 0, 1]] } });
  await fw('reorder_nodes', { nodeIds: [fade], index: 3 });
  await pill(by('Frame 4417'), 'Copie ma méthode');
  console.log('main', by('Vector 658'), by('Vector 659'), by('Vector 660'));
}

// ---------- 02 Contexte
{
  const S = await slide('5406:3302', 'Contexte');
  const k = await top(S);
  await fw('set_text', { nodeId: k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id, characters: 'Artan, un studio de miniatures YouTube, avait besoin d’un site entièrement refait.\n\nL’objectif : un moyen d’acquisition solide, et pouvoir lancer des ads dessus.' });
  await fw('set_text_properties', { nodeId: k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id, fontSize: 30 });
  await pill(k.find((c) => c.name === 'Frame 4417').id, 'Voici mes 3 étapes');
}

// ---------- Étapes : cartouche blanc + bloc bleu + phrase
async function etape(n, titre, phrase) {
  const S = await slide('5406:3145', 'Étape ' + n);
  const k = await top(S);
  const w = k.find((c) => c.name === 'Frame 4260').id, b = k.find((c) => c.name === 'Frame 4275').id;
  await setCart(w, 'Étape ' + n, 33, 18);
  const bt = await firstText(b);
  await fw('set_text', { nodeId: bt.id, characters: titre });
  await fw('set_text_properties', { nodeId: bt.id, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await hug(b, { px: 24, py: 24 });
  const wi = await info(w), bi = await info(b);
  const t = await text(S, phrase, { x: 62, y: 0, size: 22.6, w: 440, lh: 130 });
  const ti = await info(t);
  const total = wi.height + 10 + bi.height + 22 + ti.height, y0 = (600 - total) / 2 + 20;
  await fw('set_position', { nodeId: w, x: 60, y: y0 });
  await fw('set_position', { nodeId: b, x: 60, y: y0 + wi.height + 10 });
  await fw('set_position', { nodeId: t, x: 62, y: y0 + wi.height + 10 + bi.height + 22 });
  return S;
}
await etape(1, 'Comprendre l’objectif', 'Avant de dessiner quoi que ce soit, il fallait répondre à une question : que doit faire ce site quand quelqu’un arrive depuis une pub ?');

// ---------- 04 L'objectif : trois rôles du site
{
  const S = await slide('5406:3302', 'L’objectif');
  const k = await top(S);
  await setCart(k.find((c) => c.name === 'Frame 4260').id, 'Le site doit', 21, 15);
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id, k.find((c) => c.name === 'Frame 4417').id] });
  const items = ['Expliquer l’offre en quelques secondes', 'Rassurer un visiteur qui ne connaît pas Artan', 'Le pousser vers une première commande'];
  for (const [i, s] of items.entries()) {
    const f = await frame(S, { x: 65, y: 200 + i * 78, w: 100, h: 50, r: 13, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.27 }, strokeW: 1.1, effects: SHADOW_CARD, name: 'Cartouche' });
    await text(f, s, { x: 0, y: 0, size: 21, color: C.ink });
    await hug(f, { px: 17, py: 13 });
    const fi = await info(f);
    await badge(S, 'check', { x: 65 + fi.width - 16, y: 200 + i * 78 - 13, rot: -25, size: 28 });
  }
  await text(S, 'Un site qui fait joli ne suffit pas quand tu payes pour chaque visiteur.', { x: 66, y: 455, size: 22.6, w: 440, lh: 130 });
}

await etape(2, 'Repenser l’architecture', 'J’ai structuré la page pour guider le visiteur de la promesse jusqu’au clic. Chaque section a un rôle précis.');

// ---------- Points numérotés : une section du vrai site par slide
const sections = [
  ['Le hero', 'Une promesse claire et un CTA direct.', 'hero.jpg'],
  ['La preuve sociale', 'Les créateurs qui leur font confiance.', 'preuve.jpg'],
  ['L’avant / après', 'Montrer l’effet d’une miniature.', 'avant-apres.jpg'],
  ['Le processus', '3 étapes pour lever la peur de se lancer.', 'processus.jpg'],
  ['Les offres', 'Deux choix clairs, avec la plus populaire mise en avant.', 'offres.jpg'],
  ['Le comparatif', 'Pourquoi Artan et pas les alternatives.', 'comparatif.jpg'],
  ['La FAQ', 'Répondre aux vraies objections.', 'faq.jpg'],
];
for (const [i, [titre, desc, file]] of sections.entries()) {
  const S = await slide('5406:2461', 'Point ' + (i + 1));
  const all = await tree(S);
  const k = all.filter((n) => n.d === 1);
  await fw('set_text', { nodeId: all.find((n) => n.type === 'TEXT' && /^\d+$/.test(n.name)).id, characters: String(i + 1) });
  const tf = k.find((n) => n.name === 'Frame 4650').id;
  await setCart(tf, titre, 18, 17.5);
  const d = k.find((n) => n.type === 'TEXT' && n.name.startsWith('Pour pousser')).id;
  await fw('set_text', { nodeId: d, characters: desc });
  await fw('resize_nodes', { nodeIds: [d], width: 430, height: 40 });
  await fw('set_text_properties', { nodeId: d, textAutoResize: 'HEIGHT', lineHeight: { unit: 'PERCENT', value: 140 } });
  await fw('delete_nodes', { nodeIds: k.filter((n) => ['Frame 4266', 'Frame 14', 'Frame 2147224256', 'Group 733', 'Vector 729'].includes(n.name)).map((n) => n.id) });
  const di = await info(d);
  const yTop = di.y + di.height + 26;
  if (file === 'avant-apres.jpg') await capture(S, file, { x: (575 - 300) / 2, y: yTop, w: 300, r: 12 });
  else await capture(S, file, { x: 62, y: yTop + 12, w: 452, r: 10 });
}

await etape(3, 'Développer la nouvelle version', 'J’ai ensuite conçu le design et développé le site pour qu’il soit lisible et prêt à recevoir du trafic payant.');

// ---------- La nouvelle version : trois sections empilées + tag
{
  const S = await slide('5406:3145', 'Nouvelle version');
  const k = await top(S);
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.name === 'Frame 4260').id, k.find((c) => c.name === 'Frame 4275').id] });
  await capture(S, 'comparatif.jpg', { x: 92, y: 300, w: 380, rot: 7 });
  await capture(S, 'offres.jpg', { x: 82, y: 230, w: 400, rot: 3.5 });
  const f = await capture(S, 'hero.jpg', { x: 70, y: 150, w: 435 });
  const t = await tag(S, 'Nouvelle version du site', { x: 0, y: 0, s: 1.15 });
  const ti = await info(t);
  await fw('set_position', { nodeId: t, x: 70 + 435 - ti.width + 10, y: 150 - ti.height / 2 });
}

// ---------- Intertitre « Pourquoi cette structure fonctionne ? »
{
  const S = await slide('5406:3145', 'Pourquoi');
  const k = await top(S);
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.name === 'Frame 4260').id, k.find((c) => c.name === 'Frame 4275').id] });
  const { nodeId: blk } = await fw('clone_node', { nodeId: '5406:5921' });
  await fw('reparent_nodes', { nodeIds: [blk], newParentId: S });
  const bt = await firstText(blk);
  await fw('set_text', { nodeId: bt.id, characters: 'Pourquoi cette structure fonctionne ?' });
  await fw('set_position', { nodeId: blk, x: 85, y: 198 });
}

// ---------- Les trois raisons
{
  const S = await slide('5406:3302', 'Les raisons');
  const k = await top(S);
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.name === 'Frame 4260').id, k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id, k.find((c) => c.name === 'Frame 4417').id] });
  const rows = [['La preuve arrive dès le début', 'donc la confiance s’installe vite'], ['Les offres sont simples', 'donc le visiteur sait quoi choisir'], ['Les objections sont traitées', 'avant la prise de décision']];
  for (const [i, [a, b]] of rows.entries()) {
    const y = 120 + i * 150;
    const c = await frame(S, { x: 62, y, w: 452, h: 112, r: 16, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.1 }, effects: SHADOW_CARD, name: 'Raison' });
    const { nodeId: num } = await fw('clone_node', { nodeId: '5406:2480' });
    await fw('reparent_nodes', { nodeIds: [num], newParentId: c });
    await fw('set_position', { nodeId: num, x: 20, y: 23 });
    const nt = (await tree(num)).find((n) => n.type === 'TEXT');
    await fw('set_text', { nodeId: nt.id, characters: String(i + 1) });
    await text(c, a, { x: 104, y: 27, size: 22, w: 330 });
    await text(c, '→ ' + b, { x: 104, y: 60, size: 18, color: C.greyText, w: 330 });
  }
}

// ---------- Résultat
{
  const S = await slide('5406:3302', 'Résultat');
  const k = await top(S);
  await setCart(k.find((c) => c.name === 'Frame 4260').id, 'Résultat :', 21, 15);
  const body = k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id;
  await fw('set_text', { nodeId: body, characters: 'Un site prêt pour lancer des ads.' });
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.name === 'Frame 4417').id] });
  await capture(S, 'final.jpg', { x: 62, y: 300, w: 452 });
}

// ---------- Merci + Offre (versions déjà corrigées)
await slide('5411:11545', 'Merci');
await slide('5411:11583', 'Offre');
fs.writeFileSync(new URL('./slides.json', import.meta.url), JSON.stringify({ section: SEC, slides }, null, 1));
console.log('section', SEC, slides.length);
close();
