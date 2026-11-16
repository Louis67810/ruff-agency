// Briques d'illustration dans le style Louis / Ruff Agency, construites dans Figma via Figwright.
// Les valeurs (couleurs, ombres, rayons) sont relevées sur le corpus Figwright (voir banque/).
import { fw } from './fw.mjs';

export const C = {
  bg: { r: 0.984, g: 0.984, b: 0.984 },
  ink: { r: 0.086, g: 0.086, b: 0.086 },
  white: { r: 1, g: 1, b: 1 },
  blue: { r: 0.0039, g: 0.2784, b: 1 },
  blue2: { r: 0.2163, g: 0.4323, b: 1 },
  blueSoft: { r: 0.91, g: 0.94, b: 1 },
  grey: { r: 0.898, g: 0.898, b: 0.898 },
  greyLine: { r: 0.85, g: 0.85, b: 0.85 },
  greyText: { r: 0.45, g: 0.45, b: 0.45 },
  panel: { r: 0.929, g: 0.929, b: 0.929 },
};
const rgba = (c, a) => ({ ...c, a });

// Ombres relevées sur les cartouches blancs / cartes du corpus (5406:3163, 5406:1588)
export const SHADOW_CARD = [
  { type: 'DROP_SHADOW', visible: true, color: rgba({ r: 0.09, g: 0.07, b: 0.35 }, 0.05), offset: { x: 0, y: 1.5 }, radius: 3, spread: 0 },
  { type: 'DROP_SHADOW', visible: true, color: rgba({ r: 0.09, g: 0.07, b: 0.35 }, 0.04), offset: { x: 0, y: 6 }, radius: 6, spread: 0 },
  { type: 'DROP_SHADOW', visible: true, color: rgba({ r: 0.09, g: 0.07, b: 0.35 }, 0.03), offset: { x: 0, y: 15 }, radius: 9, spread: 0 },
  { type: 'DROP_SHADOW', visible: true, color: rgba({ r: 0.09, g: 0.07, b: 0.35 }, 0.012), offset: { x: 0, y: 26 }, radius: 10.6, spread: 0 },
];
export const SHADOW_BLUE = [
  { type: 'DROP_SHADOW', visible: true, color: rgba(C.blue, 0.25), offset: { x: 0, y: 1 }, radius: 3, spread: 0 },
  { type: 'DROP_SHADOW', visible: true, color: rgba(C.blue, 0.21), offset: { x: 0, y: 5 }, radius: 5, spread: 0 },
  { type: 'DROP_SHADOW', visible: true, color: rgba(C.blue, 0.13), offset: { x: 0, y: 11 }, radius: 7, spread: 0 },
  { type: 'DROP_SHADOW', visible: true, color: rgba(C.blue, 0.04), offset: { x: 0, y: 20 }, radius: 8, spread: 0 },
];
export const BLUE_GRAD = {
  type: 'GRADIENT_LINEAR',
  gradientStops: [
    { position: 0, color: rgba(C.blue, 1) },
    { position: 0.48, color: rgba(C.blue2, 1) },
    { position: 1, color: rgba(C.blue, 1) },
  ],
  gradientTransform: [[1, 0.1, 0], [0.1, 1, 0]],
};

export async function rect(parent, { x, y, w, h, r = 0, fill = C.white, opacity, name, stroke, strokeW = 1, effects }) {
  const { nodeId } = await fw('create_rectangle', { parentId: parent, x, y, width: w, height: h, name });
  await fw('set_fills', { nodeId, fills: fill === null ? [] : [fill.type ? fill : { type: 'SOLID', color: fill, ...(opacity != null ? { opacity } : {}) }] });
  if (r) await fw('set_corner_radius', { nodeId, radius: r });
  if (stroke) await fw('set_strokes', { nodeId, strokes: [{ type: 'SOLID', color: stroke.color, opacity: stroke.a ?? 1 }], strokeWeight: strokeW, strokeAlign: 'INSIDE' });
  if (effects) await fw('set_effects', { nodeId, effects });
  return nodeId;
}

export async function frame(parent, { x, y, w, h, r = 0, fill = C.white, name, stroke, strokeW = 1, effects }) {
  const { nodeId } = await fw('create_frame', { parentId: parent, x, y, width: w, height: h, name });
  await fw('set_fills', { nodeId, fills: fill === null ? [] : [fill.type ? fill : { type: 'SOLID', color: fill }] });
  if (r) await fw('set_corner_radius', { nodeId, radius: r });
  if (stroke) await fw('set_strokes', { nodeId, strokes: [{ type: 'SOLID', color: stroke.color, opacity: stroke.a ?? 1 }], strokeWeight: strokeW, strokeAlign: 'INSIDE' });
  if (effects) await fw('set_effects', { nodeId, effects });
  return nodeId;
}

// Texte : Plus Jakarta Sans Bold par défaut (rôle éditorial / annotations) ; Inter pour les contrôles UI.
export async function text(parent, chars, { x, y, size = 16, family = 'Plus Jakarta Sans', style = 'Bold', color = C.ink, w, ls = -2, lh, opacity, name }) {
  const { nodeId } = await fw('create_text', { parentId: parent, characters: chars, x, y });
  await fw('set_text_properties', {
    nodeId,
    fontName: { family, style },
    fontSize: size,
    letterSpacing: { unit: 'PERCENT', value: ls },
    lineHeight: lh ? { unit: 'PERCENT', value: lh } : { unit: 'AUTO' },
    textAutoResize: w ? 'HEIGHT' : 'WIDTH_AND_HEIGHT',
  });
  if (w) await fw('resize_nodes', { nodeIds: [nodeId], width: w, height: size * 1.3 });
  if (w) await fw('set_text_properties', { nodeId, textAutoResize: 'HEIGHT' });
  await fw('set_fills', { nodeId, fills: [{ type: 'SOLID', color, ...(opacity != null ? { opacity } : {}) }] });
  if (name) await fw('rename_node', { nodeId, name });
  return nodeId;
}

// Clone un composant source dans `parent` et le met à l'échelle k calque par calque
// (tailles, positions, polices, rayons, traits, ombres) : un groupe ne se redimensionne pas proprement.
export async function cloneScaled(srcId, parent, k, { x, y } = {}) {
  const { nodeId } = await fw('clone_node', { nodeId: srcId });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: parent });
  const root = (await fw('get_node', { nodeId })).node;
  const fx = (list) => (list || []).map((f) => ({ ...f, visible: f.visible !== false, radius: (f.radius || 0) * k, spread: (f.spread || 0) * k, offset: { x: (f.offset?.x || 0) * k, y: (f.offset?.y || 0) * k } }));
  // ox, oy : origine du repère des enfants (frame parent = 0,0 ; groupe = repère du frame englobant)
  // inFlow : enfant placé par l'auto-layout de son parent (sa position suit les marges mises à l'échelle)
  const walk = async (n, ox, oy, isRoot, inFlow = false) => {
    const kids = n.children || [];
    if (n.type === 'GROUP') { for (const c of kids) await walk(c, ox, oy, false); return; }
    if (!isRoot && !inFlow) await fw('set_position', { nodeId: n.id, x: ox + (n.x - ox) * k, y: oy + (n.y - oy) * k });
    const L = n.layout;
    if (L?.mode && L.mode !== 'NONE') await fw('set_auto_layout', { nodeId: n.id, layoutMode: L.mode, paddingTop: (L.paddingTop || 0) * k, paddingRight: (L.paddingRight || 0) * k, paddingBottom: (L.paddingBottom || 0) * k, paddingLeft: (L.paddingLeft || 0) * k, itemSpacing: (L.itemSpacing || 0) * k });
    if (n.type === 'TEXT') { await fw('set_text_properties', { nodeId: n.id, fontSize: n.fontSize * k }); }
    else if (n.width > 0 || n.height > 0) await fw('resize_nodes', { nodeIds: [n.id], width: Math.max(n.width * k, 0.01), height: Math.max(n.height * k, 0.01) });
    if (typeof n.cornerRadius === 'number' && n.cornerRadius) await fw('set_corner_radius', { nodeId: n.id, radius: n.cornerRadius * k });
    if (n.strokeWeight && n.strokes?.length) await fw('set_strokes', { nodeId: n.id, strokes: n.strokes, strokeWeight: n.strokeWeight * k });
    if (n.effects?.length) await fw('set_effects', { nodeId: n.id, effects: fx(n.effects) });
    for (const c of kids) await walk(c, 0, 0, false, !!(L?.mode && L.mode !== 'NONE') && c.layoutPositioning !== 'ABSOLUTE');
  };
  if (root.type === 'GROUP') { for (const c of root.children) await walk(c, root.x, root.y, false); }
  else await walk(root, 0, 0, true);
  if (x != null) await fw('set_position', { nodeId, x, y });
  return nodeId;
}

export async function info(id) {
  const r = await fw('get_nodes_info', { nodeIds: [id] });
  return r.nodes[0];
}

// Cartouche texte qui s'adapte à son contenu (une seule ligne, padding symétrique).
export async function hug(frameId, { px, py, gap = 0 }) {
  await fw('set_auto_layout', { nodeId: frameId, layoutMode: 'HORIZONTAL', paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py, itemSpacing: gap, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId: frameId, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
}

// CTA bleu source : clone du vrai composant 5406:2442 (choisi par Louis), mis à l'échelle s.
// s = 1 : hauteur 94. Tous les boutons d'une illustration l'utilisent, sauf pour montrer un mauvais CTA.
const CTA_SRC = { id: '5406:2442', r: 23.5127, pad: 9.4051, gap: 15.6751, innerR: 15.6751, innerPx: 37.6203, innerPy: 15.6751, innerH: 75.2406, stroke: 1.5675, font: 25.0802 };
const scaleFx = (fx, s) => fx.map((f) => ({ ...f, visible: f.visible !== false, radius: (f.radius || 0) * s, spread: (f.spread || 0) * s, offset: { x: (f.offset?.x || 0) * s, y: (f.offset?.y || 0) * s } }));
export async function sourceCTA(parent, label, { x, y, s = 0.5, name = 'CTA source' }) {
  const { nodeId: outer } = await fw('clone_node', { nodeId: CTA_SRC.id });
  await fw('reparent_nodes', { nodeIds: [outer], newParentId: parent });
  const src = (await fw('get_node', { nodeId: outer })).node;
  const inner = src.children[0], txt = inner.children[0];
  await fw('set_text', { nodeId: txt.id, characters: label });
  await fw('set_text_properties', { nodeId: txt.id, fontSize: CTA_SRC.font * s });
  await fw('set_auto_layout', { nodeId: inner.id, layoutMode: 'HORIZONTAL', paddingLeft: CTA_SRC.innerPx * s, paddingRight: CTA_SRC.innerPx * s, paddingTop: CTA_SRC.innerPy * s, paddingBottom: CTA_SRC.innerPy * s, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId: inner.id, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  await fw('set_layout_props', { nodeId: inner.id, minHeight: CTA_SRC.innerH * s });
  await fw('set_corner_radius', { nodeId: inner.id, radius: CTA_SRC.innerR * s });
  await fw('set_strokes', { nodeId: inner.id, strokes: inner.strokes, strokeWeight: CTA_SRC.stroke * s, strokeAlign: 'OUTSIDE' });
  await fw('set_effects', { nodeId: inner.id, effects: scaleFx(inner.effects, s) });
  await fw('set_auto_layout', { nodeId: outer, layoutMode: 'HORIZONTAL', paddingLeft: CTA_SRC.pad * s, paddingRight: CTA_SRC.pad * s, paddingTop: CTA_SRC.pad * s, paddingBottom: CTA_SRC.pad * s, itemSpacing: CTA_SRC.gap * s });
  await fw('set_layout_props', { nodeId: outer, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  await fw('set_corner_radius', { nodeId: outer, radius: CTA_SRC.r * s });
  await fw('set_effects', { nodeId: outer, effects: scaleFx(src.effects, s) });
  await fw('set_position', { nodeId: outer, x, y });
  await fw('rename_node', { nodeId: outer, name });
  return outer;
}

// Tag d'illustration : clone du tag blanc 5406:6679 (pilule blanche, Inter Medium, ombre grise douce).
// Jamais de pastille bleue en dégradé dans une illustration. Petit (s ≈ 1) et au coin supérieur droit de l'élément qualifié.
export async function tag(parent, label, { x, y, s = 1.05, name = 'Tag' }) {
  const { nodeId } = await fw('clone_node', { nodeId: '5406:6679' });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: parent });
  const n = (await fw('get_node', { nodeId })).node;
  const t = n.children[0];
  await fw('set_text', { nodeId: t.id, characters: label });
  await fw('set_text_properties', { nodeId: t.id, fontSize: 9.7586 * s, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await fw('set_auto_layout', { nodeId, layoutMode: 'HORIZONTAL', paddingLeft: 14.57 * s, paddingRight: 14.57 * s, paddingTop: 7.4 * s, paddingBottom: 7.4 * s, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  await fw('set_strokes', { nodeId, strokes: n.strokes, strokeWeight: 0.789 * s });
  await fw('set_effects', { nodeId, effects: scaleFx(n.effects, s) });
  await fw('set_position', { nodeId, x, y });
  await fw('rename_node', { nodeId, name });
  return nodeId;
}

// Badges source : check vert 5406:2504, croix rouge 5406:2510 (clonés, jamais redessinés).
// size : diamètre visé, proportionné à l'objet jugé (≈ 12-15 % de la largeur de la carte, 26-32 px en général).
// Le groupe ne se redimensionne pas proprement (traits non mis à l'échelle) : on met à l'échelle chaque calque.
export async function badge(parent, kind, { x, y, rot, size = 30 }) {
  const src = kind === 'check' ? '5406:2504' : '5406:2510';
  const { nodeId } = await fw('clone_node', { nodeId: src });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: parent });
  const root = (await fw('get_node', { nodeId })).node;
  let disc = root; while (disc.type !== 'FRAME') disc = disc.children[0];
  const k = size / disc.width;
  const walk = async (n) => {
    for (const c of n.children || []) {
      if (c.type === 'VECTOR') {
        await fw('resize_nodes', { nodeIds: [c.id], width: Math.max(c.width * k, 0.01), height: Math.max(c.height * k, 0.01) });
        await fw('set_position', { nodeId: c.id, x: c.x * k, y: c.y * k });
        if (c.strokeWeight) await fw('set_strokes', { nodeId: c.id, strokes: c.strokes, strokeWeight: c.strokeWeight * k });
      }
      await walk(c);
    }
  };
  await walk(disc);
  await fw('resize_nodes', { nodeIds: [disc.id], width: disc.width * k, height: disc.height * k });
  await fw('set_corner_radius', { nodeId: disc.id, radius: (disc.cornerRadius || 0) * k });
  await fw('set_effects', { nodeId: disc.id, effects: scaleFx(disc.effects || [], k) });
  if (rot != null) await fw('rotate_nodes', { nodeIds: [nodeId], rotation: rot });
  await fw('set_position', { nodeId, x, y });
  return nodeId;
}

// Main source (pointeur cartoon, contour noir épais) : clonée depuis la couverture.
export async function hand(parent, srcId, { x, y }) {
  const { nodeId } = await fw('clone_node', { nodeId: srcId });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: parent });
  await fw('set_position', { nodeId, x, y });
  return nodeId;
}

// Flèche d'explication construite de A à B (courbe quadratique, pointe sur la tangente finale).
export async function arrow(parent, A, B, { bend = 0.35, width = 6, color = '#0147FF', head = 13, name = 'Flèche A→B' } = {}) {
  const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
  const dx = B.x - A.x, dy = B.y - A.y;
  const Cx = mx - dy * bend, Cy = my + dx * bend;
  const tx = B.x - Cx, ty = B.y - Cy, tl = Math.hypot(tx, ty);
  const ux = tx / tl, uy = ty / tl;
  const ang = Math.PI / 6;
  const h1 = { x: B.x - head * (ux * Math.cos(ang) - uy * Math.sin(ang)), y: B.y - head * (uy * Math.cos(ang) + ux * Math.sin(ang)) };
  const h2 = { x: B.x - head * (ux * Math.cos(-ang) - uy * Math.sin(-ang)), y: B.y - head * (uy * Math.cos(-ang) + ux * Math.sin(-ang)) };
  const pad = width + head;
  const xs = [A.x, B.x, Cx, h1.x, h2.x], ys = [A.y, B.y, Cy, h1.y, h2.y];
  const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad;
  const W = Math.max(...xs) + pad - minX, H = Math.max(...ys) + pad - minY;
  const f = (p) => `${(p.x - minX).toFixed(1)} ${(p.y - minY).toFixed(1)}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W.toFixed(1)}" height="${H.toFixed(1)}" viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}">
<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${(A.x - minX).toFixed(1)}" y1="${(A.y - minY).toFixed(1)}" x2="${(B.x - minX).toFixed(1)}" y2="${(B.y - minY).toFixed(1)}"><stop offset="0" stop-color="${color}" stop-opacity="0.15"/><stop offset="0.55" stop-color="${color}" stop-opacity="0.85"/><stop offset="1" stop-color="${color}"/></linearGradient></defs>
<path d="M ${f(A)} Q ${f({ x: Cx, y: Cy })} ${f(B)}" fill="none" stroke="url(#g)" stroke-width="${width}" stroke-linecap="round"/>
<path d="M ${f(h1)} L ${f(B)} L ${f(h2)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  const { nodeId } = await fw('import_svg', { svg, parentId: parent, x: minX, y: minY, name });
  return nodeId;
}

// Cadre de sélection bleu : dépasse l'objet, poignées carrées légèrement arrondies.
// Réservé aux couvertures, pour évoquer l'édition d'une page. Jamais au milieu d'une explication.
export async function selection(parent, { x, y, w, h, m = 8, hs = 11 }) {
  const ids = [];
  ids.push(await rect(parent, { x: x - m, y: y - m, w: w + 2 * m, h: h + 2 * m, fill: null, stroke: { color: C.blue }, strokeW: 2.4, name: 'Sélection' }));
  for (const [cx, cy] of [[x - m, y - m], [x + w + m, y - m], [x - m, y + h + m], [x + w + m, y + h + m]])
    ids.push(await rect(parent, { x: cx - hs / 2, y: cy - hs / 2, w: hs, h: hs, r: 2.5, fill: C.white, stroke: { color: C.blue }, strokeW: 2.2, name: 'Poignée' }));
  return ids;
}
