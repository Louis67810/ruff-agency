// Carrousel « Ce site a été fait par IA : 3 étapes pour qu'il ait l'air pro ».
// Progression avant → étape 1 (structure, dark) → étape 2 (light) → étape 3 (DA) = après. Texte fourni par Louis.
// Usage : node build.mjs <dossier des captures recadrées>
import fs from 'node:fs';
import path from 'node:path';
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, info, hug, badge, tag, arrow } from '../../outils/kit.mjs';

const CAP = process.argv[2];
const SIZES = JSON.parse(fs.readFileSync(path.join(CAP, 'tailles.json'), 'utf8'));
const { nodeId: SEC } = await fw('create_section', { name: 'Claude — Carrousel site IA → pro (v1)', x: 59000, y: -87300, width: 15 * 625 + 150, height: 1000 });
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
// Capture réelle dans une carte. Renvoie aussi l'échelle pour placer les annotations (coordonnées image).
async function capture(parent, file, { x, y, w, r = 10, rot, name }) {
  const [iw, ih] = SIZES[file];
  const h = w * ih / iw;
  const card = await frame(parent, { x, y, w, h, r, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.14 }, effects: SHADOW_CARD, name: name || 'Capture ' + file });
  await fw('import_image', { parentId: card, data: fs.readFileSync(path.join(CAP, file)).toString('base64'), x: 0, y: 0, width: w, height: h, name: 'Capture', scaleMode: 'FILL' });
  if (rot) await fw('rotate_nodes', { nodeIds: [card], rotation: rot });
  return { card, x, y, w, h, k: w / iw };
}
// Tag blanc accroché à une zone de la capture, avec badge (croix ou check) au coin supérieur droit du tag.
async function note(S, cap, label, [ix, iy], { side = 'R', kind } = {}) {
  const t = await tag(S, label, { x: 0, y: 0, s: 1.15 });
  const ti = await info(t);
  const px = cap.x + ix * cap.k, py = cap.y + iy * cap.k;
  const x = side === 'R' ? Math.min(px, 532 - ti.width) : Math.max(px - ti.width, 44);
  await fw('set_position', { nodeId: t, x, y: py - ti.height / 2 });
  if (kind) await badge(S, kind, { x: x + ti.width - 14, y: py - ti.height / 2 - 12, rot: kind === 'check' ? -25 : -11.5, size: 22 });
  return t;
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
  return S;
}
// Slide « texte + illustration » sur le gabarit Contexte : cartouche blanc, texte, puis illustration.
async function blank(name, cart, body, size = 22.6) {
  const S = await slide('5406:3302', name);
  const k = await top(S);
  const c = k.find((x) => x.name === 'Frame 4260').id;
  await setCart(c, cart, 21, 15);
  const b = k.find((x) => x.type === 'TEXT' && x.name.startsWith('La plupart')).id;
  await fw('delete_nodes', { nodeIds: [k.find((x) => x.name === 'Frame 4417').id] });
  if (body) {
    await fw('set_text', { nodeId: b, characters: body });
    await fw('set_text_properties', { nodeId: b, fontSize: size, lineHeight: { unit: 'PERCENT', value: 130 } });
  } else await fw('delete_nodes', { nodeIds: [b] });
  return { S, body: body ? b : null };
}

// ---------- 01 Couverture
{
  const S = await slide('5406:5354', 'Couverture');
  const k = await top(S);
  const by = (n) => k.find((c) => c.name === n)?.id;
  await fw('delete_nodes', { nodeIds: [by('Group 861'), by('Group 860'), by('Frame 4651'), by('Arrow 9'), by('Group 793')].filter(Boolean) });
  const r1 = await setCart(by('Frame 4415'), 'Ce site a été fait par IA', 24, 18);
  await fw('set_position', { nodeId: by('Frame 4415'), x: (575 - r1.width) / 2, y: 92 });
  const b = await setCart(by('Frame 4650'), '3 étapes', 18, 17);
  const w = await setCart(by('Frame 4409'), 'pour un rendu pro', 18, 17);
  const row = b.width + 8 + w.width, x2 = (575 - row) / 2, y2 = 92 + r1.height + 10;
  await fw('set_position', { nodeId: by('Frame 4650'), x: x2, y: y2 });
  await fw('set_position', { nodeId: by('Frame 4409'), x: x2 + b.width + 8, y: y2 + (b.height - w.height) / 2 });
  const back = await capture(S, 'avant-hero.jpg', { x: 40, y: 318, w: 300, rot: 6, name: 'Avant (IA)' });
  const front = await capture(S, 'apres.jpg', { x: 210, y: 352, w: 330, name: 'Après' });
  await fw('reorder_nodes', { nodeIds: [back.card], index: 0 });
  await fw('reorder_nodes', { nodeIds: [front.card], index: 1 });
  await badge(S, 'cross', { x: 196, y: 300, rot: -11.5, size: 28 });
  await badge(S, 'check', { x: 524, y: 338, rot: -25, size: 28 });
  const fade = await rect(S, { x: -1, y: 500, w: 577, h: 200, name: 'Fondu', fill: { type: 'GRADIENT_LINEAR', gradientStops: [{ position: 0, color: { ...C.bg, a: 0 } }, { position: 0.42, color: { ...C.bg, a: 1 } }], gradientTransform: [[0, 1, 0], [-1, 0, 1]] } });
  await fw('reorder_nodes', { nodeIds: [fade], index: 2 });
  await pill(by('Frame 4417'), 'Voici comment');
  // main sur le CTA de la version après
  const hand = k.find((c) => c.name === 'Vector 658') ? null : null;
}

// ---------- 02 Contexte
{
  const S = await slide('5406:3302', 'Contexte');
  const k = await top(S);
  const b = k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id;
  await fw('set_text', { nodeId: b, characters: 'L’IA sait générer un site en quelques minutes.\n\nSauf que ça se voit.' });
  await pill(k.find((c) => c.name === 'Frame 4417').id, 'Voici le même site, avant et après');
}

// ---------- 03 Avant : la version IA
{
  const { S } = await blank('Avant', 'Avant : la version IA', null);
  await capture(S, 'avant.jpg', { x: 62, y: 196, w: 452, name: 'Version IA' });
}

await etape(1, 'Remettre de l’ordre et ajouter ce qui convertit', 'Le premier problème, ce n’est pas le style. C’est le bordel.');

// ---------- 05 Ce qui ne va pas (version IA annotée)
{
  const { S, body } = await blank('Problèmes', 'Ce qui ne va pas', null);
  const cap = await capture(S, 'avant-hero.jpg', { x: 62, y: 190, w: 452, name: 'Version IA annotée' });
  await note(S, cap, 'Des alignements sans logique', [770, 260], { kind: 'cross' });
  await note(S, cap, 'Une barre sans utilité', [140, 545], { kind: 'cross' });
  await note(S, cap, 'Des textes en trop', [420, 628], { kind: 'cross' });
  await note(S, cap, 'Trop d’orange partout', [600, 360], { kind: 'cross' });
  await note(S, cap, 'Un CTA presque invisible', [330, 1075 * 860 / 1190 > 860 ? 800 : 800], { kind: 'cross' });
  await text(S, 'J’ai tout supprimé, puis j’ai réaligné la page autour d’une seule action.', { x: 62, y: 190 + cap.h + 26, size: 21, w: 452, lh: 130 });
}

// ---------- 06 Ce qui convertit (étape 1 : nouvelle structure, encore en dark)
{
  const { S } = await blank('Ce qui convertit', 'Et j’ai ajouté ce qui convertit', null);
  const cap = await capture(S, 'etape1.jpg', { x: 62, y: 200, w: 452, name: 'Étape 1' });
  const k = 0.8; // coordonnées de la maquette 1800 px -> capture 1440 px
  await note(S, cap, 'À qui s’adresse l’agence', [1120 * k, 191 * k], { kind: 'check' });
  await note(S, cap, 'Deux CTA clairs', [1250 * k, 537 * k], { kind: 'check' });
  await note(S, cap, '« Sans engagement »', [530 * k, 586 * k], { side: 'L', kind: 'check' });
  await note(S, cap, 'Des preuves juste en dessous', [560 * k, 676 * k], { side: 'L', kind: 'check' });
  await text(S, 'Avant, la phrase au-dessus du titre ne voulait rien dire. Maintenant, elle filtre le bon visiteur dès la première seconde.', { x: 62, y: 200 + cap.h + 30, size: 20, w: 452, lh: 130 });
}

await etape(2, 'Passer en light mode', 'Le dark mode fait moderne. Mais pour une agence, le light mode est plus rassurant.');

// ---------- 08 Dark → light
{
  const { S } = await blank('Light mode', 'Le même site, en light mode', null);
  const back = await capture(S, 'etape1.jpg', { x: 50, y: 196, w: 330, rot: -5, name: 'Dark' });
  const front = await capture(S, 'etape2.jpg', { x: 196, y: 262, w: 330, name: 'Light' });
  await arrow(S, { x: 120, y: 360 }, { x: 186, y: 392 }, { bend: 0.35, width: 5, head: 11 });
  const items = ['La page est plus lisible', 'Elle paraît plus claire et plus transparente', 'Elle donne confiance à qui va te confier son budget'];
  for (const [i, s] of items.entries()) {
    const f = await frame(S, { x: 62, y: 430 + i * 56, w: 100, h: 40, r: 11, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.27 }, strokeW: 1.1, effects: SHADOW_CARD, name: 'Cartouche' });
    await text(f, s, { x: 0, y: 0, size: 17, color: C.ink });
    await hug(f, { px: 14, py: 10 });
    const fi = await info(f);
    await badge(S, 'check', { x: 62 + fi.width - 12, y: 430 + i * 56 - 10, rot: -25, size: 22 });
  }
}

// ---------- 09 Pourquoi ? (cartouche blanc)
{
  const { S, body } = await blank('Pourquoi', 'Pourquoi ?', 'Quand ton client investit de l’argent avec toi, il veut se sentir en sécurité, pas impressionné.', 32);
}

await etape(3, 'Créer une vraie direction artistique', 'Sur la version IA, rien ne se démarque. Ça ressemble à des milliers d’autres sites.');

// ---------- 11 La direction artistique (version finale annotée)
{
  const { S } = await blank('Direction artistique', 'Une identité propre', null);
  const cap = await capture(S, 'apres.jpg', { x: 62, y: 200, w: 452, name: 'Version finale' });
  const k = 0.8;
  await note(S, cap, 'Un titre en serif, plus élégant', [1270 * k, 300 * k], { kind: 'check' });
  await note(S, cap, 'Une palette chaleureuse, avec du rouge', [980 * k, 537 * k], { kind: 'check' });
  await note(S, cap, 'Des textures et des halos', [300 * k, 260 * k], { side: 'L', kind: 'check' });
}

// ---------- 12 Résultat : avant / après
{
  const { S, body } = await blank('Résultat', 'Le résultat ?', 'Un site qui ne ressemble plus à un site généré.\nUn site qui inspire confiance dès les premières secondes.', 22.6);
  const bi = await info(body);
  const y = bi.y + bi.height + 30;
  const back = await capture(S, 'avant-hero.jpg', { x: 50, y, w: 270, rot: -5, name: 'Avant' });
  const front = await capture(S, 'apres.jpg', { x: 220, y: y + 40, w: 300, name: 'Après' });
  await tag(S, 'Avant', { x: 60, y: y - 12, s: 1.1 });
  const t = await tag(S, 'Après', { x: 0, y: 0, s: 1.1 });
  const ti = await info(t);
  await fw('set_position', { nodeId: t, x: 520 - ti.width + 8, y: y + 40 - ti.height / 2 });
}

// ---------- 13 À retenir
{
  const S = await slide('5406:3302', 'À retenir');
  const k = await top(S);
  await setCart(k.find((c) => c.name === 'Frame 4260').id, 'À retenir', 21, 15);
  const b = k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id;
  await fw('set_text', { nodeId: b, characters: 'L’IA peut te faire gagner du temps.\n\nMais elle ne remplace pas une vraie stratégie.' });
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.name === 'Frame 4417').id] });
}

// ---------- 14 Dernière slide de Louis (merci + appel), reprise de sa version la plus récente
await slide('5440:1458', 'Merci');

fs.writeFileSync(new URL('./slides.json', import.meta.url), JSON.stringify({ section: SEC, slides }, null, 1));
console.log('section', SEC, slides.length);
close();
