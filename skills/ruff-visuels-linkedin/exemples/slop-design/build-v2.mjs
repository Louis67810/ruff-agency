// Carrousel « Les détails qui trahissent un site fait par IA » (slop design).
// Points : page Notion de Louis + liste du post. Chaque détail est recréé dans Figma (pas de capture),
// posé dans un panneau gris avec un tag blanc + croix rouge au coin. Prompt de nettoyage à la fin.
import fs from 'node:fs';
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, info, hug, badge, tag } from '../../outils/kit.mjs';

const W = 575;
const { nodeId: SEC } = await fw('create_section', { name: 'Claude — Carrousel slop design (v2)', x: 59000, y: -84300, width: 12 * 625 + 150, height: 1000 });
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
  await fw('set_position', { nodeId: by('Vector 658'), x: 322, y: 452 });
  await fw('reorder_nodes', { nodeIds: [by('Vector 658')], index: (await top(S)).length - 1 });
}


// ==================== v2 (retours de Louis du 2026-10-31) ====================
// Une seule slide par catégorie (numéros 1 à 5, jamais répétés), pas de slide contexte,
// catégorie 5 = une section pricing qui réunit plusieurs détails, prompt sur 2 slides.
const SPARKLES = 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z';
const heroSparkles = (col, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${SPARKLES}"/></svg>`;
// Bouton avec icône Heroicons « sparkles » puis flèche.
async function sparkleBtn(p, label, o) {
  const f = await frame(p, { x: o.x, y: o.y, w: 50, h: 30, r: 12, fill: rgb('#111111'), name: 'Bouton étincelle' });
  await fw('import_svg', { parentId: f, x: 0, y: 0, svg: heroSparkles('#FFFFFF', 17) });
  await T(f, label + '  →', { size: 15, color: C.white });
  await fw('set_auto_layout', { nodeId: f, layoutMode: 'HORIZONTAL', paddingLeft: 18, paddingRight: 20, paddingTop: 12, paddingBottom: 12, itemSpacing: 8, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId: f, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  return f;
}
// Carré violet type « logo IA » (référence envoyée par Louis) : dégradé violet, reflet clair, icône blanche.
async function violetSquare(p, x, y, s, svgInner) {
  const b = await frame(p, { x, y, w: s, h: s, r: s * 0.24, fill: { type: 'GRADIENT_LINEAR', gradientStops: [{ position: 0, color: hex('#8B5CF6') }, { position: 1, color: hex('#5B21B6') }], gradientTransform: [[0.7, 0.7, 0], [-0.7, 0.7, 0.5]] }, name: 'Carré violet',
    effects: [{ type: 'INNER_SHADOW', visible: true, color: hex('#FFFFFF', 0.35), offset: { x: 0, y: 2 }, radius: 3, spread: 0 }, { type: 'DROP_SHADOW', visible: true, color: hex('#6D28D9', 0.35), offset: { x: 0, y: 6 }, radius: 12, spread: 0 }] });
  await fw('import_svg', { parentId: b, x: s * 0.25, y: s * 0.25, svg: svgInner(s * 0.5) });
  return b;
}
const star4 = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"><path d="M12 2 C12.8 8.5 15.5 11.2 22 12 C15.5 12.8 12.8 15.5 12 22 C11.2 15.5 8.5 12.8 2 12 C8.5 11.2 11.2 8.5 12 2Z"/><circle cx="12" cy="12" r="1.6" fill="#FFFFFF"/></svg>`;
const bolt = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
const cube = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"><path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>`;

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
  { label: 'Orange brûlé et vert fluo', draw: async (P, w, h) => {
    for (const [i, c2] of ['#DA5B12', '#BCFF00'].entries()) {
      const s = await frame(P, { x: w / 2 - 128 + i * 136, y: (h - 72) / 2, w: 120, h: 72, r: 12, fill: C.white, effects: SHADOW_CARD, name: 'Couleur' });
      await rect(s, { x: 8, y: 8, w: 104, h: 36, r: 7, fill: rgb(c2) });
      await text(s, c2, { x: 10, y: 50, size: 12, family: 'Inter', style: 'Semi Bold', ls: 0 });
    }
  } },
]);

// ---------- 2. Les CTA
await categorie(2, 'Les CTA', [
  { label: 'Des boutons tous différents', w: 1.15, draw: async (P, w, h) => {
    const specs = [['Commencer', { fill: rgb('#7C3AED'), r: 30 }], ['Voir plus', { fill: rgb('#F59E0B'), r: 2, family: 'Georgia', style: 'Bold' }], ['Démo', { fill: C.white, color: rgb('#111111'), r: 8, stroke: { color: rgb('#111111') } }], ['Contact', { fill: rgb('#10B981'), r: 18, family: 'Courier New', style: 'Bold' }], ['Réserver', { fill: rgb('#EF4444'), r: 0 }], ['Essai', { fill: grad(VIOLET), r: 14 }]];
    const ids = [];
    for (const [l, o] of specs) { let b; try { b = await btn(P, l, { x: 0, y: 0, ...o }); } catch { b = await btn(P, l, { x: 0, y: 0, ...o, family: 'Inter', style: 'Bold' }); } ids.push([b, (await info(b)).width]); }
    const rows = [ids.slice(0, 3), ids.slice(3)];
    for (const [r, row] of rows.entries()) { const tot = row.reduce((a, [, ww]) => a + ww, 0) + 12 * (row.length - 1); let x = (w - tot) / 2; for (const [id, ww] of row) { await at(id, x, h / 2 - 40 + r * 46); x += ww + 12; } }
  } },
  { label: 'Une étincelle puis une flèche', draw: async (P, w, h) => {
    const b = await sparkleBtn(P, 'Générer mon site', { x: 0, y: 0 });
    const n = await info(b); await at(b, (w - n.width) / 2, (h - n.height) / 2);
  } },
  { label: 'Le bouton qui monte au survol', draw: async (P, w, h) => {
    await btn(P, 'Commencer', { x: w / 2 - 150, y: h / 2 - 8, fill: rgb('#2563EB'), r: 10 });
    await btn(P, 'Commencer', { x: w / 2 + 40, y: h / 2 - 26, fill: rgb('#2563EB'), r: 10, fx: [{ type: 'DROP_SHADOW', visible: true, color: hex('#000000', 0.35), offset: { x: 0, y: 16 }, radius: 18, spread: 0 }] });
    await fw('import_svg', { parentId: P, x: w / 2 - 32, y: h / 2 - 8, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="54" height="20" viewBox="0 0 54 20"><path d="M2 14 L46 6 M38 2 L47 6 L40 13" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
  } },
]);

// ---------- 3. Le texte
await categorie(3, 'Le texte', [
  { label: 'Majuscules très espacées', draw: async (P, w, h) => {
    const t = await text(P, 'NOS SERVICES', { x: 0, y: 0, size: 24, family: 'Inter', style: 'Bold', ls: 40 }); await centerIn(t, w, (h - 30) / 2);
  } },
  { label: 'Sans serif et serif dans le même titre', draw: async (P, w, h) => {
    const a = await text(P, 'Le design qui', { x: 0, y: 0, size: 24, family: 'Inter', style: 'Bold', ls: -2 });
    let b; try { b = await text(P, 'convertit', { x: 0, y: 0, size: 27, family: 'Instrument Serif', style: 'Italic', ls: -1 }); } catch { b = await text(P, 'convertit', { x: 0, y: 0, size: 26, family: 'Georgia', style: 'Italic', ls: 0 }); }
    const ai = await info(a), bi = await info(b), tot = ai.width + 8 + bi.width;
    await at(a, (w - tot) / 2, (h - ai.height) / 2); await at(b, (w - tot) / 2 + ai.width + 8, (h - ai.height) / 2 + ai.height - bi.height - 1);
  } },
  { label: 'Des tags avec un point', draw: async (P, w, h) => {
    const tg = await frame(P, { x: 0, y: 0, w: 40, h: 20, r: 30, fill: C.white, stroke: { color: rgb('#E4E4E7') }, name: 'Tag point' });
    await T(tg, '●  Disponible maintenant', { size: 13, color: rgb('#16A34A') }); await hug(tg, { px: 14, py: 7 });
    const n = await info(tg); await at(tg, (w - n.width) / 2, (h - n.height) / 2);
  } },
]);

// ---------- 4. Emojis et icônes
await categorie(4, 'Emojis et icônes', [
  { label: 'Des emojis partout, même dans les tags', draw: async (P, w, h) => {
    const ids = [];
    for (const l of ['🚀 Rapide', '✨ Moderne', '🔥 Populaire']) {
      const tg = await frame(P, { x: 0, y: 0, w: 40, h: 20, r: 30, fill: C.white, stroke: { color: rgb('#E4E4E7') }, name: 'Tag emoji' });
      await T(tg, l, { size: 14, style: 'Medium', color: rgb('#18181B') }); await hug(tg, { px: 12, py: 7 });
      ids.push([tg, (await info(tg)).width]);
    }
    let x = (w - ids.reduce((a, [, ww]) => a + ww, 0) - 20) / 2;
    for (const [id, ww] of ids) { await at(id, x, h / 2 - 16); x += ww + 10; }
  } },
  { label: 'Six couleurs d’icônes dans une section', draw: async (P, w, h) => {
    const cols = ['#EF4444', '#F59E0B', '#22C55E', '#06B6D4', '#6366F1', '#EC4899'];
    const gx = (w - 6 * 44 - 5 * 12) / 2;
    for (const [i, c2] of cols.entries()) {
      const b = await frame(P, { x: gx + i * 56, y: (h - 44) / 2, w: 44, h: 44, r: 11, fill: { type: 'SOLID', color: rgb(c2), opacity: 0.15 }, name: 'Icône' });
      await fw('import_svg', { parentId: b, x: 12, y: 12, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c2}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>` });
    }
  } },
  { label: 'Des icônes dans des carrés violets', draw: async (P, w, h) => {
    const s = 56, gx = (w - 3 * s - 2 * 22) / 2;
    for (const [i, ic] of [star4, bolt, cube].entries()) await violetSquare(P, gx + i * (s + 22), (h - s) / 2, s, ic);
  } },
]);

// ---------- 5. Cartes et fonds : une section pricing qui accumule les détails, tags sous l'illustration
{
  const S = await slide('5406:2461', 'Cartes et fonds');
  const all = await tree(S);
  const k = all.filter((n) => n.d === 1);
  await fw('set_text', { nodeId: all.find((n) => n.type === 'TEXT' && /^\d+$/.test(n.name)).id, characters: '5' });
  const cf = k.find((n) => n.name === 'Frame 4650').id;
  await fw('set_fills', { nodeId: cf, fills: RED.fills }); await fw('set_effects', { nodeId: cf, effects: RED.effects });
  await setCart(cf, 'Cartes et fonds', 18, 17.5);
  await fw('delete_nodes', { nodeIds: k.filter((n) => ['Frame 4266', 'Frame 14', 'Frame 2147224256', 'Group 733', 'Vector 729'].includes(n.name) || (n.type === 'TEXT' && n.name.startsWith('Pour pousser'))).map((n) => n.id) });
  const P = await frame(S, { x: 62, y: 180, w: 452, h: 270, r: 16, fill: rgb('#0B0B14'), effects: SHADOW_CARD, name: 'Section pricing IA' });
  let d = ''; for (let x = 0; x <= 452; x += 22) d += `M${x} 0V270`; for (let y = 0; y <= 270; y += 22) d += `M0 ${y}H452`;
  await fw('import_svg', { parentId: P, x: 0, y: 0, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="452" height="270" viewBox="0 0 452 270"><path d="${d}" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1"/></svg>` });
  for (const [x, c2] of [[-60, '#3B82F6'], [352, '#6366F1']]) { const e = await fw('create_ellipse', { parentId: P, x, y: -70, width: 160, height: 160 }); await fw('set_fills', { nodeId: e.nodeId, fills: [{ type: 'SOLID', color: rgb(c2), opacity: 0.85 }] }); await fw('set_effects', { nodeId: e.nodeId, effects: [{ type: 'LAYER_BLUR', visible: true, radius: 55 }] }); }
  const ttl = await text(P, 'Nos offres', { x: 0, y: 0, size: 22, family: 'Inter', style: 'Bold', color: C.white, ls: -2 }); await centerIn(ttl, 452, 20);
  // preuve : initiales à la place des photos
  const av = [['CL', '#7C3AED'], ['MB', '#2563EB'], ['JD', '#DB2777']];
  for (const [i, [l, c2]] of av.entries()) { const e = await frame(P, { x: 148 + i * 18, y: 54, w: 24, h: 24, r: 12, fill: rgb(c2), stroke: { color: rgb('#0B0B14') }, strokeW: 2, name: 'Avatar initiales' }); const t = await T(e, l, { size: 8, style: 'Bold', color: C.white }); await centerIn(t, 24, 7); }
  const pr = await T(P, 'Ils nous font confiance', { size: 11, style: 'Medium', color: rgb('#A1A1AA') }); await at(pr, 210, 59);
  // deux offres : gros contour + grosse ombre / lumière au survol
  const card = async (x, name, price, opts) => {
    const c = await frame(P, { x, y: 92, w: 190, h: 162, r: 14, fill: rgb('#141420'), name, ...opts });
    await T(c, name, { size: 13, style: 'Bold', color: C.white }).then((t) => at(t, 16, 14));
    await text(c, price, { x: 16, y: 34, size: 24, family: 'Inter', style: 'Extra Bold', color: C.white, ls: -2 });
    for (const [i, l] of ['Site sur mesure', 'Support inclus', 'Mises à jour'].entries()) await T(c, '→  ' + l, { size: 11.5, style: 'Medium', color: rgb('#D4D4D8') }).then((t) => at(t, 16, 70 + i * 20));
    await rect(c, { x: 16, y: 130, w: 158, h: 22, r: 8, fill: rgb('#7C3AED') });
    return c;
  };
  await card(28, 'Pro', '49 €', { stroke: { color: rgb('#8B5CF6') }, strokeW: 3, effects: [{ type: 'DROP_SHADOW', visible: true, color: hex('#7C3AED', 0.55), offset: { x: 0, y: 14 }, radius: 28, spread: 0 }] });
  const c2 = await card(234, 'Business', '99 €', {});
  await fw('set_fills', { nodeId: c2, fills: [{ type: 'GRADIENT_RADIAL', gradientStops: [{ position: 0, color: hex('#A78BFA', 0.5) }, { position: 1, color: hex('#141420', 1) }], gradientTransform: [[0.9, 0, 0.3], [0, 0.9, -0.15]] }] });
  await fw('import_svg', { parentId: P, x: 330, y: 118, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22"><path d="M2 2 L2 18 L6.5 14 L9.5 20.5 L12 19.3 L9 13 L15 13 Z" fill="#FFFFFF" stroke="#111111" stroke-width="1.4" stroke-linejoin="round"/></svg>' });
  // tags sous l'illustration (règle R20), croix rouge au coin de chacun
  let x = 62, y = 468;
  for (const l of ['Halos flous dans les coins', 'Gros contour et grosse ombre', 'Lumière au survol', 'Une flèche devant chaque point', 'Initiales à la place des photos', 'Fond à carreaux']) {
    const t = await tag(S, l, { x: 0, y: 0, s: 1.2 }); const ti = await info(t);
    if (x + ti.width > 514) { x = 62; y += ti.height + 12; }
    await at(t, x, y); await badge(S, 'cross', { x: x + ti.width - 13, y: y - 10, rot: -11.5, size: 20 });
    x += ti.width + 14;
  }
}

// ---------- Accumulation
{
  const S = await slide('5406:3302', 'Accumulation');
  const k = await top(S);
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.name === 'Frame 4260').id] });
  const b = k.find((c) => c.type === 'TEXT' && c.name.startsWith('La plupart')).id;
  await fw('set_text', { nodeId: b, characters: 'Un seul de ces détails ne veut rien dire.\n\nMais quand plusieurs s’accumulent, ton visiteur le sent.\n\nCombien il y en a sur ton site ?' });
  await fw('set_position', { nodeId: b, x: 71, y: 120 });
  await pill(k.find((c) => c.name === 'Frame 4417').id, 'Le prompt pour tout retirer');
}

// ---------- Prompt sur 2 slides
const PROMPT = JSON.parse(fs.readFileSync(new URL('./prompt-v2.json', import.meta.url), 'utf8'));
for (const [i, part] of PROMPT.entries()) {
  const S = await slide('5406:3302', `Prompt ${i + 1}`);
  const k = await top(S);
  const c = k.find((x) => x.name === 'Frame 4260').id;
  const ci = await setCart(c, `Le prompt (${i + 1}/${PROMPT.length})`, 18, 12);
  await fw('set_position', { nodeId: c, x: 62, y: 76 });
  await fw('delete_nodes', { nodeIds: [k.find((x) => x.type === 'TEXT' && x.name.startsWith('La plupart')).id, k.find((x) => x.name === 'Frame 4417').id] });
  const card = await frame(S, { x: 50, y: 76 + ci.height + 12, w: 476, h: 470, r: 14, fill: C.white, stroke: { color: rgb('#000000'), a: 0.1 }, effects: SHADOW_CARD, name: 'Prompt' });
  const t = await text(card, part, { x: 16, y: 14, size: 11, family: 'Inter', style: 'Regular', color: rgb('#18181B'), w: 444, lh: 136, ls: 0 });
  const ti = await info(t);
  await fw('resize_nodes', { nodeIds: [card], width: 476, height: ti.height + 28 });
  console.log('prompt', i + 1, Math.round(76 + ci.height + 12 + ti.height + 28));
}

await slide('5440:1458', 'Merci');
fs.writeFileSync(new URL('./slides-v2.json', import.meta.url), JSON.stringify({ section: SEC, slides }, null, 1));
console.log('section', SEC, slides.length);
close();
