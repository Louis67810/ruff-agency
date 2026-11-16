// v2 du carrousel « site fait par IA » (retour de Louis) :
// - captures au format des études de cas du corpus (426 × 256, ratio 1,66), assez grandes pour bien voir le site ;
// - transitions avant → après comme dans le corpus (5406:5609) : deux captures empilées, étiquette bleue
//   en bas à droite, flèche bleue source (5406:5644) à gauche ;
// - chaque étape ne change que ce qu'elle annonce (états dans la section de travail 5453:3296) ;
// - les tags ne recouvrent plus le site : ils sont sous le texte ;
// - plus de slide « Pourquoi ? » ni « À retenir ».
// Usage : node build-v2.mjs <dossier des captures>
import fs from 'node:fs';
import path from 'node:path';
import { fw, close } from '../../outils/fw.mjs';
import { C, rect, frame, text, info, hug, badge, tag } from '../../outils/kit.mjs';

const CAP = process.argv[2];
const SIZES = JSON.parse(fs.readFileSync(path.join(CAP, 'tailles.json'), 'utf8'));
const { nodeId: SEC } = await fw('create_section', { name: 'Claude — Carrousel site IA → pro (v2)', x: 59000, y: -86300, width: 15 * 625 + 150, height: 1000 });
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
// Carte de capture du corpus (5406:5637) : rayon 16,6, contour noir 23 %, ombre douce.
const SH = [[0.06, 1.7, 6.8], [0.05, 6.8, 6.8], [0.03, 15.4, 9.2], [0.01, 27, 10.9]].map(([a, y, r]) => ({ type: 'DROP_SHADOW', visible: true, color: { r: 0.23, g: 0.23, b: 0.23, a }, offset: { x: 0, y }, radius: r, spread: 0 }));
async function capture(parent, file, { x, y, w, rot, name }) {
  const [iw, ih] = SIZES[file];
  const h = w * ih / iw;
  const card = await frame(parent, { x, y, w, h, r: 16.6 * w / 426, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.23 }, strokeW: 1, effects: SH, name: name || 'Capture ' + file });
  await fw('import_image', { parentId: card, data: fs.readFileSync(path.join(CAP, file)).toString('base64'), x: 0, y: 0, width: w, height: h, name: 'Capture', scaleMode: 'FILL' });
  if (rot) await fw('rotate_nodes', { nodeIds: [card], rotation: rot });
  return { card, x, y, w, h };
}
// Étiquette bleue du corpus (5406:5640), alignée à droite sur `right`.
async function label(S, s, right, bottom) {
  const { nodeId } = await fw('clone_node', { nodeId: '5406:5640' });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: S });
  const t = await firstText(nodeId);
  await fw('set_text', { nodeId: t.id, characters: s });
  await fw('set_text_properties', { nodeId: t.id, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await hug(nodeId, { px: 14, py: 9 });
  const n = await info(nodeId);
  await fw('set_position', { nodeId, x: right - n.width, y: bottom - n.height / 2 });
  return nodeId;
}
// Slide de transition, géométrie du corpus 5406:5609.
async function transition(name, fileA, labA, fileB, labB) {
  const S = await slide('5406:3302', name);
  const k = await top(S);
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.name === 'Frame 4260').id, k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id, k.find((c) => c.name === 'Frame 4417').id] });
  const a = await capture(S, fileA, { x: 91, y: 84, w: 426 });
  const b = await capture(S, fileB, { x: 91, y: 355, w: 426 });
  await label(S, labA, 520, 84 + a.h);
  await label(S, labB, 526, 355 + b.h - 13);
  const { nodeId: arr } = await fw('clone_node', { nodeId: '5406:5644' });
  await fw('reparent_nodes', { nodeIds: [arr], newParentId: S });
  await fw('set_position', { nodeId: arr, x: 77, y: 272 });
  return S;
}
// Slide détail : cartouche, grande capture, texte, puis tags (croix ou check) sous le texte.
async function detail(name, cart, file, body, tags, kind) {
  const S = await slide('5406:3302', name);
  const k = await top(S);
  const c = k.find((x) => x.name === 'Frame 4260').id;
  const ci = await setCart(c, cart, 21, 15);
  await fw('set_position', { nodeId: c, x: 62, y: 92 });
  await fw('delete_nodes', { nodeIds: [k.find((x) => x.type === 'TEXT' && x.name.startsWith('La plupart')).id, k.find((x) => x.name === 'Frame 4417').id] });
  // 1. mesurer le texte et les rangées de tags, 2. donner à la capture toute la hauteur restante (max 452 de large)
  const t = body ? await text(S, body, { x: 62, y: 0, size: 19, w: 452, lh: 130 }) : null;
  const th = t ? (await info(t)).height : 0;
  const tg = [];
  let x = 62, row = 0, rowH = 0;
  for (const s of tags) {
    const id = await tag(S, s, { x: 0, y: 0, s: 1.3 });
    const n = await info(id);
    rowH = n.height;
    if (x + n.width > 514) { x = 62; row++; }
    tg.push({ id, x, row, w: n.width });
    x += n.width + 14;
  }
  const tagsH = (row + 1) * rowH + row * 12;
  const yCap = 92 + ci.height + 18, bottom = 606;
  const capH = bottom - yCap - 18 - (t ? th + 14 : 0) - tagsH;
  const w = Math.min(452, capH * SIZES[file][0] / SIZES[file][1]);
  const cap = await capture(S, file, { x: (575 - w) / 2, y: yCap, w });
  let y = cap.y + cap.h + 18;
  if (t) { await fw('set_position', { nodeId: t, x: 62, y }); y += th + 14; }
  for (const g of tg) {
    const gy = y + g.row * (rowH + 12);
    await fw('set_position', { nodeId: g.id, x: g.x, y: gy });
    await badge(S, kind, { x: g.x + g.w - 13, y: gy - 10, rot: kind === 'check' ? -25 : -11.5, size: 20 });
  }
  return S;
}
async function etape(n, titre, phrase) {
  const S = await slide('5406:3145', 'Étape ' + n);
  const k = await top(S);
  const w = k.find((c) => c.name === 'Frame 4260').id, b = k.find((c) => c.name === 'Frame 4275').id;
  await setCart(w, 'Étape ' + n, 33, 18);
  const bt = await firstText(b);
  await fw('set_text', { nodeId: bt.id, characters: titre });
  await fw('set_text_properties', { nodeId: bt.id, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await hug(b, { px: 24, py: 24 });
  let bi = await info(b);
  if (bi.width > 452) {
    await fw('resize_nodes', { nodeIds: [bt.id], width: 400, height: 40 });
    await fw('set_text_properties', { nodeId: bt.id, textAutoResize: 'HEIGHT' });
    bi = await info(b);
  }
  const wi = await info(w);
  const t = await text(S, phrase, { x: 62, y: 0, size: 22.6, w: 440, lh: 130 });
  const ti = await info(t);
  const total = wi.height + 10 + bi.height + 22 + ti.height, y0 = (600 - total) / 2 + 20;
  await fw('set_position', { nodeId: w, x: 60, y: y0 });
  await fw('set_position', { nodeId: b, x: 60, y: y0 + wi.height + 10 });
  await fw('set_position', { nodeId: t, x: 62, y: y0 + wi.height + 10 + bi.height + 22 });
}

// ---------- 01 Couverture : version IA derrière, version finale devant
{
  const S = await slide('5406:5354', 'Couverture');
  const k = await top(S);
  const by = (n) => k.find((c) => c.name === n)?.id;
  await fw('delete_nodes', { nodeIds: [by('Group 861'), by('Group 860'), by('Frame 4651'), by('Group 793')].filter(Boolean) });
  const r1 = await setCart(by('Frame 4415'), 'Ce site a été fait par IA', 24, 18);
  await fw('set_position', { nodeId: by('Frame 4415'), x: (575 - r1.width) / 2, y: 92 });
  const b = await setCart(by('Frame 4650'), '3 étapes', 18, 17);
  const w = await setCart(by('Frame 4409'), 'pour un rendu pro', 18, 17);
  const row = b.width + 8 + w.width, x2 = (575 - row) / 2, y2 = 92 + r1.height + 10;
  await fw('set_position', { nodeId: by('Frame 4650'), x: x2, y: y2 });
  await fw('set_position', { nodeId: by('Frame 4409'), x: x2 + b.width + 8, y: y2 + (b.height - w.height) / 2 });
  const back = await capture(S, 'ia.jpg', { x: 28, y: 300, w: 330, rot: 6, name: 'Version IA' });
  const front = await capture(S, 'final.jpg', { x: 196, y: 330, w: 350, name: 'Version refaite' });
  await fw('reorder_nodes', { nodeIds: [back.card], index: 0 });
  await fw('reorder_nodes', { nodeIds: [front.card], index: 1 });
  await badge(S, 'cross', { x: 310, y: 286, rot: -11.5, size: 28 });
  await badge(S, 'check', { x: 528, y: 316, rot: -25, size: 28 });
  const fade = await rect(S, { x: -1, y: 500, w: 577, h: 200, name: 'Fondu', fill: { type: 'GRADIENT_LINEAR', gradientStops: [{ position: 0, color: { ...C.bg, a: 0 } }, { position: 0.42, color: { ...C.bg, a: 1 } }], gradientTransform: [[0, 1, 0], [-1, 0, 1]] } });
  await fw('reorder_nodes', { nodeIds: [fade], index: 2 });
  // flèche source : de la version IA vers la version refaite
  await fw('set_position', { nodeId: by('Arrow 9'), x: 150, y: 520 });
  await pill(by('Frame 4417'), 'Voici comment');
}

// ---------- 02 Contexte
{
  const S = await slide('5406:3302', 'Contexte');
  const k = await top(S);
  await fw('set_text', { nodeId: k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id, characters: 'L’IA sait générer un site en quelques minutes.\n\nSauf que ça se voit.' });
  await pill(k.find((c) => c.name === 'Frame 4417').id, 'Voici le même site, avant et après');
}
await transition('Avant / après', 'ia.jpg', 'Version faite par IA', 'final.jpg', 'Version refaite');

await etape(1, 'Remettre de l’ordre et ajouter ce qui convertit', 'Le premier problème, ce n’est pas le style. C’est le bordel.');
await detail('Ce qui ne va pas', 'Ce qui ne va pas', 'ia.jpg', 'J’ai tout supprimé, puis j’ai réaligné la page autour d’une seule action.',
  ['Des alignements sans logique', 'Une barre sans utilité', 'Des textes en trop', 'Trop d’orange partout', 'Un CTA presque invisible'], 'cross');
await transition('Transition étape 1', 'ia.jpg', 'Version faite par IA', 'e1.jpg', 'Étape 1 : l’ordre et la conversion');
await detail('Ce que j’ai ajouté', 'Ce que j’ai ajouté', 'e1.jpg', 'Avant, la phrase au-dessus du titre ne voulait rien dire. Maintenant, elle filtre le bon visiteur dès la première seconde.',
  ['À qui s’adresse l’agence', 'Deux CTA clairs', '« Sans engagement »', 'Des preuves juste en dessous'], 'check');

await etape(2, 'Passer en light mode', 'Le dark mode fait moderne. Mais pour une agence, le light mode est plus rassurant.');
await transition('Transition étape 2', 'e1.jpg', 'Étape 1', 'e2.jpg', 'Étape 2 : le light mode');
await detail('En light mode', 'En light mode', 'e2.jpg', 'Quand ton client investit de l’argent avec toi, il veut se sentir en sécurité, pas impressionné.',
  ['Plus lisible', 'Plus claire et plus transparente', 'Donne confiance à qui te confie son budget'], 'check');

await etape(3, 'Créer une vraie direction artistique', 'Sur la version IA, rien ne se démarque. Ça ressemble à des milliers d’autres sites.');
await transition('Transition étape 3', 'e2.jpg', 'Étape 2', 'final.jpg', 'Étape 3 : la direction artistique');
await detail('Une identité propre', 'Une identité propre', 'final.jpg', null,
  ['Un titre en serif, plus élégant', 'Une palette chaleureuse, avec du rouge', 'Des textures et des halos'], 'check');

// ---------- Résultat : l'après complet
{
  const S = await slide('5406:3302', 'Résultat');
  const k = await top(S);
  const c = k.find((x) => x.name === 'Frame 4260').id;
  const ci = await setCart(c, 'Le résultat ?', 21, 15);
  await fw('set_position', { nodeId: c, x: 62, y: 92 });
  const b = k.find((x) => x.type === 'TEXT' && x.name.startsWith('La plupart')).id;
  await fw('set_text', { nodeId: b, characters: 'Un site qui ne ressemble plus à un site généré.\nUn site qui inspire confiance dès les premières secondes.' });
  await fw('set_text_properties', { nodeId: b, fontSize: 21, lineHeight: { unit: 'PERCENT', value: 130 } });
  await fw('resize_nodes', { nodeIds: [b], width: 452, height: 60 });
  await fw('set_text_properties', { nodeId: b, textAutoResize: 'HEIGHT' });
  await fw('set_position', { nodeId: b, x: 62, y: 92 + ci.height + 16 });
  await fw('delete_nodes', { nodeIds: [k.find((x) => x.name === 'Frame 4417').id] });
  const bi = await info(b);
  const cap = await capture(S, 'final-full.jpg', { x: 62, y: bi.y + bi.height + 22, w: 452, name: 'Version finale complète' });
  await label(S, 'Version finale', 526, cap.y + cap.h - 13);
}

// ---------- Dernière slide de Louis
await slide('5440:1458', 'Merci');
fs.writeFileSync(new URL('./slides-v2.json', import.meta.url), JSON.stringify({ section: SEC, slides }, null, 1));
console.log('section', SEC, slides.length);
close();
