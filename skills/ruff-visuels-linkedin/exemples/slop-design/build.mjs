// Carrousel « Les détails qui trahissent un site fait par IA » (slop design).
// Points : page Notion de Louis + liste du post. Chaque détail est recréé dans Figma (pas de capture),
// posé dans un panneau gris avec un tag blanc + croix rouge au coin. Prompt de nettoyage à la fin.
import fs from 'node:fs';
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, info, hug, badge, tag } from '../../outils/kit.mjs';

const W = 575;
const { nodeId: SEC } = await fw('create_section', { name: 'Claude — Carrousel slop design (v1)', x: 59000, y: -85300, width: 22 * 625 + 150, height: 1000 });
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
  await fw('set_position', { nodeId: frameId, x: (W - p.width) / 2, y: p.y });
}
const hex = (h, a = 1) => { const n = parseInt(h.slice(1), 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255, a }; };
const rgb = (h) => { const c = hex(h); delete c.a; return c; };
const grad = (stops, angle = 0) => ({ type: 'GRADIENT_LINEAR', gradientStops: stops.map((s, i) => ({ position: i / (stops.length - 1), color: hex(s) })), gradientTransform: angle ? [[0, 1, 0], [-1, 0, 1]] : [[1, 0, 0], [0, 1, 0]] });
const T = (p, s, o) => text(p, s, { x: 0, y: 0, family: 'Inter', style: 'Semi Bold', ls: 0, ...o });
async function at(id, x, y) { await fw('set_position', { nodeId: id, x, y }); return id; }
async function centerIn(id, w, y) { const n = await info(id); await at(id, (w - n.width) / 2, y); return n; }
// Bouton générique (pour montrer les dérives, donc PAS le CTA source).
async function btn(p, label, { x, y, fill = rgb('#7C3AED'), r = 10, color = C.white, size = 13, family = 'Inter', style = 'Semi Bold', px = 16, py = 10, fx, stroke }) {
  const f = await frame(p, { x, y, w: 50, h: 30, r, fill, effects: fx, stroke, name: 'Bouton IA' });
  await text(f, label, { x: 0, y: 0, size, family, style, color, ls: 0 });
  await hug(f, { px, py });
  return f;
}
const glow = (h, a = 0.55, r = 18, y = 8) => [{ type: 'DROP_SHADOW', visible: true, color: hex(h, a), offset: { x: 0, y }, radius: r, spread: 0 }];
const VIOLET = ['#7C3AED', '#3B82F6'];

// ---------- Panneau d'exemple : fond gris du corpus, tag blanc + croix au coin supérieur droit.
async function panels(S, items, y0 = 182, bottom = 604) {
  const gap = 14, total = bottom - y0 - gap * (items.length - 1);
  const sum = items.reduce((a, it) => a + (it.w || 1), 0);
  let y = y0;
  for (const it of items) {
    const h = Math.round(total * (it.w || 1) / sum);
    const P = await frame(S, { x: 62, y, w: 452, h, r: 16, fill: rgb('#EDEDED'), name: 'Exemple : ' + it.label });
    await it.draw(P, 452, h);
    const t = await tag(S, it.label, { x: 0, y: 0, s: 1.2 });
    const ti = await info(t);
    const tx = 62 + 452 - ti.width + 8, ty = y - ti.height / 2 + 4;
    await at(t, tx, ty);
    await badge(S, 'cross', { x: tx + ti.width - 13, y: ty - 11, rot: -11.5, size: 22 });
    y += h + gap;
  }
}
// ---------- Slide de catégorie : touche numérotée + cartouche rouge (problème).
const RED = (await fw('get_nodes_info', { nodeIds: ['5406:5426'] })).nodes[0];
async function categorie(num, titre, items) {
  const S = await slide('5406:2461', `${titre}`);
  const all = await tree(S);
  const k = all.filter((n) => n.d === 1);
  await fw('set_text', { nodeId: all.find((n) => n.type === 'TEXT' && /^\d+$/.test(n.name)).id, characters: String(num) });
  const cf = k.find((n) => n.name === 'Frame 4650').id;
  await fw('set_fills', { nodeId: cf, fills: RED.fills });
  await fw('set_effects', { nodeId: cf, effects: RED.effects });
  await setCart(cf, titre, 18, 17.5);
  await fw('delete_nodes', { nodeIds: k.filter((n) => ['Frame 4266', 'Frame 14', 'Frame 2147224256', 'Group 733', 'Vector 729'].includes(n.name) || (n.type === 'TEXT' && n.name.startsWith('Pour pousser'))).map((n) => n.id) });
  await panels(S, items);
}

// ==================== Contenu ====================
// 01 Couverture (gabarit rouge 5406:6522)
{
  const S = await slide('5406:6522', 'Couverture');
  const k = await top(S);
  const by = (n) => k.find((c) => c.name === n)?.id;
  await fw('delete_nodes', { nodeIds: [by('Group 860'), by('Group 793')].filter(Boolean) });
  const a = await setCart(by('Frame 4214'), 'Ces détails', 26, 18);
  const b = await setCart(by('Frame 4415'), 'trahissent', 20, 21);
  const r1 = a.width + 8 + b.width, x1 = (W - r1) / 2;
  await at(by('Frame 4214'), x1, 96); await at(by('Frame 4415'), x1 + a.width + 8, 96 + (a.height - b.height) / 2);
  const c = await setCart(by('Frame 4409'), 'un site fait par IA', 18, 17);
  await at(by('Frame 4409'), (W - c.width) / 2, 96 + a.height + 10);
  await pill(by('Frame 4417'), 'Voici comment les retirer');
  // illustration : un hero « slop » complet
  const H = await frame(S, { x: 62, y: 292, w: 452, h: 280, r: 18, fill: rgb('#0B0B14'), stroke: { color: rgb('#000000'), a: 0.2 }, effects: SHADOW_CARD, name: 'Hero slop' });
  for (const [x, y, s, c2] of [[-60, -70, 200, '#3B82F6'], [330, -80, 200, '#7C3AED']]) {
    const e = await fw('create_ellipse', { parentId: H, x, y, width: s, height: s });
    await fw('set_fills', { nodeId: e.nodeId, fills: [{ type: 'SOLID', color: rgb(c2), opacity: 0.7 }] });
    await fw('set_effects', { nodeId: e.nodeId, effects: [{ type: 'LAYER_BLUR', visible: true, radius: 60 }] });
  }
  const eb = await frame(H, { x: 0, y: 0, w: 50, h: 20, r: 20, fill: { type: 'SOLID', color: C.white, opacity: 0.08 }, stroke: { color: C.white, a: 0.2 }, name: 'Tag point' });
  await T(eb, '● NOUVEAU · IA 2.0 ✨', { size: 10, color: rgb('#C4B5FD') });
  await hug(eb, { px: 10, py: 5 }); await centerIn(eb, 452, 40);
  const t1 = await text(H, 'BOOSTEZ VOTRE', { x: 0, y: 0, size: 30, family: 'Inter', style: 'Extra Bold', color: C.white, ls: 12 });
  await centerIn(t1, 452, 74);
  const t2 = await text(H, 'CROISSANCE', { x: 0, y: 0, size: 30, family: 'Inter', style: 'Extra Bold', ls: 12 });
  await fw('set_fills', { nodeId: t2, fills: [grad(VIOLET)] }); await centerIn(t2, 452, 110);
  const st = await T(H, 'Une solution — rapide, moderne — et puissante.', { size: 12, style: 'Regular', color: rgb('#A1A1AA') });
  await centerIn(st, 452, 156);
  const b1 = await btn(H, '✦ Commencer →', { x: 0, y: 0, fill: grad(VIOLET), r: 30, fx: glow('#7C3AED') });
  const b2 = await btn(H, 'En savoir plus', { x: 0, y: 0, fill: rgb('#BCFF00'), color: rgb('#0B0B14'), r: 4 });
  const bi1 = await info(b1), bi2 = await info(b2), wtot = bi1.width + 12 + bi2.width;
  await at(b1, (452 - wtot) / 2, 192); await at(b2, (452 - wtot) / 2 + bi1.width + 12, 192);
  await badge(S, 'cross', { x: 494, y: 278, rot: -11.5, size: 30 });
  // main source
  await fw('set_position', { nodeId: by('Vector 658'), x: 300, y: 420 });
  await fw('reorder_nodes', { nodeIds: [by('Vector 658')], index: (await top(S)).length - 1 });
}

// 02 Contexte
{
  const S = await slide('5406:3302', 'Contexte');
  const k = await top(S);
  await fw('set_text', { nodeId: k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id, characters: 'Ce n’est jamais un seul détail qui le trahit.\n\nC’est l’accumulation.' });
  await pill(k.find((c) => c.name === 'Frame 4417').id, 'J’ai listé tout ce que je repère');
}

// ---------- 1. Les couleurs
await categorie(1, 'Les couleurs', [
  { label: 'Dégradés violet et bleu partout', draw: async (P, w, h) => {
    const t = await text(P, 'Boostez votre croissance', { x: 0, y: 0, size: 24, family: 'Inter', style: 'Extra Bold', ls: -2 });
    await fw('set_fills', { nodeId: t, fills: [grad(VIOLET)] }); await centerIn(t, w, h / 2 - 34);
    const tg = await frame(P, { x: 0, y: 0, w: 40, h: 20, r: 20, fill: grad(VIOLET), name: 'Tag' });
    await T(tg, 'Nouveau', { size: 11, color: C.white }); await hug(tg, { px: 10, py: 4 });
    const b = await btn(P, 'Commencer', { x: 0, y: 0, fill: grad(VIOLET), r: 10 });
    const a = await info(tg), bb = await info(b);
    await at(tg, (w - a.width - 12 - bb.width) / 2, h / 2 + 8); await at(b, (w - a.width - 12 - bb.width) / 2 + a.width + 12, h / 2 + 2);
  } },
  { label: 'CTA en dégradé arc-en-ciel', draw: async (P, w, h) => {
    const b = await btn(P, 'Essayer gratuitement', { x: 0, y: 0, fill: grad(['#F43F5E', '#F59E0B', '#22C55E', '#3B82F6', '#A855F7']), r: 12, size: 15, px: 22, py: 12 });
    const n = await info(b); await at(b, (w - n.width) / 2, (h - n.height) / 2);
  } },
  { label: 'Trop de couleurs de fond et de texte', draw: async (P, w, h) => {
    const cols = [['#FEF3C7', '#B45309'], ['#DBEAFE', '#1D4ED8'], ['#FCE7F3', '#BE185D'], ['#DCFCE7', '#15803D'], ['#1E1B4B', '#A5B4FC']];
    const cw = 74, gx = (w - cols.length * cw - (cols.length - 1) * 8) / 2;
    for (const [i, [bg, fg]] of cols.entries()) {
      const c = await frame(P, { x: gx + i * (cw + 8), y: (h - 64) / 2, w: cw, h: 64, r: 10, fill: rgb(bg), name: 'Section' });
      const t = await T(c, 'Titre', { size: 13, color: rgb(fg), style: 'Bold' }); await at(t, 10, 12);
      await rect(c, { x: 10, y: 36, w: 50, h: 4, r: 2, fill: rgb(fg), opacity: 0.4 }); await rect(c, { x: 10, y: 45, w: 36, h: 4, r: 2, fill: rgb(fg), opacity: 0.4 });
    }
  } },
]);
await categorie(1, 'Les couleurs', [
  { label: 'Orange brûlé et vert fluo', draw: async (P, w, h) => {
    for (const [i, c2] of ['#DA5B12', '#BCFF00'].entries()) {
      const s = await frame(P, { x: w / 2 - 150 + i * 160, y: (h - 150) / 2, w: 140, h: 150, r: 14, fill: C.white, effects: SHADOW_CARD, name: 'Couleur' });
      await rect(s, { x: 10, y: 10, w: 120, h: 96, r: 9, fill: rgb(c2) });
      const t = await text(s, c2, { x: 14, y: 116, size: 15, family: 'Inter', style: 'Semi Bold', ls: 0 });
    }
  } },
]);

// ---------- 2. Les CTA
await categorie(2, 'Les CTA', [
  { label: 'Des boutons tous différents', w: 1.1, draw: async (P, w, h) => {
    const specs = [['Commencer', { fill: rgb('#7C3AED'), r: 30 }], ['Voir plus', { fill: rgb('#F59E0B'), r: 2, family: 'Georgia', style: 'Bold' }], ['Démo', { fill: C.white, color: rgb('#111111'), r: 8, stroke: { color: rgb('#111111') } }], ['Contact', { fill: rgb('#10B981'), r: 18, family: 'Courier New', style: 'Bold' }], ['Réserver', { fill: rgb('#EF4444'), r: 0 }], ['Essai', { fill: grad(VIOLET), r: 14 }]];
    let x = 24, y = 34;
    for (const [l, o] of specs) {
      let b; try { b = await btn(P, l, { x, y, ...o }); } catch { b = await btn(P, l, { x, y, ...o, family: 'Inter', style: 'Bold' }); }
      const n = await info(b); if (x + n.width > w - 20) { x = 24; y += 52; await at(b, x, y); } x += n.width + 12;
    }
  } },
  { label: 'Une ombre de la couleur du bouton', draw: async (P, w, h) => {
    const b = await btn(P, 'Réserver un appel', { x: 0, y: 0, fill: rgb('#6D28D9'), r: 12, size: 15, px: 22, py: 12, fx: glow('#6D28D9', 0.7, 24, 12) });
    const n = await info(b); await at(b, (w - n.width) / 2, (h - n.height) / 2 - 6);
  } },
  { label: 'Le bouton qui monte au survol', draw: async (P, w, h) => {
    const a = await btn(P, 'Commencer', { x: w / 2 - 150, y: h / 2 - 8, fill: rgb('#2563EB'), r: 10 });
    const b = await btn(P, 'Commencer', { x: w / 2 + 40, y: h / 2 - 26, fill: rgb('#2563EB'), r: 10, fx: [{ type: 'DROP_SHADOW', visible: true, color: hex('#000000', 0.35), offset: { x: 0, y: 16 }, radius: 18, spread: 0 }] });
    await fw('import_svg', { parentId: P, x: w / 2 - 32, y: h / 2 - 8, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="54" height="20" viewBox="0 0 54 20"><path d="M2 14 L46 6 M38 2 L47 6 L40 13" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
  } },
]);
await categorie(2, 'Les CTA', [
  { label: 'La barre qui se complète au survol', draw: async (P, w, h) => {
    for (const [i, part] of [0.3, 1].entries()) {
      const x = w / 2 - 160 + i * 190;
      await T(P, 'Voir le projet', { size: 16, color: rgb('#111111') }).then((t) => at(t, x, h / 2 - 16));
      await rect(P, { x, y: h / 2 + 10, w: 110, h: 2, fill: rgb('#D4D4D8') });
      await rect(P, { x, y: h / 2 + 10, w: 110 * part, h: 2, fill: rgb('#7C3AED') });
    }
  } },
  { label: 'Une étincelle puis une flèche', draw: async (P, w, h) => {
    const b = await btn(P, '✦  Générer mon site  →', { x: 0, y: 0, fill: rgb('#111111'), r: 12, size: 15, px: 22, py: 12 });
    const n = await info(b); await at(b, (w - n.width) / 2, (h - n.height) / 2);
  } },
]);

// ---------- 3. Le texte
await categorie(3, 'Le texte', [
  { label: 'Majuscules très espacées', draw: async (P, w, h) => {
    const t = await text(P, 'NOS SERVICES', { x: 0, y: 0, size: 24, family: 'Inter', style: 'Bold', ls: 40 }); await centerIn(t, w, (h - 30) / 2);
  } },
  { label: 'Un petit texte coloré sur chaque titre', draw: async (P, w, h) => {
    const e = await text(P, '• FONCTIONNALITÉS', { x: 0, y: 0, size: 11, family: 'Inter', style: 'Bold', color: rgb('#7C3AED'), ls: 12 }); await centerIn(e, w, h / 2 - 30);
    const t = await text(P, 'Tout ce dont vous avez besoin', { x: 0, y: 0, size: 20, family: 'Inter', style: 'Bold', ls: -2 }); await centerIn(t, w, h / 2 - 10);
  } },
  { label: 'Des tags avec un point', draw: async (P, w, h) => {
    const tg = await frame(P, { x: 0, y: 0, w: 40, h: 20, r: 30, fill: C.white, stroke: { color: rgb('#E4E4E7') }, name: 'Tag point' });
    await T(tg, '●  Disponible maintenant', { size: 13, color: rgb('#16A34A') }); await hug(tg, { px: 14, py: 7 });
    const n = await info(tg); await at(tg, (w - n.width) / 2, (h - n.height) / 2);
  } },
]);
await categorie(3, 'Le texte', [
  { label: 'Des textes séparés par des points', draw: async (P, w, h) => {
    const t = await T(P, 'Claire · assistante de direction · Lyon', { size: 16, style: 'Medium', color: rgb('#3F3F46') }); await centerIn(t, w, (h - 20) / 2);
  } },
  { label: 'Des tirets longs au milieu des phrases', draw: async (P, w, h) => {
    const t = await T(P, 'Votre site — rapide, moderne — enfin prêt.', { size: 17, style: 'Medium', color: rgb('#18181B') }); await centerIn(t, w, (h - 22) / 2);
  } },
]);
await categorie(3, 'Le texte', [
  { label: 'Un fil d’Ariane avec des //', draw: async (P, w, h) => {
    const t = await T(P, 'Accueil  //  Projets  //  Design', { size: 16, style: 'Medium', color: rgb('#71717A') }); await centerIn(t, w, (h - 20) / 2);
  } },
  { label: 'Chiffres en monospace à côté d’un empilement', w: 1.4, draw: async (P, w, h) => {
    for (let i = 0; i < 3; i++) {
      const y = 26 + i * 52;
      let n; try { n = await text(P, '0' + (i + 1), { x: 60, y: y + 10, size: 20, family: 'Roboto Mono', style: 'Regular', color: rgb('#7C3AED'), ls: 0 }); } catch { n = await text(P, '0' + (i + 1), { x: 60, y: y + 10, size: 20, family: 'Courier New', style: 'Regular', color: rgb('#7C3AED'), ls: 0 }); }
      const c = await frame(P, { x: 120, y, w: 270, h: 42, r: 10, fill: C.white, stroke: { color: rgb('#E4E4E7') }, name: 'Carte empilée' });
      await rect(c, { x: 14, y: 12, w: 120, h: 6, r: 3, fill: rgb('#D4D4D8') }); await rect(c, { x: 14, y: 24, w: 180, h: 5, r: 2.5, fill: rgb('#E4E4E7') });
    }
  } },
]);

// ---------- 4. Emojis et icônes
const icon = (p, x, y, col, s = 20) => fw('import_svg', { parentId: p, x, y, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 L3 14 h9 l-1 8 10-12 h-9 l1-8z"/></svg>` });
await categorie(4, 'Emojis et icônes', [
  { label: 'Des emojis partout, même dans les tags', draw: async (P, w, h) => {
    let x = 0; const ids = [];
    for (const l of ['🚀 Rapide', '✨ Moderne', '🔥 Populaire']) {
      const tg = await frame(P, { x: 0, y: 0, w: 40, h: 20, r: 30, fill: C.white, stroke: { color: rgb('#E4E4E7') }, name: 'Tag emoji' });
      await T(tg, l, { size: 14, style: 'Medium', color: rgb('#18181B') }); await hug(tg, { px: 12, py: 7 });
      ids.push([tg, (await info(tg)).width]);
    }
    const tot = ids.reduce((a, [, w2]) => a + w2, 0) + 20; x = (w - tot) / 2;
    for (const [id, w2] of ids) { await at(id, x, h / 2 - 16); x += w2 + 10; }
  } },
  { label: 'Six couleurs d’icônes dans une section', draw: async (P, w, h) => {
    const cols = ['#EF4444', '#F59E0B', '#22C55E', '#06B6D4', '#6366F1', '#EC4899'];
    const gx = (w - 6 * 44 - 5 * 12) / 2;
    for (const [i, c2] of cols.entries()) {
      const b = await frame(P, { x: gx + i * 56, y: (h - 44) / 2, w: 44, h: 44, r: 11, fill: { type: 'SOLID', color: rgb(c2), opacity: 0.15 }, name: 'Icône' });
      await icon(b, 12, 12, c2);
    }
  } },
  { label: 'Des coches ✓ dans toutes les listes', draw: async (P, w, h) => {
    for (const [i, l] of ['Livraison rapide', 'Support 24/7', 'Sans engagement'].entries()) {
      const t = await T(P, '✓  ' + l, { size: 14, style: 'Medium', color: rgb('#18181B') }); await at(t, w / 2 - 70, (h - 66) / 2 + i * 23);
    }
  } },
]);
await categorie(4, 'Emojis et icônes', [
  { label: 'Les mêmes icônes de bibliothèque partout', draw: async (P, w, h) => {
    const svgs = ['<path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>', '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', '<path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5"/>', '<path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M21 4v5h-5"/>'];
    const gx = (w - 5 * 52 - 4 * 14) / 2;
    for (const [i, s] of svgs.entries()) {
      const b = await frame(P, { x: gx + i * 66, y: (h - 52) / 2, w: 52, h: 52, r: 12, fill: C.white, stroke: { color: rgb('#E4E4E7') }, name: 'Icône' });
      await fw('import_svg', { parentId: b, x: 14, y: 14, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${s}</svg>` });
    }
  } },
  { label: 'Des logos dans des carrés violets', draw: async (P, w, h) => {
    const gx = (w - 4 * 56 - 3 * 16) / 2;
    for (let i = 0; i < 4; i++) {
      const b = await frame(P, { x: gx + i * 72, y: (h - 56) / 2, w: 56, h: 56, r: 14, fill: grad(['#8B5CF6', '#6D28D9'], 1), name: 'Logo carré' });
      const shapes = ['<circle cx="12" cy="12" r="7"/>', '<rect x="5" y="5" width="14" height="14" rx="3"/>', '<path d="M12 4l8 16H4z"/>', '<path d="M4 12h16M12 4v16"/>'];
      await fw('import_svg', { parentId: b, x: 16, y: 16, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${shapes[i]}</svg>` });
    }
  } },
]);

// ---------- 5. Cartes et fonds
await categorie(5, 'Cartes et fonds', [
  { label: 'Une offre à gros contour et grosse ombre', w: 1.2, draw: async (P, w, h) => {
    const c = await frame(P, { x: (w - 200) / 2, y: (h - 110) / 2 + 4, w: 200, h: 110, r: 16, fill: C.white, stroke: { color: rgb('#7C3AED') }, strokeW: 3, effects: [{ type: 'DROP_SHADOW', visible: true, color: hex('#000000', 0.25), offset: { x: 0, y: 14 }, radius: 24, spread: 0 }], name: 'Carte offre' });
    await T(c, 'Pro', { size: 14, style: 'Bold' }).then((t) => at(t, 16, 14));
    await text(c, '49 €', { x: 16, y: 36, size: 26, family: 'Inter', style: 'Extra Bold', ls: -2 });
    await rect(c, { x: 16, y: 80, w: 168, h: 18, r: 9, fill: rgb('#7C3AED') });
  } },
  { label: 'Une fausse fenêtre de navigateur', draw: async (P, w, h) => {
    const c = await frame(P, { x: (w - 260) / 2, y: (h - 96) / 2, w: 260, h: 96, r: 12, fill: rgb('#18181B'), name: 'Fenêtre' });
    for (const [i, c2] of ['#FF5F57', '#FEBC2E', '#28C840'].entries()) { const e = await fw('create_ellipse', { parentId: c, x: 12 + i * 16, y: 11, width: 10, height: 10 }); await fw('set_fills', { nodeId: e.nodeId, fills: [{ type: 'SOLID', color: rgb(c2) }] }); }
    await rect(c, { x: 16, y: 40, w: 150, h: 7, r: 3.5, fill: rgb('#3F3F46') }); await rect(c, { x: 16, y: 56, w: 110, h: 7, r: 3.5, fill: rgb('#3F3F46') });
  } },
  { label: 'Un fond à carreaux', draw: async (P, w, h) => {
    let d = ''; for (let x = 0; x <= w; x += 22) d += `M${x} 0V${h}`; for (let y = 0; y <= h; y += 22) d += `M0 ${y}H${w}`;
    await fw('import_svg', { parentId: P, x: 0, y: 0, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" stroke="#C9C9CF" stroke-width="1"/></svg>` });
    const t = await text(P, 'Le futur du web', { x: 0, y: 0, size: 22, family: 'Inter', style: 'Bold', ls: -2 }); await centerIn(t, w, (h - 28) / 2);
  } },
]);
await categorie(5, 'Cartes et fonds', [
  { label: 'Des halos flous dans les coins', draw: async (P, w, h) => {
    await fw('set_fills', { nodeId: P, fills: [{ type: 'SOLID', color: rgb('#0B0B14') }] });
    for (const [x, c2] of [[-50, '#3B82F6'], [w - 110, '#6366F1']]) { const e = await fw('create_ellipse', { parentId: P, x, y: -60, width: 160, height: 160 }); await fw('set_fills', { nodeId: e.nodeId, fills: [{ type: 'SOLID', color: rgb(c2), opacity: 0.8 }] }); await fw('set_effects', { nodeId: e.nodeId, effects: [{ type: 'LAYER_BLUR', visible: true, radius: 50 }] }); }
    const t = await text(P, 'Nos tarifs', { x: 0, y: 0, size: 22, family: 'Inter', style: 'Bold', color: C.white, ls: -2 }); await centerIn(t, w, (h - 28) / 2);
  } },
  { label: 'Un effet de lumière au survol', draw: async (P, w, h) => {
    const c = await frame(P, { x: (w - 240) / 2, y: (h - 90) / 2, w: 240, h: 90, r: 14, fill: rgb('#18181B'), name: 'Carte lumière' });
    await fw('set_fills', { nodeId: c, fills: [{ type: 'GRADIENT_RADIAL', gradientStops: [{ position: 0, color: hex('#A78BFA', 0.55) }, { position: 1, color: hex('#18181B', 1) }], gradientTransform: [[0.8, 0, 0.35], [0, 1.6, -0.2]] }] });
    await rect(c, { x: 18, y: 30, w: 120, h: 7, r: 3.5, fill: rgb('#52525B') }); await rect(c, { x: 18, y: 46, w: 90, h: 7, r: 3.5, fill: rgb('#52525B') });
  } },
  { label: 'Une carte d’article sans marge, avec compteur', w: 1.3, draw: async (P, w, h) => {
    const c = await frame(P, { x: (w - 210) / 2, y: (h - 120) / 2 + 6, w: 210, h: 120, r: 12, fill: C.white, name: 'Carte article' });
    await rect(c, { x: 0, y: 0, w: 210, h: 70, fill: grad(['#93C5FD', '#C4B5FD'], 1) });
    await T(c, 'Design  (8)', { size: 11, color: rgb('#7C3AED'), style: 'Bold' }).then((t) => at(t, 12, 80));
    await rect(c, { x: 12, y: 100, w: 150, h: 7, r: 3.5, fill: rgb('#D4D4D8') });
  } },
]);

// ---------- 6. Les petits détails
const star = (col, round) => `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" fill="${col}" stroke="${col}" stroke-width="${round ? 2 : 0}" stroke-linejoin="${round ? 'round' : 'miter'}"/></svg>`;
await categorie(6, 'Les petits détails', [
  { label: 'Des étoiles pointues, pas jaunes', draw: async (P, w, h) => {
    for (let i = 0; i < 5; i++) await fw('import_svg', { parentId: P, x: w / 2 - 75 + i * 30, y: (h - 26) / 2, svg: star('#7C3AED', false) });
  } },
  { label: 'Des initiales à la place des photos', draw: async (P, w, h) => {
    for (const [i, [l, c2]] of [['CL', '#7C3AED'], ['MB', '#2563EB'], ['JD', '#DB2777']].entries()) {
      const e = await frame(P, { x: w / 2 - 80 + i * 56, y: (h - 46) / 2, w: 46, h: 46, r: 23, fill: rgb(c2), name: 'Avatar' });
      const t = await T(e, l, { size: 14, style: 'Bold', color: C.white }); await centerIn(t, 46, 14);
    }
  } },
]);
await categorie(6, 'Les petits détails', [
  { label: 'Un switch dark / light sur un site vitrine', draw: async (P, w, h) => {
    const s = await frame(P, { x: (w - 84) / 2, y: (h - 42) / 2 - 12, w: 84, h: 42, r: 21, fill: rgb('#18181B'), name: 'Switch' });
    const k = await frame(s, { x: 46, y: 4, w: 34, h: 34, r: 17, fill: C.white, name: 'Bouton' });
    await fw('import_svg', { parentId: k, x: 8, y: 8, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18181B" stroke-width="2" stroke-linecap="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>' });
    const n = await T(P, 'Pas de l’IA en soi, mais inutile sur un site vitrine', { size: 12, style: 'Medium', color: rgb('#52525B') }); await centerIn(n, w, (h - 42) / 2 + 40);
  } },
  { label: 'Des éléments qui flottent en boucle', draw: async (P, w, h) => {
    const c = await frame(P, { x: (w - 160) / 2, y: (h - 70) / 2, w: 160, h: 70, r: 14, fill: C.white, effects: SHADOW_CARD, name: 'Carte flottante' });
    await rect(c, { x: 16, y: 22, w: 100, h: 7, r: 3.5, fill: rgb('#D4D4D8') }); await rect(c, { x: 16, y: 38, w: 70, h: 7, r: 3.5, fill: rgb('#E4E4E7') });
    await fw('import_svg', { parentId: P, x: (w - 160) / 2 + 176, y: (h - 60) / 2, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="60" viewBox="0 0 20 60"><path d="M10 4v52M3 11l7-7 7 7M3 49l7 7 7-7" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
  } },
]);

// ---------- Accumulation
{
  const S = await slide('5406:3302', 'Accumulation');
  const k = await top(S);
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.name === 'Frame 4260').id] });
  const b = k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id;
  await fw('set_text', { nodeId: b, characters: 'Un seul de ces détails ne veut rien dire.\n\nMais quand plusieurs s’accumulent, ton visiteur le sent.\n\nCombien il y en a sur ton site ?' });
  await fw('set_position', { nodeId: b, x: 71, y: 120 });
  await pill(k.find((c) => c.name === 'Frame 4417').id, 'Le prompt pour tout retirer');
}

// ---------- Prompt (lisible et copiable)
const PROMPT = JSON.parse(fs.readFileSync(new URL('./prompt.json', import.meta.url), 'utf8'));
for (const [i, part] of PROMPT.entries()) {
  const S = await slide('5406:3302', `Prompt ${i + 1}`);
  const k = await top(S);
  const c = k.find((x) => x.name === 'Frame 4260').id;
  await setCart(c, `Le prompt (${i + 1}/${PROMPT.length})`, 21, 15);
  await fw('set_position', { nodeId: c, x: 62, y: 84 });
  await fw('delete_nodes', { nodeIds: [k.find((x) => x.type === 'TEXT' && x.name.startsWith('La plupart')).id, k.find((x) => x.name === 'Frame 4417').id] });
  const card = await frame(S, { x: 62, y: 166, w: 452, h: 440, r: 16, fill: C.white, stroke: { color: rgb('#000000'), a: 0.1 }, effects: SHADOW_CARD, name: 'Prompt' });
  const t = await text(card, part, { x: 20, y: 18, size: 12.4, family: 'Inter', style: 'Regular', color: rgb('#18181B'), w: 412, lh: 145, ls: 0 });
  const ti = await info(t);
  await fw('resize_nodes', { nodeIds: [card], width: 452, height: Math.min(ti.height + 36, 452) });
  console.log('prompt', i + 1, Math.round(ti.height));
}

await slide('5440:1458', 'Merci');
fs.writeFileSync(new URL('./slides.json', import.meta.url), JSON.stringify({ section: SEC, slides }, null, 1));
console.log('section', SEC, slides.length);
close();
